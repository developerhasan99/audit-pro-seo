import { Rule } from './Rule';
import PageReport from '../../../models/PageReport';
import { IssueTypes } from '../IssueAnalyzer';

export class LowWordCountRule extends Rule {
  name = 'Low Word Count';
  issueTypeId = IssueTypes.ERROR_LITTLE_CONTENT;

  check(pageReport: PageReport): boolean {
    return !!pageReport.words && pageReport.words < 300;
  }
}

export class MissingLangRule extends Rule {
  name = 'Missing Language';
  issueTypeId = IssueTypes.ERROR_NO_LANG;

  check(pageReport: PageReport): boolean {
    return !pageReport.lang || pageReport.lang.trim() === '';
  }
}
