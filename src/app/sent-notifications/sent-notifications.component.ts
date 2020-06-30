import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../services/notificationService';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { Router } from '@angular/router';
import { SecurityService } from '../services/securityService';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-sent-notifications',
  templateUrl: './sent-notifications.component.html',
  styleUrls: ['./sent-notifications.component.css']
})
export class SentNotificationsComponent implements OnInit {
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

	  	this.notificationService.GetAdminNotifications(Data).subscribe((response) => {
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

    createDynamicMessage(notify){
      var str = notify.message;
      //return str;
      console.log(str)
      if(str.includes('assigned a new shift')){
        return 'You have assigned a new shift to ' + notify.user.firstname;
      }else if(str.includes('shift has been approved')){
        var str1 = str.split('has been');
        return 'You have approved a shift request for ' + str1[0] + ' from worker ' + notify.user.firstname; 
      }else if(str.includes('account has been approved')){
        return 'You have approved a account request of worker ' + notify.user.firstname;
      }else if(str.includes('broadcasted a new shift')){
        var str1 = str.split('Admin');
        return 'You have' + str1[1];
      }else if(str.includes('assigned a new shift')){
        var str1 = str.split('Admin');
        return 'You have' + str1[1] + ' to worker ' + notify.user.firstname;
      }else{
        return str;
      }
    };


}
