import { Router, Request, Response } from 'express';
import { db } from '../db';
import { projects, crawls, pageReports } from '../db/schema';
import { eq, and, desc, count, like, asc } from 'drizzle-orm';
import { AppError, asyncHandler } from '../middleware/error.middleware';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

// URL Explorer - search and browse crawled URLs
router.get('/:projectId', asyncHandler(async (req: Request, res: Response) => {
  const projectId = parseInt(req.params.projectId);
  const { search, page = 1, limit = 50 } = req.query;

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
    res.json({
      pageReports: [],
      total: 0,
      page: parseInt(page as string),
      limit: parseInt(limit as string),
    });
    return;
  }

  // Build where clause
  const pageLimit = parseInt(limit as string);
  const pageNumber = parseInt(page as string);
  const offsetValue = (pageNumber - 1) * pageLimit;
  
  const searchFilter = search && typeof search === 'string' ? like(pageReports.url, `%${search}%`) : undefined;
  const whereClause = searchFilter 
    ? and(eq(pageReports.crawlId, selectedCrawl.id), searchFilter)
    : eq(pageReports.crawlId, selectedCrawl.id);

  // Get page reports with pagination
  const reports = await db.query.pageReports.findMany({
    where: whereClause,
    columns: {
      id: true,
      url: true,
      statusCode: true,
      title: true,
      description: true,
      h1: true,
      words: true,
    },
    limit: pageLimit,
    offset: offsetValue,
    orderBy: [asc(pageReports.url)],
  });

  // Get total count
  const [totalCountResult] = await db
    .select({ value: count() })
    .from(pageReports)
    .where(whereClause);

  res.json({
    pageReports: reports,
    total: totalCountResult.value,
    page: pageNumber,
    limit: pageLimit,
    search: search || '',
  });
}));

export default router;
