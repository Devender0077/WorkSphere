from fastapi import FastAPI, APIRouter, HTTPException, Depends, Query, Request
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
import os
import logging
import uuid
import json
import io
import csv
from pathlib import Path
from typing import Optional, List, Dict, Any
from datetime import datetime, timedelta
from enum import Enum

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

from database import get_db, close_db
from auth import (
    hash_password, verify_password, create_access_token,
    get_current_user, require_role, require_permission,
)
from models import (
    Tenant, TenantCreate, TenantUpdate, User, UserPublic, LoginRequest, LoginResponse,
    UserCreate, UserUpdate,
    Employee, EmployeeCreate, EmployeeUpdate,
    Role, RoleCreate, RoleUpdate,
    TimeOffRequest, TimeOffCreate, TimeOffUpdate,
    TimeOffType, TimeOffTypeCreate,
    Department, DepartmentCreate, DepartmentUpdate,
    Office, OfficeCreate, OfficeUpdate,
    JobTitle, JobTitleCreate, JobTitleUpdate,
    WorkSchedule, WorkScheduleCreate, WorkScheduleUpdate,
    Asset, AssetCreate, AssetUpdate,
    Document, DocumentCreate, DocumentUpdate,
    Job, JobCreate, JobUpdate,
    Candidate, CandidateCreate, CandidateUpdate,
    Attendance, AttendanceClockIn, AttendanceUpdate,
    Training, TrainingCreate, TrainingUpdate,
    Payslip, PayslipCreate,
    Currency, CurrencyCreate,
    SubscriptionPlan, SubscriptionPlanCreate,
    LandingPage, LandingPageCreate,
    Language, LanguageCreate,
    LeaveType, LeaveTypeCreate,
    LeavePolicy, LeavePolicyCreate,
    LeaveBalance,
    Holiday, HolidayCreate,
    Shift, ShiftCreate,
    SalaryComponent, SalaryComponentCreate,
    EmployeeSalary, EmployeeSalaryCreate,
    PayrollRun, PayrollRunCreate,
    CompanySettings, CompanySettingsCreate,
    Contract, ContractCreate,
    Complaint, ComplaintCreate,
    ROLE_SUPER, ROLE_ADMIN, ROLE_EMP, ROLE_LABELS, ALL_PERMISSIONS,
)
from seed import seed_database

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

app = FastAPI(title='HR Dashboard API')
api = APIRouter(prefix='/api')


def strip_internal(doc: dict) -> dict:
    if not doc:
        return doc
    doc.pop('_id', None)
    doc.pop('password_hash', None)
    return doc


async def get_user_public(user_doc: dict) -> dict:
    db = get_db()
    tenant_name = None
    if user_doc.get('tenant_id'):
        t = await db.tenants.find_one({'id': user_doc['tenant_id']})
        tenant_name = t['name'] if t else None
    role = await db.roles.find_one({'key': user_doc['role'], 'tenant_id': None})
    perms = role['permissions'] if role else []
    return {
        'id': user_doc['id'],
        'tenant_id': user_doc.get('tenant_id'),
        'tenant_name': tenant_name,
        'name': user_doc['name'],
        'email': user_doc['email'],
        'role': user_doc['role'],
        'avatar': user_doc.get('avatar'),
        'title': user_doc.get('title'),
        'department': user_doc.get('department'),
        'permissions': perms,
    }


# =================== AUTH ===================
@api.get('/')
async def root():
    return {'status': 'ok', 'service': 'HR Dashboard API'}

@api.post('/auth/login', response_model=LoginResponse)
async def login(payload: LoginRequest):
    db = get_db()
    user = await db.users.find_one({'email': payload.email.lower()})
    if not user or not verify_password(payload.password, user.get('password_hash', '')):
        raise HTTPException(status_code=401, detail='Invalid email or password')
    token = create_access_token(user['id'], user['role'], user.get('tenant_id'))
    return {'token': token, 'user': await get_user_public(user)}

@api.get('/auth/me', response_model=UserPublic)
async def me(user=Depends(get_current_user)):
    return await get_user_public(user)


# =================== TENANTS (super admin) ===================
@api.get('/tenants')
async def list_tenants(user=Depends(require_role(ROLE_SUPER))):
    db = get_db()
    tenants = await db.tenants.find().to_list(500)
    return [strip_internal(t) for t in tenants]

@api.post('/tenants')
async def create_tenant(payload: TenantCreate, user=Depends(require_role(ROLE_SUPER))):
    db = get_db()
    existing = await db.tenants.find_one({'slug': payload.slug})
    if existing:
        raise HTTPException(status_code=400, detail='Slug already exists')
    tenant = Tenant(name=payload.name, slug=payload.slug, plan=payload.plan or 'Pro')
    await db.tenants.insert_one(tenant.dict())
    return tenant.dict()

@api.delete('/tenants/{tenant_id}')
async def delete_tenant(tenant_id: str, user=Depends(require_role(ROLE_SUPER))):
    db = get_db()
    await db.tenants.delete_one({'id': tenant_id})
    await db.employees.delete_many({'tenant_id': tenant_id})
    await db.users.delete_many({'tenant_id': tenant_id})
    return {'ok': True}


# =================== EMPLOYEES ===================
@api.get('/employees')
async def list_employees(
    search: Optional[str] = None,
    office: Optional[str] = None,
    title: Optional[str] = None,
    status: Optional[str] = None,
    user=Depends(get_current_user),
):
    db = get_db()
    query = {}
    if user['role'] == ROLE_EMP:
        query = {'user_id': user['id']}
    elif user['role'] == ROLE_ADMIN:
        query = {'tenant_id': user['tenant_id']}

    if search:
        query['$or'] = [
            {'first_name': {'$regex': search, '$options': 'i'}},
            {'last_name': {'$regex': search, '$options': 'i'}},
            {'email': {'$regex': search, '$options': 'i'}},
        ]
    if office and office != 'All Offices':
        query['office'] = office
    if title and title != 'All Job Titles':
        query['title'] = title
    if status and status != 'All Status':
        query['status'] = status

    emps = await db.employees.find(query).to_list(500)
    return [strip_internal(e) for e in emps]

@api.get('/employees/{emp_id}')
async def get_employee(emp_id: str, user=Depends(get_current_user)):
    db = get_db()
    emp = await db.employees.find_one({'id': emp_id})
    if not emp:
        raise HTTPException(status_code=404, detail='Employee not found')
    if user['role'] == ROLE_EMP and emp.get('user_id') != user['id']:
        raise HTTPException(status_code=403, detail='Forbidden')
    if user['role'] == ROLE_ADMIN and emp['tenant_id'] != user['tenant_id']:
        raise HTTPException(status_code=403, detail='Forbidden')
    return strip_internal(emp)

@api.post('/employees')
async def create_employee(payload: EmployeeCreate, user=Depends(require_role(ROLE_ADMIN, ROLE_SUPER))):
    db = get_db()
    tenant_id = user.get('tenant_id')
    if user['role'] == ROLE_SUPER and not tenant_id:
        t = await db.tenants.find_one()
        tenant_id = t['id'] if t else None
    emp = Employee(
        tenant_id=tenant_id,
        first_name=payload.first_name, last_name=payload.last_name,
        email=payload.email, title=payload.title or 'Employee',
        department=payload.department or 'Team Product',
        office=payload.office or 'Main Office',
        status=payload.status or 'On Boarding',
        handle=f'@{payload.first_name.lower()}',
        join_date=payload.join_date or datetime.utcnow().strftime('%d %b %Y'),
    )
    await db.employees.insert_one(emp.dict())
    await db.tenants.update_one({'id': tenant_id}, {'$inc': {'employees_count': 1}})
    return emp.dict()

@api.patch('/employees/{emp_id}')
async def update_employee(emp_id: str, payload: EmployeeUpdate, user=Depends(require_role(ROLE_ADMIN, ROLE_SUPER))):
    db = get_db()
    update = {k: v for k, v in payload.dict().items() if v is not None}
    if not update:
        raise HTTPException(status_code=400, detail='No fields to update')
    res = await db.employees.update_one({'id': emp_id}, {'$set': update})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail='Employee not found')
    emp = await db.employees.find_one({'id': emp_id})
    return strip_internal(emp)

@api.delete('/employees/{emp_id}')
async def delete_employee(emp_id: str, user=Depends(require_role(ROLE_ADMIN, ROLE_SUPER))):
    db = get_db()
    emp = await db.employees.find_one({'id': emp_id})
    if not emp:
        raise HTTPException(status_code=404, detail='Employee not found')
    await db.employees.delete_one({'id': emp_id})
    await db.tenants.update_one({'id': emp['tenant_id']}, {'$inc': {'employees_count': -1}})
    return {'ok': True}


# =================== ROLES ===================
@api.get('/roles')
async def list_roles(user=Depends(get_current_user)):
    db = get_db()
    if user['role'] == ROLE_EMP:
        raise HTTPException(status_code=403, detail='Forbidden')
    if user['role'] == ROLE_SUPER:
        query = {}
    else:
        query = {'key': {'$ne': ROLE_SUPER}, 'tenant_id': {'$in': [None, user['tenant_id']]}}
    roles = await db.roles.find(query).to_list(200)
    for r in roles:
        user_q = {'role': r['key']}
        if r.get('tenant_id'):
            user_q['tenant_id'] = r['tenant_id']
        r['users_count'] = await db.users.count_documents(user_q)
    return [strip_internal(r) for r in roles]

@api.get('/permissions')
async def list_permissions(user=Depends(get_current_user)):
    return ALL_PERMISSIONS

@api.post('/roles')
async def create_role(payload: RoleCreate, user=Depends(require_role(ROLE_ADMIN, ROLE_SUPER))):
    db = get_db()
    role = Role(
        tenant_id=user.get('tenant_id') if user['role'] == ROLE_ADMIN else None,
        key=payload.name.lower().replace(' ', '_'),
        name=payload.name, description=payload.description or '',
        permissions=payload.permissions or [], system=False,
    )
    await db.roles.insert_one(role.dict())
    return role.dict()

