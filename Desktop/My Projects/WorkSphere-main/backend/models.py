from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional, Any
from datetime import datetime
import uuid

def _id() -> str:
    return str(uuid.uuid4())

ROLE_SUPER = 'super_admin'
ROLE_ADMIN = 'tenant_admin'
ROLE_EMP = 'employee'

DEFAULT_PERMISSIONS = {
    ROLE_SUPER: [
        'tenants.read', 'tenants.create', 'tenants.update', 'tenants.delete',
        'users.read', 'users.create', 'users.update', 'users.delete',
        'employees.read', 'employees.create', 'employees.update', 'employees.delete',
        'roles.read', 'roles.create', 'roles.update', 'roles.delete',
        'payroll.read', 'payroll.manage', 'reports.read', 'settings.manage',
    ],
    ROLE_ADMIN: [
        'users.read', 'users.create', 'users.update',
        'employees.read', 'employees.create', 'employees.update', 'employees.delete',
        'roles.read', 'roles.create', 'roles.update',
        'payroll.read', 'payroll.manage', 'reports.read', 'settings.manage',
    ],
    ROLE_EMP: [
        'employees.read.self', 'payroll.read.self', 'timeoff.request',
    ],
}

ROLE_LABELS = {
    ROLE_SUPER: 'Super Admin',
    ROLE_ADMIN: 'Tenant Admin',
    ROLE_EMP: 'Employee',
}

class Tenant(BaseModel):
    id: str = Field(default_factory=_id)
    name: str
    slug: str
    plan: str = 'Pro'
    status: str = 'Active'
    employees_count: int = 0
    logo_url: Optional[str] = None
    primary_color: Optional[str] = None
    website: Optional[str] = None
    contact_email: Optional[str] = None
    contact_phone: Optional[str] = None
    address: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class TenantCreate(BaseModel):
    name: str
    slug: str
    plan: Optional[str] = 'Pro'

class TenantUpdate(BaseModel):
    name: Optional[str] = None
    plan: Optional[str] = None
    status: Optional[str] = None
    logo_url: Optional[str] = None
    primary_color: Optional[str] = None
    website: Optional[str] = None
    contact_email: Optional[str] = None
    contact_phone: Optional[str] = None
    address: Optional[str] = None

class User(BaseModel):
    id: str = Field(default_factory=_id)
    tenant_id: Optional[str] = None
    name: str
    email: EmailStr
    role: str
    avatar: Optional[str] = None
    title: Optional[str] = None
    department: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class UserPublic(BaseModel):
    id: str
    tenant_id: Optional[str]
    name: str
    email: EmailStr
    role: str
    avatar: Optional[str] = None
    title: Optional[str] = None
    department: Optional[str] = None
    tenant_name: Optional[str] = None
    permissions: List[str] = []

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class LoginResponse(BaseModel):
    token: str
    user: UserPublic

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: str = ROLE_EMP
    avatar: Optional[str] = None
    title: Optional[str] = None
    department: Optional[str] = None

class UserUpdate(BaseModel):
    name: Optional[str] = None
    avatar: Optional[str] = None
    title: Optional[str] = None
    department: Optional[str] = None
    role: Optional[str] = None

