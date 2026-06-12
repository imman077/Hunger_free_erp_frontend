"use client";

import { useEffect, useState } from "react";
import { Form } from "@heroui/form";

import {
  handleSample_sample_screenSubmit,
  onInit,
  onDestroy,
} from "./controller/sample_sample_screen_controller";
import {
  SampleScreenTableField,
  NewSampleScreenField,
} from "./components/sample_sample_screen_component";

export default function Sample_sample_screenPage() {
  const [errors, setErrors] = useState<string[]>([]);

  // Initialize page on mount
  useEffect(() => {
    onInit();

    return () => {
      onDestroy();
    };
  }, []);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header Section */}
      <div className="flex-shrink-0">
        <div className="flex flex-row flex-wrap items-center justify-between p-3 sm:p-4 lg:p-5 border-b border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-900">
          <div className="flex items-center gap-3">
            <div className="flex flex-col">
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white leading-none">
                SampleScreen
              </h1>
              <p className="hidden lg:block text-gray-600 dark:text-gray-400 mt-1 text-sm">
                Track and manage SampleScreen records
              </p>
            </div>
          </div>

          <div className="flex-shrink-0">
            <NewSampleScreenField />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 min-h-0 flex flex-col">
        <Form
          className="flex-1 h-full flex flex-col overflow-hidden"
          onSubmit={(e) => handleSample_sample_screenSubmit(e, setErrors)}
        >
          {errors.length > 0 && (
            <div className="flex-shrink-0 m-6 mb-0">
              <div className="bg-red-50 border border-red-200 text-red-800 px-6 py-4 rounded-xl shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <svg
                    className="w-5 h-5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      clipRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      fillRule="evenodd"
                    />
                  </svg>
                  <span className="font-semibold">
                    Please fix the following errors:
                  </span>
                </div>
                <div className="space-y-1">
                  {errors.map((error, index) => (
                    <div key={index} className="ml-8 text-sm">
                      {error}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <SampleScreenTableField />
        </Form>
      </div>
    </div>
  );
}