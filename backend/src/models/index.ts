import User from './User';
import Project from './Project';
import Crawl from './Crawl';
import PageReport from './PageReport';
import { Issue, IssueType } from './Issue';
import { Link, ExternalLink } from './Link';
import Image from './Image';
import Hreflang from './Hreflang';
import Video from './Video';
import BasicAuth from './BasicAuth';
import Script from './Script';
import Style from './Style';

// User <-> Project
User.hasMany(Project, {
  foreignKey: 'userId',
  as: 'projects',
  onDelete: 'CASCADE',
});
Project.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});

// Project <-> Crawl
Project.hasMany(Crawl, {
  foreignKey: 'projectId',
  as: 'crawls',
  onDelete: 'CASCADE',
});
Crawl.belongsTo(Project, {
  foreignKey: 'projectId',
  as: 'project',
});

// Project <-> BasicAuth
Project.hasOne(BasicAuth, {
  foreignKey: 'projectId',
  as: 'basicAuthDetails',
  onDelete: 'CASCADE',
});
BasicAuth.belongsTo(Project, {
  foreignKey: 'projectId',
  as: 'project',
});

// Crawl <-> PageReport
Crawl.hasMany(PageReport, {
  foreignKey: 'crawlId',
  as: 'pageReports',
  onDelete: 'CASCADE',
});
PageReport.belongsTo(Crawl, {
  foreignKey: 'crawlId',
  as: 'crawl',
});

// Crawl <-> Issue
Crawl.hasMany(Issue, {
  foreignKey: 'crawlId',
  as: 'issues',
  onDelete: 'CASCADE',
});
Issue.belongsTo(Crawl, {
  foreignKey: 'crawlId',
  as: 'crawl',
});

// PageReport <-> Issue
PageReport.hasMany(Issue, {
  foreignKey: 'pagereportId',
  as: 'issues',
  onDelete: 'CASCADE',
});
Issue.belongsTo(PageReport, {
  foreignKey: 'pagereportId',
  as: 'pageReport',
});

// Issue <-> IssueType
Issue.belongsTo(IssueType, {
  foreignKey: 'issueTypeId',
  as: 'issueType',
});
IssueType.hasMany(Issue, {
  foreignKey: 'issueTypeId',
  as: 'issues',
});

// PageReport <-> Link
PageReport.hasMany(Link, {
  foreignKey: 'pagereportId',
  as: 'links',
  onDelete: 'CASCADE',
});
Link.belongsTo(PageReport, {
  foreignKey: 'pagereportId',
  as: 'pageReport',
});

// PageReport <-> ExternalLink
PageReport.hasMany(ExternalLink, {
  foreignKey: 'pagereportId',
  as: 'externalLinks',
  onDelete: 'CASCADE',
});
ExternalLink.belongsTo(PageReport, {
  foreignKey: 'pagereportId',
  as: 'pageReport',
});

// PageReport <-> Image
PageReport.hasMany(Image, {
  foreignKey: 'pagereportId',
  as: 'images',
  onDelete: 'CASCADE',
});
Image.belongsTo(PageReport, {
  foreignKey: 'pagereportId',
  as: 'pageReport',
});

// PageReport <-> Hreflang
PageReport.hasMany(Hreflang, {
  foreignKey: 'pagereportId',
  as: 'hreflangs',
  onDelete: 'CASCADE',
});
Hreflang.belongsTo(PageReport, {
  foreignKey: 'pagereportId',
  as: 'pageReport',
});

// PageReport <-> Video
PageReport.hasMany(Video, {
  foreignKey: 'pagereportId',
  as: 'videos',
  onDelete: 'CASCADE',
});
Video.belongsTo(PageReport, {
  foreignKey: 'pagereportId',
  as: 'pageReport',
});

// PageReport <-> Script
PageReport.hasMany(Script, {
  foreignKey: 'pagereportId',
  as: 'scripts',
  onDelete: 'CASCADE',
});
Script.belongsTo(PageReport, {
  foreignKey: 'pagereportId',
  as: 'pageReport',
});

// PageReport <-> Style
PageReport.hasMany(Style, {
  foreignKey: 'pagereportId',
  as: 'styles',
  onDelete: 'CASCADE',
});
Style.belongsTo(PageReport, {
  foreignKey: 'pagereportId',
  as: 'pageReport',
});

// Crawl associations for bulk access
Crawl.hasMany(Link, { foreignKey: 'crawlId', as: 'links', onDelete: 'CASCADE' });
Crawl.hasMany(ExternalLink, { foreignKey: 'crawlId', as: 'externalLinks', onDelete: 'CASCADE' });
Crawl.hasMany(Image, { foreignKey: 'crawlId', as: 'images', onDelete: 'CASCADE' });
Crawl.hasMany(Hreflang, { foreignKey: 'crawlId', as: 'hreflangs', onDelete: 'CASCADE' });
Crawl.hasMany(Video, { foreignKey: 'crawlId', as: 'videos', onDelete: 'CASCADE' });
Crawl.hasMany(Script, { foreignKey: 'crawlId', as: 'scripts', onDelete: 'CASCADE' });
Crawl.hasMany(Style, { foreignKey: 'crawlId', as: 'styles', onDelete: 'CASCADE' });

export {
  User,
  Project,
  Crawl,
  PageReport,
  Issue,
  IssueType,
  Link,
  ExternalLink,
  Image,
  Hreflang,
  Video,
  BasicAuth,
  Script,
  Style,
};

