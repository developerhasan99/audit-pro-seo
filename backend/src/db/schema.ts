import { pgTable, serial, varchar, integer, boolean, timestamp, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 256 }).notNull().unique(),
  password: varchar('password', { length: 512 }).notNull(),
  lang: varchar('lang', { length: 10 }).default('en'),
  theme: varchar('theme', { length: 10 }).default('light'),
  deleting: boolean('deleting').default(false).notNull(),
  created: timestamp('created').defaultNow().notNull(),
});

export const projects = pgTable('projects', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  url: varchar('url', { length: 2048 }).notNull(),
  created: timestamp('created').defaultNow().notNull(),
  ignoreRobotstxt: boolean('ignore_robotstxt').default(false).notNull(),
  followNofollow: boolean('follow_nofollow').default(false).notNull(),
  includeNoindex: boolean('include_noindex').default(false).notNull(),
  crawlSitemap: boolean('crawl_sitemap').default(false).notNull(),
  allowSubdomains: boolean('allow_subdomains').default(false).notNull(),
  deleting: boolean('deleting').default(false).notNull(),
  basicAuth: boolean('basic_auth').default(false).notNull(),
  checkExternalLinks: boolean('check_external_links').default(false).notNull(),
  archive: boolean('archive').default(false).notNull(),
  userAgent: varchar('user_agent', { length: 256 }),
});

export const crawls = pgTable('crawls', {
  id: serial('id').primaryKey(),
  projectId: integer('project_id').notNull().references(() => projects.id, { onDelete: 'cascade' }),
  start: timestamp('start').defaultNow().notNull(),
  end: timestamp('end'),
  totalUrls: integer('total_urls').default(0).notNull(),
  totalIssues: integer('total_issues').default(0).notNull(),
  issuesEnd: timestamp('issues_end'),
  robotstxtExists: boolean('robotstxt_exists').default(false).notNull(),
  sitemapExists: boolean('sitemap_exists').default(false).notNull(),
  sitemapIsBlocked: boolean('sitemap_is_blocked').default(false).notNull(),
  crawled: integer('crawled').default(0).notNull(),
});

export const basicAuth = pgTable('basic_auth', {
  id: serial('id').primaryKey(),
  projectId: integer('project_id').notNull().references(() => projects.id, { onDelete: 'cascade' }),
  authUser: varchar('auth_user', { length: 256 }).notNull(),
  authPass: varchar('auth_pass', { length: 256 }).notNull(),
});

export const pageReports = pgTable('pagereports', {
  id: serial('id').primaryKey(),
  crawlId: integer('crawl_id').notNull().references(() => crawls.id, { onDelete: 'cascade' }),
  url: varchar('url', { length: 2048 }).notNull(),
  scheme: varchar('scheme', { length: 5 }),
  redirectUrl: varchar('redirect_url', { length: 2048 }),
  refresh: varchar('refresh', { length: 2048 }),
  statusCode: integer('status_code').notNull(),
  contentType: varchar('content_type', { length: 100 }),
  mediaType: varchar('media_type', { length: 100 }),
  lang: varchar('lang', { length: 10 }),
  title: varchar('title', { length: 2048 }),
  description: varchar('description', { length: 2048 }),
  robots: varchar('robots', { length: 100 }),
  canonical: varchar('canonical', { length: 2048 }),
  h1: varchar('h1', { length: 1024 }),
  h2: varchar('h2', { length: 1024 }),
  words: integer('words'),
  size: integer('size'),
  urlHash: varchar('url_hash', { length: 256 }).notNull(),
  redirectHash: varchar('redirect_hash', { length: 256 }),
  blockedByRobotstxt: boolean('blocked_by_robotstxt').default(false).notNull(),
  crawled: boolean('crawled').default(false).notNull(),
  inSitemap: boolean('in_sitemap').default(false).notNull(),
  depth: integer('depth'),
  bodyHash: varchar('body_hash', { length: 256 }),
  timeout: boolean('timeout').default(false).notNull(),
  ttfb: integer('ttfb'),
}, (table) => ({
  crawlIdIdx: index('pagereports_crawl_id_idx').on(table.crawlId),
  urlHashIdx: index('pagereports_url_hash_idx').on(table.urlHash),
}));

export const hreflangs = pgTable('hreflangs', {
  id: serial('id').primaryKey(),
  pagereportId: integer('pagereport_id').notNull().references(() => pageReports.id, { onDelete: 'cascade' }),
  crawlId: integer('crawl_id').notNull().references(() => crawls.id, { onDelete: 'cascade' }),
  fromLang: varchar('from_lang', { length: 10 }),
  toUrl: varchar('to_url', { length: 2048 }).notNull(),
  toLang: varchar('to_lang', { length: 10 }),
  fromHash: varchar('from_hash', { length: 256 }).notNull(),
  toHash: varchar('to_hash', { length: 256 }).notNull(),
});

export const images = pgTable('images', {
  id: serial('id').primaryKey(),
  pagereportId: integer('pagereport_id').notNull().references(() => pageReports.id, { onDelete: 'cascade' }),
  crawlId: integer('crawl_id').notNull().references(() => crawls.id, { onDelete: 'cascade' }),
  url: varchar('url', { length: 2048 }).notNull(),
  alt: varchar('alt', { length: 1024 }),
});

