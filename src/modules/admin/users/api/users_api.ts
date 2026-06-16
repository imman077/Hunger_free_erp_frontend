import axiosInstance from "../../../../global/utils/axios-instance";

export const usersApiService = {
  getUsers: () => axiosInstance.get("/admin/users/"),
  getDonors: () => axiosInstance.get("/admin/donors/"),
  updateDonor: (id: number, data: any) => axiosInstance.patch(`/admin/donors/${id}/`, data),
  getNGOs: () => axiosInstance.get("/admin/ngos/"),
  updateNGO: (id: number, data: any) => axiosInstance.patch(`/admin/ngos/${id}/`, data),
  getVolunteers: () => axiosInstance.get("/admin/volunteers/"),
  updateVolunteer: (id: number, data: any) => axiosInstance.patch(`/admin/volunteers/${id}/`, data),
};

export default usersApiService;
