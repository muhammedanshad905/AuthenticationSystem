import axios from "axios";
import toast from "react-hot-toast";

const clientApi = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        "Content-Type": "application/json"
    }
});

clientApi.interceptors.request.use((config) => {
    const token = localStorage.getItem('auth-accessToken');

    if(token) {
        config.headers.Authorization = `Bearer ${token}`
    };

    return config;
})


clientApi.interceptors.response.use(
   (response) => response,
    async (error) => {
        
        const originalRequest = error.config;
        
        if(error.response?.status === 403 && !originalRequest._retry) {
            originalRequest._retry = true;
        

        console.log( `${import.meta.env.VITE_API_URL}/refresh-token`)
        try {
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/refresh-token`,
          {},
          { withCredentials: true }
        );

        const newAccessToken = res.data.accessToken;
        localStorage.setItem('auth-accessToken', newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axios(originalRequest);
      } catch (refreshErr) {
        return Promise.reject(refreshErr);
      }

   }


    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.message || "Something went wrong";

      switch (status) {
        case 400:
          toast.error(message);
          break;
        case 401:
          toast.error(message);
          break;
        case 403:
          toast.error(message);
          break;
        case 404:
          toast.error(message);
          break;
        case 409:
          toast.error(message);
          break;
        case 500:
          toast.error(message);
          break;
        default:
          toast.error(message);
      }
    } else {
      toast.error("Network error. Please check your connection.");
    }

    return Promise.reject(error); 
  }
);

export default clientApi;