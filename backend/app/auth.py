from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer
from starlette.requests import Request
from datetime import datetime, timedelta
from jose import JWTError, jwt
from .models import UserRole

SECRET_KEY = "your-secret-key-change-in-production"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

def create_access_token(user_id: int, user_email: str, role: UserRole) -> str:
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode = {
        "sub": str(user_id),
        "email": user_email,
        "role": role,
        "exp": expire
    }
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def verify_token(request: Request) -> dict:
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)

    token = auth_header[7:]  # Remove "Bearer " prefix
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)
        return payload
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)

def get_current_user(payload: dict = Depends(verify_token)) -> dict:
    return {
        "id": int(payload.get("sub")),
        "email": payload.get("email"),
        "role": payload.get("role")
    }

def require_admin(current_user: dict = Depends(get_current_user)) -> dict:
    if current_user["role"] != UserRole.ADMIN:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN)
    return current_user
