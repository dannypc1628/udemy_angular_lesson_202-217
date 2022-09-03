import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
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
  forbiddenUserNames = ['Chris', 'Anna'];

  get userData(): FormGroup {
    return this.signupForm.get('userData') as FormGroup;
  }
  ngOnInit(): void {
    this.signupForm = new FormGroup({
      userData: new FormGroup({
        username: new FormControl(null, [
          Validators.required,
          this.forbiddenNames.bind(this),
        ]),
        email: new FormControl(
          null,
          [Validators.maxLength(15), Validators.email, Validators.required],
          [this.forbiddenEmails]
        ),
      }),
      gender: new FormControl('male'),
      hobbies: new FormArray([]),
    });

    this.signupForm.valueChanges.subscribe((value) => console.log(value));

    this.signupForm.statusChanges.subscribe((status) => console.log(status));

    // 設定全部值
    this.signupForm.setValue({
      userData: { username: 'Max', email: 'max@test.com' },
      gender: 'female',
      hobbies: [],
    });

    // 修改部份值
    this.signupForm.patchValue({
      userData: { username: 'Anna' },
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
    // 全部清空
    this.signupForm.reset();

    // 清空時重設指定值
    this.signupForm.reset({
      userData: { username: 'Anna' },
    });
  }

  onAddHobby() {
    const control = new FormControl(null, Validators.required);
    (<FormArray>this.signupForm.get('hobbies')).push(control);
  }

  forbiddenNames(control: FormControl): { [s: string]: boolean } {
    if (this.forbiddenUserNames.indexOf(control.value) !== -1) {
      return { nameIsForbidden: true };
    }
    return null;
  }

  forbiddenEmails(control: FormControl): Promise<any> | Observable<any> {
    const promise = new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        if (control.value === 'test@test.com') {
          resolve({ emailIsForbidden: true });
        } else {
          resolve(null);
        }
      }, 1500);
    });

    return promise;
  }
}
