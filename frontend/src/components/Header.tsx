// frontend/src/components/Header.tsx
import { A } from '@solidjs/router';

function Header() {
  return (
    <header
      id='header'
      class='header d-flex align-items-center fixed-top'
    >
      <div class='container-fluid position-relative d-flex align-items-center justify-content-between'>
        <A
          href='/'
          class='logo d-flex align-items-center me-auto me-xl-0'
        >
          {/* <img src="/assets/img/logo.png" alt=""> */}{' '}
          {/* Copy logo to public folder */}
          <h1 class='sitename'>SwiftQR API</h1>
          <span>.</span> {/* เปลี่ยนชื่อ Brand */}
        </A>
        <nav
          id='navmenu'
          class='navmenu'
        >
          <ul>
            <li>
              <A
                href='/#hero'
                activeClass='active'
              >
                Home
              </A>
            </li>{' '}
            {/* Link ไป Section บนหน้า Home */}
            {/* ตัด Sections ที่ไม่ได้ทำใน MVP ออก */}
            {/* <li><A href="/#about">About</A></li> */}
            {/* <li><A href="/#services">Services</A></li> */}
            {/* <li><A href="/#portfolio">Portfolio</A></li> */}
            <li>
              <A href='/#pricing'>Pricing</A>
            </li>{' '}
            {/* Link ไป Section Pricing */}
            {/* <li><A href="/#team">Team</A></li> */}
            {/* <li><A href="/blog">Blog</A></li> */}{' '}
            {/* ลบถ้าไม่ทำหน้า Blog */}
            {/* Dropdown Menu - V1 อาจจะยังไม่ทำงานเพราะไม่ได้ include Bootstrap JS */}
            {/* <li class="dropdown"><a href="#"><span>Dropdown</span> <i class="bi bi-chevron-down toggle-dropdown"></i></a>
              <ul>
                <li><A href="#">Dropdown 1</A></li>
                 ... deep dropdowns ...
              </ul>
            </li> */}
            {/* <li><A href="/#contact">Contact</A></li> */}{' '}
            {/* ลบถ้าไม่ทำหน้า Contact */}
            {/* Link ไปหน้า Documentation */}
            <li>
              <A href='/docs'>Documentation</A>
            </li>
          </ul>
          {/* Mobile Nav Toggle - ต้องใช้ JS ซึ่งเราจะไม่ include ใน V1 */}
          {/* <i class="mobile-nav-toggle d-xl-none bi bi-list"></i> */}
        </nav>
        {/* "Get Started" Button - ปรับ Link */}
        <A
          class='btn-getstarted'
          href='/docs'
        >
          Get Started
        </A>{' '}
        {/* ชี้ไปหน้า Docs */}
      </div>
    </header>
  );
}

export default Header;
