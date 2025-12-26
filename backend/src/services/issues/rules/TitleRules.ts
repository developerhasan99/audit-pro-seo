import { Rule } from './Rule';
import PageReport from '../../../models/PageReport';
import { IssueTypes } from '../IssueAnalyzer';

export class EmptyTitleRule extends Rule {
  name = 'Empty Title';
  issueTypeId = IssueTypes.ERROR_EMPTY_TITLE;

  check(pageReport: PageReport): boolean {
    return !pageReport.title || pageReport.title.trim() === '';
  }
}

export class ShortTitleRule extends Rule {
  name = 'Short Title';
  issueTypeId = IssueTypes.ERROR_SHORT_TITLE;

  check(pageReport: PageReport): boolean {
    return !!pageReport.title && pageReport.title.length > 0 && pageReport.title.length < 30;
  }
}

export class LongTitleRule extends Rule {
  name = 'Long Title';
  issueTypeId = IssueTypes.ERROR_LONG_TITLE;

  check(pageReport: PageReport): boolean {
    return !!pageReport.title && pageReport.title.length > 60;
  }
}
