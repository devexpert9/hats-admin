import {Http,URLSearchParams} from '@angular/http';
import {Injectable} from '@angular/core';
import 'rxjs/Rx';

@Injectable()
export class LoginService{
  constructor(private http:Http){}

 Login(formdata) {
 return this.http
   .post('loginadmin', formdata)
     .map((data)=>{
           return data.json();
     }, error => {
        return error.json();
     });
}  

 Signup(formdata) {
 return this.http
   .post('adminSignup', formdata)
     .map((data)=>{
           return data.json();
     }, error => {
        return error.json();
     });
}
 ForgotPassword(formdata) {
 return this.http
   .post('adminForgotPassword', formdata)
     .map((data)=>{
           return data.json();
     }, error => {
        return error.json();
     });
}

UploadImage(formdata) {
  return this.http.post('uploadImage', formdata).map((data)=>{
    return data.json();
  }, error => {
    return error.json();
  });
}

addCategory(formdata) {
  return this.http.post('addcategorty', formdata).map((data)=>{
    return data.json();
  }, error => {
    return error.json();
  });
}

IsCategoryExist(formdata) {
  return this.http.post('categortyexist', formdata).map((data)=>{
    return data.json();
  }, error => {
    return error.json();
  });
}

Categories() {
  return this.http.post('categories').map((data)=>{
    return data.json();
  }, error => {
    return error.json();
  });
}

deleteCategory(data) {
  return this.http.post('deletecategory', data).map((data)=>{
    return data.json();
  }, error => {
    return error.json();
  });
}

updateCategory(data){
  return this.http.post('updatecategory', data).map((data)=>{
    return data.json();
  }, error => {
    return error.json();
  });
}

addProduct(formdata) {
  return this.http.post('addproduct', formdata).map((data)=>{
    return data.json();
  }, error => {
    return error.json();
  });
}

IsProductExist(formdata) {
  return this.http.post('isproductexist', formdata).map((data)=>{
    return data.json();
  }, error => {
    return error.json();
  });
}

Products() {
  return this.http.post('productslist').map((data)=>{
    return data.json();
  }, error => {
    return error.json();
  });
}

deleteProduct(data) {
  return this.http.post('deletecategory', data).map((data)=>{
    return data.json();
  }, error => {
    return error.json();
  });
}

updateProduct(data){
  return this.http.post('updatecategory', data).map((data)=>{
    return data.json();
  }, error => {
    return error.json();
  });
}

 UpdateProfile(formdata, id) {
 return this.http
   .post('updateAdminProfile/'+ id, formdata)
     .map((data)=>{
           return data.json();
     }, error => {
        return error.json();
     });
}

GetProfile(profileData) {
 return this.http
   .post('getAdminProfile', profileData)
     .map((data)=>{
           return data.json();
     }, error => {
        return error.json();
     });
}

 UpdatePassword(formdata) {
 return this.http
   .post('updateAdminPassword', formdata)
     .map((data)=>{
           return data.json();
     }, error => {
        return error.json();
     });
}


  addPushSubscriber(sub) {
    return this.http
     .post('notifications', sub)
       .map((data)=>{
             return data.json();
       }, error => {
          return error.json();
    });
  }
}; 