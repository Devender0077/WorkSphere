# Seed the database with demo tenants, users, employees, roles
import logging
from datetime import datetime, timedelta
from database import get_db
from auth import hash_password
from models import (
    DEFAULT_PERMISSIONS, ROLE_SUPER, ROLE_ADMIN, ROLE_EMP, ROLE_LABELS,
)

logger = logging.getLogger(__name__)

DEMO_PASSWORD = 'Demo@123'

DEMO_TENANTS = [
    {'id': 'tenant-acme', 'name': 'Acme Corp', 'slug': 'acme', 'plan': 'Enterprise', 'status': 'Active'},
    {'id': 'tenant-unpixel', 'name': 'Unpixel Studio', 'slug': 'unpixel', 'plan': 'Pro', 'status': 'Active'},
    {'id': 'tenant-stellar', 'name': 'Stellar Labs', 'slug': 'stellar', 'plan': 'Growth', 'status': 'Trial'},
]

DEMO_USERS = [
    {'id': 'user-super', 'tenant_id': None, 'name': 'Alex Morgan', 'email': 'superadmin@demo.com', 'role': ROLE_SUPER, 'title': 'Platform Admin', 'avatar': 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop&crop=face'},
    {'id': 'user-admin-acme', 'tenant_id': 'tenant-acme', 'name': 'Pristia Candra', 'email': 'admin@acme.com', 'role': ROLE_ADMIN, 'title': 'HR Director', 'avatar': 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face'},
    {'id': 'user-emp-acme', 'tenant_id': 'tenant-acme', 'name': 'Hanna Baptista', 'email': 'employee@acme.com', 'role': ROLE_EMP, 'title': 'Graphic Designer', 'department': 'Team Product', 'avatar': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face'},
]

AVATARS = {
    'Pristia Candra': 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face',
    'Hanna Baptista': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face',
    'Rayna Torff': 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=face',
    'Giana Lipshutz': 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face',
    'James George': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
    'Jordyn George': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face',
    'Skylar Herwitz': 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face',
    'Ahmad Gouse': 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&h=200&fit=crop&crop=face',
    'Alena Saris': 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&h=200&fit=crop&crop=face',
}

EMP_SEED = [
    ('Pristia', 'Candra', 'UI UX Designer', 'Active'),
    ('Hanna', 'Baptista', 'Graphic Designer', 'On Boarding'),
    ('Miracle', 'Geidt', 'Finance', 'Probation'),
    ('Rayna', 'Torff', 'Project Manager', 'Active'),
    ('Giana', 'Lipshutz', 'Creative Director', 'On Leave'),
    ('James', 'George', 'Lead Designer', 'Active'),
    ('Jordyn', 'George', 'IT Support', 'On Boarding'),
    ('Skylar', 'Herwitz', '3D Designer', 'Active'),
    ('Ahmad', 'Gouse', 'Backend Engineer', 'Active'),
    ('Alena', 'Saris', 'Product Manager', 'Active'),
]

async def seed_database(force: bool = False):
    db = get_db()

    if force:
        for coll in ['tenants', 'users', 'employees', 'roles', 'time_off_requests']:
            await db[coll].delete_many({})

    # Seed system roles (one per role key per tenant handled via key lookup)
    for role_key, perms in DEFAULT_PERMISSIONS.items():
        existing = await db.roles.find_one({'key': role_key, 'tenant_id': None})
        if not existing:
            await db.roles.insert_one({
                'id': f'role-{role_key}', 'tenant_id': None, 'key': role_key,
                'name': ROLE_LABELS[role_key], 'description': f'System role: {ROLE_LABELS[role_key]}',
                'permissions': perms, 'system': True, 'users_count': 0,
                'created_at': datetime.utcnow(),
            })

    # Custom tenant role example
    for t in DEMO_TENANTS:
        existing = await db.tenants.find_one({'id': t['id']})
        if not existing:
            await db.tenants.insert_one({**t, 'employees_count': 0, 'created_at': datetime.utcnow()})

    # Add a custom role for Acme (HR Manager)
    hr_role = await db.roles.find_one({'tenant_id': 'tenant-acme', 'name': 'HR Manager'})
    if not hr_role:
        await db.roles.insert_one({
            'id': 'role-acme-hr', 'tenant_id': 'tenant-acme', 'key': 'hr_manager',
            'name': 'HR Manager', 'description': 'Manages day-to-day HR operations',
            'permissions': ['employees.read', 'employees.create', 'employees.update', 'payroll.read', 'reports.read'],
            'system': False, 'users_count': 3, 'created_at': datetime.utcnow(),
        })

    # Seed users (demo)
    for u in DEMO_USERS:
        existing = await db.users.find_one({'email': u['email']})
        if not existing:
            doc = {**u, 'password_hash': hash_password(DEMO_PASSWORD), 'created_at': datetime.utcnow()}
            await db.users.insert_one(doc)

    # Seed employees for Acme tenant
    tenant_id = 'tenant-acme'
    for idx, (fn, ln, title, status) in enumerate(EMP_SEED):
        emp_email = f'{fn.lower()}@acme.com'
        existing = await db.employees.find_one({'email': emp_email, 'tenant_id': tenant_id})
        if not existing:
            avatar = AVATARS.get(f'{fn} {ln}')
            await db.employees.insert_one({
                'id': f'emp-acme-{idx+1:03d}',
                'tenant_id': tenant_id,
                'user_id': 'user-emp-acme' if fn == 'Hanna' else None,
                'first_name': fn, 'last_name': ln, 'email': emp_email,
                'handle': f'@{fn.lower()}', 'title': title,
                'department': 'Team Product', 'office': 'Unpixel Office',
                'status': status, 'account': 'Activated' if status != 'Probation' else 'Need Invitation',
                'avatar': avatar, 'phone': '+62 812 3456 7890',
                'dob': '15 May 1995', 'gender': 'Female' if fn in ['Pristia', 'Hanna', 'Rayna', 'Giana', 'Skylar', 'Alena'] else 'Male',
                'nationality': 'Indonesia',
                'join_date': f'{(idx % 28)+1:02d} Mar 202{idx%4}', 'line_manager': 'Skylar Calzoni',
                'created_at': datetime.utcnow(),
            })

    # Seed employees for Unpixel (fewer)
    for idx, (fn, ln, title, status) in enumerate(EMP_SEED[:5]):
        emp_email = f'{fn.lower()}@unpixel.com'
        existing = await db.employees.find_one({'email': emp_email, 'tenant_id': 'tenant-unpixel'})
        if not existing:
            avatar = AVATARS.get(f'{fn} {ln}')
            await db.employees.insert_one({
                'id': f'emp-unpixel-{idx+1:03d}',
                'tenant_id': 'tenant-unpixel',
                'first_name': fn, 'last_name': ln, 'email': emp_email,
                'handle': f'@{fn.lower()}u', 'title': title,
                'department': 'Team Product', 'office': 'Unpixel Studio',
                'status': status, 'account': 'Activated',
                'avatar': avatar, 'phone': '+62 812 0000 0000',
                'created_at': datetime.utcnow(),
            })

    # Update tenant employees_count
    for t in DEMO_TENANTS:
        count = await db.employees.count_documents({'tenant_id': t['id']})
        await db.tenants.update_one({'id': t['id']}, {'$set': {'employees_count': count}})

    # Seed some time off requests for Acme
    existing_to = await db.time_off_requests.count_documents({'tenant_id': 'tenant-acme'})
    if existing_to == 0:
        now = datetime.utcnow()
        samples = [
            ('emp-acme-002', 'Hanna Baptista', AVATARS['Hanna Baptista'], 'Annual Leave', 3, 'Pending', 'Family vacation'),
            ('emp-acme-004', 'Rayna Torff', AVATARS['Rayna Torff'], 'Sick Leave', 1, 'Approved', 'Flu recovery'),
            ('emp-acme-005', 'Giana Lipshutz', AVATARS['Giana Lipshutz'], 'Annual Leave', 5, 'Approved', 'Wedding'),
            ('emp-acme-006', 'James George', AVATARS['James George'], 'Personal', 1, 'Rejected', 'Personal errand'),
        ]
        for i, (eid, name, av, t, days, status, reason) in enumerate(samples):
            await db.time_off_requests.insert_one({
                'id': f'to-{i+1:03d}', 'tenant_id': 'tenant-acme',
                'employee_id': eid, 'employee_name': name, 'avatar': av,
                'type': t, 'start_date': (now + timedelta(days=i*3)).strftime('%d %b %Y'),
                'end_date': (now + timedelta(days=i*3 + days)).strftime('%d %b %Y'),
                'days': days, 'reason': reason, 'status': status,
                'created_at': datetime.utcnow(),
            })

    logger.info('Seed complete.')
