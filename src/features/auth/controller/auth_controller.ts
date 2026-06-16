import React from "react";
import { AuthAPI } from "../api/auth_api";
import { useAuthStore } from "../../../global/contexts/auth-store";
import { useAuthApiStore } from "../store/auth_store";
import { toast } from "sonner";
import { navigate } from "../../../core/navigation";

export const onInit = async () => {
  // Lifecycle hook for authentication screen initialization
};

export const onDestroy = () => {
  // Lifecycle hook for authentication screen tear-down
};

/**
 * Controller-level form submission handler for authentication.
 */
export const handleAuthSubmit = async (
  e: React.FormEvent<HTMLFormElement>,
  setErrors: (errors: string[]) => void
) => {
  e.preventDefault();
  setErrors([]);

  const apiStore = useAuthApiStore.getState();
  apiStore.setLoading(true);

  const formData = new FormData(e.currentTarget);
  const email = formData.get("email")?.toString().trim() || "";
  const password = formData.get("password")?.toString() || "";
  const role = formData.get("role")?.toString().toLowerCase() || "donor";

  // Client-side validation
  const errorsList: string[] = [];
  if (!email) {
    errorsList.push("Email address is required.");
  } else if (!/\S+@\S+\.\S+/.test(email)) {
    errorsList.push("Please enter a valid email address.");
  }
  if (!password) {
    errorsList.push("Password is required.");
  }

  if (errorsList.length > 0) {
    setErrors(errorsList);
    apiStore.setLoading(false);
    return;
  }

  try {
    const { token, user } = await AuthAPI.login({
      email,
      password,
      role,
    });

    const auth = useAuthStore.getState();
    auth.login(
      {
        id: user.id,
        username: user.username,
        email: user.email,
        first_name: "",
        last_name: "",
        profile: {
          role: user.role as any,
          phone: user.phone || null,
          address: null,
        },
        donor_profile: user.role === "DONOR" && user.donorProfile
          ? {
              total_donations: 0,
              reliability_score: 100,
            }
          : undefined,
        ngo_profile: user.role === "NGO" && user.ngoProfile
          ? {
              name: user.ngoProfile.name || "",
              registration_id: "",
              contact_number: user.phone || "",
            }
          : undefined,
      },
      token,
      token
    );

    toast.success(`Welcome back, ${user.username}!`);

    // Role-based redirects mapping
    const backendRoleToFrontendRoute: Record<string, string> = {
      ADMIN: "/admin/dashboard",
      DONOR: "/donor/dashboard",
      NGO: "/ngo/dashboard",
      VOLUNTEER: "/volunteer/dashboard",
    };

    const targetRoute = backendRoleToFrontendRoute[user.role] || "/auth";
    navigate(targetRoute);
  } catch (error: any) {
    console.error("Auth submit error:", error);
    const msg =
      error.message ||
      error.response?.data?.detail ||
      "Invalid credentials. Please try again.";
    setErrors([msg]);
    toast.error(msg);
  } finally {
    apiStore.setLoading(false);
  }
};