class Employee(BaseModel):
    id: str = Field(default_factory=_id)
    tenant_id: str
    user_id: Optional[str] = None
    first_name: str
    last_name: str
    email: EmailStr
    handle: Optional[str] = '@employee'
    title: str
    department: str = 'Team Product'
    office: str = 'Main Office'
    status: str = 'Active'
    account: str = 'Activated'
    avatar: Optional[str] = None
    phone: Optional[str] = None
    dob: Optional[str] = None
    gender: Optional[str] = None
    nationality: Optional[str] = None
    join_date: Optional[str] = None
    line_manager: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class EmployeeCreate(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    title: Optional[str] = 'Employee'
    department: Optional[str] = 'Team Product'
    office: Optional[str] = 'Main Office'
    status: Optional[str] = 'On Boarding'
    join_date: Optional[str] = None

class EmployeeUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[EmailStr] = None
    title: Optional[str] = None
    department: Optional[str] = None
    office: Optional[str] = None
    status: Optional[str] = None
    phone: Optional[str] = None
    gender: Optional[str] = None
    dob: Optional[str] = None
    nationality: Optional[str] = None
    join_date: Optional[str] = None
    line_manager: Optional[str] = None

class EmployeeDetailResponse(BaseModel):
    id: str
    tenant_id: str
    first_name: str
    last_name: str
    email: str
    title: str
    department: str
    office: str
    status: str
    avatar: Optional[str] = None
    phone: Optional[str] = None
    dob: Optional[str] = None
    gender: Optional[str] = None
    nationality: Optional[str] = None
    join_date: Optional[str] = None
    line_manager: Optional[str] = None

class Role(BaseModel):
    id: str = Field(default_factory=_id)
    tenant_id: Optional[str] = None
    key: str
    name: str
    description: Optional[str] = ''
    permissions: List[str] = []
    system: bool = False
    users_count: int = 0
    created_at: datetime = Field(default_factory=datetime.utcnow)

class RoleCreate(BaseModel):
    name: str
    description: Optional[str] = ''
    permissions: List[str] = []

class RoleUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    permissions: Optional[List[str]] = None

class TimeOffRequest(BaseModel):
    id: str = Field(default_factory=_id)
    tenant_id: str
    employee_id: str
    employee_name: str
    avatar: Optional[str] = None
    type: str = 'Annual Leave'
    start_date: str
    end_date: str
    days: int = 1
    reason: Optional[str] = ''
    status: str = 'Pending'
    created_at: datetime = Field(default_factory=datetime.utcnow)

class TimeOffCreate(BaseModel):
    type: str = 'Annual Leave'
    start_date: str
    end_date: str
    days: int = 1
    reason: Optional[str] = ''

class TimeOffUpdate(BaseModel):
    status: str

class TimeOffType(BaseModel):
    id: str = Field(default_factory=_id)
    tenant_id: str
    name: str
    days_per_year: int = 12
    created_at: datetime = Field(default_factory=datetime.utcnow)

class TimeOffTypeCreate(BaseModel):
    name: str
    days_per_year: int = 12

class Department(BaseModel):
    id: str = Field(default_factory=_id)
    tenant_id: str
    name: str
    parent_id: Optional[str] = None
    manager_id: Optional[str] = None
    description: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class DepartmentCreate(BaseModel):
    name: str
    parent_id: Optional[str] = None
    manager_id: Optional[str] = None
    description: Optional[str] = None

class DepartmentUpdate(BaseModel):
    name: Optional[str] = None
    parent_id: Optional[str] = None
    manager_id: Optional[str] = None
    description: Optional[str] = None

class Office(BaseModel):
    id: str = Field(default_factory=_id)
    tenant_id: str
    name: str
    address: Optional[str] = None
    city: Optional[str] = None
    country: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    timezone: Optional[str] = 'UTC'
    is_hq: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)

class OfficeCreate(BaseModel):
    name: str
    address: Optional[str] = None
    city: Optional[str] = None
    country: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    timezone: Optional[str] = 'UTC'
    is_hq: Optional[bool] = False

class OfficeUpdate(BaseModel):
    name: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    country: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    timezone: Optional[str] = None
    is_hq: Optional[bool] = None

class JobTitle(BaseModel):
    id: str = Field(default_factory=_id)
    tenant_id: str
    name: str
    description: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class JobTitleCreate(BaseModel):
    name: str
    description: Optional[str] = None

class JobTitleUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None

class WorkSchedule(BaseModel):
    id: str = Field(default_factory=_id)
    tenant_id: str
    name: str
    standard_hours: str = '8h 00m'
    schedule_type: str = 'Duration-based'
    is_default: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)

class WorkScheduleCreate(BaseModel):
    name: str
    standard_hours: Optional[str] = '8h 00m'
    schedule_type: Optional[str] = 'Duration-based'
    is_default: Optional[bool] = False

