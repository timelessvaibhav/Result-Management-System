import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-display-records',
  templateUrl: './display-records.component.html',
  styleUrls: ['./display-records.component.css'],
})
export class DisplayRecordsComponent implements OnInit {
  records: any[] = [];

  constructor(private http: HttpClient, private datePipe: DatePipe) {}

  ngOnInit() {
    this.fetchRecords();
  }

  formattedDOB(dob: any): string {
    return this.datePipe.transform(dob, 'dd/MM/yyyy') || '';
  }

  fetchRecords() {
    this.http.get<any[]>('http://localhost:3000/records').subscribe(
      (response) => {
        this.records = response;
      },
      (error) => {
        console.error('Error fetching records:', error);
      }
    );
  }

  onEdit(record: any, field: string, event: any) {
    const value = event.target.value.trim();
    record[field] = value;
    this.saveRecord(record);
  }

  saveRecord(record: any) {
    this.http.put('http://localhost:3000/records', record).subscribe(
      () => {
        console.log('Record updated successfully:', record);
      },
      (error) => {
        console.error('Error updating record:', error);
      }
    );
  }
  deleteRecord(record: any) {
    const confirmation = confirm(
      'Are you sure you want to delete this record?'
    );
    if (confirmation) {
      this.http
        .delete(`http://localhost:3000/records/${record.rollno}`)
        .subscribe(
          () => {
            console.log('Record deleted successfully:', record);
            this.fetchRecords(); // Refresh the records after deletion
          },
          (error) => {
            console.error('Error deleting record:', error);
          }
        );
    }
  }
}
