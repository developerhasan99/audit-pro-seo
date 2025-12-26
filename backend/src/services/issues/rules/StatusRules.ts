import { Rule } from './Rule';
import { PageReport } from '../../../db/schema';
import { IssueTypes } from '../IssueAnalyzer';

export class Status30xRule extends Rule {
  name = '30x Redirect';
  issueTypeId = IssueTypes.ERROR_30X;

  check(pageReport: PageReport): boolean {
    return pageReport.statusCode >= 300 && pageReport.statusCode < 400;
  }
}

export class Status40xRule extends Rule {
  name = '40x Error';
  issueTypeId = IssueTypes.ERROR_40X;

  check(pageReport: PageReport): boolean {
    return pageReport.statusCode >= 400 && pageReport.statusCode < 500;
  }
}

export class Status50xRule extends Rule {
  name = '50x Error';
  issueTypeId = IssueTypes.ERROR_50X;

  check(pageReport: PageReport): boolean {
    return pageReport.statusCode >= 500;
  }
}
