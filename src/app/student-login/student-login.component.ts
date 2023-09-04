import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-student-login',
  templateUrl: './student-login.component.html',
  styleUrls: ['./student-login.component.css']
})
export class StudentLoginComponent {
  rollNumber: string = '';
  dob: string = '';
  errorMessage: string = '';
  rollError: string = '';
  dateError: string = '';
  constructor(private router: Router, private http: HttpClient) {}

  login() {

    this.rollError = '';
    this.dateError = '';
    this.errorMessage = '';

    if(!this.rollNumber){
      this.rollError = 'Roll Number is Required';
    }
    if(!this.dob){
      this.dateError = 'Date of Birth is Required';
      return;
    }
    // 1. Handle form submission
    const payload = { rollno: this.rollNumber, dob: this.dob };

    // 2. Send the login request to the backend
    this.http.post<any>('http://localhost:3000/find', payload).subscribe(
      (response) => {
        if (response && response.rollno) {
          // Navigate to the ResultComponent with the rollNumber as a parameter
          this.router.navigate(['/result', this.rollNumber], { queryParams: { dob: this.dob } });
        } else {
          this.errorMessage = response.message;
        }
      },
      (error: HttpErrorResponse) => {
        if (error.status === 404) {
          // Unauthorized access, display an error message
          this.errorMessage = 'No Result Found';
        } else {
          console.error('Error logging in:', error);
        }
      }
    );
  }
}
