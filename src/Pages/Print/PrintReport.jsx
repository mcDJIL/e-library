import { useEffect, useState } from "react";
import client from "../../Utils/client";
import "../../assets/css/style.css";

export const PrintReport = () => {
  const [borrowRecords, setBorrowRecords] = useState([]);

  useEffect(() => {
    getBorrowRecords();
  }, []);

  const getBorrowRecords = () => {
    client.get("report").then(({ data }) => {
      setBorrowRecords(data.data);
      console.log(data.data);
    }).finally(() => {
      setTimeout(() => {
        window.print();
      }, 500);
    });
  };

  return (
    
    <div className="">
      <style>
        {`
          @media print {
            .table th, .table td {
              margin: 0;
              padding: 15px;
            }
          }
        `}
      </style>
      <div className="card py-3">
        <div className="">
          <div className="d-flex justify-content-between mb-3 align-items-center">
            <h3 className="mb-0">Laporan Peminjaman</h3>
          </div>

          <div className="table">
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
                        <td style={{width: '40px'}}>{index + 1}</td>
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
    </div>
  );
};