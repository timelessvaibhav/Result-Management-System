import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-teacher-login',
  templateUrl: './teacher-login.component.html',
  styleUrls: ['./teacher-login.component.css'],
})
export class TeacherLoginComponent {
  username: string = '';
  password: string = '';
  usernameError: string = '';
  passwordError: string = '';
  InvalidError: string = '';
  constructor(private router: Router, private http: HttpClient) {}

  login() {
    // 1. Validate the form fields

    // Reset previous error messages
    this.usernameError = '';
    this.passwordError = '';
    this.InvalidError = '';

    // Validate fields
    if (!this.username) {
      this.usernameError = 'Username is required';
    }

    if (!this.password) {
      this.passwordError = 'Password is required';
      return;
    }
    // 2. Handle form submission
    const payload = { username: this.username, password: this.password };

    // 3. Send the login request to the backend
    this.http.post<any>('http://localhost:3000/login', payload).subscribe(
      (response) => {
        // 3. Redirect to the dashboard on successful login
        if (response && response.role) {
          console.log(response);
          localStorage.setItem('role', response.role);
          this.router.navigate(['/dashboard']);
        } else {
          // Display an error message if login failed
          this.InvalidError = 'Invalid username or password';
        }
      },
      (error: HttpErrorResponse) => {
        if (error.status === 401) {
          // Unauthorized access, display an error message
          this.InvalidError = 'Invalid username or password';
        } else {
          console.error('Error logging in:', error);
        }
      }
    );
  }
}
