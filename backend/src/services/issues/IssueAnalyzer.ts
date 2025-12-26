import { db } from '../../db';
import { pageReports, issues, PageReport } from '../../db/schema';
import { eq, and } from 'drizzle-orm';
import { Rule, GlobalRule } from './rules/Rule';
import { Status30xRule, Status40xRule, Status50xRule } from './rules/StatusRules';
import { EmptyTitleRule, ShortTitleRule, LongTitleRule } from './rules/TitleRules';
import { EmptyDescriptionRule, ShortDescriptionRule, LongDescriptionRule } from './rules/DescriptionRules';
import { NoH1Rule } from './rules/HeaderRules';
import { LowWordCountRule, MissingLangRule } from './rules/ContentRules';
import { DuplicateTitleRule } from './rules/DuplicateTitleRule';
import { DuplicateDescriptionRule } from './rules/DuplicateDescriptionRule';
import { DuplicateContentRule } from './rules/DuplicateContentRule';

// Issue type IDs from the database
export const IssueTypes = {
  ERROR_30X: 1,
  ERROR_40X: 2,
  ERROR_50X: 3,
  ERROR_DUPLICATED_TITLE: 4,
  ERROR_DUPLICATED_DESCRIPTION: 5,
  ERROR_EMPTY_TITLE: 6,
  ERROR_SHORT_TITLE: 7,
  ERROR_LONG_TITLE: 8,
  ERROR_EMPTY_DESCRIPTION: 9,
  ERROR_SHORT_DESCRIPTION: 10,
  ERROR_LONG_DESCRIPTION: 11,
  ERROR_LITTLE_CONTENT: 12,
  ERROR_IMAGES_NO_ALT: 13,
  ERROR_REDIRECT_CHAIN: 14,
  ERROR_NO_H1: 15,
  ERROR_NO_LANG: 16,
  ERROR_HTTP_LINKS: 17,
  ERROR_HREFLANG_RETURN: 18,
  ERROR_TOO_MANY_LINKS: 19,
  ERROR_INTERNAL_NOFOLLOW: 20,
  ERROR_EXTERNAL_WITHOUT_NOFOLLOW: 21,
  ERROR_CANONICALIZED_NON_CANONICAL: 22,
  ERROR_REDIRECT_LOOP: 23,
  ERROR_NOT_VALID_HEADINGS: 24,
  ERROR_DUPLICATED_CONTENT: 59,
  ERROR_MULTIPLE_SLASHES: 68,
  ERROR_INCORRECT_MEDIA_TYPE: 74,
  ERROR_LOCALHOST_LINKS: 79,
  ERROR_MULTIPLE_H1: 77,
} as const;


export class IssueAnalyzer {
  private rules: Rule[] = [
    new Status30xRule(),
    new Status40xRule(),
    new Status50xRule(),
    new EmptyTitleRule(),
    new ShortTitleRule(),
    new LongTitleRule(),
    new EmptyDescriptionRule(),
    new ShortDescriptionRule(),
    new LongDescriptionRule(),
    new NoH1Rule(),
    new LowWordCountRule(),
    new MissingLangRule(),
  ];

  private globalRules: GlobalRule[] = [
    new DuplicateTitleRule(),
    new DuplicateDescriptionRule(),
    new DuplicateContentRule(),
  ];

  analyze(pageReport: PageReport): number[] {
    const issuesFound: number[] = [];

    for (const rule of this.rules) {
      const result = rule.run(pageReport);
      if (result) {
        issuesFound.push(result.issueTypeId);
      }
    }

    return issuesFound;
  }

  // Analyze issues that require comparing multiple pages
  async analyzeGlobalIssues(crawlId: number): Promise<void> {
    const reports = await db.query.pageReports.findMany({
      where: eq(pageReports.crawlId, crawlId),
    });

    for (const globalRule of this.globalRules) {
      const duplicateIds = globalRule.check(reports as any[]);
      
      for (const reportId of duplicateIds) {
        // Only add if not already present
        const exists = await db.query.issues.findFirst({
          where: and(
            eq(issues.pagereportId, reportId),
            eq(issues.crawlId, crawlId),
            eq(issues.issueTypeId, globalRule.issueTypeId)
          ),
        });

        if (!exists) {
          await db.insert(issues).values({
            pagereportId: reportId,
            crawlId,
            issueTypeId: globalRule.issueTypeId,
          });
        }
      }
    }
  }
}

