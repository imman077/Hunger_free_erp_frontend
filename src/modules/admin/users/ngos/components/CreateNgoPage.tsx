import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle, Building2, Users } from "lucide-react";
import ResuableInput from "../../../../../global/components/resuable-components/input";
import ResuableButton from "../../../../../global/components/resuable-components/button";
import ResuableDropdown from "../../../../../global/components/resuable-components/dropdown";
import { useNgos } from "../hooks/useNgos";
import type { Ngo } from "../../store/user-schemas";

interface CategoryField {
  label: string;
  type: "text" | "dropdown";
  options?: { value: string; label: string }[];
  placeholder?: string;
}

interface CategoryConfig {
  details: { mandatory: CategoryField[]; optional: CategoryField[] };
  proofs: { mandatory: string[]; optional: string[] };
}

const NGO_CONFIG: Record<string, CategoryConfig> = {
  "Children & Youth": {
    details: {
      mandatory: [
        {
          label: "Care Type",
          type: "dropdown",
          options: [
            { value: "Orphanage", label: "Orphanage" },
            { value: "School", label: "School" },
            { value: "Shelter", label: "Shelter" },
          ],
        },
        { label: "Approximate Number of Children", type: "text" },
      ],
      optional: [
        { label: "Age Group", type: "text", placeholder: "eg: 0 - 18 years" },
      ],
    },
    proofs: {
      mandatory: ["Child Care Institution / School Registration Certificate"],
      optional: ["Student ID Summary (masked)", "Facility Photos"],
    },
  },
  "Senior Citizens": {
    details: {
      mandatory: [
        {
          label: "Facility Type",
          type: "dropdown",
          options: [
            { value: "Old Age Home", label: "Old Age Home" },
            { value: "Day Care", label: "Day Care" },
          ],
        },
        { label: "Approximate Number of Seniors", type: "text" },
      ],
      optional: [
        { label: "Age Group", type: "text", placeholder: "eg: 60+ years" },
      ],
    },
    proofs: {
      mandatory: ["Old Age Home Registration Certificate"],
      optional: ["Medical Support Letter", "Facility Photos"],
    },
  },
  "Local Communities": {
    details: {
      mandatory: [
        { label: "Community / Area Name", type: "text" },
        { label: "Approximate Number of Beneficiaries", type: "text" },
      ],
      optional: [
        {
          label: "Community Type",
          type: "dropdown",
          options: [
            { value: "Urban", label: "Urban" },
            { value: "Rural", label: "Rural" },
          ],
        },
      ],
    },
    proofs: {
      mandatory: ["Community Verification Letter"],
      optional: ["Area Photos", "BPL / Ration Card Summary"],
    },
  },
  "Stray Animals": {
    details: {
      mandatory: [
        {
          label: "Care Type",
          type: "dropdown",
          options: [
            { value: "Shelter", label: "Shelter" },
            { value: "Rescue", label: "Rescue" },
            { value: "Feeding Point", label: "Feeding Point" },
          ],
        },
        { label: "Approximate Number of Animals", type: "text" },
      ],
      optional: [
        {
          label: "Animal Type",
          type: "dropdown",
          options: [
            { value: "Dogs", label: "Dogs" },
            { value: "Cats", label: "Cats" },
            { value: "Cattle", label: "Cattle" },
            { value: "Others", label: "Others" },
          ],
        },
      ],
    },
    proofs: {
      mandatory: ["Animal Welfare / Shelter Registration Certificate"],
      optional: ["Municipality / Veterinary Letter", "Shelter Photos"],
    },
  },
  "Low-Income Communities": {
    details: {
      mandatory: [
        { label: "Area Name / Location", type: "text" },
        { label: "Approximate Number of Beneficiaries", type: "text" },
      ],
      optional: [{ label: "Nature of Support", type: "text" }],
    },
    proofs: {
      mandatory: ["Community Verification Letter"],
      optional: ["BPL / Ration Card Summary", "Area Photos"],
    },
  },
};

