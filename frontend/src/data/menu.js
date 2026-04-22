// Role-based menu configuration.
// Keep each role's menu focused on what that role can actually do.
// NOTE: "News" and "Documents" live in the TopBar nav — do not duplicate them in the sidebar.
// NOTE: "Roles & Permissions" lives inside Settings → Permission — no sidebar entry.

export const getMenu = (role) => {
  if (role === 'super_admin') {
    return {
      main: [
        { key: 'dashboard', label: 'Platform Dashboard', icon: 'grid', to: '/' },
        { key: 'tenants', label: 'Tenants', icon: 'building', to: '/tenants' },
        { key: 'impersonate', label: 'Impersonate', icon: 'user-check', to: '/platform/impersonate' },
        { key: 'payments', label: 'Payment Providers', icon: 'credit-card', to: '/platform/payments' },
        { key: 'plans', label: 'Plans & Billing', icon: 'wallet', to: '/billing' },
        { key: 'reports', label: 'Platform Reports', icon: 'trending-up', to: '/reports' },
      ],
      bottom: [
        { key: 'help', label: 'Help Center', icon: 'help-circle', to: '/help' },
        { key: 'setting', label: 'Setting', icon: 'settings', to: '/setting' },
      ],
    };
  }

  if (role === 'tenant_admin') {
    return {
      main: [
        { key: 'dashboard', label: 'Dashboard', icon: 'grid', to: '/' },
        {
          key: 'employees', label: 'Employees', icon: 'users', children: [
            { key: 'manage', label: 'Manage Employees', to: '/employees' },
            { key: 'directory', label: 'Directory', to: '/employees/directory' },
            { key: 'org', label: 'ORG Chart', to: '/employees/org-chart' },
          ],
        },
        {
          key: 'checklist', label: 'Checklist', icon: 'clipboard', children: [
            { key: 'todos', label: 'To-Dos', to: '/checklist/todos' },
            { key: 'onboarding', label: 'Onboarding', to: '/checklist/onboarding' },
            { key: 'offboarding', label: 'Offboarding', to: '/checklist/offboarding' },
            { key: 'setting', label: 'Setting', to: '/checklist/setting' },
          ],
        },
        {
          key: 'timeoff', label: 'Time Off', icon: 'clock', children: [
            { key: 'requests', label: 'Requests', to: '/time-off/requests' },
            { key: 'balance', label: 'Balance', to: '/time-off/balance' },
          ],
        },
        {
          key: 'attendance', label: 'Attendance', icon: 'calendar', children: [
            { key: 'daily', label: 'Daily Log', to: '/attendance/daily' },
            { key: 'calendar', label: 'Calendar', to: '/attendance/calendar' },
            { key: 'reports', label: 'Reports', to: '/attendance/reports' },
            { key: 'biometric', label: 'Biometric & Face ID', to: '/attendance/biometric' },
          ],
        },
        {
          key: 'payroll', label: 'Payroll', icon: 'wallet', children: [
            { key: 'runs', label: 'Payroll Runs', to: '/payroll/runs' },
            { key: 'slips', label: 'Payslips', to: '/payroll/slips' },
          ],
        },
        {
          key: 'performance', label: 'Performance', icon: 'trending-up', children: [
            { key: 'reviews', label: 'Reviews', to: '/performance/reviews' },
            { key: 'goals', label: 'Goals', to: '/performance/goals' },
          ],
        },
        {
          key: 'recruitment', label: 'Recruitment', icon: 'briefcase', children: [
            { key: 'jobs', label: 'Jobs', to: '/recruitment/jobs' },
            { key: 'candidates', label: 'Candidates', to: '/recruitment/candidates' },
            { key: 'rec-settings', label: 'Settings', to: '/recruitment/settings' },
          ],
        },
        { key: 'messages', label: 'Messages', icon: 'message', to: '/messages' },
        { key: 'esign', label: 'E-Sign', icon: 'file-signature', to: '/esign' },
        { key: 'billing', label: 'Subscription', icon: 'credit-card', to: '/billing' },
      ],
      bottom: [
        { key: 'help', label: 'Help Center', icon: 'help-circle', to: '/help' },
        { key: 'setting', label: 'Setting', icon: 'settings', to: '/setting' },
      ],
    };
  }

  // employee
  return {
    main: [
      { key: 'dashboard', label: 'My Dashboard', icon: 'grid', to: '/' },
      { key: 'profile', label: 'My Profile', icon: 'user', to: '/my-profile' },
      { key: 'time-off', label: 'My Time Off', icon: 'clock', to: '/time-off/requests' },
      { key: 'payslip', label: 'My Payslips', icon: 'wallet', to: '/payroll/slips' },
      {
        key: 'attendance', label: 'My Attendance', icon: 'calendar', children: [
          { key: 'daily', label: 'Daily Log', to: '/attendance/daily' },
          { key: 'calendar', label: 'Calendar', to: '/attendance/calendar' },
        ],
      },
      { key: 'messages', label: 'Messages', icon: 'message', to: '/messages' },
      { key: 'esign', label: 'E-Sign', icon: 'file-signature', to: '/esign' },
      { key: 'directory', label: 'Directory', icon: 'users', to: '/employees/directory' },
    ],
    bottom: [
      { key: 'help', label: 'Help Center', icon: 'help-circle', to: '/help' },
      { key: 'setting', label: 'Setting', icon: 'settings', to: '/setting' },
    ],
  };
};
