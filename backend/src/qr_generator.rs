use image::{ImageOutputFormat, ImageError, DynamicImage, Rgba, ImageBuffer}; // เอา Pixel ออก
use qrcode::QrCode;
use qrcode::types::QrError;
use qrcode::types::Color;
use reqwest::Url;
use std::io::Cursor;

#[derive(Debug)]
#[allow(dead_code)]
pub enum QrGenError {
    QrError(QrError),
    ImageError(ImageError),
    ReqwestError(reqwest::Error),
    InvalidColor,
    LogoFetchError(String), // Error fetching logo
    LogoDecodeError(String), // Error decoding logo
    LogoOverlayError(String), // Error during overlay
}

impl From<QrError> for QrGenError {
    fn from(err: QrError) -> Self {
        QrGenError::QrError(err)
    }
}

impl From<ImageError> for QrGenError {
    fn from(err: ImageError) -> Self {
        QrGenError::ImageError(err)
    }
}

impl From<reqwest::Error> for QrGenError {
    fn from(err: reqwest::Error) -> Self {
        QrGenError::ReqwestError(err)
    }
}

// Function หลักในการ Generate QR Code
// รับ text, logo_url (Optional), color_hex (Optional), และ return Vector ของ Bytes (PNG format)
pub async fn generate_qr_code(
    text: &str,
    logo_url: Option<&str>,
    color_hex: Option<&str>,
) -> Result<Vec<u8>, QrGenError> {
    // 1. สร้าง QR Code Object
    let code = QrCode::new(text)?;

    let colors: Vec<Color> = code.to_colors();
    let dimension = code.width() as u32; // ขนาดของ QR code (ไม่รวม quiet zone)
    let quiet_zone_size = 4; // กำหนดขนาด Quiet Zone ที่ต้องการ (เช่น 4 modules)
    let final_dimension = dimension + 2 * quiet_zone_size;

    // **แก้ไข:** Render เป็น Luma<u8>
    // let qr_image_luma: ImageBuffer<Luma<u8>, Vec<u8>> = code.render::<Luma<u8>>()
    //     // **แก้ไข:** quiet_zone อาจจะต้องใช้กับ Renderer ก่อน to_image()
    //     // หรืออาจจะต้องสร้าง Padding เองทีหลัง
    //     // ลองเอา quiet_zone ออกไปก่อนสำหรับ V1
    //     // .quiet_zone(1) // เอาออกก่อน
    //     .build(); // ใช้ build() แทน to_image() สำหรับ Renderer

    // // 2. แปลง Luma Image เป็น Rgba Image เพื่อใส่สี/Logo
    // let (width, height) = qr_image_luma.dimensions();
    // let mut image_rgba = ImageBuffer::<Rgba<u8>, Vec<u8>>::new(width, height);

    // สร้าง ImageBuffer Rgba
    let mut image_rgba = ImageBuffer::<Rgba<u8>, Vec<u8>>::new(final_dimension, final_dimension);

    // กำหนดสี QR Code (ถ้ามี)
    let qr_color = if let Some(hex) = color_hex {
        // ... (Logic Parse Hex Color เหมือนเดิม) ...
         let hex = hex.trim_start_matches('#');
         if hex.len() == 6 {
             let r = u8::from_str_radix(&hex[0..2], 16).map_err(|_| QrGenError::InvalidColor)?;
             let g = u8::from_str_radix(&hex[2..4], 16).map_err(|_| QrGenError::InvalidColor)?;
             let b = u8::from_str_radix(&hex[4..6], 16).map_err(|_| QrGenError::InvalidColor)?;
             Rgba([r, g, b, 255])
         } else {
              return Err(QrGenError::InvalidColor);
         }
    } else {
        Rgba([0, 0, 0, 255]) // Default สีดำ
    };
    let background_color = Rgba([255, 255, 255, 255]); // สีขาว

    // Copy pixel จาก Luma ไป Rgba พร้อมเปลี่ยนสี
    for y in 0..final_dimension {
        for x in 0..final_dimension {
            // ตรวจสอบว่าเป็นส่วน Quiet Zone หรือไม่
            let is_quiet_zone = x < quiet_zone_size || x >= dimension + quiet_zone_size ||
                                y < quiet_zone_size || y >= dimension + quiet_zone_size;

            if is_quiet_zone {
                image_rgba.put_pixel(x, y, background_color);
            } else {
                // คำนวณ Index ใน `pixels` vector
                let qr_x = x - quiet_zone_size;
                let qr_y = y - quiet_zone_size;
                let index = (qr_y * dimension + qr_x) as usize;
                let qr_color_enum = colors.get(index).copied().unwrap_or(Color::Light);
                let is_dark = qr_color_enum == Color::Dark;

                let pixel_color = if is_dark { qr_color } else { background_color };
                image_rgba.put_pixel(x, y, pixel_color);
            }
        }
    }



    // 3. Overlay Logo (ถ้ามี) - Logic เดิมใช้กับ image_rgba ได้
    if let Some(url) = logo_url {
        let logo_image = fetch_and_decode_image(url).await?;
        let qr_dim = image_rgba.width(); // ใช้ final_dimension
        // ... (Logic คำนวณขนาดและตำแหน่ง Logo เหมือนเดิม) ...
         let logo_size = (qr_dim as f32 * 0.25) as u32; // ปรับ % ตามต้องการ
         let logo_resized = image::imageops::resize(&logo_image, logo_size, logo_size, image::imageops::FilterType::Lanczos3);
         let x = (qr_dim / 2).checked_sub(logo_resized.width() / 2).ok_or(QrGenError::LogoOverlayError("X position calc error".into()))?;
         let y = (qr_dim / 2).checked_sub(logo_resized.height() / 2).ok_or(QrGenError::LogoOverlayError("Y position calc error".into()))?;

        // วาง Logo บน QR Code (image_rgba)
        image::imageops::overlay(&mut image_rgba, &logo_resized, x as i64, y as i64);
    }

    // 4. Encode ภาพ Rgba เป็น PNG Bytes
    let mut buffer = Cursor::new(Vec::new());
    image_rgba.write_to(&mut buffer, ImageOutputFormat::Png)?;

    Ok(buffer.into_inner())
}

// Function Helper fetch_and_decode_image (เหมือนเดิม)
// ... code เดิม ...
async fn fetch_and_decode_image(url: &str) -> Result<DynamicImage, QrGenError> {
    let parsed_url = Url::parse(url).map_err(|e| QrGenError::LogoFetchError(format!("Invalid URL: {}", e)))?;
    let response = reqwest::get(parsed_url).await?;

    if !response.status().is_success() {
        return Err(QrGenError::LogoFetchError(format!("Failed to fetch logo: HTTP status {}", response.status())));
    }

    let bytes = response.bytes().await?;
    let img = image::load_from_memory(&bytes).map_err(|e| QrGenError::LogoDecodeError(format!("Failed to decode logo image: {}", e)))?;

    Ok(img)
}