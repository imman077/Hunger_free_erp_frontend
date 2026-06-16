import axiosInstance from "../../../../global/utils/axios-instance";

export const donationsApiService = {
  getDonations: () => axiosInstance.get("/admin/donations/"),
  updateDonation: (id: number, data: any) => axiosInstance.patch(`/admin/donations/${id}/`, data),
  getVolunteers: () => axiosInstance.get("/admin/volunteers/"),
};

export default donationsApiService;
