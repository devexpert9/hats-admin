import{Component,OnInit}from '@angular/core';
import{ShiftService}from '../services/shiftService';
import{Ng4LoadingSpinnerService}from 'ng4-loading-spinner';
import * as jspdf from 'jspdf';
import { LocationService } from '../services/locationService';
import html2canvas from 'html2canvas';
import { SecurityService } from '../services/securityService';
declare var jsPDF: any;
declare var $: any;

@Component({
  selector: 'app-user-roaster',
  templateUrl: './user-roaster.component.html',
  styleUrls: ['./user-roaster.component.css']
})
export class UserRoasterComponent implements OnInit {
	ShiftsList: any;
	securityGuardsList: any;
	select_date: any;
	start_date: any;
	end_date: any;
	userId: any;
	startDate: any;
	endDate: any;
	today: any;
	tomorrow: any;
	parseStartDate: any;
	fromDate: any;
	formParseDate: any;
	shiftStartDate: any;
	shiftEnd: any;
	shiftEndDate: any;
	workloadDate: any;
	workloadEndDate: any;
	shiftStartDateParse: any;
	shiftEndDateParse: any;
	rows: any;
	parseDate: any;
    selectedShift:any;
    shift: any;
    isShiftSelected:any = false;
    locations: any;
    type1: any;

    constructor(public shiftService: ShiftService,private locationService: LocationService, public spinnerService: Ng4LoadingSpinnerService,public securityService: SecurityService)
    {
        this.getSecurityGuardsList();
        this.getLocations();
        this.ShiftsList = [];
    }

    ngOnInit(){
        window.scrollTo(0, 0);
    }

    getLocations(){
        this.spinnerService.show();
        this.locationService.GetLocation().subscribe((response) => {
            console.log(response);
            this.locations = response.data;
            this.spinnerService.hide();    
        });
    };
 
    getSecurityGuardsList() {
        var Data = {
            adminId: localStorage.getItem('adminId')
        };
        this.securityService.SecurityGuardsList(Data).subscribe((response) => {
            console.log(response);
            this.securityGuardsList = response.data;
            this.spinnerService.hide();
        });
    };

    showRoasterUser(value){
        var option, select;
        this.spinnerService.show();
        this.isShiftSelected = false;
        console.log(value);
        this.userId  = value;      
        console.log('user', this.userId)
        var data = {
            'userId':this.userId
       };
        this.shiftService.UserRelatedShifts(data).subscribe((response) => {
           console.log(response);
           this.ShiftsList = response.data;
           // this.userRoaster(this.select_date);


            

           if(response.data.length > 0){
            this.type1 = response.data[0]._id;
            // $("select").val(response.data[0]._id);
            // option = document.createElement("option");
            // option.value = response.data[0]._id;
            // select = document.getElementById("select");
            // select.appendChild(option);

            // console.log('opitionnnnnnnnnnnn', option.value);

             this.userRoaster1(response.data[0]);
           }
           if(response.data.length == 0){
            this.type1 = '';
            // $("select").val("");
            // option = document.createElement("option");
            // option.value = '';
            // select = document.getElementById("select");
            // select.appendChild(option);
            this.userRoaster1(response.data);
           }
           this.spinnerService.hide();
        }); 
    };


    showRoasterShift(value){
       console.log(value);
       this.shift  = value;
        var data = {
           'shiftId':value
       };
       this.shiftService.ShiftDetail(data).subscribe((response) => {
           console.log(response);
           // this.ShiftsList = response.data;
           this.userRoaster1(response.data);
           this.spinnerService.hide();
       }); 
    
   }

    showRoasterStartDate(value){
        console.log(value);      
        this.start_date = value; 
       	if(this.userId == undefined || this.userId == '' || value == ''){

       	}else{
       		console.log('date', this.userId, this.select_date);
       		var data = {
       			'userId':this.userId,
       			'select_date': this.select_date
       		};
       		this.shiftService.UserRoasterShifts(data).subscribe((response) => {
	            console.log(response);
	            this.ShiftsList = response.data;
	            // this.securityGuardsList = response.data;
	             this.userRoaster(this.select_date);
	            this.spinnerService.hide();
	        });
       	}
    };




    getMonday(d) {
      d = new Date(d);
      var day = d.getDay(),
          diff = d.getDate() - day + (day == 0 ? -6:1); // adjust when day is sunday
      return new Date(d.setDate(diff));
    };

