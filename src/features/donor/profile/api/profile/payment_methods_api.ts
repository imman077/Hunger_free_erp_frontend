import axiosInstance from "../../../../../global/utils/axios-instance";

export const paymentMethodsService = {
  getPaymentMethods: async () => {
    const res = await axiosInstance.get("donor-profiles/me/payment-methods/");
    return res.data; // { bankAccounts: [...], upiIds: [...] }
  },
  addBankAccount: async (bankAccount: any) => {
    const res = await axiosInstance.post("donor-profiles/me/payment-methods/", { bankAccount });
    return res.data;
  },
  addUpiId: async (upiId: any) => {
    const res = await axiosInstance.post("donor-profiles/me/payment-methods/", { upiId });
    return res.data;
  },
  deletePaymentMethod: async (id: string) => {
    const res = await axiosInstance.delete(`donor-profiles/me/payment-methods/${id}/`);
    return res.data;
  }
};
