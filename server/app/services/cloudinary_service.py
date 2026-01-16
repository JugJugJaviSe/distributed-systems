import cloudinary.uploader
from app.extensions import db
from app.models.user import User

class CloudinaryService:

    @staticmethod
    def upload_profile_picture(user_id, image):
        user = User.query.get(user_id)

        if not user:
            raise ValueError("User not found")
        
        upload_result = cloudinary.uploader.upload(
            image,
            folder="drs_profile_pictures",
            public_id=f"user_{user_id}",
            overwrite=True,
            resource_type="image"
        )

        user.profile_picture_url = upload_result["secure_url"]#for image displaying (front)
        user.profile_picture_public_id = upload_result["public_id"]#for overwriting the image(back - cloud)

        db.session.commit()

        return {
            "url": upload_result["secure_url"]
        }