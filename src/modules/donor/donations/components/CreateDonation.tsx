import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, CheckCircle, Package, MapPin, Heart, Loader2, Check, Plus, Trash2, Utensils, Clock as ClockIcon, Tag, Edit } from "lucide-react";
import ResuableInput from "../../../../global/components/resuable-components/input";
import ResuableButton from "../../../../global/components/resuable-components/button";
import ResuableDropdown from "../../../../global/components/resuable-components/dropdown";
import ResuableDatePicker from "../../../../global/components/resuable-components/datepicker";
import ResuableTimePicker from "../../../../global/components/resuable-components/TimePicker";
import FileUploadSlot from "../../../../global/components/resuable-components/FileUploadSlot";

import { FOOD_CATEGORIES, UNIT_OPTIONS, DIETARY_TYPES, PREPARATION_TYPES } from "../../../../global/constants/donation_config";
import { toast } from "sonner";
import ResuableModal from "../../../../global/components/resuable-components/modal";
import ResuableTextarea from "../../../../global/components/resuable-components/textarea";

import { useQuery, useMutation } from "@apollo/client";
import { GET_CONFIG_ITEMS, CREATE_DONATION, DELETE_DONATION } from "../api/donations/donations.graphql";
import { useDonorStore } from "../../store/donor-store";

