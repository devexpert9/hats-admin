import { Component, OnInit } from '@angular/core';
import { SecurityService } from '../services/securityService';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoginService } from '../services/loginService';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ToastrService } from 'ngx-toastr';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { ShiftService } from '../services/shiftService';
import { Router } from '@angular/router';
// import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

const uploadFormData = new FormData();

@Component({
  selector: 'app-public-holiday',
  templateUrl: './public-holiday.component.html',
  styleUrls: ['./public-holiday.component.css']
})
export class PublicHolidayComponent implements OnInit {
	modalRef: any;
	closeResult: any;
	authForm: FormGroup;
	rows:any;
	holidayDetail: any;
	holiday: any;
	temp: any;
	status: any;

  	constructor(public securityService: SecurityService,public fb: FormBuilder, public loginService: LoginService,private spinnerService: Ng4LoadingSpinnerService,private toastr: ToastrService,private modalService: NgbModal, public shiftService: ShiftService , public router: Router ) { 

  		if(localStorage.getItem('adminId') == undefined || localStorage.getItem('adminId') == '' || localStorage.getItem('adminId') == null){
		    this.router.navigateByUrl('/');
		};

  		this.createForm();
  		this.getHoliday();

 	}

	ngOnInit() {
		window.scrollTo(0, 0);
	}

    createForm(){
  	   this.authForm = this.fb.group({
    		name: ['', Validators.compose([Validators.required, Validators.pattern("^(?=.*[A-Za-z])[A-Za-z0-9_ \d]{1,}$")])],
      		select_date: ['', Validators.compose([Validators.required])],
       		status: ['true']
    	});
  	};

  	getHoliday(){
		this.spinnerService.show();
  		console.log(this.authForm.value);
  		this.securityService.GetHoliday().subscribe((response) => {
	        console.log(response);
	        this.rows = response.data;
	        this.temp = response.data;
	        this.spinnerService.hide();	   
      	});

	};


	addNewHoliday(addHoliday){
	    console.log('addHoliday');
	    this.authForm.reset();
	    this.authForm.patchValue({
	      name:'',
	      select_date: '',
	      status: true
	    });

	    this.authForm.get('name').setErrors(null);        
	    this.authForm.get('select_date').setErrors(null);        
	    this.authForm.get('status').setErrors(null);        

	    this.modalRef = this.modalService.open(addHoliday);
	    this.modalRef.result.then((result) => {
	      //  console.log(result);
	      this.closeResult = `Closed with: ${result}`;
	    }, (reason) => {
	      // console.log(reason);
	      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
	    });
  	};

  	private getDismissReason(reason: any): string {
		if (reason === ModalDismissReasons.ESC) {
		    return 'by pressing ESC';
		} else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
		    return 'by clicking on a backdrop';
		} else {
		    return  'with:${reason}';
		}
	};



	addHolidayValue(){
		this.spinnerService.show();
  		this.securityService.AddHoliday(this.authForm.value).subscribe((response) => {	
  			if(response.status == 2){
  				this.toastr.error('Selected date already exist');
  			}else{
  				console.log(response);
		        this.spinnerService.hide();
		        this.toastr.success('Holiday has been added successfully!');
		        this.getHoliday();	 
		        this.modalRef.close();  
  			} 
      	});
	};

	closeModal(){
    	this.modalRef.close();
    	this.authForm.reset();
  	};

  	EditHoliday(value,editholiday){
	    //set values on form
	    this.holidayDetail = value;
	    this.authForm.patchValue({
	      name: value.name,
	      status: value.status,
	      select_date: value.select_date
	    });

	  	this.modalRef = this.modalService.open(editholiday);
	  	this.modalRef.result.then((result) => {
	      	//  console.log(result);
	      	this.closeResult = `Closed with: ${result}`;
	    }, (reason) => {
	      // console.log(reason);
	      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
	    });
	};


	updateHolidayValue(){
	  	this.spinnerService.show();
	  	console.log(this.authForm.value); 
	  	var data = {
		  	_id: this.holidayDetail._id,
		  	name: this.authForm.value.name,
		  	status: this.authForm.value.status,
		  	select_date: this.authForm.value.select_date
	  	}
    	this.securityService.UpdateHoliday(data).subscribe((response) => {
		    console.log(response); 
		    if(response.status == 2){
  				this.toastr.error('Selected date already exist');
  			}else{       
			    this.spinnerService.hide(); 
			    this.getHoliday();         
			    this.toastr.success('Holiday has been updated successfully!');
			    this.modalRef.close();
			}
	    });    
  	};


	 DeleteHoliday(row){
	    this.holiday = row;
	  }

	 deleteholiday(holiday){
	    this.spinnerService.show();
	    var data = {
	      _id: holiday._id
	    }
	    console.log(data);
	    this.securityService.DeleteHoliday(data).subscribe((response) => {
		      console.log(response);  
		      this.spinnerService.hide();
		      this.getHoliday();  
		      this.toastr.success('Holiday has been deleted successfully!');
		    // this.modalRef.close(); 

	  	}); 
	};


	updateFilter(event) {
	    const val = event.target.value.toLowerCase();

	    // filter our data
	    const temp = this.temp.filter(function(d) {
	      
	      return  d.name.toLowerCase().indexOf(val) !== -1 || !val ;
	    });

	    // update the rows
	    this.rows = temp;
	};


	getExactDate(datevalue){
	    if(datevalue != null){
	        var date = datevalue.split('-'), finalDate;
	        if(date[2].length == 4){
		        // finalDate = date[2] + '-' + date[1] + '-' + date[0];
		        finalDate = date[0] + '-' + date[1] + '-' + date[2];
		    }else{
		        var str = date[2].split('T');
		        // finalDate = date[0] + '-' + date[1] + '-' + str[0];
		        finalDate = str[0] + '-' + date[1] + '-' + date[0];
		    }
	      	return finalDate;
	    };
  	};

  	changeStatus(row, value){
  		this.status = {
  			'row': row,
  			'status': value
  		};
  	};

  	Changestatus(){
  		this.spinnerService.show();
  		var data = {
  			_id: this.status.row._id,
  			status: this.status.status,
  			value: 'client'
  		};

		this.securityService.ChangeStatus(data).subscribe((response) => {
	        console.log(response);
	        this.getHoliday();
	        this.toastr.success('Status has been updated successfully!');	        
	        this.spinnerService.hide();	   
	  	});
  	}


}
