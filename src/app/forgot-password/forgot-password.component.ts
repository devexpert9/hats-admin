import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoginService } from '../services/loginService';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
	 authForm: FormGroup;

  constructor(public fb: FormBuilder, public loginService: LoginService, public router: Router,private toastr: ToastrService) { 
  this.createForm();
}

  ngOnInit() {
    window.scrollTo(0, 0);
  }

    createForm() {
    this.authForm = this.fb.group({
       email: ['', Validators.compose([Validators.required, Validators.pattern('[A-Za-z0-9._%+-]{3,}@[a-zA-Z]{3,}([.]{1}[a-zA-Z]{2,}|[.]{1}[a-zA-Z]{2,}[.]{1}[a-zA-Z]{2,})')])]
    });
  
  }

    forgotPassword(){
  	console.log(this.authForm.value);

    this.loginService.ForgotPassword(this.authForm.value).subscribe((getdata) => {
      console.log(getdata);
      this.toastr.success('Password is successfully to your email!');

      //this.router.navigateByUrl('/dashboard');
    })

  }


}
