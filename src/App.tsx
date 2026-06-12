import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./global/contexts/ThemeContext";
import { Toaster } from "sonner";
import AdminLayout from "./global/layouts/AdminLayout";
import DonorLayout from "./global/layouts/DonorLayout";
import NGOLayout from "./global/layouts/NGOLayout";
import VolunteerLayout from "./global/layouts/VolunteerLayout";
import DonorPage from "./modules/admin/users/donors/components/DonorsPage";
import NGOsPage from "./modules/admin/users/ngos/components/NGOsPage";
import VolunteersPage from "./modules/admin/users/volunteers/components/VolunteersPage";
import DonationsPage from "./modules/admin/donations/components/DonationsPage";
import DonationTrackingPage from "./modules/admin/donations/components/DonationTrackingPage";
import PendingDonationsPage from "./modules/admin/donations/components/PendingDonationsPage";
import AnalyticsPage from "./modules/admin/analytics/components/AnalyticsPage";
import AnalyticsReportsPage from "./modules/admin/analytics/components/AnalyticsReportsPage";
import UsersPage from "./modules/admin/users/components/UsersPage";
import AdminDashboard from "./modules/admin/dashboard/components/DashboardPage";
import PointsTiersView from "./modules/admin/rewards/components/PointsTiersView";
import RedemptionsView from "./modules/admin/rewards/components/RedemptionsView";
import RewardsConfig from "./modules/admin/rewards/components/RewardsConfig";
import MilestonesConfig from "./modules/admin/rewards/components/MilestonesConfig";
import RewardsPage from "./modules/admin/rewards/components/RewardsPage";
import CreateDonor from "./modules/admin/users/donors/components/CreateDonorPage.tsx";
import CreateNgo from "./modules/admin/users/ngos/components/CreateNgoPage.tsx";
import CreateVolunteer from "./modules/admin/users/volunteers/components/CreateVolunteerPage.tsx";
import ConfigurationPage from "./modules/admin/settings/components/ConfigurationPage";
import NGOEnquiryPage from "./modules/admin/enquiries/components/NGOEnquiryPage";
import VolunteerEnquiryPage from "./modules/admin/enquiries/components/VolunteerEnquiryPage";
import RewardEnquiryPage from "./modules/admin/enquiries/components/RewardEnquiryPage";
import DonorEnquiryPage from "./modules/admin/enquiries/components/DonorEnquiryPage";
import EnquiriesHub from "./modules/admin/enquiries/components/EnquiriesHub";
import SettingsPage from "./modules/admin/settings/components/SettingsPage";

// Donor Imports
import DonorDashboard from "./modules/donor/dashboard/components/Dashboard";
import DonorMyDonations from "./modules/donor/donations/components/MyDonations";
import DonorCreateDonation from "./modules/donor/donations/components/CreateDonation";
import DonorNGOPosts from "./modules/donor/donations/components/NGOPosts";
import DonorProfile from "./modules/donor/profile/components/Profile";
import DonorPaymentMethods from "./modules/donor/profile/components/PaymentMethods";
import DonorRewards from "./modules/donor/rewards/components/Rewards";
import DonorBenefits from "./modules/donor/rewards/components/Benefits";

// NGO Imports
import NGODashboard from "./modules/ngo/dashboard/components/Dashboard";
import NGODonationRequests from "./modules/ngo/donations/components/DonationRequests";
import NGOInventory from "./modules/ngo/inventory/components/Inventory";
import NGOAddItem from "./modules/ngo/inventory/components/AddItem";
import NGOProfile from "./modules/ngo/profile/components/Profile";
import NGOPaymentMethods from "./modules/ngo/profile/components/PaymentMethods";
import PostNewNeed from "./modules/ngo/needs/components/PostNewNeed";
import NGORewards from "./modules/ngo/rewards/components/Rewards";
import NGOBenefits from "./modules/ngo/rewards/components/Benefits";

// Volunteer Imports
import VolunteerDashboard from "./modules/volunteer/dashboard/components/Dashboard";
import VolunteerTasks from "./modules/volunteer/tasks/components/Tasks";
import VolunteerProfile from "./modules/volunteer/profile/components/Profile";
import VolunteerPaymentMethods from "./modules/volunteer/profile/components/PaymentMethods";
import VolunteerRewards from "./modules/volunteer/rewards/components/Rewards";
import VolunteerBenefits from "./modules/volunteer/rewards/components/Benefits";

// Auth
import AuthPage from "./modules/auth/components/AuthPage";

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
