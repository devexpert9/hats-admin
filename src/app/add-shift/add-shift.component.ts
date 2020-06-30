import
{
  Component,
  OnInit,
  ViewChild
}
from '@angular/core';
import
{
  GooglePlaceDirective
}
from "ngx-google-places-autocomplete/ngx-google-places-autocomplete.directive";
import
{
  ComponentRestrictions
}
from "ngx-google-places-autocomplete/objects/options/componentRestrictions";
import
{
  Address
}
from "ngx-google-places-autocomplete/objects/address";
import
{
  FormGroup,
  FormBuilder,
  Validators,
  FormControl
}
from '@angular/forms';
import
{
  ShiftService
}
from '../services/shiftService';
import
{
  ToastrService
}
from 'ngx-toastr';
import
{
  NgbModal,
  ModalDismissReasons
}
from '@ng-bootstrap/ng-bootstrap';
import
{
  Ng4LoadingSpinnerService
}
from 'ng4-loading-spinner';
import
{
  Router
}
from '@angular/router';
import
{ 
  SecurityService
}
from '../services/securityService';
import
{
  LocationService
}
from '../services/locationService';


declare var google: any;
declare var $: any;
@Component(
{
  selector: 'app-add-shift',
  templateUrl: './add-shift.component.html',
  styleUrls: ['./add-shift.component.css']
})
export class AddShiftComponent implements OnInit
{
  @ViewChild("places") places: GooglePlaceDirective;
  authForm: FormGroup;
  map: any;
  latitude: any;
  longitude: any;
  formatted_address: any;
  shiftTypeValue: any;
  dropdownList = [];
  selectedItems = [];
  dropdownSettings = {};
  modalRef: any;
  closeResult: any;
  Time: any;
  authFormDays: FormGroup;
  days: any;
  options: any;
  securityGuardsList: any;
  userId: any;
  authFormDaysChanged: any;
  shiftType: any;
  mindate: any;
  maxdateStart: any;
  mindateavail: any;
  mintime: any;
  mintimedays: any;
  maxdateStartdays: any;
  locations: any;
  temp:any;
  temp2: any;
  mon: any;
  tue: any;
  wed: any;
  thurs: any;
  fri: any;
  sat: any;
  sun: any;
  stopDate: any;
  currentDate: any;
  holidays: any;
  date2_ms:any;
  date1_ms: any;
  IsPublicHoliday: any;
  IsSatSunday: any;
  SatSunDayArray = [];
  PublicHolidayArray = [];
  selectedWorker: any = '';
  selectedDate: any;
  date: any;
  date2: any;
  p:any;
  parse_res_start_time: any;
  parse_res_end_time: any;
  parse_shift_start_time: any;
  parse_shift_end_time: any;
  hours: any;
  minutes: any;
  difference_ms: any;
  one_day: any;
  tempt: any;
  ongoingShiftDateParse: any;
  nextDay: any;
  d: any;
  y: any;
  m: any;
  constructor(public fb: FormBuilder, public shiftService: ShiftService, private toastr: ToastrService, private modalService: NgbModal, public spinnerService: Ng4LoadingSpinnerService, public router: Router, public securityService: SecurityService, public locationService: LocationService)
  {

    if (localStorage.getItem('adminId') == undefined || localStorage.getItem('adminId') == '' || localStorage.getItem('adminId') == null)
    {
      this.router.navigateByUrl('/');
    }

    this.getHolidaysList();

     this.locations  = [];
     this.shiftType = '';

    //var input = document.getElementById("the_number_input")
    //input.addEventListener("mousewheel", function(evt){ evt.preventDefault(); })

    this.days = [];
    this.userId = '';
    this.latitude = 30.7333148;
    this.longitude = 76.7794179;
    // this.shiftType = '0';
    this.createForm();
    this.createFormForDays();
    this.getSecurityGuardsList();
    this.getLocations();
    const geocoder = new google.maps.Geocoder();
    const latlng1 = new google.maps.LatLng(this.latitude, this.longitude);
    const request = {
      latLng: latlng1
    };

    geocoder.geocode(request, (results, status) =>
    {
      var formatted_address = results[0].formatted_address;
      this.authForm.patchValue(
      {
        location: formatted_address
      });
      this.formatted_address = formatted_address;

    });

    var date = new Date();
    var formatdate = date.getDate(),
      formatdate1;
    if (date.getDate() < 10)
    {
      formatdate1 = '0' + formatdate.toString();
    }
    else
    {
      formatdate1 = formatdate.toString();
    }

    var monthday = date.getMonth(), monthvalue;
    if(monthday < 9){
      monthday = monthday + 1;
      monthvalue = '0' + monthday.toString();
    }else{
      monthvalue = monthday.toString();
    }
    console.log('monthvalue' + monthday)
    this.mindate = date.getFullYear() + '-' + monthvalue + '-' + formatdate1;
  }



  getLocations()
  {
    this.spinnerService.show();
    this.locationService.GetLocation().subscribe((response) =>
    {
      // this.locations = response.data;
      for(var i = 0; i< response.data.length; i++){
        if(response.data[i].status == true){
          this.locations.push(response.data[i]);
        }
      }
      this.spinnerService.hide();
    });

  };


  closeModal()
  {
    this.modalRef.close();
  };


  onKeydown(event)
  {
    if (event.key === "Enter")
    {
      console.log(event);
      return false;
    }
    else
    {
      return true;
    }
  }


  closeModalongoing()
  {
    for (var i = 0; i < this.days.length; i++)
    {
      if (this.days[i].start_time != '' && this.days[i].end_time != '')
      {
        this.authFormDaysChanged = true;
        break;
      }
      else
      {
        this.authFormDaysChanged = false;
        break;
      }
    }
    this.modalRef.close();
  };



