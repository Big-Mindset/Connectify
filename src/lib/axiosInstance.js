import { deletedatabase } from "@/database/indexdb";
import axios from "axios"
import { signOut } from "next-auth/react";

let api = axios.create({
    baseURL : "/api",
    withCredentials : true
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await signOut({ callbackUrl: "/login" }); 
      await deletedatabase()
    }
    return Promise.reject(error);
  }
);

export default api;