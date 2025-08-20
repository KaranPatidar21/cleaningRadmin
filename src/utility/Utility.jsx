import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BASE_URL } from "../../config.js";

const UrbanAdminToken = localStorage.getItem("UrbanAdminToken");

const api = axios.create({
  baseURL: BASE_URL,

  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${UrbanAdminToken}`,
  },
});

// Add a response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 403) {
      // Handle 403 Forbidden error
      toast.error("Session expired. Please login again.");
      
      // Clear local storage
      localStorage.removeItem("UrbanAdminToken");
      localStorage.removeItem("UrbanAdminToken");
  
  
        window.location.href = "/"; // Or use your routing method
  
    }
    return Promise.reject(error);
  }
);

// Function to handle GET requests
export const getData = async (endpoint) => {
  try {
    const response = await api.get(endpoint);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};


export const ImageBaseUrl =  BASE_URL;


// Function to handle POST requests
export const postData = async (endpoint, data) => {
  try {
    const response = await api.post(endpoint, data);
    return response.data;
  } catch (error) {
    console.error("Error posting data:", error);
    throw error;
  }
};

export const postFormData = async (endpoint, data) => {
  try {
    const response = await api.post(endpoint, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error posting data:", error);
    throw error;
  }
};

// Function to handle PUT requests
export const putData = async (endpoint, data) => {
  try {
    const response = await api.put(endpoint, data);
    return response.data;
  } catch (error) {
    console.error("Error updating data:", error);
    throw error;
  }
};

export const putFormData = async (endpoint, data) => {
  try {
    const response = await api.put(endpoint, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating data:", error);
    throw error;
  }
};

// Function to handle DELETE requests
export const deleteData = async (endpoint) => {
  try {
    const response = await api.delete(endpoint);
    return response.data;
  } catch (error) {
    console.error("Error deleting data:", error);
    throw error;
  }
};

// Function to handle image file uploads
export const ImageFileUpload = async (ImageUrl, data) => {
  try {
    const response = await api.post(ImageUrl, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error posting data:", error);
    throw error;
  }
};