export class DateUtils {
  /**
   * Format a date to ISO string without milliseconds
   */
  public static toIsoSimple(date: Date): string {
    return date.toISOString().split('.')[0] + 'Z';
  }

  /**
   * Get duration in seconds between two dates
   */
  public static getDurationSeconds(start: Date, end: Date): number {
    return (end.getTime() - start.getTime()) / 1000;
  }

  /**
   * Check if a date is older than X minutes
   */
  public static isOlderThan(date: Date, minutes: number): boolean {
    const diff = (new Date().getTime() - date.getTime()) / 1000 / 60;
    return diff > minutes;
  }
}
