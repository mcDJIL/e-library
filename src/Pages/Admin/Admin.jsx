import { useEffect, useRef, useState } from "react";
import client from "../../Utils/client";
import Swal from "sweetalert2";
import { showToast } from "../../Constants/ShowToast";
import Toastr from "../../Components/Toastr";
import Cookies from 'js-cookie';
import { Navigate } from "react-router-dom";

export const Admin = () => {
  const [editMode, setEditMode] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [admin, setAdmin] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const role = Cookies.get('role');
  const inputUsername = useRef();
  const inputEmail = useRef();
  const inputPassword = useRef();
  const inputName = useRef();
  const inputAddress = useRef();

  useEffect(() => {
    getAdmin();
  }, []);

  const getAdmin = () => {
    client.get("users").then(({ data }) => {
      setAdmin(data.data);
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setIsLoading(true);

    const formData = new FormData();
    formData.append('username', inputUsername.current.value);
    formData.append('email', inputEmail.current.value);
    formData.append('password', inputPassword.current.value);
    formData.append('name', inputName.current.value);
    formData.append('address', inputAddress.current.value);

    if (editMode) {
     updateAdmin(formData);
    } else {
      storeAdmin(formData);
    }
  };

  const storeAdmin = (formData) => {
    client.post('users', formData, {
      headers: {
        'Accept': 'application/json',
      }
    }).then(({ data }) => {
        showToast(data.message, 'success')
      getAdmin();
      closeOffcanvas();
    //   resetForm();
    }).catch((error) => {
      console.error(error);

      showToast(error.response.data.message, 'error');
    }).finally(() => {
        setIsLoading(false)
    });
  };

  const updateAdmin = (formData) => {
    formData.append('_method', 'PUT');

    client.post(`users/${selectedAdmin.id}`, formData, {
      headers: {
        'Accept': 'application/json',
      }
    }).then(({ data }) => {
        showToast(data.message, 'success')
        getAdmin();
        closeOffcanvas();
        // resetForm();
    }).catch((error) => {
        console.error(error);
        showToast(error.response.data.message, 'error')
    }).finally(() => {
        setIsLoading(false)
    });
  };

  const deleteAdmin = (id) => {
    Swal.fire({
        title: "Apakah kamu yakin?",
        text: "Kamu tidak bisa mengembalikannya lagi",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Hapus",
        cancelButtonText: "Batal"
      }).then((result) => {
        if (result.isConfirmed) {
            client.delete(`users/${id}`).then(({data}) => {
              showToast(data.message, 'success');
              getAdmin();
            }).catch((error) => {
                console.error(error);
                showToast(error.response.data.message, 'error');
            });
        }
      });
  };

  const editAdmin = (admin) => {
    setEditMode(true);
    setSelectedAdmin(admin);
    
    // Fill form with admin data
    inputUsername.current.value = admin.username;
    inputEmail.current.value = admin.email;
    inputName.current.value = admin.name;
    inputAddress.current.value = admin.address;
    
    // Open offcanvas
    const offcanvas = document.getElementById('offcanvasExample');
    const bsOffcanvas = new bootstrap.Offcanvas(offcanvas);
    bsOffcanvas.show();
  };

  const resetForm = () => {
    inputUsername.current.value = '';
    inputEmail.current.value = '';
    inputPassword.current.value = '';
    inputName.current.value = '';
    inputAddress.current.value = '';
    setEditMode(false);
    setSelectedAdmin(null);
  };

  const closeOffcanvas = () => {
    const offcanvas = document.getElementById('offcanvasExample');
    const bsOffcanvas = bootstrap.Offcanvas.getInstance(offcanvas);
    if (bsOffcanvas) {
      bsOffcanvas.hide();
    }
  };

  if (role !== 'superadmin') {
    return <Navigate to={'/dashboard'} />
  }

  return (
    <>
    <Toastr />

      <div className="card py-3">
        <div className="card-body">
          <div className="d-flex justify-content-between mb-3 align-items-center">
            <h3 className="mb-0">Master Data Admin</h3>
            <button
              className="btn btn-primary"
              data-bs-toggle="offcanvas"
              data-bs-target="#offcanvasExample"
              aria-controls="offcanvasExample"
              onClick={resetForm}
            >
              Tambah Admin
            </button>
          </div>

          <div className="table-responsive">
            <table className="table table-bordered table-striped">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Nama Lengkap</th>
                  <th>Alamat</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                
                {admin.length > 0 ? (
                    admin.map((item, index) => (
                      <tr key={index}>
                        <td style={{width: '50px'}}>{index + 1}</td>
                        <td>{item.username}</td>
                        <td>{item.email}</td>
                        <td>{item.name}</td>
                        <td>{item.address}</td>
                        <td>
                          <button 
                            className="btn btn-warning btn-rounded btn-icon me-2"
                            onClick={() => editAdmin(item)}
                          >
                            <i className="ti-pencil-alt"></i>
                          </button>
                          <button 
                            className="btn btn-danger btn-rounded btn-icon text-white"
                            onClick={() => deleteAdmin(item.id)}
                          >
                            <i className="ti-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan={6}>Data admin kosong</td>
                    </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div
        className="offcanvas offcanvas-end"
        tabIndex={-1}
        id="offcanvasExample"
        aria-labelledby="offcanvasExampleLabel"
      >
        <div className="offcanvas-header">
          <h4 className="offcanvas-title mb-0" id="offcanvasExampleLabel">
            {editMode ? 'Edit Admin' : 'Tambah Admin'}
          </h4>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
            onClick={resetForm}
          ></button>
        </div>
        <div className="offcanvas-body">
          <div>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">
                Username
              </label>
              <input ref={inputUsername} type="text" className="form-control" id="username" />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input ref={inputEmail} type="email" className="form-control" id="email" />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input ref={inputPassword} type="text" className="form-control" id="password" />
            </div>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                Nama Lengkap
              </label>
              <input ref={inputName} type="text" className="form-control" id="name" />
            </div>
            <div className="mb-3">
              <label htmlFor="address" className="form-label">
                Alamat
              </label>
              <textarea className="form-control" id="address" ref={inputAddress} style={{height: '120px'}}></textarea>
            </div>

            <div className="">
              <button disabled={isLoading} onClick={handleSubmit} className="btn btn-primary me-2">
                {isLoading && (
                    <i className="fa fa-spinner fa-spin me-1"></i>
                )}

                { isLoading ? ' Loading' : editMode ? 'Simpan Perubahan' : 'Tambah' }
              </button>
              
              <button
                className="btn btn-danger text-white"
                data-bs-dismiss="offcanvas"
                aria-label="Close"
                onClick={resetForm}
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};