from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
from datetime import datetime
import uuid

def _id():
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

class User(BaseModel):
    id: str = Field(default_factory=_id)
    tenant_id: Optional[str] = None
    name: str
    email: EmailStr
    role: str  # super_admin, tenant_admin, employee
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
    status: str = 'Active'  # Active, On Boarding, Probation, On Leave
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

class Role(BaseModel):
    id: str = Field(default_factory=_id)
    tenant_id: Optional[str] = None  # None = global/system role
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
    status: str = 'Pending'  # Pending, Approved, Rejected
    created_at: datetime = Field(default_factory=datetime.utcnow)

class TimeOffCreate(BaseModel):
    type: str = 'Annual Leave'
    start_date: str
    end_date: str
    days: int = 1
    reason: Optional[str] = ''

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
    {'key': 'roles.read', 'label': 'View Roles', 'group': 'Roles'},
    {'key': 'roles.create', 'label': 'Create Roles', 'group': 'Roles'},
    {'key': 'roles.update', 'label': 'Update Roles', 'group': 'Roles'},
    {'key': 'roles.delete', 'label': 'Delete Roles', 'group': 'Roles'},
    {'key': 'payroll.read', 'label': 'View Payroll', 'group': 'Payroll'},
    {'key': 'payroll.manage', 'label': 'Manage Payroll', 'group': 'Payroll'},
    {'key': 'payroll.read.self', 'label': 'View Own Payslip', 'group': 'Payroll'},
    {'key': 'reports.read', 'label': 'View Reports', 'group': 'Reports'},
    {'key': 'settings.manage', 'label': 'Manage Settings', 'group': 'Settings'},
    {'key': 'timeoff.request', 'label': 'Request Time Off', 'group': 'Time Off'},
    {'key': 'employees.read.self', 'label': 'View Own Profile', 'group': 'Employees'},
]
