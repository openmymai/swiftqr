// frontend/src/app.tsx
import { Suspense } from 'solid-js';
// **แก้ไข:** นำเข้า Router จาก @solidjs/router
import { Router } from '@solidjs/router';
// **แก้ไข:** นำเข้า FileRoutes จาก @solidjs/start/router
import { FileRoutes } from '@solidjs/start/router';

// นำเข้า Components Header และ Footer
import Header from './components/Header';
import Footer from './components/Footer';

import './app.css'; // Import Global CSS

// **สำคัญ:** เราจะไม่ Import 'routes' จาก './routes' ใน App.tsx อีกต่อไป

// **แก้ไข:** สร้าง Root Layout Component ที่รับ props.children (เหมือนเดิม)
function RootLayout(props: { children?: any }) {
  return (
    <>
      <Header />
      <main class='main'>
        {/* Suspense ยังคงจำเป็นสำหรับ Lazy Loading ที่ FileRoutes อาจจะทำ */}
        <Suspense fallback={<div>Loading page content...</div>}>
          {/* Render props.children ที่ Router ส่งเข้ามา */}
          {props.children}
        </Suspense>
      </main>
      <Footer />
    </>
  );
}

function App() {
  return (
    // **แก้ไข:** ใช้ Router และส่ง RootLayout เข้าไปใน root prop
    <Router root={RootLayout}>
      {/* **แก้ไข:** ใช้ FileRoutes Component เพื่อให้ SolidStart จัดการ Routing */}
      <FileRoutes />
    </Router>
  );
}

export default App;
