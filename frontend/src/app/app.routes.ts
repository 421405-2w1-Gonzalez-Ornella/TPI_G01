import { Routes } from '@angular/router';
import { StudentHomeComponent } from './pages/student-home/student-home.component';
import { TeacherDashboardComponent } from './pages/teacher-dashboard/teacher-dashboard.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: StudentHomeComponent },
  { path: 'alumno', redirectTo: 'home', pathMatch: 'full' },
  { path: 'profesor', component: TeacherDashboardComponent },
  { path: '**', redirectTo: 'home' }
];



