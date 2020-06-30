import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../services/notificationService';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { Router } from '@angular/router';
import { SecurityService } from '../services/securityService';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {
notification: any;
imageURL: any;
rows: any;
noti: any;
  constructor(private notificationService: NotificationService, private spinnerService: Ng4LoadingSpinnerService,public router: Router, public securityService: SecurityService, public toastr: ToastrService) { 

    	 if(localStorage.getItem('adminId') == undefined || localStorage.getItem('adminId') == '' || localStorage.getItem('adminId') == null){
    this.router.navigateByUrl('/');
  };
  this.getAllNotifications();
  this.imageURL = 'http://13.59.189.135:3002/images/';}

  ngOnInit() {
    window.scrollTo(0, 0);
  }

    getAllNotifications() {
    this.spinnerService.show();
  var Data = {
    adminId: localStorage.getItem('adminId')
  };

  this.notificationService.GetNotifications(Data).subscribe((response) => {
    console.log(response);
    this.notification = response.data;
    this.rows = response.data;
    this.spinnerService.hide();
  });
};

  DeleteNoti(row){
    this.noti = row;
  }

  deleteNoti(notify){
    this.spinnerService.show();
    var shiftData = {
      notificationId: notify._id
    }
    console.log(shiftData);
    this.securityService.DeleteNotification(shiftData).subscribe((response) => {
      console.log(response);  
      this.spinnerService.hide();
      this.getAllNotifications();  
      this.toastr.success('Notification has been deleted successfully!');
    // this.modalRef.close(); 

  }); 
  };


}
