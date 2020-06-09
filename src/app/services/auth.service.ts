import { Injectable } from '@angular/core';
import { SharedService } from './shared.service';
import { HTTP } from '@ionic-native/http/ngx';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { AlertService } from './alert.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isLoggedIn = false;
  token:string;

  constructor(
    private sharedService: SharedService,
    private http: HTTP,
    private storage: NativeStorage,
    private alertService: AlertService
  ) { }

  /**
   * Login Asyncrono y con return
   */
  async loginAsync(email: string, password: string):Promise<any>{
    return new Promise( (resolve) => {

      this.http.post(
        this.sharedService.API_URL_BASE + "auth/login", //URL
        {email: email, password: password},             //Data
        {}                                              //Headers (token)
      ).then(response => {
        console.log(response);
        this.isLoggedIn = true;

        try {
          response.data = JSON.parse(response.data); //parsing data

          console.log(response.data.message);
          this.token = response.data.access_token;
          console.log("token: ", this.token);
          this.storage.setItem('token', this.token)
        } catch(e) {
          console.error('JSON parsing error');
        }
        this.alertService.presentToast("Logeado");
        resolve(this.token);
      }).catch(response =>{
        // prints 403
        console.log(response.status);
  
        // prints Permission denied
        console.log(response.error);
        
        if (response.status == 401) {
          this.alertService.presentToast("Credenciales invalidas");
        } else {
          this.alertService.presentToast(response.error);
        }        
        resolve(response);
      });

    });
  }
 
  /**
   * Login Normal
   */
  login(email: String, password: String){
    console.log("Login");
    this.http.post(
      this.sharedService.API_URL_BASE + "auth/login", //URL
      {email: email, password: password},             //Data
      {}                                              //Headers (token)
    ).then(response => {
        /*Guarda Token */
        this.token = response.data.access_token;
        console.log("token: ", this.token);
        this.storage.setItem('token', this.token)
        
        // prints 200
        console.log(response);
        this.isLoggedIn = true;
        // try {
        //   response.data = JSON.parse(response.data);
        //   // prints test
        //   console.log(response.data.message);
        // } catch(e) {
        //   console.error('JSON parsing error');
        // }
      // return this.token;
    }).catch(response =>{
      // prints 403
      console.log(response.status);

      // prints Permission denied
      console.log(response.error);
      
    });
  }

  logout(){
    console.log("Deslogeando ... ");
    this.storage.remove("token");
    this.token = null;
    this.isLoggedIn = false;
  }

  /**
   * Devuelve token de la memoria local
   */
  getToken() {
    return this.storage.getItem('token').then(
      data => {
        this.token = data;
        if(this.token != null) {
          this.isLoggedIn=true;
        } else {
          this.isLoggedIn=false;
        }
      },
      error => {
        this.token = null;
        this.isLoggedIn=false;
      }
    );
  }

}
