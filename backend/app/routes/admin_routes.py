from fastapi import APIRouter
from app.database.connection import SessionLocal
from app.models.admin import Admin
from app.utils.security import create_access_token

router = APIRouter()
@router.post("/admin-login")
def admin_login(username: str, password: str):
    db = SessionLocal()

    admin = db.query(Admin).filter(
        Admin.username == username,
        Admin.password == password
    ).first()

    if not admin:
        return {"error": "Invalid credentials"}

    token = create_access_token({"sub": admin.username})

    return {
        "message": "Login successful",
        "access_token": token
    }