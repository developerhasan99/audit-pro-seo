import { db } from './index';
import { issueTypes } from './schema';
import { IssueTypes as IssueTypesList } from '../services/issues/IssueAnalyzer';

async function seed() {
  console.log('🌱 Seeding issue types...');

  const data = [
    { id: IssueTypesList.ERROR_30X, type: '30x Redirect', priority: 1 },
    { id: IssueTypesList.ERROR_40X, type: '40x Error', priority: 3 },
    { id: IssueTypesList.ERROR_50X, type: '50x Error', priority: 3 },
    { id: IssueTypesList.ERROR_DUPLICATED_TITLE, type: 'Duplicate Title', priority: 2 },
    { id: IssueTypesList.ERROR_DUPLICATED_DESCRIPTION, type: 'Duplicate Description', priority: 1 },
    { id: IssueTypesList.ERROR_EMPTY_TITLE, type: 'Empty Title', priority: 3 },
    { id: IssueTypesList.ERROR_SHORT_TITLE, type: 'Short Title', priority: 1 },
    { id: IssueTypesList.ERROR_LONG_TITLE, type: 'Long Title', priority: 1 },
    { id: IssueTypesList.ERROR_EMPTY_DESCRIPTION, type: 'Empty Description', priority: 2 },
    { id: IssueTypesList.ERROR_SHORT_DESCRIPTION, type: 'Short Description', priority: 1 },
    { id: IssueTypesList.ERROR_LONG_DESCRIPTION, type: 'Long Description', priority: 1 },
    { id: IssueTypesList.ERROR_LITTLE_CONTENT, type: 'Low Word Count', priority: 2 },
    { id: IssueTypesList.ERROR_IMAGES_NO_ALT, type: 'Images Missing Alt Text', priority: 1 },
    { id: IssueTypesList.ERROR_REDIRECT_CHAIN, type: 'Redirect Chain', priority: 2 },
    { id: IssueTypesList.ERROR_NO_H1, type: 'Missing H1 Tag', priority: 2 },
    { id: IssueTypesList.ERROR_NO_LANG, type: 'Missing Language Attribute', priority: 1 },
    { id: IssueTypesList.ERROR_HTTP_LINKS, type: 'HTTP Links on HTTPS Page', priority: 2 },
    { id: IssueTypesList.ERROR_HREFLANG_RETURN, type: 'Missing Hreflang Return Tags', priority: 2 },
    { id: IssueTypesList.ERROR_TOO_MANY_LINKS, type: 'Too Many Links', priority: 1 },
    { id: IssueTypesList.ERROR_INTERNAL_NOFOLLOW, type: 'Internal No-follow Links', priority: 1 },
    { id: IssueTypesList.ERROR_EXTERNAL_WITHOUT_NOFOLLOW, type: 'External Links without No-follow', priority: 1 },
    { id: IssueTypesList.ERROR_CANONICALIZED_NON_CANONICAL, type: 'Canonical URL is not Canonical', priority: 2 },
    { id: IssueTypesList.ERROR_REDIRECT_LOOP, type: 'Redirect Loop', priority: 3 },
    { id: IssueTypesList.ERROR_NOT_VALID_HEADINGS, type: 'Invalid Heading Structure', priority: 1 },
    { id: IssueTypesList.ERROR_DUPLICATED_CONTENT, type: 'Duplicate Content', priority: 2 },
    { id: IssueTypesList.ERROR_MULTIPLE_SLASHES, type: 'Multiple Slashes in URL', priority: 1 },
    { id: IssueTypesList.ERROR_INCORRECT_MEDIA_TYPE, type: 'Incorrect Media Type', priority: 1 },
    { id: IssueTypesList.ERROR_LOCALHOST_LINKS, type: 'Localhost Links', priority: 1 },
    { id: IssueTypesList.ERROR_MULTIPLE_H1, type: 'Multiple H1 Tags', priority: 1 },
  ];

  for (const item of data) {
    try {
      await db.insert(issueTypes).values(item).onConflictDoUpdate({
        target: issueTypes.id,
        set: { type: item.type, priority: item.priority }
      });
    } catch (error) {
      console.error(`Failed to seed issue type: ${item.type}`, error);
    }
  }

  console.log('✅ Seeding completed.');
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
