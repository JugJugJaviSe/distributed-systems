import type { CloudinaryImageResponse } from "../../types/cloudinary/CloudinaryImageResponse";

export interface ICloudinariImageAPIService {
    addOrChangeImage(image: File, token:string): Promise<CloudinaryImageResponse>;
}