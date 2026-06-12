import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle,
  Package,
  MapPin,
  ShieldCheck,
} from "lucide-react";
import ResuableInput from "../../../../../global/components/resuable-components/input";
import ResuableButton from "../../../../../global/components/resuable-components/button";
import ResuableDropdown from "../../../../../global/components/resuable-components/dropdown";
import FileUploadSlot from "../../../../../global/components/resuable-components/FileUploadSlot";
import { useDonors } from "../hooks/useDonors";
import type { Donor } from "../../store/user-schemas";

const DONOR_PROOF_CONFIG: Record<
  string,
  { mandatory: string[]; optional: string[] }
> = {
  Event: {
    mandatory: ["Organizer ID Proof"],
    optional: ["Event Invitation / Booking Proof"],
  },
  Restaurant: {
    mandatory: ["FSSAI License", "Owner / Manager ID Proof"],
    optional: ["GST Certificate", "Trade License"],
  },
  Hotel: {
    mandatory: ["FSSAI License", "Authorized Person ID Proof"],
    optional: ["GST Certificate", "Fire Safety Certificate"],
  },
  Household: {
    mandatory: ["Individual ID Proof"],
    optional: ["Address Proof"],
  },
  Corporate: {
    mandatory: [
      "Company Registration Certificate (CIN / MSME)",
      "Authorized Person ID Proof",
    ],
    optional: ["GST Certificate", "FSSAI License"],
  },
};

