import { Navigate } from "react-router-dom"
import { Outlet } from "react-router-dom";
import "../assets/css/style.css";
import Cookies from "js-cookie";
import { Sidebar } from "../Layouts/sidebar";
import { Header } from "../Layouts/header";
import { Footer } from "../Layouts/footer";

export const AdminSkin = () => {
  const role = Cookies.get('role');
  const token = Cookies.get('token');

  if (token == null ) {
      return <Navigate to={'/'} />
  }

  if (role == 'peminjam') {
      return <Navigate to={'/'} />
  }

  return (
    <>
      <div className="container-scroller">
        <Header />
        
        <div className="container-fluid page-body-wrapper">
          
          <Sidebar />

          <div className="main-panel">

            <Outlet />

            <Footer />
          </div>
        </div>
      </div>
    </>
  );
};
