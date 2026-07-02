from jose import JWTError, jwt
from datetime import datetime, timedelta
from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.database.connection import SessionLocal
from app.models.admin import Admin

SECRET_KEY = "mysecretkey"
ALGORITHM = "HS256"

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(hours=2)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def verify_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None

security = HTTPBearer()

def get_current_admin(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    payload = verify_token(token)

    if payload is None:
        raise HTTPException(status_code=403, detail="Invalid or expired token")

    username = payload.get("sub")

    if username is None:
        raise HTTPException(status_code=403, detail="Invalid token")

    db = SessionLocal()
    try:
        admin = db.query(Admin).filter(Admin.username == username).first()
    finally:
        db.close()

    if admin is None:
        raise HTTPException(status_code=403, detail="Admin not found")

    return admin