// backend/src/middleware.rs
use actix_web::{
    dev::{ServiceRequest, ServiceResponse, Service},
    Error, HttpMessage, FromRequest, HttpRequest, Result as ActixResult,
    web::Data
};
use futures::future::{ok, Ready};
use sqlx::PgPool;
use uuid::Uuid;
use std::future::{ready, Ready};

use crate::models::{ApiKey, UsageLog}; // นำเข้า ApiKey และ UsageLog model

// Custom Extractor สำหรับ API Key Authentication
pub struct AuthenticatedApiKey(pub ApiKey); // จะเก็บ ApiKey struct ไว้ใน Extractor

// Implement FromRequest trait
impl FromRequest for AuthenticatedApiKey {
    type Error = Error; // ใช้ Actix Error type
    type Future = Ready<ActixResult<Self, Self::Error>>;

    fn from_request(req: &HttpRequest, _payload: &mut dev::Payload) -> Self::Future {
        let pool = match req.app_data::<Data<PgPool>>() {
            Some(pool) => pool.get_ref().clone(),
            None => {
                // ถ้าไม่มี Pool ใน app_data ถือว่า Configuration ผิดพลาด
                eprintln!("Database pool not found in app_data!");
                return ready(Err(actix_web::error::ErrorInternalServerError("Database pool not configured")));
            }
        };

        // ดึงค่า "Authorization: Bearer <api_key>" จาก Header
        let auth_header = match req.headers().get("Authorization") {
            Some(header_value) => match header_value.to_str() {
                Ok(s) => s.to_string(),
                Err(_) => return ready(Err(actix_web::error::ErrorUnauthorized("Invalid Authorization header"))),
            },
            None => return ready(Err(actix_web::error::ErrorUnauthorized("Authorization header missing"))),
        };

        if !auth_header.starts_with("Bearer ") {
            return ready(Err(actix_web::error::ErrorUnauthorized("Invalid Authorization header format")));
        }

        let api_key_string = auth_header["Bearer ".len()..].trim();
        let api_key_uuid = match Uuid::parse_str(api_key_string) {
             Ok(uuid) => uuid,
             Err(_) => return ready(Err(actix_web::error::ErrorUnauthorized("Invalid API Key format (must be UUID)"))),
        };

        // Query Database เพื่อตรวจสอบ API Key
        // Note: This is blocking in a non-async context, needs to be async.
        // We need to run this async operation inside the sync FromRequest trait.
        // Using actix_web::rt::spawn or similar for async operations in sync contexts is tricky.
        // A common pattern is to use `web::block` or refactor the endpoint to handle async checks directly.
        // For simplicity in V1 Extractor, let's assume a synchronous check (not ideal for production)
        // OR better: perform the check and logging *within the handler function* after getting the pool.

        // *** REVISED V1 APPROACH: Perform API Key Check and Logging IN THE HANDLER FUNCTION ***
        // This simplifies the Extractor. Extractor will just get the key string.
        // Let's change this middleware.rs to contain helper functions instead of an Extractor.
        // We will put auth logic directly in the handler for V1.

        // Alternative Simple Extractor (just gets the key string):
        // pub struct ApiKeyString(pub String);
        // impl FromRequest for ApiKeyString { ... parse header ... }
        // Then in the handler, you'd get ApiKeyString and the Pool separately.

        // Let's stick to putting auth/logging in the handler for V1 simplicity.
        // So, middleware.rs file might not be needed for V1.
        // We'll implement check_api_key_and_log_usage function directly in handlers.rs
        ready(Err(actix_web::error::ErrorInternalServerError("Middleware not implemented yet in V1 approach"))) // Placeholder
    }
}

// *** REVISED V1 Approach: Implement auth check & logging directly in handler ***
// This avoids complex async issues in the FromRequest trait for MVP.