import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Layout dynamic lazy imports
const AdminLayout = lazy(() => import("./global/layouts/AdminLayout"));
const DonorLayout = lazy(() => import("./global/layouts/DonorLayout"));
const NGOLayout = lazy(() => import("./global/layouts/NGOLayout"));
const VolunteerLayout = lazy(() => import("./global/layouts/VolunteerLayout"));

// Admin dynamic lazy imports
const DonorPage = lazy(() => import("./features/admin/users/components/DonorsPage"));
const NGOsPage = lazy(() => import("./features/admin/users/components/NGOsPage"));
const VolunteersPage = lazy(() => import("./features/admin/users/components/VolunteersPage"));
const DonationsPage = lazy(() => import("./features/admin/donations/page"));
const DonationTrackingPage = lazy(() => import("./features/admin/donations/components/DonationTrackingPage"));
const PendingDonationsPage = lazy(() => import("./features/admin/donations/components/PendingDonationsPage"));
const AnalyticsPage = lazy(() => import("./features/admin/analytics/page"));
const UsersPage = lazy(() => import("./features/admin/users/page"));
const AdminDashboard = lazy(() => import("./features/admin/dashboard/page"));
const PointsTiersView = lazy(() => import("./features/admin/rewards/components/PointsTiersView"));
const RedemptionsView = lazy(() => import("./features/admin/rewards/components/RedemptionsView"));
const RewardsConfig = lazy(() => import("./features/admin/rewards/components/RewardsConfig"));
const MilestonesConfig = lazy(() => import("./features/admin/rewards/components/MilestonesConfig"));
const RewardsPage = lazy(() => import("./features/admin/rewards/page"));
const CreateDonor = lazy(() => import("./features/admin/users/components/CreateDonorPage.tsx"));
const CreateNgo = lazy(() => import("./features/admin/users/components/CreateNgoPage.tsx"));
const CreateVolunteer = lazy(() => import("./features/admin/users/components/CreateVolunteerPage.tsx"));
const ConfigurationPage = lazy(() => import("./features/admin/settings/components/ConfigurationPage"));
const NGOEnquiryPage = lazy(() => import("./features/admin/enquiries/components/NGOEnquiryPage"));
const VolunteerEnquiryPage = lazy(() => import("./features/admin/enquiries/components/VolunteerEnquiryPage"));
const RewardEnquiryPage = lazy(() => import("./features/admin/enquiries/components/RewardEnquiryPage"));
const DonorEnquiryPage = lazy(() => import("./features/admin/enquiries/components/DonorEnquiryPage"));
const EnquiriesHub = lazy(() => import("./features/admin/enquiries/page"));
const SettingsPage = lazy(() => import("./features/admin/settings/page"));

// Donor dynamic lazy imports
const DonorDashboard = lazy(() => import("./features/donor/dashboard/page"));
const DonorMyDonations = lazy(() => import("./features/donor/my_donations/page"));
const DonorCreateDonation = lazy(() => import("./features/donor/create_donation/page"));
const DonorNGOPosts = lazy(() => import("./features/donor/ngo_posts/page"));
const DonorProfile = lazy(() => import("./features/donor/profile/components/Profile"));
const DonorPaymentMethods = lazy(() => import("./features/donor/profile/components/PaymentMethods"));
const DonorRewards = lazy(() => import("./features/donor/rewards/page"));
const DonorBenefits = lazy(() => import("./features/donor/tiers/components/tierandbenefits"));
const DonorLuckySpin = lazy(() => import("./features/donor/lucky_prize/page"));

// NGO dynamic lazy imports
const NGODashboard = lazy(() => import("./features/ngo/dashboard/page"));
const NGODonationRequests = lazy(() => import("./features/ngo/requests/page"));
const NGOInventory = lazy(() => import("./features/ngo/my_inventory/page"));
const NGOAddItem = lazy(() => import("./features/ngo/add_item/page"));
const NGOProfile = lazy(() => import("./features/ngo/profile/page"));
const NGOPaymentMethods = lazy(() => import("./features/ngo/profile/components/PaymentMethods"));
const PostNewNeed = lazy(() => import("./features/ngo/post_need/page"));
const NGORewards = lazy(() => import("./features/ngo/rewards/page"));
const NGOBenefits = lazy(() => import("./features/ngo/tiers/components/tierandbenefits"));
const NGOLuckySpin = lazy(() => import("./features/ngo/lucky_prize/page"));

// Volunteer dynamic lazy imports
const VolunteerDashboard = lazy(() => import("./features/volunteer/dashboard/page"));
const VolunteerTasks = lazy(() => import("./features/volunteer/tasks/page"));
const VolunteerProfile = lazy(() => import("./features/volunteer/profile/page"));
const VolunteerPaymentMethods = lazy(() => import("./features/volunteer/profile/components/PaymentMethods"));
const VolunteerRewards = lazy(() => import("./features/volunteer/rewards/page"));
const VolunteerBenefits = lazy(() => import("./features/volunteer/tiers/components/tierandbenefits"));
const VolunteerLuckySpin = lazy(() => import("./features/volunteer/lucky_prize/page"));

// Auth dynamic lazy import
const AuthPage = lazy(() => import("./features/auth/page"));

