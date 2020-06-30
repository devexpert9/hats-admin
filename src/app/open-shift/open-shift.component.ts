import { Component, OnInit } from '@angular/core';
import { ShiftService } from '../services/shiftService';
import { SecurityService } from '../services/securityService';
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
  selector: 'app-open-shift',
  templateUrl: './open-shift.component.html',
  styleUrls: ['./open-shift.component.css']
})
export class OpenShiftComponent implements OnInit {
	adhocShiftsList: any;
	rows: any;
  authForm: FormGroup;
	authFormDays: FormGroup;
	map: any;
	latitude: number = 30.7333148;
	longitude: number = 76.7794179;
	formatted_address: any;
	viewShiftData: any;
	guardDetails: any;
	modalRef: any;
  closeResult: any;
  securityGuardsList: any;
  gaurdValue: any;
  viewAssignedShiftData: any;
  shift: any;
  dropdownList: any;
  Time: any;
  dropdownSettings: any;
  mindateStart: any;
  mindateEnd: any;
  maxdateStart: any;
  maxdateEnd: any;
  days: any;
  temp:any;
  modalRef1: any;
  changedValue: any;
  shiftData: any;
  closeResult1: any;
  locations: any;
  currentDate: any;
  isDisabled: any;
  mindateavail: any;
  mindate: any;
  mon: any;
  tue: any;
  wed: any;
  thurs: any;
  fri: any;
  sat: any;
  sun: any;
  startDateforEdit: any;
  endDateforEdit: any;

  constructor(private shiftService: ShiftService,private locationService: LocationService, private spinnerService: Ng4LoadingSpinnerService,private toastr: ToastrService,private modalService: NgbModal,public fb: FormBuilder, public securityService: SecurityService, public router: Router) {

   if(localStorage.getItem('adminId') == undefined || localStorage.getItem('adminId') == '' || localStorage.getItem('adminId') == null){
    this.router.navigateByUrl('/');
  };

  this.getOpenShifts();
  this.guardsList();
  this.createForm();
  this.getLocations();

  const geocoder = new google.maps.Geocoder();
  const latlng1 = new google.maps.LatLng(this.latitude, this.longitude);
  const request = {
    latLng: latlng1
  };
  geocoder.geocode(request, (results, status) => {
    var formatted_address = results[0].formatted_address;
    this.authForm.patchValue({
      location: formatted_address
    });
    this.formatted_address = formatted_address;
  });

  var date = new Date();
  // this.mindateStart = date.getFullYear()+'-' + (date.getMonth()+1) + '-'+date.getDate();

  this.currentDate = new Date();
    var month = this.currentDate.getMonth();
    var day = this.currentDate.getDate();
    if(day <= 9){
      day = '0' + day.toString();
    }
     if(month <= 9){
      month = month +1 ;
      month = '0' + month.toString();
    }
    this.currentDate = this.currentDate.getFullYear() + '-' + month + '-' + day;
    console.log('currentDataeaaaaaaaaaaaaa', this.currentDate)

};

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
    const geocoder = new google.maps.Geocoder();
  const latlng1 = new google.maps.LatLng(this.latitude, this.longitude);
  const request = {
    latLng: latlng1
  };
  geocoder.geocode(request, (results, status) => {
    var formatted_address = results[0].formatted_address;
    this.authForm.patchValue({
      location: formatted_address
    });
    this.formatted_address = formatted_address;
  });
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
    shift_date: ['', Validators.compose([Validators.required])],
    start_time: ['', Validators.compose([Validators.required])],
    end_time: ['', Validators.compose([Validators.required])],
    type: ['', Validators.compose([Validators.required])],
    priority: ['', Validators.compose([Validators.required])],
    availability_end_date: [''],
    availability_start_date: [''],
  });

  this.authFormDays = this.fb.group({
    title: ['', Validators.compose([Validators.required])],
    location: ['', Validators.compose([Validators.required])],
    type: ['', Validators.compose([Validators.required])],
    priority: ['', Validators.compose([Validators.required])],

    start_date: ['', Validators.compose([Validators.required])],
    end_date: ['', Validators.compose([Validators.required])],

    monStartTime: [''],
    tueStartTime: [''],
    wedStartTime:  [''],
    thrusStartTime:  [''],
    friStartTime: [''],
    satStartTime: [''] ,
    sunStartTime: [''],

    monEndTime: [''],
    tueEndTime: [''],
    wedEndTime: [''],
    thrusEndTime: [''],
    friEndTime:[''],
    satEndTime: [''],
    sunEndTime: [''],

    
  });
};


