import { GlobalRule } from './Rule';
import { PageReport } from '../../../db/schema';
import { IssueTypes } from '../IssueAnalyzer';

export class DuplicateDescriptionRule extends GlobalRule {
  name = 'Duplicate Description';
  issueTypeId = IssueTypes.ERROR_DUPLICATED_DESCRIPTION;

  check(pageReports: PageReport[]): number[] {
    const descriptions = new Map<string, number[]>();
    const duplicateIds: number[] = [];

    for (const report of pageReports) {
      if (report.description && report.description.trim() !== '' && report.statusCode === 200) {
        const desc = report.description.trim().toLowerCase();
        if (!descriptions.has(desc)) {
          descriptions.set(desc, []);
        }
        descriptions.get(desc)!.push(report.id);
      }
    }

    for (const [_desc, ids] of descriptions.entries()) {
      if (ids.length > 1) {
        duplicateIds.push(...ids);
      }
    }

    return duplicateIds;
  }
}
