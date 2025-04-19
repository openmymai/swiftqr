// frontend/src/routes/payment-cancel.tsx
import { Title } from '@solidjs/meta';
import { A } from '@solidjs/router';

function PaymentCancel() {
  return (
    <>
      <Title>Payment Cancelled - SwiftQR API</Title>
      {/* Section Title ตาม Template */}
      <div class='container section-title'>
        <h2>Payment Cancelled</h2>
      </div>

      <div class='container text-center'>
        {' '}
        {/* ใช้ class container และ text-center */}
        <p>Your payment was cancelled.</p>
        <p>If you have any questions, please contact us.</p>{' '}
        {/* ถ้ามีช่องทางติดต่อ */}
        <p class='mt-4'>
          {' '}
          {/* ใช้ class Bootstrap */}
          <A
            href='/#pricing'
            class='btn btn-secondary'
          >
            Try Purchasing Again
          </A>{' '}
          {/* ใช้ class Bootstrap */}
          or
          <A
            href='/'
            class='btn btn-link'
          >
            Return to Home
          </A>{' '}
          {/* ใช้ class Bootstrap */}
        </p>
      </div>
    </>
  );
}

export default PaymentCancel;
