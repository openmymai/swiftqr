use actix_web::{web, HttpResponse, HttpRequest, Result as ActixResult};
use chrono::Utc;
use sqlx::PgPool;
use uuid::Uuid;
use std::str::FromStr;
use reqwest::Url;
use std::env;

use serde_json::json;
use async_stripe::Client;
use async_stripe::api::checkout::sessions::{
    CreateCheckoutSession,
    CheckoutSessionMode,
    CreateCheckoutSessionLineItems,
    CreateCheckoutSessionLineItemsPriceData,
    CreateCheckoutSessionLineItemsPriceDataProductData,
};
use async_stripe::config::Currency;

use crate::models::{GenerateQrPayload, ApiKey};
use crate::qr_generator::{generate_qr_code, QrGenError};

pub async fn generate_qr(
    req: HttpRequest,
    pool: web::Data<PgPool>,
    payload: web::Json<GenerateQrPayload>,
) -> Result<HttpResponse, actix_web::Error> {
     let db_pool = pool.get_ref();

     let auth_header = req.headers().get("Authorization")
          .ok_or_else(|| actix_web::error::ErrorUnauthorized("Authorization header missing"))?
          .to_str()
          .map_err(|_| actix_web::error::ErrorUnauthorized("Invalid Authorization header"))?;

     if !auth_header.starts_with("Bearer ") {
         return Err(actix_web::error::ErrorUnauthorized("Invalid Authorization header format"));
     }

     let api_key_string = auth_header["Bearer ".len()..].trim();
     let api_key_uuid = Uuid::from_str(api_key_string)
          .map_err(|_| actix_web::error::ErrorUnauthorized("Invalid API Key format (must be UUID)"))?;

     let api_key = sqlx::query_as::<_, ApiKey>("SELECT * FROM api_keys WHERE key_string = $1 AND status = 'active'")
         .bind(api_key_uuid)
         .fetch_optional(db_pool)
         .await
         .map_err(|e| {
             eprintln!("Database error fetching API Key: {:?}", e);
             actix_web::error::ErrorInternalServerError("Database error")
         })?;

     let api_key = api_key.ok_or_else(|| actix_web::error::ErrorUnauthorized("Invalid or inactive API Key"))?;

     if let Some(allowed_calls) = api_key.allowed_calls {
         if api_key.calls_made >= allowed_calls {
             return Err(actix_web::error::ErrorForbidden("API Key usage limit reached"));
         }
     }

    
     let ip_address = req.peer_addr().map(|addr| addr.ip().to_string());

     sqlx::query!("INSERT INTO usage_logs (api_key_id, endpoint_path, request_time, status_code, ip_address) VALUES ($1, $2, $3, $4, $5)",
          api_key.id,
          req.uri().path(),
          Utc::now(),
          200,
          ip_address
         )
         .execute(db_pool)
         .await
         .map_err(|e| {
             eprintln!("Database error logging usage: {:?}", e);
         })
         .ok();

     let logo_url = payload.logo_url.as_deref();
     if let Some(url_str) = logo_url {
          Url::parse(url_str).map_err(|_| actix_web::error::ErrorBadRequest("Invalid logo_url format"))?;
     }

     let color_hex = payload.color.as_deref();
     if let Some(hex) = color_hex {
         let hex = hex.trim_start_matches('#');
         if hex.len() != 6 || u32::from_str_radix(hex, 16).is_err() {
              return Err(actix_web::error::ErrorBadRequest("Invalid color format (must be 6-digit hex)"));
         }
     }

     match generate_qr_code(&payload.text, logo_url, color_hex).await {
         Ok(image_bytes) => {
              if api_key.allowed_calls.is_some() {
                   sqlx::query!("UPDATE api_keys SET calls_made = calls_made + 1 WHERE id = $1", api_key.id)
                       .execute(db_pool)
                       .await
                       .map_err(|e| {
                            eprintln!("Database error updating calls_made: {:?}", e);
                            actix_web::error::ErrorInternalServerError("Failed to update usage count")
                       })?;
              }

             
             Ok(HttpResponse::Ok()
                 .content_type("image/png")
                 .body(image_bytes))
         }
         Err(e) => {
             eprintln!("QR Code generation error: {:?}", e);
             let error_response = match e {
                 QrGenError::InvalidColor => actix_web::error::ErrorBadRequest("Invalid color value"),
                 QrGenError::LogoFetchError(msg) => actix_web::error::ErrorBadRequest(format!("Failed to fetch logo: {}", msg)),
                 QrGenError::LogoDecodeError(msg) => actix_web::error::ErrorBadRequest(format!("Failed to decode logo image: {}", msg)),
                  QrGenError::QrError(_) | QrGenError::ImageError(_) | QrGenError::ReqwestError(_) | QrGenError::LogoOverlayError(_) =>
                      actix_web::error::ErrorInternalServerError("Failed to generate QR code due to processing error"),
             };
             Err(error_response)
         }
     }
}

