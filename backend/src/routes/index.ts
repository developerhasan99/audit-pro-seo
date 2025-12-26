import { Router } from 'express';
import authRoutes from './auth.routes';
import projectRoutes from './project.routes';
import crawlRoutes from './crawl.routes';
import dashboardRoutes from './dashboard.routes';
import issuesRoutes from './issues.routes';
import exportRoutes from './export.routes';
import explorerRoutes from './explorer.routes';
import resourcesRoutes from './resources.routes';

const router = Router();

// Mount routes
router.use('/auth', authRoutes);
router.use('/projects', projectRoutes);
router.use('/crawl', crawlRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/issues', issuesRoutes);
router.use('/export', exportRoutes);
router.use('/explorer', explorerRoutes);
router.use('/resources', resourcesRoutes);

export default router;