const CreateDonation = () => {
  const navigate = useNavigate();
  const { redonatePayload, setRedonatePayload } = useDonorStore();
  const [searchParams] = useSearchParams();
  const needId = searchParams.get("need_id");
  const ngoId = searchParams.get("ngo_id");
  
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [originalDonationId, setOriginalDonationId] = useState<string | null>(null);
  
  const [currentItem, setCurrentItem] = useState({
    foodCategory: "",
    dietaryType: "Veg",
    preparationType: "Restaurant",
    quantity: "",
    unit: "kg",
    description: "",
    expiryDate: "",
    expiryTime: "",
    foodPhoto: null as File | null,
    otherCategory: "",
  });

  const [logistics, setLogistics] = useState({
    pickupAddress: "",
    contactPhone: "",
  });

  const [isSuggestModalOpen, setIsSuggestModalOpen] = useState(false);
  const [suggestionCategoryName, setSuggestionCategoryName] = useState("");
  const [suggestionReason, setSuggestionReason] = useState("");
  const [isSubmittingSuggestion, setIsSubmittingSuggestion] = useState(false);
  const [isSuggestionSuccess, setIsSuggestionSuccess] = useState(false);

  // Pre-fill form from redonate data if passed via global store
  useEffect(() => {
    if (redonatePayload) {
      const data = redonatePayload;
      
      if (data.id) {
        setOriginalDonationId(String(data.id));
      }

      let qty = "";
      let unt = "kg";
      if (data.quantity) {
        const parts = String(data.quantity).split(" ");
        qty = parts[0] || "";
        unt = parts.length > 1 ? parts.slice(1).join(" ") : "kg";
      }

      setItems([{
        id: Date.now(),
        foodCategory: data.category || "",
        dietaryType: data.dietaryType || "Veg",
        preparationType: data.preparationType || "Restaurant",
        quantity: qty,
        unit: unt,
        description: data.foodType || data.description || "",
        expiryDate: data.expiryTime ? data.expiryTime.split("T")[0] : "",
        expiryTime: data.expiryTime && data.expiryTime.includes("T") ? data.expiryTime.split("T")[1] : "",
        foodPhoto: null,
        otherCategory: ""
      }]);

      setLogistics({
        pickupAddress: data.pickupAddress || "",
        contactPhone: ""
      });
      
      // Clear store payload to prevent re-filling on reload or subsequent visits
      setRedonatePayload(null);
      toast.info("Donation details imported for review");
    }
  }, [redonatePayload, setRedonatePayload]);

  // Load configuration items dynamically from Apollo Client / backend GraphQL
  const { data: configData } = useQuery(GET_CONFIG_ITEMS);

  const [createDonation] = useMutation(CREATE_DONATION);
  const [deleteDonation] = useMutation(DELETE_DONATION);

  const foodCategories = configData?.configItems
    ?.filter((c: any) => c.key === "foodCategories")
    ?.map((c: any) => ({ value: c.name, label: c.name })) || FOOD_CATEGORIES;

  const unitOptions = configData?.configItems
    ?.filter((c: any) => c.key === "donationUnits")
    ?.map((c: any) => ({ value: c.name, label: c.description || c.name })) || UNIT_OPTIONS;

  const dietaryTypes = configData?.configItems
    ?.filter((c: any) => c.key === "dietaryTypes")
    ?.map((c: any) => ({ value: c.name, label: c.description || c.name })) || DIETARY_TYPES;

  const preparationTypes = configData?.configItems
    ?.filter((c: any) => c.key === "preparationTypes")
    ?.map((c: any) => ({ value: c.name, label: c.description || c.name })) || PREPARATION_TYPES;

  const handleItemValueChange = (name: string, value: string | File | null) => {
    setCurrentItem((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogisticsChange = (name: string, value: string) => {
    setLogistics((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addItem = () => {
    if (!currentItem.foodCategory || !currentItem.quantity) {
      toast.error("Please fill in category and quantity");
      return;
    }

    if (editingId !== null) {
      setItems((prev) =>
        prev.map((item) => (item.id === editingId ? { ...currentItem, id: editingId } : item))
      );
      setEditingId(null);
      toast.success("Changes saved successfully!");
    } else {
      setItems((prev) => [...prev, { ...currentItem, id: Date.now() }]);
      toast.success("Item added to donation list");
    }

    // Reset item form
    setCurrentItem({
      foodCategory: "",
      dietaryType: "Veg",
      preparationType: "Restaurant",
      quantity: "",
      unit: "kg",
      description: "",
      expiryDate: "",
      expiryTime: "",
      foodPhoto: null as File | null,
      otherCategory: "",
    });
  };

  const removeItem = (id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    if (editingId === id) {
      setEditingId(null);
    }
  };

  const editItem = (item: any) => {
    // If we were already editing another item, auto-save its current values first!
    if (editingId !== null && editingId !== item.id) {
      setItems((prev) =>
        prev.map((i) => (i.id === editingId ? { ...currentItem, id: editingId } : i))
      );
      toast.success("Auto-saved changes to the previous item!");
    }

    setEditingId(item.id);
    setCurrentItem({
      foodCategory: item.foodCategory,
      dietaryType: item.dietaryType,
      preparationType: item.preparationType,
      quantity: item.quantity,
      unit: item.unit,
      description: item.description,
      expiryDate: item.expiryDate,
      expiryTime: item.expiryTime,
      foodPhoto: item.foodPhoto,
      otherCategory: item.otherCategory || "",
    });
    // Scroll to form
    window.scrollTo({ top: 400, behavior: 'smooth' });
    toast.info("Editing item details in the form");
  };

  const uploadImageToCloudinary = async (file: File): Promise<string | null> => {
    const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "deyog3v3w";
    const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "hunger_free_preset";

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to upload image to Cloudinary");
      }

      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      toast.warning(`Image upload failed for "${file.name}". Submitting donation without photo.`);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let finalItems = [...items];

      // Auto-capture: If list is empty, but they filled out Card 01 details, save it automatically!
      if (finalItems.length === 0 && currentItem.foodCategory && currentItem.quantity) {
        finalItems.push({ ...currentItem, id: Date.now() });
      }

      if (finalItems.length === 0) {
        toast.error("Please add at least one food item to your donation list");
        setLoading(false);
        return;
      }

      // 1. Upload all images in parallel (highly optimized, cuts wait time)
      toast.info("Uploading donation images securely to Cloudinary...");
      const uploadedUrls = await Promise.all(
        finalItems.map(async (item) => {
          if (item.foodPhoto) {
            return await uploadImageToCloudinary(item.foodPhoto);
          }
          return null;
        })
      );

      // 2. Submit each donation request using the uploaded URL or null on failure
      for (let i = 0; i < finalItems.length; i++) {
        const item = finalItems[i];
        const imageUrl = uploadedUrls[i];

        const input = {
          foodType: item.description || "Unnamed Food Item",
          category: item.foodCategory === "other" ? item.otherCategory : item.foodCategory,
          dietaryType: item.dietaryType,
          preparationType: item.preparationType,
          quantity: `${item.quantity} ${item.unit}`,
          ngo: ngoId || null,
          date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }),
          pickupAddress: logistics.pickupAddress,
          description: item.description || "Fresh food donation.",
          expiryTime: item.expiryDate && item.expiryTime ? `${item.expiryDate}T${item.expiryTime}` : null,
          image: imageUrl,
          relatedNeed: needId || null
        };

        await createDonation({ variables: { input } });
      }

      // If this was a redonated donation, automatically delete the original cancelled donation
      if (originalDonationId) {
        try {
          await deleteDonation({ variables: { id: originalDonationId } });
          console.log(`Successfully deleted original cancelled donation ${originalDonationId}`);
        } catch (deleteError) {
          console.error("Failed to automatically delete original donation:", deleteError);
        }
      }

      toast.success("Donations submitted successfully through GraphQL!");
      navigate("/donor/donations");
    } catch (error: any) {
      console.error("Submission failed:", error);
      toast.error(`Failed to submit donation: ${error.message || "Please check your network and data."}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-3 sm:p-4 lg:p-5 pb-10 w-full mx-auto min-h-screen" style={{ backgroundColor: "var(--bg-secondary)" }}>
      {/* Header Bar */}
      <div className="max-w-5xl mx-auto mb-8 sm:mb-12 px-1 sm:px-0">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
          <button onClick={() => navigate("/donor/donations")} className="flex items-center gap-2 transition-colors group w-fit" style={{ color: "var(--text-secondary)" }}>
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] pt-0.5">Back</span>
          </button>
          <div className="hidden sm:block h-10 w-px bg-[var(--border-color)] opacity-60" />
          <div className="min-w-0">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter leading-none" style={{ color: "var(--text-primary)" }}>Create Donation</h1>
          </div>
        </div>
      </div>

      {needId && (
        <div className="max-w-4xl mx-auto mb-6 p-4 rounded-md border border-green-500/20 bg-green-500/5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white shrink-0">
            <Heart size={20} fill="currentColor" />
          </div>
          <div>
            <h3 className="text-xs font-black uppercase tracking-tight text-green-600">Responding to NGO Need</h3>
            <p className="text-[10px] font-medium text-green-700/80 uppercase tracking-widest mt-0.5">Your donation will be directly prioritized for this organization's request.</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6 pb-24">
        {/* Card 01: Food Info */}
        <div className="border rounded-md shadow-sm" style={{ borderColor: "var(--border-color)", backgroundColor: "var(--bg-primary)" }}>
          <div className="border-b p-5 sm:p-7 flex items-center gap-4" style={{ borderColor: "var(--border-color)" }}>
            <div className="w-12 h-12 border rounded-xl flex items-center justify-center shadow-sm shrink-0" style={{ backgroundColor: "rgba(34, 197, 94, 0.08)", borderColor: "rgba(34, 197, 94, 0.15)", color: "#22c55e" }}>
              <Package size={24} />
            </div>
            <div>
              <h2 className="text-xs sm:text-sm font-black uppercase tracking-tight leading-none" style={{ color: "var(--text-primary)" }}>01. Food Details</h2>
              <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest mt-1.5 opacity-40" style={{ color: "var(--text-secondary)" }}>Tell us what you are donating today</p>
            </div>
          </div>

          {/* ADDED ITEMS LIST & LIVE DRAFT PREVIEW */}
          {(items.length > 0 || (editingId === null && (currentItem.foodCategory || currentItem.description || currentItem.quantity))) && (
            <div className="p-5 sm:p-8 space-y-4 bg-emerald-50/10 border-b" style={{ borderColor: 'var(--border-color)' }}>
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 mb-4 flex items-center gap-2">
                <Utensils size={14} /> Added Items ({items.length + (editingId === null && (currentItem.foodCategory || currentItem.description || currentItem.quantity) ? 1 : 0)})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {items.map((item) => {
                  const isEditingThisItem = item.id === editingId;
                  const displayItem = isEditingThisItem ? { ...currentItem, id: item.id } : item;

                  return (
                    <div key={item.id} className={`bg-white border rounded-2xl p-5 flex flex-col gap-4 shadow-sm group hover:shadow-md transition-all relative overflow-hidden ${isEditingThisItem ? 'border-dashed border-blue-400 bg-blue-50/10 animate-pulse' : 'border-emerald-100'}`}>
                      {/* Decorative side accent */}
                      <div className={`absolute left-0 top-0 bottom-0 w-1 ${isEditingThisItem ? 'bg-blue-500 animate-pulse' : 'bg-emerald-500 opacity-20'}`} />
                      
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <h4 className={`text-[10px] font-black uppercase tracking-[0.2em] ${isEditingThisItem ? 'text-blue-600' : 'text-emerald-600'}`}>
                            {displayItem.foodCategory || "SELECT CATEGORY"}
                          </h4>
                          <p className={`text-sm font-black leading-tight ${isEditingThisItem ? 'text-slate-800 italic opacity-85' : 'text-slate-900'}`}>
                            {displayItem.description || "Enter Food Name..."}
                          </p>
                        </div>
                        
                        {isEditingThisItem ? (
                          <div className="flex items-center gap-1.5 text-[9px] font-black text-blue-600 bg-blue-50 border border-blue-200/50 px-2.5 py-1 rounded-lg uppercase tracking-wider shrink-0">
                            <Loader2 size={10} className="animate-spin text-blue-500 shrink-0" />
                            Editing
                          </div>
                        ) : (
                          <div className="flex gap-1">
                            <button 
                              type="button"
                              onClick={() => editItem(item)}
                              className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                              title="Edit Item"
                            >
                              <Edit size={16} />
                            </button>
                            <button 
                              type="button"
                              onClick={() => removeItem(item.id)}
                              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                              title="Remove Item"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                          <Tag size={12} className="opacity-50" /> {displayItem.quantity || "0"} {displayItem.unit}
                        </span>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
                          {displayItem.dietaryType}
                        </span>
                      </div>

                      <div className="pt-3 border-t border-slate-50 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex flex-col">
                            <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 leading-none mb-1">Expires On</span>
                            <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700">
                              <ClockIcon size={12} className="text-blue-500" />
                              {displayItem.expiryDate || "Not set"} @ {displayItem.expiryTime || "Not set"}
                            </div>
                          </div>
                        </div>
                        <div className={`text-[9px] font-black uppercase tracking-tighter ${isEditingThisItem ? 'text-blue-400' : 'text-slate-300'}`}>
                          {displayItem.preparationType}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* DRAFT / IN-PROGRESS CARD (Only shown when adding new item) */}
                {editingId === null && (currentItem.foodCategory || currentItem.description || currentItem.quantity) && (
                  <div className="border border-dashed border-blue-300 bg-blue-50/10 rounded-2xl p-5 flex flex-col gap-4 shadow-sm relative overflow-hidden animate-pulse">
                    {/* Decorative side accent with pulse */}
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 opacity-40 animate-pulse" />
                    
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em]">
                          {currentItem.foodCategory || "SELECT CATEGORY"}
                        </h4>
                        <p className="text-sm font-black text-slate-800 leading-tight italic opacity-70">
                          {currentItem.description || "Enter Food Name..."}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-1.5 text-[9px] font-black text-blue-600 bg-blue-50 border border-blue-200/50 px-2.5 py-1 rounded-lg uppercase tracking-wider">
                        <Loader2 size={10} className="animate-spin text-blue-500 shrink-0" />
                        In Progress
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                        <Tag size={12} className="opacity-50" /> {currentItem.quantity || "0"} {currentItem.unit}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
                        {currentItem.dietaryType}
                      </span>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col">
                          <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 leading-none mb-1">Expires On</span>
                          <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700">
                            <ClockIcon size={12} className="text-blue-500" />
                            {currentItem.expiryDate || "Not set"} @ {currentItem.expiryTime || "Not set"}
                          </div>
                        </div>
                      </div>
                      <div className="text-[9px] font-black uppercase text-slate-400 tracking-tighter">
                        {currentItem.preparationType}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="p-5 sm:p-8 space-y-8">
            <FileUploadSlot label="Food Item Photo" value={currentItem.foodPhoto} onChange={(file: File | null) => handleItemValueChange("foodPhoto", file)} subtitle="High-quality image for better verification" icon="camera" mandatory />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col gap-1.5">
                <ResuableDropdown label="Food Category" value={currentItem.foodCategory} onChange={(val) => handleItemValueChange("foodCategory", val)} options={foodCategories} placeholder="Select Type" required={items.length === 0} align="left" />
                <button type="button" onClick={() => setIsSuggestModalOpen(true)} className="self-start flex items-center gap-1.5 text-[9px] font-black text-[#22c55e] hover:text-[#16a34a] transition-colors uppercase tracking-[0.2em] px-1 hover:underline underline-offset-4 decoration-2">Request new category</button>
              </div>

              <ResuableInput label="Food Name" placeholder="e.g. Veg Biryani, Pooris & Sabji" value={currentItem.description} onChange={(val) => handleItemValueChange("description", val)} required={items.length === 0} align="left" />
              <ResuableInput label="Quantity" type="number" value={currentItem.quantity} onChange={(val) => handleItemValueChange("quantity", val)} required={items.length === 0} placeholder="0" align="left" />
              <ResuableDropdown label="Unit" value={currentItem.unit} onChange={(val) => handleItemValueChange("unit", val)} options={unitOptions} placeholder="Unit" required={items.length === 0} align="left" />
              <ResuableDropdown label="Dietary Type" value={currentItem.dietaryType} onChange={(val) => handleItemValueChange("dietaryType", val)} options={dietaryTypes} placeholder="Select Type" required={items.length === 0} align="left" />
              <ResuableDropdown label="Preparation" value={currentItem.preparationType} onChange={(val) => handleItemValueChange("preparationType", val)} options={preparationTypes} placeholder="Select Prep" required={items.length === 0} align="left" />
            </div>

          </div>

          <div className="p-5 sm:p-8 space-y-8 bg-[var(--bg-secondary)]/30 border-t" style={{ borderColor: 'var(--border-color)' }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <ResuableDatePicker label="Expiry Date" value={currentItem.expiryDate} required={items.length === 0} onChange={(val) => handleItemValueChange("expiryDate", val)} align="left" />
              <ResuableTimePicker label="Expiry Time" value={currentItem.expiryTime} onChange={(val) => handleItemValueChange("expiryTime", val)} required={items.length === 0} align="left" />
            </div>
          </div>



          <div className="p-5 sm:p-8 border-t flex justify-center gap-4 animate-in fade-in slide-in-from-bottom duration-300" style={{ borderColor: 'var(--border-color)' }}>
            {editingId !== null && (
              <button 
                type="button" 
                onClick={() => {
                  setEditingId(null);
                  setCurrentItem({
                    foodCategory: "",
                    dietaryType: "Veg",
                    preparationType: "Restaurant",
                    quantity: "",
                    unit: "kg",
                    description: "",
                    expiryDate: "",
                    expiryTime: "",
                    foodPhoto: null as File | null,
                    otherCategory: "",
                  });
                  toast.info("Cancelled item editing");
                }} 
                className="flex items-center gap-2 px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-300 active:scale-95 shadow-sm"
              >
                Cancel
              </button>
            )}
            <button type="button" onClick={addItem} className="flex items-center gap-3 px-8 py-3.5 bg-emerald-600 text-white rounded-xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-emerald-700 active:scale-95 transition-all shadow-lg shadow-emerald-500/20">
              {editingId !== null ? (
                <>
                  <Check size={18} strokeWidth={3} /> Save Changes
                </>
              ) : (
                <>
                  <Plus size={18} strokeWidth={3} /> Add Item to Donation List
                </>
              )}
            </button>
          </div>
        </div>

        {/* Card 02: Logistics */}
        <div className="border rounded-md shadow-sm" style={{ borderColor: "var(--border-color)", backgroundColor: "var(--bg-primary)" }}>
          <div className="border-b p-5 sm:p-7 flex items-center gap-4" style={{ borderColor: "var(--border-color)" }}>
            <div className="w-12 h-12 border rounded-xl flex items-center justify-center shadow-sm shrink-0" style={{ backgroundColor: "rgba(34, 197, 94, 0.08)", borderColor: "rgba(34, 197, 94, 0.15)", color: "#22c55e" }}>
              <MapPin size={24} />
            </div>
            <div>
              <h2 className="text-xs sm:text-sm font-black uppercase tracking-tight leading-none" style={{ color: "var(--text-primary)" }}>02. Pickup Information</h2>
              <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest mt-1.5 opacity-40" style={{ color: "var(--text-secondary)" }}>Where and how to collect the food</p>
            </div>
          </div>
          <div className="p-5 sm:p-8 space-y-8">
            <ResuableInput label="Full Pickup Address" value={logistics.pickupAddress} onChange={(val) => handleLogisticsChange("pickupAddress", val)} required placeholder="e.g. Block A, Community Hub, Zip 12345" align="left" />
            <div className="grid grid-cols-1 md:grid-cols-1 gap-8">
              <ResuableInput label="Contact Phone" type="tel" value={logistics.contactPhone} onChange={(val) => handleLogisticsChange("contactPhone", val)} required placeholder="+1 (000) 000-0000" align="left" />
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="fixed bottom-0 left-0 right-0 backdrop-blur-lg border-t p-6 z-[200] shadow-[0_-10px_40px_rgba(0,0,0,0.08)]" style={{ backgroundColor: "var(--bg-primary)", borderColor: "var(--border-color)" }}>
          <div className="max-w-5xl mx-auto flex flex-col-reverse sm:flex-row items-center justify-end gap-4 sm:gap-6">
            <ResuableButton variant="ghost" onClick={() => navigate("/donor/donations")} className="w-full sm:w-auto font-black text-[11px] uppercase tracking-[0.2em] hover:text-red-500 transition-colors" style={{ color: "var(--text-muted)" }}>Discard Entry</ResuableButton>
            <ResuableButton type="submit" variant="dark" disabled={loading} className="w-full sm:min-w-[240px] h-[52px] !bg-[#16a34a] hover:!bg-[#15803d] !rounded-md shadow-lg shadow-green-500/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed" startContent={loading ? <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" /> : <CheckCircle size={20} />}>
              <span className="text-[11px] font-black uppercase tracking-widest">{loading ? "Submitting..." : "Confirm Donation"}</span>
            </ResuableButton>
          </div>
        </div>
      </form>

      {/* Suggest Category Modal */}
      <ResuableModal isOpen={isSuggestModalOpen} onOpenChange={setIsSuggestModalOpen} title="Category Suggestion" footer={!isSuggestionSuccess && (
        <div className="flex items-center justify-end gap-3">
          <ResuableButton variant="ghost" size="sm" disabled={isSubmittingSuggestion} onClick={() => { setIsSuggestModalOpen(false); setSuggestionReason(""); setSuggestionCategoryName(""); }}>Cancel</ResuableButton>
          <ResuableButton variant="dark" size="sm" className="!bg-[#16a34a] hover:!bg-[#15803d]" disabled={isSubmittingSuggestion || !suggestionCategoryName} onClick={() => {
            setIsSubmittingSuggestion(true);
            setTimeout(() => {
              setIsSubmittingSuggestion(false);
              setIsSuggestionSuccess(true);
              setTimeout(() => { setIsSuggestionSuccess(false); setIsSuggestModalOpen(false); setSuggestionReason(""); setSuggestionCategoryName(""); }, 2500);
            }, 1500);
          }}>
            {isSubmittingSuggestion ? <div className="flex items-center gap-2"><Loader2 size={14} className="animate-spin" />Submitting...</div> : "Submit Request"}
          </ResuableButton>
        </div>
      )}>
        <div className="space-y-6 py-4">
          {isSuggestionSuccess ? (
            <div className="relative flex flex-col items-center justify-center py-16 animate-in fade-in zoom-in duration-500 overflow-hidden text-center">
              <div className="relative mb-8">
                <div className="absolute inset-0 rounded-full bg-green-100 animate-ping opacity-20 scale-150" />
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center relative z-10 shadow-lg shadow-green-500/20">
                  <Check className="text-white" size={32} strokeWidth={3} />
                </div>
              </div>
              <div className="space-y-3 z-10 px-4">
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-green-600 leading-none mb-1">Sent</h3>
                <h2 className="text-2xl font-black tracking-tight leading-none" style={{ color: "var(--text-primary)" }}>Request Sent!</h2>
                <p className="text-[13px] font-medium max-w-[320px] leading-relaxed mx-auto text-left" style={{ color: "var(--text-muted)" }}>
                  We've received your suggestion for <span className="font-bold px-1.5 py-0.5 rounded-sm" style={{ backgroundColor: "var(--bg-secondary)", color: "var(--text-primary)" }}>{suggestionCategoryName}</span> and our team will review it soon.
                </p>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1" style={{ backgroundColor: "var(--bg-secondary)" }}>
                <div className="h-full bg-green-500 animate-[progress-shrink_2.5s_linear_forwards]" />
              </div>
              <p className="absolute bottom-4 text-[9px] font-bold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Closing automatically...</p>
              <style>{`@keyframes progress-shrink { from { width: 100%; } to { width: 0%; } }`}</style>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <ResuableInput label="Category name" placeholder="e.g., Organic Fertilizers" value={suggestionCategoryName} onChange={setSuggestionCategoryName} required />
              </div>
              <div className="space-y-2">
                <ResuableTextarea value={suggestionReason} onChange={setSuggestionReason} label="Why should we add this?" placeholder="Briefly describe the importance of this category..." rows={3} />
              </div>
              <p className="text-[10px] font-medium italic" style={{ color: "var(--text-muted)" }}>* Our administrators will review this request and update the global list if approved.</p>
            </>
          )}
        </div>
      </ResuableModal>
    </div>
  );
};

export default CreateDonation;