    nextweek(aa){
        var today = aa;
        var nextweek1 = new Date(today.getFullYear(), today.getMonth(), today.getDate()+13);
        return nextweek1;
    }

    formatDate(date){
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

        var monthday = date.getMonth() + 1, monthvalue;
        if(monthday <= 9){
          monthvalue = '0' + monthday.toString();
        }else{
          monthvalue = monthday.toString();
        }
        console.log('monthvalue' + monthday)
        return (formatdate1 +   '-'  + monthvalue +  '-' + date.getFullYear());
    }



    userRoaster1(shift){
        this.isShiftSelected = true;
        this.selectedShift = shift;
        var rows = [], a;
        var divContainer;
        console.log('selctedshifttttttttt', shift);
        if(shift.length == 0){
            rows = [];
            this.isShiftSelected = false;
            divContainer = document.getElementById("showData");
            divContainer.innerHTML = "No Record Found";
            // divContainer.appendChild(table);
        }else{
            var aa = this.getMonday(new Date());
            var bb = this.nextweek(aa);

            var dynamicColumnsDaysName = [{
               title: "Location",
               dataKey: "loc"
               },
               {
                   title: "Monday",
                   dataKey: "mon"
               },
               {
                   title: "Tuesday",
                   dataKey: "tue"
               },
               {
                   title: "Wednesday",
                   dataKey: "wed"
               },
               {
                   title: "Thursday",
                   dataKey: "thu"
               },{
                   title: "Friday",
                   dataKey: "fri"
               },{
                   title: "Saturday",
                   dataKey: "sat"
               },
               {
                   title: "Sunday",
                   dataKey: "sun"
            }];
           
            a = {
               'loc': shift.location.address.location + '(' +  this.formatDate(aa) + '/' + this.formatDate(bb) + ')',
               'Mon': shift.days[0].start_time + '-' + shift.days[0].end_time,
               'Tue': shift.days[1].start_time + '-' + shift.days[1].end_time,
               'Wed': shift.days[2].start_time + '-' + shift.days[2].end_time,
               'Thu': shift.days[3].start_time + '-' + shift.days[3].end_time,
               'Fri': shift.days[4].start_time + '-' + shift.days[4].end_time,
               'Sat': shift.days[5].start_time + '-' + shift.days[5].end_time,
               'Sun': shift.days[6].start_time + '-' + shift.days[6].end_time,
            };
           
                   rows.push(a);
           
                   console.log('rows----------', rows)
                   var col = [], columns = dynamicColumnsDaysName;
                   for (var i = 0; i < dynamicColumnsDaysName.length; i++)
                   {
                       col.push(dynamicColumnsDaysName[i].title);
                   }
           
                   // CREATE DYNAMIC TABLE.
                   var table = document.createElement("table");
                   table.classList.add('table-heading');
                   // CREATE HTML TABLE HEADER ROW USING THE EXTRACTED HEADERS ABOVE.
           
                   var tr = table.insertRow(-1); // TABLE ROW.
           
                   for (var i = 0; i < col.length; i++)
                   {
                       var th = document.createElement("th"); // TABLE HEADER.
                       th.innerHTML = col[i];
                       tr.appendChild(th);
                   }
                   // title: days[selectedDate.getDay()] + '\n' + selectedDate.getDate() + '-' + (selectedDate.getMonth() + 1) + '-' + selectedDate.getFullYear(),
                   // dataKey: days[selectedDate.getDay()],
                   // date: (selectedDate.getMonth() + 1) + '-' + selectedDate.getDate() + '-' + selectedDate.getFullYear(),
                   // day: days[selectedDate.getDay()]
                   // ADD JSON DATA TO THE TABLE AS ROWS.
                   for (var i = 0; i < rows.length; i++)
                   {
           
                       tr = table.insertRow(-1);
           
                       for (var j = 0; j < col.length; j++)
                       {
                           var tabCell = tr.insertCell(-1);
                           if (columns[j].dataKey == 'loc')
                           {
                               tabCell.innerHTML = rows[i].loc;
                           }
                           else if (columns[j].dataKey == 'mon')
                           {
                               tabCell.innerHTML = '<span class="badge badge-primary" >'+  rows[i].Mon + '</span>';
                           }
                           else if (columns[j].dataKey == 'tue')
                           {
                               tabCell.innerHTML = '<span class="badge badge-primary" >'+  rows[i].Tue + '</span>';
                           }
                           else if (columns[j].dataKey == 'wed')
                           {
                               tabCell.innerHTML = '<span class="badge badge-primary" >'+  rows[i].Wed + '</span>';
                           }
                           else if (columns[j].dataKey == 'thu')
                           {
                               tabCell.innerHTML = '<span class="badge badge-primary">'+  rows[i].Thu + '</span>';
                           }
                           else if (columns[j].dataKey == 'fri')
                           {
                               tabCell.innerHTML = '<span class="badge badge-primary">'+  rows[i].Fri + '</span>';
                           }
                           else if (columns[j].dataKey == 'sat')
                           {
                               tabCell.innerHTML = '<span class="badge badge-primary">'+  rows[i].Sat + '</span>';
                           }
                           else if (columns[j].dataKey == 'sun')
                           {
                               tabCell.innerHTML = '<span class="badge badge-primary">'+  rows[i].Sun + '</span>';
                           }
                       }
                   }
           
                   // FINALLY ADD THE NEWLY CREATED TABLE WITH JSON DATA TO A CONTAINER.
                   divContainer = document.getElementById("showData");
                   divContainer.innerHTML = "";
                   divContainer.appendChild(table); }   
    }

