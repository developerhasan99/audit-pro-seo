import { Rule } from './Rule';
import { PageReport } from '../../../db/schema';
import { IssueTypes } from '../IssueAnalyzer';

export class NoH1Rule extends Rule {
  name = 'No H1';
  issueTypeId = IssueTypes.ERROR_NO_H1;

  check(pageReport: PageReport): boolean {
    return !pageReport.h1 || pageReport.h1.trim() === '';
  }
}

export class MultipleH1Rule extends Rule {
  name = 'Multiple H1';
  issueTypeId = 77; // ERROR_MULTIPLE_H1 (will add to IssueTypes)

  check(_pageReport: PageReport): boolean {
    // This requires the parser to store a list of H1s or a flag
    // For now we'll skip this as the schema only has one H1 field
    return false;
  }
}
