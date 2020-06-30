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
import { GooglePlaceDirective } from "ngx-google-places-autocomplete/ngx-google-places-autocomplete.directive";
import { ComponentRestrictions } from "ngx-google-places-autocomplete/objects/options/componentRestrictions";
import { Address } from "ngx-google-places-autocomplete/objects/address";

declare var google: any;

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css']
})

export class ContactUsComponent implements OnInit {
    contactsList: any;
    temp: any;
    imageURL: any;
    authForm: FormGroup;
    modalRef: any;
    closeResult: any;
    rows: any;
    selectIconValue: any;
    ionic_icon: any;
    contact: any;
    status: any;
    formatted_address: any;
    latitude; any;
    longitude: any;
    formatted_address_backup : any;
  constructor(public  locationService: LocationService, public clientService: ClientService, public securityService: SecurityService,public fb: FormBuilder, public loginService: LoginService,private spinnerService: Ng4LoadingSpinnerService,private toastr: ToastrService,private modalService: NgbModal, public shiftService: ShiftService , public router: Router ) {

    if(localStorage.getItem('adminId') == undefined || localStorage.getItem('adminId') == '' || localStorage.getItem('adminId') == null){
        this.router.navigateByUrl('/');
    };

	  this.createForm();
    this.getContacts();
  }

	ngOnInit() {
    window.scrollTo(0, 0);
	}

	createForm(){
   	this.authForm = this.fb.group({
	    title: ['', Validators.compose([Validators.required])],
      email: ['', Validators.compose([Validators.required, Validators.pattern('[A-Za-z0-9._%+-]{3,}@[a-zA-Z]{3,}([.]{1}[a-zA-Z]{2,}|[.]{1}[a-zA-Z]{2,}[.]{1}[a-zA-Z]{2,})')])],
	    zipcode: ['', Validators.compose([Validators.required])],
     	contact: ['', Validators.compose([Validators.required, Validators.pattern('[0-9]{4,15}')])],
    	address: ['', Validators.compose([Validators.required])],
      city: ['', Validators.compose([Validators.required,Validators.pattern('^[a-zA-Z \-\']+')])],
  	 	state: ['', Validators.compose([Validators.required,Validators.pattern('^[a-zA-Z \-\']+')])],
 	    country: ['', Validators.compose([Validators.required,Validators.pattern('^[a-zA-Z \-\']+')])],
    	angular_icon: ['location-pin'],
    	ionic_icon: ['pin'],
    });	   
 	};

  getContacts() {
    var Data = {
      source: 'admin'
    };
    this.clientService.GetContacts(Data).subscribe((response) => {
      console.log(response);
      this.contactsList = response.data;
      for(var i=0; i < this.contactsList.length; i++){
        if(this.contactsList[i].type != 'created'){
          console.log(this.contactsList[i])
          this.formatted_address = this.contactsList[i].address;
          this.formatted_address_backup = this.contactsList[i].address;
          this.contactsList.splice(i, 1);
        }
      }
      this.rows = response.data;
      this.temp = response.data;
      this.spinnerService.hide();
    });
  };

