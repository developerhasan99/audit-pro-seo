import { Router, Request, Response } from "express";
import { db } from "../db";
import { projects, crawls } from "../db/schema";
import { eq, and, desc } from "drizzle-orm";
import { AppError, asyncHandler } from "../middleware/error.middleware";
import { authMiddleware } from "../middleware/auth.middleware";
import { crawlerService } from "../services/CrawlerService";

const router = Router();

// All routes require authentication
router.use(authMiddleware);

// Start crawl
router.post(
  "/start/:projectId",
  asyncHandler(async (req: Request, res: Response) => {
    const projectId = parseInt(req.params.projectId);

    // Verify project belongs to user
    const project = await db.query.projects.findFirst({
      where: and(eq(projects.id, projectId), eq(projects.userId, req.user!.id)),
    });

    if (!project) {
      throw new AppError("Project not found", 404);
    }

    try {
      const crawlId = await crawlerService.startCrawl(projectId);

      res.json({
        message: "Crawl started successfully",
        crawlId,
      });
    } catch (error: any) {
      throw new AppError(error.message || "Failed to start crawl", 500);
    }
  })
);

// Stop crawl
router.post(
  "/stop/:projectId",
  asyncHandler(async (req: Request, res: Response) => {
    const projectId = parseInt(req.params.projectId);

    // Verify project belongs to user
    const project = await db.query.projects.findFirst({
      where: and(eq(projects.id, projectId), eq(projects.userId, req.user!.id)),
    });

    if (!project) {
      throw new AppError("Project not found", 404);
    }

    await crawlerService.stopCrawl(projectId);

    res.json({
      message: "Crawl stopped successfully",
    });
  })
);

// Get crawl status
router.get(
  "/status/:projectId",
  asyncHandler(async (req: Request, res: Response) => {
    const projectId = parseInt(req.params.projectId);

    // Verify project belongs to user
    const project = await db.query.projects.findFirst({
      where: and(eq(projects.id, projectId), eq(projects.userId, req.user!.id)),
    });

    if (!project) {
      throw new AppError("Project not found", 404);
    }

    const status = crawlerService.getCrawlStatus(projectId);

    if (!status) {
      res.json({
        crawling: false,
        crawled: 0,
        discovered: 0,
      });
    } else {
      res.json(status);
    }
  })
);

// Get crawl history for a project
router.get(
  "/history/:projectId",
  asyncHandler(async (req: Request, res: Response) => {
    const projectId = parseInt(req.params.projectId);

    // Verify project belongs to user
    const project = await db.query.projects.findFirst({
      where: and(eq(projects.id, projectId), eq(projects.userId, req.user!.id)),
    });

    if (!project) {
      throw new AppError("Project not found", 404);
    }

    const history = await db.query.crawls.findMany({
      where: eq(crawls.projectId, projectId),
      orderBy: [desc(crawls.start)],
    });

    res.json(history);
  })
);

// Delete crawl
router.delete(
  "/:crawlId",
  asyncHandler(async (req: Request, res: Response) => {
    const crawlId = parseInt(req.params.crawlId);

    // Get crawl to check project ownership
    const crawl = await db.query.crawls.findFirst({
      where: eq(crawls.id, crawlId),
    });

    if (!crawl) {
      throw new AppError("Crawl not found", 404);
    }

    // Verify project belongs to user
    const project = await db.query.projects.findFirst({
      where: and(
        eq(projects.id, crawl.projectId),
        eq(projects.userId, req.user!.id)
      ),
    });

    if (!project) {
      throw new AppError("Unauthorized", 403);
    }

    await crawlerService.deleteCrawl(crawlId);

    res.json({
      message: "Crawl deleted successfully",
    });
  })
);

export default router;