    userRoaster(startDate){
    	 //user type report
            var rows = [],
                a, userProfile;
            var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
            ];

            var d = new Date(startDate);
            // var e = new Date(endDate);
            // var parseEndDate = Date.parse(endDate);
            var parseStartDate = Date.parse(startDate);
            var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            // var d = new Date(dateString);
            // var dayName = days[d.getDay()];

            userProfile = 'Roster by Users for Period ' + monthNames[d.getMonth()] + ' ' + d.getDate() + ' ' + d.getFullYear() + ' to 564646' /*monthNames[e.getMonth()] + ' ' + e.getDate() + ' ' + e.getFullYear()*/ ;

            var dynamicColumnsDaysName = [];

             dynamicColumnsDaysName.push(
            {
                title: "Location",
                dataKey: "loc"
            });

            var counter = 0;
            for (var i = 0; i < 7; i++)
            {
                //6 - 10
                if (parseStartDate)
                {
                    if (i == 0)
                    {
                        var selectedDate = new Date(startDate);
                        var dayName = days[selectedDate.getDay()];
                        dynamicColumnsDaysName.push(
                        {
                            title: days[selectedDate.getDay()] + '\n' + selectedDate.getDate() + '-' + (selectedDate.getMonth() + 1) + '-' + selectedDate.getFullYear(),
                            dataKey: days[selectedDate.getDay()],
                            date: (selectedDate.getMonth() + 1) + '-' + selectedDate.getDate() + '-' + selectedDate.getFullYear(),
                            day: days[selectedDate.getDay()]
                        });

                        //set next day date value
                        this.today = new Date(startDate);
                        this.tomorrow = new Date();
                        this.tomorrow.setDate(this.today.getDate() + i);
                        this.parseStartDate = Date.parse(this.tomorrow);
                    }
                    else
                    {
                        var today = new Date(startDate);
                        this.tomorrow = new Date();
                        this.tomorrow.setDate(this.today.getDate() + i);
                        var dayName = days[this.tomorrow.getDay()];
                        dynamicColumnsDaysName.push(
                        {
                            title: days[this.tomorrow.getDay()] + '\n' + this.tomorrow.getDate() + '-' + (this.tomorrow.getMonth() + 1) + '-' + this.tomorrow.getFullYear(),
                            dataKey: days[this.tomorrow.getDay()],
                            date: (this.tomorrow.getMonth() + 1) + '-' + this.tomorrow.getDate() + '-' + this.tomorrow.getFullYear(),
                            day: days[this.tomorrow.getDay()]
                        });

                        //set next day date value 
                        this.today = new Date(startDate);
                        this.tomorrow = new Date();
                        this.tomorrow.setDate(this.today.getDate() + i);
                        parseStartDate = Date.parse(this.tomorrow);
                    }
                }
            }

            var columns = dynamicColumnsDaysName;
            var allshifts = this.ShiftsList,
               AllLocaions = [];

