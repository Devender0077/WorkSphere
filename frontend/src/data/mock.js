// Mock data for the HR Dashboard

export const STATUS_COLORS = {
  Active: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  'On Boarding': 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  Probation: 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
  'On Leave': 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
};

export const EMPLOYEES = [
  { id: 'E001', firstName: 'Pristia', lastName: 'Candra', name: 'Pristia Candra', email: 'lincoln@unpixel.com', handle: '@Pristiacandra', title: 'UI UX Designer', department: 'Team Product', office: 'Unpixel Office', status: 'Active', account: 'Activated', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face', phone: '089318298493', dob: '23 May 1997', gender: 'Female', nationality: 'Indonesia', joinDate: '23 Mar 2023' },
  { id: 'E002', firstName: 'Hanna', lastName: 'Baptista', name: 'Hanna Baptista', email: 'hanna@unpixel.com', handle: '@Pristiacandra', title: 'Graphic Designer', department: 'Team Product', office: 'Unpixel Office', status: 'On Boarding', account: 'Activated', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face', phone: '089318298493', dob: '12 Jan 1995', gender: 'Female', nationality: 'Indonesia', joinDate: '14 Feb 2023' },
  { id: 'E003', firstName: 'Miracle', lastName: 'Geidt', name: 'Miracle Geidt', email: 'miracle@unpixel.com', handle: '@Pristiacandra', title: 'Finance', department: 'Team Product', office: 'Unpixel Office', status: 'Probation', account: 'Need Invitation', avatar: '', phone: '089318298493', dob: '2 Mar 1994', gender: 'Male', nationality: 'Indonesia', joinDate: '05 Aug 2023' },
  { id: 'E004', firstName: 'Rayna', lastName: 'Torff', name: 'Rayna Torff', email: 'rayna@unpixel.com', handle: '@Pristiacandra', title: 'Project Manager', department: 'Team Product', office: 'Unpixel Office', status: 'Active', account: 'Activated', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=face', phone: '089318298493', dob: '30 Oct 1992', gender: 'Female', nationality: 'Indonesia', joinDate: '10 Jan 2022' },
  { id: 'E005', firstName: 'Giana', lastName: 'Lipshutz', name: 'Giana Lipshutz', email: 'giana@unpixel.com', handle: '@Pristiacandra', title: 'Creative Director', department: 'Team Product', office: 'Unpixel Office', status: 'On Leave', account: 'Need Invitation', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face', phone: '089318298493', dob: '14 Apr 1988', gender: 'Female', nationality: 'Indonesia', joinDate: '05 Feb 2020' },
  { id: 'E006', firstName: 'James', lastName: 'George', name: 'James George', email: 'james@unpixel.com', handle: '@Pristiacandra', title: 'Lead Designer', department: 'Team Product', office: 'Unpixel Office', status: 'Active', account: 'Activated', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face', phone: '089318298493', dob: '2 Jul 1990', gender: 'Male', nationality: 'Indonesia', joinDate: '18 Jun 2021' },
  { id: 'E007', firstName: 'Jordyn', lastName: 'George', name: 'Jordyn George', email: 'jordyn@unpixel.com', handle: '@Pristiacandra', title: 'IT Support', department: 'Team Product', office: 'Unpixel Office', status: 'On Boarding', account: 'Activated', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face', phone: '089318298493', dob: '21 Nov 1996', gender: 'Male', nationality: 'Indonesia', joinDate: '03 Apr 2024' },
  { id: 'E008', firstName: 'Skylar', lastName: 'Herwitz', name: 'Skylar Herwitz', email: 'skylar@unpixel.com', handle: '@Pristiacandra', title: '3D Designer', department: 'Team Product', office: 'Unpixel Office', status: 'Active', account: 'Activated', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face', phone: '089318298493', dob: '8 Sep 1993', gender: 'Female', nationality: 'Indonesia', joinDate: '11 Oct 2022' },
  { id: 'E009', firstName: 'Ahmad', lastName: 'Gouse', name: 'Ahmad Gouse', email: 'ahmad@unpixel.com', handle: '@Pristiacandra', title: 'Backend Engineer', department: 'Team Engineering', office: 'Unpixel Office', status: 'Active', account: 'Activated', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&h=200&fit=crop&crop=face', phone: '089318298493', dob: '1 Dec 1991', gender: 'Male', nationality: 'Indonesia', joinDate: '22 May 2021' },
  { id: 'E010', firstName: 'Alena', lastName: 'Saris', name: 'Alena Saris', email: 'alena@unpixel.com', handle: '@Pristiacandra', title: 'Product Manager', department: 'Team Product', office: 'Unpixel Office', status: 'Active', account: 'Activated', avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&h=200&fit=crop&crop=face', phone: '089318298493', dob: '4 Feb 1989', gender: 'Female', nationality: 'Indonesia', joinDate: '09 Jan 2020' },
];

export const STATS = [
  { label: 'Total Employees', value: '3,540', change: '+25,5%', trend: 'up', icon: 'users' },
  { label: 'Job Applicants', value: '1,150', change: '+4,10%', trend: 'up', icon: 'briefcase' },
  { label: 'New Employees', value: '500', change: '+5,1%', trend: 'up', icon: 'plus' },
  { label: 'Resigned Employees', value: '93', change: '+25,5%', trend: 'down', icon: 'minus' },
];

export const TEAM_PERFORMANCE = [
  { month: 'Jan', project: 38000, product: 42000 },
  { month: 'Feb', project: 42000, product: 45000 },
  { month: 'Mar', project: 44000, product: 47000 },
  { month: 'Apr', project: 45000, product: 41000 },
  { month: 'May', project: 47000, product: 43000 },
  { month: 'Jun', project: 48000, product: 42000 },
  { month: 'Jul', project: 50000, product: 44000 },
];

export const DEPARTMENT_BREAKDOWN = [
  { name: 'Others', value: 71, color: '#0DA56E' },
  { name: 'Onboarding', value: 27, color: '#F5B500' },
  { name: 'Offboarding', value: 23, color: '#3B82F6' },
];

export const OFFICES = ['All Offices', 'Unpixel Office', 'Unpixel Studio', 'Unpixel Headquarter'];
export const JOB_TITLES = ['All Job Titles', 'UI UX Designer', 'Graphic Designer', 'Finance', 'Project Manager', 'Creative Director', 'Lead Designer', 'IT Support', '3D Designer'];
export const STATUSES = ['All Status', 'Active', 'On Boarding', 'Probation', 'On Leave'];

export const MAIN_MENU = [
  { key: 'dashboard', label: 'Dashboard', icon: 'grid', to: '/' },
  {
    key: 'employees', label: 'Employees', icon: 'users',
    children: [
      { key: 'manage', label: 'Manage Employees', to: '/employees' },
      { key: 'directory', label: 'Directory', to: '/employees/directory' },
      { key: 'org', label: 'ORG Chart', to: '/employees/org-chart' },
    ],
  },
  { key: 'checklist', label: 'Checklist', icon: 'clipboard', children: [
    { key: 'my-tasks', label: 'My Tasks', to: '/checklist/my-tasks' },
    { key: 'team-tasks', label: 'Team Tasks', to: '/checklist/team-tasks' },
  ]},
  { key: 'timeoff', label: 'Time Off', icon: 'clock', children: [
    { key: 'request', label: 'Requests', to: '/time-off/requests' },
    { key: 'balance', label: 'Balance', to: '/time-off/balance' },
  ]},
  { key: 'attendance', label: 'Attendance', icon: 'calendar', children: [
    { key: 'daily', label: 'Daily Log', to: '/attendance/daily' },
    { key: 'reports', label: 'Reports', to: '/attendance/reports' },
  ]},
  { key: 'payroll', label: 'Payroll', icon: 'wallet', children: [
    { key: 'runs', label: 'Payroll Runs', to: '/payroll/runs' },
    { key: 'slips', label: 'Payslips', to: '/payroll/slips' },
  ]},
  { key: 'performance', label: 'Performance', icon: 'trending-up', children: [
    { key: 'reviews', label: 'Reviews', to: '/performance/reviews' },
    { key: 'goals', label: 'Goals', to: '/performance/goals' },
  ]},
  { key: 'recruitment', label: 'Recruitment', icon: 'briefcase', children: [
    { key: 'jobs', label: 'Open Jobs', to: '/recruitment/jobs' },
    { key: 'applicants', label: 'Applicants', to: '/recruitment/applicants' },
  ]},
];

export const BOTTOM_MENU = [
  { key: 'help', label: 'Help Center', icon: 'help-circle', to: '/help', badge: 8 },
  { key: 'setting', label: 'Setting', icon: 'settings', to: '/setting' },
];
