import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  isDashboardPageActive: boolean = true;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.route.url.subscribe((urlSegments) => {
      // Check if the current route is the dashboard page
      this.isDashboardPageActive = urlSegments.join('/') === 'dashboard';
    });
  }

  logout() {
    localStorage.removeItem('role');
    this.router.navigate(['/']);
  }
}
