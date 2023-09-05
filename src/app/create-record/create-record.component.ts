import { Component } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-create-record',
  templateUrl: './create-record.component.html',
  styleUrls: ['./create-record.component.css'],
})
export class CreateRecordComponent {
  // Form data object to store user input
  formData = {
    rollno: '',
    name: '',
    dob: '',
    score: '',
  };

  // Error and success messages
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private http: HttpClient) {
    // Inject the HttpClient dependency for making HTTP requests
  }

  // Method triggered when the form is submitted
  onSubmit() {
    this.errorMessage = '';
    this.successMessage = '';
    // Check if any required field is empty
    if (
      this.formData.rollno === '' ||
      this.formData.name === '' ||
      this.formData.dob === '' ||
      this.formData.score === ''
    ) {
      this.errorMessage = 'Please fill in all the required fields.';
      return; // Stop the execution of the function
    }

    const nameRegex = /^[a-zA-Z\s]+$/; // Regular expression to allow only letters and spaces

    // Check if the name contains only letters and spaces
    if (!nameRegex.test(this.formData.name)) {
      this.errorMessage = 'Name cannot contain numbers and special characters.';
      return; // Stop the execution of the function
    }

    const currentDate = new Date();
    const submittedDate = new Date(this.formData.dob);

    // Check if the submitted date is in the future
    if (submittedDate > currentDate) {
      this.errorMessage = 'Date of Birth cannot be in the future.';
      return; // Stop the execution of the function
    }

    // All validation checks have passed, proceed with submitting the record
    const recordData = {
      rollno: this.formData.rollno,
      name: this.formData.name,
      dob: this.formData.dob,
      score: this.formData.score,
    };

    // Send the record data to the server
    this.http.post('http://localhost:3000/submit', recordData).subscribe(
      (response: any) => {
        console.log('Record submitted successfully:', response.message);

        this.successMessage = response.message;
        // Reset the form fields
        this.formData.rollno = '';
        this.formData.name = '';
        this.formData.dob = '';
        this.formData.score = '';
      },
      (error: HttpErrorResponse) => {
        if (error.status === 409) {
          // Handle conflict error (409)
          this.errorMessage = error.error.message;
        } else {
          // Handle other errors
          this.errorMessage = 'An error occurred while submitting the record.';
        }
        console.error('Error submitting record:', error);
      }
    );
  }
}
