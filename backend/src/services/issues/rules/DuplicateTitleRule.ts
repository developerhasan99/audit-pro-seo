import { GlobalRule } from './Rule';
import PageReport from '../../../models/PageReport';
import { IssueTypes } from '../IssueAnalyzer';

export class DuplicateTitleRule extends GlobalRule {
  name = 'Duplicate Title';
  issueTypeId = IssueTypes.ERROR_DUPLICATED_TITLE;

  check(pageReports: PageReport[]): number[] {
    const titles = new Map<string, number[]>();
    const duplicateIds: number[] = [];

    for (const report of pageReports) {
      if (report.title && report.title.trim() !== '' && report.statusCode === 200) {
        const title = report.title.trim().toLowerCase();
        if (!titles.has(title)) {
          titles.set(title, []);
        }
        titles.get(title)!.push(report.id);
      }
    }

    for (const [_title, ids] of titles.entries()) {
      if (ids.length > 1) {
        duplicateIds.push(...ids);
      }
    }

    return duplicateIds;
  }
}
