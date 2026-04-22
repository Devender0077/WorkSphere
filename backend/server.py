from fastapi import FastAPI, APIRouter, HTTPException, Depends, Query
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
import os
import logging
from pathlib import Path
from typing import Optional, List
from datetime import datetime

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

from database import get_db, close_db
from auth import (
    hash_password, verify_password, create_access_token,
    get_current_user, require_role, require_permission,
)
from models import (
    Tenant, TenantCreate, User, UserPublic, LoginRequest, LoginResponse,
    Employee, EmployeeCreate, EmployeeUpdate, Role, RoleCreate, RoleUpdate,
    TimeOffRequest, TimeOffCreate,
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
        # employees see only themselves
        query = {'user_id': user['id']}
    elif user['role'] == ROLE_ADMIN:
        query = {'tenant_id': user['tenant_id']}
    # super admin sees all

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
    # Access control
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
        # super admin must provide tenant_id; fallback to first tenant
        t = await db.tenants.find_one()
        tenant_id = t['id'] if t else None
    emp = Employee(
        tenant_id=tenant_id,
        first_name=payload.first_name, last_name=payload.last_name,
        email=payload.email, title=payload.title or 'Employee',
        department=payload.department or 'Team Product',
        office=payload.office or 'Main Office',
        status=payload.status or 'On Boarding', handle=f'@{payload.first_name.lower()}',
        join_date=payload.join_date or datetime.utcnow().strftime('%d %b %Y'),
    )
    await db.employees.insert_one(emp.dict())
    # update tenant count
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
    query = {}
    if user['role'] == ROLE_SUPER:
        pass  # all roles
    elif user['role'] == ROLE_ADMIN:
        query = {'$or': [{'tenant_id': None}, {'tenant_id': user['tenant_id']}]}
    else:
        query = {'tenant_id': None}
    roles = await db.roles.find(query).to_list(200)
    # compute user counts per role (by key within tenant scope)
    for r in roles:
        user_q = {'role': r['key']}
        if r.get('tenant_id'):
            user_q['tenant_id'] = r['tenant_id']
        count = await db.users.count_documents(user_q)
        r['users_count'] = count
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
    if role.get('system') and (payload.name or payload.permissions is not None):
        # allow editing permissions on system roles? only superadmin
        if user['role'] != ROLE_SUPER:
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
    await db.roles.delete_one({'id': role_id})
    return {'ok': True}


# =================== TIME OFF ===================
@api.get('/time-off')
async def list_time_off(user=Depends(get_current_user)):
    db = get_db()
    query = {}
    if user['role'] == ROLE_EMP:
        # find employee record for this user
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
        # Create a lightweight employee record
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
