import * as actionTypes from './actionTypes';
import axios from 'axios';

export const authStart = () => {
    return {
        type: actionTypes.AUTH_START
    }
}

export const authSuccess = (token, userId) => {
    return {
        type: actionTypes.AUTH_SUCCESS,
        idToken: token,
        userId: userId
    }
}

export const authFail = error => {
    return {
        type: actionTypes.AUTH_FAIL,
        error: error
    }
}
export const auth = (email, password, isSignUp) => {
    return dispatch => {
        const authData = {
            email: email,
            password: password,
            returnSecureToken: true
        }
        dispatch(authStart())
        let url = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyArgbRp4IZt6QKe-RlvH9tuYK6Urntg8wI';
        if (!isSignUp) {
            url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyArgbRp4IZt6QKe-RlvH9tuYK6Urntg8wI';
        }
        axios.post(url, authData)
            .then(res => {
                console.log(res)
                dispatch(authSuccess(res.data.idToken, res.data.localId))
            })
            .catch(err => {
                console.log(err)
                dispatch(authFail(err.message))
            })
    }
}