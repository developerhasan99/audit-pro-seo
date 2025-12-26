import { Router, Request, Response } from 'express';
import { AppError, asyncHandler } from '../middleware/error.middleware';
import { authMiddleware } from '../middleware/auth.middleware';
import { Project, Crawl, PageReport, Issue, IssueType } from '../models';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

// Get detailed page report (resource view)
router.get('/:projectId/:pageReportId', asyncHandler(async (req: Request, res: Response) => {
  const { projectId, pageReportId } = req.params;
  const { tab = 'details' } = req.query;

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
    throw new AppError('No crawl found', 404);
  }

  // Get page report
  const pageReport = await PageReport.findOne({
    where: {
      id: pageReportId,
      crawlId: latestCrawl.id,
    },
  });

  if (!pageReport) {
    throw new AppError('Page report not found', 404);
  }

  // Get issues for this page
  const issues = await Issue.findAll({
    where: {
      pagereportId: pageReport.id,
      crawlId: latestCrawl.id,
    },
    include: [
      {
        model: IssueType,
        as: 'issueType',
      },
    ],
  });

  // Depending on the tab, load different data
  let tabData: any = {};
  
  switch (tab) {
    case 'details':
      tabData = {
        url: pageReport.url,
        statusCode: pageReport.statusCode,
        title: pageReport.title,
        description: pageReport.description,
        canonical: pageReport.canonical,
        h1: pageReport.h1,
        h2: pageReport.h2,
        lang: pageReport.lang,
        robots: pageReport.robots,
        words: pageReport.words,
        size: pageReport.size,
      };
      break;
    
    case 'issues':
      tabData = { issues };
      break;
    
    // Add more tabs as needed (links, images, etc.)
    default:
      tabData = {};
  }

  res.json({
    pageReport,
    tab,
    tabData,
    issues,
  });
}));

export default router;
