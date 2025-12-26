import { Router, Request, Response } from 'express';
import { AppError, asyncHandler } from '../middleware/error.middleware';
import { authMiddleware } from '../middleware/auth.middleware';
import { Project, Crawl, PageReport } from '../models';
import { Op } from 'sequelize';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

// URL Explorer - search and browse crawled URLs
router.get('/:projectId', asyncHandler(async (req: Request, res: Response) => {
  const { projectId } = req.params;
  const { search, page = 1, limit = 50 } = req.query;

  // Verify project belongs to user
  const project = await Project.findOne({
    where: {
      id: projectId,
      userId: req.user!.id,
    },
  });

  if (!project) {
    throw new AppError('Project not found', 404);
  }

  // Get latest crawl
  const latestCrawl = await Crawl.findOne({
    where: { projectId },
    order: [['start', 'DESC']],
  });

  if (!latestCrawl) {
    res.json({
      pageReports: [],
      total: 0,
      page: parseInt(page as string),
      limit: parseInt(limit as string),
    });
    return;
  }

  // Build query
  const where: any = { crawlId: latestCrawl.id };
  
  // Add search filter if provided
  if (search && typeof search === 'string') {
    where.url = {
      [Op.like]: `%${search}%`,
    };
  }

  // Get page reports with pagination
  const offset = (parseInt(page as string) - 1) * parseInt(limit as string);
  
  const { count, rows: pageReports } = await PageReport.findAndCountAll({
    where,
    attributes: ['id', 'url', 'statusCode', 'title', 'description', 'h1', 'words'],
    limit: parseInt(limit as string),
    offset,
    order: [['url', 'ASC']],
  });

  res.json({
    pageReports,
    total: count,
    page: parseInt(page as string),
    limit: parseInt(limit as string),
    search: search || '',
  });
}));

export default router;
