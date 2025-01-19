import Cookies from 'js-cookie';
import { useLocation, useNavigate } from 'react-router-dom';
import client from '../../Utils/client';

export const Header = () => {

    const token = Cookies.get('token');
    const role = Cookies.get('role');

    const nav = useNavigate();

    const location = useLocation();

    const logout = (e) => {
        e.preventDefault();

        client.post('logout').then(() => {
            Cookies.remove('name');
            Cookies.remove('role');
            Cookies.remove('token');
        
            nav('/login');
        }).catch((error) => {
        console.error(error);
        })
    }

    return (
        <nav className="navbar navbar-expand-lg bg-white" style={{height: '80px'}}>
  <div className="container bg-white">
    <a className="navbar-brand fw-bold fs-3" href="/">E-Library</a>
    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo02" aria-controls="navbarTogglerDemo02" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
    </button>
    <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
      <ul className="navbar-nav me-auto mb-2 mb-lg-0">
        <li className="nav-item">
          <a className={ location.pathname == '/' ? "nav-link active" : 'nav-link' } style={{fontSize: '16px'}} aria-current="page" href="/">Beranda</a>
        </li>
        <li className="nav-item">
          <a className={ location.pathname == '/buku' ? "nav-link active" : 'nav-link' } style={{fontSize: '16px'}} aria-current="page" href="/buku">Buku</a>
        </li>
        <li className="nav-item">
          <a className={ location.pathname == '/koleksi' ? "nav-link active" : 'nav-link' } style={{fontSize: '16px'}} aria-current="page" href="/koleksi">Koleksi</a>
        </li>
        <li className="nav-item">
          <a className={ location.pathname == '/riwayat' ? "nav-link active" : 'nav-link' } style={{fontSize: '16px'}} aria-current="page" href="/riwayat">Riwayat Peminjaman</a>
        </li>
        {role != 'peminjam' && role != null ? (
        <li className="nav-item">
          <a className="nav-link" style={{fontSize: '16px'}} aria-current="page" href="/dashboard">Dashboard</a>
        </li>
        ) : null}
      </ul>
      <div className="d-flex" role="search">
        {token == null ? (
            <>
            <a className="btn btn-outline-primary me-2" href='/login'>Login</a>
            <a className="btn btn-primary" href='/register'>Daftar</a>
            </>
        ) : (
            <button className="btn btn-outline-danger me-2" onClick={logout}>Logout</button>
        )}
      </div>
    </div>
  </div>
</nav>
    )
}