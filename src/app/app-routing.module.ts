import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CreateRecordComponent } from './create-record/create-record.component';
import { DisplayRecordsComponent } from './display-records/display-records.component';
import { StudentLoginComponent } from './student-login/student-login.component';
import { ResultComponent } from './result/result.component';
import { TeacherLoginComponent } from './teacher-login/teacher-login.component';
import { AuthGuardTeacher } from './auth.guard.teacher';



const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'dashboard', component: DashboardComponent, canActivate:[AuthGuardTeacher]},
  {path: 'create', component: CreateRecordComponent, canActivate:[AuthGuardTeacher]},
  {path: 'view', component: DisplayRecordsComponent, canActivate:[AuthGuardTeacher]},
  {path: 'studentlogin', component: StudentLoginComponent},
  {path: 'result/:rollNumber', component: ResultComponent },
  {path: 'teacherlogin', component: TeacherLoginComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
