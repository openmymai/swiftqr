// frontend/src/components/Footer.tsx
import { A } from '@solidjs/router';

function Footer() {
  return (
    <footer
      id='footer'
      class='footer position-relative light-background'
    >
      <div class='container footer-top'>
        <div class='row gy-4'>
          <div class='col-lg-5 col-md-12 footer-about'>
            <A
              href='/'
              class='logo d-flex align-items-center'
            >
              <span class='sitename'>SwiftQR API</span>{' '}
              {/* เปลี่ยนชื่อ Brand */}
            </A>
            <p>
              Instantly generate high-quality QR codes with logo and custom
              colors via a simple API.
            </p>{' '}
            {/* คำอธิบาย */}
            {/* Social Links - ปรับ Link หรือลบออก */}
            <div class='social-links d-flex mt-4'>
              <a
                href='#'
                target='_blank'
              >
                <i class='bi bi-twitter-x'></i>
              </a>
              <a
                href='#'
                target='_blank'
              >
                <i class='bi bi-facebook'></i>
              </a>
              <a
                href='#'
                target='_blank'
              >
                <i class='bi bi-instagram'></i>
              </a>
              <a
                href='#'
                target='_blank'
              >
                <i class='bi bi-linkedin'></i>
              </a>
            </div>
          </div>

          {/* Useful Links - ปรับ Link หรือลบออก */}
          <div class='col-lg-2 col-6 footer-links'>
            <h4>Useful Links</h4>
            <ul>
              <li>
                <A href='/'>Home</A>
              </li>
              {/* <li><A href="/#about">About us</A></li> */}
              {/* <li><A href="/#services">Services</A></li> */}
              <li>
                <A href='/docs'>Documentation</A>
              </li>{' '}
              {/* เพิ่ม Link Docs */}
              {/* <li><A href="#">Terms of Service</A></li> */}{' '}
              {/* สร้างหน้า Term/Privacy ในอนาคต */}
              {/* <li><A href="#">Privacy Policy</A></li> */}
            </ul>
          </div>

          {/* Our Services - ปรับเนื้อหา หรือลบออก เพราะบริการหลักคือ API */}
          <div class='col-lg-2 col-6 footer-links'>
            <h4>Our API Features</h4> {/* เปลี่ยนหัวข้อ */}
            <ul>
              <li>
                <A href='/docs#generation'>QR Code Generation</A>
              </li>
              <li>
                <A href='/docs#logo-overlay'>Logo Overlay</A>
              </li>
              <li>
                <A href='/docs#custom-color'>Custom Color</A>
              </li>
              {/* <li><A href="#">More Features (Soon)</A></li> */}
            </ul>
          </div>

          {/* Contact Us - ปรับข้อมูลติดต่อ หรือลบออก ถ้าไม่ต้องการให้ติดต่อตรง */}
          <div class='col-lg-3 col-md-12 footer-contact text-center text-md-start'>
            <h4>Contact Us</h4>
            <p>A108 Adam Street</p> {/* แทนที่ด้วยที่อยู่จริง หรือลบออก */}
            <p>New York, NY 535022</p>
            <p>United States</p>
            <p class='mt-4'>
              <strong>Phone:</strong> <span>+1 5589 55488 55</span>
            </p>{' '}
            {/* แทนที่ */}
            <p>
              <strong>Email:</strong> <span>info@example.com</span>
            </p>{' '}
            {/* แทนที่ */}
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div class='container copyright text-center mt-4'>
        <p>
          © <span>Copyright</span> <strong class='sitename'>SwiftQR API</strong>{' '}
          <span>All Rights Reserved</span>
        </p>{' '}
        {/* เปลี่ยนชื่อ Brand */}
        <div class='credits'>
          {/* **สำคัญ:** ลบหรือแก้ไข Link ไป BootstrapMade ตาม License ของ Template ครับ */}
          {/* ถ้าคุณใช้ Free Version และต้องการใช้ใน Commercial Project อาจจะต้องซื้อ License หรือปฏิบัติตามเงื่อนไขอย่างเคร่งครัด */}
          Designed by{' '}
          <a
            href='https://bootstrapmade.com/'
            target='_blank'
          >
            BootstrapMade
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