class WorkScheduleUpdate(BaseModel):
    name: Optional[str] = None
    standard_hours: Optional[str] = None
    schedule_type: Optional[str] = None
    is_default: Optional[bool] = None

class Asset(BaseModel):
    id: str = Field(default_factory=_id)
    tenant_id: str
    name: str
    asset_type: str
    serial_number: Optional[str] = None
    purchase_date: Optional[str] = None
    purchase_cost: Optional[float] = None
    assigned_to: Optional[str] = None
    status: str = 'Available'
    description: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class AssetCreate(BaseModel):
    name: str
    asset_type: str
    serial_number: Optional[str] = None
    purchase_date: Optional[str] = None
    purchase_cost: Optional[float] = None
    assigned_to: Optional[str] = None
    description: Optional[str] = None

class AssetUpdate(BaseModel):
    name: Optional[str] = None
    asset_type: Optional[str] = None
    serial_number: Optional[str] = None
    purchase_date: Optional[str] = None
    purchase_cost: Optional[float] = None
    assigned_to: Optional[str] = None
    status: Optional[str] = None

class Document(BaseModel):
    id: str = Field(default_factory=_id)
    tenant_id: str
    name: str
    folder: str = 'General'
    file_type: str = 'file'
    file_url: Optional[str] = None
    file_size: Optional[int] = None
    uploaded_by: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class DocumentCreate(BaseModel):
    name: str
    folder: Optional[str] = 'General'
    file_type: Optional[str] = 'file'
    file_url: Optional[str] = None
    file_size: Optional[int] = None

class DocumentUpdate(BaseModel):
    name: Optional[str] = None
    folder: Optional[str] = None

class Job(BaseModel):
    id: str = Field(default_factory=_id)
    tenant_id: str
    title: str
    department: Optional[str] = None
    location: Optional[str] = None
    job_type: str = 'Full-Time'
    status: str = 'Active'
    description: Optional[str] = None
    salary_range: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class JobCreate(BaseModel):
    title: str
    department: Optional[str] = None
    location: Optional[str] = None
    job_type: Optional[str] = 'Full-Time'
    status: Optional[str] = 'Active'
    description: Optional[str] = None
    salary_range: Optional[str] = None

class JobUpdate(BaseModel):
    title: Optional[str] = None
    department: Optional[str] = None
    location: Optional[str] = None
    job_type: Optional[str] = None
    status: Optional[str] = None
    description: Optional[str] = None
    salary_range: Optional[str] = None

class Candidate(BaseModel):
    id: str = Field(default_factory=_id)
    tenant_id: str
    name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    job_id: Optional[str] = None
    stage: str = 'Applied'
    rating: float = 0
    resume_url: Optional[str] = None
    avatar: Optional[str] = None
    notes: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class CandidateCreate(BaseModel):
    name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    job_id: Optional[str] = None
    stage: Optional[str] = 'Applied'
    rating: Optional[float] = 0
    resume_url: Optional[str] = None
    notes: Optional[str] = None

class CandidateUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    job_id: Optional[str] = None
    stage: Optional[str] = None
    rating: Optional[float] = None
    resume_url: Optional[str] = None
    notes: Optional[str] = None

class Attendance(BaseModel):
    id: str = Field(default_factory=_id)
    tenant_id: str
    employee_id: str
    employee_name: str
    date: str
    clock_in: Optional[str] = None
    clock_out: Optional[str] = None
    clock_in_ip: Optional[str] = None
    clock_out_ip: Optional[str] = None
    clock_in_device: Optional[str] = None
    clock_out_device: Optional[str] = None
    clock_in_browser: Optional[str] = None
    clock_out_browser: Optional[str] = None
    clock_in_os: Optional[str] = None
    clock_out_os: Optional[str] = None
    clock_in_location: Optional[Dict[str, float]] = None
    clock_out_location: Optional[Dict[str, float]] = None
    clock_in_location_address: Optional[str] = None
    clock_out_location_address: Optional[str] = None
    work_summary: Optional[str] = None
    hours_worked: float = 0
    status: str = 'Present'
    created_at: datetime = Field(default_factory=datetime.utcnow)

