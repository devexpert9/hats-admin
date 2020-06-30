import { Component, OnInit } from '@angular/core';
import { SecurityService } from '../services/securityService';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoginService } from '../services/loginService';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ToastrService } from 'ngx-toastr';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { ShiftService } from '../services/shiftService';
import { ClientService } from '../services/clientService';
import { Router } from '@angular/router';
import { LocationService } from '../services/locationService';
// import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';


const uploadFormData = new FormData();

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css']
})
export class ClientsComponent implements OnInit {

	securityGuardsList: any;
  	viewGuardData: any;
  	imageURL: any;
  	authForm: FormGroup;
  	guardDetails: any;
  	previewProfile: any;
  	previewLicense: any;
  	selectedFileProfile: any;
  	selectedFileLicense: any;
  	imagePreviewProfile: any;
  	imagePreviewLicense: any;
  	modalRef: any;
  	closeResult: any;
  	rows: any;
  	guard: any;
  	profile: any;
  	viewGuardAllShift: any;
  	formatted_current_time: any;
  	formatted_current_date: any;
  	shifts: any;
  	rows1: any;
  	currentShift: any;
  	finalDate:any;
  	finalExpDate: any;
  	viewShiftData: any;
  	rows2: any;
  	viewGuardValue: any;
  	shiftType: any;
  	longitude: any;
  	latitude: any;
  	status: any;
  	temp: any;
  	rapidId: any;
  	location: any;
  	constructor(public  locationService: LocationService, public clientService: ClientService, public securityService: SecurityService,public fb: FormBuilder, public loginService: LoginService,private spinnerService: Ng4LoadingSpinnerService,private toastr: ToastrService,private modalService: NgbModal, public shiftService: ShiftService , public router: Router ) {

  		 this.rapidId = '';
    
	    if(localStorage.getItem('adminId') == undefined || localStorage.getItem('adminId') == '' || localStorage.getItem('adminId') == null){
	      this.router.navigateByUrl('/');
	    };

	    this.spinnerService.show();
	    this.getClients();
	    this.createForm();
	    this.imageURL = 'http://13.59.189.135:3002/images/';
	    this.previewProfile = false;

	      //get formatted current date   YYYY-MM-DD
      	var current_date = new Date();
      	var isodate = current_date.toISOString();
      	var index = isodate.lastIndexOf('T');
      	this.formatted_current_date = isodate.slice(0,index);

	    //get formatted current time   HH:MM
	    var current_time = current_date.toLocaleTimeString();
	    var z = current_time.lastIndexOf(':');
	    this.formatted_current_time = current_time.slice(0,z); 

	    this.guardDetails = {
	      profile_image: ''
	    };

  	};

	ngOnInit() {
		window.scrollTo(0, 0);
	};

	changeStatus(row, value){
  		this.location = row;
  		this.status = value;
  	};

  	Changestatus(row,value){
  		this.spinnerService.show();
  		var data = {
  			_id: row._id,
  			status: value,
  			value: 'client'
  		};

		this.locationService.ChangeStatus(data).subscribe((response) => {
	        console.log(response);
	        this.getClients();
	        this.toastr.success('Status has changed successfully!');	        
	        this.spinnerService.hide();	   
	  	});
  	}

	updateFilter(event) {
	    const val = event.target.value.toLowerCase();

	    // filter our data
	    const temp = this.temp.filter(function(d) {
	      
	      return  d.name.indexOf(val) !== -1 || !val ;
	    });

	    // update the rows
	    this.rows = temp;
  	};

  	createForm(){
	   	this.authForm = this.fb.group({
	    name: ['', Validators.compose([Validators.required])],
	    email: ['', Validators.compose([Validators.required, Validators.pattern('[A-Za-z0-9._%+-]{3,}@[a-zA-Z]{3,}([.]{1}[a-zA-Z]{2,}|[.]{1}[a-zA-Z]{2,}[.]{1}[a-zA-Z]{2,})')])],
       	contact: ['', Validators.compose([Validators.required, Validators.pattern('[0-9]{4,15}')])],
      	address: ['', Validators.compose([Validators.required])],
  	 	city: ['', Validators.compose([Validators.required,Validators.pattern('^[a-zA-Z \-\']+')])],
 	 	country: ['', Validators.compose([Validators.required,Validators.pattern('^[a-zA-Z \-\']+')])],
      	profile_image: [null],
      	gender: ['', Validators.compose([Validators.required])],
      	status: [''],
	    });	   
 	};

 	getClients() {
	  	var Data = {
		    adminId: localStorage.getItem('adminId')
	  	};
	  	this.clientService.GetClients().subscribe((response) => {
		    console.log(response);
		    this.securityGuardsList = response;
		    this.rows = response.data;
		    this.temp = response.data;
		    this.spinnerService.hide();
	  	});
	};


	addNewSecurityGuard(addGuard){
	    console.log('addnewsecurityguard');
	    // this.authForm.patchValue({
		   //    name:'',
		   //    email: '',
		   //    contact: '',
		   //    address:'',
		   //    city:'',
		   //    country: '',
		   //    profile_image: '',
		   //    gender: ''
	    // });
	    this.authForm.reset();

	    this.guardDetails = {
	      profile_image: '',
	    };

	    this.previewProfile = false;

	    this.modalRef = this.modalService.open(addGuard);
	    this.modalRef.result.then((result) => {
	      	//  console.log(result);
	      	this.closeResult = `Closed with: ${result}`;
	    }, (reason) => {
	      	// console.log(reason);
	      	this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
	    });
  	};

