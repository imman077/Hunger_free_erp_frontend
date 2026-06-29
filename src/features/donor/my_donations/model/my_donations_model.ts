import { z } from "zod";
import { createSchemaBundle } from "../../../../core/utility";

export const myDonationsDataSchema = z.object({
  viewMode: z.string().default("card"),
  statusFilter: z.string().default("Pending"),
  sortOrder: z.string().default("Newest First"),
  isSortDropdownOpen: z.boolean().default(false),
  selectedDonation: z.any().nullable().default(null),
  isGeneralDetailsOpen: z.boolean().default(false),
  isDetailsModalOpen: z.boolean().default(false),
  isTrackingModalOpen: z.boolean().default(false),
  cancellingId: z.string().nullable().default(null),
  otpDigits: z.array(z.string()).default(["", "", "", "", "", ""]),
  otpValue: z.string().default(""),
  isVerifying: z.boolean().default(false),
  otpError: z.string().default(""),
  isCancelModalOpen: z.boolean().default(false),
  cancellingDonationId: z.string().nullable().default(null),
  cancelReason: z.string().default(""),
  isRedonateModalOpen: z.boolean().default(false),
  redonateDonation: z.any().nullable().default(null),
  isDeleteModalOpen: z.boolean().default(false),
  deletingDonationId: z.string().nullable().default(null),
  isDeleting: z.boolean().default(false),
  isReceiptModalOpen: z.boolean().default(false),
  receiptDonation: z.any().nullable().default(null),
  searchText: z.string().default(""),
  isFilterDropdownOpen: z.boolean().default(false),
});

export const myDonationsPersistenceConfig = {
  viewMode: true,
  statusFilter: true,
  sortOrder: true,
  isSortDropdownOpen: false,
  selectedDonation: false,
  isGeneralDetailsOpen: false,
  isDetailsModalOpen: false,
  isTrackingModalOpen: false,
  cancellingId: false,
  otpDigits: false,
  otpValue: false,
  isVerifying: false,
  otpError: false,
  isCancelModalOpen: false,
  cancellingDonationId: false,
  cancelReason: false,
  isRedonateModalOpen: false,
  redonateDonation: false,
  isDeleteModalOpen: false,
  deletingDonationId: false,
  isDeleting: false,
  isReceiptModalOpen: false,
  receiptDonation: false,
  searchText: false,
  isFilterDropdownOpen: false,
};

export const myDonationsSchemas = createSchemaBundle(myDonationsDataSchema, {
  dataPath: "myDonationsData",
  persistenceConfig: myDonationsPersistenceConfig,
});

export type MyDonationsData = z.infer<typeof myDonationsDataSchema>;