@api.patch('/roles/{role_id}')
async def update_role(role_id: str, payload: RoleUpdate, user=Depends(require_role(ROLE_ADMIN, ROLE_SUPER))):
    db = get_db()
    role = await db.roles.find_one({'id': role_id})
    if not role:
        raise HTTPException(status_code=404, detail='Role not found')
    if user['role'] == ROLE_ADMIN:
        if role.get('key') == ROLE_SUPER:
            raise HTTPException(status_code=403, detail='Cannot edit Super Admin role')
        if role.get('tenant_id') and role.get('tenant_id') != user.get('tenant_id'):
            raise HTTPException(status_code=403, detail='Forbidden cross-tenant edit')
        if role.get('system'):
            raise HTTPException(status_code=403, detail='Cannot edit system role')
    update = {k: v for k, v in payload.dict().items() if v is not None}
    await db.roles.update_one({'id': role_id}, {'$set': update})
    role = await db.roles.find_one({'id': role_id})
    return strip_internal(role)

@api.delete('/roles/{role_id}')
async def delete_role(role_id: str, user=Depends(require_role(ROLE_ADMIN, ROLE_SUPER))):
    db = get_db()
    role = await db.roles.find_one({'id': role_id})
    if not role:
        raise HTTPException(status_code=404, detail='Role not found')
    if role.get('system'):
        raise HTTPException(status_code=400, detail='Cannot delete system role')
    if user['role'] == ROLE_ADMIN and role.get('tenant_id') != user.get('tenant_id'):
        raise HTTPException(status_code=403, detail='Forbidden cross-tenant delete')
    await db.roles.delete_one({'id': role_id})
    return {'ok': True}


# =================== TIME OFF ===================
@api.get('/time-off')
async def list_time_off(user=Depends(get_current_user)):
    db = get_db()
    query = {}
    if user['role'] == ROLE_EMP:
        emp = await db.employees.find_one({'user_id': user['id']})
        query = {'employee_id': emp['id'] if emp else '__none__'}
    elif user['role'] == ROLE_ADMIN:
        query = {'tenant_id': user['tenant_id']}
    items = await db.time_off_requests.find(query).to_list(500)
    return [strip_internal(i) for i in items]

@api.post('/time-off')
async def create_time_off(payload: TimeOffCreate, user=Depends(get_current_user)):
    db = get_db()
    emp = await db.employees.find_one({'user_id': user['id']})
    if not emp:
        raise HTTPException(status_code=400, detail='No employee profile linked to user')
    req = TimeOffRequest(
        tenant_id=emp['tenant_id'], employee_id=emp['id'],
        employee_name=f"{emp['first_name']} {emp['last_name']}",
        avatar=emp.get('avatar'), type=payload.type,
        start_date=payload.start_date, end_date=payload.end_date,
        days=payload.days, reason=payload.reason or '',
    )
    await db.time_off_requests.insert_one(req.dict())
    return req.dict()

@api.patch('/time-off/{req_id}')
async def update_time_off(req_id: str, status: str, user=Depends(require_role(ROLE_ADMIN, ROLE_SUPER))):
    if status not in ('Approved', 'Rejected', 'Pending'):
        raise HTTPException(status_code=400, detail='Invalid status')
    db = get_db()
    res = await db.time_off_requests.update_one({'id': req_id}, {'$set': {'status': status}})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail='Not found')
    return {'ok': True}


# =================== STATS ===================
@api.get('/stats')
async def stats(user=Depends(get_current_user)):
    db = get_db()
    if user['role'] == ROLE_SUPER:
        tenants = await db.tenants.count_documents({})
        employees = await db.employees.count_documents({})
        users = await db.users.count_documents({})
        roles = await db.roles.count_documents({})
        return {
            'scope': 'platform',
            'stats': [
                {'label': 'Total Tenants', 'value': f'{tenants}', 'change': '+25,5%', 'trend': 'up', 'icon': 'building'},
                {'label': 'Total Employees', 'value': f'{employees:,}', 'change': '+4,10%', 'trend': 'up', 'icon': 'users'},
                {'label': 'Active Users', 'value': f'{users}', 'change': '+5,1%', 'trend': 'up', 'icon': 'plus'},
                {'label': 'Total Roles', 'value': f'{roles}', 'change': '+0,0%', 'trend': 'up', 'icon': 'minus'},
            ],
        }
    tenant_id = user.get('tenant_id') or 'none'
    if user['role'] == ROLE_EMP:
        return {
            'scope': 'self',
            'stats': [
                {'label': 'Leave Balance', 'value': '12', 'change': 'days', 'trend': 'up', 'icon': 'users'},
                {'label': 'Pending Tasks', 'value': '4', 'change': 'tasks', 'trend': 'up', 'icon': 'briefcase'},
                {'label': 'Hours This Week', 'value': '36', 'change': '+2', 'trend': 'up', 'icon': 'plus'},
                {'label': 'Achievements', 'value': '8', 'change': 'YTD', 'trend': 'up', 'icon': 'minus'},
            ],
        }
    total = await db.employees.count_documents({'tenant_id': tenant_id})
    active = await db.employees.count_documents({'tenant_id': tenant_id, 'status': 'Active'})
    onboarding = await db.employees.count_documents({'tenant_id': tenant_id, 'status': 'On Boarding'})
    on_leave = await db.employees.count_documents({'tenant_id': tenant_id, 'status': 'On Leave'})
    return {
        'scope': 'tenant',
        'stats': [
            {'label': 'Total Employees', 'value': f'{total:,}', 'change': '+25,5%', 'trend': 'up', 'icon': 'users'},
            {'label': 'Active', 'value': f'{active}', 'change': '+4,10%', 'trend': 'up', 'icon': 'briefcase'},
            {'label': 'On Boarding', 'value': f'{onboarding}', 'change': '+5,1%', 'trend': 'up', 'icon': 'plus'},
            {'label': 'On Leave', 'value': f'{on_leave}', 'change': '+25,5%', 'trend': 'down', 'icon': 'minus'},
        ],
    }


# =================== TENANT BRANDING ===================
from pydantic import BaseModel as _BM
class TenantBranding(_BM):
    name: Optional[str] = None
    logo_url: Optional[str] = None
    primary_color: Optional[str] = None
    website: Optional[str] = None
    contact_email: Optional[str] = None
    contact_phone: Optional[str] = None
    address: Optional[str] = None

@api.get('/tenant/branding')
async def get_branding(user=Depends(get_current_user)):
    db = get_db()
    tid = user.get('tenant_id')
    if not tid:
        return {'name': 'Platform', 'logo_url': None, 'primary_color': '#10B981'}
    t = await db.tenants.find_one({'id': tid})
    if not t:
        raise HTTPException(status_code=404, detail='Tenant not found')
    return {
        'name': t.get('name'), 'logo_url': t.get('logo_url'),
        'primary_color': t.get('primary_color') or '#10B981',
        'website': t.get('website'), 'contact_email': t.get('contact_email'),
        'contact_phone': t.get('contact_phone'), 'address': t.get('address'),
    }

@api.patch('/tenant/branding')
async def update_branding(payload: TenantBranding, user=Depends(require_role(ROLE_ADMIN, ROLE_SUPER))):
    db = get_db()
    tid = user.get('tenant_id')
    if not tid:
        raise HTTPException(status_code=400, detail='No tenant context')
    update = {k: v for k, v in payload.dict().items() if v is not None}
    if not update:
        raise HTTPException(status_code=400, detail='No fields to update')
    await db.tenants.update_one({'id': tid}, {'$set': update})
    t = await db.tenants.find_one({'id': tid})
    return {
        'name': t.get('name'), 'logo_url': t.get('logo_url'),
        'primary_color': t.get('primary_color') or '#10B981',
        'website': t.get('website'), 'contact_email': t.get('contact_email'),
        'contact_phone': t.get('contact_phone'), 'address': t.get('address'),
    }


# =================== IMPERSONATION ===================
@api.post('/platform/impersonate/{user_id}')
async def impersonate(user_id: str, actor=Depends(require_role(ROLE_SUPER))):
    db = get_db()
    target = await db.users.find_one({'id': user_id})
    if not target:
        raise HTTPException(status_code=404, detail='User not found')
    if target['role'] == ROLE_SUPER:
        raise HTTPException(status_code=400, detail='Cannot impersonate another super admin')
    import jwt as _jwt
    from datetime import datetime as _dt, timedelta as _td
    from auth import JWT_SECRET, JWT_ALG
    payload = {
        'sub': target['id'], 'role': target['role'],
        'tenant_id': target.get('tenant_id'),
        'impersonator_id': actor['id'], 'impersonator_name': actor.get('name'),
        'iat': _dt.utcnow(), 'exp': _dt.utcnow() + _td(hours=2),
    }
    token = _jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALG)
    await db.audit_log.insert_one({
        'id': str(uuid.uuid4()), 'actor_id': actor['id'], 'actor_name': actor.get('name'),
        'action': 'impersonate', 'target_user_id': target['id'],
        'target_tenant_id': target.get('tenant_id'), 'created_at': datetime.utcnow(),
    })
    return {'token': token, 'user': await get_user_public(target), 'impersonating': True}

@api.get('/platform/impersonate/candidates')
async def impersonate_candidates(actor=Depends(require_role(ROLE_SUPER))):
    db = get_db()
    users = await db.users.find({'role': {'$ne': ROLE_SUPER}}).to_list(500)
    result = []
    for u in users:
        t = None
        if u.get('tenant_id'):
            t = await db.tenants.find_one({'id': u['tenant_id']})
        result.append({
            'id': u['id'], 'name': u['name'], 'email': u['email'],
            'role': u['role'], 'tenant_id': u.get('tenant_id'),
            'tenant_name': t.get('name') if t else None, 'avatar': u.get('avatar'),
        })
    return result


# =================== PAYMENT PROVIDERS ===================
class PaymentProviderConfig(_BM):
    provider: str
    enabled: bool = False
    mode: str = 'test'
    publishable_key: Optional[str] = None
    secret_key: Optional[str] = None
    webhook_secret: Optional[str] = None
    key_id: Optional[str] = None
    key_secret: Optional[str] = None

def _mask(v: Optional[str]) -> Optional[str]:
    if not v:
        return None
    if len(v) <= 8:
        return '•' * len(v)
    return v[:4] + '•' * 8 + v[-4:]

