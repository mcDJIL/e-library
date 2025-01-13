import { useEffect, useRef, useState } from "react";
import client from "../../Utils/client";
import Swal from "sweetalert2";
import { showToast } from "../../Constants/ShowToast";
import Toastr from "../../Components/Toastr";
import Cookies from 'js-cookie';
import { Navigate } from "react-router-dom";

export const User = () => {
  const [editMode, setEditMode] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [user, setUser] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const role = Cookies.get('role');
  const inputUsername = useRef();
  const inputEmail = useRef();
  const inputPassword = useRef();
  const inputName = useRef();
  const inputAddress = useRef();

  useEffect(() => {
    getUser();
  }, []);

  const getUser = () => {
    client.get("peminjam").then(({ data }) => {
      setUser(data.data);
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
     updateUser(formData);
    } else {
      storeUser(formData);
    }
  };

  const storeUser = (formData) => {
    client.post('peminjam', formData, {
      headers: {
        'Accept': 'application/json',
      }
    }).then(({ data }) => {
        showToast(data.message, 'success')
      getUser();
      closeOffcanvas();
    //   resetForm();
    }).catch((error) => {
      console.error(error);

      showToast(error.response.data.message, 'error');
    }).finally(() => {
        setIsLoading(false)
    });
  };

  const updateUser = (formData) => {
    formData.append('_method', 'PUT');

    client.post(`peminjam/${selectedUser.id}`, formData, {
      headers: {
        'Accept': 'application/json',
      }
    }).then(({ data }) => {
        showToast(data.message, 'success')
        getUser();
        closeOffcanvas();
        // resetForm();
    }).catch((error) => {
        console.error(error);
        showToast(error.response.data.message, 'error')
    }).finally(() => {
        setIsLoading(false)
    });
  };

  const deleteUser = (id) => {
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
            client.delete(`peminjam/${id}`).then(({data}) => {
              showToast(data.message, 'success');
              getUser();
            }).catch((error) => {
                console.error(error);
                showToast(error.response.data.message, 'error');
            });
        }
      });
  };

  const editUser = (user) => {
    setEditMode(true);
    setSelectedUser(user);
    
    // Fill form with user data
    inputUsername.current.value = user.username;
    inputEmail.current.value = user.email;
    inputName.current.value = user.name;
    inputAddress.current.value = user.address;
    
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
    setSelectedUser(null);
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
            <h3 className="mb-0">Master Data Peminjam</h3>
            <button
              className="btn btn-primary"
              data-bs-toggle="offcanvas"
              data-bs-target="#offcanvasExample"
              aria-controls="offcanvasExample"
              onClick={resetForm}
            >
              Tambah Peminjam
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
                
                {user.length > 0 ? (
                    user.map((item, index) => (
                      <tr key={index}>
                        <td style={{width: '50px'}}>{index + 1}</td>
                        <td>{item.username}</td>
                        <td>{item.email}</td>
                        <td>{item.name}</td>
                        <td>{item.address}</td>
                        <td>
                          <button 
                            className="btn btn-warning btn-rounded btn-icon me-2"
                            onClick={() => editUser(item)}
                          >
                            <i className="ti-pencil-alt"></i>
                          </button>
                          <button 
                            className="btn btn-danger btn-rounded btn-icon text-white"
                            onClick={() => deleteUser(item.id)}
                          >
                            <i className="ti-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan={6}>Data peminjam kosong</td>
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
            {editMode ? 'Edit Peminjam' : 'Tambah Peminjam'}
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