"use client";

import { useEffect, useState } from "react";
import { onInit, onDestroy } from "./controller/volunteer_benefits_controller";
import { BenefitsBodyField } from "./components/volunteer_benefits_component";

export default function Volunteer_benefitsPage() {
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    onInit();

    return () => {
      onDestroy();
    };
  }, []);

  return (
    <div className="flex flex-col h-full overflow-hidden p-4 bg-white dark:bg-gray-900">
      <div className="flex-1 min-h-0">
        <BenefitsBodyField />
      </div>
    </div>
  );
}