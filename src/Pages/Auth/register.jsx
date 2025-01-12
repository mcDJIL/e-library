import { useRef, useState } from "react";
import "../../assets/css/style.css";
import { useNavigate } from "react-router-dom";
import client from '../../Utils/client';

export const Register = () => {

    const inputUsername = useRef();
    const inputEmail = useRef();
    const inputPassword = useRef();
    const inputName = useRef();
    const inputAddress = useRef();
    const nav = useNavigate();

    const [errorMessage, setErrorMessage] = useState();
    const [successMessage, setSuccessMessage] = useState();
    const [isLoading, setIsLoading] = useState(false);

    const register = (e) => {
        e.preventDefault();

        setIsLoading(true);

        let data = {
            username: inputUsername.current.value,
            email: inputEmail.current.value,
            password: inputPassword.current.value,
            name: inputName.current.value,
            address: inputAddress.current.value,
        }

        client.post('register', data).then(({data}) => {
            console.log(data);

            setSuccessMessage(data.data.message);

            nav('/login');
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
                <h6 className="font-weight-light pb-3">Daftar untuk melanjutkan.</h6>

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
                      type="text"
                      className="form-control form-control-lg"
                      id="username"
                      placeholder="Username"
                      ref={inputUsername}
                    />
                  </div>
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
                  <div className="form-group">
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      id="name"
                      placeholder="Nama lengkap"
                      ref={inputName}
                    />
                  </div>
                  <div className="form-group">
                    <textarea ref={inputAddress} className="form-control form-control-lg" id="address" placeholder="Alamat" style={{height: '120px'}}></textarea>
                  </div>
                  <div className="mt-3 d-grid gap-2">
                    <button disabled={isLoading} onClick={register} className="btn btn-block btn-primary btn-lg font-weight-medium auth-form-btn">
                      {isLoading && (
                        <i className="fa fa-spinner fa-spin me-1"></i>
                      )}

                      { isLoading ? ' Loading' : 'Daftar' }
                    </button>
                  </div>
                  <div className="text-center mt-4 font-weight-light">
                    {" "}
                    Sudah punya akun?{" "}
                    <a href={"/login"} className="text-primary">
                      Masuk
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
