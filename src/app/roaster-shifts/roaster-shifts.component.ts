import
{
    Component,
    OnInit
}
from '@angular/core';
import
{
    ShiftService
}
from '../services/shiftService';
import
{
    Ng4LoadingSpinnerService
}
from 'ng4-loading-spinner';
import * as jspdf from 'jspdf';
import { LocationService } from '../services/locationService';

import html2canvas from 'html2canvas';
import { SecurityService } from '../services/securityService';
declare var jsPDF: any;
@Component(
{
    selector: 'app-roaster-shifts',
    templateUrl: './roaster-shifts.component.html',
    styleUrls: ['./roaster-shifts.component.css']
})
export class RoasterShiftsComponent implements OnInit
{

    ShiftsList: any;
    rows: any;
    temp: any;
    parseStartDate: any;
    formParseDate: any;
    shiftStartDate: any;
    tomorrow: any;
    fromDate: any;
    shiftEnd: any;
    shiftStartDateParse: any;
    workloadDate: any;
    workloadEndDate: any;
    shiftEndDateParse: any;
    today: any;
    parseDate: any;
    shiftEndDate: any;
    maxdate: any;
    titles: any;
    pdfSrc: any;
    securityGuardsList: any;
    locations: any;
    mindate: any;
    selectedValue: any;
    changeValue: any;
    startDate:any;
    type: any;
    title: any;
    title1: any;
    constructor(public shiftService: ShiftService,private locationService: LocationService, public spinnerService: Ng4LoadingSpinnerService,public securityService: SecurityService)
    {
        this.getSecurityGuardsList();
        this.getLocations();
        this.ShiftsList = [];
        
        var date = new Date();
        var formatdate = date.getDate(), formatdate1;
        var formatmonth = date.getMonth(), formatmonth1;
        if(formatdate <= 9){
            formatdate1 = '0' + formatdate.toString();
        }else{
            formatdate1 = formatdate.toString();
        }

        if(formatmonth <= 9){
            formatmonth = formatmonth + 1;
            formatmonth1 = '0' + formatmonth.toString();
        }else{
            formatmonth1 = formatmonth.toString();
        }

        console.log('date.getDate()', formatdate)
        this.mindate = date.getFullYear()+'-' + formatmonth1 + '-'+ formatdate1;
        console.log('mindateeeeeeeeee', this.mindate);
        this.startDate = this.mindate;
        this.type = 'workload';
        this.changeValue = '';
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
            this.getReport(this.startDate, this.startDate, 'workload');
        });
    };

    showRoaster(select_date, user){
        console.log(select_date, user);
        
    };

    onchange(type){
       this.selectedValue = type;
       console.log('changevalue', this.changeValue)
    }





    getReport(startDate, endDate, type)
    {
        if(type == 'workload'){
            this.changeValue = 'workload';
        }else if(type == 'user'){
            this.changeValue = 'user';
        }else{
            this.changeValue = 'split';
        };

        var daysTime = [],
            time = [],
            dict1;
        this.spinnerService.show();
        var Data = {
            start_date: Date.parse(startDate),
            adminId: localStorage.getItem('adminId'),
            end_date: Date.parse(endDate),
            type: '1'
        };
        this.shiftService.RoasterShifts(Data).subscribe((response) =>
        {
            console.log(response);
            this.ShiftsList = response.data;
            this.spinnerService.hide();
            this.search(startDate, endDate, type);
        });
    };


    search(startDate, endDate, type)
    {
        if (type == 'workload')
        {
            var rows = [],
                a, userProfile;
            var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
            ];

            var d = new Date(startDate);
            // var e = new Date(endDate);
            var e = new Date();
           e.setDate(d.getDate() + 6);
            var parseEndDate = Date.parse(endDate);
            this.parseStartDate = Date.parse(startDate);
            var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            // var d = new Date(dateString);
            // var dayName = days[d.getDay()];

           
            var plusSeven = new Date(d.setDate(d.getDate() + 6));

            userProfile = 'Roster by Workload for Period ' + monthNames[d.getMonth()] + ' ' + d.getDate() + ' ' + d.getFullYear() + ' to ' + monthNames[plusSeven.getMonth()] + ' ' + plusSeven.getDate() + ' ' + plusSeven.getFullYear();

            var dynamicColumnsDaysName = [];

            dynamicColumnsDaysName.push(
            {
                title: "Location",
                dataKey: "loc"
            });
            dynamicColumnsDaysName.push(
            {
                title: "Workload",
                dataKey: "Sdate"
            });



            var counter = 0;
            for (var i = 0; i < 7; i++)
            {
                //6 - 10
                if (this.parseStartDate /*<= parseEndDate*/)
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
                        var today = new Date(startDate);
                        this.tomorrow = new Date();
                        this.tomorrow.setDate(today.getDate() + i);
                        this.parseStartDate = Date.parse(this.tomorrow);
                    }
                    else
                    {
                        var today = new Date(startDate);
                        this.tomorrow = new Date();
                        this.tomorrow.setDate(today.getDate() + i);
                        var dayName = days[this.tomorrow.getDay()];
                        dynamicColumnsDaysName.push(
                        {
                            title: days[this.tomorrow.getDay()] + '\n' + this.tomorrow.getDate() + '-' + (this.tomorrow.getMonth() + 1) + '-' + this.tomorrow.getFullYear(),
                            dataKey: days[this.tomorrow.getDay()],
                            date: (this.tomorrow.getMonth() + 1) + '-' + this.tomorrow.getDate() + '-' + this.tomorrow.getFullYear(),
                            day: days[this.tomorrow.getDay()]
                        });

                        //set next day date value 
                        var today = new Date(startDate);
                        this.tomorrow = new Date();
                        this.tomorrow.setDate(today.getDate() + i);
                        this.parseStartDate = Date.parse(this.tomorrow);
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

            //if(value == 'upcoming'){
            for (var i = 0; i < AllLocaions.length; i++)
            {
                var filteredArray = allshifts.filter(function (itm)
                {
                    return itm.location.address.location == AllLocaions[i].loc;
                });
                // var shifts = allshifts.filter(checkLocation(AllLocaions[]));;
                AllLocaions[i].workload = filteredArray;
                var filteredWorkload = [];


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
                                    'username': filteredArray[k].userInfo.firstname
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
                                        'username': filteredArray[k].userInfo.firstname
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
                                                'username': filteredArray[k].userInfo.firstname
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

                                if (dayArray.start_time != '' /*&& this.workloadEndDate <= parseEndDate*/ && this.workloadEndDate <= this.shiftEndDate)
                                {
                                    if (filteredWorkload.length == 0)
                                    {
                                        var currentWorkoutDate = this.workloadDate.getFullYear() + '-' + (this.workloadDate.getMonth() + 1) + '-' + this.workloadDate.getDate();
                                         currentWorkoutDate = this.formattedDate(currentWorkoutDate);
                                        var p = Date.parse(currentWorkoutDate);
                                        console.log("manmohit P = " + p);
                                        console.log("manmohit PAR = " + p);
                                        if (p >= this.shiftStartDateParse)
                                        {
                                            var dates = [];
                                            dates.push(
                                            {
                                                'date': (this.workloadDate.getMonth() + 1) + '-' + this.workloadDate.getDate() + '-' + this.workloadDate.getFullYear(),
                                                'username': filteredArray[k].userInfo.firstname
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
                                        this.workloadDate = new Date(this.parseStartDate);
                                        var workloadDate1 = Date.parse(this.workloadDate);
                                        //var selectedDate = new Date(startDate);
                                        var dayName = days[this.workloadDate.getDay()];
                                        var dayArray = this.returnDateAndTime(dayName, filteredArray[k].days);

                                        var index = this.getTimeIndex(filteredWorkload, dayArray.start_time, dayArray.end_time);

                                        if (index == -1)
                                        {
                                            var dates = [];
                                            var currentWorkoutDate = this.workloadDate.getFullYear() + '-' + (this.workloadDate.getMonth() + 1) + '-' + this.workloadDate.getDate();
                                             currentWorkoutDate = this.formattedDate(currentWorkoutDate);
                                            var p = Date.parse(currentWorkoutDate);
                                            if (p >= this.shiftStartDateParse)
                                            {
                                                dates.push(
                                                {
                                                    'date': this.workloadDate.getFullYear() + '-' + (this.workloadDate.getMonth() + 1) + '-' + this.workloadDate.getDate(),
                                                    'username': filteredArray[k].userInfo.firstname
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
                                                    var currentWorkoutDate = this.workloadDate.getFullYear() + '-' + (this.workloadDate.getMonth() + 1) + '-' + this.workloadDate.getDate();
                                                     currentWorkoutDate = this.formattedDate(currentWorkoutDate);
                                                    var p = Date.parse(currentWorkoutDate);
                                                    if (p >= this.shiftStartDateParse)
                                                    {
                                                        filteredWorkload[j].dates.push(
                                                        {
                                                            'date': this.workloadDate.getFullYear() + '-' + (this.workloadDate.getMonth() + 1) + '-' + this.workloadDate.getDate(),
                                                            'username': filteredArray[k].userInfo.firstname
                                                        });
                                                    }
                                                }
                                            }
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
                                this.tomorrow.setDate(this.today.getDate() + n);
                                this.parseStartDate = Date.parse(this.tomorrow);

                                this.shiftEndDate = new Date(filteredArray[k].end_date);
                                this.shiftEndDateParse = Date.parse(this.shiftEndDate);

                                var dayName = days[this.tomorrow.getDay()];
                                var dayArray = this.returnDateAndTime(dayName, filteredArray[k].days);

                                if (dayArray.start_time != ''/* && this.parseStartDate <= parseEndDate*/ && this.parseStartDate <= this.shiftEndDateParse)
                                {
                                    var index = this.getTimeIndex(filteredWorkload, dayArray.start_time, dayArray.end_time);

                                    if (index == -1)
                                    {
                                        var dates = [];

                                        var currentWorkoutDate = this.tomorrow.getFullYear() + '-' + (this.tomorrow.getMonth() + 1) + '-' + this.tomorrow.getDate();
                                         currentWorkoutDate = this.formattedDate(currentWorkoutDate);
                                        var p = Date.parse(currentWorkoutDate);
                                        if (p >= this.shiftStartDateParse)
                                        {
                                            dates.push(
                                            {
                                                'date': this.tomorrow.getFullYear() + '-' + (this.tomorrow.getMonth() + 1) + '-' + this.tomorrow.getDate(),
                                                'username': filteredArray[k].userInfo.firstname
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
                                                currentWorkoutDate = this.formattedDate(currentWorkoutDate);
                                                var p = Date.parse(currentWorkoutDate);
                                                if (p >= this.shiftStartDateParse)
                                                {
                                                    filteredWorkload[j].dates.push(
                                                    {
                                                        'date': this.tomorrow.getFullYear() + '-' + (this.tomorrow.getMonth() + 1) + '-' + this.tomorrow.getDate(),
                                                        'username': filteredArray[k].userInfo.firstname
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
                console.log(filteredWorkload)

                for (var l = 0; l < filteredWorkload.length; l++)
                {
                    //get day entry
                    var d1 = '',
                        d2 = '',
                        d3 = '',
                        d4 = '',
                        d5 = '',
                        d6 = '',
                        d7 = '';
                    for (var m = 0; m < filteredWorkload[l].dates.length; m++)
                    {
                        this.workloadDate = new Date(filteredWorkload[l].dates[m].date);
                        //var selectedDate = new Date(startDate);
                        var dayName = days[this.workloadDate.getDay()];

                        if (dayName == 'Mon')
                        {
                            d1 = filteredWorkload[l].dates[m].username;
                        }
                        else if (dayName == 'Tue')
                        {
                            d2 = filteredWorkload[l].dates[m].username
                        }
                        else if (dayName == 'Wed')
                        {
                            d3 = filteredWorkload[l].dates[m].username
                        }
                        else if (dayName == 'Thu')
                        {
                            d4 = filteredWorkload[l].dates[m].username
                        }
                        else if (dayName == 'Fri')
                        {
                            d5 = filteredWorkload[l].dates[m].username
                        }
                        else if (dayName == 'Sat')
                        {
                            d6 = filteredWorkload[l].dates[m].username
                        }
                        else if (dayName == 'Sun')
                        {
                            d7 = filteredWorkload[l].dates[m].username
                        }
                    }

                    if (d1 != '' || d2 != '' || d3 != '' || d4 != '' || d5 != '' || d6 != '' || d7 != '')
                    {
                        var workloadName = AllLocaions[i].loc,
                            workloadTime = filteredWorkload[l].start_time + '-' + filteredWorkload[l].end_time;
                        var workloadTime1 = '(' + filteredWorkload[l].start_time + ' - ' + filteredWorkload[l].end_time + ')';
                        a = {
                            'loc': AllLocaions[i].loc,
                            'Sdate': workloadName + workloadTime + workloadTime1,
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

            }
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
                console.log(rows[i])
                tr = table.insertRow(-1);

                for (var j = 0; j < col.length; j++)
                {
                    var tabCell = tr.insertCell(-1);

                    if (columns[j].dataKey == 'loc')
                    {
                        tabCell.innerHTML = rows[i].loc;
                    }
                    else if (columns[j].dataKey == 'Sdate')
                    {
                        tabCell.innerHTML = rows[i].Sdate;
                    }
                    else if (columns[j].dataKey == 'Mon')
                    {
                        tabCell.innerHTML = rows[i].Mon;
                    }
                    else if (columns[j].dataKey == 'Tue')
                    {
                        tabCell.innerHTML = rows[i].Tue;
                    }
                    else if (columns[j].dataKey == 'Wed')
                    {
                        tabCell.innerHTML = rows[i].Wed;
                    }
                    else if (columns[j].dataKey == 'Thu')
                    {
                        tabCell.innerHTML = rows[i].Thu;
                    }
                    else if (columns[j].dataKey == 'Fri')
                    {
                        tabCell.innerHTML = rows[i].Fri;
                    }
                    else if (columns[j].dataKey == 'Sat')
                    {
                        tabCell.innerHTML = rows[i].Sat;
                    }
                    else if (columns[j].dataKey == 'Sun')
                    {
                        tabCell.innerHTML = rows[i].Sun;
                    }
                    else if (columns[j].dataKey == 'loc')
                    {
                        tabCell.innerHTML = rows[i].loc;
                    }
                }
            }

            // FINALLY ADD THE NEWLY CREATED TABLE WITH JSON DATA TO A CONTAINER.
            var divContainer = document.getElementById("showData");
            divContainer.innerHTML = "";
            divContainer.appendChild(table);

        }
        else if (type == 'user')
        {
            //user type report
            var rows = [],
                a, userProfile;
            var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
            ];

            var d = new Date(startDate);
            // var e = new Date(endDate);
            var e = new Date();
           e.setDate(d.getDate() + 6);
            var parseEndDate = Date.parse(endDate);
            var parseStartDate = Date.parse(startDate);
            var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            // var d = new Date(dateString);
            // var dayName = days[d.getDay()];

            userProfile = 'Roster by Users for Period ' + monthNames[d.getMonth()] + ' ' + d.getDate() + ' ' + d.getFullYear() + ' to ' + monthNames[e.getMonth()] + ' ' + e.getDate() + ' ' + e.getFullYear() + ' (Week 1)';

            var dynamicColumnsDaysName = [];

            dynamicColumnsDaysName.push(
            {
                title: "Guard",
                dataKey: "user"
            });

            var counter = 0;
            for (var i = 0; i < 7; i++)
            {
                //6 - 10
                if (parseStartDate/* <= parseEndDate*/)
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
                AllUsers = [];

            for (var i = 0; i < allshifts.length; i++)
            {
                if (AllUsers.length == 0)
                {
                    AllUsers.push(
                    {
                        'user': allshifts[i].userInfo.firstname,
                        'workload': []
                    });
                }
                else
                {
                    var index = this.getUserIndex(AllUsers, allshifts[i].userInfo.firstname);
                    if (index == -1)
                    {
                        AllUsers.push(
                        {
                            'user': allshifts[i].userInfo.firstname,
                            'workload': []
                        });
                    }
                }
            }

            console.log('AllUsers--------', AllUsers)



            for (var i = 0; i < AllUsers.length; i++)
            {
                var filteredArray = allshifts.filter(function (itm)
                {
                    return itm.userInfo.firstname == AllUsers[i].user;
                });
                 console.log('filteredArray--------', filteredArray)
                // var shifts = allshifts.filter(checkLocation(AllLocaions[]));;
                AllUsers[i].workload = filteredArray;
                console.log('AllUsers777--------', AllUsers)
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

                                if (dayArray.start_time != '' /*&& this.workloadEndDate <= parseEndDate*/ && this.workloadEndDate <= this.shiftEndDate)
                                {
                                    if (filteredWorkload.length == 0)
                                    {
                                        var currentWorkoutDate = this.workloadDate.getFullYear() + '-' + (this.workloadDate.getMonth() + 1) + '-' + this.workloadDate.getDate();
                                         currentWorkoutDate = this.formattedDate(currentWorkoutDate);
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
                                             currentWorkoutDate = this.formattedDate(currentWorkoutDate);
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
                                        }
                                        else
                                        {
                                            for (var j = 0; j < filteredWorkload.length; j++)
                                            {
                                                if (filteredWorkload[j].start_time == dayArray.start_time && filteredWorkload[j].end_time == dayArray.end_time)
                                                {
                                                    var currentWorkoutDate = this.workloadDate.getFullYear() + '-' + (this.workloadDate.getMonth() + 1) + '-' + this.workloadDate.getDate();
                                                     currentWorkoutDate = this.formattedDate(currentWorkoutDate);
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

                                if (dayArray.start_time != '' /*&& parseStartDate <= parseEndDate*/ && parseStartDate <= this.shiftEndDateParse)
                                {
                                    var index = this.getTimeIndex(filteredWorkload, dayArray.start_time, dayArray.end_time);

                                    if (index == -1)
                                    {
                                        var dates = [];

                                        var currentWorkoutDate = this.tomorrow.getFullYear() + '-' + (this.tomorrow.getMonth() + 1) + '-' + this.tomorrow.getDate();
                                         currentWorkoutDate = this.formattedDate(currentWorkoutDate);
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
                                                 currentWorkoutDate = this.formattedDate(currentWorkoutDate);
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
                console.log(filteredWorkload)
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
                        'user': AllUsers[i].user,
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
                    if (columns[j].dataKey == 'user')
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
        }
        else
        {


            var rows = [],
                a, userProfile;
            var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
            ];

            var d = new Date(startDate);
            // var e = new Date(endDate);
            var e = new Date();
            e.setDate(d.getDate() + 6);
            var parseEndDate = Date.parse(endDate);
            this.parseStartDate = Date.parse(startDate);
            var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            // var d = new Date(dateString);
            // var dayName = days[d.getDay()];

            userProfile = 'Roster by Workload for Period ' + monthNames[d.getMonth()] + ' ' + d.getDate() + ' ' + d.getFullYear() + ' to ' + monthNames[e.getMonth()] + ' ' + e.getDate() + ' ' + e.getFullYear();

            this.title = userProfile;
            var dynamicColumnsDaysName = [];

            dynamicColumnsDaysName.push(
            {
                title: "Location",
                dataKey: "loc"
            });
            dynamicColumnsDaysName.push(
            {
                title: "Workload",
                dataKey: "Sdate"
            });



            var counter = 0;
            for (var i = 0; i < 7; i++)
            {
                //6 - 10
                if (this.parseStartDate/* <= parseEndDate*/)
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
                        var today = new Date(startDate);
                        this.tomorrow = new Date();
                        this.tomorrow.setDate(today.getDate() + i);
                        this.parseStartDate = Date.parse(this.tomorrow);
                    }
                    else
                    {
                        var today = new Date(startDate);
                        this.tomorrow = new Date();
                        this.tomorrow.setDate(today.getDate() + i);
                        var dayName = days[this.tomorrow.getDay()];
                        dynamicColumnsDaysName.push(
                        {
                            title: days[this.tomorrow.getDay()] + '\n' + this.tomorrow.getDate() + '-' + (this.tomorrow.getMonth() + 1) + '-' + this.tomorrow.getFullYear(),
                            dataKey: days[this.tomorrow.getDay()],
                            date: (this.tomorrow.getMonth() + 1) + '-' + this.tomorrow.getDate() + '-' + this.tomorrow.getFullYear(),
                            day: days[this.tomorrow.getDay()]
                        });

                        //set next day date value 
                        var today = new Date(startDate);
                        this.tomorrow = new Date();
                        this.tomorrow.setDate(today.getDate() + i);
                        this.parseStartDate = Date.parse(this.tomorrow);
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

            //if(value == 'upcoming'){
            for (var i = 0; i < AllLocaions.length; i++)
            {
                var filteredArray = allshifts.filter(function (itm)
                {
                    return itm.location.address.location == AllLocaions[i].loc;
                });
                // var shifts = allshifts.filter(checkLocation(AllLocaions[]));;
                AllLocaions[i].workload = filteredArray;
                var filteredWorkload = [];


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
                                    'username': filteredArray[k].userInfo.firstname
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
                                        'username': filteredArray[k].userInfo.firstname
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
                                                'username': filteredArray[k].userInfo.firstname
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

                                if (dayArray.start_time != '' /*&& this.workloadEndDate <= parseEndDate */&& this.workloadEndDate <= this.shiftEndDate)
                                {
                                    if (filteredWorkload.length == 0)
                                    {
                                        var currentWorkoutDate = this.workloadDate.getFullYear() + '-' + (this.workloadDate.getMonth() + 1) + '-' + this.workloadDate.getDate();
                                         currentWorkoutDate = this.formattedDate(currentWorkoutDate);
                                        var p = Date.parse(currentWorkoutDate);
                                        console.log("manmohit P = " + p);
                                        console.log("manmohit PAR = " + p);
                                        if (p >= this.shiftStartDateParse)
                                        {
                                            var dates = [];
                                            dates.push(
                                            {
                                                'date': (this.workloadDate.getMonth() + 1) + '-' + this.workloadDate.getDate() + '-' + this.workloadDate.getFullYear(),
                                                'username': filteredArray[k].userInfo.firstname
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
                                        this.workloadDate = new Date(this.parseStartDate);
                                        var workloadDate1 = Date.parse(this.workloadDate);
                                        //var selectedDate = new Date(startDate);
                                        var dayName = days[this.workloadDate.getDay()];
                                        var dayArray = this.returnDateAndTime(dayName, filteredArray[k].days);

                                        var index = this.getTimeIndex(filteredWorkload, dayArray.start_time, dayArray.end_time);

                                        if (index == -1)
                                        {
                                            var dates = [];
                                            var currentWorkoutDate = this.workloadDate.getFullYear() + '-' + (this.workloadDate.getMonth() + 1) + '-' + this.workloadDate.getDate();
                                             currentWorkoutDate = this.formattedDate(currentWorkoutDate);
                                            var p = Date.parse(currentWorkoutDate);
                                            if (p >= this.shiftStartDateParse)
                                            {
                                                dates.push(
                                                {
                                                    'date': this.workloadDate.getFullYear() + '-' + (this.workloadDate.getMonth() + 1) + '-' + this.workloadDate.getDate(),
                                                    'username': filteredArray[k].userInfo.firstname
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
                                                    var currentWorkoutDate = this.workloadDate.getFullYear() + '-' + (this.workloadDate.getMonth() + 1) + '-' + this.workloadDate.getDate();
                                                     currentWorkoutDate = this.formattedDate(currentWorkoutDate);
                                                    var p = Date.parse(currentWorkoutDate);
                                                    if (p >= this.shiftStartDateParse)
                                                    {
                                                        filteredWorkload[j].dates.push(
                                                        {
                                                            'date': this.workloadDate.getFullYear() + '-' + (this.workloadDate.getMonth() + 1) + '-' + this.workloadDate.getDate(),
                                                            'username': filteredArray[k].userInfo.firstname
                                                        });
                                                    }
                                                }
                                            }
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
                                this.tomorrow.setDate(this.today.getDate() + n);
                                this.parseStartDate = Date.parse(this.tomorrow);

                                this.shiftEndDate = new Date(filteredArray[k].end_date);
                                this.shiftEndDateParse = Date.parse(this.shiftEndDate);

                                var dayName = days[this.tomorrow.getDay()];
                                var dayArray = this.returnDateAndTime(dayName, filteredArray[k].days);

                                if (dayArray.start_time != ''/* && this.parseStartDate <= parseEndDate*/ && this.parseStartDate <= this.shiftEndDateParse)
                                {
                                    var index = this.getTimeIndex(filteredWorkload, dayArray.start_time, dayArray.end_time);

                                    if (index == -1)
                                    {
                                        var dates = [];

                                        var currentWorkoutDate = this.tomorrow.getFullYear() + '-' + (this.tomorrow.getMonth() + 1) + '-' + this.tomorrow.getDate();
                                         currentWorkoutDate = this.formattedDate(currentWorkoutDate);
                                        var p = Date.parse(currentWorkoutDate);
                                        if (p >= this.shiftStartDateParse)
                                        {
                                            dates.push(
                                            {
                                                'date': this.tomorrow.getFullYear() + '-' + (this.tomorrow.getMonth() + 1) + '-' + this.tomorrow.getDate(),
                                                'username': filteredArray[k].userInfo.firstname
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
                                                 currentWorkoutDate = this.formattedDate(currentWorkoutDate);
                                                var p = Date.parse(currentWorkoutDate);
                                                if (p >= this.shiftStartDateParse)
                                                {
                                                    filteredWorkload[j].dates.push(
                                                    {
                                                        'date': this.tomorrow.getFullYear() + '-' + (this.tomorrow.getMonth() + 1) + '-' + this.tomorrow.getDate(),
                                                        'username': filteredArray[k].userInfo.firstname
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
                console.log(filteredWorkload)

                for (var l = 0; l < filteredWorkload.length; l++)
                {
                    //get day entry
                    var d1 = '',
                        d2 = '',
                        d3 = '',
                        d4 = '',
                        d5 = '',
                        d6 = '',
                        d7 = '';
                    for (var m = 0; m < filteredWorkload[l].dates.length; m++)
                    {
                        this.workloadDate = new Date(filteredWorkload[l].dates[m].date);
                        //var selectedDate = new Date(startDate);
                        var dayName = days[this.workloadDate.getDay()];

                        if (dayName == 'Mon')
                        {
                            d1 = filteredWorkload[l].dates[m].username;
                        }
                        else if (dayName == 'Tue')
                        {
                            d2 = filteredWorkload[l].dates[m].username
                        }
                        else if (dayName == 'Wed')
                        {
                            d3 = filteredWorkload[l].dates[m].username
                        }
                        else if (dayName == 'Thu')
                        {
                            d4 = filteredWorkload[l].dates[m].username
                        }
                        else if (dayName == 'Fri')
                        {
                            d5 = filteredWorkload[l].dates[m].username
                        }
                        else if (dayName == 'Sat')
                        {
                            d6 = filteredWorkload[l].dates[m].username
                        }
                        else if (dayName == 'Sun')
                        {
                            d7 = filteredWorkload[l].dates[m].username
                        }
                    }

                    if (d1 != '' || d2 != '' || d3 != '' || d4 != '' || d5 != '' || d6 != '' || d7 != '')
                    {
                        var workloadName = AllLocaions[i].loc,
                            workloadTime = filteredWorkload[l].start_time + '-' + filteredWorkload[l].end_time;
                        var workloadTime1 = '(' + filteredWorkload[l].start_time + ' - ' + filteredWorkload[l].end_time + ')';
                        a = {
                            'loc': AllLocaions[i].loc,
                            'Sdate': workloadName + workloadTime + workloadTime1,
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

            }
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

            // ADD JSON DATA TO THE TABLE AS ROWS.
            for (var i = 0; i < rows.length; i++)
            {
                console.log(rows[i])
                tr = table.insertRow(-1);

                for (var j = 0; j < col.length; j++)
                {
                    var tabCell = tr.insertCell(-1);

                    if (columns[j].dataKey == 'loc')
                    {
                        tabCell.innerHTML = rows[i].loc;
                    }
                    else if (columns[j].dataKey == 'Sdate')
                    {
                        tabCell.innerHTML = rows[i].Sdate;
                    }
                    else if (columns[j].dataKey == 'Mon')
                    {
                        tabCell.innerHTML = rows[i].Mon;
                    }
                    else if (columns[j].dataKey == 'Tue')
                    {
                        tabCell.innerHTML = rows[i].Tue;
                    }
                    else if (columns[j].dataKey == 'Wed')
                    {
                        tabCell.innerHTML = rows[i].Wed;
                    }
                    else if (columns[j].dataKey == 'Thu')
                    {
                        tabCell.innerHTML = rows[i].Thu;
                    }
                    else if (columns[j].dataKey == 'Fri')
                    {
                        tabCell.innerHTML = rows[i].Fri;
                    }
                    else if (columns[j].dataKey == 'Sat')
                    {
                        tabCell.innerHTML = rows[i].Sat;
                    }
                    else if (columns[j].dataKey == 'Sun')
                    {
                        tabCell.innerHTML = rows[i].Sun;
                    }
                    else if (columns[j].dataKey == 'loc')
                    {
                        tabCell.innerHTML = rows[i].loc;
                    }
                }
            }

            // FINALLY ADD THE NEWLY CREATED TABLE WITH JSON DATA TO A CONTAINER.
            var divContainer = document.getElementById("table-1");
            divContainer.innerHTML = "";
            divContainer.appendChild(table);

            //user type report
            var rows = [],
                a, userProfile;
            var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
            ];

            var d = new Date(startDate);
            // var e = new Date(endDate);
            var e = new Date();
           e.setDate(d.getDate() + 6);
            var parseEndDate = Date.parse(endDate);
            var parseStartDate = Date.parse(startDate);
            var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            // var d = new Date(dateString);
            // var dayName = days[d.getDay()];

            userProfile = 'Roster by Users for Period ' + monthNames[d.getMonth()] + ' ' + d.getDate() + ' ' + d.getFullYear() + ' to ' + monthNames[e.getMonth()] + ' ' + e.getDate() + ' ' + e.getFullYear() + ' (Week 1)';
            this.title1 = userProfile;

            var dynamicColumnsDaysName = [];

            dynamicColumnsDaysName.push(
            {
                title: "Guard",
                dataKey: "user"
            });

            var counter = 0;
            for (var i = 0; i < 7; i++)
            {
                //6 - 10
                if (parseStartDate /*<= parseEndDate*/)
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
                AllUsers = [];

            for (var i = 0; i < allshifts.length; i++)
            {
                if (AllUsers.length == 0)
                {
                    AllUsers.push(
                    {
                        'user': allshifts[i].userInfo.firstname,
                        'workload': []
                    });
                }
                else
                {
                    var index = this.getUserIndex(AllUsers, allshifts[i].userInfo.firstname);
                    if (index == -1)
                    {
                        AllUsers.push(
                        {
                            'user': allshifts[i].userInfo.firstname,
                            'workload': []
                        });
                    }
                }
            }


            console.log('all users');
            console.log(AllUsers)
            for (var i = 0; i < AllUsers.length; i++)
            {
                var filteredArray = allshifts.filter(function (itm)
                {
                    return itm.userInfo.firstname == AllUsers[i].user;
                });
                // var shifts = allshifts.filter(checkLocation(AllLocaions[]));;
                AllUsers[i].workload = filteredArray;
                var filteredWorkload = [];
                // var d = new Date(startDate);
                // var e = new Date(endDate);
                // var parseEndDate = Date.parse(d);
                // var parseStartDate = Date.parse(e);
                //all shifts entries for single location
                console.log('filteredArray');
                console.log(filteredArray)
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

                                if (dayArray.start_time != '' /*&& this.workloadEndDate <= parseEndDate*/ && this.workloadEndDate <= this.shiftEndDate)
                                {
                                    if (filteredWorkload.length == 0)
                                    {
                                        var currentWorkoutDate = this.workloadDate.getFullYear() + '-' + (this.workloadDate.getMonth() + 1) + '-' + this.workloadDate.getDate();
                                         currentWorkoutDate = this.formattedDate(currentWorkoutDate);
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
                                             currentWorkoutDate = this.formattedDate(currentWorkoutDate);
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
                                        }
                                        else
                                        {
                                            for (var j = 0; j < filteredWorkload.length; j++)
                                            {
                                                if (filteredWorkload[j].start_time == dayArray.start_time && filteredWorkload[j].end_time == dayArray.end_time)
                                                {
                                                    var currentWorkoutDate = this.workloadDate.getFullYear() + '-' + (this.workloadDate.getMonth() + 1) + '-' + this.workloadDate.getDate();
                                                     currentWorkoutDate = this.formattedDate(currentWorkoutDate);
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

                                if (dayArray.start_time != '' /*&& parseStartDate <= parseEndDate*/ && parseStartDate <= this.shiftEndDateParse)
                                {
                                    var index = this.getTimeIndex(filteredWorkload, dayArray.start_time, dayArray.end_time);

                                    if (index == -1)
                                    {
                                        var dates = [];

                                        var currentWorkoutDate = this.tomorrow.getFullYear() + '-' + (this.tomorrow.getMonth() + 1) + '-' + this.tomorrow.getDate();
                                         currentWorkoutDate = this.formattedDate(currentWorkoutDate);
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
                                                 currentWorkoutDate = this.formattedDate(currentWorkoutDate);
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
                console.log(filteredWorkload)
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
                        'user': AllUsers[i].user,
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
                    if (columns[j].dataKey == 'user')
                    {
                        tabCell.innerHTML = rows[i].user;
                    }
                    else if (columns[j].dataKey == 'Sdate')
                    {
                        tabCell.innerHTML = rows[i].Sdate;
                    }
                    else if (columns[j].dataKey == 'Mon')
                    {
                        tabCell.innerHTML = '<span class="badge badge-primary" >'+rows[i].Mon+'</span>';
                    }
                    else if (columns[j].dataKey == 'Tue')
                    {
                        tabCell.innerHTML = '<span class="badge badge-primary" >'+rows[i].Tue+'</span>';
                    }
                    else if (columns[j].dataKey == 'Wed')
                    {
                        tabCell.innerHTML = '<span class="badge badge-primary" >'+rows[i].Wed+'</span>';
                    }
                    else if (columns[j].dataKey == 'Thu')
                    {
                        tabCell.innerHTML = '<span class="badge badge-primary" >'+rows[i].Thu+'</span>';
                    }
                    else if (columns[j].dataKey == 'Fri')
                    {
                        tabCell.innerHTML = '<span class="badge badge-primary" >'+rows[i].Fri+'</span>';
                    }
                    else if (columns[j].dataKey == 'Sat')
                    {
                        tabCell.innerHTML = '<span class="badge badge-primary" >'+rows[i].Sat+'</span>';
                    }
                    else if (columns[j].dataKey == 'Sun')
                    {
                        tabCell.innerHTML = '<span class="badge badge-primary" >'+rows[i].Sun+'</span>';
                    }
                }
            }

            // FINALLY ADD THE NEWLY CREATED TABLE WITH JSON DATA TO A CONTAINER.
            var divContainer = document.getElementById("table-2");
            divContainer.innerHTML = "";
            divContainer.appendChild(table);
        }

    };


    public DownloadReport(value, startDate, endDate, type)
    {
        if (type == 'workload')
        {
            var rows = [],
                a, userProfile;
            var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
            ];

            var d = new Date(startDate);
            // var e = new Date(endDate);
            var e = new Date();
            e.setDate(d.getDate() + 6);
            var parseEndDate = Date.parse(endDate);
            this.parseStartDate = Date.parse(startDate);
            var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            // var d = new Date(dateString);
            // var dayName = days[d.getDay()];

            userProfile = 'Roster by Workload for Period ' + monthNames[d.getMonth()] + ' ' + d.getDate() + ' ' + d.getFullYear() + ' to ' + monthNames[e.getMonth()] + ' ' + e.getDate() + ' ' + e.getFullYear();

            var dynamicColumnsDaysName = [];

            dynamicColumnsDaysName.push(
            {
                title: "Location",
                dataKey: "loc"
            });
            dynamicColumnsDaysName.push(
            {
                title: "Workload",
                dataKey: "Sdate"
            });

            var counter = 0;
            for (var i = 0; i < 7; i++)
            {
                //6 - 10
                if (this.parseStartDate /*<= parseEndDate*/)
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
                        var today = new Date(startDate);
                        this.tomorrow = new Date();
                        this.tomorrow.setDate(today.getDate() + i);
                        this.parseStartDate = Date.parse(this.tomorrow);
                    }
                    else
                    {
                        var today = new Date(startDate);
                        this.tomorrow = new Date();
                        this.tomorrow.setDate(today.getDate() + i);
                        var dayName = days[this.tomorrow.getDay()];
                        dynamicColumnsDaysName.push(
                        {
                            title: days[this.tomorrow.getDay()] + '\n' + this.tomorrow.getDate() + '-' + (this.tomorrow.getMonth() + 1) + '-' + this.tomorrow.getFullYear(),
                            dataKey: days[this.tomorrow.getDay()],
                            date: (this.tomorrow.getMonth() + 1) + '-' + this.tomorrow.getDate() + '-' + this.tomorrow.getFullYear(),
                            day: days[this.tomorrow.getDay()]
                        });

                        //set next day date value 
                        var today = new Date(startDate);
                        this.tomorrow = new Date();
                        this.tomorrow.setDate(today.getDate() + i);
                        this.parseStartDate = Date.parse(this.tomorrow);
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

            //if(value == 'upcoming'){
            for (var i = 0; i < AllLocaions.length; i++)
            {
                var filteredArray = allshifts.filter(function (itm)
                {
                    return itm.location.address.location == AllLocaions[i].loc;
                });
                // var shifts = allshifts.filter(checkLocation(AllLocaions[]));;
                AllLocaions[i].workload = filteredArray;
                var filteredWorkload = [];


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
                                    'username': filteredArray[k].userInfo.firstname
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
                                        'username': filteredArray[k].userInfo.firstname
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
                                                'username': filteredArray[k].userInfo.firstname
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

                                if (dayArray.start_time != '' /*&& this.workloadEndDate <= parseEndDate*/ && this.workloadEndDate <= this.shiftEndDate)
                                {
                                    if (filteredWorkload.length == 0)
                                    {
                                        var currentWorkoutDate = this.workloadDate.getFullYear() + '-' + (this.workloadDate.getMonth() + 1) + '-' + this.workloadDate.getDate();
                                         currentWorkoutDate = this.formattedDate(currentWorkoutDate);
                                        var p = Date.parse(currentWorkoutDate);
                                        console.log("manmohit P = " + p);
                                        console.log("manmohit PAR = " + p);
                                        if (p >= this.shiftStartDateParse)
                                        {
                                            var dates = [];
                                            dates.push(
                                            {
                                                'date': (this.workloadDate.getMonth() + 1) + '-' + this.workloadDate.getDate() + '-' + this.workloadDate.getFullYear(),
                                                'username': filteredArray[k].userInfo.firstname
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
                                        this.workloadDate = new Date(this.parseStartDate);
                                        var workloadDate1 = Date.parse(this.workloadDate);
                                        //var selectedDate = new Date(startDate);
                                        var dayName = days[this.workloadDate.getDay()];
                                        var dayArray = this.returnDateAndTime(dayName, filteredArray[k].days);

                                        var index = this.getTimeIndex(filteredWorkload, dayArray.start_time, dayArray.end_time);

                                        if (index == -1)
                                        {
                                            var dates = [];
                                            var currentWorkoutDate = this.workloadDate.getFullYear() + '-' + (this.workloadDate.getMonth() + 1) + '-' + this.workloadDate.getDate();
                                             currentWorkoutDate = this.formattedDate(currentWorkoutDate);
                                            var p = Date.parse(currentWorkoutDate);
                                            if (p >= this.shiftStartDateParse)
                                            {
                                                dates.push(
                                                {
                                                    'date': this.workloadDate.getFullYear() + '-' + (this.workloadDate.getMonth() + 1) + '-' + this.workloadDate.getDate(),
                                                    'username': filteredArray[k].userInfo.firstname
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
                                                    var currentWorkoutDate = this.workloadDate.getFullYear() + '-' + (this.workloadDate.getMonth() + 1) + '-' + this.workloadDate.getDate();
                                                     currentWorkoutDate = this.formattedDate(currentWorkoutDate);
                                                    var p = Date.parse(currentWorkoutDate);
                                                    if (p >= this.shiftStartDateParse)
                                                    {
                                                        filteredWorkload[j].dates.push(
                                                        {
                                                            'date': this.workloadDate.getFullYear() + '-' + (this.workloadDate.getMonth() + 1) + '-' + this.workloadDate.getDate(),
                                                            'username': filteredArray[k].userInfo.firstname
                                                        });
                                                    }
                                                }
                                            }
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
                                this.tomorrow.setDate(this.today.getDate() + n);
                                this.parseStartDate = Date.parse(this.tomorrow);

                                this.shiftEndDate = new Date(filteredArray[k].end_date);
                                this.shiftEndDateParse = Date.parse(this.shiftEndDate);

                                var dayName = days[this.tomorrow.getDay()];
                                var dayArray = this.returnDateAndTime(dayName, filteredArray[k].days);

                                if (dayArray.start_time != '' /*&& this.parseStartDate <= parseEndDate*/ && this.parseStartDate <= this.shiftEndDateParse)
                                {
                                    var index = this.getTimeIndex(filteredWorkload, dayArray.start_time, dayArray.end_time);

                                    if (index == -1)
                                    {
                                        var dates = [];

                                        var currentWorkoutDate = this.tomorrow.getFullYear() + '-' + (this.tomorrow.getMonth() + 1) + '-' + this.tomorrow.getDate();
                                         currentWorkoutDate = this.formattedDate(currentWorkoutDate);
                                        var p = Date.parse(currentWorkoutDate);
                                        if (p >= this.shiftStartDateParse)
                                        {
                                            dates.push(
                                            {
                                                'date': this.tomorrow.getFullYear() + '-' + (this.tomorrow.getMonth() + 1) + '-' + this.tomorrow.getDate(),
                                                'username': filteredArray[k].userInfo.firstname
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
                                                 currentWorkoutDate = this.formattedDate(currentWorkoutDate);
                                                var p = Date.parse(currentWorkoutDate);
                                                if (p >= this.shiftStartDateParse)
                                                {
                                                    filteredWorkload[j].dates.push(
                                                    {
                                                        'date': this.tomorrow.getFullYear() + '-' + (this.tomorrow.getMonth() + 1) + '-' + this.tomorrow.getDate(),
                                                        'username': filteredArray[k].userInfo.firstname
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
                console.log(filteredWorkload)
                for (var l = 0; l < filteredWorkload.length; l++)
                {
                    //get day entry
                    var d1 = '',
                        d2 = '',
                        d3 = '',
                        d4 = '',
                        d5 = '',
                        d6 = '',
                        d7 = '';
                    for (var m = 0; m < filteredWorkload[l].dates.length; m++)
                    {
                        this.workloadDate = new Date(filteredWorkload[l].dates[m].date);
                        //var selectedDate = new Date(startDate);
                        var dayName = days[this.workloadDate.getDay()];

                        if (dayName == 'Mon')
                        {
                            d1 = filteredWorkload[l].dates[m].username;
                        }
                        else if (dayName == 'Tue')
                        {
                            d2 = filteredWorkload[l].dates[m].username
                        }
                        else if (dayName == 'Wed')
                        {
                            d3 = filteredWorkload[l].dates[m].username
                        }
                        else if (dayName == 'Thu')
                        {
                            d4 = filteredWorkload[l].dates[m].username
                        }
                        else if (dayName == 'Fri')
                        {
                            d5 = filteredWorkload[l].dates[m].username
                        }
                        else if (dayName == 'Sat')
                        {
                            d6 = filteredWorkload[l].dates[m].username
                        }
                        else if (dayName == 'Sun')
                        {
                            d7 = filteredWorkload[l].dates[m].username
                        }
                    }

                    if (d1 != '' || d2 != '' || d3 != '' || d4 != '' || d5 != '' || d6 != '' || d7 != '')
                    {
                        var workloadName = AllLocaions[i].loc,
                            workloadTime = filteredWorkload[l].start_time + '-' + filteredWorkload[l].end_time;
                        var workloadTime1 = '(' + filteredWorkload[l].start_time + ' - ' + filteredWorkload[l].end_time + ')';
                        a = {
                            'loc': AllLocaions[i].loc,
                            'Sdate': workloadName + workloadTime + workloadTime1,
                            'Mon': d1,
                            'Tue': d2,
                            'Wed': d3,
                            'Thu': d4,
                            'Fri': d5,
                            'Sat': d6,
                            'Sun': d7,
                        }
                        rows.push(a);
                        this.rows = rows;
                    }
                }
            }

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
            doc.autoTable(columns, rows,
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
            doc.save('workload.pdf');
        }
        else if (type == 'user')
        {
            //user type report
            var rows = [],
                a, userProfile;
            var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
            ];

            var d = new Date(startDate);
            // var e = new Date(endDate);
            var e = new Date();
            e.setDate(d.getDate() + 6);
            var parseEndDate = Date.parse(endDate);
            var parseStartDate = Date.parse(startDate);
            var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            // var d = new Date(dateString);
            // var dayName = days[d.getDay()];

            userProfile = 'Roster by Users for Period ' + monthNames[d.getMonth()] + ' ' + d.getDate() + ' ' + d.getFullYear() + ' to ' + monthNames[e.getMonth()] + ' ' + e.getDate() + ' ' + e.getFullYear() + ' (Week 1)';

            var dynamicColumnsDaysName = [];

            dynamicColumnsDaysName.push(
            {
                title: "Guard",
                dataKey: "user"
            });

            var counter = 0;
            for (var i = 0; i < 7; i++)
            {
                //6 - 10
                if (parseStartDate /*<= parseEndDate*/)
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
                AllUsers = [];

            for (var i = 0; i < allshifts.length; i++)
            {
                if (AllUsers.length == 0)
                {
                    AllUsers.push(
                    {
                        'user': allshifts[i].userInfo.firstname,
                        'workload': []
                    });
                }
                else
                {
                    var index = this.getUserIndex(AllUsers, allshifts[i].userInfo.firstname);
                    if (index == -1)
                    {
                        AllUsers.push(
                        {
                            'user': allshifts[i].userInfo.firstname,
                            'workload': []
                        });
                    }
                }
            }



            for (var i = 0; i < AllUsers.length; i++)
            {
                var filteredArray = allshifts.filter(function (itm)
                {
                    return itm.userInfo.firstname == AllUsers[i].user;
                });
                // var shifts = allshifts.filter(checkLocation(AllLocaions[]));;
                AllUsers[i].workload = filteredArray;
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

                                if (dayArray.start_time != '' /*&& this.workloadEndDate <= parseEndDate*/ && this.workloadEndDate <= this.shiftEndDate)
                                {
                                    if (filteredWorkload.length == 0)
                                    {
                                        var currentWorkoutDate = this.workloadDate.getFullYear() + '-' + (this.workloadDate.getMonth() + 1) + '-' + this.workloadDate.getDate();
                                         currentWorkoutDate = this.formattedDate(currentWorkoutDate);
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
                                            var  currentWorkoutDate = this.workloadDate.getFullYear() + '-' + (this.workloadDate.getMonth() + 1) + '-' + this.workloadDate.getDate();
                                              currentWorkoutDate = this.formattedDate(currentWorkoutDate);
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
                                        }
                                        else
                                        {
                                            for (var j = 0; j < filteredWorkload.length; j++)
                                            {
                                                if (filteredWorkload[j].start_time == dayArray.start_time && filteredWorkload[j].end_time == dayArray.end_time)
                                                {
                                                    var currentWorkoutDate = this.workloadDate.getFullYear() + '-' + (this.workloadDate.getMonth() + 1) + '-' + this.workloadDate.getDate();
                                                     currentWorkoutDate = this.formattedDate(currentWorkoutDate);
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

                                if (dayArray.start_time != '' /*&& parseStartDate <= parseEndDate*/ && parseStartDate <= this.shiftEndDateParse)
                                {
                                    var index = this.getTimeIndex(filteredWorkload, dayArray.start_time, dayArray.end_time);

                                    if (index == -1)
                                    {
                                        var dates = [];

                                        var currentWorkoutDate = this.tomorrow.getFullYear() + '-' + (this.tomorrow.getMonth() + 1) + '-' + this.tomorrow.getDate();
                                         currentWorkoutDate = this.formattedDate(currentWorkoutDate);
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
                                                 currentWorkoutDate = this.formattedDate(currentWorkoutDate);
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
                console.log(filteredWorkload)
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
                        'user': AllUsers[i].user,
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

                var doc = new jsPDF('l', 'pt');
                var totalPagesExp = doc.internal.getNumberOfPages();
                doc.page = 1;
                console.log(doc);


                var pageContent = function (data)
                {
                    console.log(data);
                    // HEADER
                    doc.setFontSize(16);
                    doc.setTextColor(6, 6, 6);
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
                doc.autoTable(columns, rows,
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
                        overflow: 'linebreak',
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

                doc.save('Report.pdf');

            }
        }
        else
        {

            var rows = [],
                a, userProfile;
            var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
            ];

            var d = new Date(startDate);
            // var e = new Date(endDate);
            var e = new Date();
            e.setDate(d.getDate() + 6);
            var parseEndDate = Date.parse(endDate);
            this.parseStartDate = Date.parse(startDate);
            var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            // var d = new Date(dateString);
            // var dayName = days[d.getDay()];

            userProfile = 'Roster by Workload for Period ' + monthNames[d.getMonth()] + ' ' + d.getDate() + ' ' + d.getFullYear() + ' to ' + monthNames[e.getMonth()] + ' ' + e.getDate() + ' ' + e.getFullYear();

            var dynamicColumnsDaysName = [];

            dynamicColumnsDaysName.push(
            {
                title: "Location",
                dataKey: "loc"
            });
            dynamicColumnsDaysName.push(
            {
                title: "Workload",
                dataKey: "Sdate"
            });

            var counter = 0;
            for (var i = 0; i < 7; i++)
            {
                //6 - 10
                if (this.parseStartDate /*<= parseEndDate*/)
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
                        var today = new Date(startDate);
                        this.tomorrow = new Date();
                        this.tomorrow.setDate(today.getDate() + i);
                        this.parseStartDate = Date.parse(this.tomorrow);
                    }
                    else
                    {
                        var today = new Date(startDate);
                        this.tomorrow = new Date();
                        this.tomorrow.setDate(today.getDate() + i);
                        var dayName = days[this.tomorrow.getDay()];
                        dynamicColumnsDaysName.push(
                        {
                            title: days[this.tomorrow.getDay()] + '\n' + this.tomorrow.getDate() + '-' + (this.tomorrow.getMonth() + 1) + '-' + this.tomorrow.getFullYear(),
                            dataKey: days[this.tomorrow.getDay()],
                            date: (this.tomorrow.getMonth() + 1) + '-' + this.tomorrow.getDate() + '-' + this.tomorrow.getFullYear(),
                            day: days[this.tomorrow.getDay()]
                        });

                        //set next day date value 
                        var today = new Date(startDate);
                        this.tomorrow = new Date();
                        this.tomorrow.setDate(today.getDate() + i);
                        this.parseStartDate = Date.parse(this.tomorrow);
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

            //if(value == 'upcoming'){
            for (var i = 0; i < AllLocaions.length; i++)
            {
                var filteredArray = allshifts.filter(function (itm)
                {
                    return itm.location.address.location == AllLocaions[i].loc;
                });
                // var shifts = allshifts.filter(checkLocation(AllLocaions[]));;
                AllLocaions[i].workload = filteredArray;
                var filteredWorkload = [];


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
                                    'username': filteredArray[k].userInfo.firstname
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
                                        'username': filteredArray[k].userInfo.firstname
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
                                                'username': filteredArray[k].userInfo.firstname
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

                                if (dayArray.start_time != '' /*&& this.workloadEndDate <= parseEndDate*/ && this.workloadEndDate <= this.shiftEndDate)
                                {
                                    if (filteredWorkload.length == 0)
                                    {
                                        var currentWorkoutDate = this.workloadDate.getFullYear() + '-' + (this.workloadDate.getMonth() + 1) + '-' + this.workloadDate.getDate();
                                         currentWorkoutDate = this.formattedDate(currentWorkoutDate);
                                        var p = Date.parse(currentWorkoutDate);
                                        console.log("manmohit P = " + p);
                                        console.log("manmohit PAR = " + p);
                                        if (p >= this.shiftStartDateParse)
                                        {
                                            var dates = [];
                                            dates.push(
                                            {
                                                'date': (this.workloadDate.getMonth() + 1) + '-' + this.workloadDate.getDate() + '-' + this.workloadDate.getFullYear(),
                                                'username': filteredArray[k].userInfo.firstname
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
                                        this.workloadDate = new Date(this.parseStartDate);
                                        var workloadDate1 = Date.parse(this.workloadDate);
                                        //var selectedDate = new Date(startDate);
                                        var dayName = days[this.workloadDate.getDay()];
                                        var dayArray = this.returnDateAndTime(dayName, filteredArray[k].days);

                                        var index = this.getTimeIndex(filteredWorkload, dayArray.start_time, dayArray.end_time);

                                        if (index == -1)
                                        {
                                            var dates = [];
                                            var currentWorkoutDate = this.workloadDate.getFullYear() + '-' + (this.workloadDate.getMonth() + 1) + '-' + this.workloadDate.getDate();
                                             currentWorkoutDate = this.formattedDate(currentWorkoutDate);
                                            var p = Date.parse(currentWorkoutDate);
                                            if (p >= this.shiftStartDateParse)
                                            {
                                                dates.push(
                                                {
                                                    'date': this.workloadDate.getFullYear() + '-' + (this.workloadDate.getMonth() + 1) + '-' + this.workloadDate.getDate(),
                                                    'username': filteredArray[k].userInfo.firstname
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
                                                    var currentWorkoutDate = this.workloadDate.getFullYear() + '-' + (this.workloadDate.getMonth() + 1) + '-' + this.workloadDate.getDate();
                                                     currentWorkoutDate = this.formattedDate(currentWorkoutDate);
                                                    var p = Date.parse(currentWorkoutDate);
                                                    if (p >= this.shiftStartDateParse)
                                                    {
                                                        filteredWorkload[j].dates.push(
                                                        {
                                                            'date': this.workloadDate.getFullYear() + '-' + (this.workloadDate.getMonth() + 1) + '-' + this.workloadDate.getDate(),
                                                            'username': filteredArray[k].userInfo.firstname
                                                        });
                                                    }
                                                }
                                            }
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
                                this.tomorrow.setDate(this.today.getDate() + n);
                                this.parseStartDate = Date.parse(this.tomorrow);

                                this.shiftEndDate = new Date(filteredArray[k].end_date);
                                this.shiftEndDateParse = Date.parse(this.shiftEndDate);

                                var dayName = days[this.tomorrow.getDay()];
                                var dayArray = this.returnDateAndTime(dayName, filteredArray[k].days);

                                if (dayArray.start_time != '' /*&& this.parseStartDate <= parseEndDate*/ && this.parseStartDate <= this.shiftEndDateParse)
                                {
                                    var index = this.getTimeIndex(filteredWorkload, dayArray.start_time, dayArray.end_time);

                                    if (index == -1)
                                    {
                                        var dates = [];

                                        var currentWorkoutDate = this.tomorrow.getFullYear() + '-' + (this.tomorrow.getMonth() + 1) + '-' + this.tomorrow.getDate();
                                         currentWorkoutDate = this.formattedDate(currentWorkoutDate);
                                        var p = Date.parse(currentWorkoutDate);
                                        if (p >= this.shiftStartDateParse)
                                        {
                                            dates.push(
                                            {
                                                'date': this.tomorrow.getFullYear() + '-' + (this.tomorrow.getMonth() + 1) + '-' + this.tomorrow.getDate(),
                                                'username': filteredArray[k].userInfo.firstname
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
                                                 currentWorkoutDate = this.formattedDate(currentWorkoutDate);
                                                var p = Date.parse(currentWorkoutDate);
                                                if (p >= this.shiftStartDateParse)
                                                {
                                                    filteredWorkload[j].dates.push(
                                                    {
                                                        'date': this.tomorrow.getFullYear() + '-' + (this.tomorrow.getMonth() + 1) + '-' + this.tomorrow.getDate(),
                                                        'username': filteredArray[k].userInfo.firstname
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
                console.log(filteredWorkload)
                for (var l = 0; l < filteredWorkload.length; l++)
                {
                    //get day entry
                    var d1 = '',
                        d2 = '',
                        d3 = '',
                        d4 = '',
                        d5 = '',
                        d6 = '',
                        d7 = '';
                    for (var m = 0; m < filteredWorkload[l].dates.length; m++)
                    {
                        this.workloadDate = new Date(filteredWorkload[l].dates[m].date);
                        //var selectedDate = new Date(startDate);
                        var dayName = days[this.workloadDate.getDay()];

                        if (dayName == 'Mon')
                        {
                            d1 = filteredWorkload[l].dates[m].username;
                        }
                        else if (dayName == 'Tue')
                        {
                            d2 = filteredWorkload[l].dates[m].username
                        }
                        else if (dayName == 'Wed')
                        {
                            d3 = filteredWorkload[l].dates[m].username
                        }
                        else if (dayName == 'Thu')
                        {
                            d4 = filteredWorkload[l].dates[m].username
                        }
                        else if (dayName == 'Fri')
                        {
                            d5 = filteredWorkload[l].dates[m].username
                        }
                        else if (dayName == 'Sat')
                        {
                            d6 = filteredWorkload[l].dates[m].username
                        }
                        else if (dayName == 'Sun')
                        {
                            d7 = filteredWorkload[l].dates[m].username
                        }
                    }

                    if (d1 != '' || d2 != '' || d3 != '' || d4 != '' || d5 != '' || d6 != '' || d7 != '')
                    {
                        var workloadName = AllLocaions[i].loc,
                            workloadTime = filteredWorkload[l].start_time + '-' + filteredWorkload[l].end_time;
                        var workloadTime1 = '(' + filteredWorkload[l].start_time + ' - ' + filteredWorkload[l].end_time + ')';
                        a = {
                            'loc': AllLocaions[i].loc,
                            'Sdate': workloadName + workloadTime + workloadTime1,
                            'Mon': d1,
                            'Tue': d2,
                            'Wed': d3,
                            'Thu': d4,
                            'Fri': d5,
                            'Sat': d6,
                            'Sun': d7,
                        }

                        rows.push(a);
                        this.rows = rows;
                    }
                }
            }

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
            doc.autoTable(columns, rows,
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
            doc.save('workload.pdf');


            //user type report
            var rows = [],
                a, userProfile;
            var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
            ];

            var d = new Date(startDate);
            // var e = new Date(endDate);
            var e = new Date();
            e.setDate(d.getDate() + 6);
            var parseEndDate = Date.parse(endDate);
            var parseStartDate = Date.parse(startDate);
            var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            // var d = new Date(dateString);
            // var dayName = days[d.getDay()];

            userProfile = 'Roster by Users for Period ' + monthNames[d.getMonth()] + ' ' + d.getDate() + ' ' + d.getFullYear() + ' to ' + monthNames[e.getMonth()] + ' ' + e.getDate() + ' ' + e.getFullYear() + ' (Week 1)';

            var dynamicColumnsDaysName = [];

            dynamicColumnsDaysName.push(
            {
                title: "Guard",
                dataKey: "user"
            });

            var counter = 0;
            for (var i = 0; i < 7; i++)
            {
                //6 - 10
                if (parseStartDate /*<= parseEndDate*/)
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
                AllUsers = [];

            for (var i = 0; i < allshifts.length; i++)
            {
                if (AllUsers.length == 0)
                {
                    AllUsers.push(
                    {
                        'user': allshifts[i].userInfo.firstname,
                        'workload': []
                    });
                }
                else
                {
                    var index = this.getUserIndex(AllUsers, allshifts[i].userInfo.firstname);
                    if (index == -1)
                    {
                        AllUsers.push(
                        {
                            'user': allshifts[i].userInfo.firstname,
                            'workload': []
                        });
                    }
                }
            }



            for (var i = 0; i < AllUsers.length; i++)
            {
                var filteredArray = allshifts.filter(function (itm)
                {
                    return itm.userInfo.firstname == AllUsers[i].user;
                });
                // var shifts = allshifts.filter(checkLocation(AllLocaions[]));;
                AllUsers[i].workload = filteredArray;
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

                                if (dayArray.start_time != '' /*&& this.workloadEndDate <= parseEndDate*/ && this.workloadEndDate <= this.shiftEndDate)
                                {
                                    if (filteredWorkload.length == 0)
                                    {
                                        var currentWorkoutDate = this.workloadDate.getFullYear() + '-' + (this.workloadDate.getMonth() + 1) + '-' + this.workloadDate.getDate();
                                         currentWorkoutDate = this.formattedDate(currentWorkoutDate);
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
                                             currentWorkoutDate = this.formattedDate(currentWorkoutDate);
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
                                        }
                                        else
                                        {
                                            for (var j = 0; j < filteredWorkload.length; j++)
                                            {
                                                if (filteredWorkload[j].start_time == dayArray.start_time && filteredWorkload[j].end_time == dayArray.end_time)
                                                {
                                                    var currentWorkoutDate = this.workloadDate.getFullYear() + '-' + (this.workloadDate.getMonth() + 1) + '-' + this.workloadDate.getDate();
                                                     currentWorkoutDate = this.formattedDate(currentWorkoutDate);
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

                                if (dayArray.start_time != '' /*&& parseStartDate <= parseEndDate*/ && parseStartDate <= this.shiftEndDateParse)
                                {
                                    var index = this.getTimeIndex(filteredWorkload, dayArray.start_time, dayArray.end_time);

                                    if (index == -1)
                                    {
                                        var dates = [];

                                        var currentWorkoutDate = this.tomorrow.getFullYear() + '-' + (this.tomorrow.getMonth() + 1) + '-' + this.tomorrow.getDate();
                                         currentWorkoutDate = this.formattedDate(currentWorkoutDate);
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
                                                 currentWorkoutDate = this.formattedDate(currentWorkoutDate);
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
                console.log(filteredWorkload)
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
                        'user': AllUsers[i].user,
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
            var doc = new jsPDF('l', 'pt');
            var totalPagesExp = doc.internal.getNumberOfPages();
            doc.page = 1;
            console.log(doc);


            var pageContent = function (data)
            {
                console.log(data);
                // HEADER
                doc.setFontSize(16);
                doc.setTextColor(6, 6, 6);
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
            doc.autoTable(columns, rows,
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
                    overflow: 'linebreak',
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

            doc.save('Report.pdf');
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

    checkLocation(location, loc)
    {
        return location == loc;
    };
    // getAllEntriesBasedOnSelectedLocation(array, loc){
    //   return array.find(x => x.location.address === loc)
    // };

    ampmForPdf(time)
    {
        console.log(time);
        var start_time = time.start_time,
            end_time = time.end_time,
            start_time_am_pm = time.start_time_am_pm,
            end_time_am_pm = time.end_time_am_pm;
        console.log(start_time, end_time, start_time_am_pm, end_time_am_pm);
        if (start_time != '')
        {
            if (start_time_am_pm == '0')
            {
                start_time_am_pm = 'AM';
            }
            else
            {
                start_time_am_pm = 'PM';
            }

            if (end_time_am_pm == '0')
            {
                end_time_am_pm = 'AM';
            }
            else
            {
                end_time_am_pm = 'PM';
            }
            var formated = start_time + ' ' + start_time_am_pm + ' - ' + end_time + ' ' + end_time_am_pm;
            return formated;
        }
        else
        {
            return "";
        }

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
    }

    handlerStart(e)
    {

        var today = new Date(e.target.value);
        this.tomorrow = new Date(e.target.value);
        this.tomorrow.setDate(today.getDate() + 6);
        console.log(this.formatDate(this.tomorrow))

        this.maxdate = this.formatDate(this.tomorrow);
        // this.minimumdate = fullDate;
    };

    formatDate(date)
    {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [year, month, day].join('-');
    };


    // formattedDate(currentWorkoutDate)
    formattedDate(date) {
  // var temp = new Date(date)
  // temp = temp.toLocaleDateString();
  // // console.log(temp);
  var temp1 = date.split('-');
  if (Number(temp1[2]) < 10) {
    temp1[2] = '0' + temp1[2];
  }
  if (Number(temp1[1]) < 10) {
    temp1[1] = '0' + temp1[1];
  }
  // console.log(temp1[0] + '-' + temp1[1] + '-' + temp1[2]);
  return (temp1[0] + '-' + temp1[1] + '-' + temp1[2])
};

}