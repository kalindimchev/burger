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

export const checkAuthTimeOut = (expiresIn) => {
    return dispatch => {
        setTimeout(function() {
            dispatch(logout());
        }, expiresIn * 1000);
    }
}

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('expirationDate');
    localStorage.removeItem('userId');
    return {
        type: actionTypes.AUTH_LOGOUT
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
                localStorage.setItem('token', res.data.idToken);
                localStorage.setItem('expirationDate', new Date(new Date().getTime() + res.data.expiresIn * 1000));
                localStorage.setItem('userId', res.data.localId);
                dispatch(authSuccess(res.data.idToken, res.data.localId))
                dispatch(checkAuthTimeOut(res.data.expiresIn))
            })
            .catch(err => {
                console.log(err)
                dispatch(authFail(err.message))
            })
    }

}

export const setAuthRedirctPath = path => {
    return {
        type: actionTypes.SET_AUTH_REDIRECT_PATH,
        path: path
    }
}

export const authCheckState = () => {
    return dispatch => {
        const token = localStorage.getItem('token');
        if (!token) {
            dispatch(logout());
        } else {
            const expirationDate = new Date(localStorage.getItem('expirationDate'));
            if (expirationDate > new Date()) {
                const userId = localStorage.getItem('userId');
                dispatch(authSuccess(token, userId));
                dispatch(checkAuthTimeOut((expirationDate.getTime() - new Date().getTime())/1000));
            } else {
                dispatch(logout());
            }


        }
    }
}