import { GlobalRule } from './Rule';
import PageReport from '../../../models/PageReport';

export class DuplicateContentRule extends GlobalRule {
  name = 'Duplicate Content';
  issueTypeId = 59; // ERROR_DUPLICATED_CONTENT

  check(pageReports: PageReport[]): number[] {
    const hashes = new Map<string, number[]>();
    const duplicateIds: number[] = [];

    for (const report of pageReports) {
      if (report.bodyHash && report.statusCode === 200) {
        if (!hashes.has(report.bodyHash)) {
          hashes.set(report.bodyHash, []);
        }
        hashes.get(report.bodyHash)!.push(report.id);
      }
    }

    for (const [_hash, ids] of hashes.entries()) {
      if (ids.length > 1) {
        duplicateIds.push(...ids);
      }
    }

    return duplicateIds;
  }
}