@api.get('/platform/payment-providers')
async def list_payment_providers(user=Depends(require_role(ROLE_SUPER))):
    db = get_db()
    docs = await db.payment_providers.find().to_list(10)
    for d in docs:
        d.pop('_id', None)
        for k in ('secret_key', 'webhook_secret', 'key_secret'):
            if d.get(k):
                d[k + '_masked'] = _mask(d[k])
                d.pop(k, None)
    existing = {d['provider'] for d in docs}
    for p in ('stripe', 'razorpay'):
        if p not in existing:
            docs.append({'provider': p, 'enabled': False, 'mode': 'test'})
    return docs

@api.put('/platform/payment-providers/{provider}')
async def upsert_payment_provider(provider: str, payload: PaymentProviderConfig, user=Depends(require_role(ROLE_SUPER))):
    if provider not in ('stripe', 'razorpay'):
        raise HTTPException(status_code=400, detail='Unsupported provider')
    db = get_db()
    doc = {k: v for k, v in payload.dict().items() if v is not None}
    doc['provider'] = provider
    doc['updated_at'] = datetime.utcnow()
    doc['updated_by'] = user['id']
    await db.payment_providers.update_one({'provider': provider}, {'$set': doc}, upsert=True)
    saved = await db.payment_providers.find_one({'provider': provider})
    saved.pop('_id', None)
    for k in ('secret_key', 'webhook_secret', 'key_secret'):
        if saved.get(k):
            saved[k + '_masked'] = _mask(saved[k])
            saved.pop(k, None)
    return saved

@api.post('/platform/payment-providers/{provider}/test')
async def test_payment_provider(provider: str, user=Depends(require_role(ROLE_SUPER))):
    db = get_db()
    cfg = await db.payment_providers.find_one({'provider': provider})
    if not cfg:
        raise HTTPException(status_code=404, detail='Not configured')
    has_keys = bool(cfg.get('secret_key') or cfg.get('key_secret'))
    return {
        'provider': provider, 'ok': has_keys, 'mode': cfg.get('mode', 'test'),
        'message': 'Keys present — live call skipped in demo.' if has_keys else 'No secret key configured.',
    }


# =================== STRIPE SUBSCRIPTION ===================
STRIPE_PLANS = {
    'starter': {'price_id': None, 'name': 'Starter', 'price_cents': 2900},
    'engage': {'price_id': None, 'name': 'Engage', 'price_cents': 7900},
    'enterprise': {'price_id': None, 'name': 'Enterprise', 'price_cents': 19900},
}

async def get_stripe_config() -> dict:
    db = get_db()
    cfg = await db.payment_providers.find_one({'provider': 'stripe'})
    if not cfg or not cfg.get('enabled') or not cfg.get('secret_key'):
        return None
    return cfg

async def create_stripe_session(tenant_id: str, plan_key: str, success_url: str, cancel_url: str) -> dict:
    cfg = await get_stripe_config()
    if not cfg:
        raise HTTPException(status_code=400, detail='Stripe not configured')
    import stripe
    stripe.api_key = cfg['secret_key']
    mode = 'test' if cfg.get('mode') == 'test' else 'live'
    db = get_db()
    tenant = await db.tenants.find_one({'id': tenant_id})
    tenant_name = tenant['name'] if tenant else 'Unknown Tenant'
    plan = STRIPE_PLANS.get(plan_key, STRIPE_PLANS['engage'])
    try:
        session = stripe.checkout.Session.create(
            mode='subscription', payment_method_types=['card'],
            line_items=[{
                'price_data': {
                    'currency': 'usd', 'unit_amount': plan['price_cents'],
                    'recurring': {'interval': 'month'},
                    'product_data': {'name': f'WorkSphere - {plan["name"]}', 'description': f'{tenant_name} - Monthly subscription'},
                }, 'quantity': 1,
            }], success_url=success_url, cancel_url=cancel_url,
            metadata={'tenant_id': tenant_id, 'plan': plan_key},
        )
        return {'session_id': session.id, 'url': session.url, 'plan': plan_key}
    except stripe.error.StripeError as e:
        raise HTTPException(status_code=400, detail=f'Stripe error: {str(e)}')

@api.post('/platform/stripe/checkout')
async def stripe_checkout(plan_key: str = 'engage', success_url: str = '/billing?success=1', cancel_url: str = '/billing?canceled=1', user=Depends(require_role(ROLE_ADMIN, ROLE_SUPER))):
    if plan_key not in STRIPE_PLANS:
        raise HTTPException(status_code=400, detail='Invalid plan')
    tid = user.get('tenant_id')
    if not tid:
        raise HTTPException(status_code=400, detail='No tenant context')
    return await create_stripe_session(tid, plan_key, success_url, cancel_url)

@api.post('/platform/stripe/webhook')
async def stripe_webhook(request: Request):
    payload = await request.body()
    cfg = await get_stripe_config()
    if not cfg:
        return JSONResponse({'ok': False, 'error': 'Stripe not configured'})
    import stripe
    stripe.api_key = cfg['secret_key']
    webhook_secret = cfg.get('webhook_secret')
    sig_header = request.headers.get('stripe-signature', '')
    event = None
    if webhook_secret and sig_header:
        try:
            event = stripe.Event.construct_from(json.loads(payload), sig_header, webhook_secret, strip_internal)
        except Exception:
            return JSONResponse({'ok': False, 'error': 'Invalid webhook'}, status_code=400)
    else:
        try:
            event = json.loads(payload)
        except Exception:
            return JSONResponse({'ok': False, 'error': 'Invalid payload'}, status_code=400)
    db = get_db()
    if event.get('type') == 'checkout.session.completed':
        session = event.get('data', {}).get('object', {})
        tenant_id = session.get('metadata', {}).get('tenant_id')
        plan_key = session.get('metadata', {}).get('plan', 'engage')
        if tenant_id:
            await db.tenants.update_one({'id': tenant_id}, {'$set': {'plan': plan_key, 'stripe_subscription_id': session.get('subscription'), 'subscription_status': 'active'}})
            await db.audit_log.insert_one({'id': str(uuid.uuid4()), 'actor_id': 'stripe', 'action': 'subscription_upgraded', 'target_tenant_id': tenant_id, 'details': {'plan': plan_key}, 'created_at': datetime.utcnow()})
    elif event.get('type') == 'customer.subscription.updated':
        sub = event.get('data', {}).get('object', {})
        tenant_id = sub.get('metadata', {}).get('tenant_id')
        if tenant_id:
            await db.tenants.update_one({'id': tenant_id}, {'$set': {'subscription_status': sub.get('status', 'unknown')}})
    elif event.get('type') == 'customer.subscription.deleted':
        sub = event.get('data', {}).get('object', {})
        tenant_id = sub.get('metadata', {}).get('tenant_id')
        if tenant_id:
            await db.tenants.update_one({'id': tenant_id}, {'$set': {'subscription_status': 'canceled', 'plan': 'starter'}})
    return JSONResponse({'ok': True})

@api.post('/platform/stripe/portal')
async def stripe_portal(return_url: str = '/billing', user=Depends(require_role(ROLE_ADMIN, ROLE_SUPER))):
    cfg = await get_stripe_config()
    if not cfg:
        raise HTTPException(status_code=400, detail='Stripe not configured')
    import stripe
    stripe.api_key = cfg['secret_key']
    db = get_db()
    tid = user.get('tenant_id')
    if not tid:
        raise HTTPException(status_code=400, detail='No tenant context')
    tenant = await db.tenants.find_one({'id': tid})
    if not tenant:
        raise HTTPException(status_code=404, detail='Tenant not found')
    sub_id = tenant.get('stripe_subscription_id')
    if not sub_id:
        raise HTTPException(status_code=400, detail='No active subscription')
    try:
        session = stripe.billing_portal.Session.create(customer=tenant.get('stripe_customer_id'), return_url=return_url)
        return {'url': session.url}
    except stripe.error.StripeError as e:
        raise HTTPException(status_code=400, detail=f'Stripe error: {str(e)}')

@api.get('/billing')
async def get_billing(user=Depends(get_current_user)):
    db = get_db()
    tid = user.get('tenant_id')
    if not tid:
        raise HTTPException(status_code=400, detail='No tenant context')
    tenant = await db.tenants.find_one({'id': tid})
    if not tenant:
        raise HTTPException(status_code=404, detail='Tenant not found')
    current_plan = tenant.get('plan', 'Pro')
    current_status = tenant.get('subscription_status', 'free')
    available_plans = []
    for key, plan in STRIPE_PLANS.items():
        available_plans.append({'key': key, 'name': plan['name'], 'price_cents': plan['price_cents'], 'price_display': f'${plan["price_cents"]/100:.0f}/mo'})
    return {'tenant_id': tid, 'current_plan': current_plan, 'subscription_status': current_status, 'stripe_subscription_id': tenant.get('stripe_subscription_id'), 'available_plans': available_plans}


# =================== E-SIGN ===================
class ESignDocumentIn(_BM):
    name: str
    signers: List[Dict[str, str]]
    template_id: Optional[str] = None
    document_url: Optional[str] = None
    document_text: Optional[str] = None

@api.get('/esign/documents')
async def list_esign_documents(user=Depends(get_current_user)):
    tid = user.get('tenant_id')
    if not tid:
        raise HTTPException(status_code=400, detail='No tenant context')
    db = get_db()
    items = await db.esign_documents.find({'tenant_id': tid}).sort('created_at', -1).to_list(200)
    return [strip_internal(i) for i in items]

