export const UserBook = () => {

    return (
        <div className="container pt-5">
            <h2>Daftar Buku</h2>

            <div className="row mt-4">
                <a href="/detail-buku/1" className="col-12 col-md-6 col-lg-4 col-xl-3 mb-5 d-flex justify-content-center text-decoration-none">
                    <div className="card" style={{width: '280px', border: '1px solid #000', height: '500px'}}>
                        <img style={{height: '280px'}} src="http://127.0.0.1:8000/uploads/books/1736841607_WhatsApp%20Image%202024-08-17%20at%2021.34.39.jpeg" alt="" className="card-img-top object-fit-cover" />
                        <div className="card-body">
                            <h5 className="card-title mb-2" style={{lineHeight: '25px'}}>Lorem ipsum dolor sit amet consectetur</h5>
                            <p className="card-text">Lorem ipsum dolor sit amet consectetur adipisicing elit. lorem ipsum</p>
                        
                            <div className="mt-3 d-flex justify-content-end">

                                <button className="btn btn-outline-primary btn-rounded btn-icon me-2">
                                    <i className="ti-book"></i>
                                </button>
                                <button className="btn btn-outline-danger btn-rounded btn-icon">
                                    <i className="ti-heart"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </a>
            </div>
        </div>
    )
}