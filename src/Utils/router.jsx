import { createBrowserRouter } from "react-router-dom";
import { AdminSkin } from "../Skins/adminSkin";
import { Dashboard } from "../Pages/Admin/dashboard";
import { Login } from "../Pages/Auth/login";
import { Register } from "../Pages/Auth/register";
import { UserSkin } from "../Skins/userSkin";
import { Book } from "../Pages/Admin/book";

const router = createBrowserRouter([
    {
        path: '/',
        element: <UserSkin />,
        children: [
            {
                path: '/',
                element: ''
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
])

export default router;