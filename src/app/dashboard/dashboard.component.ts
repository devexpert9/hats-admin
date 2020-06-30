import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ShiftService } from '../services/shiftService';
import { LocationService } from '../services/locationService';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { GooglePlaceDirective } from "ngx-google-places-autocomplete/ngx-google-places-autocomplete.directive";
import { ComponentRestrictions } from "ngx-google-places-autocomplete/objects/options/componentRestrictions";
import { Address } from "ngx-google-places-autocomplete/objects/address";
import { Router } from '@angular/router';
import { Socket } from 'ng6-socket-io';
import { LoginService } from '../services/loginService';

declare var google: any;
declare var geocoder: any; 
const uploadFormData = new FormData();  
  
declare var $: any;

 
@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.css'],
	
})
export class DashboardComponent implements OnInit {
	VAPID_PUBLIC_KEY = "BHQNyAA6jyBSM-C2Sa2eWiKRN3Fu2UoW9S4cWlHY93v8Pd3ANWN6q2p52Dftm1Fc7zhGIMPeoc-Pj2RwAxo-v5c";
	authForm: FormGroup;
	viewShiftData: any;
	guardDetails: any;
	modalRef: any;
	closeResult: any;
	dash:any;
	rows1: any;
	userscount: any;
	viewGuardData: any;
	selectedFileProfile: any;
	viewGuardValue: any;
	guard: any;
	status: any;
	imageURL: any;
	profile: any;
	// Our future instance of DataTable
  	dataTable: any;
  	imageSrc: any;
  	fromGallery: any;
  	edit: any;
  	totalCount: any;

	constructor(private shiftService: ShiftService,private locationService: LocationService,private toastr: ToastrService,private modalService: NgbModal,public fb: FormBuilder,private spinnerService: Ng4LoadingSpinnerService, public router: Router, public loginService: LoginService, private chRef: ChangeDetectorRef) {
		
		if(localStorage.getItem('adminId') == undefined || localStorage.getItem('adminId') == '' || localStorage.getItem('adminId') == null){
			this.router.navigateByUrl('/');
		}
		this.DashboardCounts();
		this.createForm();
	}

	ngOnInit() {
		window.scrollTo(0, 0);		
	};

	closeModal(){
		this.modalRef.close();
	}

  	getAdminProfile() {
		var profileData = {
		    adminId: localStorage.getItem('adminId')
		};
		
		this.loginService.GetProfile(profileData).subscribe((response) => {
		    this.profile = response.data[0];
		});
	};


	createForm(){
    	this.authForm = this.fb.group({
	      	password: ['', Validators.compose([Validators.required])],
	      	firstname: ['', Validators.compose([Validators.required])],
	      	city: ['', Validators.compose([Validators.required])],
	      	country: ['', Validators.compose([Validators.required])],
	      	email: ['', Validators.compose([Validators.required, Validators.pattern('[A-Za-z0-9._%+-]{3,}@[a-zA-Z]{3,}([.]{1}[a-zA-Z]{2,}|[.]{1}[a-zA-Z]{2,}[.]{1}[a-zA-Z]{2,})')])],
	      	mobile: ['', Validators.compose([Validators.required, Validators.pattern('[0-9]{4,15}')])], 
	      	state: ['', Validators.compose([Validators.required])],  
	      	address: ['', Validators.compose([Validators.required])],
	      	gender: ['Male', Validators.compose([Validators.required])],
	      	dob: ['',  Validators.compose([Validators.required])],
	     	profile_image:[''],
   		});
  	};

  	formValid(){
	    if(this.authForm.valid){
	  		return false;
	    }else{
	      return true;
	    }   
  	}

	DashboardCounts(){
		this.spinnerService.show();
		this.shiftService.userlisting().subscribe((response) => {
			this.spinnerService.hide();
			this.rows1 = response.data;
		})
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


	viewGuard(guard){
		this.viewGuardData = guard;
	};

	EditGuard(value,editshift){
		
		this.guardDetails = value;
    	//set values on form
   		this.authForm.patchValue({
	        firstname: value.firstname,
	        city:  value.city,
	        country: value.country,
	        email: value.email,
	        state: value.state,
	        mobile: value.contact,
	        address: value.address,
	        gender: value.gender,
	        dob: value.dob,
	        profile_image: value.image,
	        password: value.password
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

	changeStatus(data, value){
		this.spinnerService.show();
		console.log(data, value);
		var Data = {
			id: data._id,
			status: value
		};
		this.securityService.ChangeStatusForGuards(Data).subscribe((response) => {
			console.log(response);
	    	// this.securityGuardsList = response;
		    this.spinnerService.hide();
		    this.getSecurityGuardsList();
		    if(response[0].adminStatus == 2){
		    	this.toastr.success('Worker has been approved successfully!');

		    }else if(response[0].adminStatus == 1){
		    	this.toastr.success('Worker has been declined successfully!');

		    }

		})
	};

	changeUserStatus(row, status){
		this.guard = row;
		this.status = status; 
	}

	changeActiveInctiveStatus(row, status){

		this.spinnerService.show();
		console.log(row, status);
		var Data = {
			id: row._id,
			status: status
		};

		this.securityService.ChangeStatusForGuards(Data).subscribe((response) => {
			console.log(response);
	    // this.securityGuardsList = response;
	    this.spinnerService.hide();
	    this.getSecurityGuardsList();
	    if(response[0].adminStatus == 2){
	    	this.toastr.success('Worker has been approved successfully!');

	    }else if(response[0].adminStatus == 1){
	    	this.toastr.success('Worker has been declined successfully!');

	    }

		})
	  // this.securityService.ChangeActiveInactiveStatusForGuards(Data).subscribe((response) => {
	  //   console.log(response);
	  //   // this.securityGuardsList = response;
	  //     this.spinnerService.hide();
	  //     this.getSecurityGuardsList();
	  // if(response[0].adminActiveInactiveStatus == 2){
	  // this.toastr.success('User is active now!');

	  // }else if(response[0].adminActiveInactiveStatus == 1){
	  // this.toastr.success('User is inactive now!');

	  // }

	  // });
	};


	DeleteGuard(row){
		this.guard = row;
	}

	deleteGuard(guard){
		this.spinnerService.show();
		var shiftData = {
			id: guard._id,
			trashValue: 1, 
			value:'user'
		}
		console.log(shiftData);
		this.securityService.moveRestoreGuradFromTrash(shiftData).subscribe((response) => {
			console.log(response);  
			this.spinnerService.hide();
			this.getSecurityGuardsList();  
			this.toastr.success('Worker has moved to trash successfully!');
	    // this.modalRef.close(); 

		}); 
	};

	getIndex(day, days){
		for(var i=0; i < days.length; i++){
			if(days[i].day == day){
				return i;
			}
		}
	};


	onKeydown(event) {
	  if (event.key === "Enter") {
	    console.log(event);
	    return false;
	  }else {
	    return true;
	  }
	};
}
