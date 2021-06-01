import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppService } from 'client/app/service/app.service';
import { LoaderService } from 'client/app/service/loader.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private appService: AppService,
    private loaderService: LoaderService,
    private toastr: ToastrService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    })
  }

  ngOnInit(): void {
  }

  get lF(): any {
    return this.loginForm.controls;
  }

  userSignIn(): void {
    this.loaderService.show();
    this.appService.post('/auth/login', this.loginForm.value).subscribe(
      (response: any) => {
        if (response.success) {
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
