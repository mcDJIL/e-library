import { useEffect, useRef, useState } from "react";
import client from "../../Utils/client";
import Dropzone from "dropzone";
import Select from 'react-select';
import Swal from "sweetalert2";
import { showToast } from "../../Constants/ShowToast";
import Toastr from "../../Components/Toastr";

export const Book = () => {
  const [books, setBooks] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const inputTitle = useRef();
  const inputDesc = useRef();
  const inputAuthor = useRef();
  const inputPublisher = useRef();
  const inputPublished_at = useRef();
  const dropzoneRef = useRef(null);

  useEffect(() => {
    getBooks();
    getCategories();

    if (!Dropzone.instances.length) {
        dropzoneRef.current = new Dropzone("#bookDropzone", {
          url: "/fake-url",
          autoProcessQueue: false,
          maxFiles: 1,
          maxFilesize: 2,
          acceptedFiles: "image/*",
          addRemoveLinks: true,
          dictRemoveFile: "Hapus Gambar",
          init: function() {
            // Store the Dropzone instance for later use
            const dropzone = this;
  
            // Listen for the 'resetFiles' custom event
            dropzone.element.addEventListener('resetFiles', () => {
              dropzone.removeAllFiles(true);
            });
  
            // Listen for the 'addExistingFile' custom event
            dropzone.element.addEventListener('addExistingFile', (e) => {
              if (e.detail && e.detail.imageUrl) {
                // Create a mock file object
                const mockFile = { 
                  name: 'existing-image.jpg', 
                  size: 12345,
                  accepted: true,
                  status: Dropzone.ADDED,
                  type: 'image/jpeg'
                };
  
                // Call addFile with the mock file
                dropzone.emit('addedfile', mockFile);
                dropzone.emit('thumbnail', mockFile, e.detail.imageUrl);
                dropzone.emit('complete', mockFile);
                dropzone.files.push(mockFile);
  
                // Create a hidden input for the existing image path
                const hiddenInput = document.createElement('input');
                hiddenInput.type = 'hidden';
                hiddenInput.name = 'existing_image_path';
                hiddenInput.value = e.detail.imageUrl;
                dropzone.element.appendChild(hiddenInput);
              }
            });
          }
        });
      }

    return () => {
      if (dropzoneRef.current) {
        dropzoneRef.current.destroy();
      }
    };
  }, []);

  const getBooks = () => {
    client.get("books").then(({ data }) => {
      setBooks(data.data);
    });
  };

  const getCategories = () => {
    client.get("categories").then(({ data }) => {
      const formattedCategories = data.data.map(category => ({
        value: category.id,
        label: category.name
      }));
      setCategories(formattedCategories);
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // let data = {
    //     title: inputTitle.current.value,
    //     description: inputDesc.current.value,
    //     author: inputAuthor.current.value,
    //     publisher: inputPublisher.current.value,
    //     published_at: inputPublished_at.current.value,
    //     book_cover: dropzoneRef.current.files[0],
    // }

    // data.categories = selectedCategories.map(category => category.value);
    
    const formData = new FormData();
    formData.append('title', inputTitle.current.value);
    formData.append('description', inputDesc.current.value);
    formData.append('author', inputAuthor.current.value);
    formData.append('publisher', inputPublisher.current.value);
    formData.append('published_at', inputPublished_at.current.value);
    
    if (dropzoneRef.current.files[0]) {
      formData.append('book_cover', dropzoneRef.current.files[0]);
    }
    
    selectedCategories.forEach(category => {
      formData.append('categories[]', category.value);
    });

    if (editMode) {
     updateBook(formData);
    } else {
      storeBook(formData);
    }
  };

  const storeBook = (formData) => {
    client.post('books', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Accept': 'application/json',
      }
    }).then(({ data }) => {
        showToast(data.message, 'success')
      getBooks();
      closeOffcanvas();
    //   resetForm();
    }).catch((error) => {
      console.error(error);

      showToast(error.response.data.message, 'error');
    });
  };

  const updateBook = (formData) => {
    formData.append('_method', 'PUT');

    client.post(`books/${selectedBook.id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Accept': 'application/json',
      }
    }).then(({ data }) => {
        showToast(data.message, 'success')
        getBooks();
        closeOffcanvas();
        // resetForm();
    }).catch((error) => {
        console.error(error);
        showToast(error.response.data.message, 'error')
    });
  };

  const deleteBook = (id) => {
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
            client.delete(`books/${id}`).then(({data}) => {
              showToast(data.message, 'success');
              getBooks();
            }).catch((error) => {
                console.error(error);
                showToast(error.response.data.message, 'error');
            });
        }
      });
  };

  const editBook = (book) => {
    setEditMode(true);
    setSelectedBook(book);
    
    // Convert book categories to Select format
    const selectedCats = book.categories.map(cat => ({
      value: cat.id,
      label: cat.name
    }));
    setSelectedCategories(selectedCats);
    
    // Fill form with book data
    inputTitle.current.value = book.title;
    inputDesc.current.value = book.description;
    inputAuthor.current.value = book.author;
    inputPublisher.current.value = book.publisher;
    inputPublished_at.current.value = book.published_at;

    // Reset dropzone and add existing image
    const dropzoneElement = document.getElementById('bookDropzone');
    
    // First, reset the dropzone
    dropzoneElement.dispatchEvent(new Event('resetFiles'));
    
    // Then, add the existing image
    const addExistingFileEvent = new CustomEvent('addExistingFile', {
      detail: { imageUrl: `http://127.0.0.1:8000/${book.book_cover}` }
    });
    dropzoneElement.dispatchEvent(addExistingFileEvent);

    // Open offcanvas
    const offcanvas = document.getElementById('offcanvasExample');
    const bsOffcanvas = new bootstrap.Offcanvas(offcanvas);
    bsOffcanvas.show();
  };

  const resetForm = () => {
    inputTitle.current.value = '';
    inputDesc.current.value = '';
    inputAuthor.current.value = '';
    inputPublisher.current.value = '';
    inputPublished_at.current.value = '2025';
    setSelectedCategories([]);
    setEditMode(false);
    setSelectedBook(null);
    
    // Reset dropzone files
    const dropzoneElement = document.getElementById('bookDropzone');
    dropzoneElement.dispatchEvent(new Event('resetFiles'));
  };

  const closeOffcanvas = () => {
    const offcanvas = document.getElementById('offcanvasExample');
    const bsOffcanvas = bootstrap.Offcanvas.getInstance(offcanvas);
    if (bsOffcanvas) {
      bsOffcanvas.hide();
    }
  };

  // Custom styles for react-select
  const customStyles = {
    control: (base) => ({
      ...base,
      minHeight: '38px',
      borderColor: '#dee2e6',
      '&:hover': {
        borderColor: '#86b7fe'
      }
    }),
    multiValue: (base) => ({
      ...base,
      backgroundColor: '#e9ecef',
    })
  };

  return (
    <>
    <Toastr />

      <div className="card py-3">
        <div className="card-body">
          <div className="d-flex justify-content-between mb-3 align-items-center">
            <h3 className="mb-0">Master Data Buku</h3>
            <button
              className="btn btn-primary"
              data-bs-toggle="offcanvas"
              data-bs-target="#offcanvasExample"
              aria-controls="offcanvasExample"
              onClick={resetForm}
            >
              Tambah Buku
            </button>
          </div>

          <div className="table-responsive">
            <table className="table table-bordered table-striped">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Judul</th>
                  <th>Deskripsi</th>
                  <th>Penulis</th>
                  <th>Penerbit</th>
                  <th>Tahun Terbit</th>
                  <th>Kategori</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                
                {books.length > 0 ? (
                    books.map((item, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{item.title}</td>
                        <td>{item.description}</td>
                        <td>{item.author}</td>
                        <td>{item.publisher}</td>
                        <td>{item.published_at}</td>
                        <td>
                          {item.categories?.map(cat => cat.name).join(', ')}
                        </td>
                        <td>
                          <button 
                            className="btn btn-warning btn-rounded btn-icon me-2"
                            onClick={() => editBook(item)}
                          >
                            <i className="ti-pencil-alt"></i>
                          </button>
                          <button 
                            className="btn btn-danger btn-rounded btn-icon text-white"
                            onClick={() => deleteBook(item.id)}
                          >
                            <i className="ti-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan={8}>Data buku kosong</td>
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
            {editMode ? 'Edit Buku' : 'Tambah Buku'}
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
              <label htmlFor="title" className="form-label">
                Judul
              </label>
              <input ref={inputTitle} type="text" className="form-control" id="title" />
            </div>
            <div className="mb-3">
              <label htmlFor="description" className="form-label">
                Deskripsi Singkat
              </label>
              <textarea
                ref={inputDesc}
                id="description"
                className="form-control"
                style={{ height: "120px" }}
              ></textarea>
            </div>
            <div className="mb-3">
              <label htmlFor="author" className="form-label">
                Penulis
              </label>
              <input ref={inputAuthor} type="text" className="form-control" id="author" />
            </div>
            <div className="mb-3">
              <label htmlFor="publisher" className="form-label">
                Penerbit
              </label>
              <input ref={inputPublisher} type="text" className="form-control" id="publisher" />
            </div>
            <div className="mb-3">
              <label htmlFor="published_at" className="form-label">
                Tahun Terbit
              </label>
              <input
                ref={inputPublished_at}
                type="number"
                min={1900}
                max={2025}
                defaultValue={2025}
                step={1}
                className="form-control"
                id="published_at"
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Kategori</label>
              <Select
                isMulti
                options={categories}
                value={selectedCategories}
                onChange={setSelectedCategories}
                className="basic-multi-select"
                classNamePrefix="select"
                styles={customStyles}
                placeholder="Pilih kategori..."
                noOptionsMessage={() => "Tidak ada kategori"}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Upload Gambar</label>
              <div
                id="bookDropzone"
                className="dropzone"
                style={{
                  border: "2px dashed #007bff",
                  borderRadius: "8px",
                  padding: "50px",
                  textAlign: "center",
                }}
              >
                <p>Drag & drop gambar di sini, atau klik untuk memilih.</p>
              </div>
            </div>

            <div className="">
              <button onClick={handleSubmit} className="btn btn-primary me-2">
                {editMode ? 'Simpan Perubahan' : 'Tambah'}
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

export default Book;