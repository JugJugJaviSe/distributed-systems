from app.extensions import db
from app.models.user import User

def register_user(data):
    user = User(
        first_name=data["first_name"],
        last_name=data["last_name"],
        email=data["email"],
        date_of_birth=data["date_of_birth"],
        gender=data["gender"],
        country=data["country"],
        street=data["street"],
        street_number=data["street_number"]
    )#haven't added role, default one is PLAYER, admin should make moderators
    user.set_password(data["password"])
    db.session.add(user)
    db.session.commit()
    return user