            for (var i = 0; i < allshifts.length; i++)
            {
                if (AllLocaions.length == 0)
                {
                    AllLocaions.push(
                    {
                        'loc': allshifts[i].location.address.location,
                        'workload': []
                    });
                }
                else
                {
                    var index = this.getIndex(AllLocaions, allshifts[i].location.address.location);
                    if (index == -1)
                    {
                        AllLocaions.push(
                        {
                            'loc': allshifts[i].location.address.location,
                            'workload': []
                        });
                    }
                }
            }

            console.log('AllLocaions--------', AllLocaions)



            for (var i = 0; i < AllLocaions.length; i++)
            {
                var filteredArray = allshifts.filter(function (itm)
                {
                    return itm.location.address.location == AllLocaions[i].loc;
                });
                 console.log('filteredArray--------', filteredArray)
                // var shifts = allshifts.filter(checkLocation(AllLocaions[]));;
                AllLocaions[i].workload = filteredArray;
                console.log('AllUsers777--------', AllLocaions)
                var filteredWorkload = [];
                // var d = new Date(startDate);
                // var e = new Date(endDate);
                // var parseEndDate = Date.parse(d);
                // var parseStartDate = Date.parse(e);
                //all shifts entries for single location
                for (var k = 0; k < filteredArray.length; k++)
                {
                    //get all times and dates for single location shifts
                    if (filteredArray[k].type == '0')
                    {

                        this.fromDate = new Date(startDate);
                        this.formParseDate = Date.parse(this.fromDate);
                        this.shiftStartDate = new Date(filteredArray[k].shift_date);
                        var shiftStartDateParse = Date.parse(this.shiftStartDate);

                        if (shiftStartDateParse >= this.formParseDate)
                        {
                            if (filteredWorkload.length == 0)
                            {
                                var dates = [];
                                dates.push(
                                {
                                    'date': filteredArray[k].shift_date,
                                    'username': filteredArray[k].start_time + '-' + filteredArray[k].end_time
                                });
                                filteredWorkload.push(
                                {
                                    'start_time': filteredArray[k].start_time,
                                    'end_time': filteredArray[k].end_time,
                                    'dates': dates
                                });
                            }
                            else
                            {
                                var index = this.getTimeIndex(filteredWorkload, filteredArray[k].start_time, filteredArray[k].end_time);
                                if (index == -1)
                                {
                                    var dates = [];
                                    dates.push(
                                    {
                                        'date': filteredArray[k].shift_date,
                                        'username': filteredArray[k].start_time + '-' + filteredArray[k].end_time
                                    });
                                    filteredWorkload.push(
                                    {
                                        'start_time': filteredArray[k].start_time,
                                        'end_time': filteredArray[k].end_time,
                                        'dates': dates
                                    });
                                }
                                else
                                {
                                    for (var j = 0; j < filteredWorkload.length; j++)
                                    {
                                        if (filteredWorkload[j].start_time == filteredArray[k].start_time && filteredWorkload[j].end_time == filteredArray[k].end_time)
                                        {
                                            filteredWorkload[j].dates.push(
                                            {
                                                'date': filteredArray[k].shift_date,
                                                'username': filteredArray[k].start_time + '-' + filteredArray[k].end_time
                                            });
                                        }
                                    }
                                }
                            }
                        }
                    }
                    else
                    {
                        for (var n = 0; n < filteredArray[k].days.length; n++)
                        {
                            //parseStartDate <= parseEndDate)

                            this.shiftStartDate = new Date(filteredArray[k].start_date);
                            this.shiftEnd = new Date(filteredArray[k].end_date);
                            this.shiftEndDate = Date.parse(this.shiftEnd);
                            this.shiftStartDateParse = Date.parse(this.shiftStartDate);

                            //if(parseStartDate >= shiftStartDateParse){
                            if (n == 0)
                            {
                                this.workloadDate = new Date(startDate);
                                this.workloadEndDate = Date.parse(this.workloadDate);

                                var dayName = days[this.workloadDate.getDay()];
                                var dayArray = this.returnDateAndTime(dayName, filteredArray[k].days);

                                if (dayArray.start_time != ''  && this.workloadEndDate <= this.shiftEndDate)
                                {
                                    if (filteredWorkload.length == 0)
                                    {
                                        var currentWorkoutDate = this.workloadDate.getFullYear() + '-' + (this.workloadDate.getMonth() + 1) + '-' + this.workloadDate.getDate();
                                        var p = Date.parse(currentWorkoutDate);

                                        if (p >= this.shiftStartDateParse)
                                        {
                                            var dates = [];
                                            dates.push(
                                            {
                                                'date': (this.workloadDate.getMonth() + 1) + '-' + this.workloadDate.getDate() + '-' + this.workloadDate.getFullYear(),
                                                'username': dayArray.start_time + '-' + dayArray.end_time
                                            });
                                            filteredWorkload.push(
                                            {
                                                'start_time': dayArray.start_time,
                                                'end_time': dayArray.end_time,
                                                'dates': dates
                                            });
                                        }

                                        console.log('filteredWorkload empty', filteredWorkload);
                                        console.log('dates', dates);
                                    }
                                    else
                                    {
                                        this.workloadDate = new Date(parseStartDate);
                                        var workloadDate1 = Date.parse(this.workloadDate);
                                        //var selectedDate = new Date(startDate);
                                        var dayName = days[this.workloadDate.getDay()];
                                        var dayArray = this.returnDateAndTime(dayName, filteredArray[k].days);

                                        var index = this.getTimeIndex(filteredWorkload, dayArray.start_time, dayArray.end_time);

                                        if (index == -1)
                                        {
                                            var dates = [];
                                            var currentWorkoutDate = this.workloadDate.getFullYear() + '-' + (this.workloadDate.getMonth() + 1) + '-' + this.workloadDate.getDate();
                                            var p = Date.parse(currentWorkoutDate);
                                            if (p >= this.shiftStartDateParse)
                                            {
                                                dates.push(
                                                {
                                                    'date': this.workloadDate.getFullYear() + '-' + (this.workloadDate.getMonth() + 1) + '-' + this.workloadDate.getDate(),
                                                    'username': dayArray.start_time + '-' + dayArray.end_time
                                                });
                                                filteredWorkload.push(
                                                {
                                                    'start_time': dayArray.start_time,
                                                    'end_time': dayArray.end_time,
                                                    'dates': dates
                                                });
                                            }
                                            console.log('filteredWorkload', filteredWorkload);
                                        	console.log('dates', dates);
                                        }
                                        else
                                        {
                                            for (var j = 0; j < filteredWorkload.length; j++)
                                            {
                                                if (filteredWorkload[j].start_time == dayArray.start_time && filteredWorkload[j].end_time == dayArray.end_time)
                                                {
                                                    var currentWorkoutDate = this.workloadDate.getFullYear() + '-' + (this.workloadDate.getMonth() + 1) + '-' + this.workloadDate.getDate();
                                                    var p = Date.parse(currentWorkoutDate);
                                                    if (p >= this.shiftStartDateParse)
                                                    {
                                                        filteredWorkload[j].dates.push(
                                                        {
                                                            'date': this.workloadDate.getFullYear() + '-' + (this.workloadDate.getMonth() + 1) + '-' + this.workloadDate.getDate(),
                                                            'username': dayArray.start_time + '-' + dayArray.end_time
                                                        });
                                                    }
                                                }
                                            }


                                            console.log('filteredWorkload', filteredWorkload);
                                        	console.log('dates', dates);
                                        }
                                    }

                                }

                            }
                            else
                            {
                                this.today = new Date(startDate);
                                this.parseDate = Date.parse(this.today);
                                this.tomorrow = new Date();
                                this.tomorrow = new Date(this.tomorrow.setHours(0, 0, 0, 0));
                                this.tomorrow.setDate(today.getDate() + n);
                                parseStartDate = Date.parse(this.tomorrow);

                                this.shiftEndDate = new Date(filteredArray[k].end_date);
                                this.shiftEndDateParse = Date.parse(this.shiftEndDate);

                                var dayName = days[this.tomorrow.getDay()];
                                var dayArray = this.returnDateAndTime(dayName, filteredArray[k].days);

                                if (dayArray.start_time != ''  && parseStartDate <= this.shiftEndDateParse)
                                {
                                    var index = this.getTimeIndex(filteredWorkload, dayArray.start_time, dayArray.end_time);

                                    if (index == -1)
                                    {
                                        var dates = [];

                                        var currentWorkoutDate = this.tomorrow.getFullYear() + '-' + (this.tomorrow.getMonth() + 1) + '-' + this.tomorrow.getDate();
                                        var p = Date.parse(currentWorkoutDate);
                                        if (p >= this.shiftStartDateParse)
                                        {
                                            dates.push(
                                            {
                                                'date': this.tomorrow.getFullYear() + '-' + (this.tomorrow.getMonth() + 1) + '-' + this.tomorrow.getDate(),
                                                'username': dayArray.start_time + '-' + dayArray.end_time
                                            });
                                            filteredWorkload.push(
                                            {
                                                'start_time': dayArray.start_time,
                                                'end_time': dayArray.end_time,
                                                'dates': dates
                                            });
                                        }

                                    }
                                    else
                                    {
                                        for (var j = 0; j < filteredWorkload.length; j++)
                                        {
                                            if (filteredWorkload[j].start_time == dayArray.start_time && filteredWorkload[j].end_time == dayArray.end_time)
                                            {
                                                var currentWorkoutDate = this.tomorrow.getFullYear() + '-' + (this.tomorrow.getMonth() + 1) + '-' + this.tomorrow.getDate();
                                                var p = Date.parse(currentWorkoutDate);
                                                if (p >= this.shiftStartDateParse)
                                                {
                                                    filteredWorkload[j].dates.push(
                                                    {
                                                        'date': this.tomorrow.getFullYear() + '-' + (this.tomorrow.getMonth() + 1) + '-' + this.tomorrow.getDate(),
                                                        'username': dayArray.start_time + '-' + dayArray.end_time
                                                    });
                                                }
                                            }
                                        }
                                    }
                                }

                            }
                        }
                        //}
                    }
                }
                console.log('filteredWorkload',filteredWorkload)
                var d1 = '',
                        d2 = '',
                        d3 = '',
                        d4 = '',
                        d5 = '',
                        d6 = '',
                        d7 = '';
                d1 = '', d2 = '', d3 = '', d4 = '', d5 = '', d6 = '', d7 = '';
                for (var l = 0; l < filteredWorkload.length; l++)
                {
                    //get day entry
                    for (var m = 0; m < filteredWorkload[l].dates.length; m++)
                    {
                        this.workloadDate = new Date(filteredWorkload[l].dates[m].date);
                        //var selectedDate = new Date(startDate);
                        var dayName = days[this.workloadDate.getDay()];

                        if (dayName == 'Mon')
                        {
                            d1 = d1 == '' ? filteredWorkload[l].dates[m].username : d1 + '\n' + filteredWorkload[l].dates[m].username;
                        }
                        else if (dayName == 'Tue')
                        {
                            d2 = d2 == '' ? filteredWorkload[l].dates[m].username : d2 + '\n' + filteredWorkload[l].dates[m].username
                        }
                        else if (dayName == 'Wed')
                        {
                            d3 = d3 == '' ? filteredWorkload[l].dates[m].username : d3 + '\n' + filteredWorkload[l].dates[m].username
                        }
                        else if (dayName == 'Thu')
                        {
                            d4 = d4 == '' ? filteredWorkload[l].dates[m].username : d4 + '\n' + filteredWorkload[l].dates[m].username
                        }
                        else if (dayName == 'Fri')
                        {
                            d5 = d5 == '' ? filteredWorkload[l].dates[m].username : d5 + '\n' + filteredWorkload[l].dates[m].username
                        }
                        else if (dayName == 'Sat')
                        {
                            d6 = d6 == '' ? filteredWorkload[l].dates[m].username : d6 + '\n' + filteredWorkload[l].dates[m].username
                        }
                        else if (dayName == 'Sun')
                        {
                            d7 = d7 == '' ? filteredWorkload[l].dates[m].username : d7 + '\n' + filteredWorkload[l].dates[m].username
                        }
                    }

                    // var workloadName = AllUsers[i].user,
                    //     workloadTime = filteredWorkload[l].start_time + '-' + filteredWorkload[l].end_time;
                    // var workloadTime1 = '(' + filteredWorkload[l].start_time + ' - ' + filteredWorkload[l].end_time + ')';
                }
                if (d1 == '' && d2 == '' && d3 == '' && d4 == '' && d5 == '' && d6 == '' && d7 == '')
                {

                }
                else
                {
                    a = {
                        'user': AllLocaions[i].loc,
                        'Mon': d1,
                        'Tue': d2,
                        'Wed': d3,
                        'Thu': d4,
                        'Fri': d5,
                        'Sat': d6,
                        'Sun': d7,
                    }
                    rows.push(a);
                }
            }


