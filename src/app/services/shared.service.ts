import { Injectable } from '@angular/core';

/*Agregados*/
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { HTTP } from '@ionic-native/http/ngx';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  api = "http://34.68.226.176:3000/"

  public header: any;
  public host: any;
  public token: any;
  public options: any;

  constructor(private http: HTTP) { 
    // this.token = localStorage.getItem('access_token');
    // this.token = "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxLCJleHAiOjE1OTE2ODU4Mzl9.4fjF9udSyIffawjDFJaImcHEBOl71i2gcoKLML0afFA";
    // this.header = new HttpHeaders({ "method": "get" , "Authorization": this.token });
    // this.options = { headers: this.header, };
  }

  /**
   * /test
   */
  getGet(){
    console.log("servicio sending");
    
    // this.http.get(this.api + "test", {}, this.options)
    this.http.get(this.api + "test", {}, {"Authorization":"eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxLCJleHAiOjE1OTE2OTE3OTB9.W3XuEKwu22OdpWQmrxM7WZvTSgttRQwjrnHzXn1ADdo"})
      .then(data => {

        console.log(data.status);
        console.log(data.data); // data received by server
        console.log(data.headers);

      })
      .catch(error => {

        console.log(error.status);
        console.log(error.error); // error message as string
        console.log(error.headers);

      });
  }
}
