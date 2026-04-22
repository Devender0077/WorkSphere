// Role-based menu configuration

export const getMenu = (role) => {
  if (role === 'super_admin') {
    return {
      main: [
        { key: 'dashboard', label: 'Dashboard', icon: 'grid', to: '/' },
        { key: 'tenants', label: 'Tenants', icon: 'building', to: '/tenants' },
        {
          key: 'employees', label: 'Employees', icon: 'users', children: [
            { key: 'manage', label: 'Manage Employees', to: '/employees' },
            { key: 'directory', label: 'Directory', to: '/employees/directory' },
            { key: 'org', label: 'ORG Chart', to: '/employees/org-chart' },
          ],
        },
        { key: 'roles', label: 'Roles & Permissions', icon: 'shield', to: '/roles' },
        { key: 'reports', label: 'Reports', icon: 'trending-up', to: '/reports' },
      ],
      bottom: [
        { key: 'help', label: 'Help Center', icon: 'help-circle', to: '/help', badge: 8 },
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
            { key: 'my-tasks', label: 'My Tasks', to: '/checklist/my-tasks' },
            { key: 'team-tasks', label: 'Team Tasks', to: '/checklist/team-tasks' },
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
            { key: 'reports', label: 'Reports', to: '/attendance/reports' },
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
            { key: 'jobs', label: 'Open Jobs', to: '/recruitment/jobs' },
            { key: 'applicants', label: 'Applicants', to: '/recruitment/applicants' },
          ],
        },
        { key: 'roles', label: 'Roles & Permissions', icon: 'shield', to: '/roles' },
      ],
      bottom: [
        { key: 'help', label: 'Help Center', icon: 'help-circle', to: '/help', badge: 8 },
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
      { key: 'attendance', label: 'My Attendance', icon: 'calendar', to: '/attendance/daily' },
      { key: 'directory', label: 'Directory', icon: 'users', to: '/employees/directory' },
    ],
    bottom: [
      { key: 'help', label: 'Help Center', icon: 'help-circle', to: '/help', badge: 8 },
      { key: 'setting', label: 'Setting', icon: 'settings', to: '/setting' },
    ],
  };
};
