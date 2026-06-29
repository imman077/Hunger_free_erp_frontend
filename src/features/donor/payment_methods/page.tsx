import { useEffect } from "react";
import { onInit, onDestroy } from "./controller/donor_payment_methods_controller";
import { useDonorStore } from "../store/donor-store";
import { donorPaymentMethodsInputModel } from "./store/donor_payment_methods_store";
import { PaymentMethodsBodyField } from "./components/donor_payment_methods_component";

export default function DonorPaymentMethodsPage() {
  useEffect(() => {
    onInit();
    return () => {
      onDestroy();
    };
  }, []);

  const bankAccounts = useDonorStore((state) => state.data.bankAccounts);
  const upiIds = useDonorStore((state) => state.data.upiIds);
  const isLoading = donorPaymentMethodsInputModel.useSelector(
    (s) => s.donorPaymentMethodsData?.loading ?? false
  );

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <PaymentMethodsBodyField
        bankAccounts={bankAccounts}
        upiIds={upiIds}
        isLoading={isLoading}
      />
    </div>
  );
}