import { Router, Request, Response } from 'express';
import { Project, Crawl } from '../models';
import { AppError, asyncHandler } from '../middleware/error.middleware';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

// Get all projects for current user
router.get('/', asyncHandler(async (req: Request, res: Response) => {
  const projects = await Project.findAll({
    where: { userId: req.user!.id },
    include: [
      {
        model: Crawl,
        as: 'crawls',
        limit: 1,
        order: [['start', 'DESC']],
      },
    ],
    order: [['created', 'DESC']],
  });

  res.json({ projects });
}));

// Get single project
router.get('/:id', asyncHandler(async (req: Request, res: Response) => {
  const project = await Project.findOne({
    where: {
      id: req.params.id,
      userId: req.user!.id,
    },
    include: [
      {
        model: Crawl,
        as: 'crawls',
        order: [['start', 'DESC']],
      },
    ],
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

  const project = await Project.create({
    userId: req.user!.id,
    url,
    ignoreRobotstxt: ignoreRobotstxt || false,
    followNofollow: followNofollow || false,
    includeNoindex: includeNoindex || false,
    crawlSitemap: crawlSitemap || false,
    allowSubdomains: allowSubdomains || false,
    basicAuth: basicAuth || false,
    checkExternalLinks: checkExternalLinks || false,
    archive: archive || false,
    userAgent: userAgent || null,
  });

  res.status(201).json({
    message: 'Project created successfully',
    project,
  });
}));

// Update project
router.put('/:id', asyncHandler(async (req: Request, res: Response) => {
  const project = await Project.findOne({
    where: {
      id: req.params.id,
      userId: req.user!.id,
    },
  });

  if (!project) {
    throw new AppError('Project not found', 404);
  }

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

  if (url) project.url = url;
  if (ignoreRobotstxt !== undefined) project.ignoreRobotstxt = ignoreRobotstxt;
  if (followNofollow !== undefined) project.followNofollow = followNofollow;
  if (includeNoindex !== undefined) project.includeNoindex = includeNoindex;
  if (crawlSitemap !== undefined) project.crawlSitemap = crawlSitemap;
  if (allowSubdomains !== undefined) project.allowSubdomains = allowSubdomains;
  if (basicAuth !== undefined) project.basicAuth = basicAuth;
  if (checkExternalLinks !== undefined) project.checkExternalLinks = checkExternalLinks;
  if (archive !== undefined) project.archive = archive;
  if (userAgent !== undefined) project.userAgent = userAgent;

  await project.save();

  res.json({
    message: 'Project updated successfully',
    project,
  });
}));

// Delete project
router.delete('/:id', asyncHandler(async (req: Request, res: Response) => {
  const project = await Project.findOne({
    where: {
      id: req.params.id,
      userId: req.user!.id,
    },
  });

  if (!project) {
    throw new AppError('Project not found', 404);
  }

  // Mark as deleting (soft delete)
  project.deleting = true;
  await project.save();

  // Or hard delete:
  // await project.destroy();

  res.json({ message: 'Project deletion initiated' });
}));

export default router;
