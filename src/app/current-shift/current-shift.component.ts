import { Component, OnInit } from '@angular/core';
import { ShiftService } from '../services/shiftService';
import { LocationService } from '../services/locationService';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ToastrService } from 'ngx-toastr';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { GooglePlaceDirective } from "ngx-google-places-autocomplete/ngx-google-places-autocomplete.directive";
import { ComponentRestrictions } from "ngx-google-places-autocomplete/objects/options/componentRestrictions";
import { Address } from "ngx-google-places-autocomplete/objects/address";
import { Router } from '@angular/router';

declare var google: any;
declare var geocoder: any; 

@Component({
	selector: 'app-current-shift',
	templateUrl: './current-shift.component.html',
	styleUrls: ['./current-shift.component.css']
})
export class CurrentShiftComponent implements OnInit {
	ShiftsList: any;
	rows: any;
	viewShiftData: any;
	modalRef: any;
  authFormadhoc: FormGroup;
  adhocShiftsList: any;
  authForm: FormGroup;
  map: any;
  latitude: number = 30.7333148;
  longitude: number = 76.7794179;
  formatted_address: any;
  guardDetails: any;
  shift: any;
  closeResult: any;
  index: any;
  dropdownSettings: any;
  Time: any;
  dropdownList: any;
  row: any;
  temp:any;
  locations: any;
  constructor(private shiftService: ShiftService,private locationService: LocationService,private toastr: ToastrService,public fb: FormBuilder,private spinnerService: Ng4LoadingSpinnerService, public modalService:NgbModal, public router: Router) {

    if(localStorage.getItem('adminId') == undefined || localStorage.getItem('adminId') == '' || localStorage.getItem('adminId') == null){
      this.router.navigateByUrl('/');
    };

    this.getCurrentshiftsList();
    this.createForm();
    this.getLocations();

  }

  ngOnInit() {
    window.scrollTo(0, 0);
    this.Time = [
    { id: 0, time: 'OFF' },
    { id: 1, time: '1' },
    { id: 2, time: '2' },
    { id: 3, time: '3' },
    { id: 4, time: '4' },
    { id: 5, time: '5' },
    { id: 6, time: '6' },
    { id: 7, time: '7' },
    { id: 8, time: '8' },
    { id: 9, time: '9' },
    { id: 10, time: '10' },
    { id: 11, time: '11' },
    { id: 12, time: '12' }
    ];
    this.dropdownList = [
    { item_id: 0, item_text: 'Monday' },
    { item_id: 1, item_text: 'Tuesday' },
    { item_id: 2, item_text: 'Wednesday' },
    { item_id: 3, item_text: 'Thursday' },
    { item_id: 4, item_text: 'Friday' },
    { item_id: 5, item_text: 'Saturday' },
    { item_id: 6, item_text: 'Sunday' },
    ];

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
  }
  onItemSelect(item: any) {
    console.log(item);

  }
  onSelectAll(items: any) {
    console.log(items);
  }

  getLocations(){
    this.spinnerService.show();
      this.locationService.GetLocation().subscribe((response) => {
          console.log(response);
          this.locations = response.data;
          this.spinnerService.hide();    
        });

  };


  public handleAddressChange(address: Address) {
    console.log(address.geometry.location.lng());
    console.log(address.geometry.location.lat());
    this.latitude = address.geometry.location.lat();
    this.longitude = address.geometry.location.lng();
  };

  markerDragEnd(value) {
    this.latitude = value.coords.lat;
    this.longitude = value.coords.lng;
    const geocoder = new google.maps.Geocoder();
    const latlng = new google.maps.LatLng(this.latitude, this.longitude);
    const request = {
     latLng: latlng
   };

   geocoder.geocode(request, (results, status) => {
    var formatted_address = results[0].formatted_address;
    this.authForm.patchValue({
      location: formatted_address
    });
    this.formatted_address = formatted_address;

  });
 };

