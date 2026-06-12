import React from "react";

import {
  sampleSampleScreenFormData,
  sampleSampleScreenInputModel,
} from "../store/sample_sample_screen_store";
import { getSampleScreenApi } from "../api/get_sample_screen/get_sample_screen_api";
import { getSampleScreenInputDataSchema } from "../api/get_sample_screen/get_sample_screen_input_model";
import { deleteSampleScreenApi } from "../api/delete_sample_screen/delete_sample_screen_api";
import { deleteSampleScreenInputDataSchema } from "../api/delete_sample_screen/delete_sample_screen_input_model";
import { getDropdownByCategoryApi } from "../../new_purchase/api/get_dropdown_by_category/get_dropdown_by_category_api";
import { getDropdownByCategoryInputDataSchema } from "../../new_purchase/api/get_dropdown_by_category/get_dropdown_by_category_input_model";

import { toast } from "@/components/appikorn-components/toast_appi";

export const callDeleteSampleScreenApi = async (sampleScreenCode: string) => {
  const apiRequest = deleteSampleScreenInputDataSchema.parse({ sampleScreenCode });

  console.log("Calling deleteSampleScreenApi with request:", apiRequest);
  try {
    await deleteSampleScreenApi(apiRequest);
    await callGetSampleScreenApi();
    return true;
  } catch (error) {
    console.error("deleteSampleScreenApi call failed:", error);
    return false;
  }
};

export const callGetSampleScreenApi = async (params?: {
  pageNo?: number;
  pageSize?: number;
  status?: string;
  category?: string;
  search?: string;
}) => {
  const currentData =
    sampleSampleScreenInputModel.useStore.getState().sampleSampleScreenData;

  const pageNo = params?.pageNo !== undefined ? params.pageNo : currentData?.pageNo || 1;
  const pageSize = params?.pageSize !== undefined ? params.pageSize : currentData?.pageSize || 10;
  const status = params?.status !== undefined ? params.status : currentData?.status || "";
  const category = params?.category !== undefined ? params.category : currentData?.category || "";
  const search = params?.search !== undefined ? params.search : currentData?.search || "";

  sampleSampleScreenInputModel.update({
    sampleSampleScreenData: {
      pageNo,
      pageSize,
      status,
      category,
      search,
    },
  });

  const isFilterActive = !!(status || category || search);

  const apiRequestPayload = {
    pageNo: isFilterActive ? undefined : pageNo,
    pageSize: isFilterActive ? undefined : pageSize,
    status: status || undefined,
    category: category || undefined,
    search: search || undefined,
  };

  const apiRequest = getSampleScreenInputDataSchema.parse(apiRequestPayload);

  console.log("Calling getSampleScreenApi with request:", apiRequest);
  try {
    await getSampleScreenApi(apiRequest);
    return true;
  } catch (error) {
    console.error("getSampleScreenApi call failed:", error);
    return false;
  }
};

export const handleSample_sample_screenSubmit = async (
  e: React.FormEvent,
  setErrors: (errors: string[]) => void,
) => {
  e.preventDefault();
  const currentData =
    sampleSampleScreenInputModel.useStore.getState().sampleSampleScreenData;

  const validationErrors = validateForm(currentData);
  if (validationErrors.length > 0) {
    setErrors(validationErrors);
    return;
  }

  setErrors([]);
  try {
    toast.success("Success", "SampleScreen data saved successfully!");
  } catch (error) {
    setErrors([error instanceof Error ? error.message : "Submission failed"]);
  }
};

export const callGetDropdownByCategoryApi = async () => {
  try {
    const categoryRequest = getDropdownByCategoryInputDataSchema.parse({
      category: "SAMPLE_SCREEN_CATEGORY",
    });
    const categoryResult = await getDropdownByCategoryApi(categoryRequest);
    const categories = categoryResult?.data?.Get_Dropdowns_by_Category?.[0]?.ITEMS || [];

    const statusRequest = getDropdownByCategoryInputDataSchema.parse({
      category: "APPROVAL_STATUS_TYPE",
    });
    const statusResult = await getDropdownByCategoryApi(statusRequest);
    const statuses = statusResult?.data?.Get_Dropdowns_by_Category?.[0]?.ITEMS || [];

    sampleSampleScreenInputModel.update({
      sampleSampleScreenData: {
        categoriesList: categories,
        statusesList: statuses,
      },
    });

    return true;
  } catch (error) {
    console.error("getDropdownByCategoryApi call failed:", error);
    return false;
  }
};

export const onInit = () => {
  console.log("SampleScreen page initialized");
  callGetSampleScreenApi({
    pageNo: 1,
    pageSize: 10,
    status: "",
    category: "",
  });
  callGetDropdownByCategoryApi();
};

export const onDestroy = () => {
  console.log("SampleScreen page destroyed");
};

export const resetForm = () => {
  sampleSampleScreenInputModel.reset();
  console.log("Form reset completed");
};

export const validateForm = (
  _data: Partial<sampleSampleScreenFormData>,
): string[] => {
  const errors: string[] = [];
  return errors;
};
