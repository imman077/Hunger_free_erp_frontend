import axiosInstance from "../../../../global/utils/axios-instance";

export const settingsApiService = {
  getConfig: (key: string) => axiosInstance.get(`/admin/config/${key}/`),
  updateConfig: (key: string, data: any) => axiosInstance.put(`/admin/config/${key}/`, data),
  createConfig: (data: any) => axiosInstance.post(`/admin/config/`, data),
};

export default settingsApiService;