const CreateDonor = () => {
  const navigate = useNavigate();
  const { donors, setUserData } = useDonors();
  const [formData, setFormData] = useState({
    businessName: "",
    donorType: "",
    contactPerson: "",
    email: "",
    phone: "",
    address: "",
  });

  const [attachments, setAttachments] = useState<Record<string, File | null>>(
    {},
  );

  const handleAttachmentChange = (slot: string, file: File | null) => {
    setAttachments((prev) => ({
      ...prev,
      [slot]: file,
    }));
  };

  const donorTypes = [
    { value: "Restaurant", label: "Restaurant" },
    { value: "Hotel", label: "Hotel" },
    { value: "Household", label: "Household" },
    { value: "Event", label: "Event" },
    { value: "Corporate", label: "Corporate" },
  ];

  const handleValueChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (name === "donorType") {
      setAttachments({});
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const config = DONOR_PROOF_CONFIG[formData.donorType];
    if (config) {
      const missingMandatory = config.mandatory.find((m) => !attachments[m]);
      if (missingMandatory) {
        alert(`Please upload the mandatory ${missingMandatory}.`);
        return;
      }
    } else {
      alert("Please select a Donor Type first.");
      return;
    }

    const newDonor: Donor = {
      id: Date.now(),
      businessName: formData.businessName,
      type: formData.donorType,
      contactPerson: formData.contactPerson,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      totalDonations: 0,
      points: 0,
      status: "Active",
      donationHistory: [],
    };

    setUserData({
      donors: [...donors, newDonor],
    });

    alert("Donor added successfully!");
    navigate("/admin/users/donors");
  };

  return (
    <div
      className="w-full mx-auto min-h-screen flex flex-col font-inter"
      style={{ backgroundColor: "var(--bg-secondary)" }}
    >
      <div
        className="sticky top-0 z-30 w-full border-b transition-all backdrop-blur-md"
        style={{
          backgroundColor:
            "color-mix(in srgb, var(--bg-secondary), transparent 15%)",
          borderColor: "var(--border-color)",
        }}
      >
        <div className="max-w-5xl mx-auto px-4 md:px-10 py-4 md:py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6">
            <div className="flex items-center gap-4 md:gap-6">
              <button
                onClick={() => navigate("/admin/users/donors")}
                className="w-9 h-9 md:w-10 md:h-10 shrink-0 rounded-full flex items-center justify-center border transition-all group shadow-sm hover:scale-105 active:scale-95"
                style={{
                  backgroundColor: "var(--bg-primary)",
                  borderColor: "var(--border-color)",
                  color: "var(--text-muted)",
                }}
              >
                <ArrowLeft
                  size={16}
                  className="md:w-[18px] md:h-[18px] group-hover:-translate-x-1 transition-transform"
                />
              </button>
              <div
                className="h-8 md:h-10 w-px opacity-50 md:opacity-100"
                style={{ backgroundColor: "var(--border-color)" }}
              />
              <div className="min-w-0">
                <h1
                  className="text-xl md:text-3xl font-black tracking-tighter leading-none italic truncate"
                  style={{ color: "var(--text-primary)" }}
                >
                  Create Donor
                </h1>
                <p
                  className="text-[8px] md:text-[9px] font-bold mt-1.5 md:mt-2 uppercase tracking-[0.2em] md:tracking-[0.3em]"
                  style={{ color: "var(--text-muted)" }}
                >
                  Admin Portal • New Registration
                </p>
              </div>
            </div>

            <div
              className="hidden lg:flex border px-4 py-2 rounded-full items-center gap-3 shadow-sm bg-primary/50"
              style={{
                backgroundColor: "var(--bg-primary)",
                borderColor: "var(--border-color)",
              }}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
              <span
                className="text-[9px] font-black uppercase tracking-widest pt-0.5"
                style={{ color: "var(--text-secondary)" }}
              >
                Live Submission Active
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 md:p-10 w-full flex-1">
        <form
          onSubmit={handleSubmit}
          className="max-w-4xl mx-auto space-y-6 pb-24"
        >
          <div
            className="border rounded-xl shadow-sm transition-all hover:shadow-md"
            style={{
              borderColor: "var(--border-color)",
              backgroundColor: "var(--bg-primary)",
            }}
          >
            <div
              className="border-b p-5 md:p-8 flex items-center gap-4 md:gap-5"
              style={{
                borderColor: "var(--border-color)",
                backgroundColor: "var(--bg-tertiary)",
              }}
            >
              <div
                className="w-12 h-12 md:w-14 md:h-14 border rounded-xl flex items-center justify-center text-[#22c55e] shadow-sm shrink-0"
                style={{
                  backgroundColor: "var(--bg-primary)",
                  borderColor: "var(--border-color)",
                }}
              >
                <Package size={24} className="md:w-[28px] md:h-[28px]" />
              </div>
              <div>
                <h2
                  className="text-sm md:text-base font-black uppercase tracking-tighter leading-none"
                  style={{ color: "var(--text-primary)" }}
                >
                  01. General Info
                </h2>
                <p
                  className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.15em] md:tracking-[0.2em] mt-2"
                  style={{ color: "var(--text-muted)" }}
                >
                  Basic business name and type
                </p>
              </div>
            </div>

            <div className="p-6 md:p-10 space-y-8 md:space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
                <ResuableInput
                  label="Business / Donor Name"
                  value={formData.businessName}
                  onChange={(val) => handleValueChange("businessName", val)}
                  required
                  placeholder="e.g. Gourmet Bistro"
                  align="left"
                />

                <ResuableDropdown
                  label="Donor Type"
                  value={formData.donorType}
                  onChange={(val) => handleValueChange("donorType", val)}
                  options={donorTypes}
                  placeholder="Select Type"
                  required
                  align="left"
                />
              </div>

              <ResuableInput
                label="Contact Person"
                value={formData.contactPerson}
                onChange={(val) => handleValueChange("contactPerson", val)}
                required
                placeholder="e.g. Chef Antoine"
                align="left"
              />
            </div>
          </div>

          <div
            className="border rounded-xl shadow-sm transition-all hover:shadow-md"
            style={{
              borderColor: "var(--border-color)",
              backgroundColor: "var(--bg-primary)",
            }}
          >
            <div
              className="border-b p-5 md:p-8 flex items-center gap-4 md:gap-5"
              style={{
                borderColor: "var(--border-color)",
                backgroundColor: "var(--bg-tertiary)",
              }}
            >
              <div
                className="w-12 h-12 md:w-14 md:h-14 border rounded-xl flex items-center justify-center text-[#22c55e] shadow-sm shrink-0"
                style={{
                  backgroundColor: "var(--bg-primary)",
                  borderColor: "var(--border-color)",
                }}
              >
                <MapPin size={24} className="md:w-[28px] md:h-[28px]" />
              </div>
              <div>
                <h2
                  className="text-sm md:text-base font-black uppercase tracking-tighter leading-none"
                  style={{ color: "var(--text-primary)" }}
                >
                  02. Contact & Address
                </h2>
                <p
                  className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.15em] md:tracking-[0.2em] mt-2"
                  style={{ color: "var(--text-muted)" }}
                >
                  How to reach and location details
                </p>
              </div>
            </div>

            <div className="p-6 md:p-10 space-y-8 md:space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
                <ResuableInput
                  label="Email Address"
                  type="email"
                  value={formData.email}
                  onChange={(val) => handleValueChange("email", val)}
                  required
                  placeholder="contact@business.com"
                  align="left"
                />

                <ResuableInput
                  label="Phone Number"
                  type="tel"
                  value={formData.phone}
                  onChange={(val) => handleValueChange("phone", val)}
                  required
                  placeholder="+1 (000) 000-0000"
                  align="left"
                />
              </div>

              <ResuableInput
                label="Full Office Address"
                value={formData.address}
                onChange={(val) => handleValueChange("address", val)}
                required
                placeholder="e.g. 123 Main St, City, Zip 12345"
                align="left"
              />
            </div>
          </div>

          <div
            className="border rounded-xl shadow-sm transition-all hover:shadow-md"
            style={{
              borderColor: "var(--border-color)",
              backgroundColor: "var(--bg-primary)",
            }}
          >
            <div
              className="border-b p-5 md:p-8 flex items-center gap-4 md:gap-5"
              style={{
                borderColor: "var(--border-color)",
                backgroundColor: "var(--bg-tertiary)",
              }}
            >
              <div
                className="w-12 h-12 md:w-14 md:h-14 border rounded-xl flex items-center justify-center text-blue-500 shadow-sm shrink-0"
                style={{
                  backgroundColor: "var(--bg-primary)",
                  borderColor: "var(--border-color)",
                }}
              >
                <ShieldCheck size={24} className="md:w-[28px] md:h-[28px]" />
              </div>
              <div>
                <h2
                  className="text-sm md:text-base font-black uppercase tracking-tighter leading-none"
                  style={{ color: "var(--text-primary)" }}
                >
                  03. Upload Documents
                </h2>
                <p
                  className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.15em] md:tracking-[0.2em] mt-2"
                  style={{ color: "var(--text-muted)" }}
                >
                  Required files for verification
                </p>
              </div>
            </div>

            <div className="p-6 md:p-10 space-y-8 md:space-y-10">
              {!formData.donorType ? (
                <div
                  className="py-12 md:py-24 border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-500"
                  style={{
                    borderColor: "var(--border-color)",
                    backgroundColor: "var(--bg-secondary)",
                  }}
                >
                  <div
                    className="w-12 h-12 md:w-16 md:h-16 rounded-full shadow-sm flex items-center justify-center mb-4 md:mb-6"
                    style={{
                      backgroundColor: "var(--bg-primary)",
                      color: "var(--text-muted)",
                    }}
                  >
                    <ShieldCheck size={28} />
                  </div>
                  <h3
                    className="text-[12px] md:text-sm font-black uppercase tracking-widest"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Select Donor Type
                  </h3>
                  <p
                    className="text-[9px] font-bold mt-2 uppercase tracking-[0.2em]"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Requirements will appear dynamically
                  </p>
                </div>
              ) : (
                <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                  {(() => {
                    const config = DONOR_PROOF_CONFIG[formData.donorType];
                    const allMandatoryFilled = config?.mandatory.every(
                      (m) => !!attachments[m],
                    );

                    return (
                      <div className="relative">
                        <div className="flex items-center justify-between mb-8">
                          <div className="flex items-center gap-4">
                            <div
                              className={`w-10 h-10 rounded-lg flex items-center justify-center shadow-sm border transition-all duration-500 ${
                                allMandatoryFilled
                                  ? "bg-[#22c55e]/10 text-[#22c55e] border-[#22c55e]/20"
                                  : "bg-red-500/10 text-red-500 border-red-500/20"
                              }`}
                            >
                              <ShieldCheck size={20} />
                            </div>
                            <div>
                              <h3
                                className="text-[11px] font-black uppercase tracking-[0.2em] leading-none"
                                style={{ color: "var(--text-primary)" }}
                              >
                                Required Documents
                              </h3>
                              <p
                                className={`text-[9px] font-bold mt-1.5 uppercase tracking-widest opacity-80 transition-colors duration-500 ${
                                  allMandatoryFilled
                                    ? "text-[#22c55e]"
                                    : "text-red-400"
                                }`}
                              >
                                {allMandatoryFilled
                                  ? "All documents uploaded"
                                  : "Must upload to verify account"}
                              </p>
                            </div>
                          </div>
                          <div
                            className={`px-3 py-1 rounded-full border transition-all duration-500 ${
                              allMandatoryFilled
                                ? "bg-[#22c55e]/10 border-[#22c55e]/20"
                                : "bg-red-500/10 border-red-500/20"
                            }`}
                          >
                            <span
                              className={`text-[9px] font-black uppercase tracking-widest ${
                                allMandatoryFilled
                                  ? "text-[#22c55e]"
                                  : "text-red-500"
                              }`}
                            >
                              {allMandatoryFilled ? "Completed" : "Required"}
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                          {config.mandatory.map((label) => (
                            <FileUploadSlot
                              key={label}
                              label={label}
                              value={attachments[label] || null}
                              onChange={(file) =>
                                handleAttachmentChange(label, file)
                              }
                              mandatory
                              icon={
                                label.toLowerCase().includes("id") ||
                                label.toLowerCase().includes("proof")
                                  ? "shield"
                                  : "file"
                              }
                            />
                          ))}
                        </div>
                      </div>
                    );
                  })()}

                  <div className="flex items-center gap-4">
                    <div
                      className="h-px flex-1"
                      style={{ backgroundColor: "var(--border-color)" }}
                    />
                    <div
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: "var(--border-dark)" }}
                    />
                    <div
                      className="h-px flex-1"
                      style={{ backgroundColor: "var(--border-color)" }}
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-[#22c55e]/10 flex items-center justify-center text-[#22c55e] shadow-sm border border-[#22c55e]/20">
                          <CheckCircle size={20} />
                        </div>
                        <div>
                          <h3
                            className="text-[11px] font-black uppercase tracking-[0.2em] leading-none"
                            style={{ color: "var(--text-primary)" }}
                          >
                            Extra Documents
                          </h3>
                          <p
                            className="text-[9px] font-bold mt-1.5 uppercase tracking-widest"
                            style={{ color: "var(--text-muted)" }}
                          >
                            Optional supporting files
                          </p>
                        </div>
                      </div>
                      <div
                        className="px-3 py-1 rounded-full border"
                        style={{
                          backgroundColor: "var(--bg-tertiary)",
                          borderColor: "var(--border-color)",
                        }}
                      >
                        <span
                          className="text-[9px] font-black uppercase tracking-widest"
                          style={{ color: "var(--text-muted)" }}
                        >
                          Optional
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {DONOR_PROOF_CONFIG[formData.donorType].optional.map(
                        (label) => (
                          <FileUploadSlot
                            key={label}
                            label={label}
                            value={attachments[label] || null}
                            onChange={(file) =>
                              handleAttachmentChange(label, file)
                            }
                            subtitle="Optional"
                          />
                        ),
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div
            className="fixed bottom-0 left-0 right-0 backdrop-blur-xl border-t p-4 md:p-6 z-[200] shadow-[0_-15px_50px_rgba(0,0,0,0.05)]"
            style={{
              borderColor: "var(--border-color)",
              backgroundColor: "var(--bg-primary)",
              opacity: 0.98,
            }}
          >
            <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-end gap-4 md:gap-8">
              <ResuableButton
                variant="ghost"
                onClick={() => navigate("/admin/users/donors")}
                className="font-black text-[10px] md:text-[11px] uppercase tracking-[0.2em] hover:text-red-500 transition-colors order-2 sm:order-1"
                style={{ color: "var(--text-muted)" }}
              >
                Cancel
              </ResuableButton>
              <ResuableButton
                type="submit"
                variant="dark"
                className="w-full sm:min-w-[260px] h-[52px] md:h-[58px] !bg-[#22c55e] hover:!bg-[#1ea34a] !rounded-xl shadow-xl shadow-[#22c55e]/20 transition-all active:scale-[0.98] border border-[#22c55e]/20 order-1 sm:order-2"
                startContent={
                  <CheckCircle size={20} className="md:w-[22px] md:h-[22px]" />
                }
              >
                <span className="text-[11px] md:text-[12px] font-black uppercase tracking-[0.2em]">
                  Create Donor
                </span>
              </ResuableButton>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateDonor;