            console.log('rowssssssss', rows)

            this.rows = rows;
            // EXTRACT VALUE FOR HTML HEADER. 
            // ('Book ID', 'Book Name', 'Category' and 'Price')
            var col = [];
            for (var i = 0; i < columns.length; i++)
            {
                col.push(columns[i].title);
            }

            // CREATE DYNAMIC TABLE.
            var table = document.createElement("table");
            table.classList.add('table-heading');
            // CREATE HTML TABLE HEADER ROW USING THE EXTRACTED HEADERS ABOVE.

            var tr = table.insertRow(-1); // TABLE ROW.

            for (var i = 0; i < col.length; i++)
            {
                var th = document.createElement("th"); // TABLE HEADER.
                th.innerHTML = col[i];
                tr.appendChild(th);
            }
            // title: days[selectedDate.getDay()] + '\n' + selectedDate.getDate() + '-' + (selectedDate.getMonth() + 1) + '-' + selectedDate.getFullYear(),
            // dataKey: days[selectedDate.getDay()],
            // date: (selectedDate.getMonth() + 1) + '-' + selectedDate.getDate() + '-' + selectedDate.getFullYear(),
            // day: days[selectedDate.getDay()]
            // ADD JSON DATA TO THE TABLE AS ROWS.
            for (var i = 0; i < rows.length; i++)
            {

                tr = table.insertRow(-1);

                for (var j = 0; j < col.length; j++)
                {
                    var tabCell = tr.insertCell(-1);
                    if (columns[j].dataKey == 'loc')
                    {
                        tabCell.innerHTML = rows[i].user;
                    }
                    else if (columns[j].dataKey == 'Sdate')
                    {
                        tabCell.innerHTML = '<span class="badge badge-primary" >' +rows[i].Sdate+ '</span>';
                    }
                    else if (columns[j].dataKey == 'Mon')
                    {
                        tabCell.innerHTML = '<span class="badge badge-primary" >'+  rows[i].Mon + '</span>';
                    }
                    else if (columns[j].dataKey == 'Tue')
                    {
                        tabCell.innerHTML = '<span class="badge badge-primary" >'+  rows[i].Tue + '</span>';
                    }
                    else if (columns[j].dataKey == 'Wed')
                    {
                        tabCell.innerHTML = '<span class="badge badge-primary" >'+  rows[i].Wed + '</span>';
                    }
                    else if (columns[j].dataKey == 'Thu')
                    {
                        tabCell.innerHTML = '<span class="badge badge-primary">'+  rows[i].Thu + '</span>';
                    }
                    else if (columns[j].dataKey == 'Fri')
                    {
                        tabCell.innerHTML = '<span class="badge badge-primary">'+  rows[i].Fri + '</span>';
                    }
                    else if (columns[j].dataKey == 'Sat')
                    {
                        tabCell.innerHTML = '<span class="badge badge-primary">'+  rows[i].Sat + '</span>';
                    }
                    else if (columns[j].dataKey == 'Sun')
                    {
                        tabCell.innerHTML = '<span class="badge badge-primary">'+  rows[i].Sun + '</span>';
                    }
                }
            }

