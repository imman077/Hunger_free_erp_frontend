import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./global/contexts/ThemeContext";
import { Toaster } from "sonner";
import AdminLayout from "./global/layouts/AdminLayout";
import DonorLayout from "./global/layouts/DonorLayout";
import NGOLayout from "./global/layouts/NGOLayout";
import VolunteerLayout from "./global/layouts/VolunteerLayout";
import DonorPage from "./features/admin/users/components/DonorsPage";
import NGOsPage from "./features/admin/users/components/NGOsPage";
import VolunteersPage from "./features/admin/users/components/VolunteersPage";
import DonationsPage from "./features/admin/donations/page";
import DonationTrackingPage from "./features/admin/donations/components/DonationTrackingPage";
import PendingDonationsPage from "./features/admin/donations/components/PendingDonationsPage";
import AnalyticsPage from "./features/admin/analytics/page";
import AnalyticsReportsPage from "./features/admin/analytics/components/AnalyticsReportsPage";
import UsersPage from "./features/admin/users/page";
import AdminDashboard from "./features/admin/dashboard/page";
import PointsTiersView from "./features/admin/rewards/components/PointsTiersView";
import RedemptionsView from "./features/admin/rewards/components/RedemptionsView";
import RewardsConfig from "./features/admin/rewards/components/RewardsConfig";
import MilestonesConfig from "./features/admin/rewards/components/MilestonesConfig";
import RewardsPage from "./features/admin/rewards/page";
import CreateDonor from "./features/admin/users/components/CreateDonorPage.tsx";
import CreateNgo from "./features/admin/users/components/CreateNgoPage.tsx";
import CreateVolunteer from "./features/admin/users/components/CreateVolunteerPage.tsx";
import ConfigurationPage from "./features/admin/settings/components/ConfigurationPage";
import NGOEnquiryPage from "./features/admin/enquiries/components/NGOEnquiryPage";
import VolunteerEnquiryPage from "./features/admin/enquiries/components/VolunteerEnquiryPage";
import RewardEnquiryPage from "./features/admin/enquiries/components/RewardEnquiryPage";
import DonorEnquiryPage from "./features/admin/enquiries/components/DonorEnquiryPage";
import EnquiriesHub from "./features/admin/enquiries/page";
import SettingsPage from "./features/admin/settings/page";

// Donor Imports
import DonorDashboard from "./features/donor/dashboard/components/Dashboard";
import DonorMyDonations from "./features/donor/donations/components/MyDonations";
import DonorCreateDonation from "./features/donor/donations/components/CreateDonation";
import DonorNGOPosts from "./features/donor/donations/components/NGOPosts";
import DonorProfile from "./features/donor/profile/components/Profile";
import DonorPaymentMethods from "./features/donor/profile/components/PaymentMethods";
import DonorRewards from "./features/donor/rewards/components/Rewards";
import DonorBenefits from "./features/donor/rewards/components/Benefits";

// NGO Imports
import NGODashboard from "./features/ngo/dashboard/page";
import NGODonationRequests from "./features/ngo/requests/page";
import NGOInventory from "./features/ngo/my_inventory/page";
import NGOAddItem from "./features/ngo/add_item/page";
import NGOProfile from "./features/ngo/profile/page";
import NGOPaymentMethods from "./features/ngo/profile/components/PaymentMethods";
import PostNewNeed from "./features/ngo/post_need/page";
import NGORewards from "./features/ngo/rewards/page";
import NGOBenefits from "./features/ngo/rewards/components/Benefits";

// Volunteer Imports
import VolunteerDashboard from "./features/volunteer/dashboard/page";
import VolunteerTasks from "./features/volunteer/tasks/page";
import VolunteerProfile from "./features/volunteer/profile/page";
import VolunteerPaymentMethods from "./features/volunteer/profile/components/PaymentMethods";
import VolunteerRewards from "./features/volunteer/rewards/page";
import VolunteerBenefits from "./features/volunteer/rewards/components/Benefits";

// Auth
import AuthPage from "./features/auth/page";

function App() {
  return (
    <ThemeProvider>
      <Toaster
        position="top-right"
        richColors
        closeButton
        toastOptions={{
          style: {
            fontFamily: "inherit",
            fontSize: "12px",
            fontWeight: "600",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "12px 16px",
            paddingRight: "36px",
            lineHeight: "1.4",
          },
        }}
      />
      <div>
        <Routes>
          {/* Redirect root to /auth */}
          <Route path="/" element={<Navigate to="/auth" />} />

          {/* Auth */}
          <Route path="/auth" element={<AuthPage />} />

          <Route path="/admin" element={<AdminLayout />}>
            {/* Dashboard */}
            <Route index element={<AdminDashboard />} />
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

            {/* Alerts Section */}
            {/* <Route path="alerts" element={<AlertsPage />} />
            <Route path="alerts/urgent" element={<UrgentAlertsPage />} /> */}

            {/* Analytics Section */}
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route
              path="analytics/reports"
              element={<AnalyticsReportsPage />}
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
            <Route path="rewards/benefits" element={<DonorBenefits />} />
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
            <Route path="rewards/benefits" element={<NGOBenefits />} />
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
            <Route path="rewards/benefits" element={<VolunteerBenefits />} />
            <Route path="profile" element={<VolunteerProfile />} />
            <Route path="payments" element={<VolunteerPaymentMethods />} />
          </Route>
        </Routes>
      </div>
    </ThemeProvider>
  );
}

export default App;
