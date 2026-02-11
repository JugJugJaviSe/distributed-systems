import type { ICloudinariImageAPIService } from "../../api_services/cloudinary_image_api/ICloudinaryImageAPIService";
import type { IQuizAPIService } from "../../api_services/quiz_api/IQuizAPIService";
import type { IUsersAPIService } from "../../api_services/users_api/IUsersAPIService";

export interface CreateQuizPageProps {
    cloudinaryApi: ICloudinariImageAPIService;
    usersApi: IUsersAPIService;
    quizApi: IQuizAPIService;
}