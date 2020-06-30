import { Component, OnInit } from '@angular/core';
import { ShiftService } from '../services/shiftService';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { Router } from '@angular/router';

@Component({
  selector: 'app-remarks',
  templateUrl: './remarks.component.html',
  styleUrls: ['./remarks.component.css']
})
export class RemarksComponent implements OnInit {
	remarks:any;
	rows: any;
	Remarks: any;
  temp: any;

  constructor(private shiftService: ShiftService, private spinnerService: Ng4LoadingSpinnerService,public router: Router) { 
  	 if(localStorage.getItem('adminId') == undefined || localStorage.getItem('adminId') == '' || localStorage.getItem('adminId') == null){
    this.router.navigateByUrl('/');
  };
  this.getRemarksofShifts();
}

  ngOnInit() {
    window.scrollTo(0, 0);
  };

  getRemarksofShifts() {
    this.spinnerService.show();
  var Data = {
    adminId: localStorage.getItem('adminId')
  };

  this.shiftService.GetRemarks(Data).subscribe((response) => {
    console.log(response);
    this.remarks = response.data;
    this.rows = response.data;
    this.temp = response.data;
    this.spinnerService.hide();
  });
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

   getAmPmTime(days){
  if(days[0].start_time != 0){
    var start = days[0].start_time ,
    am = days[0].start_time_am_pm == 1 ? ' PM' : ' AM',
    end = days[0].end_time ,
    pm = days[0].end_time_am_pm == 1 ? ' PM' : ' AM';
    return  start  + ' - ' + end ; 
  }else{
    var test = this.checkAvailableTime(days, 1);
    return test;
  }   
 };

 checkAvailableTime(days, index){
  if(days[index].start_time != 0){
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

    start = Number(start_time);
    end = Number(end_time);


    // return start  + ':' + start_time1[1] + am + ' - ' + end + ':' + end_time1[1] + pm;
    return start  + ':' + start_time1[1] + ' - ' + end + ':' + end_time1[1];
  }   

};


showRemarks(row){
	console.log(row)
	this.Remarks = row;
}

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
}
