import { Component } from '@angular/core';
import { Router } from '@angular/router';
//import {SwPush, SwUpdate} from "@angular/service-worker";
// import { PushNotificationComponent } from 'ng2-notifications/ng2-notifications';
//import { PushNotificationComponent } from './components/notification.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'Rapid Response Security';
  constructor(public router: Router) {
  // 	 if(localStorage.getItem('adminId')){
  // 	this.router.navigate(['/dashboard']);
  // }else{
  // 	this.router.navigate(['/']);
  // }
  }


  ngOnInit() {
   // console.log('swupdate enabled ', this.swUpdate.isEnabled)
    // alert('swUpdate')

    // if (this.swUpdate.isEnabled) {

    //     this.swUpdate.available.subscribe((res) => {
    //       console.log('Response ', res)
    //          alert('res')
    //         if (confirm("New version available. Load New Version?")) {
    //             window.location.reload();
    //         };

    //     });

    // };
  };

 
}
