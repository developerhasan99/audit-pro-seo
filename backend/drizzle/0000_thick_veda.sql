CREATE TABLE "basic_auth" (
	"id" serial PRIMARY KEY NOT NULL,
	"project_id" integer NOT NULL,
	"auth_user" varchar(256) NOT NULL,
	"auth_pass" varchar(256) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "crawls" (
	"id" serial PRIMARY KEY NOT NULL,
	"project_id" integer NOT NULL,
	"start" timestamp DEFAULT now() NOT NULL,
	"end" timestamp,
	"total_urls" integer DEFAULT 0 NOT NULL,
	"total_issues" integer DEFAULT 0 NOT NULL,
	"issues_end" timestamp,
	"robotstxt_exists" boolean DEFAULT false NOT NULL,
	"sitemap_exists" boolean DEFAULT false NOT NULL,
	"sitemap_is_blocked" boolean DEFAULT false NOT NULL,
	"crawled" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "external_links" (
	"id" serial PRIMARY KEY NOT NULL,
	"pagereport_id" integer NOT NULL,
	"crawl_id" integer NOT NULL,
	"url" varchar(2048) NOT NULL,
	"scheme" varchar(5),
	"rel" varchar(100),
	"text" varchar(1024),
	"url_hash" varchar(256) NOT NULL,
	"nofollow" boolean DEFAULT false NOT NULL,
	"sponsored" boolean DEFAULT false NOT NULL,
	"ugc" boolean DEFAULT false NOT NULL,
	"status_code" integer
);
--> statement-breakpoint
CREATE TABLE "hreflangs" (
	"id" serial PRIMARY KEY NOT NULL,
	"pagereport_id" integer NOT NULL,
	"crawl_id" integer NOT NULL,
	"from_lang" varchar(10),
	"to_url" varchar(2048) NOT NULL,
	"to_lang" varchar(10),
	"from_hash" varchar(256) NOT NULL,
	"to_hash" varchar(256) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "images" (
	"id" serial PRIMARY KEY NOT NULL,
	"pagereport_id" integer NOT NULL,
	"crawl_id" integer NOT NULL,
	"url" varchar(2048) NOT NULL,
	"alt" varchar(1024)
);
--> statement-breakpoint
CREATE TABLE "issue_types" (
	"id" serial PRIMARY KEY NOT NULL,
	"type" varchar(256) NOT NULL,
	"priority" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "issues" (
	"id" serial PRIMARY KEY NOT NULL,
	"pagereport_id" integer NOT NULL,
	"crawl_id" integer NOT NULL,
	"issue_type_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "links" (
	"id" serial PRIMARY KEY NOT NULL,
	"pagereport_id" integer NOT NULL,
	"crawl_id" integer NOT NULL,
	"url" varchar(2048) NOT NULL,
	"scheme" varchar(5) NOT NULL,
	"rel" varchar(100),
	"text" varchar(1024),
	"url_hash" varchar(256) NOT NULL,
	"nofollow" boolean DEFAULT false NOT NULL,
	"sponsored" boolean DEFAULT false NOT NULL,
	"ugc" boolean DEFAULT false NOT NULL,
	"status_code" integer
);
--> statement-breakpoint
CREATE TABLE "pagereports" (
	"id" serial PRIMARY KEY NOT NULL,
	"crawl_id" integer NOT NULL,
	"url" varchar(2048) NOT NULL,
	"scheme" varchar(5),
	"redirect_url" varchar(2048),
	"refresh" varchar(2048),
	"status_code" integer NOT NULL,
	"content_type" varchar(100),
	"media_type" varchar(100),
	"lang" varchar(10),
	"title" varchar(2048),
	"description" varchar(2048),
	"robots" varchar(100),
	"canonical" varchar(2048),
	"h1" varchar(1024),
	"h2" varchar(1024),
	"words" integer,
	"size" integer,
	"url_hash" varchar(256) NOT NULL,
	"redirect_hash" varchar(256),
	"blocked_by_robotstxt" boolean DEFAULT false NOT NULL,
	"crawled" boolean DEFAULT false NOT NULL,
	"in_sitemap" boolean DEFAULT false NOT NULL,
	"depth" integer,
	"body_hash" varchar(256),
	"timeout" boolean DEFAULT false NOT NULL,
	"ttfb" integer
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"url" varchar(2048) NOT NULL,
	"created" timestamp DEFAULT now() NOT NULL,
	"ignore_robotstxt" boolean DEFAULT false NOT NULL,
	"follow_nofollow" boolean DEFAULT false NOT NULL,
	"include_noindex" boolean DEFAULT false NOT NULL,
	"crawl_sitemap" boolean DEFAULT false NOT NULL,
	"allow_subdomains" boolean DEFAULT false NOT NULL,
	"deleting" boolean DEFAULT false NOT NULL,
	"basic_auth" boolean DEFAULT false NOT NULL,
	"check_external_links" boolean DEFAULT false NOT NULL,
	"archive" boolean DEFAULT false NOT NULL,
	"user_agent" varchar(256)
);
--> statement-breakpoint
CREATE TABLE "scripts" (
	"id" serial PRIMARY KEY NOT NULL,
	"pagereport_id" integer NOT NULL,
	"crawl_id" integer NOT NULL,
	"url" varchar(2048) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "styles" (
	"id" serial PRIMARY KEY NOT NULL,
	"pagereport_id" integer NOT NULL,
	"crawl_id" integer NOT NULL,
	"url" varchar(2048) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(256) NOT NULL,
	"password" varchar(512) NOT NULL,
	"lang" varchar(10) DEFAULT 'en',
	"theme" varchar(10) DEFAULT 'light',
	"deleting" boolean DEFAULT false NOT NULL,
	"created" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "videos" (
	"id" serial PRIMARY KEY NOT NULL,
	"pagereport_id" integer NOT NULL,
	"crawl_id" integer NOT NULL,
	"url" varchar(2048) NOT NULL,
	"poster" varchar(2048)
);
--> statement-breakpoint
ALTER TABLE "basic_auth" ADD CONSTRAINT "basic_auth_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "crawls" ADD CONSTRAINT "crawls_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "external_links" ADD CONSTRAINT "external_links_pagereport_id_pagereports_id_fk" FOREIGN KEY ("pagereport_id") REFERENCES "public"."pagereports"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "external_links" ADD CONSTRAINT "external_links_crawl_id_crawls_id_fk" FOREIGN KEY ("crawl_id") REFERENCES "public"."crawls"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hreflangs" ADD CONSTRAINT "hreflangs_pagereport_id_pagereports_id_fk" FOREIGN KEY ("pagereport_id") REFERENCES "public"."pagereports"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hreflangs" ADD CONSTRAINT "hreflangs_crawl_id_crawls_id_fk" FOREIGN KEY ("crawl_id") REFERENCES "public"."crawls"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "images" ADD CONSTRAINT "images_pagereport_id_pagereports_id_fk" FOREIGN KEY ("pagereport_id") REFERENCES "public"."pagereports"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "images" ADD CONSTRAINT "images_crawl_id_crawls_id_fk" FOREIGN KEY ("crawl_id") REFERENCES "public"."crawls"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "issues" ADD CONSTRAINT "issues_pagereport_id_pagereports_id_fk" FOREIGN KEY ("pagereport_id") REFERENCES "public"."pagereports"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "issues" ADD CONSTRAINT "issues_crawl_id_crawls_id_fk" FOREIGN KEY ("crawl_id") REFERENCES "public"."crawls"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "issues" ADD CONSTRAINT "issues_issue_type_id_issue_types_id_fk" FOREIGN KEY ("issue_type_id") REFERENCES "public"."issue_types"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "links" ADD CONSTRAINT "links_pagereport_id_pagereports_id_fk" FOREIGN KEY ("pagereport_id") REFERENCES "public"."pagereports"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "links" ADD CONSTRAINT "links_crawl_id_crawls_id_fk" FOREIGN KEY ("crawl_id") REFERENCES "public"."crawls"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pagereports" ADD CONSTRAINT "pagereports_crawl_id_crawls_id_fk" FOREIGN KEY ("crawl_id") REFERENCES "public"."crawls"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scripts" ADD CONSTRAINT "scripts_pagereport_id_pagereports_id_fk" FOREIGN KEY ("pagereport_id") REFERENCES "public"."pagereports"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scripts" ADD CONSTRAINT "scripts_crawl_id_crawls_id_fk" FOREIGN KEY ("crawl_id") REFERENCES "public"."crawls"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "styles" ADD CONSTRAINT "styles_pagereport_id_pagereports_id_fk" FOREIGN KEY ("pagereport_id") REFERENCES "public"."pagereports"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "styles" ADD CONSTRAINT "styles_crawl_id_crawls_id_fk" FOREIGN KEY ("crawl_id") REFERENCES "public"."crawls"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "videos" ADD CONSTRAINT "videos_pagereport_id_pagereports_id_fk" FOREIGN KEY ("pagereport_id") REFERENCES "public"."pagereports"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "videos" ADD CONSTRAINT "videos_crawl_id_crawls_id_fk" FOREIGN KEY ("crawl_id") REFERENCES "public"."crawls"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "pagereports_crawl_id_idx" ON "pagereports" USING btree ("crawl_id");--> statement-breakpoint
CREATE INDEX "pagereports_url_hash_idx" ON "pagereports" USING btree ("url_hash");