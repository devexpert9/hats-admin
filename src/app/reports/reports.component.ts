import { Component, OnInit } from '@angular/core';
import { SecurityService } from '../services/securityService';
import { ShiftService } from '../services/shiftService';
import { LocationService } from '../services/locationService';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ToastrService } from 'ngx-toastr';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { GooglePlaceDirective } from "ngx-google-places-autocomplete/ngx-google-places-autocomplete.directive";
import { ComponentRestrictions } from "ngx-google-places-autocomplete/objects/options/componentRestrictions";
import { Address } from "ngx-google-places-autocomplete/objects/address";
import { Router } from '@angular/router';
import * as jspdf from 'jspdf';  

import html2canvas from 'html2canvas';  
declare var jsPDF: any; 

@Component({
	selector: 'app-reports',
	templateUrl: './reports.component.html',
	styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
	securityGuardsList : any;
	userId: any;
	currentShift: any;
	value: any;
	profile: any;
	imageURL: any;
	shifts: any;
	formatted_current_date: any;
	formatted_current_time: any;
	rows: any;
	rows1: any;
	shiftType: any;
	latitude: any;
	longitude: any;
	viewShiftData: any;
	closeResult: any;
	modalRef: any;
	shiftsPast: any;
	maxdate: any;
	locations: any;

	constructor(public securityService: SecurityService,private locationService: LocationService,public shiftService: ShiftService,private spinnerService: Ng4LoadingSpinnerService,private modalService: NgbModal, public router: Router) {
		
		if(localStorage.getItem('adminId') == undefined || localStorage.getItem('adminId') == '' || localStorage.getItem('adminId') == null){
			this.router.navigateByUrl('/');
		};

		this.spinnerService.show();
		this.getSecurityGuardsList(); 
		this.imageURL = 'http://13.59.189.135:3002/images/';

		this.shifts = [];

		//get formatted current date   YYYY-MM-DD
		var current_date = new Date();
		var isodate = current_date.toISOString();
		var index = isodate.lastIndexOf('T');
		this.formatted_current_date = isodate.slice(0,index);

		//get formatted current time   HH:MM
		var current_time = current_date.toLocaleTimeString();
		var z = current_time.lastIndexOf(':');
		this.formatted_current_time = current_time.slice(0,z); 

		this.getLocations();
	};

	    getLocations(){
    this.spinnerService.show();
      this.locationService.GetLocation().subscribe((response) => {
          console.log(response);
          this.locations = response.data;
          this.spinnerService.hide();    
        });

  };






	public DownloadReport(value)  
	{ 
		var rows = [], a, userProfile;
		if(value == 'upcoming'){
			userProfile = this.profile.firstname + ' ' + this.profile.lastname + ' Upcoming Shifts';
		}else{
			userProfile = this.profile.firstname + ' ' + this.profile.lastname + ' Past Shifts';
		}
		

		var columns = [
		{title: "Location", dataKey: "loc"},
		{title: "Start Date", dataKey: "Sdate"},
		{title: "End Date", dataKey: "Edate"},
		{title: "Time", dataKey: "time"},
		{title: "Type", dataKey: "type"}, 
		{title: "Monday", dataKey: "Monday"}, 
		{title: "Tuesday", dataKey: "Tuesday"}, 
		{title: "Wednesday", dataKey: "Wednesday"}, 
		{title: "Thursday", dataKey: "Thursday"}, 
		{title: "Friday", dataKey: "Friday"}, 
		{title: "Saturday", dataKey: "Saturday"}, 
		{title: "Sunday", dataKey: "Sunday"},
		];

		if(value == 'upcoming'){
			for(var i = 0; i < this.rows.length; i++){
				if(this.rows[i].type == '0'){
					a = {
						'loc': this.rows[i].location.address,
						'Sdate': this.rows[i].shift_date,
						'Edate': this.rows[i].shift_date,
						'time': this.getTime(this.rows[i].start_time, this.rows[i].end_time),
						'type': 'Adhoc',
						'Monday':'',
						'Tuesday':'',
						'Wednesday':'',
						'Thursday':'',
						'Friday':'',
						'Saturday':'',
						'Sunday':'',

					}
				}else{
					a = {
						'loc': this.rows[i].location.address,
						'Sdate': this.rows[i].start_date,
						'Edate': this.rows[i].end_date,
						'time': this.getTime(this.rows[i].start_time, this.rows[i].end_time),
						'type': 'Ongoing',
						'Monday':this.ampmForPdf(this.rows[i].days[0]),
						'Tuesday':this.ampmForPdf(this.rows[i].days[1]),
						'Wednesday':this.ampmForPdf(this.rows[i].days[2]),
						'Thursday':this.ampmForPdf(this.rows[i].days[3]),
						'Friday':this.ampmForPdf(this.rows[i].days[5]),
						'Saturday':this.ampmForPdf(this.rows[i].days[4]),
						'Sunday':this.ampmForPdf(this.rows[i].days[6]),

					}
				}

				rows.push(a);
			}
		}else{
			for(var i = 0; i < this.rows1.length; i++){
				if(this.rows1[i].type == '0'){
					a = {
						'loc': this.rows1[i].location.address,
						'Sdate': this.rows1[i].shift_date,
						'Edate': this.rows1[i].shift_date,
						'time': this.getTime(this.rows1[i].start_time, this.rows1[i].end_time),
						'type': 'Adhoc',
						'Monday':'',
						'Tuesday':'',
						'Wednesday':'',
						'Thursday':'',
						'Friday':'',
						'Saturday':'',
						'Sunday':'',

					}
				}else{
					a = {
						'loc': this.rows1[i].location.address,
						'Sdate': this.rows1[i].start_date,
						'Edate': this.rows1[i].end_date,
						'time': this.getTime(this.rows1[i].start_time, this.rows1[i].end_time),
						'type': 'Ongoing',
						'Monday':this.ampmForPdf(this.rows1[i].days[0]),
						'Tuesday':this.ampmForPdf(this.rows1[i].days[1]),
						'Wednesday':this.ampmForPdf(this.rows1[i].days[2]),
						'Thursday':this.ampmForPdf(this.rows1[i].days[3]),
						'Friday':this.ampmForPdf(this.rows1[i].days[5]),
						'Saturday':this.ampmForPdf(this.rows1[i].days[4]),
						'Sunday':this.ampmForPdf(this.rows1[i].days[6]),

					}
				}

				rows.push(a);
			}
		}

		
		console.log(rows);




		var doc = new jsPDF('l', 'pt');
		var totalPagesExp =  doc.internal.getNumberOfPages();
		doc.page = 1;
		console.log(doc);


		var pageContent = function (data) {
			console.log(data);
        // HEADER
        doc.setFontSize(16);
        doc.setTextColor(40);
        doc.setFontStyle('Bold');

        doc.text(userProfile + " Report", data.settings.margin.left + 15, 52);

        // FOOTER
        var str = "Page " + doc.page ;
        doc.setFontSize(10);
        // doc.text(150,285, 'page ' + data.pageCount);
        // doc.text('page ' + doc.page);

        // var str = 'page ' + doc.page;
        doc.text( data.settings.margin.left, doc.internal.pageSize.getHeight - 10,str);
         // doc.text( 'page ' + doc.page, 150,285);

     };
     doc.setTextColor(0,0,0);
     doc.autoTable(columns, rows, {
     	theme: 'grid',
     	bodyStyles: {lineWidth: 1,lineColor: [0, 0, 0]},
     	headerStyles: {
     		lineWidth: 1,
     		lineColor: [0, 0, 0],
     		fillColor: [105,105,105]
     	},
     	createdCell: function(columns, rows) {
     		if (columns.text[0] != '') {     
     			columns.styles.fillColor = "#fff";
     		}
     	},
     	// styles: {fillColor: [0,0,0, .5],
 		// whiteBreak:'breakAll',
 		// columnWidth: 'auto' }, 
 		// columnStyles: { loc: { columnWidth: 'auto' ,wordBreak:'breakAll', width:20 }},
 		styles: { fillColor: [211,211,211],overflow: 'linebreak'},
 		columnStyles: { 'loc': { rowHeight: 30, columnWidth : 200} },
 		margin: {top: 60},
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


 ampmForPdf(time){
 	console.log(time);
 	var start_time = time.start_time,end_time = time.end_time, start_time_am_pm = time.start_time_am_pm, end_time_am_pm = time.end_time_am_pm;
 	console.log(start_time,end_time,start_time_am_pm, end_time_am_pm);
 	if(start_time != ''){
 		if(start_time_am_pm == '0'){
 			start_time_am_pm = 'AM';
 		}else{
 			start_time_am_pm = 'PM';
 		}

 		if(end_time_am_pm == '0'){
 			end_time_am_pm = 'AM';
 		}else{
 			end_time_am_pm = 'PM';
 		}
 		var formated = start_time + ' ' + start_time_am_pm + ' - ' + end_time + ' ' + end_time_am_pm;
 		return formated;
 	}else{
 		return "";
 	}

 };


 ngOnInit() {
 	window.scrollTo(0, 0);
 }

 closeModal(){
 	this.modalRef.close();
 };

	//get all security guards list 
	getSecurityGuardsList() {
		var Data = {
			adminId: localStorage.getItem('adminId')
		};

		this.securityService.SecurityGuardsList(Data).subscribe((response) => {
			console.log(response);
			this.securityGuardsList = response.data;
			this.value = this.securityGuardsList[0]._id;
			this.selectUser(this.securityGuardsList[0]._id);
			this.spinnerService.hide();
		});
	};

	//select securtiy guard from list
	selectUser(value){
		console.log(value);
		this.userId = value;
		this.spinnerService.show();
		this.getSecurityGuardProfile();
	};

	//get current shift of selected guard
	getCurrentShift(){		
		var data = {
			userId: this.userId
		};

		this.shiftService.currentShift(data).subscribe((data) => {
			console.log(data);
			this.currentShift = data.data;
			this.spinnerService.hide();	
			this.getUpcomingShifts();		
		});	
	};

	//get security guard profile
	getSecurityGuardProfile(){
		var profileData = {
			userId: this.userId
		};

		this.securityService.SecurityGuardProfile(profileData).subscribe((data) => {
			console.log(data);
			this.profile = data[0];
			this.getCurrentShift();
		});
	}; 


	getUpcomingShifts() {
		this.spinnerService.show();

		var data = {
			userId: this.userId,
			current_date: this.formatted_current_date,
			current_time: this.formatted_current_time

		}
		// UpcomingShiftsList
		this.shiftService.AssignedShiftsList(data).subscribe((data) => {
			console.log(data);
			this.shifts = data.data;
			this.rows =  data.data;
			this.getPastShifts();
			this.spinnerService.hide();
		});
	};

	getPastShifts(){
		this.spinnerService.show();

		var data = {
			userId: this.userId,
			current_date: this.formatted_current_date,
			current_time: this.formatted_current_time
		};

		this.shiftService.AllShifts(data).subscribe((data) => {
			console.log(data);
			this.shiftsPast = data.data;
			this.rows1 =  data.data;
			this.spinnerService.hide();
		});
	};
	viewShift(row, shifts, type){
		console.log(row, shifts, type);
		this.shiftType = type;
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

	private getDismissReason(reason: any): string {
		if (reason === ModalDismissReasons.ESC) {
			return 'by pressing ESC';
		} else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
			return 'by clicking on a backdrop';
		} else {
			return  'with:${reason}';
		}
	};

	change(time){
		if(time >= 12){
			return true;
		}else{
			return false;
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
	// 	if(days[0].start_time != ''){
	// 		var start = days[0].start_time,
	// 		am = days[0].start_time_am_pm == 1 ? ' PM' : ' AM',
	// 		end = days[0].end_time ,
	// 		pm = days[0].end_time_am_pm == 1 ? ' PM' : ' AM';
	// 		return  start  + ' - ' + end; 
	// 	}else{
	// 		var test = this.checkAvailableTime(days, 1);
	// 		return test;
	// 	}   
	// };

	checkAvailableTime(days, index){
		if(days[index].start_time != ''){
			var start = days[index].start_time,
			am = days[index].start_time_am_pm == 1 ? ' PM' : ' AM',
			end = days[index].end_time ,
			pm = days[index].end_time_am_pm == 1 ? ' PM' : ' AM';
			return  start  + ' - ' + end ; 
		}else{
			var indexValue = index + 1;
			this.checkAvailableTime(days, indexValue);
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
}


}
