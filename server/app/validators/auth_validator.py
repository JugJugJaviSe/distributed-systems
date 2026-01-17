import re
from datetime import datetime
from app.models.user import User

def validate_register_data(data: dict):
    """
    Validates registration data.
    Raises ValueError with a descriptive message if validation fails.
    """
    if len(data["first_name"]) < 3 or len(data["first_name"]) > 20:
        raise ValueError("First name must be 3–20 characters long.")
    
    if len(data["last_name"]) < 3 or len(data["last_name"]) > 20:
        raise ValueError("Last name must be 3–20 characters long.")
    
    if len(data["password"]) < 6:
        raise ValueError("Password must be at least 6 characters.")
    
    email_regex = r"^[^\s@]+@[^\s@]+\.[^\s@]+$"
    if not re.match(email_regex, data["email"]):
        raise ValueError("Invalid email format.")
    
    if User.query.filter_by(email=data["email"]).first():
        raise ValueError("Email already exists.")
    
    try:
        dob = datetime.fromisoformat(data["date_of_birth"])
    except ValueError:
        raise ValueError("Invalid date of birth format.")
    
    if dob > datetime.utcnow():
        raise ValueError("Date of birth cannot be in the future.")
