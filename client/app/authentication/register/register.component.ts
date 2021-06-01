import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { mustMatchPassword } from '../../helper/password-match.validation';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder
  ) {
    this.registerForm = this.fb.group({
      userName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    },
      {
        validators: [
          mustMatchPassword(
            'password',
            'confirmPassword'
          )
        ]
      }
    )
  }

  ngOnInit() {

  }

  get rF(): any {
    return this.registerForm.controls;
  }

  userSignUp(): void {

  }

}
function mustMatchValidator(userPassword: any, confirmPassword: any): any {
  throw new Error('Function not implemented.');
}