 	addNewContact(addcontact){
    console.log('addnewsecurityguard');	 
    this.authForm.reset();
    this.selectIconValue = 'location-pin';
    this.ionic_icon = 'pin';
    this.modalRef = this.modalService.open(addcontact);
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

  selectIcon(string){
    this.selectIconValue = string;
    if(string == 'location-pin'){
      this.ionic_icon = 'pin';
    }else if(string == 'compass'){
      this.ionic_icon = 'compass';
    }else if(string == 'cursor'){
      this.ionic_icon = 'navigate';
    }else if(string == 'map'){
      this.ionic_icon = 'map';
    }else if(string == 'globe'){
      this.ionic_icon = 'globe'; 
    }else if(string == 'home'){
      this.ionic_icon = 'home';
    }
    this.authForm.patchValue({
      angular_icon: string,
      ionic_icon: this.ionic_icon
    })
  };

  AddContactInfo(){
    this.spinnerService.show();
    console.log(this.authForm.value);
    this.clientService.AddContact(this.authForm.value).subscribe((response) => {
      console.log(response);
      if(response.status == 1){
        this.getContacts();
        this.modalRef.close();
      }else{
        this.toastr.error('Title is already exists.');
      }      
      this.spinnerService.hide();
    });
  };

  EditContact(value,editcontact){
    console.log(value);
    this.contact = value;
    this.authForm.patchValue({
      title: value.title,
      contact: value.contact,
      email: value.email,
      state: value.state,
      address: value.address,
      city: value.city,
      country: value.country,
      zipcode: value.zipcode,
      angular_icon: value.angular_icon,
      ionic_icon: value.ionic_icon
    });
    this.selectIconValue = this.authForm.value.angular_icon;
    this.ionic_icon = this.authForm.value.ionic_icon;

    this.modalRef = this.modalService.open(editcontact);
    this.modalRef.result.then((result) => {
        //  console.log(result);
        this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
        // console.log(reason);
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }


  UpdateContactInfo(){
    console.log(this.authForm.value);
    this.spinnerService.show();
    var dict = {
      title: this.authForm.value.title,
      email: this.authForm.value.email,
      contact: this.authForm.value.contact,
      state: this.authForm.value.state,
      address: this.authForm.value.address,
      city: this.authForm.value.city,
      country: this.authForm.value.country,
      zipcode: this.authForm.value.zipcode,
      angular_icon: this.authForm.value.angular_icon,
      ionic_icon: this.authForm.value.ionic_icon,
      _id: this.contact._id,
      status: this.contact.status
    };
    console.log(dict);
    this.clientService.UpdateContact(dict).subscribe((response) => {
      console.log(response);
      this.getContacts();
      this.modalRef.close();
      this.spinnerService.hide();
    });
  };

  DeleteContact(contact){
      this.contact = contact;
  };

  deleteContact(contact){

    this.spinnerService.show();
    var contactData = {
      _id: contact._id
    }
    console.log(contactData);
    this.clientService.DeleteContact(contactData).subscribe((response) => {
        console.log(response);  
        this.spinnerService.hide();
        this.getContacts();  
        this.toastr.success('Contact has been deleted successfully!');
        // if(response.status == 0){
        //   this.toastr.error('You are not authorised to delete this client because location/address is associated with the client.');
        // }else{
        //   this.getClients();  
        //   this.toastr.success('Client has been deleted successfully!');
        // }
        
    }); 
  };

  changeStatus(row, value){
      this.contact = row;
      this.status = value;
    };

    Changestatus(row,value){
      this.spinnerService.show();
      var data = {
        _id: row._id,
        status: value,
      };

    this.clientService.ChangeStatus(data).subscribe((response) => {
          console.log(response);
          this.getContacts();
          this.toastr.success('Status has changed successfully!');          
          this.spinnerService.hide();    
      });
    }

    updateFilter(event) {
      const val = event.target.value.toLowerCase();

      // filter our data
      const temp = this.temp.filter(function(d) {
        
        return  d.title.indexOf(val) !== -1 || !val ;
      });

      // update the rows
      this.rows = temp;
    };


    public handleAddressChange(address: Address) {
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
        this.formatted_address = formatted_address;
        //this.UpdateMainLocation();
      });
    };

    onKeydown(event) {
      if (event.key === "Enter") {
        console.log(event);
        return false;
      }else {
        return true;
      }
    };

    UpdateMainLocation(){
      console.log(this.formatted_address);
      this.spinnerService.show();
      var dict = {      
        address: this.formatted_address,
        lat: this.latitude,
        long: this.longitude,
      };
      console.log(dict);
      this.clientService.UpdateMainLocation(dict).subscribe((response) => {
        console.log(response);
        this.formatted_address = this.formatted_address;
        this.spinnerService.hide();
      });
    };

    cancelAddress(){
      this.formatted_address = this.formatted_address_backup;
    }

}
