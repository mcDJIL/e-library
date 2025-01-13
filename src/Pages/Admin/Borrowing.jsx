import { useEffect, useState } from "react";
import client from "../../Utils/client";
import Swal from "sweetalert2";
import { showToast } from "../../Constants/ShowToast";
import Toastr from "../../Components/Toastr";

export const Borrowing = () => {
  const [borrowRecords, setBorrowRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState(null);

  useEffect(() => {
    getBorrowRecords();
  }, []);

  const getBorrowRecords = () => {
    client.get("borrow-records").then(({ data }) => {
      setBorrowRecords(data.data);
      console.log(data.data);
    });
  };

  const closeModal = () => {
    const modal = document.getElementById('detailModal');
    const bsModal = bootstrap.Modal.getInstance(modal);
    bsModal.hide();
}

  const handleShowDetail = (item) => {
    setSelectedDetail(item);
  }

  const handleStatus = (id, status) => {
    setIsLoading(true)

    let data = {
        borrow_status: status
    }

    Swal.fire({
        title: "Apakah kamu yakin?",
        text: "Untuk menyelesaikan peminjaman ini",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Ya",
        cancelButtonText: "Batal"
      }).then((result) => {
        if (result.isConfirmed) {
            client.put(`borrow-records/${id}`, data).then(({data}) => {
                showToast(data.message, 'success');
                closeModal();
                getBorrowRecords();
            }).catch((error) => {
                showToast(error.response.data.message, 'error');
            }).finally(() => {
                setIsLoading(false);
            })
        }
      });
    }

  return (
    <>
    <Toastr />

      <div className="card py-3">
        <div className="card-body">
          <div className="d-flex justify-content-between mb-3 align-items-center">
            <h3 className="mb-0">Manajemen Peminjaman</h3>
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
                  <th>Aksi</th>
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
                        <td>
                            {item.borrow_status == 'borrowed' ? (
                                <label className="badge badge-danger">Dipinjam</label>
                            ) : (
                                <label className="badge badge-success">Dikembalikan</label>
                            )}
                        </td>
                        <td>
                          <button 
                            className="btn btn-info btn-rounded btn-icon me-2 text-white"
                            data-bs-toggle="modal" data-bs-target="#detailModal"
                            onClick={() => handleShowDetail(item)}
                          >
                            <i className="ti-eye"></i>
                          </button>
                        </td>
                      </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan={7}>Data kategori kosong</td>
                    </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="modal fade" id="detailModal" tabIndex="-1" aria-labelledby="detailModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered" style={{maxWidth: '800px'}}>
            <div className="modal-content">
            <div className="modal-header">
                <h1 className="modal-title fs-5" id="detailModalLabel">Detail Peminjaman</h1>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
                {selectedDetail && (
                <div className="row borrow-detail">
                    <h3 className="mb-4">Status {selectedDetail.borrow_status == 'borrowed' ? 
                        <span className="text-danger">Dipinjam</span> : 
                        <span className="text-success">Dikembalikan</span>}
                    </h3>

                    <div className="col-12 col-md-6 mb-3">
                        <p><strong>Tanggal Peminjaman:</strong> {selectedDetail.borrowed_at}</p>
                    </div>
                    <div className="col-12 col-md-6 mb-3">
                        <p><strong>Tanggal Pengembalian:</strong> {selectedDetail.returned_at ?? '-'}</p>
                    </div>
                    <div className="col-12">
                        <p style={{textDecoration: 'underline'}}><strong>Peminjam</strong></p>
                    </div>
                    <div className="col-12 col-md-6 mb-3">
                        <p><strong>Nama:</strong> {selectedDetail.user.name}</p>
                    </div>
                    <div className="col-12 col-md-6 mb-3">
                        <p><strong>Email:</strong> {selectedDetail.user.email}</p>
                    </div>
                    <div className="col-12 col-md-6 mb-3">
                        <p><strong>Alamat:</strong> {selectedDetail.user.address}</p>
                    </div>
                    <div className="col-12">
                        <p style={{textDecoration: 'underline'}}><strong>Buku</strong></p>
                    </div>
                    <div className="col-12 col-md-6 mb-3">
                        <p><strong>Judul:</strong> {selectedDetail.book.title}</p>
                    </div>
                    <div className="col-12 col-md-6 mb-3">
                        <p><strong>Deskripsi:</strong> {selectedDetail.book.description}</p>
                    </div>
                    <div className="col-12 col-md-6 mb-3">
                        <p><strong>Penulis:</strong> {selectedDetail.book.author}</p>
                    </div>
                    <div className="col-12 col-md-6 mb-3">
                        <p><strong>Penerbit:</strong> {selectedDetail.book.publisher}</p>
                    </div>
                    <div className="col-12 mb-3">
                        <p><strong>Sampul Buku:</strong></p>
                        <img style={{width: '200px'}} src={`http://127.0.0.1:8000/${selectedDetail.book.book_cover}`} alt="" />
                    </div>
                </div>
                )}
            </div>
            <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Tutup</button>
                {selectedDetail && (
                    selectedDetail.borrow_status == 'returned' ? (
                        <button disabled={isLoading} onClick={ () => handleStatus(selectedDetail.id, 'borrowed') } type="button" className="btn btn-danger">
                            {isLoading && (
                                <i className="fa fa-spinner fa-spin me-1"></i>
                            )}
        
                            {isLoading ? ' Loading' : 'Batalkan'}
                        </button>
                    ) : (
                        <button disabled={isLoading} onClick={ () => handleStatus(selectedDetail.id, 'returned') } type="button" className="btn btn-primary">
                            {isLoading && (
                                <i className="fa fa-spinner fa-spin me-1"></i>
                            )}

                            {isLoading ? ' Loading' : 'Kembalikan'}
                        </button>
                    )
                )}
            </div>
            </div>
        </div>
      </div>
    </>
  );
};