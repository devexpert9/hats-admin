import { Component, OnInit } from '@angular/core';
import { SecurityService } from '../services/securityService';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoginService } from '../services/loginService';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ToastrService } from 'ngx-toastr';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { ShiftService } from '../services/shiftService';
import { LocationService } from '../services/locationService';
import { ClientService } from '../services/clientService';
import { Router } from '@angular/router';
import { GooglePlaceDirective } from "ngx-google-places-autocomplete/ngx-google-places-autocomplete.directive";
import { ComponentRestrictions } from "ngx-google-places-autocomplete/objects/options/componentRestrictions";
import { Address } from "ngx-google-places-autocomplete/objects/address";
// import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

declare var google: any;

@Component({
  selector: 'app-locations',
  templateUrl: './locations.component.html',
  styleUrls: ['./locations.component.css']
})
export class LocationsComponent implements OnInit {
	authForm: FormGroup;
	rows: any;
	location: any;
	locationDetail: any;
	modalRef: any;
	closeResult: any;
	temp: any;
	clientsList: any;
	map: any;
  	latitude: any;
  	longitude: any;
  	formatted_address: any;
  	viewLocationData: any;
  	status: any;
  	clientsListAll: any;
  	image: any;

  	constructor(public clientService : ClientService, public securityService: SecurityService,public fb: FormBuilder, public loginService: LoginService,private spinnerService: Ng4LoadingSpinnerService,private toastr: ToastrService,private modalService: NgbModal, public shiftService: ShiftService , public router: Router, public locationService: LocationService ) { 


  		if (localStorage.getItem('adminId') == undefined || localStorage.getItem('adminId') == '' || localStorage.getItem('adminId') == null)
	    {
	      this.router.navigateByUrl('/');
	    };

  		this.createForm();
  		this.getLocations();
  		this.getClients();

  		this.clientsList = [];
  		this.latitude = 30.7333148;
    	this.longitude = 76.7794179;

    	const geocoder = new google.maps.Geocoder();
    	const latlng1 = new google.maps.LatLng(this.latitude, this.longitude);
	    const request = {
	      latLng: latlng1
	    };

	    geocoder.geocode(request, (results, status) => {
	      var formatted_address = results[0].formatted_address;
	      this.authForm.patchValue({
	        address: formatted_address
	      });
	      this.formatted_address = formatted_address;
	     
	    });


	    this.image = {
		    url: '../assets/images/pin1.png',
		    scaledSize: {
		        width: 40,
		        height: 60
		    }
		};
  	}

  	ngOnInit() {
  		window.scrollTo(0, 0);
  	};

  	changeStatus(row, value){
  		this.location = row;
  		this.status = value;
  	}

  	Changestatus(row,value){
  		this.spinnerService.show();
  		var data = {
  			_id: row._id,
  			status: value,
  			value: 'location'
  		};

  		this.locationService.ChangeStatus(data).subscribe((response) => {
	        console.log(response);
	        this.getLocations();
	        this.toastr.success('Status has changed successfully!');	        
	        this.spinnerService.hide();	   
      	});
  	}


  	createForm(){
	   this.authForm = this.fb.group({
	    	address: ['', Validators.compose([Validators.required])],
	      	geofence: ['', Validators.compose([Validators.required])],
	      	instruction: [''],
	      	client: ['', Validators.compose([Validators.required])],
	    });
 	};


 	getLocations(){
		this.spinnerService.show();
  		console.log(this.authForm.value);
  		this.locationService.GetLocation().subscribe((response) => {
	        console.log(response);
	        this.rows = response.data;
	        this.temp = response.data;
	        this.spinnerService.hide();	   
      	});

	};

