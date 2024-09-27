import axios from "axios";

const initApi = (url?: string, headers = {}) => {
  if (url == null) throw new Error("URL is required");
  const api = axios.create({
    baseURL: url,
    timeout: 100000,
    headers: {
      "Content-Type": "application/json",
      accept: "*/*",
      ...headers,
    },
  });

  api.interceptors.response.use(
    (response) => response,
    (error) => {
      // Accessing the URL and the body of the request
      console.log("\x1b[31m", error.config?.headers?.Authorization);
      console.log(
        "\x1b[31m",
        "ERROR REQUEST URL:",
        error.config?.baseURL + "/" + error.config.url
      );
      console.log("\x1b[31m", "ERROR REQUEST BODY:", error.config.data);

      return Promise.reject(error);
    }
  );

  return api;
};

export default initApi;
