// frontend/src/routes/index.tsx
import { Title } from '@solidjs/meta';
import { A } from '@solidjs/router';

// นำเข้า Components ที่อาจจะสร้างแยกย่อยในอนาคต
// import HeroSection from "../components/HeroSection";
// import FeaturesSection from "../components/FeaturesSection";
// import PricingSection from "../components/PricingSection";

// Function placeholder เพื่อ Trigger Stripe Checkout (เหมือนเดิม)
async function triggerStripeCheckout() {
  console.log('Triggering Stripe Checkout...');
  // TODO: Implement the fetch call to your backend to create checkout session
  try {
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ item: '100-calls-batch', quantity: 1 }), // ตัวอย่าง Payload
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Failed to create checkout session:', error);
      alert(
        `Failed to start payment process: ${error.message || 'Unknown error'}`
      );
      return;
    }

    const session = await response.json();
    if (session.url) {
      window.location.href = session.url; // Redirect to Stripe
    } else {
      console.error('Stripe session URL not received:', session);
      alert('Failed to get payment link from backend.');
    }
  } catch (error) {
    console.error('Error calling backend for checkout session:', error);
    alert('An error occurred during the payment process.');
  }
}

const curlExampleGen = `curl -X POST https://swiftqr.win/api/generate_qr \
                        -H "Authorization: Bearer YOUR_API_KEY" \
                        -H "Content-Type: application/json" \
                        -d '{ "text": "Hello, World!" }' \
                        --output qrcode.png`;
const curlExampleLogo = `curl -X POST https://swiftqr.win/api/generate_qr \
                        -H "Authorization: Bearer YOUR_API_KEY" \
                        -H "Content-Type: application/json" \
                        -d '{ "text": "https://swiftqr.win", "color": "#e84545" }' \
                        --output colored_qrcode.png`;
const curlExampleColor = `curl -X POST https://swiftqr.win/api/generate_qr \
                        -H "Authorization: Bearer YOUR_API_KEY" \
                        -H "Content-Type: application/json" \
                        -d '{ "text": "https://swiftqr.win", "logo_url": "https://swiftqr.win/logo.png" }' \
                        --output qrcode_with_logo.png `;

