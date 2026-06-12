import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle,
  User,
  MapPin,
  Car,
  ShieldCheck,
  Clock,
  Smartphone,
  Briefcase,
  HelpCircle,
  Navigation,
} from "lucide-react";
import { Modal, ModalContent, ModalBody } from "@heroui/react";
import { useVolunteers } from "../hooks/useVolunteers";
import type { Volunteer } from "../../store/user-schemas";
import ResuableInput from "../../../../../global/components/resuable-components/input";
import ReusableButton from "../../../../../global/components/resuable-components/button";
import ResuableDropdown from "../../../../../global/components/resuable-components/dropdown";
import FileUploadSlot from "../../../../../global/components/resuable-components/FileUploadSlot";

const CreateVolunteer = () => {
  const navigate = useNavigate();
  const { volunteers, setUserData } = useVolunteers();

  const [statesList, setStatesList] = useState<
    { value: string; label: string; id: number }[]
  >([]);
  const [districtsList, setDistrictsList] = useState<
    { value: string; label: string }[]
  >([]);
  const [loadingStates, setLoadingStates] = useState(false);

  const [formData, setFormData] = useState({
    // 1. Basic Details
    name: "",
    phone: "",
    role: "",
    emergencyPhone: "",

    // 2. Place Details
    city: "",
    district: "",
    state: "",
    pincode: "",

    // 3. Area Details
    areaName: "",
    streetName: "",
    landmark: "",
    areaType: "",

    // 4. Area Assignment
    assignedArea: "",
    coverNearby: "No",

    // 5. Availability
    availableDays: "",
    availableTime: "",

    // 6. Consent
    willingToHandleFood: "No",
    followSafetyGuidelines: false,

    // 7. Additional (Optional)
    email: "",
    gender: "",
    ageGroup: "",

    // 8. Familiarity
    yearsInArea: "",
    familiarityLevel: "",
    languages: "",

    // 9. Transport
    transportMode: "",
    maxDistance: "",
    fuelReimbursement: "No",

    // 10. Emergency Support
    emergencyAvailable: "No",
    nightHours: "No",
    firstAid: "No",
  });
  const [showSuccess, setShowSuccess] = useState(false);

  // Fetch States and Districts data from GitHub (CORS-free)
  useEffect(() => {
    const fetchLocationData = async () => {
      setLoadingStates(true);
      try {
        const response = await fetch(
          "https://raw.githubusercontent.com/sab99r/Indian-States-And-Districts/master/states-and-districts.json",
        );
        const data = await response.json();
        if (data && data.states) {
          const mappedStates = data.states.map((s: any, index: number) => ({
            value: s.state,
            label: s.state,
            id: index + 1,
            districts: s.districts || [],
          }));
          setStatesList(mappedStates);
        }
      } catch (error) {
        console.error("Error fetching location data:", error);
      } finally {
        setLoadingStates(false);
      }
    };
    fetchLocationData();
  }, []);

  // Update districts when state changes
  useEffect(() => {
    if (!formData.state) {
      setDistrictsList([]);
      return;
    }

    const selectedState = statesList.find((s) => s.value === formData.state);
    if (selectedState && (selectedState as any).districts) {
      const mappedDistricts = (selectedState as any).districts.map(
        (d: string) => ({
          value: d,
          label: d,
        }),
      );
      setDistrictsList(mappedDistricts);
    } else {
      setDistrictsList([]);
    }
  }, [formData.state, statesList]);

  const [attachments, setAttachments] = useState<Record<string, File | null>>({
    "Profile Photo": null,
    "Address Proof": null,
    "Government ID Proof": null,
    "NGO ID": null,
  });

  const handleValueChange = (name: string, value: string | boolean) => {
    setFormData((prev) => {
      const newData = { ...prev, [name]: value };

      if (name === "state") {
        newData.district = "";
        newData.assignedArea = "";
      }

      if (name === "district") {
        newData.assignedArea = "";
      }

      return newData;
    });
  };

  const handleAttachmentChange = (slot: string, file: File | null) => {
    setAttachments((prev) => ({
      ...prev,
      [slot]: file,
    }));
  };

  const dropOptions = {
    roles: [
      { value: "Volunteer", label: "Volunteer" },
      { value: "Area Coordinator", label: "Area Coordinator" },
      { value: "Delivery Volunteer", label: "Delivery Volunteer" },
    ],
    areaTypes: [
      { value: "Residential", label: "Residential" },
      { value: "Commercial", label: "Commercial" },
      { value: "Mixed", label: "Mixed" },
    ],
    yesNo: [
      { value: "Yes", label: "Yes" },
      { value: "No", label: "No" },
    ],
    availableDays: [
      { value: "Weekdays", label: "Weekdays" },
      { value: "Weekends", label: "Weekends" },
      { value: "Both", label: "Both" },
    ],
    timeSlots: [
      { value: "Morning", label: "Morning" },
      { value: "Afternoon", label: "Afternoon" },
      { value: "Evening", label: "Evening" },
    ],
    gender: [
      { value: "Male", label: "Male" },
      { value: "Female", label: "Female" },
      { value: "Other", label: "Other" },
    ],
    ageGroups: [
      { value: "18-25", label: "18-25" },
      { value: "26-35", label: "26-35" },
      { value: "36-50", label: "36-50" },
      { value: "50+", label: "50+" },
    ],
    familiarity: [
      { value: "Very Familiar", label: "Very Familiar" },
      { value: "Moderate", label: "Moderate" },
      { value: "New", label: "New" },
    ],
    transport: [
      { value: "Walking", label: "Walking" },
      { value: "Bike", label: "Bike" },
      { value: "Car", label: "Car" },
      { value: "Public Transport", label: "Public Transport" },
    ],
    states: statesList,
    districts: districtsList,
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate Mandatory Attachments
    if (!attachments["Address Proof"]) {
      alert("Please upload your Address Proof.");
      return;
    }
    if (!attachments["Government ID Proof"]) {
      alert("Please upload your Government ID Proof.");
      return;
    }

    // Validate Consent
    if (!formData.followSafetyGuidelines) {
      alert("Please agree to follow all safety and hygiene protocols.");
      return;
    }

    // Map formData to Volunteer schema
    const newVolunteer: Volunteer = {
      id: Date.now(),
      name: formData.name,
      zone: formData.state, // Simplified mapping
      volunteerAreas: [formData.areaName],
      tasksCompleted: 0,
      totalTasks: 0,
      missedTasks: 0,
      rating: "5.0",
      status: "available",
      onLeave: false,
      email: formData.email,
      phone: formData.phone,
      emergencyPhone: formData.emergencyPhone,
      address: `${formData.streetName}, ${formData.areaName}, ${formData.city}, ${formData.state} - ${formData.pincode}`,
      vehicle: formData.transportMode,
      license: "", // Not collected in form
      createdDate: new Date().toISOString().split("T")[0],
      verificationStatus: "Pending",
      lastActive: "Never",
      lastAssignment: "None",
      allowedTaskTypes: ["Food Delivery"], // Default
      fuelEligibility: formData.fuelReimbursement === "Yes",
      isSuspended: false,
    };

    setUserData({
      volunteers: [...volunteers, newVolunteer],
    });

    setShowSuccess(true);
    setTimeout(() => {
      navigate("/admin/users/volunteers");
    }, 2000); // Give time to show success
  };

  const SectionHeader = ({
    icon: Icon,
    number,
    title,
    subtitle,
    rightContent,
  }: any) => (
    <div
      className="p-4 md:p-6 border-b flex items-center gap-4"
      style={{
        borderColor: "var(--border-color)",
        backgroundColor: "var(--bg-tertiary)",
      }}
    >
      <div className="flex items-center gap-3 md:gap-6 flex-1 min-w-0">
        <div
          className="w-11 h-11 md:w-14 md:h-14 rounded-xl flex items-center justify-center shadow-sm shrink-0 text-[#22c55e] border"
          style={{
            backgroundColor: "var(--bg-primary)",
            borderColor: "var(--border-color)",
          }}
        >
          <Icon size={20} className="md:w-7 md:h-7" />
        </div>
        <div className="flex-1 flex flex-col items-start text-left min-w-0">
          <div className="flex items-center gap-3">
            <h2
              className="text-[13px] md:text-sm font-black uppercase tracking-tight text-left truncate w-full"
              style={{ color: "var(--text-primary)" }}
            >
              {number}. {title}
            </h2>
          </div>
          <p
            className="text-[8px] md:text-[10px] font-bold text-left uppercase tracking-widest mt-1 md:mt-1.5 truncate w-full"
            style={{ color: "var(--text-muted)" }}
          >
            {subtitle}
          </p>
        </div>
      </div>
      {rightContent && <div className="shrink-0">{rightContent}</div>}
    </div>
  );

  return (
    <div
      className="w-full mx-auto min-h-screen flex flex-col"
      style={{ backgroundColor: "var(--bg-secondary)" }}
    >
      {/* Sticky Header Bar */}
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
                onClick={() => navigate("/admin/users/volunteers")}
                className="w-9 h-9 md:w-10 md:h-10 shrink-0 rounded-full flex items-center justify-center border transition-all shadow-sm group hover:scale-105 active:scale-95"
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
                  Volunteer Registration
                </h1>
                <p
                  className="text-[8px] md:text-[9px] font-bold mt-1.5 md:mt-2 uppercase tracking-[0.2em] md:tracking-[0.3em]"
                  style={{ color: "var(--text-muted)" }}
                >
                  Onboard new community heroes for distribution network
                </p>
              </div>
            </div>
            <div
              className="hidden lg:flex border px-4 py-2 rounded-full items-center gap-3 shadow-sm"
              style={{
                backgroundColor: "var(--bg-primary)",
                borderColor: "var(--border-color)",
              }}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-pulse" />
              <span
                className="text-[9px] font-black uppercase tracking-widest"
                style={{ color: "var(--text-secondary)" }}
              >
                Live Registration
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 md:p-10 w-full flex-1">
        <div className="max-w-5xl mx-auto space-y-8">
          <form onSubmit={handleSubmit} className="space-y-8 pb-32">
            <div className="grid grid-cols-1 gap-8">
              {/* 1. Basic Identity */}
              <div
                className="rounded-xl border shadow-sm"
                style={{
                  backgroundColor: "var(--bg-primary)",
                  borderColor: "var(--border-color)",
                }}
              >
                <SectionHeader
                  icon={User}
                  number="01"
                  title="Basic Identity"
                  subtitle="Primary contact and role assignment"
                />
                <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                  <ResuableInput
                    label="Name"
                    value={formData.name}
                    onChange={(v) => handleValueChange("name", v)}
                    required
                    placeholder="e.g. Rahul Sharma"
                  />
                  <ResuableInput
                    label="Mobile"
                    value={formData.phone}
                    onChange={(v) => handleValueChange("phone", v)}
                    required
                    placeholder="+91-XXXXX-XXXXX"
                  />
                  <ResuableDropdown
                    label="Role"
                    value={formData.role}
                    onChange={(v) => handleValueChange("role", v)}
                    options={dropOptions.roles}
                    required
                    placeholder="Select Role"
                  />
                  <ResuableInput
                    label="Email"
                    value={formData.email}
                    onChange={(v) => handleValueChange("email", v)}
                    type="email"
                    placeholder="name@example.com"
                  />
                </div>
              </div>

              {/* 2. Base Location */}
              <div
                className="rounded-xl border shadow-sm"
                style={{
                  backgroundColor: "var(--bg-primary)",
                  borderColor: "var(--border-color)",
                }}
              >
                <SectionHeader
                  icon={MapPin}
                  number="02"
                  title="Base Location"
                  subtitle="Permanent residential address"
                />
                <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                  <ResuableDropdown
                    label="State"
                    value={formData.state}
                    onChange={(v) => handleValueChange("state", v)}
                    options={dropOptions.states}
                    required
                    placeholder={loadingStates ? "Loading..." : "Select State"}
                    disabled={loadingStates}
                  />
                  {dropOptions.districts.length > 0 ? (
                    <ResuableDropdown
                      label="District"
                      value={formData.district}
                      onChange={(v) => handleValueChange("district", v)}
                      options={dropOptions.districts}
                      required
                      placeholder="Select District"
                    />
                  ) : (
                    <ResuableInput
                      label="District"
                      value={formData.district}
                      onChange={(v) => handleValueChange("district", v)}
                      required
                      placeholder={
                        formData.state ? "Enter District" : "Select State First"
                      }
                      disabled={!formData.state}
                    />
                  )}
                  <ResuableInput
                    label="City / Town"
                    value={formData.city}
                    onChange={(v) => handleValueChange("city", v)}
                    required
                    placeholder="e.g. Chennai"
                  />
                  <ResuableInput
                    label="Pincode"
                    value={formData.pincode}
                    onChange={(v) => handleValueChange("pincode", v)}
                    required
                    placeholder="600XXX"
                  />
                </div>
              </div>

              {/* 3. Area Logistics */}
              <div
                className="rounded-xl border shadow-sm"
                style={{
                  backgroundColor: "var(--bg-primary)",
                  borderColor: "var(--border-color)",
                }}
              >
                <SectionHeader
                  icon={Navigation}
                  number="03"
                  title="Area Logistics"
                  subtitle="Specific door-to-door navigation"
                />
                <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                  <ResuableInput
                    label="Street / Door"
                    value={formData.streetName}
                    onChange={(v) => handleValueChange("streetName", v)}
                    placeholder="e.g. 22, Rainbow Nagar"
                  />
                  <ResuableInput
                    label="Area"
                    value={formData.areaName}
                    onChange={(v) => handleValueChange("areaName", v)}
                    required
                    placeholder="e.g. Anna Nagar"
                  />
                  <ResuableInput
                    label="Landmark"
                    value={formData.landmark}
                    onChange={(v) => handleValueChange("landmark", v)}
                    placeholder="e.g. Near Metro"
                  />
                  <ResuableDropdown
                    label="Area Type"
                    value={formData.areaType}
                    onChange={(v) => handleValueChange("areaType", v)}
                    options={dropOptions.areaTypes}
                    required
                    info={
                      <div className="space-y-2">
                        <div className="flex flex-col gap-1.5 text-[9.5px]">
                          <div>
                            <span className="font-black text-white active:text-emerald-400">
                              Residential
                            </span>
                            <p className="text-slate-300 font-medium">
                              Mostly houses or apartments
                            </p>
                          </div>
                          <div>
                            <span className="font-black text-white active:text-emerald-400">
                              Commercial
                            </span>
                            <p className="text-slate-300 font-medium">
                              Shops, hotels, offices, businesses
                            </p>
                          </div>
                          <div>
                            <span className="font-black text-white active:text-emerald-400">
                              Mixed
                            </span>
                            <p className="text-slate-300 font-medium">
                              Both houses and shops together
                            </p>
                          </div>
                        </div>
                      </div>
                    }
                  />
                </div>
              </div>

              {/* Side-by-Side (4 & 5) */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div
                  className="bg-white rounded-xl border shadow-sm"
                  style={{
                    backgroundColor: "var(--bg-primary)",
                    borderColor: "var(--border-color)",
                  }}
                >
                  <SectionHeader
                    icon={Briefcase}
                    number="04"
                    title="Field Assignment"
                    subtitle="Operational boundary settings"
                  />
                  <div className="p-6 md:p-8 grid grid-cols-1 xl:grid-cols-2 gap-6 md:gap-8">
                    <ResuableInput
                      label="Area"
                      value={formData.assignedArea}
                      onChange={(v) => handleValueChange("assignedArea", v)}
                      required
                      placeholder="e.g. Anna Nagar West"
                    />
                    <ResuableDropdown
                      label="Willing nearby?"
                      value={formData.coverNearby}
                      onChange={(v) => handleValueChange("coverNearby", v)}
                      options={dropOptions.yesNo}
                      required
                    />
                  </div>
                </div>

                <div
                  className="bg-white rounded-xl border shadow-sm"
                  style={{
                    backgroundColor: "var(--bg-primary)",
                    borderColor: "var(--border-color)",
                  }}
                >
                  <SectionHeader
                    icon={Clock}
                    number="05"
                    title="Execution Timing"
                    subtitle="Availability windows"
                  />
                  <div className="p-6 md:p-8 grid grid-cols-1 xl:grid-cols-2 gap-6 md:gap-8">
                    <ResuableDropdown
                      label="Days"
                      value={formData.availableDays}
                      onChange={(v) => handleValueChange("availableDays", v)}
                      options={dropOptions.availableDays}
                      required
                    />
                    <ResuableDropdown
                      label="Shift"
                      value={formData.availableTime}
                      onChange={(v) => handleValueChange("availableTime", v)}
                      options={dropOptions.timeSlots}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* 6. Personal Profile */}
              <div
                className="rounded-xl border shadow-sm"
                style={{
                  backgroundColor: "var(--bg-primary)",
                  borderColor: "var(--border-color)",
                }}
              >
                <SectionHeader
                  icon={Smartphone}
                  number="06"
                  title="Personal Profile"
                  subtitle="Background information"
                  rightContent={
                    <FileUploadSlot
                      label="Profile Photo"
                      value={attachments["Profile Photo"]}
                      onChange={(f) =>
                        handleAttachmentChange("Profile Photo", f)
                      }
                      icon="camera"
                      variant="circle"
                    />
                  }
                />
                <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                  <ResuableDropdown
                    label="Gender"
                    value={formData.gender}
                    onChange={(v) => handleValueChange("gender", v)}
                    options={dropOptions.gender}
                  />
                  <ResuableDropdown
                    label="Age Group"
                    value={formData.ageGroup}
                    onChange={(v) => handleValueChange("ageGroup", v)}
                    options={dropOptions.ageGroups}
                  />
                </div>
              </div>

              {/* Side-by-Side (7 & 8) */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div
                  className="bg-white rounded-xl border shadow-sm"
                  style={{
                    backgroundColor: "var(--bg-primary)",
                    borderColor: "var(--border-color)",
                  }}
                >
                  <SectionHeader
                    icon={HelpCircle}
                    number="07"
                    title="Area Familiarity"
                    subtitle="Local knowledge assessment"
                  />
                  <div className="p-6 md:p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-3 gap-6">
                    <ResuableInput
                      label="Years in Area"
                      value={formData.yearsInArea}
                      onChange={(v) => handleValueChange("yearsInArea", v)}
                      type="number"
                      placeholder="0"
                    />
                    <ResuableDropdown
                      label="Familiarity"
                      value={formData.familiarityLevel}
                      onChange={(v) => handleValueChange("familiarityLevel", v)}
                      options={dropOptions.familiarity}
                    />
                    <ResuableInput
                      label="Languages"
                      value={formData.languages}
                      onChange={(v) => handleValueChange("languages", v)}
                      placeholder="e.g. Tamil, English"
                    />
                  </div>
                </div>

                <div
                  className="bg-white rounded-xl border shadow-sm"
                  style={{
                    backgroundColor: "var(--bg-primary)",
                    borderColor: "var(--border-color)",
                  }}
                >
                  <SectionHeader
                    icon={Car}
                    number="08"
                    title="Mobility & Logistics"
                    subtitle="Transport mode for efficiency"
                  />
                  <div className="p-6 md:p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-3 gap-6">
                    <ResuableDropdown
                      label="Transport"
                      value={formData.transportMode}
                      onChange={(v) => handleValueChange("transportMode", v)}
                      options={dropOptions.transport}
                    />
                    <ResuableInput
                      label="Distance"
                      value={formData.maxDistance}
                      onChange={(v) => handleValueChange("maxDistance", v)}
                      placeholder="e.g. 10km"
                    />
                    <ResuableDropdown
                      label="Fuel Refund"
                      value={formData.fuelReimbursement}
                      onChange={(v) =>
                        handleValueChange("fuelReimbursement", v)
                      }
                      options={dropOptions.yesNo}
                    />
                  </div>
                </div>
              </div>

              {/* 9. Extended Support & Proofs */}
              <div
                className="rounded-xl border shadow-sm"
                style={{
                  backgroundColor: "var(--bg-primary)",
                  borderColor: "var(--border-color)",
                }}
              >
                <SectionHeader
                  icon={ShieldCheck}
                  number="09"
                  title="Extended Support & Proofs"
                  subtitle="Emergency readiness and verification"
                />
                <div className="p-6 md:p-8 space-y-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                    <ResuableDropdown
                      label="Emergency"
                      value={formData.emergencyAvailable}
                      onChange={(v) =>
                        handleValueChange("emergencyAvailable", v)
                      }
                      options={dropOptions.yesNo}
                      info="Available for emergency food distribution calls?"
                    />
                    <ResuableDropdown
                      label="Late Night"
                      value={formData.nightHours}
                      onChange={(v) => handleValueChange("nightHours", v)}
                      options={dropOptions.yesNo}
                      info="Can work during late night hours (after 9 PM)?"
                    />
                    <ResuableDropdown
                      label="First Aid"
                      value={formData.firstAid}
                      onChange={(v) => handleValueChange("firstAid", v)}
                      options={dropOptions.yesNo}
                      info="Do you have first aid training or certification?"
                    />
                    <ResuableInput
                      label="Emergency"
                      value={formData.emergencyPhone}
                      onChange={(v) => handleValueChange("emergencyPhone", v)}
                      required
                      placeholder="+91-XXXXX-XXXXX"
                      info="Alternate contact number for emergencies"
                    />
                  </div>
                  <div
                    className="h-px"
                    style={{ backgroundColor: "var(--border-color)" }}
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-10">
                    <FileUploadSlot
                      label="Address Proof"
                      value={attachments["Address Proof"]}
                      onChange={(f) =>
                        handleAttachmentChange("Address Proof", f)
                      }
                      icon="file"
                      mandatory={true}
                    />
                    <FileUploadSlot
                      label="ID Proof"
                      value={attachments["Government ID Proof"]}
                      onChange={(f) =>
                        handleAttachmentChange("Government ID Proof", f)
                      }
                      icon="shield"
                      mandatory={true}
                    />
                    <FileUploadSlot
                      label="Organization ID"
                      value={attachments["NGO ID"]}
                      onChange={(f) => handleAttachmentChange("NGO ID", f)}
                      icon="file"
                    />
                  </div>
                </div>
              </div>

              {/* 10. Safety & Consent */}
              <div
                className="rounded-xl border shadow-sm"
                style={{
                  backgroundColor: "var(--bg-primary)",
                  borderColor: "var(--border-color)",
                }}
              >
                <SectionHeader
                  icon={ShieldCheck}
                  number="10"
                  title="Safety & Consent"
                  subtitle="Hygiene and food handling protocols"
                />
                <div className="p-8 flex flex-col md:flex-row gap-10 items-center justify-between">
                  <div className="w-full md:w-1/3">
                    <ResuableDropdown
                      label="Handle food?"
                      value={formData.willingToHandleFood}
                      onChange={(v) =>
                        handleValueChange("willingToHandleFood", v)
                      }
                      options={dropOptions.yesNo}
                      required
                    />
                  </div>
                  <div
                    className={`flex-1 p-5 rounded-xl border-2 border-dashed flex items-start gap-4 transition-all cursor-pointer group/consent`}
                    style={{
                      backgroundColor: formData.followSafetyGuidelines
                        ? "rgba(34, 197, 94, 0.05)"
                        : "var(--bg-primary)",
                      borderColor: formData.followSafetyGuidelines
                        ? "rgba(34, 197, 94, 0.2)"
                        : "var(--border-color)",
                    }}
                    onClick={() =>
                      handleValueChange(
                        "followSafetyGuidelines",
                        !formData.followSafetyGuidelines,
                      )
                    }
                  >
                    <div
                      className={`mt-0.5 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-300 ${
                        formData.followSafetyGuidelines
                          ? "bg-[#22c55e] border-[#22c55e] scale-110"
                          : "border-[var(--border-color)] group-hover/consent:border-emerald-300"
                      }`}
                      style={{
                        backgroundColor: formData.followSafetyGuidelines
                          ? "#22c55e"
                          : "var(--bg-secondary)",
                      }}
                    >
                      {formData.followSafetyGuidelines && (
                        <CheckCircle size={14} className="text-white" />
                      )}
                    </div>
                    <div className="flex-1 text-left">
                      <label
                        className="text-[11px] font-black cursor-pointer leading-relaxed block uppercase tracking-tight"
                        style={{ color: "var(--text-primary)" }}
                      >
                        Confirm Safety Protocol Compliance
                      </label>
                      <p
                        className="text-[10px] font-bold mt-1"
                        style={{ color: "var(--text-muted)" }}
                      >
                        I agree to strictly follow all hygiene guidelines during
                        food collection and distribution.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>

          {/* Footer Actions */}
          <div
            className="fixed bottom-0 left-0 right-0 p-6 z-[200] border-t"
            style={{
              backgroundColor: "var(--bg-primary)",
              borderColor: "var(--border-color)",
            }}
          >
            <div className="flex items-center justify-end gap-6 pr-8">
              <ReusableButton
                variant="ghost"
                onClick={() => navigate("/admin/users/volunteers")}
                className="font-black text-[11px] uppercase tracking-[0.2em] hover:text-red-500"
                style={{ color: "var(--text-muted)" }}
              >
                Cancel Entry
              </ReusableButton>
              <ReusableButton
                onClick={() =>
                  (
                    document.querySelector("form") as HTMLFormElement
                  ).requestSubmit()
                }
                variant="primary"
                className="min-w-[240px] h-[54px] !bg-[#22c55e] hover:!bg-[#1ea34a] !rounded-xl transition-all font-black text-[11px] uppercase tracking-[0.2em]"
                startContent={<CheckCircle size={20} />}
              >
                Confirm Registration
              </ReusableButton>
            </div>
          </div>
        </div>

        {/* Success Modal */}
        <Modal
          isOpen={showSuccess}
          onOpenChange={(open) => {
            if (!open) navigate("/admin/users/volunteers");
          }}
          backdrop="blur"
          placement="center"
          hideCloseButton
          className="max-w-sm"
          classNames={{
            base: "rounded-[2.5rem] shadow-2xl overflow-visible",
            backdrop: "bg-[#0f172a]/60 backdrop-blur-md",
          }}
          style={{ backgroundColor: "var(--bg-primary)" }}
        >
          <ModalContent>
            {(onClose) => (
              <ModalBody className="p-10 flex flex-col items-center text-center">
                <div
                  className="w-24 h-24 rounded-full flex items-center justify-center mb-10 shadow-inner border relative"
                  style={{
                    backgroundColor: "var(--bg-tertiary)",
                    borderColor: "var(--border-color)",
                  }}
                >
                  <div className="absolute inset-0 bg-[#22c55e]/20 rounded-full animate-ping duration-[2000ms]" />
                  <div className="w-16 h-16 rounded-full bg-[#22c55e] flex items-center justify-center relative z-10 transition-transform duration-500 hover:scale-110">
                    <CheckCircle size={36} className="text-white" />
                  </div>
                </div>

                <h3
                  className="text-2xl font-black tracking-tight leading-tight mb-4"
                  style={{ color: "var(--text-primary)" }}
                >
                  Registration Received!
                </h3>

                <p
                  className="text-[13px] font-semibold leading-relaxed mb-10 px-4"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Your details have been successfully submitted for
                  verification. We'll notify you once our team completes the
                  review.
                </p>

                <ReusableButton
                  onClick={() => {
                    onClose();
                    navigate("/admin/users/volunteers");
                  }}
                  variant="primary"
                  className="w-full h-14 !bg-[#22c55e] hover:!bg-[#1ea34a] !rounded-2xl transition-all font-black text-[11px] uppercase tracking-[0.2em] active:scale-[0.98]"
                >
                  Return to Directory
                </ReusableButton>

                <p
                  className="text-[10px] font-bold mt-8 uppercase tracking-widest px-4 py-1.5 rounded-full border"
                  style={{
                    color: "var(--text-muted)",
                    backgroundColor: "var(--bg-tertiary)",
                    borderColor: "var(--border-color)",
                  }}
                >
                  Thank you for your interest
                </p>
              </ModalBody>
            )}
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
};

export default CreateVolunteer;
