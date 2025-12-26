import { Router, Request, Response } from 'express';
import { db } from '../db';
import { projects, crawls, pageReports } from '../db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { AppError, asyncHandler } from '../middleware/error.middleware';
import { authMiddleware } from '../middleware/auth.middleware';
import { createObjectCsvStringifier } from 'csv-writer';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

// Export page reports as CSV
router.get('/csv/:projectId', asyncHandler(async (req: Request, res: Response) => {
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
    throw new AppError('No crawl found', 404);
  }

  // Get page reports
  const reports = await db.query.pageReports.findMany({
    where: eq(pageReports.crawlId, latestCrawl.id),
    columns: {
      url: true,
      statusCode: true,
      title: true,
      description: true,
      h1: true,
      words: true,
      size: true,
    },
  });

  // Create CSV
  const csvStringifier = createObjectCsvStringifier({
    header: [
      { id: 'url', title: 'URL' },
      { id: 'statusCode', title: 'Status Code' },
      { id: 'title', title: 'Title' },
      { id: 'description', title: 'Description' },
      { id: 'h1', title: 'H1' },
      { id: 'words', title: 'Words' },
      { id: 'size', title: 'Size' },
    ],
  });

  const records = reports.map(pr => ({
    url: pr.url,
    statusCode: pr.statusCode,
    title: pr.title || '',
    description: pr.description || '',
    h1: pr.h1 || '',
    words: pr.words || 0,
    size: pr.size || 0,
  }));

  const csvContent = csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(records);

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename="${project.url}-crawl.csv"`);
  res.send(csvContent);
}));

// Export sitemap
router.get('/sitemap/:projectId', asyncHandler(async (req: Request, res: Response) => {
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
    throw new AppError('No crawl found', 404);
  }

  // Get successful page reports
  const reports = await db.query.pageReports.findMany({
    where: and(
      eq(pageReports.crawlId, latestCrawl.id),
      eq(pageReports.statusCode, 200)
    ),
    columns: {
      url: true,
    },
  });

  // Generate sitemap XML
  let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
  sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  
  for (const pr of reports) {
    sitemap += '  <url>\n';
    sitemap += `    <loc>${pr.url}</loc>\n`;
    sitemap += '  </url>\n';
  }
  
  sitemap += '</urlset>';

  res.setHeader('Content-Type', 'application/xml');
  res.setHeader('Content-Disposition', `attachment; filename="${project.url}-sitemap.xml"`);
  res.send(sitemap);
}));

// Export resources (images, scripts, etc.)
router.get('/resources/:projectId', asyncHandler(async (req: Request, res: Response) => {
  const projectId = parseInt(req.params.projectId);
  const { type } = req.query; // images, scripts, styles, etc.

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
    throw new AppError('No crawl found', 404);
  }

  // For now, return a simple CSV
  // In full implementation, query the appropriate table based on type
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename="${project.url}-${type}.csv"`);
  res.send('URL\n');
}));

export default router;
