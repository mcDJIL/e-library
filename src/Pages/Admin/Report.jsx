import { useEffect, useState } from "react";
import client from "../../Utils/client";
import { useNavigate } from "react-router-dom";

export const Report = () => {
  const [borrowRecords, setBorrowRecords] = useState([]);

  const nav = useNavigate();

  useEffect(() => {
    getBorrowRecords();
  }, []);

  const getBorrowRecords = () => {
    client.get("report").then(({ data }) => {
      setBorrowRecords(data.data);
      console.log(data.data);
    });
  };

  const printReport = () => {
    nav('/print/laporan');
  }

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

          <div className="table-responsive">
            <table className="table table-bordered table-striped">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Nama Peminjam</th>
                  <th>Buku</th>
                  <th>Tanggal Peminjaman</th>
                  <th>Tanggal Pengembalian</th>
                </tr>
              </thead>
              <tbody>
                
                {borrowRecords.length > 0 ? (
                    borrowRecords.map((item, index) => (
                      <tr key={index}>
                        <td style={{width: '50px'}}>{index + 1}</td>
                        <td>{item.user.name}</td>
                        <td>{item.book.title}</td>
                        <td>{item.borrowed_at}</td>
                        <td>{item.returned_at ?? '-'}</td>
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