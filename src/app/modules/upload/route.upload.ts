import auth from '../../middlewares/auth';
import { USER_ROLE } from '../auth/const.auth';
import { generateUploadUrl } from './controller.upload';
import { Router } from 'express';
// import { generateUploadUrl } from '../controllers/upload.controller';
// import { authMiddleware } from '../middlewares/auth.middleware'; // Import your authentication middleware

const router = Router();

// This endpoint MUST be protected so only logged-in admins can use it
router.post(
  '/generate-upload-url',
  // auth(USER_ROLE.user, USER_ROLE.superAdmin) , // Apply your JWT verification middleware
  generateUploadUrl
);

export const ImageUploads = router;