import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css'],
})
export class ResultComponent implements OnInit {
  result: any;

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit() {
    // Get the roll number and dob from the route parameters
    const rollNumber = this.route.snapshot.paramMap.get('rollNumber');
    const dob = this.route.snapshot.queryParamMap.get('dob');

    // Fetch the student result from the backend
    this.http
      .get<any>(`http://localhost:3000/find/${rollNumber}?dob=${dob}`)
      .subscribe(
        (response) => {
          this.result = response;
        },
        (error) => {
          console.error('Error fetching result:', error);
        }
      );
  }
}
