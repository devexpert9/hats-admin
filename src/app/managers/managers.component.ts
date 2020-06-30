import { Component, OnInit } from '@angular/core';
import { SecurityService } from '../services/securityService';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoginService } from '../services/loginService';
import { ManagerService } from '../services/managerService';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ToastrService } from 'ngx-toastr';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { ShiftService } from '../services/shiftService';
import { Router } from '@angular/router';

const uploadFormData = new FormData();
declare var $: any;


@Component({
  selector: 'app-managers',
  templateUrl: './managers.component.html',
  styleUrls: ['./managers.component.css']
})
export class ManagersComponent implements OnInit {

	modalRef: any;
	closeResult: any;
	authForm: FormGroup;
	rows:any;
	holidayDetail: any;
	holiday: any;
	temp: any;
	previewProfile: any;
	managerDetails: any;
	imagePreviewProfile: any;
	selectedFileProfile:any;
	imageURL: any;
	status: any;
	viewManagerData: any;
	dataTable: any;

  	constructor(public managerService: ManagerService, public securityService: SecurityService,public fb: FormBuilder, public loginService: LoginService,private spinnerService: Ng4LoadingSpinnerService,private toastr: ToastrService,private modalService: NgbModal, public shiftService: ShiftService , public router: Router ) { 
	  	if(localStorage.getItem('adminId') == undefined || localStorage.getItem('adminId') == '' || localStorage.getItem('adminId') == null){
			    this.router.navigateByUrl('/');
			};

	  		this.createForm();
	  		this.getManagers();

	  		this.previewProfile = false;
  			this.managerDetails = {
		      image: ''
		    };
		    this.imageURL = 'http://13.59.189.135:3002/images/';

		    

		    this.managerDetails = {
			      image: ''
			};
	 }

  	ngOnInit() {
  		window.scrollTo(0, 0);
  	};

  	createForm(){
  		this.authForm = this.fb.group({
    		firstname: ['', Validators.compose([Validators.required])],
    		lastname: ['', Validators.compose([Validators.required])],
      		contact: ['', Validators.compose([Validators.required, Validators.pattern('[0-9]{4,15}')])],
      		address: ['', Validators.compose([Validators.required])],
      		city: ['', Validators.compose([Validators.required,Validators.pattern('^[a-zA-Z \-\']+')])],
     	 	country: ['', Validators.compose([Validators.required,Validators.pattern('^[a-zA-Z \-\']+')])],
      		
      		zipcode: ['', Validators.compose([Validators.required,Validators.pattern('[0-9]{4,8}')])],
      		email: ['', Validators.compose([Validators.required, Validators.pattern('[A-Za-z0-9._%+-]{3,}@[a-zA-Z]{3,}([.]{1}[a-zA-Z]{2,}|[.]{1}[a-zA-Z]{2,}[.]{1}[a-zA-Z]{2,})')])],
      		role: ['', Validators.compose([Validators.required])],
      		username: ['', Validators.compose([Validators.required])],
      		password: ['', Validators.compose([Validators.required])],
      		image: [''],
    	});
  	};

 	getManagers(){
		this.spinnerService.show();
  		console.log(this.authForm.value);
  		this.managerService.GetManagers().subscribe((response) => {
	        console.log(response);
	        this.rows = response.data;

	   //      setTimeout(function(){
	   //      	;
    //   			const table: any = $('.tab1');
	   //  		console.log(table)
				// this.dataTable = table.DataTable();
    //   		}, 1500);
	        this.temp = response.data;
	        this.spinnerService.hide();	   
      	});

	};


	closeModal(){
		this.modalRef.close();
	};


	onProfileImageChanged(event) {
	  this.previewProfile = true;
	  var selectedFileProfile = event.target.files[0];
	  this.selectedFileProfile = selectedFileProfile;
	  this.authForm.get('image').setValue(selectedFileProfile);
	  console.log(event.target, event.target.files[0])
	  const reader = new FileReader();
	  reader.onload = () => {
	    this.imagePreviewProfile = reader.result;
	  };
	  reader.readAsDataURL(selectedFileProfile);
	};

