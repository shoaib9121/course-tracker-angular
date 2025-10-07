import { Routes } from '@angular/router';
import { CourseDetailsComponent } from './courses/course-details.component';
import { CreateExamModalComponent } from './courses/create-exam-modal.component';
// import { ExamFormComponent } from './exams/exam-form.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/courses/1',
    pathMatch: 'full',
  },
  {
    path: 'courses/:courseId',
    component: CourseDetailsComponent,
    children: [
      { path: 'weeks/:weekId/exams/new', component: CreateExamModalComponent },
      { path: 'weeks/:weekId/exams/:examId/edit', component: CreateExamModalComponent }
    ]
  },
  // {
  //   path: 'courses/:courseId/weeks/:weekId/exams/new',
  //   component: CreateExamModalComponent,
  // },
  // {
  //   path: 'courses/:courseId/weeks/:weekId/exams/:examId/edit',
  //   component: ExamFormComponent,
  // },
];
