import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthProvider } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/layout/DashboardLayout';

// Auth pages
import LoginPage from '@/pages/LoginPage';
import SignUpPage from '@/pages/auth/SignUpPage';
import ForgotPasswordPage from '@/pages/auth/ForgotPasswordPage';
import OtpVerificationPage from '@/pages/auth/OtpVerificationPage';
import PasswordChangedPage from '@/pages/auth/PasswordChangedPage';
import OnboardingPage from '@/pages/auth/OnboardingPage';

// Core pages
import DashboardPage from '@/pages/DashboardPage';
import EmployeesPage from '@/pages/EmployeesPage';
import EmployeeDetailPage from '@/pages/EmployeeDetailPage';
import RolesPage from '@/pages/RolesPage';
import TenantsPage from '@/pages/TenantsPage';
import TimeOffPage from '@/pages/TimeOffPage';
import DirectoryPage from '@/pages/DirectoryPage';
import OrgChartPage from '@/pages/OrgChartPage';
import MyProfilePage from '@/pages/MyProfilePage';

// New module pages
import ChecklistPage from '@/pages/ChecklistPage';
import { AttendanceDailyPage, AttendanceReportsPage } from '@/pages/AttendancePages';
import { PayrollRunsPage, PayslipsPage, TimeOffBalancePage } from '@/pages/PayrollPages';
import { PerformanceReviewsPage, GoalsPage } from '@/pages/PerformancePages';
import { JobsPage, ApplicantsPage } from '@/pages/RecruitmentPages';
import { HelpCenterPage, SettingsPage, ReportsPage } from '@/pages/HelpAndSettings';

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <div className="App">
          <BrowserRouter>
            <Routes>
              {/* Public auth routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignUpPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/otp-verification" element={<OtpVerificationPage />} />
              <Route path="/password-changed" element={<PasswordChangedPage />} />
              <Route path="/onboarding" element={<OnboardingPage />} />

              {/* Authenticated */}
              <Route element={<DashboardLayout />}>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/tenants" element={<TenantsPage />} />

                <Route path="/employees" element={<EmployeesPage />} />
                <Route path="/employees/directory" element={<DirectoryPage />} />
                <Route path="/employees/org-chart" element={<OrgChartPage />} />
                <Route path="/employees/:id" element={<EmployeeDetailPage />} />

                <Route path="/my-profile" element={<MyProfilePage />} />
                <Route path="/roles" element={<RolesPage />} />
                <Route path="/reports" element={<ReportsPage />} />

                <Route path="/time-off/requests" element={<TimeOffPage />} />
                <Route path="/time-off/balance" element={<TimeOffBalancePage />} />

                <Route path="/checklist/my-tasks" element={<ChecklistPage title="My Tasks" description="Track your personal HR tasks." />} />
                <Route path="/checklist/team-tasks" element={<ChecklistPage title="Team Tasks" description="Manage tasks across your team." />} />

                <Route path="/attendance/daily" element={<AttendanceDailyPage />} />
                <Route path="/attendance/reports" element={<AttendanceReportsPage />} />

                <Route path="/payroll/runs" element={<PayrollRunsPage />} />
                <Route path="/payroll/slips" element={<PayslipsPage />} />

                <Route path="/performance/reviews" element={<PerformanceReviewsPage />} />
                <Route path="/performance/goals" element={<GoalsPage />} />

                <Route path="/recruitment/jobs" element={<JobsPage />} />
                <Route path="/recruitment/applicants" element={<ApplicantsPage />} />

                <Route path="/help" element={<HelpCenterPage />} />
                <Route path="/setting" element={<SettingsPage />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
