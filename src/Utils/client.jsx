import axios from "axios";
import Cookies from "js-cookie";

const client = axios.create({
    baseURL: `http://127.0.0.1:8000/api/`
})

client.interceptors.request.use((config) => {
    let token = Cookies.get('token');
    
    config.headers = {
        Authorization: `Bearer ${token}`
    }
    
    return config;
}, (error) => {
    return console.error(error);
})

export default client;