@api.post('/esign/documents')
async def create_esign_document(payload: ESignDocumentIn, user=Depends(require_role(ROLE_ADMIN, ROLE_SUPER))):
    tid = user.get('tenant_id')
    if not tid:
        raise HTTPException(status_code=400, detail='No tenant context')
    db = get_db()
    doc_id = str(uuid.uuid4())
    now = datetime.utcnow()
    signers_list = [{'email': s.get('email'), 'name': s.get('name'), 'status': 'pending', 'signed_at': None, 'signed_ip': None} for s in payload.signers]
    doc = {'id': doc_id, 'tenant_id': tid, 'name': payload.name, 'template_id': payload.template_id, 'document_url': payload.document_url, 'document_text': payload.document_text or f'Document: {payload.name}', 'signers': signers_list, 'status': 'pending', 'created_by': user.get('name'), 'created_at': now}
    await db.esign_documents.insert_one(doc)
    for s in signers_list:
        await db.notifications.insert_one({'id': str(uuid.uuid4()), 'tenant_id': tid, 'type': 'esign_request', 'recipient_email': s['email'], 'title': f'Document awaiting signature: {payload.name}', 'message': f'You have been requested to sign "{payload.name}".', 'metadata': {'document_id': doc_id, 'signer_email': s['email']}, 'read': False, 'created_at': now})
    await db.audit_log.insert_one({'id': str(uuid.uuid4()), 'actor_id': user['id'], 'actor_name': user.get('name'), 'action': 'esign_document_created', 'target_tenant_id': tid, 'details': {'document_id': doc_id, 'name': payload.name}, 'created_at': now})
    return strip_internal(doc)

@api.post('/esign/documents/{doc_id}/sign')
async def sign_esign_document(doc_id: str, signer_email: str, request: Request, user=Depends(get_current_user)):
    db = get_db()
    doc = await db.esign_documents.find_one({'id': doc_id})
    if not doc:
        raise HTTPException(status_code=404, detail='Document not found')
    signer = next((s for s in doc.get('signers', []) if s.get('email') == signer_email), None)
    if not signer:
        raise HTTPException(status_code=404, detail='Signer not found')
    if signer.get('status') == 'signed':
        raise HTTPException(status_code=400, detail='Already signed')
    client_ip = request.client.host if request.client else 'unknown'
    updated_signers = []
    for s in doc.get('signers', []):
        if s.get('email') == signer_email:
            s['status'] = 'signed'
            s['signed_at'] = datetime.utcnow().isoformat()
            s['signed_ip'] = client_ip
        updated_signers.append(s)
    all_signed = all(s.get('status') == 'signed' for s in updated_signers)
    await db.esign_documents.update_one({'id': doc_id}, {'$set': {'signers': updated_signers, 'status': 'completed' if all_signed else 'partial'}})
    await db.audit_log.insert_one({'id': str(uuid.uuid4()), 'actor_id': user.get('id'), 'actor_name': user.get('name'), 'action': 'esign_document_signed', 'target_tenant_id': doc.get('tenant_id'), 'details': {'document_id': doc_id, 'signer_email': signer_email}, 'created_at': datetime.utcnow()})
    return {'ok': True, 'status': 'completed' if all_signed else 'partial'}

@api.delete('/esign/documents/{doc_id}')
async def delete_esign_document(doc_id: str, user=Depends(require_role(ROLE_ADMIN, ROLE_SUPER))):
    tid = user.get('tenant_id')
    if not tid:
        raise HTTPException(status_code=400, detail='No tenant context')
    db = get_db()
    doc = await db.esign_documents.find_one({'id': doc_id, 'tenant_id': tid})
    if not doc:
        raise HTTPException(status_code=404, detail='Document not found')
    await db.esign_documents.delete_one({'id': doc_id})
    return {'ok': True}

@api.post('/platform/cron/esign-reminders')
async def esign_reminder_cron(user=Depends(require_role(ROLE_SUPER))):
    db = get_db()
    now = datetime.utcnow()
    cutoff = now - timedelta(days=3)
    docs = await db.esign_documents.find({'status': {'$in': ['pending', 'partial']}, 'created_at': {'$lt': cutoff}}).to_list(100)
    reminders_sent = 0
    for doc in docs:
        for s in doc.get('signers', []):
            if s.get('status') != 'signed':
                await db.notifications.insert_one({'id': str(uuid.uuid4()), 'tenant_id': doc.get('tenant_id'), 'type': 'esign_reminder', 'recipient_email': s.get('email'), 'title': f'Reminder: Sign "{doc.get("name")}"', 'message': f'You still need to sign "{doc.get("name")}".', 'metadata': {'document_id': doc.get('id'), 'signer_email': s.get('email')}, 'read': False, 'created_at': now})
                reminders_sent += 1
    return {'ok': True, 'reminders_sent': reminders_sent}


# =================== MESSAGES ===================
class MessageIn(_BM):
    recipient_id: str
    subject: str
    body: str

@api.get('/messages')
async def list_messages(user=Depends(get_current_user)):
    db = get_db()
    uid = user['id']
    items = await db.messages.find({'$or': [{'sender_id': uid}, {'recipient_id': uid}]}).sort('created_at', -1).to_list(200)
    return [strip_internal(i) for i in items]

@api.post('/messages')
async def send_message(payload: MessageIn, user=Depends(get_current_user)):
    db = get_db()
    now = datetime.utcnow()
    msg = {'id': str(uuid.uuid4()), 'tenant_id': user.get('tenant_id'), 'sender_id': user['id'], 'sender_name': user.get('name'), 'recipient_id': payload.recipient_id, 'subject': payload.subject, 'body': payload.body, 'read': False, 'created_at': now}
    await db.messages.insert_one(msg)
    await db.notifications.insert_one({'id': str(uuid.uuid4()), 'tenant_id': user.get('tenant_id'), 'type': 'message', 'recipient_id': payload.recipient_id, 'title': f'New message from {user.get("name")}', 'message': payload.subject, 'metadata': {'message_id': msg['id']}, 'read': False, 'created_at': now})
    return strip_internal(msg)

@api.patch('/messages/{msg_id}/read')
async def read_message(msg_id: str, user=Depends(get_current_user)):
    db = get_db()
    await db.messages.update_one({'id': msg_id, 'recipient_id': user['id']}, {'$set': {'read': True}})
    return {'ok': True}


# =================== NOTIFICATIONS ===================
@api.get('/notifications')
async def list_notifications(user=Depends(get_current_user), limit: int = 50):
    db = get_db()
    items = await db.notifications.find({'recipient_id': user['id']}).sort('created_at', -1).to_list(limit)
    return [strip_internal(i) for i in items]

@api.patch('/notifications/{notif_id}/read')
async def mark_notification_read(notif_id: str, user=Depends(get_current_user)):
    db = get_db()
    await db.notifications.update_one({'id': notif_id, 'recipient_id': user['id']}, {'$set': {'read': True}})
    return {'ok': True}

@api.post('/notifications/read-all')
async def mark_all_notifications_read(user=Depends(get_current_user)):
    db = get_db()
    await db.notifications.update_many({'recipient_id': user['id'], 'read': False}, {'$set': {'read': True}})
    return {'ok': True}

@api.get('/notifications/unread-count')
async def unread_notification_count(user=Depends(get_current_user)):
    db = get_db()
    count = await db.notifications.count_documents({'recipient_id': user['id'], 'read': False})
    return {'count': count}


# =================== AI RESUME SCORING ===================
@api.post('/ai/score-resume')
async def score_resume(candidate_id: str, job_id: Optional[str] = None, resume_text: str = '', user=Depends(require_role(ROLE_ADMIN, ROLE_SUPER))):
    db = get_db()
    tid = user.get('tenant_id')
    if not tid:
        raise HTTPException(status_code=400, detail='No tenant context')
    candidate = await db.candidates.find_one({'id': candidate_id, 'tenant_id': tid})
    if not candidate:
        raise HTTPException(status_code=404, detail='Candidate not found')
    job = await db.jobs.find_one({'id': job_id, 'tenant_id': tid}) if job_id else None
    prompt = f"""You are an expert HR recruiter. Analyze this candidate's profile and score how well they fit the role."""
    if job:
        prompt += f"\nJob Title: {job.get('title')}\nJob Description: {job.get('description', 'N/A')}"
    prompt += f"\nCandidate Name: {candidate.get('name')}\nCandidate Title: {candidate.get('title', 'N/A')}\nCandidate Notes: {candidate.get('notes', 'N/A')}\nResume: {resume_text}\nProvide JSON with score (0-100), strengths, weaknesses, recommendation."""
    from emergentintegrations import call_llm
    try:
        result = call_llm(prompt=prompt, config={'model': 'claude-3-opus-20240229', 'max_tokens': 500})
        ai_result = result.get('completion', {}).get('text', '{}')
        import json as _json
        try:
            parsed = _json.loads(ai_result)
        except Exception:
            parsed = {'raw': ai_result}
    except Exception as e:
        return {'error': str(e), 'score': None, 'recommendation': None}
    if parsed.get('score') is not None:
        await db.candidates.update_one({'id': candidate_id}, {'$set': {'ai_score': parsed['score'], 'ai_recommendation': parsed.get('recommendation')}})
    return {'candidate_id': candidate_id, 'job_id': job_id, 'score': parsed.get('score'), 'strengths': parsed.get('strengths', []), 'weaknesses': parsed.get('weaknesses', []), 'recommendation': parsed.get('recommendation')}


# =================== EXPORTS ===================
class ExportFormat(str, Enum):
    csv = 'csv'
    pdf = 'pdf'

async def generate_csv(data: List[dict], headers: List[str]) -> str:
    output = io.StringIO()
    writer = csv.DictWriter(output, fieldnames=headers, extrasaction='ignore')
    writer.writeheader()
    for row in data:
        clean_row = {h: str(row.get(h, '')) for h in headers}
        writer.writerow(clean_row)
    return output.getvalue()

async def generate_simple_pdf(title: str, data: List[dict], headers: List[str]) -> bytes:
    html = f'<html><head><title>{title}</title></head><body><h1>{title}</h1><table border="1" cellpadding="4"><thead><tr>'
    for h in headers:
        html += f'<th>{h}</th>'
    html += '</tr></thead><tbody>'
    for row in data:
        html += '<tr>'
        for h in headers:
            html += f'<td>{row.get(h, "")}</td>'
        html += '</tr>'
    html += '</tbody></table></body></html>'
    try:
        import pdfkit
        return pdfkit.from_string(html, False)
    except Exception:
        return html.encode('utf-8')

