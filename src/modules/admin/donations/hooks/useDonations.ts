import { useState, useMemo, useCallback } from "react";
import { useDonationStore } from "../store/donation-store";
import type { Donation, Volunteer } from "../store/donation-schemas";

export const useDonations = () => {
  const { donations, volunteers, stats, updateDonation, fetchDonations, isLoading } = useDonationStore();

  // Filter States
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [foodTypeFilter, setFoodTypeFilter] = useState<string>("all");

  const toggleFilter = useCallback((filterType: string) => {
    setActiveFilters((prev) =>
      prev.includes(filterType)
        ? prev.filter((f) => f !== filterType)
        : [...prev, filterType],
    );
    if (filterType === "status") setStatusFilter("all");
    if (filterType === "foodType") setFoodTypeFilter("all");
  }, []);

  const filteredDonations = useMemo(() => {
    return donations.filter((item) => {
      const matchStatus =
        !activeFilters.includes("status") ||
        statusFilter === "all" ||
        item.status === statusFilter;
      const matchFoodType =
        !activeFilters.includes("foodType") ||
        foodTypeFilter === "all" ||
        item.foodType === foodTypeFilter;
      return matchStatus && matchFoodType;
    });
  }, [donations, activeFilters, statusFilter, foodTypeFilter]);

  const busyVolunteerNames = useMemo(
    () =>
      donations
        .filter((d) => d.status.startsWith("Waiting for"))
        .map((d) => d.status.replace("Waiting for ", "").split(" (")[0]),
    [donations],
  );

  const availableVolunteers = useMemo(
    () => volunteers.filter((v) => !busyVolunteerNames.includes(v.name)),
    [volunteers, busyVolunteerNames],
  );

  const assignVolunteer = useCallback(
    (donationId: string, volunteer: Volunteer) => {
      updateDonation(donationId, {
        status: `Waiting for ${volunteer.name}`,
        assignedVolunteer: volunteer.name,
      });
    },
    [updateDonation],
  );

  const rejectAssignment = useCallback(
    (donationId: string) => {
      updateDonation(donationId, {
        status: "Pending",
        assignedVolunteer: null,
      });
    },
    [updateDonation],
  );

  return {
    donations,
    filteredDonations,
    availableVolunteers,
    stats,
    fetchDonations,
    isLoading,
    filters: {
      activeFilters,
      statusFilter,
      foodTypeFilter,
      setStatusFilter,
      setFoodTypeFilter,
      toggleFilter,
    },
    actions: {
      assignVolunteer,
      rejectAssignment,
    },
  };
};
