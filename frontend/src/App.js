import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthProvider } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import LoginPage from '@/pages/LoginPage';
import DashboardPage from '@/pages/DashboardPage';
import EmployeesPage from '@/pages/EmployeesPage';
import EmployeeDetailPage from '@/pages/EmployeeDetailPage';
import PlaceholderPage from '@/pages/PlaceholderPage';

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <div className="App">
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route element={<DashboardLayout />}>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/employees" element={<EmployeesPage />} />
                <Route path="/employees/:id" element={<EmployeeDetailPage />} />
                <Route path="/employees/directory" element={<PlaceholderPage title="Directory" description="Browse all employees in a directory view." />} />
                <Route path="/employees/org-chart" element={<PlaceholderPage title="ORG Chart" description="Visualize your organization structure." />} />
                <Route path="/checklist/my-tasks" element={<PlaceholderPage title="My Tasks" description="Track your personal HR tasks." />} />
                <Route path="/checklist/team-tasks" element={<PlaceholderPage title="Team Tasks" description="Manage tasks across your team." />} />
                <Route path="/time-off/requests" element={<PlaceholderPage title="Time Off Requests" description="Review and approve time-off requests." />} />
                <Route path="/time-off/balance" element={<PlaceholderPage title="Time Off Balance" description="Check leave balances by employee." />} />
                <Route path="/attendance/daily" element={<PlaceholderPage title="Daily Log" description="Daily attendance tracking." />} />
                <Route path="/attendance/reports" element={<PlaceholderPage title="Attendance Reports" description="Generate detailed reports." />} />
                <Route path="/payroll/runs" element={<PlaceholderPage title="Payroll Runs" description="Run and review payroll cycles." />} />
                <Route path="/payroll/slips" element={<PlaceholderPage title="Payslips" description="View and download payslips." />} />
                <Route path="/performance/reviews" element={<PlaceholderPage title="Performance Reviews" description="Run employee performance reviews." />} />
                <Route path="/performance/goals" element={<PlaceholderPage title="Goals" description="Track goals and OKRs." />} />
                <Route path="/recruitment/jobs" element={<PlaceholderPage title="Open Jobs" description="Manage open positions." />} />
                <Route path="/recruitment/applicants" element={<PlaceholderPage title="Applicants" description="Review candidates and applicants." />} />
                <Route path="/help" element={<PlaceholderPage title="Help Center" description="Get help and support." />} />
                <Route path="/setting" element={<PlaceholderPage title="Settings" description="Configure your HR workspace." />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
