import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  constructor(private router: Router) {}

  redirectToDashboard(role: string) {
    if (role === 'admin') {
      this.router.navigate(['/teacherlogin']); // Redirect admin to the admin dashboard route
    } else if (role === 'student') {
      this.router.navigate(['/studentlogin']); // Redirect student to the student login route
    } else {
      console.error('Invalid role');
    }
  }
}
