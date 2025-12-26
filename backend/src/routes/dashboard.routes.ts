import { Router, Request, Response } from 'express';
import { db } from '../db';
import { projects, crawls, pageReports, issues, issueTypes } from '../db/schema';
import { eq, and, desc, count } from 'drizzle-orm';
import { AppError, asyncHandler } from '../middleware/error.middleware';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

// Get dashboard data for a project
router.get('/:projectId', asyncHandler(async (req: Request, res: Response) => {
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
    res.json({
      project,
      crawl: null,
      stats: null,
    });
    return;
  }

  // Get crawl statistics
  const [totalPagesResult] = await db
    .select({ value: count() })
    .from(pageReports)
    .where(eq(pageReports.crawlId, latestCrawl.id));

  const [totalIssuesResult] = await db
    .select({ value: count() })
    .from(issues)
    .where(eq(issues.crawlId, latestCrawl.id));

  // Get issues by priority
  const issuesByPriority = await db
    .select({
      issueTypeId: issues.issueTypeId,
      type: issueTypes.type,
      priority: issueTypes.priority,
      count: count(),
    })
    .from(issues)
    .innerJoin(issueTypes, eq(issues.issueTypeId, issueTypes.id))
    .where(eq(issues.crawlId, latestCrawl.id))
    .groupBy(issues.issueTypeId, issueTypes.type, issueTypes.priority);

  // Get status code distribution
  const statusCodes = await db
    .select({
      statusCode: pageReports.statusCode,
      count: count(),
    })
    .from(pageReports)
    .where(eq(pageReports.crawlId, latestCrawl.id))
    .groupBy(pageReports.statusCode);

  res.json({
    project,
    crawl: latestCrawl,
    stats: {
      totalPages: totalPagesResult.value,
      totalIssues: totalIssuesResult.value,
      issuesByPriority,
      statusCodes,
    },
  });
}));

export default router;
