import express from 'express';
import { AuthRoutes } from '../app/modules/auth/auth.route';

import { UserRoutes } from '../app/modules/user/user.route';
import { PetProfileRoutes } from '../app/modules/petProfile/petProfile.route';
import { FaqRoutes } from '../app/modules/faq/faq.route';
import { BlogRoutes } from '../app/modules/blog/blog.route';

const router = express.Router();

const apiRoutes = [
  { path: '/user', route: UserRoutes },
  { path: '/auth', route: AuthRoutes },
  { path: '/petProfile', route: PetProfileRoutes },
  { path: '/faq', route: FaqRoutes },
  { path: '/blog', route: BlogRoutes },
];

apiRoutes.forEach(route => router.use(route.path, route.route));

export default router;
