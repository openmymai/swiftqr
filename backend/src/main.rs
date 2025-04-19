use actix_web::{web, App, HttpServer, HttpResponse};
use sqlx::PgPool;
use dotenv::dotenv;
use std::env;

mod models;
mod handlers;
mod qr_generator;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv().ok();

    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");
    let backend_port: u16 = env::var("BACKEND_PORT")
        .unwrap_or_else(|_| "8000".to_string())
        .parse()
        .expect("BACKEND_PORT must be a number");

    let pool = PgPool::connect(&database_url)
        .await
        .expect("Failed to create pool.");

    let pool_data = web::Data::new(pool.clone());

    println!("🚀 Server started successfully on port {}", backend_port);

    HttpServer::new(move || {
        App::new()
            .app_data(pool_data.clone())
            // API Endpoint หลัก
            .service(web::resource("/api/generate_qr").route(web::post().to(handlers::generate_qr)))
            // **ใหม่:** API Endpoint สำหรับสร้าง Stripe Checkout Session
            .service(web::resource("/api/create-checkout-session").route(web::post().to(handlers::create_checkout_session)))
            // Admin Endpoint (จำกัดการเข้าถึงใน Nginx)
            .service(web::resource("/api/admin/create_api_key").route(web::post().to(handlers::create_api_key_handler)))
            // Health Check
            .route("/health", web::get().to(|| async { HttpResponse::Ok().json("OK") }))
    })
    .bind(("0.0.0.0", backend_port))?
    .run()
    .await
}