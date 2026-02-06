import type { ICloudinariImageAPIService } from "../../api_services/cloudinary_image_api/ICloudinaryImageAPIService";
import type { IUsersAPIService } from "../../api_services/users_api/IUsersAPIService";
import type { IQuizAPIService } from "../../api_services/quiz_api/IQuizAPIService"; 
export interface PlayerDashboardProps {
  cloudinaryApi: ICloudinariImageAPIService;
  usersApi: IUsersAPIService;
  quizApi: IQuizAPIService;
}