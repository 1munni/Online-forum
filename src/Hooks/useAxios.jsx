import axios from "axios";

const axiosInstance=axios.create({
     baseURL: `https://assignment-12-serversite-sooty.vercel.app`,
})

const useAxios = () => {
    return axiosInstance;
};

export default useAxios;