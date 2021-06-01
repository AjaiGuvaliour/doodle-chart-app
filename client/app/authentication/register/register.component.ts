import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppService } from 'client/app/service/app.service';
import { LoaderService } from 'client/app/service/loader.service';
import { ToastrService } from 'ngx-toastr';
import { mustMatchPassword } from '../../helpers/password-match.validation';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private appService: AppService,
    private loaderService: LoaderService,
    private toastr: ToastrService
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
    this.loaderService.show();
    this.appService.post('/auth/register', this.registerForm.value).subscribe(
      (response: any) => {
        if(response.success){
          this.toastr.success('Success', response.message);
        } else {
          this.toastr.error('Error', response.message);
        }
        this.loaderService.hide();
      },
      (error) => {
        this.toastr.error('Error', error);
        this.loaderService.hide();
      }
    )
  }
}
