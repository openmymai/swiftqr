// swiftqr_api/frontend/src/routes/index.tsx
import { Title } from '@solidjs/meta';
import { A } from '@solidjs/router';

// **แก้ไข:** ลบ function triggerStripeCheckout ออกไป
// async function triggerStripeCheckout() { ... }

// ตัวแปร String สำหรับเก็บ Code Example (เหมือนเดิม)
const curlExampleGen = `...`;
const curlExampleLogo = `...`;
const curlExampleColor = `...`;

// **ใหม่:** Placeholder สำหรับ Stripe Payment Link URL
const STRIPE_PAYMENT_LINK_URL = 'YOUR_STRIPE_PAYMENT_LINK_URL_HERE'; // **ต้องเปลี่ยนเป็น URL จริงที่คุณสร้างขึ้น**

function Home() {
  return (
    <>
      <Title>SwiftQR API - Generate QR Codes with Logo and Colors</Title>

      {/* Hero Section */}
      <section
        id='hero'
        class='hero section dark-background'
      >
        <img
          src='/hero-bg.jpg'
          alt=''
        />
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
              <div
                class='sign-up-form'
                style={{ 'box-shadow': 'none', background: 'none', padding: 0 }}
              >
                <p style={{ color: 'white', 'font-size': '1.2em' }}>
                  Ready to integrate? Get your API Key now!
                </p>
                <A
                  href='/docs'
                  class='btn btn-primary'
                  style={{ padding: '10px 25px', 'font-size': '1em' }}
                >
                  View Documentation
                </A>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section อธิบาย Features */}
      <section
        id='features'
        class='features section'
      >
        <div class='container section-title'>
          <h2>API Features</h2>
          <p>
            Our simple API provides the core functionality you need for branded
            QR codes.
          </p>
        </div>

        <div class='container'>
          {/* Features Item 1: QR Code Generation */}
          <div class='row gy-4 align-items-center features-item'>
            <div class='col-lg-5 order-2 order-lg-1'>
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
              </A>
            </div>
            <div class='col-lg-7 order-1 order-lg-2 d-flex align-items-center'>
              <div
                style={{
                  'background-color': '#eee',
                  padding: '20px',
                  'border-radius': '8px',
                  width: '100%',
                }}
              >
                <pre>
                  <code class='language-bash'>{curlExampleGen}</code>
                </pre>
              </div>
            </div>
          </div>

          {/* Features Item 2: Logo Overlay */}
          <div class='row gy-4 align-items-stretch justify-content-between features-item '>
            <div class='col-lg-6 d-flex align-items-center features-img-bg'>
              <div
                style={{
                  'background-color': '#eee',
                  padding: '20px',
                  'border-radius': '8px',
                  width: '100%',
                }}
              >
                <pre>
                  <code class='language-bash'>{curlExampleLogo}</code>
                </pre>
              </div>
            </div>
            <div class='col-lg-5 d-flex justify-content-center flex-column'>
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
            <div class='col-lg-5 order-2 order-lg-1'>
              <h3>Custom QR Code Color</h3>
              <p>
                Match your QR code color to your brand guidelines. Specify the
                color using a 6-digit hexadecimal color code.
              </p>
              <A
                href='/docs#custom-color'
                class='btn btn-get-started'
              >
                Customize Color
              </A>
            </div>
            <div class='col-lg-7 order-1 order-lg-2 d-flex align-items-center'>
              <div
                style={{
                  'background-color': '#eee',
                  padding: '20px',
                  'border-radius': '8px',
                  width: '100%',
                }}
              >
                <pre>
                  <code class='language-bash'>{curlExampleColor}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section
        id='pricing'
        class='pricing section'
      >
        <div class='container section-title'>
          <h2>API Pricing</h2>
          <p>Simple, pay-as-you-go pricing. Get an API key instantly.</p>
        </div>

        <div
          class='container'
          data-aos='zoom-in'
          data-aos-delay='100'
        >
          <div class='row g-4 justify-content-center'>
            {/* Pricing Item */}
            <div class='col-lg-4'>
              <div class='pricing-item featured'>
                <h3>Get Started Batch</h3>
                <div class='icon'>
                  <i class='bi bi-box'></i>
                </div>
                {/* ราคา - **คุณต้องกำหนดราคาจริงๆ** */}
                <h4>
                  <sup>$</sup>X.XX<span> / batch</span>
                </h4>{' '}
                {/* เปลี่ยน X.XX เป็นราคาจริง */}
                <ul>
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
                  {/* **หมายเหตุ:** Manual ใน V1 */}
                </ul>
                <div class='text-center'>
                  {/* **แก้ไข:** ใช้ <A> Link ตรงไปยัง Stripe Payment Link URL */}
                  <A
                    href={STRIPE_PAYMENT_LINK_URL}
                    target='_blank'
                    class='buy-btn'
                  >
                    Buy Now
                  </A>{' '}
                  {/* ใช้ class จาก Template, target="_blank" เพื่อเปิดใน Tab ใหม่ */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Get Started Section */}
      <section
        id='get-started'
        class='section light-background'
      >
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
