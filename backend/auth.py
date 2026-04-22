import os
from datetime import datetime, timedelta
from typing import Optional
import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from passlib.context import CryptContext

JWT_SECRET = os.environ.get('JWT_SECRET', 'hr-dashboard-dev-secret-change-me')
JWT_ALG = 'HS256'
JWT_EXP_HOURS = 24 * 7  # 7 days

pwd_context = CryptContext(schemes=['bcrypt'], deprecated='auto')
bearer_scheme = HTTPBearer(auto_error=False)

def hash_password(p: str) -> str:
    return pwd_context.hash(p)

def verify_password(p: str, h: str) -> bool:
    try:
        return pwd_context.verify(p, h)
    except Exception:
        return False

def create_access_token(user_id: str, role: str, tenant_id: Optional[str]) -> str:
    payload = {
        'sub': user_id,
        'role': role,
        'tenant_id': tenant_id,
        'iat': datetime.utcnow(),
        'exp': datetime.utcnow() + timedelta(hours=JWT_EXP_HOURS),
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALG)

def decode_token(token: str) -> dict:
    try:
        return jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALG])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail='Token expired')
    except Exception:
        raise HTTPException(status_code=401, detail='Invalid token')

async def get_current_user(creds: HTTPAuthorizationCredentials = Depends(bearer_scheme)):
    if not creds or not creds.credentials:
        raise HTTPException(status_code=401, detail='Missing auth token')
    payload = decode_token(creds.credentials)
    from database import get_db
    db = get_db()
    user = await db.users.find_one({'id': payload.get('sub')})
    if not user:
        raise HTTPException(status_code=401, detail='User not found')
    return user

def require_role(*roles: str):
    async def checker(user=Depends(get_current_user)):
        if user.get('role') not in roles:
            raise HTTPException(status_code=403, detail='Insufficient permissions')
        return user
    return checker

def require_permission(perm: str):
    async def checker(user=Depends(get_current_user)):
        from database import get_db
        db = get_db()
        # Look up role permissions
        role = await db.roles.find_one({'key': user.get('role')})
        perms = role['permissions'] if role else []
        if perm not in perms:
            raise HTTPException(status_code=403, detail=f'Missing permission: {perm}')
        return user
    return checker