pub async fn create_api_key_handler(
    pool: web::Data<PgPool>,
) -> Result<HttpResponse, actix_web::Error> {
    // ... code เดิม ...
     let db_pool = pool.get_ref();
     let new_key_uuid = Uuid::new_v4();
     let user_id_for_key = 1;
     let allowed_calls = 100;

     let created_key = sqlx::query_as::<_, ApiKey>("INSERT INTO api_keys (user_id, key_string, status, allowed_calls) VALUES ($1, $2, $3, $4) RETURNING *")
         .bind(user_id_for_key)
         .bind(new_key_uuid)
         .bind("active")
         .bind(allowed_calls)
         .fetch_one(db_pool)
         .await
         .map_err(|e| {
             eprintln!("Database error creating API Key: {:?}", e);
             actix_web::error::ErrorInternalServerError("Failed to create API Key")
         })?;

     Ok(HttpResponse::Ok().json(created_key))
}

#[derive(serde::Deserialize)]
struct CreateCheckoutPayload {
    item: String,
    quantity: u32,
}

pub async fn create_checkout_session(
) -> ActixResult<HttpResponse, actix_web::Error> {

    let secret_key = env::var("STRIPE_SECRET_KEY").expect("STRIPE_SECRET_KEY must be set");
    let client = Client::new(secret_key);

    let domain_url = "https://swiftqr.win"; 
    let success_url = format!("{}/payment-success", domain_url);
    let cancel_url = format!("{}/payment-cancel", domain_url);

    let price_amount_cents = 500; // **ตัวอย่าง: $5.00 USD**
    let currency = Currency::USD; // **ตัวอย่าง: USD**

    let line_items = vec![
        CreateCheckoutSessionLineItems {
            price_data: Some(CreateCheckoutSessionLineItemsPriceData {
                currency,
                product_data: Some(CreateCheckoutSessionLineItemsPriceDataProductData {
                    name: "SwiftQR API - 100 Calls Batch".to_string(),
                    description: Some("Get 100 API calls for generating QR codes.".to_string()),
                    ..Default::default()
                }),
                unit_amount: Some(price_amount_cents), // ราคาต่อหน่วย (Cent)
                ..Default::default()
            }),
            quantity: Some(1),
            ..Default::default()
        }
    ];

    let params = CreateCheckoutSession {
        success_url: success_url.clone(),
        cancel_url: cancel_url.clone(),
        line_items: Some(line_items),
        mode: Some(CheckoutSessionMode::Payment),
        ..Default::default() 
    };

    match CheckoutSession::create(&client, params).await { 
        Ok(session) => {
            if let Some(url) = session.url {
                Ok(HttpResponse::Ok().json(json!({ "url": url })))
            } else {
                eprintln!("Stripe Checkout Session created but URL is missing.");
                Err(actix_web::error::ErrorInternalServerError("Failed to get checkout session URL"))
            }
        }
        Err(e) => {
            eprintln!("Stripe API error creating checkout session: {:?}", e);
            Err(actix_web::error::ErrorInternalServerError(format!("Failed to create checkout session: {}", e)))
        }
    }
}