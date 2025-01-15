import { useEffect, useState } from 'react';
import hero from '../../assets/images/hero.jpg';
import client from '../../Utils/client';

export const Home = () => {
    const [books, setBooks] = useState([]);

    useEffect(() => {
        getBooks();
    }, []);

    const getBooks = () => {
        client.get(`popular-books`).then(({data}) => {
            console.log(data);
            
            setBooks(data.data);
        }).catch((error) => {
            console.error(error);
        })
    }

    return (
        <>
        <div className="">
            <img style={{width: '100%', height: '500px', objectPosition: 'bottom'}} className='object-fit-cover' src={hero} alt="" />
        </div>

        <div className="container pt-5">
            <h2>Daftar Buku Populer</h2>

            <div className="row mt-4">
                {books.map((item, index) => (
                <div key={index} className="col-12 col-md-6 col-lg-4 col-xl-3 mb-5 d-flex justify-content-center text-decoration-none">
                    <div className="card" style={{width: '280px', border: '1px solid #000', height: '450px'}}>
                        <a href={`/detail-buku/${item.id}`}>
                        <img style={{height: '280px'}} src={`http://127.0.0.1:8000/${item.book_cover}`} alt="" className="card-img-top object-fit-cover" />
                        </a>
                        <div className="card-body">
                            <h5 className="card-title mb-2" style={{lineHeight: '25px'}}>{item.title}</h5>
                            <p className="card-text">{item.description}</p>
                        
                            <div className="mt-3 d-flex justify-content-end card-button">

                            </div>
                        </div>
                    </div>
                </div>
                ))}
            </div>
        </div>
        </>
    )
}