function Home() {
  return (
    <>
      <Title>SwiftQR API - Generate QR Codes with Logo and Colors</Title>{' '}
      {/* Title เฉพาะหน้านี้ */}
      {/* Hero Section (ดัดแปลงจาก HTML ตัวอย่าง) */}
      <section
        id='hero'
        class='hero section dark-background'
      >
        <img
          src='/hero-bg.jpg'
          alt=''
        />{' '}
        {/* Copy hero-bg.jpg to public/ */}
        <div class='container'>
          <div class='row'>
            <div class='col-lg-10'>
              <h2>SwiftQR API: Instant QR Codes with Your Brand</h2>
              <p>
                Generate high-quality QR codes with your logo and custom colors
                via a simple, fast, and reliable API.
              </p>
            </div>
            <div class='col-lg-5'>
              {' '}
              {/* ใช้ col-lg-5 ตาม Layout ตัวอย่าง แต่อาจลบ Form เก่าออก */}
              {/* ใน V1 เราจะไม่มี Newsletter Form แต่จะมี Call to Action ไปยัง Pricing หรือ Docs */}
              <div
                class='sign-up-form'
                style={{ 'box-shadow': 'none', background: 'none', padding: 0 }}
              >
                {' '}
                {/* อาจจะปรับ style เพื่อไม่ให้มีกรอบเหมือน Form เก่า */}
                <p style={{ color: 'white', 'font-size': '1.2em' }}>
                  Ready to integrate? Get your API Key now!
                </p>
                <A
                  href='/docs'
                  class='btn btn-primary'
                  style={{ padding: '10px 25px', 'font-size': '1em' }}
                >
                  View Documentation
                </A>{' '}
                {/* ใช้ class Bootstrap */}
                {/* หรือปุ่มไป Pricing Section */}
                {/* <A href="/#pricing" class="btn btn-primary" style={{"padding": "10px 25px", "font-size": "1em", "margin-left": "10px"}}>See Pricing</A> */}
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Section อธิบาย Features (ดัดแปลงจาก Services หรือ Features HTML) */}
      <section
        id='features'
        class='features section'
      >
        {' '}
        {/* ใช้ id/class จาก Template */}
        <div class='container section-title'>
          {' '}
          {/* ใช้ class จาก Template */}
          <h2>API Features</h2> {/* หัวข้อ */}
          <p>
            Our simple API provides the core functionality you need for branded
            QR codes.
          </p>
        </div>
        <div class='container'>
          {' '}
          {/* ใช้ class จาก Template */}
          {/* Features Item 1: QR Code Generation */}
          <div class='row gy-4 align-items-center features-item'>
            {' '}
            {/* ใช้ class จาก Template */}
            <div class='col-lg-5 order-2 order-lg-1'>
              {' '}
              {/* ใช้ class จาก Template */}
              <h3>Generate from Text or URL</h3>
              <p>
                Easily encode any text, URL, or other data into a scannable QR
                code image. Simple API call, instant result.
              </p>
              <A
                href='/docs#endpoint'
                class='btn btn-get-started'
              >
                View API Endpoint
              </A>{' '}
              {/* ใช้ class จาก Template */}
            </div>
            <div class='col-lg-7 order-1 order-lg-2 d-flex align-items-center'>
              {' '}
              {/* ใช้ class จาก Template */}
              {/* อาจจะใส่ภาพประกอบ */}
              {/* <img src="/path/to/qr-gen-example.png" class="img-fluid" alt="QR Code Generation Example"/> */}
              <div
                style={{
                  'background-color': '#eee',
                  padding: '20px',
                  'border-radius': '8px',
                }}
              >
                {' '}
                {/* ตัวอย่าง Code Block */}
                <pre>
                  <code>{curlExampleGen}</code>
                </pre>
              </div>
            </div>
          </div>
          {/* Features Item 2: Logo Overlay */}
          {/* ใช้ class จาก Template - อาจสลับ order เป็น order-1 order-lg-2 */}
          <div class='row gy-4 align-items-stretch justify-content-between features-item '>
            <div class='col-lg-6 d-flex align-items-center features-img-bg'>
              {' '}
              {/* ใช้ class จาก Template */}
              {/* อาจจะใส่ภาพประกอบ */}
              {/* <img src="/path/to/logo-overlay-example.png" class="img-fluid" alt="Logo Overlay Example"/> */}
              <div
                style={{
                  'background-color': '#eee',
                  padding: '20px',
                  'border-radius': '8px',
                }}
              >
                {' '}
                {/* ตัวอย่าง Code Block */}
                <pre>
                  <code>{curlExampleLogo}</code>
                </pre>
              </div>
            </div>
            <div class='col-lg-5 d-flex justify-content-center flex-column'>
              {' '}
              {/* ใช้ class จาก Template */}
              <h3>Overlay Your Brand Logo</h3>
              <p>
                Add your company logo to the center of the QR code to reinforce
                your brand identity. Simply provide a public URL to your logo
                image.
              </p>
              <A
                href='/docs#logo-overlay'
                class='btn btn-get-started align-self-start'
              >
                Learn About Logo Overlay
              </A>
            </div>
          </div>
          {/* Features Item 3: Custom Color */}
          <div class='row gy-4 align-items-center features-item'>
            {' '}
            {/* ใช้ class จาก Template */}
            <div class='col-lg-5 order-2 order-lg-1'>
              {' '}
              {/* ใช้ class จาก Template */}
              <h3>Custom QR Code Color</h3>
              <p>
                Match your QR code color to your brand guidelines. Specify the
                color using a hexadecimal color code.
              </p>
              <A
                href='/docs#custom-color'
                class='btn btn-get-started'
              >
                Customize Color
              </A>
            </div>
            <div class='col-lg-7 order-1 order-lg-2 d-flex align-items-center'>
              {' '}
              {/* ใช้ class จาก Template */}
              {/* อาจจะใส่ภาพประกอบ */}
              {/* <img src="/path/to/color-example.png" class="img-fluid" alt="Color Example"/> */}
              <div
                style={{
                  'background-color': '#eee',
                  padding: '20px',
                  'border-radius': '8px',
                }}
              >
                {' '}
                {/* ตัวอย่าง Code Block */}
                <pre>
                  <code>{curlExampleLogo}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Pricing Section (ดัดแปลงจาก Pricing HTML) */}
      <section
        id='pricing'
        class='pricing section'
      >
        {' '}
        {/* ใช้ id/class จาก Template */}
        <div class='container section-title'>
          {' '}
          {/* ใช้ class จาก Template */}
          <h2>API Pricing</h2> {/* หัวข้อ */}
          <p>Simple, pay-as-you-go pricing. Get an API key instantly.</p>
        </div>
        <div
          class='container'
          data-aos='zoom-in'
          data-aos-delay='100'
        >
          {' '}
          {/* ใช้ class จาก Template */}
          <div class='row g-4 justify-content-center'>
            {' '}
            {/* เพิ่ม justify-content-center ถ้ามี Plan เดียว */}
            {/* Pricing Item - เราจะทำ Plan เดียวสำหรับ MVP V1 */}
            <div class='col-lg-4'>
              {' '}
              {/* ใช้ class จาก Template */}
              <div class='pricing-item featured'>
                {' '}
                {/* อาจจะใช้ class featured เพื่อเน้น */}
                <h3>Get Started Batch</h3> {/* ชื่อ Plan */}
                <div class='icon'>
                  {' '}
                  {/* ใช้ class จาก Template */}
                  <i class='bi bi-box'></i> {/* ใช้ Bootstrap Icon */}
                </div>
                {/* ราคา - **คุณต้องกำหนดราคาจริงๆ** */}
                <h4>
                  <sup>$</sup>X.XX<span> / batch</span>
                </h4>{' '}
                {/* เปลี่ยน X.XX เป็นราคาจริง */}
                <ul>
                  {' '}
                  {/* Features Included */}
                  <li>
                    <i class='bi bi-check'></i>{' '}
                    <span>
                      <strong>100 API Calls</strong>
                    </span>
                  </li>{' '}
                  {/* จำนวน Calls */}
                  <li>
                    <i class='bi bi-check'></i>{' '}
                    <span>Generate QR Code from Text/URL</span>
                  </li>
                  <li>
                    <i class='bi bi-check'></i>{' '}
                    <span>Overlay Logo from URL</span>
                  </li>
                  <li>
                    <i class='bi bi-check'></i> <span>Custom Color Option</span>
                  </li>
                  <li>
                    <i class='bi bi-check'></i>{' '}
                    <span>Instant API Key delivery via email</span>
                  </li>{' '}
                  {/* **หมายเหตุ:** ใน V1 อาจจะยังไม่ Instant 100% */}
                  {/* ลบ Features ที่ไม่รวม หรือยังไม่ได้ทำใน V1 */}
                  {/* <li class="na"><i class="bi bi-x"></i> <span>Advanced Features</span></li> */}
                </ul>
                <div class='text-center'>
                  {/* ปุ่ม Buy Now - เชื่อมกับ Function Trigger Stripe Checkout */}
                  <button
                    onClick={() => triggerStripeCheckout()}
                    class='buy-btn'
                  >
                    Buy Now
                  </button>{' '}
                  {/* ใช้ class จาก Template */}
                </div>
              </div>
            </div>
            {/* End Pricing Item */}
            {/* ลบ Pricing Items อื่นๆ ออกไปสำหรับ V1 */}
            {/* <div class="col-lg-4">...</div> */}
            {/* <div class="col-lg-4">...</div> */}
          </div>
        </div>
      </section>
      {/* เพิ่ม Link ไป Docs ที่ Footer หรือหลังจาก Pricing ก็ได้ */}
      <section
        id='get-started'
        class='section light-background'
      >
        {' '}
        {/* ใช้ class จาก Template */}
        <div class='container text-center'>
          <h2>Ready to integrate SwiftQR API?</h2>
          <p>
            Get your API key in minutes and start generating branded QR codes
            today.
          </p>
          <A
            href='/docs'
            class='btn btn-get-started'
            style={{ 'margin-top': '20px' }}
          >
            View Documentation & Get API Key
          </A>
        </div>
      </section>
    </>
  );
}

export default Home;
