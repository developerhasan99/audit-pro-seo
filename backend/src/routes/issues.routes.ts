import { Router, Request, Response } from 'express';
import { db } from '../db';
import { projects, crawls, issues, issueTypes } from '../db/schema';
import { eq, and, desc, count } from 'drizzle-orm';
import { AppError, asyncHandler } from '../middleware/error.middleware';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

// Get issues for a crawl
router.get('/:projectId', asyncHandler(async (req: Request, res: Response) => {
  const projectId = parseInt(req.params.projectId);
  const { issueType, page = 1, limit = 50 } = req.query;

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

  // Get latest crawl
  const latestCrawl = await db.query.crawls.findFirst({
    where: eq(crawls.projectId, projectId),
    orderBy: [desc(crawls.start)],
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
  const pageLimit = parseInt(limit as string);
  const pageNumber = parseInt(page as string);
  const offsetValue = (pageNumber - 1) * pageLimit;
  
  const typeFilter = issueType ? eq(issues.issueTypeId, parseInt(issueType as string)) : undefined;
  const whereClause = typeFilter 
    ? and(eq(issues.crawlId, latestCrawl.id), typeFilter)
    : eq(issues.crawlId, latestCrawl.id);

  // Get issues with pagination
  const foundIssues = await db.query.issues.findMany({
    where: whereClause,
    with: {
      type: true,
      pageReport: {
        columns: {
          url: true,
          title: true,
          statusCode: true,
        },
      },
    },
    limit: pageLimit,
    offset: offsetValue,
    orderBy: [desc(issues.id)],
  });

  // Get total count
  const [totalCountResult] = await db
    .select({ value: count() })
    .from(issues)
    .where(whereClause);

  res.json({
    issues: foundIssues,
    total: totalCountResult.value,
    page: pageNumber,
    limit: pageLimit,
  });
}));

// Get issue types summary
router.get('/:projectId/summary', asyncHandler(async (req: Request, res: Response) => {
  const projectId = parseInt(req.params.projectId);

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

  // Get latest crawl
  const latestCrawl = await db.query.crawls.findFirst({
    where: eq(crawls.projectId, projectId),
    orderBy: [desc(crawls.start)],
  });

  if (!latestCrawl) {
    res.json({ summary: [] });
    return;
  }

  // Get issue counts by type
  const summary = await db
    .select({
      issueTypeId: issues.issueTypeId,
      type: issueTypes.type,
      priority: issueTypes.priority,
      count: count(),
    })
    .from(issues)
    .innerJoin(issueTypes, eq(issues.issueTypeId, issueTypes.id))
    .where(eq(issues.crawlId, latestCrawl.id))
    .groupBy(issues.issueTypeId, issueTypes.type, issueTypes.priority)
    .orderBy(desc(count()));

  res.json({ summary });
}));

export default router;
