import { useEffect, useState } from "react";
import client from "../../Utils/client";

export const BookReview = () => {
  const [borrowRecords, setBorrowRecords] = useState([]);

  useEffect(() => {
    getBorrowRecords();
  }, []);

  const getBorrowRecords = () => {
    client
      .get(`book-reviews`)
      .then(({ data }) => {
        setBorrowRecords(data.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const renderReviewStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <i
        key={index}
        className={`fa fa-star ${index < rating ? "text-warning" : "text-muted"}`}
      />
    ));
  };

  return (
    <>
      <div className="card py-3">
        <div className="card-body">
          <div className="d-flex justify-content-between mb-3 align-items-center">
            <h3 className="mb-0">Ulasan Buku</h3>
          </div>

          <div className="table-responsive">
            <table className="table table-bordered table-striped">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Nama</th>
                  <th>Buku</th>
                  <th>Ulasan</th>
                  <th>Penilaian</th>
                </tr>
              </thead>
              <tbody>
                {borrowRecords.length > 0 ? (
                  borrowRecords.map((item, index) => (
                    <tr key={index}>
                      <td style={{ width: "50px" }}>{index + 1}</td>
                      <td>{item.user.name}</td>
                      <td>{item.book.title}</td>
                      <td>{item.review}</td>
                      <td>{renderReviewStars(item.rating)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7}>Data ulasan buku kosong</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};