class AttendanceClockIn(BaseModel):
    employee_id: str
    device_info: Optional[Dict[str, str]] = None
    location: Optional[Dict[str, float]] = None
    location_address: Optional[str] = None

class AttendanceClockOut(BaseModel):
    work_summary: str

class Training(BaseModel):
    id: str = Field(default_factory=_id)
    tenant_id: str
    name: str
    type: str
    trainer: Optional[str] = None
    start_date: str
    end_date: str
    location: Optional[str] = None
    status: str = 'Scheduled'
    created_at: datetime = Field(default_factory=datetime.utcnow)

class TrainingCreate(BaseModel):
    name: str
    type: str
    trainer: Optional[str] = None
    start_date: str
    end_date: str
    location: Optional[str] = None

class TrainingUpdate(BaseModel):
    name: Optional[str] = None
    type: Optional[str] = None
    trainer: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    location: Optional[str] = None
    status: Optional[str] = None

class Payslip(BaseModel):
    id: str = Field(default_factory=_id)
    tenant_id: str
    employee_id: str
    employee_name: str
    month: str
    year: str
    basic_salary: float = 0
    allowances: float = 0
    deductions: float = 0
    gross_salary: float = 0
    net_salary: float = 0
    status: str = 'Draft'
    created_at: datetime = Field(default_factory=datetime.utcnow)

class PayslipCreate(BaseModel):
    employee_id: str
    month: str
    year: str
    basic_salary: float = 0
    allowances: float = 0
    deductions: float = 0

# =================== SUPER ADMIN MODELS ===================
class Currency(BaseModel):
    id: str = Field(default_factory=_id)
    name: str
    code: str
    symbol: str
    exchange_rate: float = 1.0
    is_default: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)

class CurrencyCreate(BaseModel):
    name: str
    code: str
    symbol: str
    exchange_rate: Optional[float] = 1.0
    is_default: Optional[bool] = False

class SubscriptionPlan(BaseModel):
    id: str = Field(default_factory=_id)
    name: str
    price_monthly: float = 0
    price_yearly: float = 0
    description: Optional[str] = None
    features: List[str] = []
    max_employees: int = 10
    is_active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)

class SubscriptionPlanCreate(BaseModel):
    name: str
    price_monthly: float
    price_yearly: float
    description: Optional[str] = None
    features: Optional[List[str]] = []
    max_employees: Optional[int] = 10

class LandingPage(BaseModel):
    id: str = Field(default_factory=_id)
    section: str
    title: Optional[str] = None
    subtitle: Optional[str] = None
    content: Optional[str] = None
    image_url: Optional[str] = None
    is_active: bool = True
    order: int = 0

class LandingPageCreate(BaseModel):
    section: str
    title: Optional[str] = None
    subtitle: Optional[str] = None
    content: Optional[str] = None
    image_url: Optional[str] = None
    is_active: Optional[bool] = True

class Language(BaseModel):
    id: str = Field(default_factory=_id)
    name: str
    code: str
    is_default: bool = False
    direction: str = 'ltr'
    created_at: datetime = Field(default_factory=datetime.utcnow)

class LanguageCreate(BaseModel):
    name: str
    code: str
    is_default: Optional[bool] = False

# =================== TENANT SETTINGS MODELS ===================
class LeaveType(BaseModel):
    id: str = Field(default_factory=_id)
    tenant_id: str
    name: str
    days_per_year: int = 12
    is_paid: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)

class LeaveTypeCreate(BaseModel):
    name: str
    days_per_year: Optional[int] = 12
    is_paid: Optional[bool] = True

class LeavePolicy(BaseModel):
    id: str = Field(default_factory=_id)
    tenant_id: str
    name: str
    max_days: int = 30
    min_days: int = 1
    carry_forward: bool = False
    max_carry_forward: int = 0
    created_at: datetime = Field(default_factory=datetime.utcnow)

class LeavePolicyCreate(BaseModel):
    name: str
    max_days: Optional[int] = 30
    min_days: Optional[int] = 1
    carry_forward: Optional[bool] = False
    max_carry_forward: Optional[int] = 0

