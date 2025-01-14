import { Outlet } from "react-router-dom"
import { Header } from "../Layouts/User/header"

export const UserSkin = () => {

    return (
        <>
            <Header />

            <Outlet />
        </>
    )
}