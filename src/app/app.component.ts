import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  genders = ['male', 'female'];
  signupForm: FormGroup;
  get userData(): FormGroup {
    return this.signupForm.get('userData') as FormGroup;
  }
  ngOnInit(): void {
    this.signupForm = new FormGroup({
      userData: new FormGroup({
        username: new FormControl(null, Validators.required),
        email: new FormControl(null, [
          Validators.maxLength(5),
          Validators.email,
          Validators.required,
        ]),
      }),
      gender: new FormControl('male'),
    });
  }

  onSubmit(): void {
    console.log(this.signupForm);
  }
}