export const issueTypes = pgTable('issue_types', {
  id: serial('id').primaryKey(),
  type: varchar('type', { length: 256 }).notNull(),
  priority: integer('priority').notNull(),
});

export const issues = pgTable('issues', {
  id: serial('id').primaryKey(),
  pagereportId: integer('pagereport_id').notNull().references(() => pageReports.id, { onDelete: 'cascade' }),
  crawlId: integer('crawl_id').notNull().references(() => crawls.id, { onDelete: 'cascade' }),
  issueTypeId: integer('issue_type_id').notNull().references(() => issueTypes.id, { onDelete: 'cascade' }),
});

export const links = pgTable('links', {
  id: serial('id').primaryKey(),
  pagereportId: integer('pagereport_id').notNull().references(() => pageReports.id, { onDelete: 'cascade' }),
  crawlId: integer('crawl_id').notNull().references(() => crawls.id, { onDelete: 'cascade' }),
  url: varchar('url', { length: 2048 }).notNull(),
  scheme: varchar('scheme', { length: 5 }).notNull(),
  rel: varchar('rel', { length: 100 }),
  text: varchar('text', { length: 1024 }),
  urlHash: varchar('url_hash', { length: 256 }).notNull(),
  nofollow: boolean('nofollow').default(false).notNull(),
  sponsored: boolean('sponsored').default(false).notNull(),
  ugc: boolean('ugc').default(false).notNull(),
  statusCode: integer('status_code'),
});

export const externalLinks = pgTable('external_links', {
  id: serial('id').primaryKey(),
  pagereportId: integer('pagereport_id').notNull().references(() => pageReports.id, { onDelete: 'cascade' }),
  crawlId: integer('crawl_id').notNull().references(() => crawls.id, { onDelete: 'cascade' }),
  url: varchar('url', { length: 2048 }).notNull(),
  scheme: varchar('scheme', { length: 5 }),
  rel: varchar('rel', { length: 100 }),
  text: varchar('text', { length: 1024 }),
  urlHash: varchar('url_hash', { length: 256 }).notNull(),
  nofollow: boolean('nofollow').default(false).notNull(),
  sponsored: boolean('sponsored').default(false).notNull(),
  ugc: boolean('ugc').default(false).notNull(),
  statusCode: integer('status_code'),
});

export const scripts = pgTable('scripts', {
  id: serial('id').primaryKey(),
  pagereportId: integer('pagereport_id').notNull().references(() => pageReports.id, { onDelete: 'cascade' }),
  crawlId: integer('crawl_id').notNull().references(() => crawls.id, { onDelete: 'cascade' }),
  url: varchar('url', { length: 2048 }).notNull(),
});

export const styles = pgTable('styles', {
  id: serial('id').primaryKey(),
  pagereportId: integer('pagereport_id').notNull().references(() => pageReports.id, { onDelete: 'cascade' }),
  crawlId: integer('crawl_id').notNull().references(() => crawls.id, { onDelete: 'cascade' }),
  url: varchar('url', { length: 2048 }).notNull(),
});

export const videos = pgTable('videos', {
  id: serial('id').primaryKey(),
  pagereportId: integer('pagereport_id').notNull().references(() => pageReports.id, { onDelete: 'cascade' }),
  crawlId: integer('crawl_id').notNull().references(() => crawls.id, { onDelete: 'cascade' }),
  url: varchar('url', { length: 2048 }).notNull(),
  poster: varchar('poster', { length: 2048 }),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  projects: many(projects),
}));

export const projectsRelations = relations(projects, ({ one, many }) => ({
  user: one(users, { fields: [projects.userId], references: [users.id] }),
  crawls: many(crawls),
  basicAuth: many(basicAuth),
}));

export const crawlsRelations = relations(crawls, ({ one, many }) => ({
  project: one(projects, { fields: [crawls.projectId], references: [projects.id] }),
  pageReports: many(pageReports),
  hreflangs: many(hreflangs),
  images: many(images),
  issues: many(issues),
  links: many(links),
  externalLinks: many(externalLinks),
  scripts: many(scripts),
  styles: many(styles),
  videos: many(videos),
}));

export const pageReportsRelations = relations(pageReports, ({ one, many }) => ({
  crawl: one(crawls, { fields: [pageReports.crawlId], references: [crawls.id] }),
  hreflangs: many(hreflangs),
  images: many(images),
  issues: many(issues),
  links: many(links),
  externalLinks: many(externalLinks),
  scripts: many(scripts),
  styles: many(styles),
  videos: many(videos),
}));

export const issueTypesRelations = relations(issueTypes, ({ many }) => ({
  issues: many(issues),
}));

export const issuesRelations = relations(issues, ({ one }) => ({
  pageReport: one(pageReports, { fields: [issues.pagereportId], references: [pageReports.id] }),
  crawl: one(crawls, { fields: [issues.crawlId], references: [crawls.id] }),
  type: one(issueTypes, { fields: [issues.issueTypeId], references: [issueTypes.id] }),
}));

// Inferred types
export type User = typeof users.$inferSelect;
export type Project = typeof projects.$inferSelect;
export type Crawl = typeof crawls.$inferSelect;
export type PageReport = typeof pageReports.$inferSelect;
export type Issue = typeof issues.$inferSelect;
export type IssueType = typeof issueTypes.$inferSelect;
