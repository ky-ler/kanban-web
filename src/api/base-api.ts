import ky, { type KyInstance, type Options, HTTPError } from "ky";
import { userManager } from "../config/auth";
import { queryClient } from "@/lib/query";
import { router } from "@/lib/router";

export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  message?: string;
}

export interface ApiError extends Error {
  status?: number;
  response?: unknown;
}

const client = ky.create({
  prefixUrl: import.meta.env.VITE_API_URL,
  hooks: {
    beforeRequest: [
      async (request) => {
        try {
          // Authentication interceptor
          const user = await userManager.getUser();
          if (!user) {
            // Clear queries and redirect to login
            queryClient.invalidateQueries();
            router.navigate({
              to: "/",
              search: {
                redirect: window.location.pathname,
              },
            });
            throw new Error("User is not authenticated!");
          }

          const accessToken = user.access_token;
          request.headers.set("Authorization", `Bearer ${accessToken}`);
          request.headers.set("Content-Type", "application/json");
        } catch (error) {
          console.error("Authentication error:", error);
          throw error;
        }
      },
    ],
    afterResponse: [
      async (request, _options, response) => {
        // Log successful requests in development
        if (import.meta.env.DEV) {
          console.log(
            `✅ ${request.method} ${request.url} - ${response.status}`
          );
        }

        console.log(JSON.stringify(response.text()));

        // if (response.headers.get("content-length"))
      },
    ],
    beforeError: [
      async (error) => {
        const { request, response } = error;

        // Enhanced error logging
        console.error(
          `❌ ${request.method} ${request.url} - ${response?.status || "Network Error"}`
        );

        // parse request
        const requestBody = await request.clone().json();
        console.log("Request Body:", requestBody);

        if (response) {
          try {
            const errorBody = await response.clone().json();
            console.error("Error details:", errorBody);

            // Handle specific error cases
            if (response.status === 401) {
              // Token expired or invalid
              queryClient.invalidateQueries();
              router.navigate({ to: "/" });
            } else if (response.status === 403) {
              console.error("Access forbidden - insufficient permissions");
            } else if (response.status === 404) {
              console.error("Resource not found");
            }

            // Create enhanced error with response data
            const enhancedError = new HTTPError(
              response,
              request,
              error.options
            );
            (enhancedError as ApiError).response = errorBody;

            return enhancedError;
          } catch (parseError) {
            console.error("Failed to parse error response:", parseError);
          }
        }

        return error;
      },
    ],
  },
});

// Generic request method with retry logic
async function request<T>(url: string, options: Options = {}): Promise<T> {
  return await client(url, options).json<T>();
}

// HTTP Methods
async function get<T>(url: string, options?: Options): Promise<T> {
  return request<T>(url, { ...options, method: "GET" });
}

async function post<T>(
  url: string,
  data?: unknown,
  options?: Options
): Promise<T> {
  return request<T>(url, {
    ...options,
    method: "POST",
    json: data,
  });
}

async function put<T>(
  url: string,
  data?: unknown,
  options?: Options
): Promise<T> {
  return request<T>(url, {
    ...options,
    method: "PUT",
    json: data,
  });
}

async function patch<T>(
  url: string,
  data?: unknown,
  options?: Options
): Promise<T> {
  return request<T>(url, {
    ...options,
    method: "PATCH",
    json: data,
  });
}

async function deleteRequest<T>(url: string, options?: Options): Promise<T> {
  return request<T>(url, { ...options, method: "DELETE" });
}

// Get the underlying ky instance for advanced usage
function getClient(): KyInstance {
  return client;
}

// Export the API client as an object
export const apiClient = {
  get,
  post,
  put,
  patch,
  delete: deleteRequest,
  getClient,
};
