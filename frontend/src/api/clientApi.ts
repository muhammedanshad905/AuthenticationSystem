import clientApi from "../config/apiConfig"


export const sentOtp = async (data: { name: string, email: string, password: string }) => {
    try {
        const res = await clientApi.post('/send-otp', data);
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
        const refreshToken = localStorage.getItem('auth-accessToken');
        
        const res = await clientApi.post('/logout', JSON.parse(refreshToken as string));
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