import { useEffect } from "react";
import {
  onInit,
  onDestroy,
  refreshData,
} from "./controller/my_donations_controller";
import { myDonationsInputModel } from "./store/my_donations_store";
import { useDonorStore } from "../store/donor-store";
import {
  MyDonationsHeader,
  MyDonationsStats,
  MyDonationsList,
  MyDonationsModals,
} from "./components/my_donations_component";

export default function MyDonationsPage() {
  const isTrackingModalOpen = myDonationsInputModel.useSelector(
    (state) => state.myDonationsData.isTrackingModalOpen
  );
  const selectedDonation = myDonationsInputModel.useSelector(
    (state) => state.myDonationsData.selectedDonation
  );

  // Initialize and destroy page hooks
  useEffect(() => {
    onInit();
    return () => {
      onDestroy();
    };
  }, []);

  const donationHistory = useDonorStore((state) => state.data.donationHistory);
  const isGeneralDetailsOpen = myDonationsInputModel.useSelector(
    (state) => state.myDonationsData.isGeneralDetailsOpen
  );
  const isDetailsModalOpen = myDonationsInputModel.useSelector(
    (state) => state.myDonationsData.isDetailsModalOpen
  );

  // Sync selectedDonation details with refreshed donationHistory data (for live GPS coordinate updates)
  useEffect(() => {
    if ((isGeneralDetailsOpen || isDetailsModalOpen || isTrackingModalOpen) && selectedDonation) {
      const updated = donationHistory.find(
        (d: any) => String(d.id) === String(selectedDonation.id)
      );
      if (updated) {
        myDonationsInputModel.update({ selectedDonation: updated });
      }
    }
  }, [donationHistory, isGeneralDetailsOpen, isDetailsModalOpen, isTrackingModalOpen, selectedDonation]);

  // Auto-refresh active tracking every 5 seconds when tracking modal is open
  useEffect(() => {
    let intervalId: any;
    if (
      isTrackingModalOpen &&
      selectedDonation &&
      (selectedDonation.status === "ASSIGNED" ||
        selectedDonation.status === "PICKED_UP")
    ) {
      intervalId = setInterval(() => {
        refreshData();
      }, 5000);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isTrackingModalOpen, selectedDonation]);

  return (
    <div className="w-full min-h-full flex flex-col space-y-6 max-w-[1600px] mx-auto p-6 md:p-10 bg-transparent pb-32">
      <MyDonationsHeader />
      <MyDonationsStats />
      <MyDonationsList />
      <MyDonationsModals />
    </div>
  );
}
