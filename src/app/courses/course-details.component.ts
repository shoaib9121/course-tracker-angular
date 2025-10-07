import { Component, computed, effect, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreService, Course, Week } from '../shared/store.service';
import { computePercentage } from '../shared/utils';
import { CreateExamModalComponent } from './create-exam-modal.component';
import { ExamStorageService } from '../shared/exam-storage.service';
import { Exam } from '../models/exam.model';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, Subscription } from 'rxjs';
import { LucideAngularModule } from 'lucide-angular';
import { AppIconComponent } from '../components/app-icon.component';
import { Assignment } from '../models/assignment.model';
import { Video } from '../models/video.model';
import { Attachment } from '../models/attachment.model';

@Component({
  selector: 'app-course-details',
  standalone: true,
  imports: [CommonModule, CreateExamModalComponent, AppIconComponent, LucideAngularModule],
  templateUrl: './course-details.component.html',
})
export class CourseDetailsComponent {
  @ViewChild('createExamModal') createExamModal!: CreateExamModalComponent;
  private sub!: Subscription;
  selectedFilter = signal<'all' | 'todo'>('all');
  computePercentage = computePercentage;
  courseId!: number;
  selectedWeekId = signal(1);
  exams = signal<Exam[]>([]);
  weekContents = computed(() => this.store.weekContents()?.[1] || []);
  currentWeekContent = computed(() => this.store.getWeekContent(1, this.selectedWeekId()));
  currentYear = new Date().getFullYear();
  weeks: Week[] = [];
  showExamTypeModal = signal(false);
  openMenuId = signal<number | null>(null);
  todosCount = computed(() => {
    const exams = this.examStore.exams();
    const courseId = this.courseId;
    const weekId = this.selectedWeekId();
    const todos = exams.filter((e) => e.courseId === courseId && e.weekId === weekId && e.isTodo);

    return todos.length;
  });
  courseProgress = computed(() => {
    const exams = this.examStore.exams().filter((e) => e.id === 1);
    if (exams.length === 0) return 0;
    const doneCount = exams.filter((e) => !e.isTodo).length;
    return Math.round((doneCount / exams.length) * 100);
  });
  chips = [
    { key: 'Videos', storageKey: 'videos' },
    { key: 'Attachments', storageKey: 'attachments' },
    { key: 'Assignments', storageKey: 'assignments' },
    { key: 'Exams', storageKey: 'exams' },
  ] as const;
  selectedChip = signal<'Videos' | 'Attachments' | 'Assignments' | 'Exams'>('Exams');

  normalizedItems = computed(() => {
    const chip = this.selectedChip();
    const storageKey = this.chips.find((c) => c.key === chip)!.storageKey;
    const raw = this.readChipsItems(storageKey) || [];

    return (raw as any[]).map((item) => {
      if (storageKey === 'exams') {
        return item as Exam;
      }
      return item; // fallback
    });
  });

  constructor(
    public store: StoreService,
    private route: ActivatedRoute,
    private examStore: ExamStorageService,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.courseId = Number(params.get('courseId'));
      const weekId = params.get('weekId');
      if (weekId) {
        this.selectedWeekId.set(Number(weekId));
      }
    });
    this.weeks = this.store.weeks();
  }

  ngAfterViewInit() {
    const childParams$ = this.route.firstChild?.paramMap ?? this.route.paramMap;

    this.sub = combineLatest([childParams$]).subscribe(([childParams]) => {
      const examId = Number(childParams.get('examId'));
      const currentUrl = this.router.url;
      if (currentUrl.includes('/exams/new')) {
        this.showExamTypeModal.set(true);
      }

      if (examId) {
        const exam = this.examStore.exams().find((e) => e.id === examId);
        if (exam) {
          this.createExamModal.examToEdit = exam;
          setTimeout(() => this.createExamModal.show.set(true));
        }
      }
    });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  get examsForCurrentWeek() {
    return this.examStore.getByCourseAndWeek(this.courseId, this.selectedWeekId());
  }
  toggleMenu(id: number) {
    this.openMenuId.set(this.openMenuId() === id ? null : id);
  }

  openExam(exam: Exam) {
    this.openMenuId.set(null);
  }

  editExam(exam: Exam) {
    this.createExamModal.show.set(true);
    this.createExamModal.examToEdit = exam;
    this.openMenuId.set(null);
    this.routeNavigationWithEdit(exam);
  }

  toggleTodoStatus(exam: Exam) {
    this.examStore.toggleTodo(exam);
    this.openMenuId.set(null);
  }

  deleteExam(exam: Exam) {
    const { id } = exam;
    this.examStore.delete(id);
    this.openMenuId.set(null);
  }

  markDone(exam: Exam) {
    this.examStore.update({ ...exam, isTodo: false });
  }

  getTeacherNames(course: Course): string {
    return course.teachers.map((t) => t.name).join(', ');
  }

  prevWeek() {
    const idx = this.weeks.findIndex((w) => w.id === this.selectedWeekId());
    if (idx > 0) {
      this.selectedWeekId.set(this.weeks[idx - 1].id);
    }
  }

  nextWeek() {
    const idx = this.weeks.findIndex((w) => w.id === this.selectedWeekId());
    if (idx < this.weeks.length - 1) {
      this.selectedWeekId.set(this.weeks[idx + 1].id);
    }
  }

  openModal() {
    this.routeNavigationWithCreate();
    this.showExamTypeModal.set(true);
  }

  closeModal() {
    this.showExamTypeModal.set(false);
    this.router.navigate(['../..'], { relativeTo: this.route });
  }

  onChipSelect(chipKey: 'Videos' | 'Attachments' | 'Assignments' | 'Exams') {
    this.selectedChip.set(chipKey);
  }

  routeNavigationWithCreate() {
    this.router.navigate([
      '/courses',
      this.courseId,
      'weeks',
      this.selectedWeekId(),
      'exams',
      'new',
    ]);
  }

  routeNavigationWithEdit(exam: Exam) {
    this.router.navigate([
      'courses',
      this.courseId,
      'weeks',
      exam.weekId,
      'exams',
      exam.id,
      'edit',
    ]);
  }

  private readChipsItems<T extends 'exams' | 'videos' | 'attachments' | 'assignments'>(
    storageKey: string
  ): Exam[] {

    if (storageKey === 'exams') {
      const exams = this.examStore.exams();
      const courseId = this.courseId;
      const weekId = this.selectedWeekId();
      const filter = this.selectedFilter();
      const weekExams = exams.filter((e) => e.courseId === courseId && e.weekId === weekId);

      return filter === 'todo' ? weekExams.filter((e) => e.isTodo) : weekExams;
    } else {
      return []; // default
    }
  }
}
