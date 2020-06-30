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

@Component({
  selector: 'app-roles-permissions',
  templateUrl: './roles-permissions.component.html',
  styleUrls: ['./roles-permissions.component.css']
})
export class RolesPermissionsComponent implements OnInit {

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
	shiftManagerPermissions: any;
	payrollManagerPermissions: any;
	selectValue: any;

  	constructor(public managerService: ManagerService, public securityService: SecurityService,public fb: FormBuilder, public loginService: LoginService,private spinnerService: Ng4LoadingSpinnerService,private toastr: ToastrService,private modalService: NgbModal, public shiftService: ShiftService , public router: Router) { 

	  	if(localStorage.getItem('adminId') == undefined || localStorage.getItem('adminId') == '' || localStorage.getItem('adminId') == null){
			this.router.navigateByUrl('/');
		};

  		this.createForm();
  		this.getAllPermissions123();
  		this.selectValue = 'shift';
  	}

	ngOnInit() {

	};

	createForm(){
  		this.authForm = this.fb.group({
    		availability: [''],
      		securityguard: [''],
      		location: [''],
      		client: [''],
      		shift: [''],
      		remark: [''],
      		report: [''],
      		businessreport: [''],
      		payroll: [''],
      		publicholiday: [''],
      		roaster: [''],
    	});
  	};

  	getPermissions(string){
  		console.log(string);
  		this.selectValue = string;
  		if(string == 'shift'){

			this.authForm.patchValue({
			      availability: this.shiftManagerPermissions.availability,
			      securityguard: this.shiftManagerPermissions.securityguard,
			      client: this.shiftManagerPermissions.client,
			      remark: this.shiftManagerPermissions.remark,
			      report: this.shiftManagerPermissions.report,
			      businessreport: this.shiftManagerPermissions.businessreport,
			      payroll: this.shiftManagerPermissions.payroll,
			      publicholiday: this.shiftManagerPermissions.publicholiday,
			      roaster: this.shiftManagerPermissions.roaster,
			});
  		}else{

			this.authForm.patchValue({
			      availability: this.payrollManagerPermissions.availability,
			      securityguard: this.payrollManagerPermissions.securityguard,
			      client: this.payrollManagerPermissions.client,
			      remark: this.payrollManagerPermissions.remark,
			      report: this.payrollManagerPermissions.report,
			      businessreport: this.payrollManagerPermissions.businessreport,
			      payroll: this.payrollManagerPermissions.payroll,
			      publicholiday: this.payrollManagerPermissions.publicholiday,
			      roaster: this.payrollManagerPermissions.roaster,
			});
  		}

  	};

 	getAllPermissions123(){
		this.spinnerService.show();
  		console.log(this.authForm.value);
  		this.managerService.GetPermissions().subscribe((response) => {
  				
  					this.shiftManagerPermissions = response.data[0];
  					this.payrollManagerPermissions = response.data[1];
  			
	        console.log(response);
	        if(this.selectValue == 'shift'){
	        	this.authForm.patchValue({
			      availability: response.data[0].availability,
			      securityguard: response.data[0].securityguard,
			      client: response.data[0].client,
			      remark: response.data[0].remark,
			      report: response.data[0].report,
			      businessreport: response.data[0].businessreport,
			      payroll: response.data[0].payroll,
			      publicholiday: response.data[0].publicholiday,
			      roaster: response.data[0].roaster,
				});
	        }else{

	        	this.authForm.patchValue({
			      availability: response.data[1].availability,
			      securityguard: response.data[1].securityguard,
			      client: response.data[1].client,
			      remark: response.data[1].remark,
			      report: response.data[1].report,
			      businessreport: response.data[1].businessreport,
			      payroll: response.data[1].payroll,
			      publicholiday: response.data[1].publicholiday,
			      roaster: response.data[1].roaster,
				});

	        }

	    
	        this.spinnerService.hide();	   
      	});
	};

	editPermissions(selectValue){
		
		var permissiondata;
		if(selectValue == 'shift'){
			permissiondata = {
				availability: this.authForm.value.availability,
			    securityguard: this.authForm.value.securityguard,
			    client: this.authForm.value.client,
			    remark: this.authForm.value.remark,
			    report: this.authForm.value.report,
			    businessreport: this.authForm.value.businessreport,
			    payroll: this.authForm.value.payroll,
			    publicholiday: this.authForm.value.publicholiday,
			    roaster: this.authForm.value.roaster,
			    status: selectValue
			};
		}else{
			permissiondata = {
				availability: this.authForm.value.availability,
			    securityguard: this.authForm.value.securityguard,
			    client: this.authForm.value.client,
			    remark: this.authForm.value.remark,
			    report: this.authForm.value.report,
			    businessreport: this.authForm.value.businessreport,
			    payroll: this.authForm.value.payroll,
			    publicholiday: this.authForm.value.publicholiday,
			    roaster: this.authForm.value.roaster,
			    status: selectValue
			};
		}

		if(permissiondata.availability == false && permissiondata.securityguard == false && permissiondata.client == false && permissiondata.remark == false && permissiondata.report == false && permissiondata.businessreport == false && permissiondata.payroll == false && permissiondata.publicholiday == false && permissiondata.roaster == false){
				this.toastr.error('Please select atleast one permission!')
		}else{
			this.spinnerService.show();
			this.managerService.UpdatePermissions(permissiondata).subscribe((response) => {			
        		console.log(response);
        		this.toastr.success('Permissions has been updated!');
	       		this.getAllPermissions123();
	        	this.spinnerService.hide();	   
  			});
		};

	


	}

}
