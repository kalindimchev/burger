import * as actionTypes from './actionTypes';
import axios from 'axios';

export const authStart = () => {
    return {
        type: actionTypes.AUTH_START
    }
}

export const authSuccess = authData => {
    return {
        type: actionTypes.AUTH_SUCCESS,
        authData: authData
    }
}

export const authFail = error => {
    return {
        type: actionTypes.AUTH_FAIL,
        error: error
    }
}
export const auth = (email, password) => {
    console.log(email, password)
    return dispatch => {
        const authData = {
            email: email,
            password: password,
            returnSecureToken: true
        }
        dispatch(authStart())
        axios.post('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyArgbRp4IZt6QKe-RlvH9tuYK6Urntg8wI', authData)
            .then(res => {
                console.log(res)
                dispatch(authSuccess(res.data))
            })
            .catch(err => {
                console.log(err)
                dispatch(authFail(err))
            })
    }
}