  	addNewLocation(addLocation){
	    console.log('addNewLocation');
	    // this.authForm.patchValue({
		   //  address:this.formatted_address,
		   //  geofence: '',
		   //  instruction: '',
		   //  client:''
	    // });

	  	this.authForm.reset();




	    this.modalRef = this.modalService.open(addLocation);
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

	closeModal(){
		this.modalRef.close();
	};

	AddLocation(){
		this.spinnerService.show();
  		console.log(this.authForm.value);
  		var address = {
	        location: this.formatted_address,
	        latitude: this.latitude,
	        longitude: this.longitude
	    };
  		var geofancing = {
  			latitude: this.authForm.value.latitude,
  			longitude: this.authForm.value.longitude,
  		}
  		var data = {
  			address: address,
  			instruction: this.authForm.value.instruction,
  			client: this.authForm.value.client,
  			geofence: this.authForm.value.geofence,
  		}
  		this.locationService.AddLocation(data).subscribe((response) => {
        console.log(response);
        this.spinnerService.hide();     
        this.getLocations(); 
      	this.toastr.success('Location has been added successfully!');
      	this.modalRef.close();
        })
        
	};


  	EditLocation(value,editLocation){
	    //set values on form
	    this.locationDetail = value;
	    this.latitude = value.address.latitude;
	    this.longitude = value.address.longitude;
	    this.formatted_address = value.address.location;
	    
	    this.authForm.patchValue({
	      address: value.address.location,
	      geofence: value.geofence,
	      // longitude: value.geofancing.longitude,
	      instruction: value.instruction,
	      client: value.client._id,
	    });

	  	this.modalRef = this.modalService.open(editLocation);
	  	this.modalRef.result.then((result) => {
	      	//  console.log(result);
	      	this.closeResult = `Closed with: ${result}`;
	    }, (reason) => {
	      // console.log(reason);
	      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
	    });
	};


	UpdateLocation(){
	  	this.spinnerService.show();
	  	console.log(this.authForm.value);

	  	var address = {
	        location: this.formatted_address,
	        latitude: this.latitude,
	        longitude: this.longitude
	    }; 
	  	var geofancing = {
	    	latitude: this.authForm.value.latitude,
	    	longitude: this.authForm.value.longitude
	    }
	  	var data = {
		  	address: address,
		  	instruction: this.authForm.value.instruction,
		  	client: this.authForm.value.client,
		  	geofence: this.authForm.value.geofence,
		  	_id: this.locationDetail._id
	  	}
    	this.locationService.UpdateLocation(data).subscribe((response) => {
		    console.log(response);        
		    this.spinnerService.hide(); 

		    if(response.status == 1){
		    	this.getLocations();         
		    	this.toastr.success('Location has been updated successfully!');
		    }else{
		    	this.toastr.error('You can not edit client or location details. ');
		    }
		    
		    this.modalRef.close();
	    });    
  	};


	 DeleteLocation(row){
	    this.location = row;
	  }

	 deleteLocation(location){
	    this.spinnerService.show();
	    var data = {
	      _id: location._id
	    }
	    console.log(data);
	    this.locationService.DeleteLocation(data).subscribe((response) => {
		      console.log(response);  
		      this.spinnerService.hide();

		      if(response.status == 0){
		      	this.toastr.error('You are not authorised to delete this location because location has used in shift.');
		      }else{
		      	this.getLocations();  
		      	this.toastr.success('Location has been deleted successfully!');
		      }
		     
		    // this.modalRef.close(); 

	  	}); 
	};


	updateFilter(event) {
	    const val = event.target.value.toLowerCase();

	    // filter our data
	    const temp = this.temp.filter(function(d) {
	      
	      return  d.address.location.toLowerCase().indexOf(val) !== -1 || !val ;
	    });

	    // update the rows
	    this.rows = temp;
	};

	getClients() {
	  	var Data = {
		    adminId: localStorage.getItem('adminId')
	  	};
	  	this.clientService.GetClients().subscribe((response) => {
		    console.log(response);

		    this.clientsListAll = response.data;
		    // this.clientsList = response.data;	
		    for(var i = 0; i < response.data.length; i++){
		    	if(response.data[i].status == true){
		    		this.clientsList.push(response.data[i]);
		    	}
		    }	    
		    this.spinnerService.hide();
	  	});
	};

	handleAddressChange(address: Address) {
      	console.log(address.geometry.location.lng());
      	console.log(address.geometry.location.lat());
      	this.latitude = 0;
      	this.longitude = 0;
      	this.latitude = address.geometry.location.lat();
      	this.longitude = address.geometry.location.lng();
      	const geocoder = new google.maps.Geocoder();
      	const latlng = new google.maps.LatLng(this.latitude, this.longitude);
      	const request = {
        	latLng: latlng
      	};

      	geocoder.geocode(request, (results, status) => {
        	var formatted_address = results[0].formatted_address;
        	this.authForm.patchValue({
          		address: formatted_address
        	});
        	this.formatted_address = formatted_address;
      	});
   	};


    markerDragEnd(value) {
      	this.latitude = 0;
      	this.longitude = 0;
      	this.latitude = value.coords.lat;
      	this.longitude = value.coords.lng;
      	console.log(value);
      	console.log(this.latitude, this.longitude);
      	const geocoder = new google.maps.Geocoder();
      	const latlng = new google.maps.LatLng(this.latitude, this.longitude);
      	const request = {
        	latLng: latlng
      	};

      	geocoder.geocode(request, (results, status) => {
        	var formatted_address = results[0].formatted_address;
        	this.authForm.patchValue({
          		address: formatted_address
        	});
        	this.formatted_address = formatted_address;

      	});
    };

    viewLocation(value){
  		console.log(value);
  		this.latitude = value.address.latitude;
  		this.longitude = value.address.longitude;
  		this.viewLocationData = value;  
	};


}
