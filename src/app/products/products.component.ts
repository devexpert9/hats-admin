import { Component, OnInit } from '@angular/core';
import { SecurityService } from '../services/securityService';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoginService } from '../services/loginService';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ToastrService } from 'ngx-toastr';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { ShiftService } from '../services/shiftService';
import { Router } from '@angular/router';


declare var $: any;


const uploadFormData = new FormData();

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  rows: any;
  imageURL: any;
  authForm: FormGroup;
  authForm1: FormGroup;
  selectedCat: any;
  selectedFileProfile: any;
  modalRef: any;
  closeResult: any;
  profile: any;
  modalRef1: any;
  closeResult1: any;
  status: any;
  error: any;
  errorReg: any;
  previewProfile: any = false;
  Image: any = '';
  totalCount: any = 0;
  filesExtension: any;
  cat: any;
  categories: any = [];
  constructor(public securityService: SecurityService,public fb: FormBuilder, public loginService: LoginService,private spinnerService: Ng4LoadingSpinnerService,private toastr: ToastrService,private modalService: NgbModal, public shiftService: ShiftService, public router: Router) {
    
    if(localStorage.getItem('adminId') == undefined || localStorage.getItem('adminId') == '' || localStorage.getItem('adminId') == null){
      this.router.navigateByUrl('/');
    }

    this.getProductsList();
    this.createForm();
    this.imageURL = 'http://54.162.48.204:3000/images/';
  }

  ngOnInit() {
    window.scrollTo(0, 0);
  }

  createForm(){
    this.authForm = this.fb.group({
      name: ['', Validators.compose([Validators.required])],
      image: ['', Validators.compose([Validators.required])],
      tags: [''],
      link: ['', Validators.compose([Validators.required])],
      s: [''],
      m: [''],
      l: [''],
      xl: [''],
      xxl:[''],
      status: [1],
      categoryId: ['', Validators.compose([Validators.required])]
    });
  };

  formValid(){
    if(this.authForm.valid && this.Image != ''){
      return false;
    }else{
      return true;
    }
  };

  formValid1(){
    if(this.authForm1.valid){
      return false;
    }else{
      return true;
    }
  };

  getProductsList() {
    console.log('products listing')
    this.spinnerService.show();
    this.loginService.Categories().subscribe((response) => {
      console.log(response)
      this.categories = response.data;
      this.loginService.Products().subscribe((response) => {
        this.rows = response.data;
        this.temp = response.data;
        this.spinnerService.hide();
      });
    })
  };


  addProduct(addcat){
    this.modalRef = this.modalService.open(addcat);
    this.modalRef.result.then((result) => {
      //  console.log(result);
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      // console.log(reason);
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });  
  }

  onImageChanged(event,string) {

    var reader = new FileReader();
    this.Image = event.target.files[0];
    this.selectedFileProfile = event.target.files[0];
    this.totalCount = this.totalCount + 1;
    var extn = event.target.value.split('.')[1];
    this.filesExtension = extn;
    if(extn =='jpg' || extn =='png' || extn =='jpeg'){
      reader.onload = () => {
        this.Image = reader.result;
      };
      reader.readAsDataURL(event.target.files[0]);               
    }else if(extn == 'pdf'){
       this.Image = event.target.files[0].name;
    }

    this.authForm.patchValue({image : this.Image});
  };

  closeModal(){
    this.modalRef.close();
  };

  uploadImage(){
    this.spinnerService.show();
    this.loginService.IsProductExist(this.authForm.value).subscribe((response) => {
      if(response.status == 1){
        var payload = new FormData();
        payload.append('image', this.selectedFileProfile, this.selectedFileProfile.name);
        this.loginService.UploadImage(payload).subscribe((response) => {
          console.log(response);
          this.authForm.value.image = response;
          console.log(this.authForm.value);
          this.loginService.addProduct(this.authForm.value).subscribe((response) => {
            if(response.status == 1){
              this.toastr.success(response.msg);
              this.closeModal();
              this.getProductsList();
            }else{
              this.toastr.error(response.msg);
            }
            this.spinnerService.hide();
          })
        });
      }else{
        this.spinnerService.hide();
        this.toastr.error(response.msg);
      }
    });
  };

  updateImage(){
    if(this.Image != ''){
      this.spinnerService.show();
      let dict = {
        _id: this.selectedCat._id,
        name: this.authForm1.value.name
      };
      this.loginService.IsProductExist(dict).subscribe((response) => {
        if(response.status == 1){
          var payload = new FormData();
          payload.append('image', this.selectedFileProfile, this.selectedFileProfile.name);
          this.loginService.UploadImage(payload).subscribe((response) => {
            this.authForm1.value.image = response;
            this.updateCat(true);
          });
        }else{
          this.spinnerService.hide();
          this.toastr.error(response.msg);
        }
      });
    }else{
      this.updateCat(false);
    }
  };

  updateCat(arg){
    let dict = {};
    if(arg){
      dict = {
        _id: this.selectedCat._id,
        oldImage: this.selectedCat.image,
        image: this.authForm1.value.image,
        name: this.authForm1.value.name,
        status: this.selectedCat.status,
         viewedCount: this.selectedCat.viewedCount
      };
    }else{
      dict = {
        _id: this.selectedCat._id,
        oldImage: false,
        image: this.authForm1.value.image,
        name: this.authForm1.value.name,
        status: this.selectedCat.status,
         viewedCount: this.selectedCat.viewedCount
      };
    }

    this.loginService.updateCategory(dict).subscribe((response) => {
      if(response.status == 1){
        this.toastr.success(response.msg);
        this.closeModal();
        this.getCategoriesList();
      }else{
        this.toastr.error(response.msg);
      }
      this.spinnerService.hide();
    })
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  'with:${reason}';
    }
  };

  getIndex(day, days){
    for(var i=0; i < days.length; i++){
      if(days[i].day == day){
        return i;
      }
    }
  };

  deletePopUpCategory(row){
    this.cat = row;
  }

  deleteCategory(){
    this.spinnerService.show();
    let dict = {
      _id: this.cat._id,
      image: this.cat.image
    };

    this.loginService.deleteCategory(dict).subscribe((response) => {
 
      this.spinnerService.hide();
      this.getCategoriesList();  
      this.toastr.success(response.msg);
    }); 
  };

  EditCategory(doc, index, modal){
    this.selectedCat = doc;
    this.authForm1 = this.fb.group({
      name: [doc.name, Validators.compose([Validators.required])],
      image: [doc.image, Validators.compose([Validators.required])],
      status: [doc.status]
    });

    this.Image = '';

    this.modalRef = this.modalService.open(modal);
    this.modalRef.result.then((result) => {
      //  console.log(result);
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      // console.log(reason);
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  };

  changeStatus(row, status){
    this.selectedCat = row;
    this.status = status; 
  };


  changeActiveInctiveStatus(){
    this.spinnerService.show();
    let dict = {
      _id: this.selectedCat._id,
      status: this.status,
      name: this.selectedCat.name,
      image: this.selectedCat.image,
      oldImage: false,
      viewedCount: this.selectedCat.viewedCount
    };

    this.loginService.updateCategory(dict).subscribe((response) => {
      if(response.status == 1){
        this.toastr.success(response.msg);
        //this.closeModal();
        this.getCategoriesList();
      }else{
        this.toastr.error(response.msg);
      }
      this.spinnerService.hide();
    })
  };

  updateFilter(event) {
    const val1 = event.target.value.toLowerCase();
    var temp, tempUn, tempOn;
    if(val1 != ''){
      temp = this.temp.filter(function(d) {
        if(d){
          return d.rapidId.toLowerCase().indexOf(val1) !== -1 || !val1 ;
        }   
      });
    }else{
      temp = this.temp;
    }
    // update the rows
    this.rows = temp;
  };


  onKeydown(event) {
    if (event.key === "Enter") {
      console.log(event);
      return false;
    }else {
      return true;
    }
  };

  onchange(rapidId){
    console.log('sdfdsfds',rapidId);
    var patt = new RegExp('/^[ A-Za-z0-9]$/');
    var res = patt.test(rapidId);
    console.log('res value in onchange', res)
    if(rapidId == ''){
      this.error = true;
      this.errorReg = false;;
    }
  };

  clear(){
    this.rapidId = '';
    this.modalRef.close();
  };

  handlerStartEnd(e){
    this.mindateEnd = e.target.value;
    if(Date.parse(this.authForm.value.licence_exp_date) < Date.parse(e.target.value)){
       this.temp = new Date(e.target.value);
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
       this.authForm.patchValue({
         licence_exp_date: this.temp
       })
    }
  };


}
