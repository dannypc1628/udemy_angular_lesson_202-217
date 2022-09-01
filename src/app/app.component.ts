import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

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
        email: new FormControl(
          null,
          [
            Validators.maxLength(5),
            Validators.email,
            Validators.required,
            this.checkMailDomain,
          ],
          [this.shouldBeUnique]
        ),
      }),
      gender: new FormControl('male'),
    });
  }

  // 限制信箱 Domain (同步驗證)
  checkMailDomain(control: AbstractControl): ValidationErrors | null {
    // 未填寫不檢查
    if (
      control.value === undefined ||
      control.value === null ||
      control.value === ''
    ) {
      return of(null);
    }

    // 限制只能使用 Gmail
    const value = control.value.toLowerCase();
    if (value.includes('@gmail.com')) {
      return null;
    }
    return { isNotGmail: true } as ValidationErrors;
  }

  // 連到後端檢查是否有被註冊過(非同步驗證)
  shouldBeUnique(
    control: AbstractControl
  ): Observable<ValidationErrors | null> {
    if (
      control.value === undefined ||
      control.value === null ||
      control.value === ''
    ) {
      return of(null);
    }

    return this.isExists(control.value).pipe(
      map((exists) => {
        if (exists) {
          return { shouldBeUnique: true };
        } else {
          return null;
        }
      })
    );
  }

  isExists(value): Observable<unknown> {
    // 使用service連到後端做檢查
    return null;
  }

  onSubmit(): void {
    console.log(this.signupForm);
  }
}
