import {
  GetSampleScreenInputData,
  getSampleScreenInputDataSchema,
} from "./get_sample_screen_input_model";
import { getSampleScreenOutputDataSchema } from "./get_sample_screen_output_model";
import { getSampleScreenOutputModel } from "./get_sample_screen_store";

import { toast } from "@/components/appikorn-components/toast_appi";

export type GetSampleScreenOutputData =
  import("./get_sample_screen_output_model").getSampleScreenOutputData;

export async function getSampleScreenApi(
  input: GetSampleScreenInputData,
): Promise<GetSampleScreenOutputData> {
  try {
    const validatedInput = getSampleScreenInputDataSchema.parse(input);

    const response = await fetch("localhost:4000", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `query Get_SampleScreen($pageNo: Int, $pageSize: Int, $status: String, $category: String, $search: String) {
  Get_SampleScreen(pageNo: $pageNo, pageSize: $pageSize, status: $status, category: $category, search: $search) {
    items {
      _id
      SAMPLE_SCREEN_CODE
      TOTAL
      CATEGORY
      DESCRIPTION
      STATUS
      CATEGORY_DETAILS {
        CODE
        DESC
      }
      STATUS_DETAILS {
        CODE
        DESC
      }
    }
    pageInfo {
      totalItems
      totalPages
      currentPage
      pageSize
      hasNextPage
      hasPreviousPage
    }
  }
}`,
        variables: {
          pageNo: validatedInput.pageNo,
          pageSize: validatedInput.pageSize,
          status: validatedInput.status || undefined,
          category: validatedInput.category || undefined,
          search: validatedInput.search || undefined,
        },
      }),
    });

    if (!response.ok) {
      let errorPayload = null;
      try {
        errorPayload = await response.json();
      } catch {}

      const errorMsg =
        (errorPayload &&
          (errorPayload.message ||
            errorPayload.error ||
            (typeof errorPayload === "string" ? errorPayload : null))) ||
        "API error";

      if (typeof window !== "undefined") {
        toast.error("Error", errorMsg);
      }
      throw new Error(errorMsg);
    }

    const apiResponse = await response.json();
    const validatedOutput = getSampleScreenOutputDataSchema.parse(apiResponse);

    getSampleScreenOutputModel.update({
      getSampleScreenData: validatedOutput,
    });

    return validatedOutput;
  } catch (err) {
    const msg = err instanceof Error ? err.message : "API error";
    if (typeof window !== "undefined") {
      toast.error("Error", msg);
    }
    throw err;
  }
}
