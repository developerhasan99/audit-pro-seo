import { Router, Request, Response } from 'express';
import { AppError, asyncHandler } from '../middleware/error.middleware';
import { authMiddleware } from '../middleware/auth.middleware';
import { crawlerService } from '../services/CrawlerService';
import { Project } from '../models';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

// Start crawl
router.post('/start/:projectId', asyncHandler(async (req: Request, res: Response) => {
  const { projectId } = req.params;

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

  try {
    const crawlId = await crawlerService.startCrawl(parseInt(projectId));
    
    res.json({
      message: 'Crawl started successfully',
      crawlId,
    });
  } catch (error: any) {
    throw new AppError(error.message || 'Failed to start crawl', 500);
  }
}));

// Stop crawl
router.post('/stop/:projectId', asyncHandler(async (req: Request, res: Response) => {
  const { projectId } = req.params;

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

  await crawlerService.stopCrawl(parseInt(projectId));

  res.json({
    message: 'Crawl stopped successfully',
  });
}));

// Get crawl status
router.get('/status/:projectId', asyncHandler(async (req: Request, res: Response) => {
  const { projectId } = req.params;

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

  const status = crawlerService.getCrawlStatus(parseInt(projectId));

  if (!status) {
    res.json({
      crawling: false,
      crawled: 0,
      discovered: 0,
    });
  } else {
    res.json(status);
  }
}));

export default router;

