import { useEffect, useState } from "react";
import client from "../../Utils/client";
import Swal from "sweetalert2";

export const BorrowHistory = () => {
  const [borrowRecords, setBorrowRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getBorrowRecords();
  }, []);

  const getBorrowRecords = () => {
    client
      .get(`borrow-history`)
      .then(({ data }) => {
        setBorrowRecords(data.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const borrowBook = (id) => {
    setIsLoading(true);

    client
      .post(`borrow-book/${id}`)
      .then(({ data }) => {
        Swal.fire({
          title: "Berhasil",
          text: data.message,
          icon: "info",
        });
        getBorrowRecords();
      })
      .catch((error) => {
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
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="container">
      <div className="pt-5">
        <div className="">
          <div className="d-flex justify-content-between mb-3 align-items-center">
            <h2 className="mb-0">Riwayat Peminjaman</h2>
          </div>

          <div className="table-responsive mt-4">
            <table className="table table-bordered table-striped">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Nama Peminjam</th>
                  <th>Buku</th>
                  <th>Tanggal Peminjaman</th>
                  <th>Tanggal Pengembalian</th>
                  <th>Status Peminjaman</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {borrowRecords.length > 0 ? (
                  borrowRecords.map((item, index) => (
                    <tr key={index}>
                      <td style={{ width: "50px" }}>{index + 1}</td>
                      <td>{item.user.name}</td>
                      <td>{item.book.title}</td>
                      <td>{item.borrowed_at}</td>
                      <td>{item.returned_at ?? "-"}</td>
                      <td>
                        {item.borrow_verif === "menunggu" ? (
                          <label className="badge badge-info">
                            Menunggu Konfirmasi
                          </label>
                        ) : item.borrow_verif === "ditolak" ? (
                          <label className="badge badge-danger">Ditolak</label>
                        ) : item.borrow_status === "borrowed" ? (
                          <label className="badge badge-danger">Dipinjam</label>
                        ) : (
                          <label className="badge badge-success">
                            Dikembalikan
                          </label>
                        )}
                      </td>
                      <td>
                        {item.borrow_status == 'returned' ? (
                            item.book.availability_status == 'Buku Sedang Dipinjam' ? (    
                                <button className="btn btn-primary" disabled>Buku Sedang Dipinjam</button>
                            ) : (
                                <button className="btn btn-primary" onClick={() => borrowBook(item.book_id)} disabled={isLoading}>
                                    {isLoading && (
                                        <i className="fa fa-spinner"></i>
                                    )}

                                    {isLoading ? ' Loading' : 'Pinjam Lagi'}
                                </button>
                            )
                        ) : (
                            '-'
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7}>Riwayat peminjaman kosong</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
