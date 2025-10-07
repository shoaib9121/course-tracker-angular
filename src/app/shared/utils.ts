import { TopicProgress, Week } from './store.service';

/**
 * Generates all weeks for a given year
 */
export function getWeeksOfYear(year: number): Week[] {
  const weeks: Week[] = [];
  const firstDay = new Date(year, 0, 1);
  let weekId = 1;
  let current = new Date(firstDay);

  while (current.getFullYear() === year) {
    const start = new Date(current);
    const end = new Date(current);
    end.setDate(start.getDate() + 6);
    weeks.push({ id: weekId, weekNumber: weekId, start, end });
    weekId++;
    current.setDate(current.getDate() + 7);
  }
  return weeks;
}

/**
 * Computes percentage for a topic
 */
export function computePercentage(topic: TopicProgress): number {
  if (topic.total === 0) return 0;
  return Math.round((topic.achieved / topic.total) * 100);
}
