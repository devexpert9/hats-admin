import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoginService } from '../services/loginService';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  authForm: FormGroup;
  public loading = false;

  constructor(public fb: FormBuilder, public loginService: LoginService, public router: Router,private toastr: ToastrService,private spinnerService: Ng4LoadingSpinnerService) {
    this.createForm();
  }

  ngOnInit() {}

  createForm() {
    this.authForm = this.fb.group({
      username: ['', Validators.compose([Validators.required])],
      password: ['', Validators.compose([Validators.required,Validators.minLength(5)])]
    });
  };

  login(){
    this.spinnerService.show();

    var loginData = {
      email:this.authForm.value.username,
      password: this.authForm.value.password
    };

    this.loginService.Login(loginData).subscribe((response) => {
      this.spinnerService.hide();
      if(response.status == 1){
        localStorage.setItem('adminId', response.data._id);
        localStorage.setItem('password', response.data.password);
        this.router.navigateByUrl('/dashboard');
        this.toastr.success(response.error);
      }else{
        this.toastr.error(response.error);
      }
    });
  };

}
