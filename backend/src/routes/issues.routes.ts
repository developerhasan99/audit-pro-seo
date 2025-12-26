import { Router, Request, Response } from 'express';
import { AppError, asyncHandler } from '../middleware/error.middleware';
import { authMiddleware } from '../middleware/auth.middleware';
import { Project, Crawl, Issue, IssueType, PageReport } from '../models';
import sequelize from '../database';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

// Get issues for a crawl
router.get('/:projectId', asyncHandler(async (req: Request, res: Response) => {
  const { projectId } = req.params;
  const { issueType, page = 1, limit = 50 } = req.query;

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
      issues: [],
      total: 0,
      page: parseInt(page as string),
      limit: parseInt(limit as string),
    });
    return;
  }

  // Build query
  const where: any = { crawlId: latestCrawl.id };
  if (issueType) {
    where.issueTypeId = issueType;
  }

  // Get issues with pagination
  const offset = (parseInt(page as string) - 1) * parseInt(limit as string);
  
  const { count, rows: issues } = await Issue.findAndCountAll({
    where,
    include: [
      {
        model: IssueType,
        as: 'issueType',
      },
      {
        model: PageReport,
        as: 'pageReport',
        attributes: ['url', 'title', 'statusCode'],
      },
    ],
    limit: parseInt(limit as string),
    offset,
    order: [['id', 'DESC']],
  });

  res.json({
    issues,
    total: count,
    page: parseInt(page as string),
    limit: parseInt(limit as string),
  });
}));

// Get issue types summary
router.get('/:projectId/summary', asyncHandler(async (req: Request, res: Response) => {
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

  // Get latest crawl
  const latestCrawl = await Crawl.findOne({
    where: { projectId },
    order: [['start', 'DESC']],
  });

  if (!latestCrawl) {
    res.json({ summary: [] });
    return;
  }

  // Get issue counts by type
  const summary = await Issue.findAll({
    where: { crawlId: latestCrawl.id },
    include: [
      {
        model: IssueType,
        as: 'issueType',
      },
    ],
    attributes: [
      'issueTypeId',
      [sequelize.fn('COUNT', sequelize.col('Issue.id')), 'count'],
    ],
    group: ['issueTypeId', 'issueType.id'],
    order: [[sequelize.literal('count'), 'DESC']],
  });

  res.json({ summary });
}));

export default router;
