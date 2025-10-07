import { Injectable, signal } from '@angular/core';
import { Exam } from '../models/exam.model';

@Injectable({ providedIn: 'root' })
export class ExamStorageService {
  private readonly STORAGE_KEY = 'exams';
  exams = signal<Exam[]>(this.getExams());

  private getExams(): Exam[] {
    const raw = localStorage.getItem(this.STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  }

  private save(exams: Exam[]) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(exams));
    this.exams.set(exams);
  }

  add(exam: Exam) {
    const all = this.exams();
    this.save([...all, exam]);
  }

  update(updated: Exam) {
    const all = this.exams().map(e => (e.id === updated.id ? updated : e));
    this.save(all);
  }

  toggleTodo(updated: Exam) {
    const all = this.exams().map(e =>
      e.id === updated.id ? { ...e, isTodo: !e.isTodo } : e
    );
    this.save(all);
  }

  delete(id: number) {
    const filtered = this.exams().filter(e => e.id !== id);
    this.save(filtered);
  }

  getByCourseAndWeek(courseId: number, weekId: number) {
    return this.exams().filter(e => e.courseId === courseId && e.weekId === weekId);
  }
}
