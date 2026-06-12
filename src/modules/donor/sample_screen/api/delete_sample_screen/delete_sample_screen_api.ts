import {
  DeleteSampleScreenInputData,
  deleteSampleScreenInputDataSchema,
} from "./delete_sample_screen_input_model";
import { deleteSampleScreenOutputDataSchema } from "./delete_sample_screen_output_model";
import { deleteSampleScreenOutputModel } from "./delete_sample_screen_store";

import { toast } from "@/components/appikorn-components/toast_appi";

export type DeleteSampleScreenOutputData =
  import("./delete_sample_screen_output_model").deleteSampleScreenOutputData;

export async function deleteSampleScreenApi(
  input: DeleteSampleScreenInputData,
): Promise<DeleteSampleScreenOutputData> {
  try {
    const validatedInput = deleteSampleScreenInputDataSchema.parse(input);

    const response = await fetch("localhost:4000", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `mutation Archive_SampleScreen($sampleScreenCode: String!) {
  Archive_SampleScreen(SAMPLE_SCREEN_CODE: $sampleScreenCode)
}`,
        variables: { sampleScreenCode: validatedInput.sampleScreenCode },
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
    const validatedOutput = deleteSampleScreenOutputDataSchema.parse(apiResponse);

    deleteSampleScreenOutputModel.update({
      deleteSampleScreenData: validatedOutput,
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
