import type { ICloudinariImageAPIService } from "../../api_services/cloudinary_image_api/ICloudinaryImageAPIService";
import type { IUsersAPIService } from "../../api_services/users_api/IUsersAPIService";

export interface ProfileCardProps {
  setShowProfile: (value: boolean) => void;
  cloudinaryApi: ICloudinariImageAPIService;
  usersApi: IUsersAPIService;
}