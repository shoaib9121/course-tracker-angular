import { Injectable, signal } from '@angular/core';
import { getWeeksOfYear } from './utils';
import { Exam } from '../models/exam.model';

export interface Teacher {
  id: number;
  name: string;
}
export interface Week {
  id: number;
  start: Date;
  end: Date;
  courseId?: number;
  weekNumber: number;
}
export interface Course {
  id: number;
  title: string;
  icon: string;
  teachers: Teacher[];
  level: string;
  class: string;
}
export interface TopicProgress {
  name: string;
  label: string;
  achieved: number;
  total: number;
  color: string;
  iconColor: string;
  icon: string;
}
export interface WeekContent {
  weekId: number;
  topics: TopicProgress[];
  title: string;
  description: string;
}

@Injectable({ providedIn: 'root' })
export class StoreService {
  courses = signal<Course[]>([]);
  weeks = signal<Week[]>([]);
  exams = signal<Exam[]>([]);
  topics = signal<Record<number, TopicProgress[]>>({});
  weekContents = signal<Record<number, WeekContent[]>>({});

  constructor() {
    this.seedData();
  }

  private seedData() {
    const courseId = 1;

    if (!localStorage.getItem('courses')) {
      const course: Course = {
        id: 1,
        title: 'Chemistry',
        icon: '🧪',
        teachers: [{ id: 1, name: 'Dr. Smith' }],
        level: 'Intermediate',
        class: '10A',
      };
      localStorage.setItem('courses', JSON.stringify([course]));
    }
    if (!localStorage.getItem('weeks')) {
      const weeks: Week[] = Array.from({ length: 12 }).map((_, i) => {
        const start = new Date(2025, 0, i * 7 + 1);
        const end = new Date(start);
        end.setDate(start.getDate() + 6);
        return {
          id: i + 1,
          courseId: 1,
          weekNumber: i + 1,
          start: start,
          end: end,
        };
      });
      localStorage.setItem('weeks', JSON.stringify(weeks));
    }
    if (!localStorage.getItem('exams')) {
      localStorage.setItem('exams', JSON.stringify([]));
    }
    if (!localStorage.getItem('topics')) {
      const courseTopics: TopicProgress[] = [
        { name: 'Videos', icon: 'play', iconColor: '#9c67f5', label: 'Watched', achieved: 14, total: 44, color: 'bg-green-500' },
        { name: 'Attachments', icon: 'paperclip', iconColor: '#62ba0b', label: 'Viewed', achieved: 5, total: 12, color: 'bg-green-500' },
        { name: 'Assignments', icon: 'list-checks', iconColor: '#f7673d', label: 'Submitted', achieved: 3, total: 8, color: 'bg-green-500' },
        { name: 'Exams', icon: 'file-pen', iconColor: '#e654f0', label: 'Completed', achieved: 2, total: 5, color: 'bg-green-500' },
      ];
      localStorage.setItem('topics', JSON.stringify({ 1: courseTopics }));
    }
    const weekContents: WeekContent[] = getWeeksOfYear(new Date().getFullYear()).map(w => ({
      weekId: w.id,
      topics: [
        { name: 'Videos', icon: 'play', iconColor: '#9c67f5', label: 'Watched', achieved: Math.floor(Math.random() * 10), total: 20, color: 'bg-green-500' },
        { name: 'Attachments', icon: 'paperclip', iconColor: '#62ba0b', label: 'Viewed', achieved: Math.floor(Math.random() * 5), total: 10, color: 'bg-green-500' },
        { name: 'Assignments', icon: 'list-checks', iconColor: '#f7673d', label: 'Submitted', achieved: Math.floor(Math.random() * 3), total: 5, color: 'bg-green-500' },
        { name: 'Exams', icon: 'file-pen', iconColor: '#e654f0', label: 'Completed', achieved: Math.floor(Math.random() * 2), total: 4, color: 'bg-green-500' },
      ],
      title: `${w.id} Atomic Structure and Periodic Table`,
      description: `Figma design and figma are two products, when used together, support your entire design process. While you might begin`,
    }));

    this.weekContents.set({ [courseId]: weekContents });
    this.topics.set(JSON.parse(localStorage.getItem('topics')!));
    this.courses.set(JSON.parse(localStorage.getItem('courses')!));
    this.weeks.set(JSON.parse(localStorage.getItem('weeks')!));
    this.exams.set(JSON.parse(localStorage.getItem('exams')!));
  }

  saveExams() {
    localStorage.setItem('exams', JSON.stringify(this.exams()));
  }
  getWeekContent(courseId: number, weekId: number): WeekContent | undefined {
    return this.weekContents()?.[courseId]?.find(wc => wc.weekId === weekId);
  }
}