  	AddGuard(){
  var isSpinner = false;
  this.spinnerService.show();
  console.log(this.authForm.value);
 if(this.previewProfile == true){
    uploadFormData.append('image', this.selectedFileProfile, this.selectedFileProfile.name);
    this.loginService.UploadImage(uploadFormData).subscribe((response) => {
      console.log(response);
      this.authForm.value.profile_image = response;
      console.log(this.authForm.value);
      this.clientService.AddClient(this.authForm.value).subscribe((response) => {
        console.log(response);
        this.spinnerService.hide();   

       	if(response.status == 2){
        	this.toastr.error('Email is already exist, Please try another one!');  
        }else{	
    	  	this.toastr.success('Client has been added successfully!');
	        this.previewProfile = false;

	        this.getClients();
	        // this.router.navigateByUrl('/requested-guards');
	        this.modalRef.close();
        };   
       
      });        
    });
  }else{
    console.log(this.authForm.value);
    this.authForm.value.profile_image = '';
    this.clientService.AddClient(this.authForm.value).subscribe((response) => {
      	console.log(response);        
      	this.spinnerService.hide(); 
   	 	if(response.status == 2){
        	this.toastr.error('Email is already exist, please try another one!');  
        }else{	
		  	this.toastr.success('Client has been added successfully!');
			this.getClients();
      		this.modalRef.close();
    	};         
      
    });    
  }
};




	viewGuard(guard){
	  console.log(guard);
	  this.viewGuardData = guard;
	  
	};


	EditGuard(value, index,editshift, uservalue){
  		// this.guardDetails = {};
	  	console.log('value edit ', value,editshift);
	  	this.guardDetails = value;
	  	this.viewGuardValue = uservalue;
	  	var finalDate, finalExpDate, finalStartDate;

 
	    //set values on form
	    this.authForm.patchValue({
	      	name: value.name,
	      	contact: value.contact,
	      	address: value.address,
	      	city: value.city,
		 	email: value.email,
	      	country: value.country,
	      	profile_image: value.profile_image,
	       	gender: value.gender,
	       	status: value.status
	    }); 
 
 

	  	this.modalRef = this.modalService.open(editshift);
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


	UpdateGuardInfo(){
  		this.spinnerService.show();
  		console.log(this.authForm.value);
		if(this.previewProfile == true){
	    	uploadFormData.append('image', this.selectedFileProfile, this.selectedFileProfile.name);
	    	this.loginService.UploadImage(uploadFormData).subscribe((response) => {
		      	console.log(response);
		      	this.authForm.value.profile_image = response;
		      	console.log(this.authForm.value);
		      	this.clientService.UpdateClient(this.authForm.value, this.guardDetails._id).subscribe((response) => {
			        console.log(response);
			        this.spinnerService.hide(); 

		        	if(response.status == 2){
				    	this.toastr.error('Email is already exits, Please try another one!');  
			    	}else{	
					  	this.getClients();
				        this.toastr.success('Client has been updated successfully!');
				        this.previewProfile = false;
				        this.modalRef.close();
			    	}; 

			        
		      	});        
	    	});
	  	}else{
		    console.log(this.authForm.value);
		    this.clientService.UpdateClient(this.authForm.value, this.guardDetails._id).subscribe((response) => {
		      	console.log(response);        
		      	this.spinnerService.hide(); 

		     if(response.status == 2){
				    	this.toastr.error('Email is already exits, Please try another one!');  
			    	}else{	
				  	this.getClients();         
			      	this.toastr.success('Client has been updated successfully!');
		    	  	this.modalRef.close();
		    	};

		      	
	    	});    
		}
  	};


	onProfileImageChanged(event) {
	  	this.previewProfile = true;
	  	var selectedFileProfile = event.target.files[0];
	  	this.selectedFileProfile = selectedFileProfile;
	  	this.authForm.get('profile_image').setValue(selectedFileProfile);
	  	console.log(event.target, event.target.files[0])
	  	const reader = new FileReader();
	  	reader.onload = () => {
	    	this.imagePreviewProfile = reader.result;
	  	};
	  	reader.readAsDataURL(selectedFileProfile);
	};


	closeModal(){
		this.modalRef.close();
	};


	DeleteGuard(row){
	    this.guard = row;
	};

  	deleteGuard(guard){
	    this.spinnerService.show();
	    var shiftData = {
	      _id: guard._id
	    }
	    console.log(shiftData);
	    this.clientService.DeleteClient(shiftData).subscribe((response) => {
	      	console.log(response);  
	      	this.spinnerService.hide();
	      	if(response.status == 0){
	      		this.toastr.error('You are not authorised to delete this client because location/address is associated with the client.');
	      	}else{
		      	this.getClients();  
		      	this.toastr.success('Client has been deleted successfully!');
	      	}
	      	
	  	}); 
  	};



}
