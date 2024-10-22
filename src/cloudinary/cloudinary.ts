import { v2 as cloudinary} from 'cloudinary';
import { CLOUDINARY } from './constants';

export const CloudinaryProvider = {
    provide: CLOUDINARY,
    useFactory: (): typeof cloudinary => {
      cloudinary.config({
      cloud_name: process.env.cloud_name,
      api_key: process.env.api_key,
      api_secret: process.env.api_secret,
    });
    return cloudinary
  },
};