	addNewManager(addManager){

	    this.authForm.reset();
	    this.managerDetails = {
	      	image: ''
		};
	    this.previewProfile = false;

	    this.modalRef = this.modalService.open(addManager);
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

	addManagerValue(){
		this.spinnerService.show();
  		console.log(this.authForm.value);

  		if(this.previewProfile == true){
		    uploadFormData.append('image', this.selectedFileProfile, this.selectedFileProfile.name);
		    this.loginService.UploadImage(uploadFormData).subscribe((response) => {
		      console.log(response);
		      this.authForm.value.image = response;
		      console.log(this.authForm.value);
		      this.managerService.AddManager(this.authForm.value).subscribe((response) => {
		        console.log(response);
		        this.spinnerService.hide();  
	            if(response.status == 2){
		        	this.toastr.error('Username is already exist, Please try another one!');
		        	
		        }else if(response.status == 3){
        			this.toastr.error('Email is already exist, Please try another one!');  
	        	}else{	
		        	 // this.spinnerService.hide();  
	        	 	this.toastr.success('User role has been added successfully!');
		       	 	this.getManagers();	 
		        	this.modalRef.close(); 
		        	setTimeout(function(){
			  			const table: any = $('.tab1');
			    		console.log(table)
						this.dataTable = table.DataTable();
			  		}, 1000);
		        };

		      });        
		    });

		  }else{
		    console.log(this.authForm.value);
		    this.authForm.value.image = '';
		    this.managerService.AddManager(this.authForm.value).subscribe((response) => {
		      	console.log(response);        
		      	this.spinnerService.hide(); 
   	     	  	if(response.status == 2){
		        	this.toastr.error('Username is already exist, Please try another one!');
		        	
		        }else if(response.status == 3){
        			this.toastr.error('Email is already exist, Please try another one!');  
	        	}else{	
		        	 // this.spinnerService.hide();  
		        	 this.toastr.success('User role has been added successfully!');
		       	 	this.getManagers();	 
		        	this.modalRef.close(); 
		        }; 
		        setTimeout(function(){
		  			const table: any = $('.tab1');
		    		console.log(table)
					this.dataTable = table.DataTable();
		  		}, 1000);
		    });    
		  };
	};


	EditManager(value,editmanager){
		this.managerDetails = value;
		this.previewProfile = false;

		this.authForm.patchValue({
		      firstname: value.firstname,
		      lastname: value.lastname,
		      contact: value.contact,
		      address: value.address,
		      city: value.city,
		      country: value.country,
		      zipcode: value.zipcode,
		      role: value.role,
		      image: value.image,
		      email: value.email,
		      username: value.username,
		      password: value.password,
		}); 
	 

		this.modalRef = this.modalService.open(editmanager);
		this.modalRef.result.then((result) => {
		      //  console.log(result);
		      this.closeResult = `Closed with: ${result}`;
		}, (reason) => {
		      // console.log(reason);
		      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
		});
	};


	editManagerValue(){
		var managerData;
		this.spinnerService.show();
		if(this.previewProfile == true){
    		uploadFormData.append('image', this.selectedFileProfile, this.selectedFileProfile.name);
    		this.loginService.UploadImage(uploadFormData).subscribe((response) => {
		      	console.log(response);
		      	this.authForm.value.image = response;
		      	console.log(this.authForm.value);

		      	managerData = {
			  	 	firstname: this.authForm.value.firstname,
			  	 	lastname: this.authForm.value.lastname,
			      	contact: this.authForm.value.contact,
			      	address: this.authForm.value.address,
			      	city: this.authForm.value.city,
			      	country: this.authForm.value.country,
			      	zipcode: this.authForm.value.zipcode,
			      	role: this.authForm.value.role,
			      	status: this.managerDetails.status,
			      	image: response,
			      	email: this.authForm.value.email,
			      	username: this.authForm.value.username,
			      	password: this.authForm.value.password,
			      	id: this.managerDetails._id,
		      	}
	      		this.managerService.UpdateManager(managerData).subscribe((response) => {
			        console.log(response);
			        this.spinnerService.hide();
			        this.getManagers();	 
			        this.modalRef.close();         
	      		});        
    		});
  		}else{
		    console.log(this.authForm.value);
	    	managerData = {
		  	 	firstname: this.authForm.value.firstname,
			  	lastname: this.authForm.value.lastname,
		      	contact: this.authForm.value.contact,
		      	address: this.authForm.value.address,
		      	city: this.authForm.value.city,
		      	country: this.authForm.value.country,
		      	zipcode: this.authForm.value.zipcode,
		      	role: this.authForm.value.role,
		      	status: this.managerDetails.status,
		      	image: this.authForm.value.image,
		      	email: this.authForm.value.email,
		      	username: this.authForm.value.username,
			    password: this.authForm.value.password,
		      	id: this.managerDetails._id,
	      	};

		    this.managerService.UpdateManager(managerData).subscribe((response) => {
		      	console.log(response);        
		      	this.spinnerService.hide();
       			if(response.status == 2){
	        	this.toastr.error('Username is already exist, Please try another one!');
		        	
		        }else if(response.status == 3){
        			this.toastr.error('Email is already exist, Please try another one!');  
	        	}else{	
		        	 // this.spinnerService.hide();  
		        	 this.toastr.success('User role has been updated successfully!');
		       	 	this.getManagers();	 
		        	this.modalRef.close(); 
		        }; 
			      // this.getManagers();	 
			      // this.modalRef.close();
		    });    
  		}
	};



	DeleteManager(row){
    	this.managerDetails = row;
  	};

  	deleteManager(manager){
	    this.spinnerService.show();
	    var managerData = {
	      _id: manager._id
	    }
    	this.managerService.DeleteManager(managerData).subscribe((response) => {
      		console.log(response);  
	      	this.spinnerService.hide();
	      	this.getManagers();  
	      	this.toastr.success('User role has been deleted successfully!');    	
  		}); 
  	};


  	ChangeStatus(row, value){
  		this.managerDetails = row;
  		this.status = value;
  	};

  	changeStatus(row,value){
  		this.spinnerService.show();
  		var data = {
  			_id: row._id,
  			status: value
  		};

  		this.managerService.ChangeStatus(data).subscribe((response) => {
	        console.log(response);
	        this.getManagers();
	        this.toastr.success('Status has changed successfully!');	        
	        this.spinnerService.hide();	   
	  	});
  	};


  	updateFilter(event) {
    const val = event.target.value.toLowerCase();
    var temp;

   	temp = this.temp.filter(function(d) {

        if(d){
          return d.firstname.toLowerCase().indexOf(val) !== -1 || !val || d.lastname.toLowerCase().indexOf(val) !== -1 ;
        }   
  	});   

    // update the rows
    this.rows = temp;
  };

  ViewManager(row){
  	console.log(row)
  	this.viewManagerData = row;
  }

}