 createForm(){
  this.authForm = this.fb.group({
    title: ['', Validators.compose([Validators.required])],
    location: ['', Validators.compose([Validators.required])],
    type: ['', Validators.compose([Validators.required])],
    priority: ['', Validators.compose([Validators.required])],

    start_date: ['', Validators.compose([Validators.required])],
    end_date: ['', Validators.compose([Validators.required])],

    monStartTime: ['', Validators.compose([Validators.required])],
    tueStartTime: ['', Validators.compose([Validators.required])],
    wedStartTime: ['', Validators.compose([Validators.required])],
    thrusStartTime: ['', Validators.compose([Validators.required])],
    friStartTime: ['', Validators.compose([Validators.required])],
    satStartTime: ['', Validators.compose([Validators.required])],
    sunStartTime: ['', Validators.compose([Validators.required])],

    monEndTime: ['', Validators.compose([Validators.required])],
    tueEndTime: ['', Validators.compose([Validators.required])],
    wedEndTime: ['', Validators.compose([Validators.required])],
    thrusEndTime: ['', Validators.compose([Validators.required])],
    friEndTime: ['', Validators.compose([Validators.required])],
    satEndTime: ['', Validators.compose([Validators.required])],
    sunEndTime: ['', Validators.compose([Validators.required])],

    monStartTimeAMPM: ['', Validators.compose([Validators.required])],
    tueStartTimeAMPM: ['', Validators.compose([Validators.required])],
    wedStartTimeAMPM: ['', Validators.compose([Validators.required])],
    thrusStartTimeAMPM: ['', Validators.compose([Validators.required])],
    friStartTimeAMPM: ['', Validators.compose([Validators.required])],
    satStartTimeAMPM: ['', Validators.compose([Validators.required])],
    sunStartTimeAMPM: ['', Validators.compose([Validators.required])],

    monEndTimeAMPM: ['', Validators.compose([Validators.required])],
    tueEndTimeAMPM: ['', Validators.compose([Validators.required])],
    wedEndTimeAMPM: ['', Validators.compose([Validators.required])],
    thrusEndTimeAMPM: ['', Validators.compose([Validators.required])],
    friEndTimeAMPM: ['', Validators.compose([Validators.required])],
    satEndTimeAMPM: ['', Validators.compose([Validators.required])],
    sunEndTimeAMPM: ['', Validators.compose([Validators.required])],
  });


  this.authFormadhoc = this.fb.group({
   title: ['', Validators.compose([Validators.required])],
   location: ['', Validators.compose([Validators.required])],
   shift_date: ['', Validators.compose([Validators.required])],
   start_time: ['', Validators.compose([Validators.required])],
   end_time: ['', Validators.compose([Validators.required])],
   type: ['', Validators.compose([Validators.required])],
   priority: ['', Validators.compose([Validators.required])],
 });
};

    //get all security guards list 
    getCurrentshiftsList() {
      this.spinnerService.show();
      var Data = {
        adminId: localStorage.getItem('adminId')
      };

      this.shiftService.CurrentShiftsList(Data).subscribe((response) => {
        console.log(response);
        this.rows = response.data;
         this.temp = response.data;
        this.spinnerService.hide();
      });
    };



    change(time){
      var z = time.lastIndexOf(':');
      var current_time = time.slice(0,z);  
      if(current_time >= 12){
        return true;
      }else{
        return false;
      }

    };

    ViewShiftdetail(row, shifts){
      this.spinnerService.show();
      this.viewShiftData = row;
   this.latitude = row.location.address.latitude;
      this.longitude = row.location.address.longitude;
      this.spinnerService.hide();
      this.modalRef = this.modalService.open(shifts);
      this.modalRef.result.then((result) => {
    //  console.log(result);
    this.closeResult = `Closed with: ${result}`;
  }, (reason) => {
    // console.log(reason);
    this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
  });
    };

    closeModal(){
      this.modalRef.close();
    };


