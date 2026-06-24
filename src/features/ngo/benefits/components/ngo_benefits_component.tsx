"use client";

import { memo } from "react";

export const BenefitsBodyField = memo(() => {
  return (
    <div className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Benefits Whole Body</h3>
    </div>
  );
});
BenefitsBodyField.displayName = "BenefitsBodyField";