@api.get('/export/audit-log')
async def export_audit_log(format: ExportFormat = ExportFormat.csv, user=Depends(require_role(ROLE_SUPER))):
    db = get_db()
    items = await db.audit_log.find().sort('created_at', -1).to_list(500)
    headers = ['id', 'actor_id', 'actor_name', 'action', 'target_user_id', 'target_tenant_id', 'created_at']
    data = [strip_internal(i) for i in items]
    if format == ExportFormat.csv:
        content = await generate_csv(data, headers)
        return JSONResponse(content=content, media_type='text/csv', headers={'Content-Disposition': 'attachment; filename=audit_log.csv'})
    else:
        content = await generate_simple_pdf('Audit Log', data, headers)
        return JSONResponse(content=content, media_type='application/pdf', headers={'Content-Disposition': 'attachment; filename=audit_log.pdf'})

@api.get('/export/jobs')
async def export_jobs(format: ExportFormat = ExportFormat.csv, user=Depends(get_current_user)):
    tid = user.get('tenant_id')
    if not tid:
        raise HTTPException(status_code=400, detail='No tenant context')
    db = get_db()
    jobs = await db.jobs.find({'tenant_id': tid}).sort('created_at', -1).to_list(500)
    for j in jobs:
        j['applicants'] = await db.candidates.count_documents({'tenant_id': tid, 'job_id': j['id']})
    headers = ['id', 'title', 'team', 'location', 'type', 'status', 'salary_range', 'applicants', 'created_at']
    data = [strip_internal(j) for j in jobs]
    if format == ExportFormat.csv:
        content = await generate_csv(data, headers)
        return JSONResponse(content=content, media_type='text/csv', headers={'Content-Disposition': 'attachment; filename=jobs.csv'})
    else:
        content = await generate_simple_pdf('Jobs', data, headers)
        return JSONResponse(content=content, media_type='application/pdf', headers={'Content-Disposition': 'attachment; filename=jobs.pdf'})

@api.get('/export/candidates')
async def export_candidates(format: ExportFormat = ExportFormat.csv, job_id: Optional[str] = None, user=Depends(get_current_user)):
    tid = user.get('tenant_id')
    if not tid:
        raise HTTPException(status_code=400, detail='No tenant context')
    db = get_db()
    query = {'tenant_id': tid}
    if job_id:
        query['job_id'] = job_id
    candidates = await db.candidates.find(query).sort('created_at', -1).to_list(1000)
    headers = ['id', 'name', 'title', 'email', 'phone', 'stage', 'rating', 'job_id', 'created_at']
    data = [strip_internal(c) for c in candidates]
    if format == ExportFormat.csv:
        content = await generate_csv(data, headers)
        return JSONResponse(content=content, media_type='text/csv', headers={'Content-Disposition': 'attachment; filename=candidates.csv'})
    else:
        content = await generate_simple_pdf('Candidates', data, headers)
        return JSONResponse(content=content, media_type='application/pdf', headers={'Content-Disposition': 'attachment; filename=candidates.pdf'})


# =================== INTEGRATIONS ===================
class IntegrationConfig(_BM):
    enabled: bool
    config: Optional[dict] = None

INTEGRATION_CATALOG = [
    {'key': 'slack', 'name': 'Slack', 'category': 'Communication', 'plans': ['starter', 'engage', 'enterprise']},
    {'key': 'google_calendar', 'name': 'Google Calendar', 'category': 'Productivity', 'plans': ['starter', 'engage', 'enterprise']},
    {'key': 'zapier', 'name': 'Zapier', 'category': 'Automation', 'plans': ['engage', 'enterprise']},
]

@api.get('/integrations')
async def list_integrations(user=Depends(get_current_user)):
    if user['role'] == ROLE_EMP:
        raise HTTPException(status_code=403, detail='Forbidden')
    db = get_db()
    tid = user.get('tenant_id')
    tenant = await db.tenants.find_one({'id': tid}) if tid else None
    plan = (tenant.get('plan') or 'engage').lower() if tenant else 'enterprise'
    plan_key = 'starter' if 'starter' in plan else ('enterprise' if 'enter' in plan else 'engage')
    saved = await db.tenant_integrations.find({'tenant_id': tid}).to_list(100)
    saved_map = {s['key']: s for s in saved}
    return [{**i, 'available': plan_key in i['plans'], 'enabled': bool(saved_map.get(i['key'], {}).get('enabled')), 'config': saved_map.get(i['key'], {}).get('config') or {}} for i in INTEGRATION_CATALOG]

@api.put('/integrations/{key}')
async def upsert_integration(key: str, payload: IntegrationConfig, user=Depends(require_role(ROLE_ADMIN, ROLE_SUPER))):
    catalog = {i['key']: i for i in INTEGRATION_CATALOG}
    if key not in catalog:
        raise HTTPException(status_code=404, detail='Unknown integration')
    db = get_db()
    tid = user.get('tenant_id')
    tenant = await db.tenants.find_one({'id': tid}) if tid else None
    plan = (tenant.get('plan') or 'engage').lower() if tenant else 'enterprise'
    plan_key = 'starter' if 'starter' in plan else ('enterprise' if 'enter' in plan else 'engage')
    if plan_key not in catalog[key]['plans']:
        raise HTTPException(status_code=402, detail=f'Upgrade plan to enable {catalog[key]["name"]}')
    doc = {'tenant_id': tid, 'key': key, 'enabled': payload.enabled, 'config': payload.config or {}, 'updated_at': datetime.utcnow()}
    await db.tenant_integrations.update_one({'tenant_id': tid, 'key': key}, {'$set': doc}, upsert=True)
    return {**catalog[key], 'available': True, 'enabled': payload.enabled, 'config': payload.config or {}}


# =================== TENANT CRUD: OFFICES / DEPARTMENTS / JOB TITLES / SCHEDULES ===================
import uuid as _uuid

def _tenant_scope(user) -> str:
    if user.get('role') == ROLE_EMP:
        raise HTTPException(status_code=403, detail='Forbidden')
    tid = user.get('tenant_id')
    if not tid:
        raise HTTPException(status_code=400, detail='No tenant context')
    return tid

class OfficeIn(_BM):
    name: str
    country: Optional[str] = None
    hq: Optional[bool] = False
    active: Optional[bool] = True
    employees: Optional[int] = 0
    timezone: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None

@api.get('/offices')
async def list_offices(user=Depends(get_current_user)):
    tid = _tenant_scope(user)
    db = get_db()
    items = await db.offices.find({'tenant_id': tid}).to_list(500)
    return [strip_internal(i) for i in items]

@api.post('/offices')
async def create_office(payload: OfficeIn, user=Depends(require_role(ROLE_ADMIN, ROLE_SUPER))):
    tid = _tenant_scope(user)
    db = get_db()
    doc = {'id': str(_uuid.uuid4()), 'tenant_id': tid, **payload.dict(), 'created_at': datetime.utcnow()}
    await db.offices.insert_one(doc)
    return strip_internal(doc)

class DepartmentIn(_BM):
    name: str
    parent_id: Optional[str] = None

@api.get('/departments')
async def list_departments(user=Depends(get_current_user)):
    tid = _tenant_scope(user)
    db = get_db()
    items = await db.departments.find({'tenant_id': tid}).to_list(500)
    return [strip_internal(i) for i in items]

@api.post('/departments')
async def create_department(payload: DepartmentIn, user=Depends(require_role(ROLE_ADMIN, ROLE_SUPER))):
    tid = _tenant_scope(user)
    db = get_db()
    doc = {'id': str(_uuid.uuid4()), 'tenant_id': tid, **payload.dict(), 'created_at': datetime.utcnow()}
    await db.departments.insert_one(doc)
    return strip_internal(doc)

class JobTitleIn(_BM):
    name: str
    active: Optional[bool] = True
    count: Optional[int] = 0

@api.get('/job-titles')
async def list_job_titles(user=Depends(get_current_user)):
    tid = _tenant_scope(user)
    db = get_db()
    items = await db.job_titles.find({'tenant_id': tid}).to_list(500)
    return [strip_internal(i) for i in items]

@api.post('/job-titles')
async def create_job_title(payload: JobTitleIn, user=Depends(require_role(ROLE_ADMIN, ROLE_SUPER))):
    tid = _tenant_scope(user)
    db = get_db()
    doc = {'id': str(_uuid.uuid4()), 'tenant_id': tid, **payload.dict(), 'created_at': datetime.utcnow()}
    await db.job_titles.insert_one(doc)
    return strip_internal(doc)

class WorkScheduleIn(_BM):
    name: str
    effective_from: Optional[str] = None
    standard_hours: Optional[str] = '8h 00m'
    schedule_type: Optional[str] = 'Duration-based'
    total: Optional[str] = '40h 00m'
    days: Optional[dict] = None
    is_default: Optional[bool] = False
    active: Optional[bool] = True

@api.get('/work-schedules')
async def list_work_schedules(user=Depends(get_current_user)):
    tid = _tenant_scope(user)
    db = get_db()
    items = await db.work_schedules.find({'tenant_id': tid}).to_list(500)
    return [strip_internal(i) for i in items]

@api.post('/work-schedules')
async def create_work_schedule(payload: WorkScheduleCreate, user=Depends(require_role(ROLE_ADMIN, ROLE_SUPER))):
    tid = _tenant_scope(user)
    db = get_db()
    doc = {'id': str(uuid.uuid4()), 'tenant_id': tid, **payload.dict(), 'created_at': datetime.utcnow()}
    await db.work_schedules.insert_one(doc)
    return strip_internal(doc)


# =================== AUDIT LOG ===================
@api.get('/platform/audit-log')
async def list_audit(user=Depends(require_role(ROLE_SUPER)), limit: int = 100):
    db = get_db()
    items = await db.audit_log.find().sort('created_at', -1).to_list(limit)
    return [strip_internal(i) for i in items]


# =================== JOBS ===================
class JobIn(_BM):
    title: str
    team: Optional[str] = None
    location: Optional[str] = None
    type: Optional[str] = 'Full-Time'
    status: Optional[str] = 'Active'
    description: Optional[str] = None
    salary_range: Optional[str] = None

@api.get('/jobs')
async def list_jobs(user=Depends(get_current_user)):
    tid = _tenant_scope(user)
    db = get_db()
    jobs = await db.jobs.find({'tenant_id': tid}).sort('created_at', -1).to_list(500)
    for j in jobs:
        j['applicants'] = await db.candidates.count_documents({'tenant_id': tid, 'job_id': j['id']})
    return [strip_internal(j) for j in jobs]

