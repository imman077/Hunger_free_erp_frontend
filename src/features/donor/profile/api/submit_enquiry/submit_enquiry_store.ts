import { z } from "zod";
import { createCompleteStore } from "../../../../../core/utility";
import {
  submitEnquiryApiOutputSchema,
  submitEnquiryOutputPersistenceConfig,
} from "./submit_enquiry_output_model";

export const submitEnquiryApiStore = createCompleteStore(
  submitEnquiryApiOutputSchema,
  {
    name: "submit_enquiry_api_storage",
    dataPath: "submitEnquiryApiData",
    persistenceConfig: submitEnquiryOutputPersistenceConfig,
  }
);

export const {
  model: submitEnquiryApiOutputModel,
  formSchema: submitEnquiryApiFormSchema,
} = submitEnquiryApiStore;

export type SubmitEnquiryApiFormData = z.infer<typeof submitEnquiryApiFormSchema>;
