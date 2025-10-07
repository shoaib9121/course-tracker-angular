export interface Attachment {
  id: number;
  courseId: number,
  weekId: number;
  title: string;
  description?: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  duration: string;
  attempts: string;
  viewCorrect: string;
  isTodo?: boolean;
}