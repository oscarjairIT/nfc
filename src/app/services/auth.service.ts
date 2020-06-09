import { Injectable } from '@angular/core';
import { SharedService } from './shared.service';
import { HTTP } from '@ionic-native/http/ngx';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isLoggedIn = false;
  token:any;

  constructor(
    private sharedService: SharedService,
    private http: HTTP
  ) { }

  
  login(email: String, password: String){
    console.log("Login");
    this.http.post(
      this.sharedService.API_URL_BASE + "auth/login", //URL
      {email: email, password: password},             //Data
      {}                                              //Headers (token)
    ).then(response => {
        // prints 200
        console.log(response);
        try {
          response.data = JSON.parse(response.data);
          // prints test
          console.log(response.data.message);
        } catch(e) {
          console.error('JSON parsing error');
        }
      
    }).catch(response =>{
      // prints 403
      console.log(response.status);

      // prints Permission denied
      console.log(response.error);
      
    });
  }

}