class LeaveBalance(BaseModel):
    id: str = Field(default_factory=_id)
    tenant_id: str
    employee_id: str
    leave_type_id: str
    year: str
    total_days: int = 0
    used_days: int = 0
    remaining_days: int = 0

class Holiday(BaseModel):
    id: str = Field(default_factory=_id)
    tenant_id: str
    name: str
    date: str
    is_recurring: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)

class HolidayCreate(BaseModel):
    name: str
    date: str
    is_recurring: Optional[bool] = True

class Shift(BaseModel):
    id: str = Field(default_factory=_id)
    tenant_id: str
    name: str
    start_time: str = '09:00'
    end_time: str = '18:00'
    late_threshold: int = 30
    created_at: datetime = Field(default_factory=datetime.utcnow)

class ShiftCreate(BaseModel):
    name: str
    start_time: Optional[str] = '09:00'
    end_time: Optional[str] = '18:00'
    late_threshold: Optional[int] = 30

class SalaryComponent(BaseModel):
    id: str = Field(default_factory=_id)
    tenant_id: str
    name: str
    component_type: str
    is_taxable: bool = False
    calculation_type: str = 'fixed'
    calculation_value: float = 0
    created_at: datetime = Field(default_factory=datetime.utcnow)

class SalaryComponentCreate(BaseModel):
    name: str
    component_type: str
    is_taxable: Optional[bool] = False
    calculation_type: Optional[str] = 'fixed'
    calculation_value: Optional[float] = 0

class EmployeeSalary(BaseModel):
    id: str = Field(default_factory=_id)
    tenant_id: str
    employee_id: str
    basic_salary: float = 0
    components: List[Dict[str, Any]] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)

class EmployeeSalaryCreate(BaseModel):
    employee_id: str
    basic_salary: float
    components: Optional[List[Dict[str, Any]]] = []

class PayrollRun(BaseModel):
    id: str = Field(default_factory=_id)
    tenant_id: str
    month: str
    year: str
    status: str = 'Draft'
    total_employees: int = 0
    total_gross: float = 0
    total_deductions: float = 0
    total_net: float = 0
    created_by: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class PayrollRunCreate(BaseModel):
    month: str
    year: str

# =================== COMPANY SETTINGS ===================
class CompanySettings(BaseModel):
    id: str = Field(default_factory=_id)
    tenant_id: str
    company_name: str
    company_email: Optional[str] = None
    company_phone: Optional[str] = None
    company_address: Optional[str] = None
    company_website: Optional[str] = None
    company_logo: Optional[str] = None
    company_tagline: Optional[str] = None
    time_format: str = '12h'
    date_format: str = 'dd-mm-yyyy'
    timezone: str = 'UTC'
    fiscal_year_start: str = '01-01'
    created_at: datetime = Field(default_factory=datetime.utcnow)

class CompanySettingsCreate(BaseModel):
    company_name: str
    company_email: Optional[str] = None
    company_phone: Optional[str] = None
    company_address: Optional[str] = None
    company_website: Optional[str] = None
    company_logo: Optional[str] = None
    company_tagline: Optional[str] = None
    time_format: Optional[str] = '12h'
    date_format: Optional[str] = 'dd-mm-yyyy'
    timezone: Optional[str] = 'UTC'

# =================== CONTRACTS & COMPLAINTS ===================
class Contract(BaseModel):
    id: str = Field(default_factory=_id)
    tenant_id: str
    employee_id: str
    contract_type: str
    start_date: str
    end_date: Optional[str] = None
    salary: Optional[float] = None
    status: str = 'Active'
    document_url: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class ContractCreate(BaseModel):
    employee_id: str
    contract_type: str
    start_date: str
    end_date: Optional[str] = None
    salary: Optional[float] = None

class Complaint(BaseModel):
    id: str = Field(default_factory=_id)
    tenant_id: str
    from_employee_id: str
    to_employee_id: Optional[str] = None
    title: str
    description: str
    status: str = 'Pending'
    created_at: datetime = Field(default_factory=datetime.utcnow)

