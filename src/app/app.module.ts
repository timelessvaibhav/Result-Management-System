import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CreateRecordComponent } from './create-record/create-record.component';
import { DisplayRecordsComponent } from './display-records/display-records.component';
import { StudentLoginComponent } from './student-login/student-login.component';
import { ResultComponent } from './result/result.component';
import { TeacherLoginComponent } from './teacher-login/teacher-login.component';
import { AuthGuardTeacher } from './auth.guard.teacher';
import { DatePipe } from '@angular/common';




@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    DashboardComponent,
    CreateRecordComponent,
    DisplayRecordsComponent,
    StudentLoginComponent,
    ResultComponent,
    TeacherLoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,

  ],
  providers: [DatePipe, AuthGuardTeacher],
  bootstrap: [AppComponent]
})
export class AppModule { }