empty( start, end){
 this.authFormDays.controls[start].setValue('');
 this.authFormDays.controls[end].setValue('');
};


getOpenShifts() {
  var Data = {
    adminId: localStorage.getItem('adminId')
  };

  this.shiftService.OngoingShiftsList(Data).subscribe((response) => {
    console.log(response);
    this.adhocShiftsList = response.data;
    this.rows = response.data;
     this.temp = response.data;
    this.spinnerService.hide();
  });
};

guardsList() {
 var Data = {
  adminId: localStorage.getItem('adminId')
};

this.securityService.SecurityGuardsList(Data).subscribe((response) => {
  console.log(response);
  this.securityGuardsList = response.data;
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

viewShift(shift, shifts){
  console.log(shift);
  this.viewShiftData = shift;
  this.formatted_address = shift.location.address.location;

this.latitude = shift.location.address.latitude;
      this.longitude = shift.location.address.longitude;
  // if(this.viewShiftData.priority == '0'){
  //   this.viewShiftData.priority = 'Low';
  // }else if(this.viewShiftData.priority == '1'){
  //   this.viewShiftData.priority = 'Medium';
  // }else{
  //   this.viewShiftData.priority = 'High';
  // }
  this.modalRef = this.modalService.open(shifts);
  this.modalRef.result.then((result) => {
        //  console.log(result);
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        // console.log(reason);
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
};
AssignShift(value, index,shift){
  console.log(value, index, shift);
  this.viewAssignedShiftData = value;

  this.modalRef = this.modalService.open(shift);
  this.modalRef.result.then((result) => {
        //  console.log(result);
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        // console.log(reason);
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
};

filterChanged(event){
  console.log(event);
  this.gaurdValue = event;
};

assignShift(){
  console.log(this.viewAssignedShiftData,this.gaurdValue);
  var data = {
    shiftId: this.viewAssignedShiftData._id,
    userId: this.gaurdValue
  };
  console.log(data);

  this.shiftService.assignShift(data).subscribe((response) => {
    console.log(response);        
    this.spinnerService.hide();   
    this.getOpenShifts();       
    this.toastr.success('Shift assigned successfully!');
    this.modalRef.close();
  });
};


// handlerStart(e){
//   // alert(e.target.value);
//   this.mindateEnd = e.target.value;
// };

handlerStartAdhoc(event){
  console.log(this.changedValue, 'changeValue')
  this.mindate = this.currentDate;
  this.maxdateStart  = event.target.value;
  this.mindateavail = this.currentDate;
    if(this.changedValue == 'adhoc'){
    this.authForm.patchValue({
      availability_end_date: event.target.value,
      availability_start_date: this.currentDate
  });
  } 
}

handlerStart(event){
  this.mindateStart = event.target.value;
  if(Date.parse(this.authFormDays.value.end_date) < Date.parse(event.target.value)){
     this.temp = new Date(event.target.value);
     var month = this.temp.getMonth();
     var day = this.temp.getDate();
     if(day <= 9){
       day = '0' + day.toString();
     }
     if(month <= 9){
      month = month + 1;
       month = '0' + month.toString();
     }
     this.temp = this.temp.getFullYear() + '-' + month + '-' + day;
     this.authFormDays.patchValue({
       end_date: this.temp
     })
  };
  this.mon = 0;
  this.tue = 0;
  this.wed = 0;
  this.thurs = 0;
  this.fri = 0;
  this.sat = 0;
  this.sun = 0;

  if(this.authFormDays.value.end_date != ''){
    this.getDates(this.mindateStart, this.authFormDays.value.end_date);
  };
};

handlerEnd(e){
  // alert(e.target.value);
  this.maxdateStart = e.target.value;
  this.mon = 0;
  this.tue = 0;
  this.wed = 0;
  this.thurs = 0;
  this.fri = 0;
  this.sat = 0;
  this.sun = 0;
  if(this.authFormDays.value.start_date != ''){
    this.getDates(this.authFormDays.value.start_date, this.maxdateStart);
  };
};

// handlerStartAvail(e){
//   // alert(e.target.value);
//   this.mindateavail = e.target.value;
//   console.log(this.mindateavail);
//   console.log(e.target.value);
//   if(e.target.value != ''){
//     // this.authForm.controls["availability_end_date"].setValidators([Validators.required]);
//     this.authForm.get('availability_end_date').setValidators([Validators.required]);
//   }else{
//     // this.authForm.controls["availability_end_date"].setValidators(['']);
//       this.authForm.get('availability_end_date').setValidators(null);

//         this.authForm.get('availability_end_date').setErrors(null);
//   }
  
  
// };



  handlerStartAvail(e)
 {
     this.authForm.patchValue({
     availability_start_date: e.target.value
   })

    if(Date.parse(this.authForm.value.availability_end_date) < Date.parse(e.target.value)){
       this.temp = new Date(e.target.value);
       var month = this.temp.getMonth()+1;
       var day = this.temp.getDate();
       if(day <= 9){
         day = '0' + day.toString();
       }
       if(month <= 9){
         month = '0' + month.toString();
       }
       this.temp = this.temp.getFullYear() + '-' + month + '-' + day;
       this.authForm.patchValue({
         availability_end_date: this.temp
       })
   }
   // alert(e.target.value);
   this.mindateavail = e.target.value;
   if (e.target.value != '')
   {
     // this.authForm.controls["availability_end_date"].setValidators([Validators.required]);
     this.authForm.get('availability_end_date').setValidators([Validators.required]);
   }
   else
   {
     // this.authForm.controls["availability_end_date"].setValidators(['']);
     this.authForm.get('availability_end_date').setValidators(null);

     this.authForm.get('availability_end_date').setErrors(null);
   }


 };
  handlerEndAvail(e)
 {
   this.authForm.patchValue({
     availability_end_date: e.target.value
   })
   // alert(e.target.value)
   if (e.target.value != '')
   {
     // this.authForm.controls["availability_start_date"].setValidators([Validators.required]);
     this.authForm.get('availability_start_date').setValidators([Validators.required]);
   }
   else
   {
     // this.authForm.controls["availability_start_date"].setValidators(['']);
     this.authForm.get('availability_start_date').setValidators(null);

     this.authForm.get('availability_start_date').setErrors(null);
   }


 };






      getExactDate123(datevalue){
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

        finalDate = date[0] + '-' + date[1] + '-' + date[2];
      }
      return finalDate;
    }
  };



EditShift(value, editshift, changeValue){
  this.mon = 0;
  this.tue = 0;
  this.wed = 0;
  this.thurs = 0;
  this.fri = 0;
  this.sat = 0;
  this.sun = 0;

  console.log('value edit ', value,changeValue);
  this.maxdateStart = value.end_date;
  this.mindateEnd = value.start_date;
  this.viewShiftData = '';
  this.guardDetails = value;
  this.formatted_address = value.location.address;
  this.latitude = value.location.latitude;
  this.longitude = value.location.longitude;
  console.log('..................',this.guardDetails);
  this.changedValue = changeValue;


  if(changeValue == 'adhoc'){
    this.mindate = value.shift_date;
    this.mindateavail = value.shift_date;
    this.maxdateStart = value.shift_date;
    this.authForm.patchValue({
      availability_end_date:value.availability_end_date,
      availability_start_date: value.availability_start_date
    });
  }

  if(changeValue == 'ongoing'){
    this.getDates(value.start_date, value.end_date);
    if(Date.parse(value.start_date) > Date.parse(this.currentDate)){
      this.mindateStart = value.start_date;
    }else{
      this.mindateStart = this.currentDate;
    }
    this.checkdisabled();
  }

  if(changeValue == 'ongoing'){
    this.authFormDays.patchValue({
      title: value.title,
      type: value.type,
      location: value.location._id,
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

      // monStartTimeAMPM: value.days[0].start_time_am_pm,
      // tueStartTimeAMPM: value.days[1].start_time_am_pm,
      // wedStartTimeAMPM: value.days[2].start_time_am_pm,
      // thrusStartTimeAMPM: value.days[3].start_time_am_pm,
      // friStartTimeAMPM: value.days[4].start_time_am_pm,
      // satStartTimeAMPM: value.days[5].start_time_am_pm,
      // sunStartTimeAMPM: value.days[6].start_time_am_pm,

      // monEndTimeAMPM:value.days[0].end_time_am_pm,
      // tueEndTimeAMPM: value.days[1].end_time_am_pm,
      // wedEndTimeAMPM: value.days[2].end_time_am_pm,
      // thrusEndTimeAMPM: value.days[3].end_time_am_pm,
      // friEndTimeAMPM: value.days[4].end_time_am_pm,
      // satEndTimeAMPM: value.days[5].end_time_am_pm,
      // sunEndTimeAMPM: value.days[6].end_time_am_pm
    });

  }else{
    this.authForm.patchValue({
      title: value.title,
      type: value.type,
      location: value.location._id,
      shift_date: value.shift_date,
      start_time: value.start_time,
      end_time: value.end_time,
      priority: value.priority,
      availability_start_date: value.availability_start_date,
      availability_end_date: value.availability_end_date,
    });
  }

  this.modalRef1 = this.modalService.open(editshift);
  this.modalRef1.result.then((result) => {
    this.closeResult1 = `Closed with: ${result}`;
  }, (reason) => {
    this.closeResult1 = `Dismissed ${this.getDismissReason(reason)}`;
  });
};



  getDates(startDate, stopDate) {
    console.log(startDate, stopDate);
    var dateArray = [];
    this.startDateforEdit = new Date(startDate);
    this.endDateforEdit = new Date(stopDate);
    console.log(this.startDateforEdit,this.endDateforEdit) 
    this.startDateforEdit= this.startDateforEdit.setDate( this.startDateforEdit.getDate()-1);
    this.startDateforEdit = new Date(this.startDateforEdit);
    while (this.startDateforEdit < this.endDateforEdit) {
      dateArray.push( this.startDateforEdit )
      console.log(dateArray)
      this.startDateforEdit = this.startDateforEdit.setDate(this.startDateforEdit.getDate()+1);
      this.startDateforEdit= new Date(this.startDateforEdit);
      console.log(this.startDateforEdit)
    }
    // return dateArray;
    var currentDay, daysarray=[];
    for(var i = 0; i < dateArray.length; i++){
      currentDay = dateArray[i].toString().split(' ')[0];
      daysarray.push(currentDay)
    }

    for(var i = 0; i < daysarray.length; i++){
      if(daysarray[i] == "Mon"){
       this.mon = 1;       
      }else if(daysarray[i] == "Tue"){
        this.tue = 1;       
      }else if(daysarray[i] == "Wed"){
       this.wed = 1;       
      }else if(daysarray[i] == "Thu"){
        this.thurs = 1;       
      }else if(daysarray[i] == "Fri"){
        this.fri = 1;       
      }else if(daysarray[i] == "Sat"){
        this.sat = 1;       
      }else{
        this.sun = 1;       
      }
    }
  };


checkdisabled(){
  // return false;
   this.currentDate = new Date();
    var month = this.currentDate.getMonth()+1;
    var day = this.currentDate.getDate();
    if(day <= 9){
      day = '0' + day;
    };

    if(month <= 9){
      month = '0' + month;
    }

    this.currentDate = this.currentDate.getFullYear() + '-' + month + '-' + day;
    console.log('this.guardDetails.statrt_date', Date.parse(this.guardDetails.start_date));
    console.log('this.currentDate', Date.parse(this.currentDate));

  if(Date.parse(this.guardDetails.start_date) < Date.parse(this.currentDate)){
    this.isDisabled = true;
    console.log('current greater than start date' , this.isDisabled);
  }else if(Date.parse(this.guardDetails.start_date) >= Date.parse(this.currentDate)){
    this.isDisabled = false;
    console.log('current less or equal start date' , this.isDisabled);

  }
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
    start_time: this.authFormDays.value.monStartTime,
    end_time: this.authFormDays.value.monEndTime,
  },
  {
    day: 'Tuesday',
    start_time: this.authFormDays.value.tueStartTime,
    end_time: this.authFormDays.value.tueEndTime,
  },
  {
    day: 'Wednesday',
    start_time: this.authFormDays.value.wedStartTime,
    end_time: this.authFormDays.value.wedEndTime,
  },
  {
    day: 'Thursday',
    start_time: this.authFormDays.value.thrusStartTime,
    end_time: this.authFormDays.value.thrusEndTime,
  },
  {
    day: 'Friday',
    start_time: this.authFormDays.value.friStartTime,
    end_time: this.authFormDays.value.friEndTime,
  },
  {
    day: 'Saturday',
    start_time: this.authFormDays.value.satStartTime,
    end_time: this.authFormDays.value.satEndTime
  },
  {
    day: 'Sunday',
    start_time: this.authFormDays.value.sunStartTime,
    end_time: this.authFormDays.value.sunEndTime,
  }];
  this.days = days;
 
      if(this.days[0].start_time != '' && this.days[0].end_time == ''){
        // this.authFormDays.get('monEndTime').setValidators([Validators.required]);
        this.toastr.error('Please fill end time.');
      } else if(this.days[0].start_time == ''  && this.days[0].end_time != ''){
        // this.authFormDays.get('monStartTime').setValidators([Validators.required]);
        this.toastr.error('Please fill start time.');
      } else if(this.days[1].start_time != '' && this.days[1].end_time == ''){
        // this.authFormDays.get('monEndTime').setValidators([Validators.required]);
        this.toastr.error('Please fill end time.');
      } else if(this.days[1].start_time == '' && this.days[1].end_time != ''){
        this.toastr.error('Please fill start time.');
      }else if(this.days[2].start_time != '' && this.days[2].end_time == ''){
        this.toastr.error('Please fill end time.');
      } else if(this.days[2].end_time != '' && this.days[2].start_time == ''){
        this.toastr.error('Please fill start time.');
      }else if(this.days[3].start_time != '' && this.days[3].end_time == ''){
        // this.authFormDays.get('thrusEndTime').setValidators([Validators.required]);
        this.toastr.error('Please fill end time.');
      } else if(this.days[3].end_time != '' && this.days[3].start_time == ''){
        // this.authFormDays.get('thrusStartTime').setValidators([Validators.required]);
        this.toastr.error('Please fill start time.');
      }else if(this.days[4].start_time != '' &&  this.days[4].end_time == ''){
        // this.authFormDays.get('friEndTime').setValidators([Validators.required]);
        this.toastr.error('Please fill end time.');
      } else if(this.days[4].start_time == '' && this.days[4].end_time != ''){
        // this.authFormDays.get('friStartTime').setValidators([Validators.required]);
        this.toastr.error('Please fill start time.');
      }else if(this.days[5].start_time != '' && this.days[5].end_time == ''){
        // this.authFormDays.get('satEndTime').setValidators([Validators.required]);
        this.toastr.error('Please fill end time.');
      } else if(this.days[5].end_time != '' && this.days[5].start_time == ''){
        // this.authFormDays.get('friStartTime').setValidators([Validators.required]);
        this.toastr.error('Please fill start time.');
      }else if(this.days[6].start_time != '' && this.days[6].end_time == ''){
        // this.authFormDays.get('sunEndTime').setValidators([Validators.required]);
        this.toastr.error('Please fill end time.');
      } else if(this.days[6].end_time != '' && this.days[6].start_time == ''){
        // this.authFormDays.get('sunStartTime').setValidators([Validators.required]);
        this.toastr.error('Please fill start time.');
      }else{
         this.modalRef1.close();
        this.updateShiftDetails(location, days);

      }

  
};

updateShiftDetails(location, days){
  if(this.changedValue == 'ongoing'){

    this.shiftData = {
      title: this.authFormDays.value.title,
      type: this.authFormDays.value.type,
      start_time: this.guardDetails.start_time,
      end_time: this.guardDetails.end_time,
      location: this.authForm.value.location,
      priority: this.authFormDays.value.priority,
      saved_by_users: [],
      start_date: this.authFormDays.value.start_date,
      end_date: this.authFormDays.value.end_date,
      days: days,
      shift_date: '',
    };
  }else{

    this.shiftData = {
      title: this.authForm.value.title,
      type: this.authForm.value.type,
      start_time: this.authForm.value.start_time,
      end_time: this.authForm.value.end_time,
      location: this.authForm.value.location,
      priority: this.authForm.value.priority,
      saved_by_users: [],
      shift_date: this.authForm.value.shift_date,
      start_date: '',
      end_date: '',
      days: [],
      availability_start_date: this.authForm.value.availability_start_date,
      availability_end_date: this.authForm.value.availability_end_date,
    };  
  };


  this.shiftService.UpdateShiftDetails(this.shiftData, this.guardDetails._id).subscribe((response) => {
    console.log(response);        
    this.spinnerService.hide(); 
    this.toastr.success('Shift info has been updated successfully!');
    // this.modalRef1.close();
    this.getOpenShifts(); 
    
    
  });
}


DeleteShift(shift,i){
  this.shift  = shift;

}
delete(shift){
  this.spinnerService.show();
  // var shiftData = {
  //   shiftId: shift._id
  // }
  // console.log(shiftData);
  // this.shiftService.DeleteShift(shiftData).subscribe((response) => {
  //   console.log(response);  
  //   this.spinnerService.hide();
  //   this.getOpenShifts();  
  //   this.toastr.success('Shift deleted successfully!');
  //   // this.modalRef.close(); 

  // });


  var shiftData = {
      id: shift._id,
      trashValue: 1,
      value: 'shift'
    }
    console.log(shiftData);
    this.securityService.moveRestoreGuradFromTrash(shiftData).subscribe((response) => {
      console.log(response);  
      this.spinnerService.hide();
      this.getOpenShifts();  
      this.toastr.success('Shift has moved to trash successfully!');
    // this.modalRef.close(); 

  }); 

};
closeModal(){
  this.modalRef.close();
}
 closeModal1(){
    this.modalRef1.close();
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
      //   if(date[2].length == 4){
      //   // finalDate = date[2] + '-' + date[1] + '-' + date[0];
      //   finalDate = date[0] + '-' + date[1] + '-' + date[2];
      // }else{
      //   var str = date[2].split('T');
      //   // finalDate = date[0] + '-' + date[1] + '-' + str[0];
      //   date[2] = Number(date[2]);
      //   // console.log('date[2]', date[2]);
      //   if(date[2] < 10){
      //     date[2] = "0" + date[2];
      //     date[2] = date[2].toString();
      //   }

      //   finalDate = date[2] + '-' + date[1] + '-' + date[0];
      // }
      finalDate = date[2] + '-' + date[1] + '-' + date[0];
      return finalDate;
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

 //   getAmPmTime(days){
 //  if(days[0].start_time != ''){
 //    var start = days[0].start_time ,
  
 //    end = days[0].end_time ;
  
 //     var time =  start  + ' - ' + end;  
 //    return  time ; 
 //  }else{
 //    var test = this.checkAvailableTime(days, 1);
 //    return test;
 //  }   
 // };

 // checkAvailableTime(days, index){
 //  if(days[index].start_time != ''){
 //    var start = days[index].start_time,
  
 //    end = days[index].end_time ;
 //    var time =  start  + ' - ' + end;  
 //    return  time ; 
 //  }else{
 //    var indexValue = index + 1;
 //    this.checkAvailableTime(days, indexValue);
 //  }
 // };

 getTime(start_time, end_time){
  if(start_time != null){
    var start, am , pm, end;
    var start_time1 = start_time.split(':');
    var end_time1 = end_time.split(':');
    start_time = start_time1[0];
    end_time = end_time1[0];
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


    // if(Number(end_time) > 12){
    //   end = Number(end_time) - 12;
    //   pm = ' PM'; 
    // }else if(Number(end_time) == 12){
    //   end = Number(end_time);
    //   pm = ' PM'; 
    // }else {
    //   end = Number(end_time);
    //   pm = ' AM'; 
    // }

    start = Number(start_time);
    end = Number(end_time);

    // return start  + ':' + start_time1[1] + am + ' - ' + end + ':' + end_time1[1] + pm;
    return start  + ':' + start_time1[1] + ' - ' + end + ':' + end_time1[1];
  }   

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

    // filter our data
    const temp = this.temp.filter(function(d) {


      return d.title.toLowerCase().indexOf(val) !== -1 || !val ;
    });

    // update the rows
    this.rows = temp;
    // Whenever the filter changes, always go back to the first page
  };

onKeydown(event) {
  if (event.key === "Enter") {
    console.log(event);
    return false;
  }else {
    return true;
  }
}


  changeStatusShift(row, is_approve){
    this.spinnerService.show();
    var shiftData = {
      shiftId: row._id,
      status: is_approve,
      userId: is_approve ? row.accepted_by : ''
    };

    this.shiftService.changeAdminApproval(shiftData).subscribe((response) => {
      console.log(response);  
      for(var i=0; i< this.rows.length; i++){
        if(this.rows[i]._id == row._id){
          this.rows[i].is_approved = is_approve;
          this.rows[i].is_accepted = is_approve;
        }
      }
      this.spinnerService.hide();
      this.getOpenShifts();
      if(is_approve != true){
        this.toastr.success('Shift has been declined successfully.');
      }else{
        this.toastr.success('Shift has been declined successfully.');
      }
    }); 
  };

}
