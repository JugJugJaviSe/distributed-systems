from flask import Blueprint, request, jsonify
from flask_jwt_extended import get_jwt_identity, jwt_required
from ..services.cloudinary_service import CloudinaryService

user_bp = Blueprint("user", __name__, url_prefix="/users")

@user_bp.route("/set-profile-picture", methods=["POST"])
@jwt_required()
def upload_profile_picture():
    # get_jwt_identity() now returns a string (user ID)
    user_id = int(get_jwt_identity())  # convert to int for DB query

    if "image" not in request.files:
        return jsonify({"success": False, "message": "No image provided"}), 400
    
    image = request.files["image"]

    result = CloudinaryService.upload_profile_picture(user_id, image)

    return jsonify({
        "success": True,
        "message": "Profile picture uploaded successfully",
        "data": result
    }), 200
