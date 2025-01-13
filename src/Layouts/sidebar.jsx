import { useLocation } from "react-router-dom"
import Cookies from 'js-cookie';

export const Sidebar = () => {

    const location = useLocation();
    const role = Cookies.get('role');

    return (
        <nav className="sidebar sidebar-offcanvas" id="sidebar">
            <ul className="nav">
              <li className={location.pathname === '/dashboard' ? 'active nav-item' : 'nav-item'}>
                <a className="nav-link" href="/dashboard">
                  <i className="icon-grid menu-icon"></i>
                  <span className="menu-title">Dashboard</span>
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link"
                  data-bs-toggle="collapse"
                  href="#ui-basic"
                  aria-expanded="false"
                  aria-controls="ui-basic"
                >
                  <i className="icon-folder menu-icon"></i>
                  <span className="menu-title">Master Data</span>
                  <i className="menu-arrow"></i>
                </a>
                <div className="collapse" id="ui-basic">
                  <ul className="nav flex-column sub-menu">
                    <li className="nav-item">
                      <a
                        className="nav-link"
                        href="/master-data/buku"
                      >
                        Buku
                      </a>
                    </li>
                    <li className="nav-item">
                      <a
                        className="nav-link"
                        href="/master-data/kategori"
                      >
                        Kategori
                      </a>
                    </li>
                    {role === 'superadmin' ? (
                      <>
                      <li className="nav-item">
                        <a
                          className="nav-link"
                          href="/master-data/admin"
                        >
                          Admin
                        </a>
                      </li>
                      <li className="nav-item">
                        <a
                          className="nav-link"
                          href="/master-data/pengguna"
                        >
                          Pengguna
                        </a>
                      </li>
                      </>
                    ) : null}
                  </ul>
                </div>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link"
                  href="/manajemen/peminjaman"
                >
                  <i className="icon-book menu-icon"></i>
                  <span className="menu-title">Peminjaman</span>
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link"
                  href="/manajemen/ulasan"
                >
                  <i className="icon-star menu-icon"></i>
                  <span className="menu-title">Ulasan Buku</span>
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link"
                  data-bs-toggle="collapse"
                  href="#charts"
                  aria-expanded="false"
                  aria-controls="charts"
                >
                  <i className="icon-clipboard menu-icon"></i>
                  <span className="menu-title">Laporan</span>
                  <i className="menu-arrow"></i>
                </a>
                <div className="collapse" id="charts">
                  <ul className="nav flex-column sub-menu">
                    <li className="nav-item">
                      <a className="nav-link" href="/laporan">
                        Peminjaman
                      </a>
                    </li>
                  </ul>
                </div>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link"
                  href="/manajemen/notifikasi"
                >
                  <i className="icon-bell menu-icon"></i>
                  <span className="menu-title">Notifikasi</span>
                </a>
              </li>
            </ul>
          </nav>
    )
}