@api.post('/jobs')
async def create_job(payload: JobIn, user=Depends(require_role(ROLE_ADMIN, ROLE_SUPER))):
    tid = _tenant_scope(user)
    db = get_db()
    doc = {'id': str(_uuid.uuid4()), 'tenant_id': tid, **payload.dict(), 'created_at': datetime.utcnow(), 'applicants': 0}
    await db.jobs.insert_one(doc)
    return strip_internal(doc)

@api.patch('/jobs/{jid}')
async def update_job(jid: str, payload: JobIn, user=Depends(require_role(ROLE_ADMIN, ROLE_SUPER))):
    tid = _tenant_scope(user)
    db = get_db()
    update = {k: v for k, v in payload.dict().items() if v is not None}
    res = await db.jobs.update_one({'id': jid, 'tenant_id': tid}, {'$set': update})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail='Job not found')
    doc = await db.jobs.find_one({'id': jid})
    doc['applicants'] = await db.candidates.count_documents({'tenant_id': tid, 'job_id': jid})
    return strip_internal(doc)

@api.delete('/jobs/{jid}')
async def delete_job(jid: str, user=Depends(require_role(ROLE_ADMIN, ROLE_SUPER))):
    tid = _tenant_scope(user)
    db = get_db()
    await db.candidates.delete_many({'tenant_id': tid, 'job_id': jid})
    res = await db.jobs.delete_one({'id': jid, 'tenant_id': tid})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail='Job not found')
    return {'ok': True}


# =================== CANDIDATES ===================
class CandidateIn(_BM):
    name: str
    title: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    stage: Optional[str] = 'Applied'
    rating: Optional[float] = 0
    avatar: Optional[str] = None
    job_id: Optional[str] = None
    notes: Optional[str] = None

CANDIDATE_STAGES = ['Applied', 'Screening', 'Interview', 'Offer', 'Hired', 'Rejected']

@api.get('/candidates')
async def list_candidates(user=Depends(get_current_user), job_id: Optional[str] = None):
    tid = _tenant_scope(user)
    db = get_db()
    query = {'tenant_id': tid}
    if job_id:
        query['job_id'] = job_id
    items = await db.candidates.find(query).sort('created_at', -1).to_list(1000)
    return [strip_internal(i) for i in items]

@api.post('/candidates')
async def create_candidate(payload: CandidateIn, user=Depends(require_role(ROLE_ADMIN, ROLE_SUPER))):
    tid = _tenant_scope(user)
    db = get_db()
    if payload.stage and payload.stage not in CANDIDATE_STAGES:
        raise HTTPException(status_code=400, detail='Invalid stage')
    doc = {'id': str(_uuid.uuid4()), 'tenant_id': tid, **payload.dict(), 'created_at': datetime.utcnow()}
    await db.candidates.insert_one(doc)
    return strip_internal(doc)

@api.patch('/candidates/{cid}')
async def update_candidate(cid: str, payload: CandidateIn, user=Depends(require_role(ROLE_ADMIN, ROLE_SUPER))):
    tid = _tenant_scope(user)
    db = get_db()
    if payload.stage and payload.stage not in CANDIDATE_STAGES:
        raise HTTPException(status_code=400, detail='Invalid stage')
    update = {k: v for k, v in payload.dict().items() if v is not None}
    res = await db.candidates.update_one({'id': cid, 'tenant_id': tid}, {'$set': update})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail='Candidate not found')
    doc = await db.candidates.find_one({'id': cid})
    return strip_internal(doc)

@api.delete('/candidates/{cid}')
async def delete_candidate(cid: str, user=Depends(require_role(ROLE_ADMIN, ROLE_SUPER))):
    tid = _tenant_scope(user)
    db = get_db()
    res = await db.candidates.delete_one({'id': cid, 'tenant_id': tid})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail='Candidate not found')
    return {'ok': True}


# =================== DOCUMENTS ===================
class DocumentIn(_BM):
    name: str
    url: Optional[str] = None
    folder: Optional[str] = 'General'
    kind: Optional[str] = 'file'
    size: Optional[str] = None
    description: Optional[str] = None

@api.get('/documents')
async def list_documents(user=Depends(get_current_user), folder: Optional[str] = None):
    tid = _tenant_scope(user)
    db = get_db()
    query = {'tenant_id': tid}
    if folder:
        query['folder'] = folder
    items = await db.documents.find(query).sort('created_at', -1).to_list(500)
    return [strip_internal(i) for i in items]

@api.get('/documents/folders')
async def list_doc_folders(user=Depends(get_current_user)):
    tid = _tenant_scope(user)
    db = get_db()
    folders = await db.documents.distinct('folder', {'tenant_id': tid})
    result = []
    for f in folders:
        count = await db.documents.count_documents({'tenant_id': tid, 'folder': f})
        result.append({'name': f, 'count': count})
    return result

@api.post('/documents')
async def create_document(payload: DocumentIn, user=Depends(require_role(ROLE_ADMIN, ROLE_SUPER))):
    tid = _tenant_scope(user)
    db = get_db()
    doc = {'id': str(_uuid.uuid4()), 'tenant_id': tid, **payload.dict(), 'uploaded_by': user.get('name'), 'created_at': datetime.utcnow()}
    await db.documents.insert_one(doc)
    return strip_internal(doc)

@api.patch('/documents/{did}')
async def update_document(did: str, payload: DocumentIn, user=Depends(require_role(ROLE_ADMIN, ROLE_SUPER))):
    tid = _tenant_scope(user)
    db = get_db()
    update = {k: v for k, v in payload.dict().items() if v is not None}
    res = await db.documents.update_one({'id': did, 'tenant_id': tid}, {'$set': update})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail='Document not found')
    doc = await db.documents.find_one({'id': did})
    return strip_internal(doc)

@api.delete('/documents/{did}')
async def delete_document(did: str, user=Depends(require_role(ROLE_ADMIN, ROLE_SUPER))):
    tid = _tenant_scope(user)
    db = get_db()
    res = await db.documents.delete_one({'id': did, 'tenant_id': tid})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail='Not found')
    return {'ok': True}


# =================== ATTENDANCE ===================
@api.get('/attendance')
async def list_attendance(date: Optional[str] = None, user=Depends(get_current_user)):
    db = get_db()
    tid = _tenant_scope(user)
    query = {'tenant_id': tid}
    if date:
        query['date'] = date
    items = await db.attendance.find(query).sort('created_at', -1).to_list(500)
    return [strip_internal(i) for i in items]

@api.post('/attendance')
async def create_attendance(payload: AttendanceCreate, user=Depends(require_role(ROLE_ADMIN, ROLE_SUPER))):
    tid = _tenant_scope(user)
    db = get_db()
    emp = await db.employees.find_one({'id': payload.employee_id, 'tenant_id': tid})
    if not emp:
        raise HTTPException(status_code=404, detail='Employee not found')
    att = Attendance(
        tenant_id=tid,
        employee_id=payload.employee_id,
        employee_name=f"{emp['first_name']} {emp['last_name']}",
        date=payload.date,
        clock_in=payload.clock_in,
        clock_out=payload.clock_out,
        status=payload.status or 'Present',
    )
    await db.attendance.insert_one(att.dict())
    return att.dict()

@api.patch('/attendance/{att_id}')
async def update_attendance(att_id: str, payload: AttendanceUpdate, user=Depends(require_role(ROLE_ADMIN, ROLE_SUPER))):
    tid = _tenant_scope(user)
    db = get_db()
    update = {k: v for k, v in payload.dict().items() if v is not None}
    res = await db.attendance.update_one({'id': att_id, 'tenant_id': tid}, {'$set': update})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail='Attendance not found')
    att = await db.attendance.find_one({'id': att_id})
    return strip_internal(att)


# =================== TRAINING ===================
@api.get('/training')
async def list_training(user=Depends(get_current_user)):
    tid = _tenant_scope(user)
    db = get_db()
    items = await db.training.find({'tenant_id': tid}).sort('created_at', -1).to_list(200)
    return [strip_internal(i) for i in items]

@api.post('/training')
async def create_training(payload: TrainingCreate, user=Depends(require_role(ROLE_ADMIN, ROLE_SUPER))):
    tid = _tenant_scope(user)
    db = get_db()
    train = Training(
        tenant_id=tid,
        name=payload.name,
        type=payload.type,
        trainer=payload.trainer,
        start_date=payload.start_date,
        end_date=payload.end_date,
        location=payload.location,
    )
    await db.training.insert_one(train.dict())
    return train.dict()

@api.patch('/training/{train_id}')
async def update_training(train_id: str, payload: TrainingUpdate, user=Depends(require_role(ROLE_ADMIN, ROLE_SUPER))):
    tid = _tenant_scope(user)
    db = get_db()
    update = {k: v for k, v in payload.dict().items() if v is not None}
    res = await db.training.update_one({'id': train_id, 'tenant_id': tid}, {'$set': update})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail='Training not found')
    train = await db.training.find_one({'id': train_id})
    return strip_internal(train)

@api.delete('/training/{train_id}')
async def delete_training(train_id: str, user=Depends(require_role(ROLE_ADMIN, ROLE_SUPER))):
    tid = _tenant_scope(user)
    db = get_db()
    res = await db.training.delete_one({'id': train_id, 'tenant_id': tid})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail='Training not found')
    return {'ok': True}


# =================== ASSETS ===================
@api.get('/assets')
async def list_assets(user=Depends(get_current_user)):
    tid = _tenant_scope(user)
    db = get_db()
    items = await db.assets.find({'tenant_id': tid}).sort('created_at', -1).to_list(200)
    return [strip_internal(i) for i in items]

@api.post('/assets')
async def create_asset(payload: AssetCreate, user=Depends(require_role(ROLE_ADMIN, ROLE_SUPER))):
    tid = _tenant_scope(user)
    db = get_db()
    asset = Asset(
        tenant_id=tid,
        name=payload.name,
        asset_type=payload.asset_type,
        serial_number=payload.serial_number,
        purchase_date=payload.purchase_date,
        purchase_cost=payload.purchase_cost,
        assigned_to=payload.assigned_to,
    )
    await db.assets.insert_one(asset.dict())
    return asset.dict()

