import { Component, OnInit, NgZone } from '@angular/core';
import { LoginService } from '../services/loginService';
import { NotificationService } from '../services/notificationService';
import { Router } from '@angular/router';
// import { Socket } from 'ng6-socket-io';
const SocketIoConfig = { url: 'http://13.59.189.135:3002'};

declare var $: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  profile: any;
  imageURL: any;
  private _opened: boolean = true;
  notification: any;
  counter: any;

  unreadNoti: any;
  constructor(public loginService: LoginService, public router: Router,private notificationService: NotificationService) {
   // this.socket.on('update_profile_server', (msg) => {
   //    console.log("message", msg);
   //    this.getAdminProfile();
   //  });
    // this.socket.fromEvent("message").map( data =>
    // {
    //   console.log( data);
    // });
    $(document).on("wheel", "input[type=date]", function (e) {
      e.preventDefault();
    });

    $(document).on("wheel", "input[type=number]", function (e) {
      e.preventDefault();
    });


  // this.socket = io(SocketIoConfig);
  //      this.socket.on("update_profile_server", (msg) => {
  //          this.zone.run(() => {
  //              if(msg.user == this.typedMessage.user){
  //                  this.typedMessage = {
  //                      message: '',
  //                      user: ''
  //                  };
  //              }

  //              this.messages.push(msg);
  //          });
  //      });

  this.counter = 0;
  this.unreadNoti = [];

  this.getAdminProfile();
  this.getAllNotifications();
  this.imageURL = 'http://13.59.189.135:3002/images/';
}

ngOnInit() {
}
getAdminProfile() {
  var profileData = {
    adminId: localStorage.getItem('adminId')
  };
  this.loginService.GetProfile(profileData).subscribe((response) => {
    console.log(response);
    this.profile = response.data[0];
  })
}
private toggleSidebar() {
    console.log('open')
    var w = window.innerWidth;
    this._opened = !this._opened;

    if(!this._opened){
      if(w < 992){
        //add active class in nav 
        $("#sidebar").addClass("active");
      }else{
        //add icons only class in body tag     
        $("#sidebar-body").addClass("sidebar-icon-only");
      }; 
    }else{
        if(w < 992){
          //add active class in nav 
          $("#sidebar").removeClass("active");
        }else{
            //add icons only class in body tag     
            $("#sidebar-body").removeClass("sidebar-icon-only");
        };
    };
}

logout(){
  localStorage.clear();
  this.router.navigateByUrl('');
};

    getAllNotifications() {
    // this.spinnerService.show();
  var Data = {
    adminId: localStorage.getItem('adminId')
  };

  this.notificationService.GetNotifications(Data).subscribe((response) => {
    console.log(response);
    this.notification = response.data;

    for(var i = 0; i< response.data.length;i++){
      if(response.data[i].readStatus == false){
        this.counter = this.counter +1;
        this.unreadNoti.push(response.data[i]);
      }
    }
    // this.spinnerService.hide();
  });
};

}
