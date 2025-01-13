import { useEffect, useRef, useState } from "react";
import client from "../../Utils/client";
import Swal from "sweetalert2";
import { showToast } from "../../Constants/ShowToast";
import Toastr from "../../Components/Toastr";

export const Category = () => {
  const [editMode, setEditMode] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const inputName = useRef();

  useEffect(() => {
    getCategories();
  }, []);

  const getCategories = () => {
    client.get("categories").then(({ data }) => {
      setCategories(data.data);
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setIsLoading(true);

    const formData = new FormData();
    formData.append('name', inputName.current.value);

    if (editMode) {
     updateCategory(formData);
    } else {
      storeCategory(formData);
    }
  };

  const storeCategory = (formData) => {
    client.post('categories', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Accept': 'application/json',
      }
    }).then(({ data }) => {
        showToast(data.message, 'success')
      getCategories();
      closeOffcanvas();
    //   resetForm();
    }).catch((error) => {
      console.error(error);

      showToast(error.response.data.message, 'error');
    }).finally(() => {
        setIsLoading(false)
    });
  };

  const updateCategory = (formData) => {
    formData.append('_method', 'PUT');

    client.post(`categories/${selectedCategory.id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Accept': 'application/json',
      }
    }).then(({ data }) => {
        showToast(data.message, 'success')
        getCategories();
        closeOffcanvas();
        // resetForm();
    }).catch((error) => {
        console.error(error);
        showToast(error.response.data.message, 'error')
    }).finally(() => {
        setIsLoading(false)
    });
  };

  const deleteCategory = (id) => {
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
            client.delete(`categories/${id}`).then(({data}) => {
              showToast(data.message, 'success');
              getCategories();
            }).catch((error) => {
                console.error(error);
                showToast(error.response.data.message, 'error');
            });
        }
      });
  };

  const editCategory = (category) => {
    setEditMode(true);
    setSelectedCategory(category);
    
    // Fill form with category data
    inputName.current.value = category.name;
    
    // Open offcanvas
    const offcanvas = document.getElementById('offcanvasExample');
    const bsOffcanvas = new bootstrap.Offcanvas(offcanvas);
    bsOffcanvas.show();
  };

  const resetForm = () => {
    inputName.current.value = '';
    setEditMode(false);
    setSelectedCategory(null);
  };

  const closeOffcanvas = () => {
    const offcanvas = document.getElementById('offcanvasExample');
    const bsOffcanvas = bootstrap.Offcanvas.getInstance(offcanvas);
    if (bsOffcanvas) {
      bsOffcanvas.hide();
    }
  };

  return (
    <>
    <Toastr />

      <div className="card py-3">
        <div className="card-body">
          <div className="d-flex justify-content-between mb-3 align-items-center">
            <h3 className="mb-0">Master Data Kategori</h3>
            <button
              className="btn btn-primary"
              data-bs-toggle="offcanvas"
              data-bs-target="#offcanvasExample"
              aria-controls="offcanvasExample"
              onClick={resetForm}
            >
              Tambah Kategori
            </button>
          </div>

          <div className="table-responsive">
            <table className="table table-bordered table-striped">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Nama</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                
                {categories.length > 0 ? (
                    categories.map((item, index) => (
                      <tr key={index}>
                        <td style={{width: '50px'}}>{index + 1}</td>
                        <td>{item.name}</td>
                        <td>
                          <button 
                            className="btn btn-warning btn-rounded btn-icon me-2"
                            onClick={() => editCategory(item)}
                          >
                            <i className="ti-pencil-alt"></i>
                          </button>
                          <button 
                            className="btn btn-danger btn-rounded btn-icon text-white"
                            onClick={() => deleteCategory(item.id)}
                          >
                            <i className="ti-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan={3}>Data kategori kosong</td>
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
            {editMode ? 'Edit Kategori' : 'Tambah Kategori'}
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
              <label htmlFor="name" className="form-label">
                Nama Kategori
              </label>
              <input ref={inputName} type="text" className="form-control" id="name" />
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