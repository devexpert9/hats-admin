import { Component, OnInit } from '@angular/core';
import { SecurityService } from '../services/securityService';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoginService } from '../services/loginService';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ToastrService } from 'ngx-toastr';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { ShiftService } from '../services/shiftService';
import { Router } from '@angular/router';

@Component({
  selector: 'app-usertrash',
  templateUrl: './usertrash.component.html',
  styleUrls: ['./usertrash.component.css']
})
export class UsertrashComponent implements OnInit {

	securityGuardsList: any;
  	viewGuardData: any;
  	imageURL: any;
  	authForm: FormGroup;
  	guardDetails: any;  
  	rows: any; 
  	rows1: any; 
  	temp: any;
  	temp1: any;
  	rapidId: any;
  	item: any;
  	trashValue: any;
  	guard: any;
  	stringValue: any;
  	value: any;

  	constructor(public securityService: SecurityService,public fb: FormBuilder, public loginService: LoginService,private spinnerService: Ng4LoadingSpinnerService,private toastr: ToastrService,private modalService: NgbModal, public shiftService: ShiftService , public router: Router ) { 

  		this.rapidId = '';
    	this.value = 'user';
	    if(localStorage.getItem('adminId') == undefined || localStorage.getItem('adminId') == '' || localStorage.getItem('adminId') == null){
	      this.router.navigateByUrl('/');
	    };
	    this.getTrashGuards();
  	}

  	ngOnInit() {
  		 window.scrollTo(0, 0);
  	};

  	updateFilter(event) {
	    const val = event.target.value.toLowerCase();
	    var temp;

	    if(val != ''){
	     	temp = this.temp.filter(function(d) {

		      	if(d){
		        	return d.rapidId.toLowerCase().indexOf(val) !== -1 || !val ;
		      	}   
	    	});
	  	}else{
	    	temp = this.temp;
	  	};

	    // update the rows
	    this.rows = temp;
	    // Whenever the filter changes, always go back to the first page
  	};

  	getTrashGuards() {
  		this.spinnerService.show();
	  var Data = {
	    adminId: localStorage.getItem('adminId')
	  };
	  this.securityService.GetTrashGuards(Data).subscribe((response) => {
	    console.log(response);
	    this.securityGuardsList = response;
	    this.rows = response.user;
	    this.rows1 = response.shift;
	    this.temp = response.user;
	    this.temp1 = response.shift;
	    this.spinnerService.hide();
	  })
	};


	changeStatus(row,trashValue, stringValue){
		console.log(row, trashValue);
		this.item = row;
		this.trashValue = trashValue;
		this.stringValue = stringValue;
	};



	ChangeStatus(guard,trashValue,stringValue){
		var shiftData;
		console.log('item value', guard);
		console.log('trashValue', trashValue);
		console.log('stringValue', stringValue);
	 	this.spinnerService.show();    

	    if(trashValue == 0){
	    	 shiftData = {
		      id: guard._id,
		      trashValue: 0,
		      value: stringValue
	    	}
    		console.log(shiftData);
    		this.securityService.moveRestoreGuradFromTrash(shiftData).subscribe((response) => {
		      console.log(response);  
		      this.spinnerService.hide();
		      this.getTrashGuards();  
		      if(stringValue == 'user'){
		      	this.toastr.success('Worker has restored successfully!');
		      }else{
		      	this.toastr.success('Shift has restored successfully!');
		      }
		      
	  		}); 
	    }else{

	    	if( stringValue == 'user'){
			 	shiftData = {
			      userId: guard._id
			    };
			    console.log(shiftData);
	    		this.securityService.DeleteGuard(shiftData).subscribe((response) => {
			      console.log(response);  
			      this.spinnerService.hide();
			      this.getTrashGuards();  
			      this.toastr.success('Worker has deleted successfully!');
		  		}); 

	    	}else{
    		  	shiftData = {
				    shiftId: guard._id
				 };
				console.log(shiftData);
				this.shiftService.DeleteShift(shiftData).subscribe((response) => {
				    console.log(response);  
				    this.spinnerService.hide();
				    this.getTrashGuards();
				    this.toastr.success('Shift has deleted successfully!');
				});
	    	};	  		
	    }    
	};

  	AssignId(row){
	    console.log(row);
	    this.guard = row;
  	};

  	assignId(rapidId, guard){
	    this.rapidId = '';
	    this.spinnerService.show();
	    var data = {
	      id: guard._id,
	      rapidId: rapidId
	    }
    	console.log(data);
    	this.securityService.AssignRapidId(data).subscribe((response) => {
	      	console.log(response);  
	      	this.spinnerService.hide();
	      	if(response.status == 0){
	        	this.getTrashGuards();  
	        	this.toastr.error('Rapid ID is already assigned to another worker!');
	      	}else{
	         	this.getTrashGuards();  
	        	this.toastr.success('Rapid ID is added to worker successfully!');	      
	      	}; 
    	}); 
  	};

  	getTrash(value){
  		this.value = value;
  		console.log(value);
  		if(value == 'user'){
  			this.rows = this.rows;
  		}else{
  			this.rows1 = this.rows1;
  		}
  	};

  	getExactDate(datevalue){
        // console.log(datevalue);
        // var date = datevalue.split('-'), finalDate;
        // console.log(date);

        // finalDate = date[2] + '-' + date[1] + '-' + date[0];
        // console.log(finalDate);

        // return finalDate;
      if(datevalue != null){
        var date = datevalue.split('-'), finalDate;
        if(date[2].length == 4){
        // finalDate = date[2] + '-' + date[1] + '-' + date[0];
        finalDate = date[0] + '-' + date[1] + '-' + date[2];
      }else{
        var str = date[2].split('T');
        // finalDate = date[0] + '-' + date[1] + '-' + str[0];
        date[2] = Number(date[2]);
        // console.log('date[2]', date[2]);
        if(date[2] < 10){
          date[2] = "0" + date[2];
          date[2] = date[2].toString();
        }

        finalDate = date[2] + '-' + date[1] + '-' + date[0];
      }
      return finalDate;
    }
  };

   getTime(start_time, end_time){
	  if(start_time != null){
	    var start, am , pm, end;
	    var start_time1 = start_time.split(':');
	    var end_time1 = end_time.split(':');
	    start_time = start_time1[0];
	    end_time = end_time1[0];
	    start = Number(start_time);
	    end = Number(end_time);
	    return start  + ':' + start_time1[1] + ' - ' + end + ':' + end_time1[1];
	  }   

	};

	getTimeAMPM(start_time){
	    if(start_time != null){
	      var start, am ;
	      var start_time1 = start_time.split(':');
	      start_time = start_time1[0];
	      start = Number(start_time)
	      return start  + ':' + start_time1[1];
	    }
	    
	};

	getAmPmTime(days){
    	for(var i = 0; i < days.length; i++){
	      	if(days[i].start_time != 0){
		        var time =  days[i].start_time  + ' - ' + days[i].end_time;  
		        return  time ; 
		        break;
	      	}
    	}
  	}

}