const CreateNgo = () => {
  const navigate = useNavigate();
  const { ngos, setUserData } = useNgos();
  const [formData, setFormData] = useState<Record<string, string>>({
    ngoName: "",
    orgType: "",
    registrationNo: "",
    address: "",
    email: "",
    website: "",
    about: "",
    representativeName: "",
    mobile: "",
    altMobile: "",
    designation: "",
    beneficiaries: "",
  });

  const [attachments] = useState<Record<string, File | File[] | null>>({});

  const handleValueChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const globalFields = [
      "ngoName",
      "orgType",
      "registrationNo",
      "address",
      "representativeName",
      "mobile",
    ];
    for (const field of globalFields) {
      if (!formData[field]) {
        alert(
          `Please fill the mandatory field: ${field
            .replace(/([A-Z])/g, " $1")
            .trim()}`,
        );
        return;
      }
    }

    const globalProofs = [
      "NGO Registration Certificate",
      "Authorized Representative ID Proof",
    ];
    for (const proof of globalProofs) {
      if (!attachments[proof]) {
        alert(`Please upload the mandatory proof: ${proof}`);
        return;
      }
    }

    const config = NGO_CONFIG[formData.beneficiaries];
    if (config) {
      for (const field of config.details.mandatory) {
        if (!formData[field.label]) {
          alert(`Please fill the mandatory category detail: ${field.label}`);
          return;
        }
      }
      for (const proof of config.proofs.mandatory) {
        if (!attachments[proof]) {
          alert(`Please upload the mandatory category proof: ${proof}`);
          return;
        }
      }
    } else {
      alert("Please select a Beneficiary Category and fill required details.");
      return;
    }

    const newNgo: Ngo = {
      id: Date.now(),
      name: formData.ngoName,
      registrationNo: formData.registrationNo,
      serviceAreas: [formData.beneficiaries],
      beneficiaries: formData.beneficiaries,
      status: "Pending",
      email: formData.email,
      phone: formData.mobile,
      address: formData.address,
      volunteers: [],
    };

    setUserData({
      ngos: [...ngos, newNgo],
    });

    alert("NGO registered successfully!");
    navigate("/admin/users/ngos");
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
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 md:gap-6">
              <button
                onClick={() => navigate("/admin/users/ngos")}
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
                  Register NGO
                </h1>
                <p
                  className="text-[8px] md:text-[9px] font-bold mt-1.5 md:mt-2 uppercase tracking-[0.2em] md:tracking-[0.3em]"
                  style={{ color: "var(--text-muted)" }}
                >
                  Administrator Console • NGO Onboarding
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
                Secure Registration
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
              className="border-b p-6 md:p-8 flex items-center gap-4 md:gap-5"
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
                <Building2 size={24} className="md:w-7 md:h-7" />
              </div>
              <div>
                <h2
                  className="text-sm md:text-base font-black uppercase tracking-tighter leading-none"
                  style={{ color: "var(--text-primary)" }}
                >
                  01. NGO Identity
                </h2>
                <p
                  className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] mt-2"
                  style={{ color: "var(--text-muted)" }}
                >
                  Official Entity Details & High-Level Info
                </p>
              </div>
            </div>

            <div className="p-6 md:p-10 space-y-8 md:space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
                <ResuableInput
                  label="NGO / Organization Name"
                  value={formData.ngoName}
                  onChange={(val) => handleValueChange("ngoName", val)}
                  required
                  placeholder="e.g. Hope Foundation"
                  align="left"
                />

                <ResuableDropdown
                  label="Organization Type"
                  value={formData.orgType}
                  onChange={(val) => handleValueChange("orgType", val)}
                  options={[
                    { value: "Trust", label: "Trust" },
                    { value: "Society", label: "Society" },
                    { value: "Section 8", label: "Section 8 Company" },
                  ]}
                  placeholder="Select Type"
                  required
                  align="left"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
                <ResuableInput
                  label="Registration Number"
                  value={formData.registrationNo}
                  onChange={(val) => handleValueChange("registrationNo", val)}
                  required
                  placeholder="REG-XXXX-XXXX"
                  align="left"
                />

                <ResuableInput
                  label="Full Address (Area, City, State, Pincode)"
                  value={formData.address}
                  onChange={(val) => handleValueChange("address", val)}
                  required
                  placeholder="e.g. 123 charity st"
                  align="left"
                />
              </div>
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
              className="border-b p-6 md:p-8 flex items-center gap-4 md:gap-5"
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
                <Users size={24} className="md:w-7 md:h-7" />
              </div>
              <div>
                <h2
                  className="text-sm md:text-base font-black uppercase tracking-tighter leading-none"
                  style={{ color: "var(--text-primary)" }}
                >
                  02. Authorized Representative
                </h2>
                <p
                  className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] mt-2"
                  style={{ color: "var(--text-muted)" }}
                >
                  Primary Contact Person & Accountability
                </p>
              </div>
            </div>

            <div className="p-6 md:p-10 space-y-8 md:space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
                <ResuableInput
                  label="Authorized Representative Name"
                  value={formData.representativeName}
                  onChange={(val) =>
                    handleValueChange("representativeName", val)
                  }
                  required
                  placeholder="e.g. Dr. Samuel Smith"
                  align="left"
                />

                <ResuableInput
                  label="Mobile Number"
                  value={formData.mobile}
                  onChange={(val) => handleValueChange("mobile", val)}
                  required
                  placeholder="+91 XXXXX XXXXX"
                  align="left"
                  type="tel"
                />
              </div>
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
                onClick={() => navigate("/admin/users/ngos")}
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
                  Register NGO
                </span>
              </ResuableButton>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateNgo;