class ComplaintCreate(BaseModel):
    to_employee_id: Optional[str] = None
    title: str
    description: str

ALL_PERMISSIONS = [
    {'key': 'tenants.read', 'label': 'View Tenants', 'group': 'Tenants'},
    {'key': 'tenants.create', 'label': 'Create Tenants', 'group': 'Tenants'},
    {'key': 'tenants.update', 'label': 'Update Tenants', 'group': 'Tenants'},
    {'key': 'tenants.delete', 'label': 'Delete Tenants', 'group': 'Tenants'},
    {'key': 'users.read', 'label': 'View Users', 'group': 'Users'},
    {'key': 'users.create', 'label': 'Create Users', 'group': 'Users'},
    {'key': 'users.update', 'label': 'Update Users', 'group': 'Users'},
    {'key': 'users.delete', 'label': 'Delete Users', 'group': 'Users'},
    {'key': 'employees.read', 'label': 'View Employees', 'group': 'Employees'},
    {'key': 'employees.create', 'label': 'Create Employees', 'group': 'Employees'},
    {'key': 'employees.update', 'label': 'Update Employees', 'group': 'Employees'},
    {'key': 'employees.delete', 'label': 'Delete Employees', 'group': 'Employees'},
    {'key': 'departments.read', 'label': 'View Departments', 'group': 'Departments'},
    {'key': 'departments.create', 'label': 'Create Departments', 'group': 'Departments'},
    {'key': 'departments.update', 'label': 'Update Departments', 'group': 'Departments'},
    {'key': 'departments.delete', 'label': 'Delete Departments', 'group': 'Departments'},
    {'key': 'offices.read', 'label': 'View Offices', 'group': 'Offices'},
    {'key': 'offices.create', 'label': 'Create Offices', 'group': 'Offices'},
    {'key': 'offices.update', 'label': 'Update Offices', 'group': 'Offices'},
    {'key': 'offices.delete', 'label': 'Delete Offices', 'group': 'Offices'},
    {'key': 'roles.read', 'label': 'View Roles', 'group': 'Roles'},
    {'key': 'roles.create', 'label': 'Create Roles', 'group': 'Roles'},
    {'key': 'roles.update', 'label': 'Update Roles', 'group': 'Roles'},
    {'key': 'roles.delete', 'label': 'Delete Roles', 'group': 'Roles'},
    {'key': 'payroll.read', 'label': 'View Payroll', 'group': 'Payroll'},
    {'key': 'payroll.manage', 'label': 'Manage Payroll', 'group': 'Payroll'},
    {'key': 'payroll.read.self', 'label': 'View Own Payslip', 'group': 'Payroll'},
    {'key': 'attendance.read', 'label': 'View Attendance', 'group': 'Attendance'},
    {'key': 'attendance.manage', 'label': 'Manage Attendance', 'group': 'Attendance'},
    {'key': 'timeoff.read', 'label': 'View Time Off', 'group': 'Time Off'},
    {'key': 'timeoff.manage', 'label': 'Manage Time Off', 'group': 'Time Off'},
    {'key': 'timeoff.request', 'label': 'Request Time Off', 'group': 'Time Off'},
    {'key': 'assets.read', 'label': 'View Assets', 'group': 'Assets'},
    {'key': 'assets.manage', 'label': 'Manage Assets', 'group': 'Assets'},
    {'key': 'documents.read', 'label': 'View Documents', 'group': 'Documents'},
    {'key': 'documents.manage', 'label': 'Manage Documents', 'group': 'Documents'},
    {'key': 'training.read', 'label': 'View Training', 'group': 'Training'},
    {'key': 'training.manage', 'label': 'Manage Training', 'group': 'Training'},
    {'key': 'reports.read', 'label': 'View Reports', 'group': 'Reports'},
    {'key': 'settings.manage', 'label': 'Manage Settings', 'group': 'Settings'},
    {'key': 'employees.read.self', 'label': 'View Own Profile', 'group': 'Employees'},
]