  // handlerStart(e)
  // {
  //   this.maxdateStart = e.target.value;
  //   this.authForm.patchValue(
  //   {
  //     availability_start_date: '',
  //     availability_end_date: '',
  //   });
  //   this.calculateSundayAndPublicHolidays(0, this.maxdateStart, this.maxdateStart);
  // };

  handlerStart(e)
 {
   this.maxdateStart = e.target.value;
   
   this.authForm.patchValue(
   {
     availability_start_date: this.mindate,
     availability_end_date: e.target.value,
   });
   this.mindateavail = this.authForm.value.availability_start_date;
    //this.calculateSundayAndPublicHolidays(0, this.maxdateStart, this.maxdateStart);
 };

 handlerStartdays(e)
   {
     this.maxdateStartdays = e.target.value;
     if(Date.parse(this.authForm.value.end_date) < Date.parse(e.target.value)){
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
       end_date: this.temp
     })
     }
     this.calculateSundayAndPublicHolidays(1, e.target.value, this.authForm.value.end_date);
   };


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

  handlerStartTime(e)
  {
    console.log(e)
    this.mintime = e.target.value;
  }


  handlerStartTimeDays(e, value)
  {
    this.mintimedays = e.target.value;
  };



  ngOnInit()
  {
    window.scrollTo(0, 0);
    this.dropdownList = [
    {
      item_id: 0,
      item_text: 'Monday'
    },
    {
      item_id: 1,
      item_text: 'Tuesday'
    },
    {
      item_id: 2,
      item_text: 'Wednesday'
    },
    {
      item_id: 3,
      item_text: 'Thursday'
    },
    {
      item_id: 4,
      item_text: 'Friday'
    },
    {
      item_id: 5,
      item_text: 'Saturday'
    },
    {
      item_id: 6,
      item_text: 'Sunday'
    }, ];

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
  }


  //get all security guards list 
  getSecurityGuardsList()
  {
    var Data = {
      adminId: localStorage.getItem('adminId')
    };

    this.securityService.SecurityGuardsList(Data).subscribe((response) =>
    {
      console.log(response);
      this.securityGuardsList = response.data;
      this.spinnerService.hide();
    });
  };

  //select securtiy guard from list
  selectUser(value)
  {
    console.log(value.target.value);
    this.userId = value.target.value;
    for(var i=0; i < this.securityGuardsList.length; i++){
      if(this.securityGuardsList[i]._id == this.userId){
        this.selectedWorker = this.securityGuardsList[i];
      }
    }
  };


  onItemSelect(item: any)
  {
    console.log(item);

  }
  onSelectAll(items: any)
  {
    console.log(items);
  }

  public createForm()
  {

    this.authForm = this.fb.group(
    {
      title: ['', Validators.compose([Validators.required,  Validators.pattern("^(?=.*[A-Za-z])[A-Za-z0-9_ \d]{1,}$")])], 
      location: ['', Validators.compose([Validators.required])],
      priority: ['', Validators.compose([Validators.required])],
      type: ['', Validators.compose([Validators.required])],
      shift_date: [''],
      start_time: [''],
      end_time: [''],
      availability_start_date: [''],
      availability_end_date: [''],
      assigned_user: [''],
      start_date: [''],
      end_date: [''],
    });
    this.temp = new Date();
    var month = this.temp.getMonth()+1;
    var day = this.temp.getDate();
    if(day <= 9){
      day = 0 + day;
    }
    this.temp = this.temp.getFullYear() + '-' + month + '-' + day;
    this.maxdateStartdays = this.temp;
    this.authForm.patchValue({
      shift_date: this.temp,
      availability_start_date: this.temp,
      availability_end_date: this.temp,
      start_date: this.temp,
      end_date: this.temp
    });
  };


  public createFormForDays()
  {
    this.authFormDays = this.fb.group(
    {


      monStartTime: [''],
      tueStartTime: [''],
      wedStartTime: [''],
      thrusStartTime: [''],
      friStartTime: [''],
      satStartTime: [''],
      sunStartTime: [''],

      monEndTime: [''],
      tueEndTime: [''],
      wedEndTime: [''],
      thrusEndTime: [''],
      friEndTime: [''],
      satEndTime: [''],
      sunEndTime: [''],

      // monStartTimeAMPM: ['', Validators.compose([Validators.required])],
      // tueStartTimeAMPM: ['', Validators.compose([Validators.required])],
      // wedStartTimeAMPM: ['', Validators.compose([Validators.required])],
      // thrusStartTimeAMPM: ['', Validators.compose([Validators.required])],
      // friStartTimeAMPM: ['', Validators.compose([Validators.required])],
      // satStartTimeAMPM: ['', Validators.compose([Validators.required])],
      // sunStartTimeAMPM: ['', Validators.compose([Validators.required])],

      // monEndTimeAMPM: ['', Validators.compose([Validators.required])],
      // tueEndTimeAMPM: ['', Validators.compose([Validators.required])],
      // wedEndTimeAMPM: ['', Validators.compose([Validators.required])],
      // thrusEndTimeAMPM: ['', Validators.compose([Validators.required])],
      // friEndTimeAMPM: ['', Validators.compose([Validators.required])],
      // satEndTimeAMPM: ['', Validators.compose([Validators.required])],
      // sunEndTimeAMPM: ['', Validators.compose([Validators.required])],

    });
  };


  empty( start, end){
   this.authFormDays.controls[start].setValue('');
   this.authFormDays.controls[end].setValue('');
  };


  public handleAddressChange(address: Address)
  {
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

    geocoder.geocode(request, (results, status) =>
    {
      var formatted_address = results[0].formatted_address;
      this.authForm.patchValue(
      {
        location: formatted_address
      });
      this.formatted_address = formatted_address;

    });

  };

  markerDragEnd(value)
  {
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

    geocoder.geocode(request, (results, status) =>
    {
      var formatted_address = results[0].formatted_address;
      this.authForm.patchValue(
      {
        location: formatted_address
      });
      this.formatted_address = formatted_address;

    });
  };


  addShift()
  {
    this.spinnerService.show();
    console.log(this.authForm.value);
 
    if (this.authForm.value.type == '0')
    {
      var shiftData = {
        title: this.authForm.value.title,
        type: this.authForm.value.type,
        start_time: this.formatTime(this.authForm.value.start_time),
        end_time: this.formatTime(this.authForm.value.end_time),
        location: this.authForm.value.location,
        priority: this.authForm.value.priority,
        saved_by_users: [],
        shift_date: this.authForm.value.shift_date,
        days: [],
        start_date: '',
        end_date: '',
        availability_start_date: this.authForm.value.availability_start_date,
        availability_end_date: this.authForm.value.availability_end_date,
        assigned_to: this.userId
      };
      this.postShift(shiftData);
    }
    else
    {
      shiftData = {
        title: this.authForm.value.title,
        type: this.authForm.value.type,
        start_time: this.formatTime(this.authForm.value.start_time),
        end_time: this.formatTime(this.authForm.value.end_time),
        location: this.authForm.value.location,
        priority: this.authForm.value.priority,
        saved_by_users: [],
        shift_date: this.authForm.value.shift_date,
        days: this.days,
        start_date: this.authForm.value.start_date,
        end_date: this.authForm.value.end_date,
        availability_start_date: '',
        availability_end_date: '',
        assigned_to: this.userId
      };

      // this.postShift(shiftData);
      //parse start date
      this.temp = new Date(shiftData.start_date);
      var d1 = Date.parse(this.temp);

      //parse end date
      this.temp = new Date(shiftData.end_date);
      var d2 = Date.parse(this.temp);
      //this.postShift(shiftData);
      var weekdays = [
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
        'saturday',
        'sunday'
      ];
      console.log(this.selectedWorker)
      if(this.userId != ''){
        this.spinnerService.hide();

        //calculate user license expiry date
        var date = this.selectedWorker.licence_exp_date.split('-');
        if(date[2].length == 4){
          var finalDate = date[2] + '-' + date[1] + '-' + date[0];
        }else{
          var str = date[2].split('T');
          var finalDate = date[0] + '-' + date[1] + '-' + str[0];
        }
      
        this.date = new Date(finalDate);
        var licence_exp_date = Date.parse(this.date)
        //parse current date into numeric value
        var current_date = new Date(shiftData.end_date);
        var isodate = current_date.toISOString();
        var index = isodate.lastIndexOf('T');
        this.date  = isodate.slice(0,index) 
        this.date2 = new Date(this.date);
        var parseDate = Date.parse(this.date2);
        var IsShiftExistedForPost = true;
        //check is user license expire or not
        if(licence_exp_date < parseDate){
          alert(this.selectedWorker.firstname + " license will be expired within selected dates.");
        }else{
          if(this.selectedWorker.availabilityArray.length == 0){
            this.toastr.error(this.selectedWorker.firstname + ' has not updated his availability/schedule yet, Please select another worker.');
          }else{
            for(var i=0; i < 7; i++){
              if(this.selectedWorker.availabilityArray[i].off == true && this.selectedWorker.availabilityArray[i].start == '' && shiftData.days[i].start_time != ''){
                this.toastr.error('On ' + weekdays[i] + ', '+this.selectedWorker.firstname + ' will be off duty.');
                IsShiftExistedForPost = false;
                break;
              }else{
                var shiftParseStartTime =  Number(shiftData.days[i].start_time.split(':')[0]),
                shiftParseEndTime =  Number(shiftData.days[i].end_time.split(':')[0]),
                dayParseStartTime = Number(this.selectedWorker.availabilityArray[i].start.split(':')[0]),
                dayParseEndTime = Number(this.selectedWorker.availabilityArray[i].end.split(':')[0]),
                dayTimeDiff = this.diff(shiftData.days[i].start_time, this.selectedWorker.availabilityArray[i].end),
                shiftTimeDiff = this.diff(shiftData.days[i].start_time, shiftData.days[i].end_time),
                temp = shiftTimeDiff.split(':'),
                temp1 = dayTimeDiff.split(':'),
                sHours = Number(temp[0]),
                sMinutes = Number(temp[1]),
                hours = Number(temp1[0]),
                minutes = Number(temp1[1]);
                console.log('shiftParseStartTime'+ shiftParseStartTime)
                console.log('shiftParseEndTime'+ shiftParseEndTime)
                console.log('dayParseStartTime'+ dayParseStartTime)
                console.log('dayParseEndTime'+ dayParseEndTime)

                if(shiftData.days[i].start_time != ''){
                  if (dayParseStartTime < dayParseEndTime) {
                    //9-16
                    if(shiftParseStartTime >= dayParseStartTime && shiftParseEndTime <= dayParseEndTime){
                      // alert('availability')
                      IsShiftExistedForPost = true;
                    }else{
                      IsShiftExistedForPost = false;
                      alert('Time limit exeed for ' + weekdays[i] +'.Availability time for ' + weekdays[i] + ' is ' + this.selectedWorker.availabilityArray[i].start + ' to ' + this.selectedWorker.availabilityArray[i].end);
                      break;
                    }
                  }else if(dayParseStartTime > dayParseEndTime){
                    //16-9
                    if((shiftParseStartTime >= dayParseStartTime || shiftParseEndTime <= dayParseEndTime) && sHours < hours){
                      IsShiftExistedForPost = true;
                    }else if((shiftParseStartTime >= dayParseStartTime || shiftParseEndTime <= dayParseEndTime) && sHours == hours && sMinutes < minutes){
                      IsShiftExistedForPost = true;
                    }else{
                      alert('Time limit exeed for ' + weekdays[i]+'.Availability time for ' + weekdays[i] + ' is ' + this.selectedWorker.availabilityArray[i].start + ' to ' + this.selectedWorker.availabilityArray[i].end);
                      IsShiftExistedForPost = false;
                      break;
                    }
                  }
                }
              }
            }

            if(IsShiftExistedForPost){
              this.spinnerService.show();
              this.checkWorkerAvailabilityInShifts(shiftData);
            }
          }
        }
      }else{
         this.postShift(shiftData);
      }
    }
  };

  checkWorkerAvailabilityInShifts(shift){
    var shift = shift;
    console.log('shift')
    console.log(shift.start_time)
    localStorage.setItem('shift_start_time', JSON.stringify(new Date('1970-01-01T' + shift.start_time +':00')));
    localStorage.setItem('shift_end_time', JSON.stringify(new Date('1970-01-01T' + shift.end_time+':00')));

    var shiftData = {
      start_date: shift.start_date,
      assigned_to: this.selectedWorker._id
    };
    //alert('hello')
    var d = new Date(shift.start_date).toString();
    this.p = Date.parse(d);
    this.shiftService.IsWorkerAvailable(shiftData).subscribe((res) => {
      console.log('res')
      console.log(res);
      var data = res;
      var IsWorkerAvailableForShift = true;
      if(data.length > 0){
        //alert(data.length)
        for(var i=0; i < data.length; i++){
          var tempData = data[i];
          localStorage.setItem('tempData', JSON.stringify(tempData));
          if(tempData.type == '0'){
            var selectedShift = {'shift_date': null};
                selectedShift =  JSON.parse(localStorage.getItem('tempData'));

            if(selectedShift.shift_date == this.p){
              var res_start_time = new Date('1970-01-01T' + tempData.start_time + ':00').toString();
              var res_end_time = new Date('1970-01-01T' + tempData.end_time +':00').toString();

              this.parse_shift_start_time = Date.parse(localStorage.getItem('shift_start_time'));
              this.parse_shift_end_time = Date.parse(localStorage.getItem('shift_end_time'));

              this.parse_res_start_time  = Date.parse(res_start_time);
              this.parse_res_end_time = Date.parse(res_end_time);

            var resTimeDiff = this.diff(tempData.start_time, tempData.end_time),
              shiftTimeDiff = this.diff(shift.start_time, shift.end_time),
              temp = shiftTimeDiff.split(':'),
              temp1 = resTimeDiff.split(':'),
              sHours = Number(temp[0]),
              sMinutes = Number(temp[1]),
              hours = Number(temp1[0]),
              minutes = Number(temp1[1]);
              if (this.parse_res_start_time < this.parse_res_end_time) {
                //9-16
                if(this.parse_shift_start_time >= this.parse_res_start_time && this.parse_shift_end_time <= this.parse_res_end_time){
                  //alert('not availability')
                  IsWorkerAvailableForShift = false;
                  //this.checkWorkerAvailabilityInShifts(shift, Data, Index);
                }else{
                  //console.log('shift_startTimeDiff' + shift_startTimeDiff)
                  var str;
                  str = shift_startTimeDiff.split(':');
                  this.hours = str[0];
                  this.minutes = str[1];
                  if(Number(this.hours) == 0 && Number(this.minutes) < 30){
                    IsWorkerAvailableForShift = false;
                    console.log('not accept')
                  }else{
                    IsWorkerAvailableForShift = false;
                  }
                }
              }else if(this.parse_res_start_time > this.parse_res_end_time){
                //16-9
                if((this.parse_shift_start_time >= this.parse_res_start_time || this.parse_shift_end_time <= this.parse_res_end_time) && sHours < hours){
                  // alert(' not availability')
                  IsWorkerAvailableForShift = false;
                  // this.checkWorkerAvailabilityInShifts(shift, Data, Index);
                }else if((this.parse_shift_start_time >= this.parse_res_start_time || this.parse_shift_end_time <= this.parse_res_end_time) && sHours == hours && sMinutes < minutes){
                  // alert(' not availability')
                  IsWorkerAvailableForShift = false;
                  // this.checkWorkerAvailabilityInShifts(shift, Data, Index);
                }else{
                  ///console.log('shift_startTimeDiff' + shift_startTimeDiff)
                  var  str;
                  str = shift_startTimeDiff.split(':');
                  this.hours = str[0];
                  this.minutes = str[1];
                  if(Number(this.hours) == 0 && Number(this.minutes) < 30){
                    IsWorkerAvailableForShift = false;
                    console.log('not accept')
                  }else{
                    IsWorkerAvailableForShift = false;
                  }
                  // alert('availability')
                }
              }
            }
          }else{
            var ongoingShiftStartDate = new Date(tempData.start_date),
              ongoingShiftEndDate = new Date(tempData.end_date),
              ongoingShiftEndDateParse = tempData.end_date,
              days = this.daysBetween(ongoingShiftStartDate, ongoingShiftEndDate);
              this.ongoingShiftDateParse = tempData.start_date,
              //alert(days)
              days = days + 1;
              for(var k=0; k <= days; k++){
                //var nextSelectedDate = ongoingShiftStartDate.toLocaleDateString();
                var currentDay = ongoingShiftStartDate.toString().split(' ')[0];
                console.log('ongoingShiftDateParse'+ this.ongoingShiftDateParse);
                console.log('p'+ this.p);
                console.log('currentDay' + currentDay)

                if(this.ongoingShiftDateParse == this.p){
                  var indexValue;
                  if (currentDay == 'Mon') {
                    indexValue = 0;
                  } else if (currentDay == 'Tue') {
                    indexValue = 1;
                  } else if (currentDay == 'Wed') {
                    indexValue = 2;
                  } else if (currentDay == 'Thu') {
                    indexValue = 3;
                  } else if (currentDay == 'Fri') {
                    indexValue = 4;
                  } else if (currentDay == 'Sat') {
                    indexValue = 5;
                  } else if (currentDay == 'Sun') {
                    indexValue = 6;
                  }

                  console.log('index'+indexValue);
                  //is time set for selected day
                  if(tempData.days[indexValue].start_time != ''){
                    var res_start_time = new Date('1970-01-01T' + tempData.days[indexValue].start_time + ':00').toString();
                    var res_end_time = new Date('1970-01-01T' + tempData.days[indexValue].end_time +':00').toString();

                    this.parse_shift_start_time = Date.parse(localStorage.getItem('shift_start_time'));
                    this.parse_shift_end_time = Date.parse(localStorage.getItem('shift_end_time'));

                    this.parse_res_start_time = Date.parse(res_start_time);
                    this.parse_res_end_time = Date.parse(res_end_time);

                    
                    console.log('parse_res_start_time' + tempData.days[indexValue].start_time)
                    console.log('parse_shift_end_time' + shift.end_time)
                    console.log('parse_res_start_time' + this.parse_res_start_time)
                    console.log('parse_shift_end_time' + this.parse_shift_end_time)
                    var selectedShiftTimeDiff = this.diff(shift.start_time, shift.end_time);
                    var comparedShiftTimeDiff = this.diff(tempData.days[indexValue].start_time, tempData.days[indexValue].end_time);

                    console.log('selectedShiftTimeDiff' + selectedShiftTimeDiff)
                    console.log('comparedShiftTimeDiff' + comparedShiftTimeDiff)

                    if (this.parse_res_start_time < this.parse_res_end_time) {
                      //9-16
                      if(this.parse_shift_start_time >= this.parse_res_start_time && this.parse_shift_end_time <= this.parse_res_end_time){
                        //alert('not availability')
                        IsWorkerAvailableForShift = false;
                        //this.checkWorkerAvailabilityInShifts(shift, Data, Index);
                      }else{
                        var shift_startTimeDiff = this.diff(tempData.days[indexValue].end_time, localStorage.getItem('shift_start_time'));
                        //console.log('shift_startTimeDiff' + shift_startTimeDiff)
                        var str;
                        str = shift_startTimeDiff.split(':');
                        this.hours = str[0];
                        this.minutes = str[1];
                        if(Number(this.hours) == 0 && Number(this.minutes) < 30){
                          IsWorkerAvailableForShift = false;
                          console.log('not accept')
                        }else{
                          IsWorkerAvailableForShift = false;
                        }
                      }
                    }else if(this.parse_res_start_time > this.parse_res_end_time){
                      //16-9
                      if((this.parse_shift_start_time >= this.parse_res_start_time || this.parse_shift_end_time <= this.parse_res_end_time) && sHours < hours){
                        // alert(' not availability')
                        IsWorkerAvailableForShift = false;
                        // this.checkWorkerAvailabilityInShifts(shift, Data, Index);
                      }else if((this.parse_shift_start_time >= this.parse_res_start_time || this.parse_shift_end_time <= this.parse_res_end_time) && sHours == hours && sMinutes < minutes){
                        // alert(' not availability')
                        IsWorkerAvailableForShift = false;
                        // this.checkWorkerAvailabilityInShifts(shift, Data, Index);
                      }else{
                        var shift_startTimeDiff = this.diff(localStorage.getItem('shift_end_time'), tempData.days[indexValue].start_time);
                        //console.log('shift_startTimeDiff' + shift_startTimeDiff)
                        var  str;
                        str = shift_startTimeDiff.split(':');
                        this.hours = str[0];
                        this.minutes = str[1];
                        if(Number(this.hours) == 0 && Number(this.minutes) < 30){
                          IsWorkerAvailableForShift = false;
                          console.log('not accept')
                        }else{
                          IsWorkerAvailableForShift = false;
                        }
                        // alert('availability')
                      }
                    }
                  } 
                   
                } 
                this.nextDay = ongoingShiftStartDate;
                this.nextDay.setDate(ongoingShiftStartDate.getDate() + 1).toString();  
                // this.tempt = ;
                this.ongoingShiftDateParse = Date.parse(this.nextDay);
              }
          }
        }
      }

      if(IsWorkerAvailableForShift){
        //alert('IsWorkerAvailable')
        this.postShift(shift);
        // const loading = this.loadingCtrl.create({});
        // loading.present();
        // this.shiftService.AcceptDeclineShift(Data).subscribe((data) => {
        //   //console.log(data);
        //   loading.dismissAll();
        //   console.log('shift accepted by');
        //   console.log(index)
        //   this.temp = new Date();
        //   this.temp = this.temp.toISOString();
        //   this.shifts[index].shift_accept_time = this.temp;
        //   this.shifts[index].accepted_by.push({
        //     'userId': localStorage.getItem('userId'),
        //     'shift_accept_time': this.temp
        //   });
          
        //   let toast = this.toastCtrl.create({
        //     message: 'Shift has been accepted successfully.',
        //     duration: 3000
        //   });

        //   toast.onDidDismiss(() => {
        //     console.log('Dismissed toast');
        //   });

        //   toast.present();
        //   console.log("Shift has been accepted successfully.");
        // });
        }else{
          this.spinnerService.hide();
          alert('Shift already assigned between these selected days.')
        }
      
      console.log('IsWorkerAvailableForShift' + IsWorkerAvailableForShift)
    }); 
  };


  daysBetween( date1, date2 ) {
    //Get 1 day in milliseconds
    this.one_day=1000*60*60*24;

    // Convert both dates to milliseconds
    this.date1_ms = new Date(date1).getTime();
    this.date2_ms = new Date(date2).getTime();

    // Calculate the difference in milliseconds
    this.difference_ms = this.date2_ms - this.date1_ms;
      
    // Convert back to days and return
    return Math.round(this.difference_ms/this.one_day); 
  };

  diff(start, end) {
    if (start != null) {
      start = start.split(":");
      end = end.split(":");
      var startDate = new Date(0, 0, 0, start[0], start[1], 0);
      var endDate = new Date(0, 0, 0, end[0], end[1], 0);
      var diff = endDate.getTime() - startDate.getTime();
      var hours = Math.floor(diff / 1000 / 60 / 60);
      diff -= hours * 1000 * 60 * 60;
      var minutes = Math.floor(diff / 1000 / 60);

      // If using time pickers with 24 hours format, add the below line get exact hours
      if (hours < 0) {
        hours = hours + 24;
      }

      return (hours <= 9 ? "0" : "") + hours + ":" + (minutes <= 9 ? "0" : "") + minutes;
    }
  };

  postShift(shiftData){
    this.shiftService.AddNewShift(shiftData).subscribe((response) =>
    {
      console.log(response);
      this.spinnerService.hide();
      if (response.status == 1)
      {
        this.toastr.success('Shift has been added successfully.');
        this.authForm.patchValue(
        {
          title: '',
          location: '',
          priority: '',
          type: '',
          shift_date: '',
          start_time: '',
          end_time: '',
          availability_start_date: '',
          availability_end_date: '',
        });
        if (response.data.type == "0")
        {
          this.router.navigateByUrl('/open-shift');
        }
        else if (response.data.type == "1" && response.data.assigned_to == '')
        {
          this.router.navigateByUrl('/open-shift');
        }
        else if (response.data.type == "1" && response.data.assigned_to != '')
        {
          this.router.navigateByUrl('/assigned-shifts');
        }
        else
        {
          this.toastr.error('Please fill all details.');
        };


      }
      else if(response.status == 3)
      {
        this.toastr.error('Another shift has same title!');
      };
    });
  }

  formatTime(time)
  {
    if (time == "00:00")
    {
      time = "23:59";
      return time;
    }
    else
    {
      return time;
    }
  }

  filterChanged(event)
  {
    let control;
    this.shiftTypeValue = event;
    this.shiftType = event;

    if (event == '0')
    {
      this.authForm.get('shift_date').setValidators([Validators.required]);
      this.authForm.get('start_time').setValidators([Validators.required]);
      this.authForm.get('end_time').setValidators([Validators.required]);
      this.authForm.get('start_date').setValidators(null);
      this.authForm.get('end_date').setValidators(null);
      this.authForm.get('start_date').setErrors(null);
      this.authForm.get('end_date').setErrors(null);
      this.IsPublicHoliday = false;
      this.IsSatSunday = false;
      this.PublicHolidayArray = [];
      this.calculateSundayAndPublicHolidays(0, this.authForm.value.shift_date, this.authForm.value.shift_date);
    }
    else if (event == '1')
    {
      console.log(this.authFormDays.valid);
      this.authForm.get('start_date').setValidators([Validators.required]);
      this.authForm.get('end_date').setValidators([Validators.required]);


      this.authForm.get('shift_date').setValidators(null);
      this.authForm.get('start_time').setValidators(null);
      this.authForm.get('end_time').setValidators(null);

      this.authForm.get('shift_date').setErrors(null);
      this.authForm.get('start_time').setErrors(null);
      this.authForm.get('end_time').setErrors(null);

      this.authForm.get("shift_date").updateValueAndValidity(
      {
        emitEvent: false,
        onlySelf: true
      });
      this.authForm.get("start_time").updateValueAndValidity(
      {
        emitEvent: false,
        onlySelf: true
      });
      this.authForm.get("end_time").updateValueAndValidity(
      {
        emitEvent: false,
        onlySelf: true
      });

    }

  };


  ViewDays(editshift)
  {

    this.mon = 0;
    this.tue = 0;
    this.wed = 0;
    this.thurs = 0;
    this.fri = 0;
    this.sat = 0;
    this.sun = 0;
    this.getDates(this.authForm.value.start_date, this.authForm.value.end_date);
    this.IsPublicHoliday = false;
    this.IsSatSunday = false;
    this.PublicHolidayArray = [];
    this.calculateSundayAndPublicHolidays(1, this.authForm.value.start_date, this.authForm.value.end_date);
    this.modalRef = this.modalService.open(editshift);
    this.modalRef.result.then((result) =>
    {
      //  console.log(result);
      this.closeResult = `Closed with: ${result}`;
    }, (reason) =>
    {
      // console.log(reason);
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string
  {
    if (reason === ModalDismissReasons.ESC)
    {
      return 'by pressing ESC';
    }
    else if (reason === ModalDismissReasons.BACKDROP_CLICK)
    {
      return 'by clicking on a backdrop';
    }
    else
    {
      return 'with:${reason}';
    }
  };

  dynamicChange()
  {
    if (this.authForm.value.start_date != '' && this.authForm.value.end_date != '' && this.authFormDaysChanged == true)
    {
      return false;
    }
    else
    {
      return true;
    }
  }



  addOngoingShift()
  {


    console.log(this.authFormDays.value);
    var days = [
    {
      day: 'Monday',
      start_time: this.formatTime(this.authFormDays.value.monStartTime),
      end_time: this.formatTime(this.authFormDays.value.monEndTime)
    },
    {
      day: 'Tuesday',
      start_time: this.formatTime(this.authFormDays.value.tueStartTime),
      end_time: this.formatTime(this.authFormDays.value.tueEndTime),
    },
    {
      day: 'Wednesday',
      start_time: this.formatTime(this.authFormDays.value.wedStartTime),
      end_time: this.formatTime(this.authFormDays.value.wedEndTime),
    },
    {
      day: 'Thursday',
      start_time: this.formatTime(this.authFormDays.value.thrusStartTime),
      end_time: this.formatTime(this.authFormDays.value.thrusEndTime),
    },
    {
      day: 'Friday',
      start_time: this.formatTime(this.authFormDays.value.friStartTime),
      end_time: this.formatTime(this.authFormDays.value.friEndTime),
    },
    {
      day: 'Saturday',
      start_time: this.formatTime(this.authFormDays.value.satStartTime),
      end_time: this.formatTime(this.authFormDays.value.satEndTime),
    },
    {
      day: 'Sunday',
      start_time: this.formatTime(this.authFormDays.value.sunStartTime),
      end_time: this.formatTime(this.authFormDays.value.sunEndTime),
    }];
    console.log(days);
    this.days = days;


    // if(this.authFormDays.valid == true){
    //     this.authFormDaysChanged = true;
    //   }else{
    //     this.authFormDaysChanged = false;
    //   }



    if (this.days[0].day == 'Monday')
    {
      if (this.days[0].start_time != '' && this.days[0].end_time == '')
      {
        // this.authFormDays.get('monEndTime').setValidators([Validators.required]);
        this.toastr.error('Please fill end time.');
      }
      else if (this.days[0].start_time == '' && this.days[0].end_time != '')
      {
        // this.authFormDays.get('monStartTime').setValidators([Validators.required]);
        this.toastr.error('Please fill start time.');
      }
      else if ((this.days[0].start_time == '' && this.days[0].end_time == '') || (this.days[0].start_time != '' && this.days[0].end_time != ''))
      {
        //  this.authFormDays.get('monEndTime').setValidators(null);
        // this.authFormDays.get('monEndTime').setErrors(null);
        // this.authFormDays.get('monStartTime').setValidators(null);
        // this.authFormDays.get('monStartTime').setErrors(null);
        this.modalRef.close();
      }

    }
    else if (this.days[1].day == 'Tuesday')
    {

      if (this.days[1].start_time != '' && this.days[1].end_time == '')
      {
        // this.authFormDays.get('monEndTime').setValidators([Validators.required]);
        this.toastr.error('Please fill end time.');
      }
      else if (this.days[1].start_time == '' && this.days[1].end_time != '')
      {
        // this.authFormDays.get('monStartTime').setValidators([Validators.required]);
        this.toastr.error('Please fill start time.');
      }
      else if ((this.days[1].start_time == '' && this.days[1].end_time == '') || this.days[1].start_time != '' && this.days[1].end_time != '')
      {
        //  this.authFormDays.get('tueEndTime').setValidators(null);
        // this.authFormDays.get('tueEndTime').setErrors(null);
        // this.authFormDays.get('tueStartTime').setValidators(null);
        // this.authFormDays.get('tueStartTime').setErrors(null);
        this.modalRef.close();
      }

    }
    else if (this.days[2].day == 'Wednesday')
    {
      if (this.days[2].start_time != '' && this.days[2].end_time == '')
      {
        // this.authFormDays.get('wedEndTime').setValidators([Validators.required]);
        this.toastr.error('Please fill end time.');
      }
      else if (this.days[2].end_time != '' && this.days[2].start_time == '')
      {
        // this.authFormDays.get('wedStartTime').setValidators([Validators.required]);
        this.toastr.error('Please fill start time.');
      }
      else if ((this.days[2].start_time == '' && this.days[2].end_time == '') || this.days[2].start_time != '' && this.days[2].end_time != '')
      {
        //  this.authFormDays.get('wedEndTime').setValidators(null);
        // this.authFormDays.get('wedEndTime').setErrors(null);
        // this.authFormDays.get('wedStartTime').setValidators(null);
        // this.authFormDays.get('wedStartTime').setErrors(null);
        this.modalRef.close();
      }

    }
    else if (this.days[3].day == 'Thursday')
    {
      if (this.days[3].start_time != '' && this.days[3].end_time == '')
      {
        // this.authFormDays.get('thrusEndTime').setValidators([Validators.required]);
        this.toastr.error('Please fill end time.');
      }
      else if (this.days[3].end_time != '' && this.days[3].start_time == '')
      {
        // this.authFormDays.get('thrusStartTime').setValidators([Validators.required]);
        this.toastr.error('Please fill start time.');
      }
      else if ((this.days[3].start_time == '' && this.days[3].end_time == '') || this.days[3].start_time != '' && this.days[3].end_time != '')
      {
        //  this.authFormDays.get('thrusEndTime').setValidators(null);
        // this.authFormDays.get('thrusEndTime').setErrors(null);
        // this.authFormDays.get('thrusStartTime').setValidators(null);
        // this.authFormDays.get('thrusStartTime').setErrors(null);
        this.modalRef.close();
      }

    }
    else if (this.days[4].day == 'Friday')
    {
      if (this.days[4].start_time != '' && this.days[4].end_time == '')
      {
        this.toastr.error('Please fill end time.');
      }
      else if (this.days[4].start_time == '' && this.days[4].end_time != '')
      {
        this.toastr.error('Please fill start time.');
      }
      else if ((this.days[4].start_time == '' && this.days[4].end_time == '') || this.days[4].start_time != '' && this.days[4].end_time != '')
      {
        this.modalRef.close();
      }

    }
    else if (this.days[5].day == 'Saturday')
    {
      if (this.days[5].start_time != '' && this.days[5].end_time == '')
      {
        this.toastr.error('Please fill end time.');
      }
      else if (this.days[5].end_time != '' && this.days[5].start_time == '')
      {
        this.toastr.error('Please fill start time.');
      }
      else if ((this.days[5].start_time == '' && this.days[5].end_time == '') || this.days[5].start_time != '' && this.days[5].end_time != '')
      {
        this.modalRef.close();
      }

    }
    else
    {
      if (this.days[6].start_time != '' && this.days[6].end_time == '')
      {
        this.toastr.error('Please fill end time.');
      }
      else if (this.days[6].end_time != '' && this.days[6].start_time == '')
      {
        this.toastr.error('Please fill start time.');
      }
      else if ((this.days[6].start_time == '' && this.days[6].end_time == '') || this.days[6].start_time != '' && this.days[6].end_time != '')
      {
        this.modalRef.close();

      }



    }

    for (var i = 0; i < this.days.length; i++)
    {
      if (this.days[i].start_time != '' && this.days[i].end_time != '')
      {
        this.authFormDaysChanged = true;
        break;
      }
      else
      {
        this.authFormDaysChanged = false;
        // break;
      }
    }
  }



  getDates(startDate, stopDate) {
    console.log(startDate, stopDate);
    startDate = startDate.toString();
    var dateArray = [];
    this.d = startDate.split('-')[2];
    this.m = Number(startDate.split('-')[1]);
    this.y = startDate.split('-')[0]

    if(this.m < 10){
      this.m = '0' + this.m;
    }

    this.currentDate = new Date(this.y + '-' + this.m + '-' + this.d);

    stopDate = stopDate.toString();

    this.d = stopDate.split('-')[2];
    this.m = Number(stopDate.split('-')[1]);
    this.y = stopDate.split('-')[0]

    if(this.m < 10){
      this.m = '0' + this.m;
    }

    this.stopDate = new Date(this.y + '-' + this.m + '-' + this.d);
    console.log(this.currentDate,this.stopDate) 
    this.currentDate= this.currentDate.setDate( this.currentDate.getDate()-1);
    this.currentDate = new Date(this.currentDate);
    while (this.currentDate < this.stopDate) {
      dateArray.push( this.currentDate )
      console.log(dateArray)
      this.currentDate = this.currentDate.setDate(this.currentDate.getDate()+1);
      this.currentDate= new Date(this.currentDate);
      console.log(this.currentDate)
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


getHolidaysList(){
  this.holidays = [];
  this.securityService.GetHoliday().subscribe((response) =>{
    console.log(response.data);
    this.spinnerService.hide();
    // this.holidays = response.data; 
    if (response.data.length > 0)
    {
      for (var i = 0; i < response.data.length; i++)
      {
        if (response.data[i].status == true)
        {
          this.holidays.push(response.data[i]);
        }
      }
    }
  });
};

calculateSundayAndPublicHolidays(type, start_date, end_date){
  if(type == 0){
    console.log('type');
    console.log(start_date)
    this.IsPublicHoliday = false;

    for(var i = 0; i < this.holidays.length; i++){
      console.log(this.holidays[i].select_date)
      if(this.holidays[i].select_date == start_date){
        this.IsPublicHoliday = true;
        this.PublicHolidayArray.push({
          'date': start_date,
          'day': 'Public holiday'
        });
      }
    }

    if(!this.IsPublicHoliday){
      console.log('not public holiday');
      var dateObject = new Date(start_date);
      var selectedDate = dateObject.toLocaleDateString();
      var currentDay = dateObject.toString().split(' ')[0];
      if(currentDay == 'Sun' || currentDay == 'Sat'){
        this.IsSatSunday = true;
        console.log('IsSatSunday'+this.IsSatSunday)
        this.PublicHolidayArray.push({
          'date': start_date,
          'day': currentDay
        });
      }
    }
  }else{
    var days = this.daysBetween(start_date, end_date);
    console.log('daysBetween'+ days)
    for(var i= 0; i <= Number(days); i++){
      this.IsPublicHoliday = false;
      //2018-12-31
      this.selectedDate;
      if(i==0){
        this.selectedDate = start_date
      }else{
        var nextDay = new Date(start_date);
        nextDay.setDate(nextDay.getDate() + i);

        console.log('nextDay');
        console.log(nextDay);
        console.log('end')
        var year = nextDay.getFullYear(),month = (nextDay.getMonth() + 1),month1, day1, day = nextDay.getDate();
        if(month < 10){
          month1 = '0' + month.toString();
        }else{
          month1 = month.toString();
        }

        if(day < 10){
          day1 = '0' + day;
        }else{
          day1 = day.toString();
        }
        selectedDate = year + '-' + month1 + '-' + day1;
        console.log('selectedDate inside if' + year + ':' + month1 + ':' + day1)
      }

      console.log('selectedDate: ' + selectedDate);
      for(var j = 0; j < this.holidays.length; j++){
        console.log(this.holidays[j].select_date)
        if(this.holidays[j].select_date == selectedDate){
          this.IsPublicHoliday = true;
          this.selectedDate = selectedDate.split('-');
          selectedDate = this.selectedDate[2] +'/' + this.selectedDate[1] + '/' + this.selectedDate[0];
          this.PublicHolidayArray.push({
            'date': selectedDate,
            'day': 'Public holiday'
          });
        }
      }

      if(!this.IsPublicHoliday){
        var dateObject = new Date(selectedDate);
        var selectedDate = dateObject.toLocaleDateString();
        var currentDay = dateObject.toString().split(' ')[0];
        if(currentDay == 'Sun' || currentDay == 'Sat'){
          this.IsSatSunday = true;
          console.log('IsSatSunday'+this.IsSatSunday)
          this.PublicHolidayArray.push({
            'date': selectedDate,
            'day': currentDay
          });
        }
      }
      
      
    }
  }
};

}