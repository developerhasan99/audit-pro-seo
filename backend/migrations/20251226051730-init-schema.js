'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Users table
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      email: {
        type: Sequelize.STRING(256),
        allowNull: false,
        defaultValue: '',
      },
      password: {
        type: Sequelize.STRING(512),
        allowNull: false,
        defaultValue: '',
      },
      theme: {
        type: Sequelize.STRING(10),
        allowNull: false,
        defaultValue: 'light',
      },
      lang: {
        type: Sequelize.STRING(10),
        allowNull: true,
      },
    });

    // Issue Types table
    await queryInterface.createTable('issue_types', {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      type: {
        type: Sequelize.STRING(256),
        allowNull: false,
      },
      priority: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
    });

    // Projects table
    await queryInterface.createTable('projects', {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true,
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE',
      },
      url: {
        type: Sequelize.STRING(2048),
        allowNull: false,
        defaultValue: '',
      },
      created: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      ignore_robotstxt: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      follow_nofollow: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      include_noindex: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      crawl_sitemap: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      allow_subdomains: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    });

    // Basic Auth table
    await queryInterface.createTable('basic_auth', {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      project_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: 'projects', key: 'id' },
        onDelete: 'CASCADE',
      },
      auth_user: {
        type: Sequelize.STRING(256),
        allowNull: false,
      },
      auth_pass: {
        type: Sequelize.STRING(256),
        allowNull: false,
      },
    });

    // Crawls table
    await queryInterface.createTable('crawls', {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      project_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: 'projects', key: 'id' },
        onDelete: 'CASCADE',
      },
      start: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      end: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      total_urls: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      total_issues: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      issues_end: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      critical_issues: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      alert_issues: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      warning_issues: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      sitemap_exists: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      sitemap_is_blocked: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      robotstxt_exists: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    });

    // Page Reports table
    await queryInterface.createTable('pagereports', {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      crawl_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: 'crawls', key: 'id' },
        onDelete: 'CASCADE',
      },
      url: {
        type: Sequelize.STRING(2048),
        allowNull: false,
        defaultValue: '',
      },
      scheme: {
        type: Sequelize.STRING(5),
        allowNull: true,
      },
      redirect_url: {
        type: Sequelize.STRING(2048),
        allowNull: true,
      },
      refresh: {
        type: Sequelize.STRING(2048),
        allowNull: true,
      },
      status_code: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      content_type: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      media_type: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      lang: {
        type: Sequelize.STRING(10),
        allowNull: true,
      },
      title: {
        type: Sequelize.STRING(2048),
        allowNull: true,
      },
      description: {
        type: Sequelize.STRING(2048),
        allowNull: true,
      },
      robots: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      canonical: {
        type: Sequelize.STRING(2048),
        allowNull: true,
      },
      h1: {
        type: Sequelize.STRING(1024),
        allowNull: true,
      },
      h2: {
        type: Sequelize.STRING(1024),
        allowNull: true,
      },
      words: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      size: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      url_hash: {
        type: Sequelize.STRING(256),
        allowNull: false,
        defaultValue: '',
      },
      redirect_hash: {
        type: Sequelize.STRING(256),
        allowNull: true,
      },
      blocked_by_robotstxt: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      crawled: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      in_sitemap: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      depth: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      body_hash: {
        type: Sequelize.CHAR(64),
        allowNull: true,
      },
      timeout: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      ttfb: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
    });

    // Issues table
    await queryInterface.createTable('issues', {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      pagereport_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: 'pagereports', key: 'id' },
        onDelete: 'CASCADE',
      },
      crawl_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: 'crawls', key: 'id' },
        onDelete: 'CASCADE',
      },
      issue_type_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: 'issue_types', key: 'id' },
        onDelete: 'CASCADE',
      },
    });

    // External Links table
    await queryInterface.createTable('external_links', {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      pagereport_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: 'pagereports', key: 'id' },
        onDelete: 'CASCADE',
      },
      crawl_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: 'crawls', key: 'id' },
        onDelete: 'CASCADE',
      },
      url: {
        type: Sequelize.STRING(2048),
        allowNull: false,
        defaultValue: '',
      },
      scheme: {
        type: Sequelize.STRING(5),
        allowNull: true,
      },
      url_hash: {
        type: Sequelize.STRING(256),
        allowNull: false,
        defaultValue: '',
      },
      rel: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },

      text: {
        type: Sequelize.STRING(1024),
        allowNull: true,
      },
      nofollow: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      sponsored: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      ugc: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      status_code: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
    });

    // Hreflangs table
    await queryInterface.createTable('hreflangs', {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      pagereport_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: 'pagereports', key: 'id' },
        onDelete: 'CASCADE',
      },
      crawl_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: 'crawls', key: 'id' },
        onDelete: 'CASCADE',
      },
      from_lang: {
        type: Sequelize.STRING(10),
        allowNull: true,
      },
      to_url: {
        type: Sequelize.STRING(2048),
        allowNull: false,
        defaultValue: '',
      },
      to_lang: {
        type: Sequelize.STRING(10),
        allowNull: true,
      },
      from_hash: {
        type: Sequelize.STRING(256),
        allowNull: false,
        defaultValue: '',
      },
      to_hash: {
        type: Sequelize.STRING(256),
        allowNull: false,
        defaultValue: '',
      },
    });

    // Images table
    await queryInterface.createTable('images', {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      pagereport_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: 'pagereports', key: 'id' },
        onDelete: 'CASCADE',
      },
      crawl_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true,
        references: { model: 'crawls', key: 'id' },
        onDelete: 'CASCADE',
      },
      url: {
        type: Sequelize.STRING(2048),
        allowNull: false,
        defaultValue: '',
      },
      alt: {
        type: Sequelize.STRING(1024),
        allowNull: true,
      },
    });

    // Links table
    await queryInterface.createTable('links', {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      pagereport_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: 'pagereports', key: 'id' },
        onDelete: 'CASCADE',
      },
      crawl_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: 'crawls', key: 'id' },
        onDelete: 'CASCADE',
      },
      url: {
        type: Sequelize.STRING(2048),
        allowNull: false,
        defaultValue: '',
      },
      scheme: {
        type: Sequelize.STRING(5),
        allowNull: false,
      },
      rel: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      text: {
        type: Sequelize.STRING(1024),
        allowNull: true,
      },
      url_hash: {
        type: Sequelize.STRING(256),
        allowNull: false,
        defaultValue: '',
      },
      nofollow: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      sponsored: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      ugc: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      status_code: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
    });

    // Scripts table
    await queryInterface.createTable('scripts', {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      pagereport_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: 'pagereports', key: 'id' },
        onDelete: 'CASCADE',
      },
      crawl_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: 'crawls', key: 'id' },
        onDelete: 'CASCADE',
      },
      url: {
        type: Sequelize.STRING(2048),
        allowNull: false,
        defaultValue: '',
      },
    });

    // Styles table
    await queryInterface.createTable('styles', {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      pagereport_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: 'pagereports', key: 'id' },
        onDelete: 'CASCADE',
      },
      crawl_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true,
        references: { model: 'crawls', key: 'id' },
        onDelete: 'CASCADE',
      },
      url: {
        type: Sequelize.STRING(2048),
        allowNull: false,
        defaultValue: '',
      },
    });

    // Videos table
    await queryInterface.createTable('videos', {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      pagereport_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: 'pagereports', key: 'id' },
        onDelete: 'CASCADE',
      },
      crawl_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: 'crawls', key: 'id' },
        onDelete: 'CASCADE',
      },
      url: {
        type: Sequelize.STRING(2048),
        allowNull: false,
        defaultValue: '',
      },
      poster: {
        type: Sequelize.STRING(2048),
        allowNull: true,
      },
    });

    // Seed issue types
    const issueTypes = [
      { id: 1, type: 'ERROR_30x', priority: 1 },
      { id: 2, type: 'ERROR_40x', priority: 1 },
      { id: 3, type: 'ERROR_50x', priority: 1 },
      { id: 4, type: 'ERROR_DUPLICATED_TITLE', priority: 2 },
      { id: 5, type: 'ERROR_DUPLICATED_DESCRIPTION', priority: 2 },
      { id: 6, type: 'ERROR_EMPTY_TITLE', priority: 2 },
      { id: 7, type: 'ERROR_SHORT_TITLE', priority: 2 },
      { id: 8, type: 'ERROR_LONG_TITLE', priority: 2 },
      { id: 9, type: 'ERROR_EMPTY_DESCRIPTION', priority: 2 },
      { id: 10, type: 'ERROR_SHORT_DESCRIPTION', priority: 2 },
      { id: 11, type: 'ERROR_LONG_DESCRIPTION', priority: 2 },
      { id: 12, type: 'ERROR_LITTLE_CONTENT', priority: 3 },
      { id: 13, type: 'ERROR_IMAGES_NO_ALT', priority: 2 },
      { id: 14, type: 'ERROR_REDIRECT_CHAIN', priority: 1 },
      { id: 15, type: 'ERROR_NO_H1', priority: 2 },
      { id: 16, type: 'ERROR_NO_LANG', priority: 3 },
      { id: 17, type: 'ERROR_HTTP_LINKS', priority: 2 },
      { id: 18, type: 'ERROR_HREFLANG_RETURN', priority: 2 },
      { id: 19, type: 'ERROR_TOO_MANY_LINKS', priority: 3 },
      { id: 20, type: 'ERROR_INTERNAL_NOFOLLOW', priority: 3 },
      { id: 21, type: 'ERROR_EXTERNAL_WITHOUT_NOFOLLOW', priority: 3 },
      { id: 22, type: 'ERROR_CANONICALIZED_NON_CANONICAL', priority: 2 },
      { id: 23, type: 'ERROR_REDIRECT_LOOP', priority: 1 },
      { id: 24, type: 'ERROR_NOT_VALID_HEADINGS', priority: 2 },
      { id: 25, type: 'ERROR_HREFLANG_TO_NON_CANONICAL', priority: 2 },
      { id: 59, type: 'ERROR_DUPLICATED_CONTENT', priority: 2 },
      { id: 68, type: 'ERROR_MULTIPLE_SLASHES', priority: 2 },
      { id: 74, type: 'ERROR_INCORRECT_MEDIA_TYPE', priority: 3 },
      { id: 79, type: 'ERROR_LOCALHOST_LINKS', priority: 2 },
    ];
    await queryInterface.bulkInsert('issue_types', issueTypes);

    // Add indexes
    await queryInterface.addIndex('projects', ['user_id']);
    await queryInterface.addIndex('crawls', ['project_id']);
    await queryInterface.addIndex('pagereports', ['crawl_id']);
    await queryInterface.addIndex('pagereports', ['url_hash']);
    await queryInterface.addIndex('pagereports', ['body_hash']);
    await queryInterface.addIndex('issues', ['crawl_id']);
    await queryInterface.addIndex('issues', ['pagereport_id']);
    await queryInterface.addIndex('issues', ['issue_type_id']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('videos');
    await queryInterface.dropTable('styles');
    await queryInterface.dropTable('scripts');
    await queryInterface.dropTable('links');
    await queryInterface.dropTable('images');
    await queryInterface.dropTable('hreflangs');
    await queryInterface.dropTable('external_links');
    await queryInterface.dropTable('issues');
    await queryInterface.dropTable('pagereports');
    await queryInterface.dropTable('crawls');
    await queryInterface.dropTable('basic_auth');
    await queryInterface.dropTable('projects');
    await queryInterface.dropTable('issue_types');
    await queryInterface.dropTable('users');
  },
};

