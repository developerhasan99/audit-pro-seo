import { Router, Request, Response } from 'express';
import { db } from '../db';
import { projects, crawls, pageReports, issues } from '../db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { AppError, asyncHandler } from '../middleware/error.middleware';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

// Get detailed page report (resource view)
router.get('/:projectId/:pageReportId', asyncHandler(async (req: Request, res: Response) => {
  const projectId = parseInt(req.params.projectId);
  const pageReportId = parseInt(req.params.pageReportId);
  const { tab = 'details' } = req.query;

  // Verify project belongs to user
  const project = await db.query.projects.findFirst({
    where: and(
      eq(projects.id, projectId),
      eq(projects.userId, req.user!.id)
    ),
  });

  if (!project) {
    throw new AppError('Project not found', 404);
  }

  // Get specific crawl or latest
  const crawlId = req.query.crawlId ? parseInt(req.query.crawlId as string) : null;
  
  const selectedCrawl = crawlId 
    ? await db.query.crawls.findFirst({
        where: and(
          eq(crawls.id, crawlId),
          eq(crawls.projectId, projectId)
        ),
      })
    : await db.query.crawls.findFirst({
        where: eq(crawls.projectId, projectId),
        orderBy: [desc(crawls.start)],
      });

  if (!selectedCrawl) {
    throw new AppError('No crawl found', 404);
  }

  // Get page report
  const pageReport = await db.query.pageReports.findFirst({
    where: and(
      eq(pageReports.id, pageReportId),
      eq(pageReports.crawlId, selectedCrawl.id)
    ),
  });

  if (!pageReport) {
    throw new AppError('Page report not found', 404);
  }

  // Get issues for this page
  const pageIssues = await db.query.issues.findMany({
    where: and(
      eq(issues.pagereportId, pageReport.id),
      eq(issues.crawlId, selectedCrawl.id)
    ),
    with: {
      type: true,
    },
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
      tabData = { issues: pageIssues };
      break;
    
    // Add more tabs as needed (links, images, etc.)
    default:
      tabData = {};
  }

  res.json({
    pageReport,
    tab,
    tabData,
    issues: pageIssues,
  });
}));

export default router;
