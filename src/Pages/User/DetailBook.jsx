import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import client from "../../Utils/client";
import { showToast } from "../../Constants/ShowToast";
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';
import Toastr from "../../Components/Toastr";

export const DetailBook = () => {
  const [book, setBook] = useState({
    categories: [], // Initialize categories as an empty array
  });
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  const name = Cookies.get('name');
  
  const { id } = useParams();

  useEffect(() => {
    getBook();
    getReviews();
  }, []);

  const getBook = () => {
    client.get(`detail-book/${id}?name=${name}`).then(({ data }) => {
      console.log(data);
      setBook(data.data);
    });
  };

  const getReviews = ()  => {
    client.get(`get-review/${id}`).then(({data}) => {
        console.log(data);
        setReviews(data.data);
    }).catch((error) => {
        console.error(error);
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
          getBook();
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
        getBook();
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
        getBook();
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

const handleStarHover = (hoveredRating) => {
    setHoverRating(hoveredRating);
  };

  const handleStarClick = (selectedRating) => {
    setRating(selectedRating);
  };

  const handleMouseLeave = () => {
    setHoverRating(0);
  };

  const renderStars = () => {
    return [1, 2, 3, 4, 5].map((star) => (
      <i
        key={star}
        className={`fa fa-star ${
          (hoverRating || rating) >= star ? 'text-warning' : 'text-muted'
        } cursor-pointer`}
        onMouseEnter={() => handleStarHover(star)}
        onClick={() => handleStarClick(star)}
        style={{ cursor: 'pointer' }}
      />
    ));
  };

  const handleSubmitReview = () => {
    if (!rating) {
      showToast('Please select a rating', 'error');
      return;
    }

    if (!review.trim()) {
      showToast('Please write a review', 'error');
      return;
    }

    setIsLoading(true);

    client
      .post(`send-review/${id}`, {
        review: review,
        rating: rating,
      })
      .then(({ data }) => {
        showToast(data.message, 'success');
        setReview("");
        setRating(0);
        getBook(); // Refresh book data to show new review
      })
      .catch((error) => {
        console.error(error);
        showToast(error.response.data.message, 'error');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const formatDate = (dateString) => {
    const months = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    
    const date = new Date(dateString);
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    
    return `${day} ${month} ${year}`;
  };

  const renderReviewStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <i
        key={index}
        className={`fa fa-star ${index < rating ? '' : 'text-muted'}`}
      />
    ));
  };

  return (
    <>
    <Toastr />
    <div className="container pb-5">
      <div className="d-flex justify-content-center align-items-center flex-wrap">
        <div className="d-flex align-items-center detail pt-5 gap-5">
          <div className="detail-book">
            <img
              src={`http://127.0.0.1:8000/${book.book_cover}`}
              alt=""
              className="object-fit-cover"
            />
          </div>

          <div className="detail-book">
            {book.favorite_book != false ? (
              <button
                disabled={isLoading}
                onClick={() => removeFavorite(book.id)}
                className="btn btn-outline-danger active btn-rounded btn-icon mb-3"
              >
                <i className="fa fa-heart"></i>
              </button>
            ) : (
              <button
                disabled={isLoading}
                onClick={() => addFavorite(book.id)}
                className="btn btn-outline-danger btn-rounded btn-icon mb-3"
              >
                <i className="fa fa-heart"></i>
              </button>
            )}

            <h3>{book.title}</h3>

            <p className="fw-medium pt-2 mb-0">Author: {book.author}</p>

            <div className="stars-container py-3">
              {renderReviewStars(book?.rating?.average ?? '-')}
            </div>

            <p>{book.description}</p>

            <table>
              <tr>
                <td width={"150px"}>
                  <p className="pt-2">
                    <strong>PENERBIT</strong>
                  </p>
                </td>
                <td width={"10px"}>:</td>
                <td>{book.publisher}</td>
              </tr>
              <tr>
                <td>
                  <p className="pt-2">
                    <strong>TAHUN TERBIT</strong>
                  </p>
                </td>
                <td>:</td>
                <td>{book.published_at}</td>
              </tr>
              <tr>
                <td>
                  <p className="pt-2">
                    <strong>KATEGORI</strong>
                  </p>
                </td>
                <td>:</td>
                <td>
                  {book.categories.map((item, index) => (
                    <label key={index} className="badge badge-primary me-2">
                      {item.name}
                    </label>
                  ))}
                </td>
              </tr>
            </table>

            {book.availability_status === "Buku Sedang Dipinjam" ? (
              <button disabled className="btn btn-primary mt-3">
                Sedang Dipinjam
              </button>
            ) : (
              <button onClick={() => borrowBook(book.id)} className="btn btn-primary mt-3">Pinjam Buku</button>
            )}
          </div>
        </div>
      </div>

      <div className="mt-5">
        <h4 className="fw-bold pt-5 pb-2">KIRIM ULASAN</h4>

      {name != undefined ? (
        <>
        <textarea
          id="review"
          value={review}
          onChange={(e) => setReview(e.target.value)}
          placeholder="Ketikkan disini"
          className="form-control"
          style={{ height: "80px" }}
        />
        <div className="d-flex justify-content-between mt-2 align-items-center">
          <div 
            className="stars-container py-3" 
            onMouseLeave={handleMouseLeave}
          >
            {renderStars()}
          </div>

          <div>
            <button 
              className="btn btn-primary" 
              onClick={handleSubmitReview}
              disabled={isLoading}
            >
              {isLoading ? 'Mengirim...' : 'Kirim'}
            </button>
          </div>
        </div>
        </>
      ) : (
        <div className="alert alert-danger">Login terlebih dahulu</div>
      )}
      </div>

      <div className="">
        <h4 className="fw-bold pt-5 pb-2">ULASAN</h4>

        {reviews.map((item, index) => (
        <div key={index} className="">
          <div className="d-flex justify-content-between">
            <div className="">
              <div className="d-flex gap-3 align-items-center mb-1">
                <h5 className="mb-0">{item.user.name}</h5>

                <div className="stars-container">
                  {renderReviewStars(item.rating)}
                </div>
              </div>

              <p className="text-secondary">{item.user.address}</p>
            </div>

            <div className="">
              <h5 className="mb-0">{formatDate(item.created_at)}</h5>
            </div>
          </div>

          <div className="">
            <p>
              {item.review}
            </p>
          </div>
        </div>
        ))}
      </div>
    </div>
    </>
  );
};
