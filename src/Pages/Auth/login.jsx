import { useRef, useState } from "react";
import "../../assets/css/style.css";
import { useNavigate } from "react-router-dom";
import client from '../../Utils/client';
import Cookies from "js-cookie";

export const Login = () => {

    const inputEmail = useRef();
    const inputPassword = useRef();
    const nav = useNavigate();

    const [errorMessage, setErrorMessage] = useState();
    const [successMessage, setSuccessMessage] = useState();
    const [isLoading, setIsLoading] = useState(false);

    const login = (e) => {
        e.preventDefault();

        setIsLoading(true);

        let data = {
            email: inputEmail.current.value,
            password: inputPassword.current.value,
        }

        client.post('login', data).then(({data}) => {
            console.log(data);

            Cookies.set('name', data.data.name);
            Cookies.set('role', data.data.role);
            Cookies.set('token', data.data.token);

            setSuccessMessage(data.data.message);

            if (data.data.role == 'peminjam') {
                nav('/');
            } else {
                nav('/dashboard');
            }

        }).catch((error) => {
            if (error.response && error.response.data && error.response.data.message) {
                setErrorMessage(error.response.data.message);
            }
        }).finally(() => {
            setIsLoading(false)
        })
    }

  return (
    <div className="container-scroller">
      <div className="container-fluid page-body-wrapper full-page-wrapper">
        <div className="content-wrapper d-flex align-items-center auth px-0">
          <div className="row w-100 mx-0">
            <div className="col-lg-4 mx-auto">
              <div className="auth-form-light text-left py-5 px-4 px-sm-5">
                <div className="brand-logo">
                  <h2 className="fw-bold">E-Library</h2>
                </div>
                <h4>Haloo! Selamat Datang</h4>
                <h6 className="font-weight-light pb-3">Masuk untuk melanjutkan.</h6>

                {errorMessage && (
                <div className="alert alert-danger mb-4 mt-0">
                    {errorMessage}
                </div>
                )}

                {successMessage && (
                <div className="alert alert-success mb-4 mt-0">
                    {successMessage}
                </div>
                )}

                <form className="">
                  <div className="form-group">
                    <input
                      type="email"
                      className="form-control form-control-lg"
                      id="exampleInputEmail1"
                      placeholder="Email"
                      ref={inputEmail}
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="password"
                      className="form-control form-control-lg"
                      id="exampleInputPassword1"
                      placeholder="Password"
                      ref={inputPassword}
                    />
                  </div>
                  <div className="mt-3 d-grid gap-2">
                    <button disabled={isLoading} onClick={login} className="btn btn-block btn-primary btn-lg font-weight-medium auth-form-btn">
                      {isLoading && (
                        <i className="fa fa-spinner fa-spin me-1"></i>
                      )}

                      { isLoading ? ' Loading' : 'Masuk' }
                    </button>
                  </div>
                  <div className="text-center mt-4 font-weight-light">
                    {" "}
                    Belum punya akun?{" "}
                    <a href={"/register"} className="text-primary">
                      Daftar
                    </a>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
