ALTER TABLE "external_links" ALTER COLUMN "scheme" SET DATA TYPE varchar(20);--> statement-breakpoint
ALTER TABLE "links" ALTER COLUMN "scheme" SET DATA TYPE varchar(20);--> statement-breakpoint
ALTER TABLE "pagereports" ALTER COLUMN "scheme" SET DATA TYPE varchar(20);