    EditShift(value, index,editshift, editshiftadhoc){
      console.log('value edit ', value,editshift);
      this.guardDetails = value;
      if(value.type == "1"){
       this.authForm.patchValue({
        title: value.title,
        type: value.type,
        location: value.location.address,
        start_date: value.start_date,
        end_date: value.end_date,
        priority: value.priority,
        monStartTime: value.days[0].start_time,
        tueStartTime: value.days[1].start_time,
        wedStartTime: value.days[2].start_time,
        thrusStartTime: value.days[3].start_time,
        friStartTime: value.days[4].start_time,
        satStartTime: value.days[5].start_time,
        sunStartTime: value.days[6].start_time,

        monEndTime: value.days[0].end_time,
        tueEndTime: value.days[1].end_time,
        wedEndTime: value.days[2].end_time,
        thrusEndTime: value.days[3].end_time,
        friEndTime: value.days[4].end_time,
        satEndTime: value.days[5].end_time,
        sunEndTime: value.days[6].end_time,

        monStartTimeAMPM: value.days[0].start_time_am_pm,
        tueStartTimeAMPM: value.days[1].start_time_am_pm,
        wedStartTimeAMPM: value.days[2].start_time_am_pm,
        thrusStartTimeAMPM: value.days[3].start_time_am_pm,
        friStartTimeAMPM: value.days[4].start_time_am_pm,
        satStartTimeAMPM: value.days[5].start_time_am_pm,
        sunStartTimeAMPM: value.days[6].start_time_am_pm,

        monEndTimeAMPM:value.days[0].end_time_am_pm,
        tueEndTimeAMPM: value.days[1].end_time_am_pm,
        wedEndTimeAMPM: value.days[2].end_time_am_pm,
        thrusEndTimeAMPM: value.days[3].end_time_am_pm,
        friEndTimeAMPM: value.days[4].end_time_am_pm,
        satEndTimeAMPM: value.days[5].end_time_am_pm,
        sunEndTimeAMPM: value.days[6].end_time_am_pm
      });
     }else{
      this.authFormadhoc.patchValue({
        title: value.title,
        type: value.type,
        location: value.location.address,
        shift_date: value.shift_date,
        start_time: value.start_time,
        end_time: value.end_time,
        priority: value.priority,
      });
    }

    if(value.type == "0"){
      this.modalRef = this.modalService.open(editshiftadhoc);
    }else{
      this.modalRef = this.modalService.open(editshift);
    }

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

  updateShift(){
    console.log(this.authForm.value);
    var location = {
      address: this.formatted_address,
      latitude: this.latitude,
      longitude: this.longitude
    };

    var days = [{
      day: 'Monday',
      start_time: this.authForm.value.monStartTime,
      end_time: this.authForm.value.monEndTime,
      start_time_am_pm: this.authForm.value.monStartTimeAMPM,
      end_time_am_pm: this.authForm.value.monEndTimeAMPM
    },
    {
      day: 'Tuesday',
      start_time: this.authForm.value.tueStartTime,
      end_time: this.authForm.value.tueEndTime,
      start_time_am_pm: this.authForm.value.tueStartTimeAMPM,
      end_time_am_pm: this.authForm.value.tueEndTimeAMPM
    },
    {
      day: 'Wednesday',
      start_time: this.authForm.value.wedStartTime,
      end_time: this.authForm.value.wedEndTime,
      start_time_am_pm: this.authForm.value.wedStartTimeAMPM,
      end_time_am_pm: this.authForm.value.wedEndTimeAMPM
    },
    {
      day: 'Thursday',
      start_time: this.authForm.value.thrusStartTime,
      end_time: this.authForm.value.thrusEndTime,
      start_time_am_pm: this.authForm.value.thrusStartTimeAMPM,
      end_time_am_pm: this.authForm.value.thrusEndTimeAMPM
    },
    {
      day: 'Friday',
      start_time: this.authForm.value.friStartTime,
      end_time: this.authForm.value.friEndTime,
      start_time_am_pm: this.authForm.value.friStartTimeAMPM,
      end_time_am_pm: this.authForm.value.friEndTimeAMPM
    },
    {
      day: 'Saturday',
      start_time: this.authForm.value.satStartTime,
      end_time: this.authForm.value.satEndTime,
      start_time_am_pm: this.authForm.value.satStartTimeAMPM,
      end_time_am_pm: this.authForm.value.satEndTimeAMPM
    },
    {
      day: 'Sunday',
      start_time: this.authForm.value.sunStartTime,
      end_time: this.authForm.value.sunEndTime,
      start_time_am_pm: this.authForm.value.sunStartTimeAMPM,
      end_time_am_pm: this.authForm.value.sunEndTimeAMPM
    }];

    var shiftData = {
      title: this.authForm.value.title,
      type: this.authForm.value.type,
      start_time: this.guardDetails.start_time,
      end_time: this.guardDetails.end_time,
      location: location,
      priority: this.authForm.value.priority,
      saved_by_users: [],
      start_date: this.authForm.value.start_date,
      end_date: this.authForm.value.end_date,
      days: days
    };
    console.log(shiftData);

    this.shiftService.UpdateShiftDetails(shiftData, this.guardDetails._id).subscribe((response) => {
      console.log(response);        
      this.spinnerService.hide(); 
      this.getCurrentshiftsList();         
      this.toastr.success('Shift updated successfully!');
      this.modalRef.close();
    }); 

  };

  DeleteShift(shift,i){
    this.shift  = shift;

  }
  delete(shift){
    this.spinnerService.show();
    var shiftData = {
      shiftId: shift._id
    }
    console.log(shiftData);
    this.shiftService.DeleteShift(shiftData).subscribe((response) => {
      console.log(response);  
      this.spinnerService.hide();
      this.getCurrentshiftsList();  
      this.toastr.success('Shift deleted successfully!');
    // this.modalRef.close(); 

  }); 
  };
getTimeAMPM(start_time){
    if(start_time != null){
      var start, am ;
      var start_time1 = start_time.split(':');
      start_time = start_time1[0];
      // if(Number(start_time) > 12){
      //   start = Number(start_time) - 12; 
      //   am = ' PM';
      // }else if(Number(start_time) == 12){
      //   start = Number(start_time);
      //   am = ' PM';
      // }else {
      //   start = Number(start_time);
      //   am = ' AM';
      // }

      start = Number(start_time)

      // return start  + ':' + start_time1[1] + am;
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


  // getAmPmTime(days){
  //   if(days[0].start_time != ''){
  //     var start = days[0].start_time ,
  //     am = days[0].start_time_am_pm == 1 ? ' PM' : ' AM',
  //     end = days[0].end_time ,
  //     pm = days[0].end_time_am_pm == 1 ? ' PM' : ' AM';
  //     return  start  + ' - ' + end ; 
  //   }else{
  //     var test = this.checkAvailableTime(days, 1);
  //     return test;
  //   }   
  // };

  checkAvailableTime(days, index){
    if(days[index].start_time != ''){
      var start = days[index].start_time ,
      am = days[index].start_time_am_pm == 1 ? ' PM' : ' AM',
      end = days[index].end_time ,
      pm = days[index].end_time_am_pm == 1 ? ' PM' : ' AM';
      return  start + ' - ' + end ; 
    }else{
      var indexValue = index + 1;
      this.checkAvailableTime(days, indexValue);
    }
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
    }
  };

      getPriorityValue(priority){
  if(priority == '0'){
    return 'Low';
  }else if( priority == '1'){
    return 'Medium';
  }else{
    return 'High';
  }
};
   updateFilter(event) {
    const val = event.target.value.toLowerCase();
    var temp;

    // filter our data
    // const temp = this.temp.filter(function(d) {


    //   return d.userInfo.rapidId.toLowerCase().indexOf(val) !== -1 || !val ;
    // });

    if(val != ''){
       temp = this.temp.filter(function(d) {

        if(d.userInfo){
          return d.userInfo.rapidId.toLowerCase().indexOf(val) !== -1 || !val ;
        }   
      });
    }else{
      temp = this.temp;
    }

    // update the rows
    this.rows = temp;
    // Whenever the filter changes, always go back to the first page
  };


}
