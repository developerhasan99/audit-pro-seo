import { Router, Request, Response } from 'express';
import { db } from '../db';
import { projects, crawls } from '../db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { AppError, asyncHandler } from '../middleware/error.middleware';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

// Get all projects for current user
router.get('/', asyncHandler(async (req: Request, res: Response) => {
  const userProjects = await db.query.projects.findMany({
    where: eq(projects.userId, req.user!.id),
    with: {
      crawls: {
        limit: 1,
        orderBy: [desc(crawls.start)],
      },
    },
    orderBy: [desc(projects.created)],
  });

  res.json({ projects: userProjects });
}));

// Get single project
router.get('/:id', asyncHandler(async (req: Request, res: Response) => {
  const projectId = parseInt(req.params.id);
  
  const project = await db.query.projects.findFirst({
    where: and(
      eq(projects.id, projectId),
      eq(projects.userId, req.user!.id)
    ),
    with: {
      crawls: {
        orderBy: [desc(crawls.start)],
      },
    },
  });

  if (!project) {
    throw new AppError('Project not found', 404);
  }

  res.json({ project });
}));

// Create project
router.post('/', asyncHandler(async (req: Request, res: Response) => {
  const {
    url,
    ignoreRobotstxt,
    followNofollow,
    includeNoindex,
    crawlSitemap,
    allowSubdomains,
    basicAuth,
    checkExternalLinks,
    archive,
    userAgent,
  } = req.body;

  if (!url) {
    throw new AppError('URL is required', 400);
  }

  const [newProject] = await db.insert(projects).values({
    userId: req.user!.id,
    url,
    ignoreRobotstxt: ignoreRobotstxt ?? false,
    followNofollow: followNofollow ?? false,
    includeNoindex: includeNoindex ?? false,
    crawlSitemap: crawlSitemap ?? false,
    allowSubdomains: allowSubdomains ?? false,
    basicAuth: basicAuth ?? false,
    checkExternalLinks: checkExternalLinks ?? false,
    archive: archive ?? false,
    userAgent: userAgent ?? null,
  }).returning();

  res.status(201).json({
    message: 'Project created successfully',
    project: newProject,
  });
}));

// Update project
router.put('/:id', asyncHandler(async (req: Request, res: Response) => {
  const projectId = parseInt(req.params.id);

  const {
    url,
    ignoreRobotstxt,
    followNofollow,
    includeNoindex,
    crawlSitemap,
    allowSubdomains,
    basicAuth,
    checkExternalLinks,
    archive,
    userAgent,
  } = req.body;

  const [updatedProject] = await db.update(projects)
    .set({
      ...(url && { url }),
      ...(ignoreRobotstxt !== undefined && { ignoreRobotstxt }),
      ...(followNofollow !== undefined && { followNofollow }),
      ...(includeNoindex !== undefined && { includeNoindex }),
      ...(crawlSitemap !== undefined && { crawlSitemap }),
      ...(allowSubdomains !== undefined && { allowSubdomains }),
      ...(basicAuth !== undefined && { basicAuth }),
      ...(checkExternalLinks !== undefined && { checkExternalLinks }),
      ...(archive !== undefined && { archive }),
      ...(userAgent !== undefined && { userAgent }),
    })
    .where(and(
      eq(projects.id, projectId),
      eq(projects.userId, req.user!.id)
    ))
    .returning();

  if (!updatedProject) {
    throw new AppError('Project not found', 404);
  }

  res.json({
    message: 'Project updated successfully',
    project: updatedProject,
  });
}));

// Delete project
router.delete('/:id', asyncHandler(async (req: Request, res: Response) => {
  const projectId = parseInt(req.params.id);

  const [deletedProject] = await db.delete(projects)
    .where(and(
      eq(projects.id, projectId),
      eq(projects.userId, req.user!.id)
    ))
    .returning();

  if (!deletedProject) {
    throw new AppError('Project not found', 404);
  }

  res.json({ message: 'Project deleted successfully' });
}));

export default router;
