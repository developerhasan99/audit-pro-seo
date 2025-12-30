import { Router, Request, Response } from "express";
import { db } from "../db";
import { projects, crawls, issues, issueTypes } from "../db/schema";
import { eq, and, desc, count } from "drizzle-orm";
import { AppError, asyncHandler } from "../middleware/error.middleware";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

// All routes require authentication
router.use(authMiddleware);

// Get issues for a crawl
router.get(
  "/:projectId",
  asyncHandler(async (req: Request, res: Response) => {
    const projectId = parseInt(req.params.projectId);
    const { issueType, page = 1, limit = 50 } = req.query;

    // Verify project belongs to user
    const project = await db.query.projects.findFirst({
      where: and(eq(projects.id, projectId), eq(projects.userId, req.user!.id)),
    });

    if (!project) {
      throw new AppError("Project not found", 404);
    }

    // Get specific crawl or latest
    const crawlId = req.query.crawlId
      ? parseInt(req.query.crawlId as string)
      : null;

    const selectedCrawl = crawlId
      ? await db.query.crawls.findFirst({
          where: and(eq(crawls.id, crawlId), eq(crawls.projectId, projectId)),
        })
      : await db.query.crawls.findFirst({
          where: eq(crawls.projectId, projectId),
          orderBy: [desc(crawls.start)],
        });

    if (!selectedCrawl) {
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

    const typeFilter = issueType
      ? eq(issues.issueTypeId, parseInt(issueType as string))
      : undefined;
    const whereClause = typeFilter
      ? and(eq(issues.crawlId, selectedCrawl.id), typeFilter)
      : eq(issues.crawlId, selectedCrawl.id);

    // Get issues with pagination
    const foundIssues = await db.query.issues.findMany({
      where: whereClause,
      with: {
        type: true,
        pageReport: true, // Load all pageReport fields
      },
      limit: pageLimit,
      offset: offsetValue,
      orderBy: [desc(issues.id)],
    });

    // Debug logging
    console.log(
      `Found ${foundIssues.length} issues for crawl ${selectedCrawl.id}`
    );
    if (foundIssues.length > 0) {
      console.log("Sample issue:", JSON.stringify(foundIssues[0], null, 2));
    }

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
  })
);

// Get issue types summary
router.get(
  "/:projectId/summary",
  asyncHandler(async (req: Request, res: Response) => {
    const projectId = parseInt(req.params.projectId);

    // Verify project belongs to user
    const project = await db.query.projects.findFirst({
      where: and(eq(projects.id, projectId), eq(projects.userId, req.user!.id)),
    });

    if (!project) {
      throw new AppError("Project not found", 404);
    }

    // Get specific crawl or latest
    const crawlId = req.query.crawlId
      ? parseInt(req.query.crawlId as string)
      : null;

    const selectedCrawl = crawlId
      ? await db.query.crawls.findFirst({
          where: and(eq(crawls.id, crawlId), eq(crawls.projectId, projectId)),
        })
      : await db.query.crawls.findFirst({
          where: eq(crawls.projectId, projectId),
          orderBy: [desc(crawls.start)],
        });

    if (!selectedCrawl) {
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
      .where(eq(issues.crawlId, selectedCrawl.id))
      .groupBy(issues.issueTypeId, issueTypes.type, issueTypes.priority)
      .orderBy(desc(count()));

    res.json({ summary });
  })
);

export default router;
