import PageReport from '../../../models/PageReport';

export interface RuleResult {
  issueTypeId: number;
}

export abstract class Rule {
  abstract name: string;
  abstract issueTypeId: number;

  abstract check(pageReport: PageReport): boolean;

  run(pageReport: PageReport): RuleResult | null {
    if (this.check(pageReport)) {
      return { issueTypeId: this.issueTypeId };
    }
    return null;
  }
}

export abstract class GlobalRule {
  abstract name: string;
  abstract issueTypeId: number;

  abstract check(pageReports: PageReport[]): number[]; // Returns array of PageReport IDs
}
