import { Injectable } from '@angular/core';
import { SharedService } from './shared.service';
import { HTTP } from '@ionic-native/http/ngx';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { AlertService } from './alert.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ViajeService {

  token: any;

  constructor(
    private sharedService: SharedService,
    private http: HTTP,
    private storage: NativeStorage,
    private alertService: AlertService,
    private authService: AuthService
  ) { 
    // this.storage.getItem('token').then(
    //   data => {
    //     console.log("getToken in ViajeService: ", data);
    //     this.token = data;
    //   },
    //   error => {
    //     this.token = null;
    //   }
    // );
  }

  // patente: fdsdasdsa,
  // nfc: [3123213 , 3123123213, 3213123123]
  // async sendViajeAsync(patente: string, codigos: any):Promise<any>{

  // }

  sendViajeSimple(vechiculo_id:number, nfc: string){
    const token = this.authService.getToken();
    console.log("token: ", token);
    
    console.log("sendViajeSimple ...");
    this.http.post(
      this.sharedService.API_URL_BASE + "tarjetas",
      {vehiculos_id: vechiculo_id, nfc: nfc},
      {"Authorization": token}
    ).then(response => {
      console.log(response);
      try {
        response.data = JSON.parse(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('JSON parsing error');
      }
    }).catch(response => {
      console.log(response);
    });
  }

  /**
   * Retorna el id del vehiculo cuya patente se ingrese
   */
  async getVehiculoIDByPatente(patente: string):Promise<any>{


    return new Promise( (resolve) => {
      // const token = this.authService.getToken();
      // console.log("token: ", token);

      this.http.get(
        this.sharedService.API_URL_BASE + "vehiculosByPatente",
        {patente: patente},
        {"Authorization": this.token}
      ).then(response => {
        console.log(response);
        try {
          response.data = JSON.parse(response.data);

          console.log(response.data);
          
        } catch (error) {
          console.error('JSON parsing error');
        }
        resolve(response.data)
      }).catch(response => {
        console.log(response.status);
        console.log(response.error);
        resolve(response);
      });
    });
  }

  async createVehiculo(patente: string):Promise<any>{
    // let token;
    // this.authService.getToken().then(
    //   resp => {
    //     console.log("obteniendo token from createVehiculo");
        
    //     token = resp;
    //   }
    // )
    // console.log("token: ", token);

    return new Promise( (resolve) => {


      this.http.post(
        this.sharedService.API_URL_BASE + "vehiculos",
        // {vehiculos :{patente: patente}},
        {'patente': patente},
        {"Content-Type": "application/json"}
      ).then(response => {
        // console.log(response);
        try {
          response.data = JSON.parse(response.data);

          console.log(response.data);
          
        } catch (error) {
          console.error('JSON parsing error');
        }
        resolve(response.data)
      }).catch(response => {
        console.log(response.status);
        console.log(response.error);
        resolve(response);
      })
    });
  }

}
