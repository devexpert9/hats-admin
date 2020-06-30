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
	selector: 'app-cancelled-shifts',
	templateUrl: './cancelled-shifts.component.html',
	styleUrls: ['./cancelled-shifts.component.css']
})
export class CancelledShiftsComponent implements OnInit {

  ShiftsList: any;
  rows: any = [];
  viewShiftData: any;
  modalRef: any;
  authFormDays: FormGroup;
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
  changedValue: any;
  shiftData: any;
  temp:any;
  Remarks: any;
  locations: any;

  constructor(private shiftService: ShiftService,private locationService: LocationService,private toastr: ToastrService,private modalService: NgbModal,public fb: FormBuilder,private spinnerService: Ng4LoadingSpinnerService, public router: Router) {

    if(localStorage.getItem('adminId') == undefined || localStorage.getItem('adminId') == '' || localStorage.getItem('adminId') == null){
      this.router.navigateByUrl('/');
    }

    this.getCancelledshiftsList();
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
  };

     getLocations(){
    this.spinnerService.show();
      this.locationService.GetLocation().subscribe((response) => {
          console.log(response);
          this.locations = response.data;
          this.spinnerService.hide();    
        });

  };

  onItemSelect(item: any) {
    console.log(item);
  };

  onSelectAll(items: any) {
    console.log(items);
  };

