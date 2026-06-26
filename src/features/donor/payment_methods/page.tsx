import { useEffect } from "react";
import { onInit, onDestroy } from "./controller/donor_payment_methods_controller";
import { useDonorProfile } from "../profile/hooks/useDonorProfile";
import { PaymentMethodsBodyField } from "./components/donor_payment_methods_component";

export default function DonorPaymentMethodsPage() {
  useEffect(() => {
    onInit();
    return () => {
      onDestroy();
    };
  }, []);

  const { bankAccounts, upiIds, isLoading } = useDonorProfile({ skipTiers: true });

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