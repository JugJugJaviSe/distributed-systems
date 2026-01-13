from app.models.user import User
from werkzeug.security import generate_password_hash
u = User()
hash = generate_password_hash("admin123")
print(hash)

# hash for admins
#   \drs\server, python generate_hash.py