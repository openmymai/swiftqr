// frontend/src/routes/docs.tsx
import { Title } from '@solidjs/meta';
import { createSignal, onMount } from 'solid-js'; // onMount ถ้าใช้ JS Library ที่ต้อง Init ตอน Component Mount
import { A } from '@solidjs/router';

// นำเข้า Component สำหรับ API Test Form (ถ้าสร้างแยก) หรือใส่ Code ตรงนี้เลย
// import ApiTestForm from "../components/ApiTestForm";

function Docs() {
  // State สำหรับ API Test Form (เหมือนที่เราทำก่อนหน้านี้)
  const [apiKey, setApiKey] = createSignal('');
  const [qrText, setQrText] = createSignal('https://swiftqr.win');
  const [logoUrl, setLogoUrl] = createSignal('');
  const [colorHex, setColorHex] = createSignal('#000000');
  const [apiResponse, setApiResponse] = createSignal(null as any);
  const [isLoading, setIsLoading] = createSignal(false);
  const [error, setError] = createSignal('');

  const testApi = async () => {
    setIsLoading(true);
    setError('');
    setApiResponse(null);

    const apiUrl = '/api/generate_qr';
    const key = apiKey();
    const text = qrText();
    const logo = logoUrl();
    const color = colorHex();

    if (!key) {
      setError('Please enter your API Key.');
      setIsLoading(false);
      return;
    }
    if (!text) {
      setError('Please enter text or URL for the QR code.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${key}`,
        },
        body: JSON.stringify({
          text: text,
          logo_url: logo || undefined,
          color: color || undefined,
        }),
      });

      if (response.ok) {
        const imageBlob = await response.blob();
        const imageUrl = URL.createObjectURL(imageBlob);
        setApiResponse({ type: 'image', url: imageUrl });
      } else {
        const errorText = await response.text();
        console.error('API Error Response:', response.status, errorText);
        try {
          const errorJson = JSON.parse(errorText);
          setError(
            `API Error ${response.status}: ${
              errorJson.message || JSON.stringify(errorJson)
            }`
          );
          setApiResponse({
            type: 'error',
            status: response.status,
            body: errorJson,
          });
        } catch {
          setError(`API Error ${response.status}: ${errorText}`);
          setApiResponse({
            type: 'error',
            status: response.status,
            body: errorText,
          });
        }
      }
    } catch (err: any) {
      console.error('Network or Fetch Error:', err);
      setError(`Request failed: ${err.message || 'Unknown network error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  // onMount(() => {
  //    // Initialise any JS libraries here if needed, e.g., AOS.init()
  //    // For V1, we are not including these libraries, so this is commented out.
  // });
  const jsonRequestBodyExample = `{
                        "text": "string",       // Required: The text or URL to encode in the QR code.
                        "logo_url": "string",   // Optional: URL of a small PNG/JPG image to overlay as a logo.
                        "color": "string"       // Optional: Hex color code (e.g., "#000000" or "000000") for the QR code pixels.
                        }`;

  return (
    <>
      <Title>API Documentation - SwiftQR API</Title>
      {/* Section Title ตาม Template */}
      <div class='container section-title'>
        <h2>API Documentation</h2>
        <p>
          Comprehensive guide to integrating SwiftQR API into your application.
        </p>
      </div>
      <div class='container'>
        {' '}
        {/* ใช้ class container เพื่อจัด Layout */}
        <section
          id='quick-start'
          class='section'
          style={{ 'padding-top': 0, 'padding-bottom': '40px' }}
        >
          {' '}
          {/* ปรับ padding */}
          <h3>Quick Start</h3>
          <p>Follow these steps to get started:</p>
          <ol>
            <li>
              Purchase an API Key from our{' '}
              <A href='/#pricing'>Pricing section</A>.
            </li>
            <li>Receive your API Key via email.</li>{' '}
            {/* **หมายเหตุ:** Manual step ใน V1 */}
            <li>
              Use your API Key in the <code>Authorization</code> header of your
              requests.
            </li>
            <li>Start generating QR Codes!</li>
          </ol>
        </section>
        <section
          id='authentication'
          class='section'
          style={{ 'padding-top': 0, 'padding-bottom': '40px' }}
        >
          <h3>Authentication</h3>
          <p>
            Authenticate your requests by including your API Key in the{' '}
            <code>Authorization</code> header as a Bearer token:
          </p>
          <pre>
            <code>Authorization: Bearer YOUR_API_KEY</code>
          </pre>
          <p>
            Replace <code>YOUR_API_KEY</code> with the API Key you received
            after purchasing.
          </p>
        </section>
        <section
          id='endpoint'
          class='section'
          style={{ 'padding-top': 0, 'padding-bottom': '40px' }}
        >
          <h3>Generate QR Code Endpoint</h3>
          <p>
            To generate a QR code, send a <code>POST</code> request to:
          </p>
          <pre>
            <code>/api/generate_qr</code>
          </pre>

          <h4>Request Body</h4>
          <p>
            The request body should be a JSON object with the following fields:
          </p>
          <pre>
            <code class='language-json'>{jsonRequestBodyExample}</code>
          </pre>
          <p>
            <code>text</code>: The data you want the QR code to contain. This
            can be a URL, plain text, phone number, etc.
            <br />
            <code>logo_url</code>: (Optional) Provide a URL pointing to a small
            image file (PNG or JPG recommended). The API will attempt to fetch
            and overlay this image in the center. Recommended logo size is
            around 25% of the QR code size. Must be a publicly accessible URL.
            <br />
            <code>color</code>: (Optional) Specify the color of the QR code
            modules (the dark squares). Use a 6-digit hexadecimal color code,
            optionally prefixed with <code>#</code> (e.g.,{' '}
            <code>"#FF0000"</code> for red).
          </p>

          <h4>Response</h4>
          <p>
            If the request is successful (HTTP Status 200 OK), the response body
            will contain the binary image data of the generated QR code in PNG
            format.
          </p>
          <p>
            <code>Content-Type: image/png</code>
          </p>

          <h4>Error Responses</h4>
          <p>The API will return standard HTTP status codes for errors:</p>
          <ul>
            <li>
              <code>400 Bad Request</code>: Invalid input (e.g., missing
              required field, invalid color format, invalid logo URL format).
            </li>
            <li>
              <code>401 Unauthorized</code>: Missing or invalid{' '}
              <code>Authorization</code> header.
            </li>
            <li>
              <code>403 Forbidden</code>: Valid API Key, but usage limit
              reached.
            </li>
            <li>
              <code>500 Internal Server Error</code>: An unexpected error
              occurred on the server.
            </li>
          </ul>
          <p>
            Error responses will typically include a JSON body with an error
            message.
          </p>
        </section>
        <section
          id='api-test'
          class='section'
          style={{ 'padding-top': 0 }}
        >
          <h3>API Test (Client-side)</h3>
          <p>Test the API directly from your browser:</p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              testApi();
            }}
          >
            <div class='row gy-4'>
              {' '}
              {/* ใช้ class Bootstrap */}
              <div class='col-md-12'>
                <label
                  for='apiKey'
                  class='form-label'
                >
                  Your API Key:
                </label>{' '}
                {/* ใช้ class Bootstrap */}
                <input
                  id='apiKey'
                  type='text'
                  class='form-control'
                  value={apiKey()}
                  onInput={(e) => setApiKey(e.target.value)}
                  placeholder='Enter your API Key (UUID format)'
                  required
                />{' '}
                {/* ใช้ class Bootstrap */}
              </div>
              <div class='col-md-12'>
                <label
                  for='qrText'
                  class='form-label'
                >
                  Text or URL:
                </label>{' '}
                {/* ใช้ class Bootstrap */}
                <input
                  id='qrText'
                  type='text'
                  class='form-control'
                  value={qrText()}
                  onInput={(e) => setQrText(e.target.value)}
                  placeholder='e.g., https://yourwebsite.com'
                  required
                />{' '}
                {/* ใช้ class Bootstrap */}
              </div>
              <div class='col-md-12'>
                <label
                  for='logoUrl'
                  class='form-label'
                >
                  Logo Image URL (Optional):
                </label>{' '}
                {/* ใช้ class Bootstrap */}
                <input
                  id='logoUrl'
                  type='text'
                  class='form-control'
                  value={logoUrl()}
                  onInput={(e) => setLogoUrl(e.target.value)}
                  placeholder='e.g., https://yoursite.com/logo.png'
                />{' '}
                {/* ใช้ class Bootstrap */}
              </div>
              <div class='col-md-12'>
                <label
                  for='colorHex'
                  class='form-label'
                >
                  QR Color (Optional, Hex):
                </label>{' '}
                {/* ใช้ class Bootstrap */}
                <input
                  id='colorHex'
                  type='text'
                  class='form-control'
                  value={colorHex()}
                  onInput={(e) => setColorHex(e.target.value)}
                  placeholder='e.g., #000000 or FF0000'
                />{' '}
                {/* ใช้ class Bootstrap */}
              </div>
              <div class='col-12'>
                <button
                  type='submit'
                  class='btn btn-primary'
                  disabled={isLoading()}
                >
                  {' '}
                  {/* ใช้ class Bootstrap */}
                  {isLoading() ? 'Testing...' : 'Test API'}
                </button>
              </div>
            </div>
          </form>
          {error() && <div class='alert alert-danger mt-3'>{error()}</div>}{' '}
          {/* ใช้ class Bootstrap */}
          {apiResponse() && (
            <div class='api-response mt-3'>
              {' '}
              {/* ใช้ class Bootstrap spacing */}
              <h3>API Response:</h3>
              {apiResponse().type === 'image' ? (
                <>
                  <p>Success!</p>
                  <img
                    src={apiResponse().url}
                    alt='Generated QR Code'
                    class='img-fluid'
                  />{' '}
                  {/* ใช้ class Bootstrap */}
                  <p>
                    <a
                      href={apiResponse().url}
                      download='qrcode.png'
                      class='btn btn-secondary btn-sm mt-2'
                    >
                      Download QR Code
                    </a>
                  </p>{' '}
                  {/* ใช้ class Bootstrap */}
                </>
              ) : (
                <>
                  <p>Error (Status: {apiResponse().status}):</p>
                  <pre
                    style={{
                      color: apiResponse().status >= 500 ? 'red' : 'inherit',
                    }}
                  >
                    {typeof apiResponse().body === 'string'
                      ? apiResponse().body
                      : JSON.stringify(apiResponse().body, null, 2)}
                  </pre>
                </>
              )}
            </div>
          )}
        </section>
      </div>{' '}
      {/* End container */}
    </>
  );
}

export default Docs;
