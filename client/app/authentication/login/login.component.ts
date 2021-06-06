import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppService } from 'client/app/service/app.service';
import { ChartService } from 'client/app/service/chart.service';
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
    private chartService: ChartService,
    private toastr: ToastrService,
    private router: Router
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
          this.toastr.success(response.message);
          sessionStorage.setItem('token', response['data']['token']);
          sessionStorage.setItem('userDetail', JSON.stringify(response['data']['userDetail']));
          this.chartService.socket.emit('userLoggedIn', response['data']['userDetail']);
          this.chartService.socket.once('socketForLoggedInUser', () => {
            this.loaderService.hide();
            this.router.navigate(['/home/chart']);
          });
        } else {
          this.toastr.error(response.message);
          this.loaderService.hide();
        }
      },
      (error) => {
        this.toastr.error(error);
        this.loaderService.hide();
      }
    )
  }
}
