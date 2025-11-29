import clientApi from "../config/apiConfig"


export const sentOtp = async (data: { name: string, email: string, password: string }) => {
    try {
        const res = await clientApi.post('/sent-otp', data);
        return res;
    } catch (error) {
        if (error instanceof Error)
            console.log(error.message)
    }
};


export const verifyOtp = async (data: { email: string, otp: string }) => {
    try {
        const res = await clientApi.post('/verify-otp', data);
        return res;
    } catch (error) {
        if (error instanceof Error)
            console.log(error.message)
    }
}


export const register = async (data: { name: string, email: string, password: string }) => {
    try {
        const res = await clientApi.post('/register', data);
        return res;
    } catch (error) {
        if (error instanceof Error)
            console.log(error.message)
    }
};


export const login = async (data: { email: string, password: string }) => {
    try {
        const res = await clientApi.post('/login', data);
        return res;
    } catch (error) {
        if (error instanceof Error)
            console.log(error.message)
    }
}


export const logout = async () => {
    try {
        const res = await clientApi.post('/logout');
        return res;
    } catch (error) {
        if (error instanceof Error)
            console.log(error.message)
    }
}


export const getHome = async () => {
    try {
        const res = await clientApi.get('/home');
        return res;
    } catch (error) {
        if (error instanceof Error)
            console.log(error.message)
    }
}


export const refreshToken = async () => {
    try {
        const res = await clientApi.get('/refresh-token');
        return res;
    } catch (error) {
        if (error instanceof Error)
            console.log(error.message)
    }
}