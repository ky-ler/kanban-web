import axios from "axios";
import { userManager } from "../config/auth";
import { queryClient } from "@/lib/query";
import { router } from "@/lib/router";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

api.interceptors.request.use(
  async (config) => {
    const user = await userManager.getUser();
    if (!user) {
      // if user is not authenticated, redirect to login page
      // and invalidate all queries
      // invalidate queries
      queryClient.invalidateQueries();
      // redirect to login page
      router.navigate({
        to: "/",
        search: {
          redirect: window.location.pathname,
        },
      });

      throw new Error("User is not authenticated!");
    }

    const access_token = user.access_token;
    config.headers.Authorization = `Bearer ${access_token}`;

    return config;
  },
  (error: Error) => {
    return Promise.reject(error);
  }
);

export { api };