@api.patch('/assets/{asset_id}')
async def update_asset(asset_id: str, payload: AssetUpdate, user=Depends(require_role(ROLE_ADMIN, ROLE_SUPER))):
    tid = _tenant_scope(user)
    db = get_db()
    update = {k: v for k, v in payload.dict().items() if v is not None}
    res = await db.assets.update_one({'id': asset_id, 'tenant_id': tid}, {'$set': update})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail='Asset not found')
    asset = await db.assets.find_one({'id': asset_id})
    return strip_internal(asset)

@api.delete('/assets/{asset_id}')
async def delete_asset(asset_id: str, user=Depends(require_role(ROLE_ADMIN, ROLE_SUPER))):
    tid = _tenant_scope(user)
    db = get_db()
    res = await db.assets.delete_one({'id': asset_id, 'tenant_id': tid})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail='Asset not found')
    return {'ok': True}


# =================== PAYSLIPS ===================
@api.get('/payslips')
async def list_payslips(month: Optional[str] = None, year: Optional[str] = None, user=Depends(get_current_user)):
    db = get_db()
    tid = _tenant_scope(user)
    query = {'tenant_id': tid, 'employee_id': user.get('employee_id')}
    if month:
        query['month'] = month
    if year:
        query['year'] = year
    items = await db.payslips.find(query).sort('created_at', -1).to_list(200)
    return [strip_internal(i) for i in items]

@api.post('/payslips')
async def create_payslip(payload: PayslipCreate, user=Depends(require_role(ROLE_ADMIN, ROLE_SUPER))):
    tid = _tenant_scope(user)
    db = get_db()
    emp = await db.employees.find_one({'id': payload.employee_id, 'tenant_id': tid})
    if not emp:
        raise HTTPException(status_code=404, detail='Employee not found')
    net = payload.basic_salary + payload.allowances - payload.deductions
    slip = Payslip(
        tenant_id=tid,
        employee_id=payload.employee_id,
        employee_name=f"{emp['first_name']} {emp['last_name']}",
        month=payload.month,
        year=payload.year,
        basic_salary=payload.basic_salary,
        allowances=payload.allowances,
        deductions=payload.deductions,
        gross_salary=payload.basic_salary + payload.allowances,
        net_salary=net,
    )
    await db.payslips.insert_one(slip.dict())
    return slip.dict()

@api.get('/payslips/{slip_id}')
async def get_payslip(slip_id: str, user=Depends(get_current_user)):
    tid = _tenant_scope(user)
    db = get_db()
    slip = await db.payslips.find_one({'id': slip_id, 'tenant_id': tid})
    if not slip:
        raise HTTPException(status_code=404, detail='Payslip not found')
    return strip_internal(slip)


# =================== REPORTS ===================
@api.get('/reports/summary')
async def get_reports_summary(user=Depends(get_current_user)):
    tid = _tenant_scope(user)
    db = get_db()
    
    if user.get('role') == ROLE_EMP:
        return {'error': 'Forbidden'}
    
    total_emp = await db.employees.count_documents({'tenant_id': tid})
    active_emp = await db.employees.count_documents({'tenant_id': tid, 'status': 'Active'})
    on_leave = await db.employees.count_documents({'tenant_id': tid, 'status': 'On Leave'})
    probation = await db.employees.count_documents({'tenant_id': tid, 'status': 'Probation'})
    
    pending_to = await db.time_off_requests.count_documents({'tenant_id': tid, 'status': 'Pending'})
    approved_to = await db.time_off_requests.count_documents({'tenant_id': tid, 'status': 'Approved'})
    
    today = datetime.utcnow().strftime('%Y-%m-%d')
    present_today = await db.attendance.count_documents({'tenant_id': tid, 'date': today, 'status': 'Present'})
    
    return {
        'total_employees': total_emp,
        'active_employees': active_emp,
        'on_leave': on_leave,
        'probation': probation,
        'pending_timeoff': pending_to,
        'approved_timeoff': approved_to,
        'present_today': present_today,
    }


# =================== SUPER ADMIN: CURRENCIES ===================
@api.get('/platform/currencies')
async def list_currencies(user=Depends(require_role(ROLE_SUPER))):
    db = get_db()
    items = await db.currencies.find().to_list(100)
    return [strip_internal(i) for i in items]

@api.post('/platform/currencies')
async def create_currency(payload: CurrencyCreate, user=Depends(require_role(ROLE_SUPER))):
    db = get_db()
    if payload.is_default:
        await db.currencies.update_many({}, {'$set': {'is_default': False}})
    curr = Currency(name=payload.name, code=payload.code, symbol=payload.symbol, exchange_rate=payload.exchange_rate or 1.0, is_default=payload.is_default or False)
    await db.currencies.insert_one(curr.dict())
    return curr.dict()

@api.delete('/platform/currencies/{curr_id}')
async def delete_currency(curr_id: str, user=Depends(require_role(ROLE_SUPER))):
    db = get_db()
    res = await db.currencies.delete_one({'id': curr_id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail='Currency not found')
    return {'ok': True}


# =================== SUPER ADMIN: SUBSCRIPTION PLANS ===================
@api.get('/platform/plans')
async def list_plans(user=Depends(require_role(ROLE_SUPER))):
    db = get_db()
    items = await db.subscription_plans.find().to_list(50)
    return [strip_internal(i) for i in items]

@api.post('/platform/plans')
async def create_plan(payload: SubscriptionPlanCreate, user=Depends(require_role(ROLE_SUPER))):
    db = get_db()
    plan = SubscriptionPlan(name=payload.name, price_monthly=payload.price_monthly, price_yearly=payload.price_yearly, description=payload.description, features=payload.features or [], max_employees=payload.max_employees or 10)
    await db.subscription_plans.insert_one(plan.dict())
    return plan.dict()

@api.patch('/platform/plans/{plan_id}')
async def update_plan(plan_id: str, payload: SubscriptionPlanCreate, user=Depends(require_role(ROLE_SUPER))):
    db = get_db()
    update = {k: v for k, v in payload.dict().items() if v is not None}
    res = await db.subscription_plans.update_one({'id': plan_id}, {'$set': update})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail='Plan not found')
    plan = await db.subscription_plans.find_one({'id': plan_id})
    return strip_internal(plan)


# =================== SUPER ADMIN: LANDING PAGES ===================
@api.get('/platform/landing-pages')
async def list_landing_pages(user=Depends(require_role(ROLE_SUPER))):
    db = get_db()
    items = await db.landing_pages.find().sort('order', 1).to_list(50)
    return [strip_internal(i) for i in items]

@api.post('/platform/landing-pages')
async def create_landing_page(payload: LandingPageCreate, user=Depends(require_role(ROLE_SUPER))):
    db = get_db()
    page = LandingPage(section=payload.section, title=payload.title, subtitle=payload.subtitle, content=payload.content, image_url=payload.image_url, is_active=payload.is_active or True)
    await db.landing_pages.insert_one(page.dict())
    return page.dict()


# =================== SUPER ADMIN: LANGUAGES ===================
@api.get('/platform/languages')
async def list_languages(user=Depends(require_role(ROLE_SUPER))):
    db = get_db()
    items = await db.languages.find().to_list(50)
    return [strip_internal(i) for i in items]

@api.post('/platform/languages')
async def create_language(payload: LanguageCreate, user=Depends(require_role(ROLE_SUPER))):
    db = get_db()
    if payload.is_default:
        await db.languages.update_many({}, {'$set': {'is_default': False}})
    lang = Language(name=payload.name, code=payload.code, is_default=payload.is_default or False)
    await db.languages.insert_one(lang.dict())
    return lang.dict()


# =================== TENANT: LEAVE TYPES ===================
@api.get('/leave-types')
async def list_leave_types(user=Depends(get_current_user)):
    tid = _tenant_scope(user)
    db = get_db()
    items = await db.leave_types.find({'tenant_id': tid}).to_list(50)
    return [strip_internal(i) for i in items]

@api.post('/leave-types')
async def create_leave_type(payload: LeaveTypeCreate, user=Depends(require_role(ROLE_ADMIN, ROLE_SUPER))):
    tid = _tenant_scope(user)
    db = get_db()
    lt = LeaveType(tenant_id=tid, name=payload.name, days_per_year=payload.days_per_year or 12, is_paid=payload.is_paid or True)
    await db.leave_types.insert_one(lt.dict())
    return lt.dict()


# =================== TENANT: HOLIDAYS ===================
@api.get('/holidays')
async def list_holidays(user=Depends(get_current_user)):
    tid = _tenant_scope(user)
    db = get_db()
    items = await db.holidays.find({'tenant_id': tid}).to_list(100)
    return [strip_internal(i) for i in items]

@api.post('/holidays')
async def create_holiday(payload: HolidayCreate, user=Depends(require_role(ROLE_ADMIN, ROLE_SUPER))):
    tid = _tenant_scope(user)
    db = get_db()
    hol = Holiday(tenant_id=tid, name=payload.name, date=payload.date, is_recurring=payload.is_recurring or True)
    await db.holidays.insert_one(hol.dict())
    return hol.dict()


# =================== TENANT: SHIFTS ===================
@api.get('/shifts')
async def list_shifts(user=Depends(get_current_user)):
    tid = _tenant_scope(user)
    db = get_db()
    items = await db.shifts.find({'tenant_id': tid}).to_list(50)
    return [strip_internal(i) for i in items]

@api.post('/shifts')
async def create_shift(payload: ShiftCreate, user=Depends(require_role(ROLE_ADMIN, ROLE_SUPER))):
    tid = _tenant_scope(user)
    db = get_db()
    shift = Shift(tenant_id=tid, name=payload.name, start_time=payload.start_time or '09:00', end_time=payload.end_time or '18:00', late_threshold=payload.late_threshold or 30)
    await db.shifts.insert_one(shift.dict())
    return shift.dict()


# =================== TENANT: SALARY COMPONENTS ===================
@api.get('/salary-components')
async def list_salary_components(user=Depends(get_current_user)):
    tid = _tenant_scope(user)
    db = get_db()
    items = await db.salary_components.find({'tenant_id': tid}).to_list(50)
    return [strip_internal(i) for i in items]

