import axiosClient from "./axiosClient";

const aiApi = {
  enhance: (file) => {
    const formData = new FormData();
    formData.append("file", file);
    return axiosClient.post("/ai/enhance", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  
  getStatus: (uuid) => {
    return axiosClient.get(`/ai/status/${uuid}`);
  }
};

export default aiApi;
