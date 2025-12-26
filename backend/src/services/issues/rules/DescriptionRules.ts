import { Rule } from './Rule';
import { PageReport } from '../../../db/schema';
import { IssueTypes } from '../IssueAnalyzer';

export class EmptyDescriptionRule extends Rule {
  name = 'Empty Description';
  issueTypeId = IssueTypes.ERROR_EMPTY_DESCRIPTION;

  check(pageReport: PageReport): boolean {
    return !pageReport.description || pageReport.description.trim() === '';
  }
}

export class ShortDescriptionRule extends Rule {
  name = 'Short Description';
  issueTypeId = IssueTypes.ERROR_SHORT_DESCRIPTION;

  check(pageReport: PageReport): boolean {
    return !!pageReport.description && pageReport.description.length > 0 && pageReport.description.length < 70;
  }
}

export class LongDescriptionRule extends Rule {
  name = 'Long Description';
  issueTypeId = IssueTypes.ERROR_LONG_DESCRIPTION;

  check(pageReport: PageReport): boolean {
    return !!pageReport.description && pageReport.description.length > 160;
  }
}