const PageLoader = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] w-full gap-4">
    <div className="w-12 h-12 rounded-full border-4 border-green-500/20 border-t-green-500 animate-spin" />
    <span className="text-[10px] font-black text-green-500 uppercase tracking-widest animate-pulse">Loading...</span>
  </div>
);

export const AppRoutes = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Redirect root to /auth */}
        <Route path="/" element={<Navigate to="/auth" />} />

        {/* Auth */}
        <Route path="/auth" element={<AuthPage />} />

        <Route path="/admin" element={<AdminLayout />}>
          {/* Dashboard - standardise to redirect index to dashboard, removing redundancy */}
          <Route index element={<Navigate to="dashboard" />} />
          <Route path="dashboard" element={<AdminDashboard />} />

          {/* Users Section */}
          <Route path="users" element={<UsersPage />} />
          <Route path="users/donors" element={<DonorPage />} />
          <Route path="users/donors/create" element={<CreateDonor />} />
          <Route path="users/ngos" element={<NGOsPage />} />
          <Route path="users/ngos/create" element={<CreateNgo />} />
          <Route path="users/volunteers" element={<VolunteersPage />} />
          <Route
            path="users/volunteers/create"
            element={<CreateVolunteer />}
          />

          {/* Donations Section */}
          <Route path="donations" element={<DonationsPage />} />
          <Route
            path="donations/tracking"
            element={<DonationTrackingPage />}
          />
          <Route
            path="donations/pending"
            element={<PendingDonationsPage />}
          />

          {/* Analytics Section */}
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route
            path="analytics/reports"
            element={<AnalyticsPage />}
          />

          {/* Rewards Section */}
          <Route path="rewards" element={<RewardsPage />}>
            <Route index element={<Navigate to="points" />} />
            <Route path="points" element={<PointsTiersView />} />
            <Route path="redemptions" element={<RedemptionsView />} />
            <Route path="catalog" element={<RewardsConfig />} />
            <Route path="milestones" element={<MilestonesConfig />} />
          </Route>

          {/* Settings Section */}
          <Route path="settings" element={<SettingsPage />} />
          <Route
            path="settings/configuration"
            element={<ConfigurationPage />}
          />

          {/* Enquiry Section */}
          <Route path="enquiries" element={<EnquiriesHub />} />
          <Route path="enquiries/donors" element={<DonorEnquiryPage />} />
          <Route path="enquiries/ngos" element={<NGOEnquiryPage />} />
          <Route
            path="enquiries/volunteers"
            element={<VolunteerEnquiryPage />}
          />
          <Route path="enquiries/rewards" element={<RewardEnquiryPage />} />
        </Route>

        {/* Donor Section */}
        <Route path="/donor" element={<DonorLayout />}>
          <Route index element={<Navigate to="dashboard" />} />
          <Route path="dashboard" element={<DonorDashboard />} />
          <Route path="donations" element={<DonorMyDonations />} />
          <Route path="donations/create" element={<DonorCreateDonation />} />
          <Route path="donations/marketplace" element={<DonorNGOPosts />} />
          <Route path="rewards" element={<DonorRewards />} />
          <Route path="rewards/tiers-benefits" element={<DonorBenefits />} />
          <Route path="rewards/benefits" element={<Navigate to="/donor/rewards/tiers-benefits" replace />} />
          <Route path="lucky-prize" element={<DonorLuckySpin />} />
          <Route path="profile" element={<DonorProfile />} />
          <Route path="profile/payments" element={<DonorPaymentMethods />} />
        </Route>

        {/* NGO Section */}
        <Route path="/ngo" element={<NGOLayout />}>
          <Route index element={<Navigate to="dashboard" />} />
          <Route path="dashboard" element={<NGODashboard />} />
          <Route path="requests" element={<NGODonationRequests />} />
          <Route path="inventory" element={<NGOInventory />} />
          <Route path="inventory/add" element={<NGOAddItem />} />
          <Route path="rewards" element={<NGORewards />} />
          <Route path="rewards/tiers-benefits" element={<NGOBenefits />} />
          <Route path="rewards/benefits" element={<Navigate to="/ngo/rewards/tiers-benefits" replace />} />
          <Route path="lucky-prize" element={<NGOLuckySpin />} />
          <Route path="profile" element={<NGOProfile />} />
          <Route path="profile/payments" element={<NGOPaymentMethods />} />
          <Route path="needs/post" element={<PostNewNeed />} />
        </Route>

        {/* Volunteer Section */}
        <Route path="/volunteer" element={<VolunteerLayout />}>
          <Route index element={<Navigate to="dashboard" />} />
          <Route path="dashboard" element={<VolunteerDashboard />} />
          <Route path="tasks" element={<VolunteerTasks />} />
          <Route path="rewards" element={<VolunteerRewards />} />
          <Route path="rewards/tiers-benefits" element={<VolunteerBenefits />} />
          <Route path="rewards/benefits" element={<Navigate to="/volunteer/rewards/tiers-benefits" replace />} />
          <Route path="lucky-prize" element={<VolunteerLuckySpin />} />
          <Route path="profile" element={<VolunteerProfile />} />
          <Route path="payments" element={<VolunteerPaymentMethods />} />
        </Route>
      </Routes>
    </Suspense>
  );
};