  closeModal(){
    this.modalRef.close();
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
      if(this.changedValue == 'ongoing'){
        this.authFormDays.patchValue({
          location: formatted_address
        });
      }else{
        this.authForm.patchValue({
          location: formatted_address
        }); 
      }
      
      this.formatted_address = formatted_address;

    });
  };

  createForm(){
   if(this.changedValue == 'ongoing'){
     this.authFormDays = this.fb.group({
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
   }else{
    this.authForm = this.fb.group({
      title: ['', Validators.compose([Validators.required])],
      location: ['', Validators.compose([Validators.required])],
      shift_date: ['', Validators.compose([Validators.required])],
      start_time: ['', Validators.compose([Validators.required])],
      end_time: ['', Validators.compose([Validators.required])],
      type: ['', Validators.compose([Validators.required])],
      priority: ['', Validators.compose([Validators.required])],
    });

  }


};

    //get all security guards list 
    getCancelledshiftsList() {
      this.spinnerService.show();
      var Data = {
        adminId: localStorage.getItem('adminId')
      };

      this.shiftService.CancelledShifts(Data).subscribe((response) => {
        console.log(response);

        // for(var i = 0; i < response.data.length; i++){
        //   if(response.data[i].type == '0'){
        //     this.rows.push(response.data[i]);
        //   } else{
        //     var temp = response.data[i].shiftStatus;
        //     for(var k=response.data[i].shiftStatus.length; k > 0; k--){
        //       if(response.data[i].shiftStatus[k-1].end_status != 1){
        //         var shiftData = response.data[i];
        //         shiftData.shiftStatus = temp[k-1];
        //         this.rows.push(shiftData);
        //       }
        //     }
        //   }
        // }

        this.rows = response.data;
        this.temp = this.rows;
        this.spinnerService.hide();
      });
    };



    change(time){
      if(time >= 12){
        return true;
      }else{
        return false;
      }
    };

    viewShift(shift,editshift){
      console.log(shift,editshift);
      this.viewShiftData = shift;
      this.latitude = shift.location.address.latitude;
      this.longitude = shift.location.address.longitude;

      this.modalRef = this.modalService.open(editshift);
      this.modalRef.result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });

    };
    EditShift(value,editshift, changeValue){
      console.log('value edit ', value,editshift);
      var priority;
      this.guardDetails = value;
      this.changedValue = changeValue;

      // if(value.priority == 'Low'){
      //   priority = '0';

      // }else if(value.priority == 'Medium'){
      //   priority = '1';

      // }else{
      //   priority = '3';

      // }

      if(changeValue == 'ongoing'){
        this.authFormDays.patchValue({
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
        this.authForm.patchValue({
          title: value.title,
          type: value.type,
          location: value.location.address,
          shift_date: value.shift_date,
          start_time: value.start_time,
          end_time: value.end_time,
          priority: value.priority
        });
      }

      this.modalRef = this.modalService.open(editshift);
      this.modalRef.result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
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
        start_time: this.authFormDays.value.monStartTime,
        end_time: this.authFormDays.value.monEndTime,
        start_time_am_pm: this.authFormDays.value.monStartTimeAMPM,
        end_time_am_pm: this.authFormDays.value.monEndTimeAMPM
      },
      {
        day: 'Tuesday',
        start_time: this.authFormDays.value.tueStartTime,
        end_time: this.authFormDays.value.tueEndTime,
        start_time_am_pm: this.authFormDays.value.tueStartTimeAMPM,
        end_time_am_pm: this.authFormDays.value.tueEndTimeAMPM
      },
      {
        day: 'Wednesday',
        start_time: this.authFormDays.value.wedStartTime,
        end_time: this.authFormDays.value.wedEndTime,
        start_time_am_pm: this.authFormDays.value.wedStartTimeAMPM,
        end_time_am_pm: this.authFormDays.value.wedEndTimeAMPM
      },
      {
        day: 'Thursday',
        start_time: this.authFormDays.value.thrusStartTime,
        end_time: this.authFormDays.value.thrusEndTime,
        start_time_am_pm: this.authFormDays.value.thrusStartTimeAMPM,
        end_time_am_pm: this.authFormDays.value.thrusEndTimeAMPM
      },
      {
        day: 'Friday',
        start_time: this.authFormDays.value.friStartTime,
        end_time: this.authFormDays.value.friEndTime,
        start_time_am_pm: this.authFormDays.value.friStartTimeAMPM,
        end_time_am_pm: this.authFormDays.value.friEndTimeAMPM
      },
      {
        day: 'Saturday',
        start_time: this.authFormDays.value.satStartTime,
        end_time: this.authFormDays.value.satEndTime,
        start_time_am_pm: this.authFormDays.value.satStartTimeAMPM,
        end_time_am_pm: this.authFormDays.value.satEndTimeAMPM
      },
      {
        day: 'Sunday',
        start_time: this.authFormDays.value.sunStartTime,
        end_time: this.authFormDays.value.sunEndTime,
        start_time_am_pm: this.authFormDays.value.sunStartTimeAMPM,
        end_time_am_pm: this.authFormDays.value.sunEndTimeAMPM
      }];

      if(this.changedValue == 'ongoing'){

        this.shiftData = {
          title: this.authFormDays.value.title,
          type: this.authFormDays.value.type,
          start_time: '',
          end_time: '',
          location: location,
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
          location: location,
          priority: this.authForm.value.priority,
          saved_by_users: [],
          shift_date: this.authForm.value.shift_date,
          days:[],
          start_date: '',
          end_date: '',
        };  
      };

      this.shiftService.UpdateShiftDetails(this.shiftData, this.guardDetails._id).subscribe((response) => {
        console.log(response);        
        this.spinnerService.hide(); 
        this.getCancelledshiftsList();         
        this.toastr.success('Shift updated successfully!');
        this.modalRef.close();
      });
    };

    DeleteShift(shift){
      this.shift  = shift;    
    };

    delete(shift){
      this.spinnerService.show();
      var shiftDataFordelete = {
        shiftId: shift._id
      }
      console.log(this.shiftData);
      this.shiftService.DeleteShift(shiftDataFordelete).subscribe((response) => {
        console.log(response);  
        this.spinnerService.hide();
        this.getCancelledshiftsList();
        this.toastr.success('Shift deleted successfully!');
      // this.modalRef.close(); 

    }); 
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

  getCalenderDate(datevalue){
    if(datevalue != null){
      var date = datevalue.split('-'), finalDate;
      if(date[2].length == 4){
        finalDate = date[2] + '-' + date[1] + '-' + date[0];
        finalDate = new Date(finalDate);
      }else{
        var str = date[2].split('T');
        finalDate = date[0] + '-' + date[1] + '-' + str[0];
        finalDate = new Date(finalDate); 
      }
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
      var start = days[index].start_time + ':00',
      am = days[index].start_time_am_pm == 1 ? ' PM' : ' AM',
      end = days[index].end_time + ':00',
      pm = days[index].end_time_am_pm == 1 ? ' PM' : ' AM';
      return  start + am + ' - ' + end + pm; 
    }else{
      var indexValue = index + 1;
      this.checkAvailableTime(days, indexValue);
    }
  };

  getAmPmDay(shift, days){
    if(days[0].start_time != 0){
      var startDate = shift.start_date_parsed; 
      var dateObject = new Date(startDate);
      var selectedDate = dateObject.toLocaleDateString();
      var currentDay = dateObject.toString().split(' ')[0];
      return dateObject;
      console.log(selectedDate + ' = ' + currentDay)
    }else{
      var startDate = shift.start_date_parsed; 
      var dateObject = new Date(startDate);
      var selectedDate = dateObject.toLocaleDateString();
      var currentDay = dateObject.toString().split(' ')[0];
      var test = this.getDateAccordingDays(currentDay, shift, dateObject, 1);
      return test;
    }   
  };

  getIndex(day, days){
    for(var i=0; i < days.length; i++){
      if(days[i].day == day){
        return i;
      }
    }
  };

  getDateAccordingDays(currentDay, shift, selectedDate, index){
    var indexValue;
    if(currentDay == 'Mon'){
      indexValue = this.getIndex('Monday', shift.days);
    }else if(currentDay == 'Tue'){
      indexValue = this.getIndex('Tuesday', shift.days);
    }else if(currentDay == 'Wed'){
      indexValue = this.getIndex('Wednesday', shift.days);
    }else if(currentDay == 'Thu'){
      indexValue = this.getIndex('Thursday', shift.days);
    }else if(currentDay == 'Fri'){
      indexValue = this.getIndex('Friday', shift.days);
    }else if(currentDay == 'Sat'){
      indexValue = this.getIndex('Saturday', shift.days);
    }else if(currentDay == 'Sun'){
      indexValue = this.getIndex('Sunday', shift.days);
    }
    if(shift.days[indexValue].start_time != 0){
      //console.log(shift.days[indexValue].start_time)
      var d = selectedDate;
      var currentSelectedDate = Date.parse(selectedDate);
      return selectedDate;
    }else{
      var nextDay = selectedDate;
      nextDay.setDate(selectedDate.getDate()+1);
      // console.log(nextDay);
      var nextSelectedDate = nextDay.toLocaleDateString();
      var currentDay = nextDay.toString().split(' ')[0];
      var endDate = shift.end_date_parsed;
      var nextDate = Date.parse(nextDay);
      index = index + 1;
      this.getDateAccordingDays(currentDay, shift, nextDay, index);
    }
  };


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
  }

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



  showRemarks(row){
  console.log(row)
  this.Remarks = row;
};

onKeydown(event) {
  if (event.key === "Enter") {
    console.log(event);
    return false;
  }else {
    return true;
  }
};

showCancel(row,editshiftongoing, string){
console.log(row,editshiftongoing, string);
   this.modalRef = this.modalService.open(editshiftongoing);
      this.modalRef.result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
}


}
