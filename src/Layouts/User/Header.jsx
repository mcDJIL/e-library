import Cookies from 'js-cookie';
import { useLocation, useNavigate } from 'react-router-dom';
import client from '../../Utils/client';

export const Header = () => {

    const token = Cookies.get('token');

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
        <nav class="navbar navbar-expand-lg bg-body-tertiary">
  <div class="container">
    <a class="navbar-brand fw-bold fs-3" href="/">E-Library</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo02" aria-controls="navbarTogglerDemo02" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarTogglerDemo02">
      <ul class="navbar-nav me-auto mb-2 mb-lg-0">
        <li class="nav-item">
          <a class={ location.pathname == '/' ? "nav-link active" : 'nav-link' } style={{fontSize: '16px'}} aria-current="page" href="/">Beranda</a>
        </li>
        <li class="nav-item">
          <a class={ location.pathname == '/buku' ? "nav-link active" : 'nav-link' } style={{fontSize: '16px'}} aria-current="page" href="/buku">Buku</a>
        </li>
        <li class="nav-item">
          <a class={ location.pathname == '/koleksi' ? "nav-link active" : 'nav-link' } style={{fontSize: '16px'}} aria-current="page" href="/koleksi">Koleksi</a>
        </li>
      </ul>
      <div class="d-flex" role="search">
        {token == null ? (
            <>
            <a class="btn btn-outline-primary me-2" href='/login'>Login</a>
            <a class="btn btn-primary" href='/register'>Daftar</a>
            </>
        ) : (
            <button class="btn btn-outline-danger me-2" onClick={logout}>Logout</button>
        )}
      </div>
    </div>
  </div>
</nav>
    )
}