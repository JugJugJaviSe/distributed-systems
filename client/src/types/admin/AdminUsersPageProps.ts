import type { IAdminAPIService } from "../../api_services/admin_api/IAdminAPIService";
import type { ICloudinariImageAPIService } from "../../api_services/cloudinary_image_api/ICloudinaryImageAPIService";
import type { IUsersAPIService } from "../../api_services/users_api/IUsersAPIService";

export interface AdminUsersProps {
    adminApi: IAdminAPIService;
    cloudinaryApi: ICloudinariImageAPIService;
    usersApi: IUsersAPIService;
}