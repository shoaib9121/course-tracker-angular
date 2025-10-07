import { Component, Input, signal, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ExamStorageService } from '../shared/exam-storage.service';
import { Exam } from '../models/exam.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-create-exam-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-exam-modal.component.html',
})
export class CreateExamModalComponent {
  @Input() courseId!: number;
  @Input() weekId!: number;
  @Input() show = signal(false);
  @Input() examToEdit?: Exam | null = null;
  createExamForm;

  constructor(private fb: FormBuilder, private examStore: ExamStorageService, private route: ActivatedRoute, private router: Router) {

    this.createExamForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      startDate: ['', Validators.required],
      startTime: ['', Validators.required],
      endDate: ['', Validators.required],
      endTime: ['', Validators.required],
      duration: ['', [Validators.required, Validators.min(1), Validators.max(6)]],
      attempts: ['', Validators.required],
      viewCorrect: ['', Validators.required],
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['examToEdit']?.currentValue) {
      this.createExamForm.patchValue(this.examToEdit!);
    }
  }

  closeModal() {
    this.show.set(false);
    this.router.navigate(['../..'], { relativeTo: this.route });
  }

  onSubmit() {
    if (this.createExamForm.invalid) {
      return;
    }
    const rawFormValue = this.createExamForm.value;
    const formValue = Object.fromEntries(
      Object.entries(rawFormValue).map(([key, val]) => [key, val ?? ''])
    ) as Record<string, string>;

    if (this.examToEdit) {
      const updatedExam = {
        ...this.examToEdit,
        ...formValue,
      };
      this.examStore.update(updatedExam);
    } else {
      const newExam: Exam = {
        id: Date.now(),
        courseId: this.courseId,
        weekId: this.weekId,
        title: formValue['title']!,
        description: formValue['description'] || '',
        startDate: formValue['startDate']!,
        startTime: formValue['startTime']!,
        endDate: formValue['endDate']!,
        endTime: formValue['endTime']!,
        duration: formValue['duration']!,
        attempts: formValue['attempts']!,
        viewCorrect: formValue['viewCorrect']!,
        icon: 'file-pen'
      };
      this.examStore.add(newExam);
    }

    this.closeModal();
  }
}
