import { Component, OnInit } from '@angular/core';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ShiftService } from '../services/shiftService';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

declare var google: any;

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {

  	row: any = [];
	rows: any = [];
	temp: any = [];
	viewShiftData: any;
	locs: any = [];
	modalRef: any;
	closeResult: any;
	modalRef1: any;
	closeResult1: any; 
	latitude: any;
	currentDate: any;
	dateArray: any;
	longitude: any;
	stopDate; any;
	daysarray: any;
	Data: any;
	date1: any;
	date2: any;
	disconnectArray: any = [];
	temp1: any;
  	constructor(private shiftService: ShiftService, private spinnerService: Ng4LoadingSpinnerService, public modalService:NgbModal) {
  		this.getCurrentshiftsList();
  	} 

  	ngOnInit() {
  	}

   	getAmPmTime(days){
	    for(var i = 0; i < days.length; i++){
	      if(days[i].start_time != 0){
	        var time =  days[i].start_time  + ' - ' + days[i].end_time;  
	        return  time ; 
	        break;
	      }
	    }
  	};

  	getTimeAMPM(start_time){
    	if(start_time != null){
	      	var start, am ;
	      	var start_time1 = start_time.split(':');
	      	start_time = start_time1[0];
	      	start = Number(start_time)
	      	return start  + ':' + start_time1[1];
    	}
  	};

  	//get all security guards list 
    getCurrentshiftsList() {
      	this.spinnerService.show();
      	var Data = {
        	adminId: localStorage.getItem('adminId')
 	 	};

      	this.shiftService.AllShiftsExceptCurrent(Data).subscribe((response) => {
        	console.log(response);
        	this.rows = response.data;
         	this.temp = response.data;
        	this.spinnerService.hide();
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

  	getDates(startDate, stopDate, endDate, sParseDate, cParseDate) {
	    // console.log(startDate, stopDate);
	    // var dateArray = [],currentDate12,tempMonth,tempDate ;
	    // this.currentDate = new Date(startDate);
	    // this.stopDate = new Date(stopDate);
	    // // this.currentDate= this.currentDate.setDate( this.currentDate.getDate()-1);
	    // this.currentDate = new Date(this.currentDate);
	    // while (this.currentDate <= this.stopDate) {
	    // 	tempMonth  = Number(this.currentDate.getMonth()) + 1;
	    // 	if(tempMonth < 10){
	    // 		tempMonth = '0' + tempMonth;
	    // 	}
	    // 	tempDate = this.currentDate.getDate();
	    // 	if(tempDate < 10){
	    // 		tempDate = '0' + tempDate;
	    // 	}
	    // 	currentDate12 = this.currentDate.getFullYear() + '-' + tempMonth + '-' + tempDate;
	    //   	dateArray.push( currentDate12 )
	    //   	console.log(dateArray)
	    //   	this.currentDate = this.currentDate.setDate(this.currentDate.getDate()+1);
	    //   	this.currentDate= new Date(this.currentDate);
	    //   	console.log(this.currentDate)
	    // }
	    // return dateArray;  
	    this.date1 = new Date(startDate);
	    if(sParseDate < cParseDate){
	    	this.date2 = new Date(endDate);
	    }else{
	        this.date2 = new Date(stopDate);
	    }

	    // get total seconds between two dates
        let res = Math.abs(this.date1 - this.date2) / 1000;
        let days = Math.floor(res / 86400);
       	console.log('days'+ days)
        
  	};


  getLocations(item, viewShift){
  	var map, Data, polygon, data, myLatlng, splitDate;
  	console.log(item, this.locs);
  	this.modalRef = this.modalService.open(viewShift);
	this.modalRef.result.then((result) => {
	this.closeResult = `Closed with: ${result}`;
	}, (reason) => {
	this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
	});
	// var temp  = new Date(item);
	// var currentDateItem = temp.getDate() + '-' + temp.getMonth() + 1 + '-' + temp.getFullYear();

	for(var i = 0; i < this.locs.length; i++){

		splitDate = this.locs[i].createdAt.split('T');
		console.log(item, splitDate)
		if(item == splitDate[0]){

			map = new google.maps.Map(document.getElementById('dvMap'), {
			    	zoom: 2,
			    	center: {lat: this.viewShiftData.location.address.latitude, lng: this.viewShiftData.location.address.longitude},
			    	mapTypeId: google.maps.MapTypeId.ROADMAP
				});

			polygon =  new google.maps.Circle({
				      	strokeColor: '#FF0000',
				      	strokeOpacity: 0.8,
				      	strokeWeight: 10,
				      	fillColor: '#FF0000',
				      	fillOpacity: 0.35,
				      	map: map,
				      	center: {lat: this.viewShiftData.location.address.latitude, lng: this.viewShiftData.location.address.longitude},
	      				radius: Number(this.viewShiftData.location.geofence)
					});
	        	
		    var infoWindow = new google.maps.InfoWindow();
		    var lat_lng = new Array();
		    var latlngbounds = new google.maps.LatLngBounds();

	    	for (i = 0; i < this.locs.length; i++) {
				data = this.locs[i]
				myLatlng = new google.maps.LatLng(data.lat, data.lng);
				lat_lng.push(myLatlng);
				if(i== 0 || i == (this.locs.length-1)){
					var marker = new google.maps.Marker({
				        position: myLatlng,
				        map: map,
				        title: 'ABC'
				    });
				    latlngbounds.extend(marker.position);
				    (function (marker, data) {
				        google.maps.event.addListener(marker, "click", function (e) {
				            infoWindow.setContent(data.description);
				            infoWindow.open(map, marker);
				        });
				    })(marker, data);
				}
		           
	    	}
	        map.setCenter(latlngbounds.getCenter());
	        map.fitBounds(latlngbounds);
		 
		        //***********ROUTING****************//
	 
	        //Initialize the Path Array
	        var path = new google.maps.MVCArray();
	 
	        //Initialize the Direction Service
	        var service = new google.maps.DirectionsService();
	 
	        //Set the Path Stroke Color
	        var poly = new google.maps.Polyline({ map: map, strokeColor: 'blue' });
	 
	        //Loop and Draw Path Route between the Points on MAP
	        for (var i = 0; i < lat_lng.length; i++) {
	            if ((i + 1) < lat_lng.length) {
	                var src = lat_lng[i];
	                var des = lat_lng[i + 1];
	                path.push(src);
	                poly.setPath(path);
	                service.route({
	                    origin: src,
	                    destination: des,
	                    travelMode: 'WALKING'
	                }, function (result, status) {
	                    if (status == google.maps.DirectionsStatus.OK) {
	                        for (var i = 0, len = result.routes[0].overview_path.length; i < len; i++) {
	                            path.push(result.routes[0].overview_path[i]);
	                        };
	                    };
	                });
	            };
	        };

		}
	}

  }

  	ViewShiftdetail(row, shifts){
  		var map, Data, polygon, data, myLatlng;
      	this.spinnerService.show();
      	this.viewShiftData = row;
      	this.spinnerService.show();
      	this.Data = {
        	shiftId: row._id,
        	userId: row.userInfo._id
 	 	};

      	this.shiftService.listLocationsBasedOnShift(this.Data).subscribe((response) => {
        	console.log(response);
        	this.locs = response.data;

		 	if(row.type == '1'){
        		console.log(row.start_date, row.end_date);
        		var temp = new Date();
        		this.temp = temp.getMonth() + 1;
        		if(this.temp < 10){
        			this.temp = '0' + this.temp.toString();  
        		};
        		this.temp1 = temp.getDate();
        		if(this.temp1 < 10){
        			this.temp1 = '0' + this.temp1.toString();
        		}

        		console.log(row)
        		let shiftend_date = Date.parse(row.end_date),
        			currentDate = Date.parse(temp.getFullYear() + '-' + this.temp + '-' + this.temp1);

        		this.daysarray = this.getDates(row.start_date, temp.getFullYear() + '-' + this.temp + '-' + this.temp1, row.end_date, shiftend_date, currentDate);
        		console.log(this.daysarray)

    			this.modalRef1 = this.modalService.open(shifts);
		      	this.modalRef1.result.then((result) => {
		    		this.closeResult1 = `Closed with: ${result}`;
		  		}, (reason) => {
		    		this.closeResult1 = `Dismissed ${this.getDismissReason(reason)}`;
			 	});

        		// for(var i = 0; i <= response.data.length; i++){
        		// 	// if(response.data[i])
        		// }	
        	}else{

        		this.modalRef = this.modalService.open(shifts);
		      	this.modalRef.result.then((result) => {
		    		this.closeResult = `Closed with: ${result}`;
		  		}, (reason) => {
		    		this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
			 	});



				map = new google.maps.Map(document.getElementById('dvMap'), {
				    zoom: 3,
				    center: {lat: row.location.address.latitude, lng: row.location.address.longitude},
				    mapTypeId: google.maps.MapTypeId.ROADMAP
				  });

				polygon =  new google.maps.Circle({
			      	strokeColor: '#FF0000',
			      	strokeOpacity: 0.8,
			      	strokeWeight: 10,
			      	fillColor: '#FF0000',
			      	fillOpacity: 0.35,
			      	map: map,
			      	center: {lat: row.location.address.latitude, lng: row.location.address.longitude},
			      	radius: Number(row.location.geofence)
				});
        	
	        	var infoWindow = new google.maps.InfoWindow();
	        	var lat_lng = new Array();
	        	var latlngbounds = new google.maps.LatLngBounds();
	        	for (i = 0; i < this.locs.length; i++) {
	           	 	data = this.locs[i]
	            	myLatlng = new google.maps.LatLng(data.lat, data.lng);
	            	lat_lng.push(myLatlng);

	            	if(i == 0 || i == (this.locs.length-1)){
	            		console.log(this.locs[i])
		            	var marker = new google.maps.Marker({
			                position: myLatlng,
			                map: map,
			                title: 'ABC'
			            });
			            latlngbounds.extend(marker.position);
			            (function (marker, data) {
			                google.maps.event.addListener(marker, "click", function (e) {
			                    infoWindow.setContent(data.description);
			                    infoWindow.open(map, marker);
			                });
			            })(marker, data);
	            	}else{
	            		// var time1 = this.locs[i-1].createdAt.toLocaleTimeString(),
	            		// 	time2 = this.locs[i].createdAt.toLocaleTimeString();
	            		//var d = this.locs[i].createdAt;
						var startDate = new Date(this.locs[i-1].createdAt);
						// Do your operations
						var endDate   = new Date(this.locs[i].createdAt);
						var seconds = (endDate.getTime() - startDate.getTime()) / 1000;

	            		console.log('seconds' + seconds)
	            		// console.log('time2' + time2)
	            		if(seconds > 11 && this.disconnectArray.indexOf(this.locs[i].createdAt) == -1){
	            			this.disconnectArray.push(this.locs[i].createdAt);
	            		}
	            	}
	           
	       	 	}
		        map.setCenter(latlngbounds.getCenter());
		        map.fitBounds(latlngbounds);
	 
		        //***********ROUTING****************//
		 
		        //Initialize the Path Array
		        var path = new google.maps.MVCArray();
		 
		        //Initialize the Direction Service
		        var service = new google.maps.DirectionsService();
		 
		        //Set the Path Stroke Color
		        var poly = new google.maps.Polyline({ map: map, strokeColor: 'blue' });
		 
		        //Loop and Draw Path Route between the Points on MAP
	        	for (var i = 0; i < lat_lng.length; i++) {
		            if ((i + 1) < lat_lng.length) {
		                var src = lat_lng[i];
		                var des = lat_lng[i + 1];
		                path.push(src);
		                poly.setPath(path);
		                service.route({
		                    origin: src,
		                    destination: des,
		                    travelMode: 'WALKING'
		                }, function (result, status) {
		                    if (status == google.maps.DirectionsStatus.OK) {
		                        for (var i = 0, len = result.routes[0].overview_path.length; i < len; i++) {
		                            path.push(result.routes[0].overview_path[i]);
		                        };
		                    };
		                });
		            }
	        	}
	    	}

        	this.spinnerService.hide();
        	this.latitude = row.location.address.latitude;
	      	this.longitude = row.location.address.longitude;
	      	this.spinnerService.hide();
	      	
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

     closeModal1(){
      	this.modalRef.close();
    };


}
