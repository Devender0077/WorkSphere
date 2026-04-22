// Demo credentials displayed on login page (easy login)
export const DEMO_ACCOUNTS = [
  {
    role: 'Super Admin',
    description: 'Manage tenants, users, global roles & settings.',
    email: 'superadmin@demo.com',
    password: 'Demo@123',
    color: 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
    dotColor: 'bg-violet-500',
  },
  {
    role: 'Tenant Admin',
    description: 'Acme Corp HR Director — manage employees & payroll.',
    email: 'admin@acme.com',
    password: 'Demo@123',
    color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
    dotColor: 'bg-emerald-500',
  },
  {
    role: 'Employee',
    description: 'Self-service portal: view profile, request time off.',
    email: 'employee@acme.com',
    password: 'Demo@123',
    color: 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300',
    dotColor: 'bg-sky-500',
  },
];

export const ROLE_CONFIG = {
  super_admin: { label: 'Super Admin', badgeClass: 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300' },
  tenant_admin: { label: 'Tenant Admin', badgeClass: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' },
  employee: { label: 'Employee', badgeClass: 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300' },
  hr_manager: { label: 'HR Manager', badgeClass: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300' },
};

export const STATUS_COLORS = {
  Active: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  'On Boarding': 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  Probation: 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
  'On Leave': 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
  Pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  Approved: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  Rejected: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
  Trial: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
};

export const TEAM_PERFORMANCE = [
  { month: 'Jan', project: 38000, product: 42000 },
  { month: 'Feb', project: 42000, product: 45000 },
  { month: 'Mar', project: 44000, product: 47000 },
  { month: 'Apr', project: 45000, product: 41000 },
  { month: 'May', project: 47000, product: 43000 },
  { month: 'Jun', project: 48000, product: 42000 },
  { month: 'Jul', project: 50000, product: 44000 },
];
