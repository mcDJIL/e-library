import { useEffect, useState } from "react"
import client from "../../Utils/client";
import { showToast } from "../../Constants/ShowToast";
import Swal from 'sweetalert2';
import { ToastContainer } from "react-toastify";

export const Collection = () => {
    const [books, setBooks] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [notLogin, setNotLogin] = useState(false);

    useEffect(() => {
        getBooks();
    }, []);

    const getBooks = () => {
        client.get(`collection-books`).then(({data}) => {
            console.log(data);
            
            setBooks(data.data);
        }).catch((error) => {
            console.error(error);

            if (error.response.data.message == "Unauthenticated.") {
                setNotLogin(true);
            }
        })
    }

    const borrowBook = (id) => {
        setIsLoading(true);

        client.post(`borrow-book/${id}`).then(({data}) => {
            Swal.fire({
                title: "Berhasil",
                text: data.message,
                icon: "info"
              });
            getBooks();
        }).catch((error) => {
            console.error(error);

              if (error.response.data.message == "Unauthenticated.") {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Anda belum login, silahkan login terlebih dahulu!",
                  });
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: error.response.data.message,
                      });
                }
        }).finally(() => {
            setIsLoading(false);
        })
    }

    const addFavorite = (id) => {
        setIsLoading(true)

        client.post(`add-favorite/${id}`).then(({data}) => {
            showToast(data.message, 'success');
            getBooks();
        }).catch((error) => {
            console.error(error);
            
            if (error.response.data.message == "Unauthenticated.") {
                showToast("Anda belum login, silahkan login terlebih dahulu!", 'error');
            } else {
                showToast(error.response.data.message, 'error');
            }
        }).finally(() => {
            setIsLoading(false);
        })
    }

    const removeFavorite = (id) => {
        setIsLoading(true);

        client.post(`remove-favorite/${id}`).then(({data}) => {
            showToast(data.message, 'success');
            getBooks();
        }).catch((error) => {
            console.error(error);
            
            if (error.response.data.message == "Unauthenticated.") {
                showToast("Anda belum login, silahkan login terlebih dahulu!", 'error');
            } else {
                showToast(error.response.data.message, 'error');
            }
        }).finally(() => {
            setIsLoading(false);
        })
    }

    return (
        <>
        <ToastContainer />

        <div className="container pt-5">
            <h2>Daftar Koleksi</h2>

            <div className="row mt-4">
                {notLogin && (
                    <div className="alert alert-danger">Anda belum login!</div>
                )}

                {books.length > 0 ? (
                    books.map((item, index) => (
                    <div key={index} className="col-12 col-md-6 col-lg-4 col-xl-3 mb-5 d-flex justify-content-center text-decoration-none">
                        <div className="card" style={{width: '280px', border: '1px solid #000', height: '500px'}}>
                            <a href={`/detail-buku/${item.id}`}>
                            <img style={{height: '280px'}} src={`http://127.0.0.1:8000/${item.book_cover}`} alt="" className="card-img-top object-fit-cover" />
                            </a>
                            <div className="card-body">
                                <h5 className="card-title mb-2" style={{lineHeight: '25px'}}>{item.title}</h5>
                                <p className="card-text">{item.description}</p>
                            
                                <div className="mt-3 d-flex justify-content-end card-button">
    
                                    {item.availability_status === 'Buku Sedang Dipinjam' ? (
                                    <button disabled className="btn btn-outline-primary btn-rounded btn-icon me-2">
                                        <i className="fa fa-book"></i>
                                    </button>
                                    ) : (
                                    <button disabled={isLoading} onClick={() => borrowBook(item.id)} className="btn btn-outline-primary btn-rounded btn-icon me-2">
                                        <i className="fa fa-book"></i>
                                    </button>
                                    )}
    
                                    {item.favorite_book != false ? (
                                    <button disabled={isLoading} onClick={() => removeFavorite(item.id)} className="btn btn-outline-danger active btn-rounded btn-icon">
                                        <i className="fa fa-heart"></i>
                                    </button>
                                    ) : (
                                    <button disabled={isLoading} onClick={() => addFavorite(item.id)} className="btn btn-outline-danger btn-rounded btn-icon">
                                        <i className="fa fa-heart"></i>
                                    </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    ))
                ) : (
                    <div className="alert alert-warning">Daftar koleksi tidak ada!</div>
                )}
            </div>
        </div>
        </>
    )
}