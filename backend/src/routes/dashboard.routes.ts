import { Router, Request, Response } from 'express';
import { AppError, asyncHandler } from '../middleware/error.middleware';
import { authMiddleware } from '../middleware/auth.middleware';
import { Project, Crawl, PageReport, Issue, IssueType } from '../models';
import sequelize from '../database';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

// Get dashboard data for a project
router.get('/:projectId', asyncHandler(async (req: Request, res: Response) => {
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
    res.json({
      project,
      crawl: null,
      stats: null,
    });
    return;
  }

  // Get crawl statistics
  const totalPages = await PageReport.count({
    where: { crawlId: latestCrawl.id },
  });

  const totalIssues = await Issue.count({
    where: { crawlId: latestCrawl.id },
  });

  // Get issues by priority
  const issuesByPriority = await Issue.findAll({
    where: { crawlId: latestCrawl.id },
    include: [
      {
        model: IssueType,
        as: 'issueType',
        attributes: ['type', 'priority'],
      },
    ],
    attributes: ['issueTypeId'],
    group: ['issueTypeId', 'issueType.id'],
  });

  // Get status code distribution
  const statusCodes = await PageReport.findAll({
    where: { crawlId: latestCrawl.id },
    attributes: [
      'statusCode',
      [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
    ],
    group: ['statusCode'],
  });

  res.json({
    project,
    crawl: latestCrawl,
    stats: {
      totalPages,
      totalIssues,
      issuesByPriority,
      statusCodes,
    },
  });
}));

export default router;
