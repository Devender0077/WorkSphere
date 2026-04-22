# HR Dashboard — Product Requirements

## Vision
Pixel-perfect, multi-tenant HR SaaS clone (Figma HRDashboard UI Kit). Supports three roles: Super Admin (platform owner), Tenant Admin (customer admin), and Employee. Full HR modules (Payroll, Time Off, Attendance, Recruitment), Biometric/Face ID UI, DocuSign-style E-Sign, Subscriptions, Messages, Settings, fully responsive across devices.

## Core architecture
- **Frontend**: React, Tailwind, shadcn/ui, Recharts, Context API (Auth, Theme, Branding).
- **Backend**: FastAPI + MongoDB (Motor), JWT auth (7-day) with bcrypt password hashing.
- **Multi-tenancy**: Every data doc carries `tenant_id`; all queries filter by `user.tenant_id` unless role is `super_admin`.
- **Preview URL**: `REACT_APP_BACKEND_URL` injected from `.env` (never hard-coded).

## Roles & Menu (role-scoped)
- **Super Admin** (platform owner): Platform Dashboard, Tenants, Impersonate, Payment Providers, Plans & Billing, Platform Reports, Help, Setting.
- **Tenant Admin**: Dashboard, Employees, Checklist, Time Off, Attendance (Daily/Calendar/Reports/Biometric), Payroll, Performance, Recruitment (Jobs/Candidates/Settings), Messages, E-Sign, Subscription, Help, Setting.
- **Employee**: Dashboard, Profile, Time Off, Payslips, Attendance (Daily/Calendar), Messages, E-Sign, Directory, Help, Setting.
- **Top nav** (both tenant roles): Documents, News, Payslip, Report (no duplication in sidebar).

## Key pages
- **Settings (/setting)** — 10 tabs: Company Info, Offices, Department, Job Titles, Work Schedule, **Permission (role management)**, Integration, Subscription, Password, Notification.
- **Platform pages (superadmin-only)**: Impersonate (`/platform/impersonate`), Payment Providers (`/platform/payments`).
- **Attendance Calendar** (`/attendance/calendar`) with monthly + weekly toggle.
- **Recruitment**: Jobs list, Candidates (Kanban/List), Recruitment Settings (pipelines + scoring).
- **E-Sign**: Inbox with View/Edit/Duplicate/Resend/Delete per row; Builder (3-step wizard); Templates; Sign.

## What's implemented (Feb 2026)
- ✅ Full auth flow (login/signup/OTP/forgot/password-changed/onboarding) + JWT + seed demo accounts.
- ✅ Dashboards per role with charts.
- ✅ Employees + Directory + Org Chart + Roles (RBAC hardened — tenant admin cannot see/edit `super_admin` role).
- ✅ Time Off, Attendance (Daily, **Calendar month/week**, Reports, Biometric settings).
- ✅ Payroll, Performance, Recruitment (Jobs/Candidates/Settings).
- ✅ Messages, E-Sign (list/builder/sign/templates + View/Edit/Delete/Duplicate/Resend).
- ✅ Billing (Plans/Checkout/Invoice, MOCKED Stripe).
- ✅ **Tenant Branding**: `GET/PATCH /api/tenant/branding` — name, logo_url, primary_color, website, contact email/phone, address. Sidebar logo reads branding live.
- ✅ **Impersonation**: `POST /api/platform/impersonate/{user_id}` (super admin) issues short-lived token; yellow banner + "Exit impersonation" button; original session restored on exit. Audit log entry written.
- ✅ **Payment Providers (platform)**: `GET /api/platform/payment-providers`, `PUT /api/platform/payment-providers/{stripe|razorpay}`, `POST /api/platform/payment-providers/{provider}/test`. Test/live mode, publishable/secret/webhook keys, masked display on read.
- ✅ **Integrations (per tenant by plan)**: `GET /api/integrations`, `PUT /api/integrations/{key}` — catalog of Slack, Google Calendar, Zapier, GitHub, Jira, SSO/SAML gated by tenant plan.
- ✅ **Settings CRUD** (real backend persistence, tenant-scoped):
  - `GET/POST/PATCH/DELETE /api/offices`
  - `GET/POST/PATCH/DELETE /api/departments` (tree by parent_id)
  - `GET/POST/PATCH/DELETE /api/job-titles`
  - `GET/POST/PATCH/DELETE /api/work-schedules`
- ✅ **Role-aware Settings UI**: super admin sees only Platform Info + Password + Notification; tenant admin sees full 10 tabs; employee sees Password + Notification.
- ✅ **Responsive layout**: Mobile drawer (hamburger), safe paddings, scrollable tables.
- ✅ **Notifications + Messages popups** in TopBar (mark-all-read, per-row unread dots, deep links).
- ✅ Product tour, Theme toggle (Light/Dark), Settings Permission subpages.
- ✅ Audit log endpoint `GET /api/platform/audit-log` (super admin) + **Audit Log viewer UI** at `/platform/audit-log`.
- ✅ **Jobs CRUD** — `GET/POST/PATCH/DELETE /api/jobs` with live applicant counts.
- ✅ **Candidates CRUD** — `GET/POST/PATCH/DELETE /api/candidates`; Kanban view with inline stage-move dropdown; List view with edit/email/phone/delete actions.
- ✅ **Documents CRUD** — `GET/POST/PATCH/DELETE /api/documents`, `GET /api/documents/folders`; folder tabs with counts, view/download/edit/delete per card.

## Mocked / simulated (intentional)
- Stripe/Razorpay live API calls (UI + test connection only; keys stored, SDK calls stubbed).
- Biometric hardware device sync.
- E-Sign PDF field flattening (UI-only overlay).

## Data model (MongoDB)
- `users`: email, role, tenant_id, password_hash
- `tenants`: name, slug, plan, status, employees_count, **logo_url, primary_color, website, contact_email, contact_phone, address**
- `employees`, `roles`, `time_off_requests`, `payment_providers`, `tenant_integrations`, `audit_log`

## Key endpoints
- `POST /api/auth/login`, `GET /api/auth/me`
- `GET/POST /api/tenants` (super admin)
- `GET /api/employees`, `/api/roles`, `/api/permissions` (role-scoped)
- `GET/PATCH /api/tenant/branding`
- `POST /api/platform/impersonate/{user_id}`, `GET /api/platform/impersonate/candidates` (super admin)
- `GET/PUT/POST /api/platform/payment-providers[/{provider}[/test]]` (super admin)
- `GET /api/integrations`, `PUT /api/integrations/{key}` (tenant admin+)

## Next / Backlog
- P1: Real CRUD backends for Jobs/Candidates/Documents/Offices/Departments/Job Titles/Work Schedules (currently state-only).
- P1: Full DocuSign-style E-Sign backend persistence, reminders, audit trail, email delivery.
- P1: Real Stripe/Razorpay SDK calls (create customer, subscription, webhook handler).
- P2: Socket.IO realtime for notifications & chat; Audit log UI.
- P2: AI Resume Scoring (Emergent LLM key), AI Help Chatbot, Expense Claims, 360° reviews.
- P2: Subdomain white-label (acme.hrdashboard.com), i18n, multi-currency.

## Test credentials
All demo accounts share password `Demo@123`.
| Role | Email |
|---|---|
| Super Admin | superadmin@demo.com |
| Tenant Admin (Acme) | admin@acme.com |
| Employee (Acme) | employee@acme.com |
