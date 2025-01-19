import { useEffect, useState } from "react";
import client from "../../Utils/client";
import { useNavigate } from "react-router-dom";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_green.css";

export const Report = () => {
  const [borrowRecords, setBorrowRecords] = useState([]);
  const [borrowStatus, setBorrowStatus] = useState("");
  const [borrowVerif, setBorrowVerif] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const nav = useNavigate();

  useEffect(() => {
    getBorrowRecords();
  }, [borrowStatus, borrowVerif, startDate, endDate]);

  const getBorrowRecords = () => {
    client
      .get(`report`, {
        params: {
          borrow_status: borrowStatus,
          borrow_verif: borrowVerif,
          start_date: startDate,
          end_date: endDate,
        },
      })
      .then(({ data }) => {
        setBorrowRecords(data.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const printReport = () => {
    nav("/print/laporan", {
      state: {
        borrowStatus,
        borrowVerif,
        startDate,
        endDate
      }
    });
  };

  return (
    <>
      <div className="card py-3">
        <div className="card-body">
          <div className="d-flex justify-content-between mb-3 align-items-center">
            <h3 className="mb-0">Laporan Peminjaman</h3>

            <button onClick={printReport} className="btn btn-outline-dark">
              <i className="fa fa-download me-2"></i>
              Cetak Laporan
            </button>
          </div>

          <div className="row">
            <div className="col-12 col-md-6 col-xl-3 mb-3">
              <Flatpickr
                className="form-control"
                placeholder="Pilih tanggal mulai"
                options={{
                  dateFormat: "Y-m-d", // Format tanggal saja
                  enableTime: false,    // Nonaktifkan waktu
                  time_24hr: true
                }}
                onChange={(date) => {
                  if (date[0]) {
                    const formattedDate = date[0].toLocaleDateString('en-CA'); // Format Y-m-d
                    setStartDate(formattedDate);
                  }
                }}
              />
            </div>

            <div className="col-12 col-md-6 col-xl-3 mb-3">
              <Flatpickr
                className="form-control"
                placeholder="Pilih tanggal mulai"
                options={{
                  dateFormat: "Y-m-d", // Format tanggal saja
                  enableTime: false,    // Nonaktifkan waktu
                  time_24hr: true
                }}
                onChange={(date) => {
                  if (date[0]) {
                    const formattedDate = date[0].toLocaleDateString('en-CA'); // Format Y-m-d
                    setEndDate(formattedDate);
                  }
                }}
              />
            </div>

            <div className="col-12 col-md-6 col-xl-3 mb-3">
              <select
                className="form-select"
                onChange={(e) => setBorrowVerif(e.target.value)}
                style={{height: '100%'}}
              >
                <option value="">Pilih Verifikasi Peminjaman</option>
                <option value="menunggu">Menunggu</option>
                <option value="disetujui">Disetujui</option>
                <option value="ditolak">Ditolak</option>
              </select>
            </div>

            <div className="col-12 col-md-6 col-xl-3 mb-3">
              <select
                className="form-select"
                onChange={(e) => setBorrowStatus(e.target.value)}
                style={{height: '100%'}}
                >
                <option value="">Pilih Status Peminjaman</option>
                <option value="borrowed">Dipinjam</option>
                <option value="returned">Dikembalikan</option>
              </select>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-bordered table-striped">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Nama Peminjam</th>
                  <th>Buku</th>
                  <th>Tanggal Peminjaman</th>
                  <th>Tanggal Pengembalian</th>
                  <th>Status Peminjaman</th>
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
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7}>Data laporan peminjaman kosong</td>
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
