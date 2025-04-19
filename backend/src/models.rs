// backend/src/models.rs
use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use chrono::{DateTime, Utc};
use uuid::Uuid;

#[derive(FromRow, Serialize, Debug)]
pub struct User {
    pub id: i32,
    pub email: String,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(FromRow, Serialize, Debug)]
pub struct ApiKey {
    pub id: i32,
    pub user_id: Option<i32>, // Optional ถ้า Key ไม่ได้ผูกกับ User ใน V1
    pub key_string: Uuid, // ใช้ UUID เป็น API Key String
    pub status: String, // "active", "inactive"
    pub created_at: DateTime<Utc>,
    pub expires_at: Option<DateTime<Utc>>,
    pub allowed_calls: Option<i32>,
    pub calls_made: i32,
}

#[derive(FromRow, Serialize, Debug)]
pub struct UsageLog {
    pub id: i32,
    pub api_key_id: Option<i32>,
    pub endpoint_path: String,
    pub request_time: DateTime<Utc>,
    status_code: i32, 
    ip_address: Option<String>, 
}

#[derive(FromRow, Serialize, Debug)]
pub struct Transaction {
    pub id: i32,
    pub user_id: Option<i32>,
    pub amount: sqlx::types::BigDecimal,
    pub currency: String,
    pub status: String,
    pub payment_gateway_ref_id: Option<String>,
    pub created_at: DateTime<Utc>,
}