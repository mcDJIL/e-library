import { createBrowserRouter } from "react-router-dom";
import { AdminSkin } from "../Skins/adminSkin";
import { Dashboard } from "../Pages/Admin/dashboard";
import { Login } from "../Pages/Auth/login";
import { Register } from "../Pages/Auth/register";
import { UserSkin } from "../Skins/userSkin";
import { Book } from "../Pages/Admin/book";
import { Category } from "../Pages/Admin/Category";
import { User } from "../Pages/Admin/User";
import { Admin } from "../Pages/Admin/Admin";
import { Borrowing } from "../Pages/Admin/Borrowing";
import { Home } from "../Pages/User/Home";
import { UserBook } from "../Pages/User/UserBook";
import { DetailBook } from "../Pages/User/DetailBook";
import { Collection } from "../Pages/User/Collection";
import { Report } from "../Pages/Admin/Report";
import { PrintReport } from "../Pages/Print/PrintReport";
import { BookReview } from "../Pages/Admin/BookReview";
import { BorrowHistory } from "../Pages/User/BorrowHistory";

const router = createBrowserRouter([
    {
        path: '/',
        element: <UserSkin />,
        children: [
            {
                path: '/',
                element: <Home />
            },
            {
                path: '/buku',
                element: <UserBook />
            },
            {
                path: '/detail-buku/:id',
                element: <DetailBook />
            },
            {
                path: '/koleksi',
                element: <Collection />
            },
            {
                path: '/riwayat',
                element: <BorrowHistory />
            }
        ],
    },
    {
        path: '/',
        element: <AdminSkin />,
        children: [
            {
                path: '/dashboard',
                element: <Dashboard />
            },
            {
                path: '/master-data/buku',
                element: <Book />
            },
            {
                path: '/master-data/kategori',
                element: <Category />
            },
            {
                path: '/master-data/admin',
                element: <Admin />
            },
            {
                path: '/master-data/pengguna',
                element: <User />
            },
            {
                path: '/manajemen/ulasan',
                element: <BookReview />
            },
            {
                path: '/manajemen/peminjaman',
                element: <Borrowing />
            },
            {
                path: '/laporan',
                element: <Report />
            },
        ],
    },
    {
        path: '/login',
        element: <Login />
    },
    {
        path: '/register',
        element: <Register />
    },
    {
        path: '/print/laporan',
        element: <PrintReport />
    },
])

export default router;