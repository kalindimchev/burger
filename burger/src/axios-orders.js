import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://burgerapp-reactudemy.firebaseio.com/'
});

export default instance;