import { Rule } from './Rule';
import { PageReport } from '../../../db/schema';
import { IssueTypes } from '../IssueAnalyzer';

export class TooManyLinksRule extends Rule {
  name = 'Too Many Links';
  issueTypeId = IssueTypes.ERROR_TOO_MANY_LINKS;

  check(_pageReport: PageReport): boolean {
    // We need to count links from the parsed page
    // For now we'll use a threshold if it's stored in the report
    // In our case we might need to count them in the analyzer
    return false;
  }
}

export class HTTPLinksRule extends Rule {
  name = 'HTTP Links on HTTPS Page';
  issueTypeId = IssueTypes.ERROR_HTTP_LINKS;

  check(_pageReport: PageReport): boolean {
    // This requires checking the links array
    return false;
  }
}