            // FINALLY ADD THE NEWLY CREATED TABLE WITH JSON DATA TO A CONTAINER.
            var divContainer = document.getElementById("showData");
            divContainer.innerHTML = "";
            divContainer.appendChild(table);
    };


    getUserIndex(array, name)
    {
        var isValueExist = -1;
        for (var j = 0; j < array.length; j++)
        {
            if (array[j].user == name)
            {
                isValueExist = 1;
            }
        }

        return isValueExist;
    };

    getTimeIndex(filteredWorkload, start_time, end_time)
    {
        var isValueExist = -1;
        for (var j = 0; j < filteredWorkload.length; j++)
        {
            if (filteredWorkload[j].start_time == start_time && filteredWorkload[j].end_time == end_time)
            {
                isValueExist = 1;
            }
        }

        return isValueExist;
    };

    getIndex(array, location)
    {
        if (array.map(x => x.loc).indexOf(location) == -1)
        {
            return -1;
        }
        else
        {
            return 1;
        }
    };


    returnDateAndTime(date, days)
    {
        if (date == 'Mon')
        {
            return days[0];
        }
        else if (date == 'Tue')
        {
            return days[1];
        }
        else if (date == 'Wed')
        {
            return days[2];
        }
        else if (date == 'Thu')
        {
            return days[3];
        }
        else if (date == 'Fri')
        {
            return days[4];
        }
        else if (date == 'Sat')
        {
            return days[5];
        }
        else
        {
            return days[6];
        }
    };



 downloadUserRoaster(){
    var shift = this.selectedShift;
    var userProfile = 'Roster report (' + this.selectedShift.userInfo.firstname + ')', rows = [];
    var aa = this.getMonday(new Date());
    var bb = this.nextweek(aa);
	var dynamicColumnsDaysName = [{
        title: "Location",
        dataKey: "loc"
    },
    {
        title: "Monday",
        dataKey: "mon"
    },
    {
        title: "Tuesday",
        dataKey: "tue"
    },
    {
        title: "Wednesday",
        dataKey: "wed"
    },
    {
        title: "Thursday",
        dataKey: "thu"
    },{
        title: "Friday",
        dataKey: "fri"
    },{
        title: "Saturday",
        dataKey: "sat"
    },
    {
        title: "Sunday",
        dataKey: "sun"
    }];

        var a = {
            'loc': shift.location.address.location + '(' +  this.formatDate(aa) + '/' + this.formatDate(bb) + ')',
            'mon': shift.days[0].start_time + '-' + shift.days[0].end_time,
            'tue': shift.days[1].start_time + '-' + shift.days[1].end_time,
            'wed': shift.days[2].start_time + '-' + shift.days[2].end_time,
            'thu': shift.days[3].start_time + '-' + shift.days[3].end_time,
            'fri': shift.days[4].start_time + '-' + shift.days[4].end_time,
            'sat': shift.days[5].start_time + '-' + shift.days[5].end_time,
            'sun': shift.days[6].start_time + '-' + shift.days[6].end_time,
        }

        rows.push(a);
    

        this.rows = rows;
       // save the user roaster document in pdf

        var doc = new jsPDF('l', 'pt');
        var totalPagesExp = doc.internal.getNumberOfPages();
        doc.page = 1;
        console.log(doc);
        var pageContent = function (data)
        {
            console.log(data);
            // HEADER
            doc.setFontSize(16);
            doc.setTextColor(40);
            doc.setFontStyle('Bold');

            doc.text(userProfile, data.settings.margin.left + 15, 52);

            // FOOTER
            var str = "Page " + doc.page;
            doc.setFontSize(10);
            // doc.text(150,285, 'page ' + data.pageCount);
            // doc.text('page ' + doc.page);

            // var str = 'page ' + doc.page;
            doc.text(data.settings.margin.left, doc.internal.pageSize.getHeight - 10, str);
            // doc.text( 'page ' + doc.page, 150,285);

        };
        doc.setTextColor(6, 6, 6);
        doc.autoTable(dynamicColumnsDaysName, rows,
        {
            theme: 'grid',
            bodyStyles:
            {
                lineWidth: 1,
                lineColor: [0, 0, 0]
            },
            headerStyles:
            {
                lineWidth: 1,
                lineColor: [0, 0, 0],
                fillColor: [191, 191, 191]
            },
            createdCell: function (columns, rows)
            {
                if (columns.text[0] != '')
                {
                    columns.styles.fillColor = "#fff";
                }
            },
            // styles: {fillColor: [0,0,0, .5],
            // whiteBreak:'breakAll',
            // columnWidth: 'auto' }, 
            // columnStyles: { loc: { columnWidth: 'auto' ,wordBreak:'breakAll', width:20 }},
            styles:
            {
                fillColor: [224, 224, 224],
                overflow: 'linebreak'
            },
            columnStyles:
            {
                'loc':
                {
                    rowHeight: 30,
                    columnWidth: 200
                }
            },
            margin:
            {
                top: 60
            },
            startY: false, // false (indicates margin top value) or a number
            pageBreak: 'auto', // 'auto', 'avoid' or 'always'
            tableWidth: 'auto', // 'auto', 'wrap' or a number, 
            showHeader: 'everyPage', // 'everyPage', 'firstPage', 'never',
            tableLineColor: 200, // number, array (see color section below)
            tableLineWidth: 0,
            addPageContent: pageContent
        });
        // this.pdfSrc = doc.save('workload.pdf');
        doc.save('roaster.pdf');
    };

   
  


}