@api.post('/salary-components')
async def create_salary_component(payload: SalaryComponentCreate, user=Depends(require_role(ROLE_ADMIN, ROLE_SUPER))):
    tid = _tenant_scope(user)
    db = get_db()
    sc = SalaryComponent(tenant_id=tid, name=payload.name, component_type=payload.component_type, is_taxable=payload.is_taxable or False, calculation_type=payload.calculation_type or 'fixed', calculation_value=payload.calculation_value or 0)
    await db.salary_components.insert_one(sc.dict())
    return sc.dict()


# =================== TENANT: EMPLOYEE SALARIES ===================
@api.get('/employee-salaries')
async def list_employee_salaries(user=Depends(get_current_user)):
    tid = _tenant_scope(user)
    db = get_db()
    items = await db.employee_salaries.find({'tenant_id': tid}).to_list(200)
    return [strip_internal(i) for i in items]

@api.post('/employee-salaries')
async def create_employee_salary(payload: EmployeeSalaryCreate, user=Depends(require_role(ROLE_ADMIN, ROLE_SUPER))):
    tid = _tenant_scope(user)
    db = get_db()
    emp = await db.employees.find_one({'id': payload.employee_id, 'tenant_id': tid})
    if not emp:
        raise HTTPException(status_code=404, detail='Employee not found')
    sal = EmployeeSalary(tenant_id=tid, employee_id=payload.employee_id, basic_salary=payload.basic_salary, components=payload.components or [])
    await db.employee_salaries.insert_one(sal.dict())
    return sal.dict()


# =================== TENANT: COMPANY SETTINGS ===================
@api.get('/company/settings')
async def get_company_settings(user=Depends(get_current_user)):
    tid = _tenant_scope(user)
    db = get_db()
    settings = await db.company_settings.find_one({'tenant_id': tid})
    if not settings:
        settings = {'id': str(uuid.uuid4()), 'tenant_id': tid, 'company_name': 'My Company', 'time_format': '12h', 'date_format': 'dd-mm-yyyy', 'timezone': 'UTC'}
    return strip_internal(settings)

@api.put('/company/settings')
async def update_company_settings(payload: CompanySettingsCreate, user=Depends(require_role(ROLE_ADMIN, ROLE_SUPER))):
    tid = _tenant_scope(user)
    db = get_db()
    update = {k: v for k, v in payload.dict().items() if v is not None}
    await db.company_settings.update_one({'tenant_id': tid}, {'$set': update}, upsert=True)
    settings = await db.company_settings.find_one({'tenant_id': tid})
    return strip_internal(settings)


# =================== CONTRACTS ===================
@api.get('/contracts')
async def list_contracts(user=Depends(get_current_user)):
    tid = _tenant_scope(user)
    db = get_db()
    items = await db.contracts.find({'tenant_id': tid}).to_list(200)
    return [strip_internal(i) for i in items]

@api.post('/contracts')
async def create_contract(payload: ContractCreate, user=Depends(require_role(ROLE_ADMIN, ROLE_SUPER))):
    tid = _tenant_scope(user)
    db = get_db()
    emp = await db.employees.find_one({'id': payload.employee_id, 'tenant_id': tid})
    if not emp:
        raise HTTPException(status_code=404, detail='Employee not found')
    contract = Contract(tenant_id=tid, employee_id=payload.employee_id, contract_type=payload.contract_type, start_date=payload.start_date, end_date=payload.end_date, salary=payload.salary)
    await db.contracts.insert_one(contract.dict())
    return contract.dict()


# =================== COMPLAINTS ===================
@api.get('/complaints')
async def list_complaints(user=Depends(get_current_user)):
    db = get_db()
    uid = user['id']
    if user['role'] == ROLE_ADMIN or user['role'] == ROLE_SUPER:
        items = await db.complaints.find({'tenant_id': user.get('tenant_id')}).to_list(100)
    else:
        items = await db.complaints.find({'from_employee_id': uid}).to_list(100)
    return [strip_internal(i) for i in items]

@api.post('/complaints')
async def create_complaint(payload: ComplaintCreate, user=Depends(get_current_user)):
    tid = _tenant_scope(user)
    db = get_db()
    complaint = Complaint(tenant_id=tid, from_employee_id=user['id'], to_employee_id=payload.to_employee_id, title=payload.title, description=payload.description)
    await db.complaints.insert_one(complaint.dict())
    return complaint.dict()


# =================== EMPLOYEE SELF SERVICE (ESS) ===================
@api.get('/ess/dashboard')
async def ess_dashboard(user=Depends(get_current_user)):
    db = get_db()
    uid = user['id']
    tid = user.get('tenant_id')
    
    emp = await db.employees.find_one({'user_id': uid, 'tenant_id': tid})
    if not emp:
        raise HTTPException(status_code=404, detail='Employee profile not found')
    
    pending_leaves = await db.time_off_requests.count_documents({'employee_id': emp['id'], 'status': 'Pending'})
    approved_leaves = await db.time_off_requests.count_documents({'employee_id': emp['id'], 'status': 'Approved'})
    
    today = datetime.utcnow().strftime('%Y-%m-%d')
    attendance_today = await db.attendance.find_one({'employee_id': emp['id'], 'date': today})
    
    payslips = await db.payslips.find({'employee_id': emp['id']}).sort('created_at', -1).limit(3).to_list(100)
    
    return {
        'employee': strip_internal(emp),
        'pending_leaves': pending_leaves,
        'approved_leaves': approved_leaves,
        'attendance_today': attendance_today,
        'recent_payslips': [strip_internal(p) for p in payslips],
    }

@api.post('/ess/clock-in')
async def ess_clock_in(request: Request, payload: Optional[AttendanceClockIn] = None, user=Depends(get_current_user)):
    db = get_db()
    uid = user['id']
    tid = user.get('tenant_id')
    
    emp = await db.employees.find_one({'user_id': uid, 'tenant_id': tid})
    if not emp:
        raise HTTPException(status_code=404, detail='Employee profile not found')
    
    today = datetime.utcnow().strftime('%Y-%m-%d')
    now = datetime.utcnow().strftime('%H:%M')
    
    existing = await db.attendance.find_one({'employee_id': emp['id'], 'date': today})
    if existing and existing.get('clock_in'):
        raise HTTPException(status_code=400, detail='Already clocked in today')
    
    client_host = request.client.host if request.client else None
    user_agent = request.headers.get('user-agent', 'Unknown')
    device = 'Mobile' if 'Mobile' in user_agent else ('Desktop' if 'Mozilla' in user_agent else 'Unknown')
    browser = 'Chrome' if 'Chrome' in user_agent else ('Safari' if 'Safari' in user_agent else ('Firefox' if 'Firefox' in user_agent else 'Other'))
    os_type = 'iOS' if 'iPhone' in user_agent or 'iPad' in user_agent else ('Android' if 'Android' in user_agent else ('Windows' if 'Windows' in user_agent else ('Mac' if 'Mac' in user_agent else 'Linux')))

    location_data = None
    location_address = None
    if payload and payload.location:
        location_data = payload.location
    if payload and payload.location_address:
        location_address = payload.location_address
    
    att_data = {
        'tenant_id': tid,
        'employee_id': emp['id'],
        'employee_name': f"{emp['first_name']} {emp['last_name']}",
        'date': today,
        'clock_in': now,
        'clock_in_ip': client_host,
        'clock_in_device': device,
        'clock_in_browser': browser,
        'clock_in_os': os_type,
        'clock_in_location': location_data,
        'clock_in_location_address': location_address,
        'status': 'Present',
        'created_at': datetime.utcnow(),
    }
    
    await db.attendance.insert_one(att_data)
    
    await db.audit_log.insert_one({
        'id': str(uuid.uuid4()),
        'actor_id': uid,
        'actor_name': user.get('name'),
        'action': 'clock_in',
        'target_tenant_id': tid,
        'details': {'device': device, 'browser': browser, 'os': os_type, 'ip': client_host},
        'created_at': datetime.utcnow(),
    })
    
    return {'ok': True, 'message': 'Clocked in successfully', 'time': now, 'device': device}

@api.post('/ess/clock-out')
async def ess_clock_out(payload: AttendanceClockOut, user=Depends(get_current_user)):
    db = get_db()
    uid = user['id']
    tid = user.get('tenant_id')
    
    emp = await db.employees.find_one({'user_id': uid, 'tenant_id': tid})
    if not emp:
        raise HTTPException(status_code=404, detail='Employee profile not found')
    
    today = datetime.utcnow().strftime('%Y-%m-%d')
    now = datetime.utcnow().strftime('%H:%M')
    
    existing = await db.attendance.find_one({'employee_id': emp['id'], 'date': today})
    if not existing:
        raise HTTPException(status_code=400, detail='Not clocked in today')
    
    if existing.get('clock_out'):
        raise HTTPException(status_code=400, detail='Already clocked out today')
    
    work_summary = payload.work_summary if payload.work_summary else ''
    
    clock_in_time = existing.get('clock_in', '00:00')
    try:
        in_h, in_m = map(int, clock_in_time.split(':'))
        out_h, out_m = map(int, now.split(':'))
        hours = (out_h * 60 + out_m - in_h * 60 - in_m) / 60.0
    except:
        hours = 0
    
    await db.attendance.update_one({'id': existing['id']}, {'$set': {
        'clock_out': now,
        'work_summary': work_summary,
        'hours_worked': round(hours, 2)
    }})
    
    await db.audit_log.insert_one({
        'id': str(uuid.uuid4()),
        'actor_id': uid,
        'actor_name': user.get('name'),
        'action': 'clock_out',
        'target_tenant_id': tid,
        'details': {'hours_worked': round(hours, 2), 'work_summary': work_summary[:200] if work_summary else None},
        'created_at': datetime.utcnow(),
    })
    
    updated = await db.attendance.find_one({'id': existing['id']})
    return {'ok': True, 'message': 'Clocked out successfully', 'hours_worked': round(hours, 2)}


app.include_router(api)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=['*'],
    allow_methods=['*'],
    allow_headers=['*'],
)

@app.on_event('startup')
async def on_startup():
    try:
        await seed_database(force=False)
    except Exception as e:
        logger.exception(f'Seed error: {e}')

@app.on_event('shutdown')
async def on_shutdown():
    await close_db()