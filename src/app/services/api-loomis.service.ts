import { Injectable } from '@angular/core';
import { Persona } from '../models/persona';
import { Tripulacion, PersonalParaEnvio } from '../models/tripulacion';
import { HTTP } from '@ionic-native/http/ngx';
import { SharedService } from './shared.service';
import { DataLocalService } from './data-local.service';
import { AlertService } from './alert.service';


@Injectable({
  providedIn: 'root'
})
export class ApiLoomisService {

  /**
   * Variables para tests
   */
  // personasIniciales: Persona[] = [
  //   {id_persona: 1, nfc: '1055673523' ,nombre_persona: 'Juana', apellido_persona: 'Perez', imagen: 'https://previews.123rf.com/images/dolgachov/dolgachov1604/dolgachov160401829/54866409-personas-el-cuidado-de-la-salud-de-la-vista-de-negocios-y-concepto-de-la-educaci%C3%B3n-la-cara-de-mujer-jov.jpg'},
  //   {id_persona:2, nfc: '36087068492830460' ,nombre_persona:'Jose',apellido_persona:'Diaz',imagen:"https://www.capacitacionadministrativa.com/wp-content/uploads/2018/05/testimonio3.jpg"}
  // ]

  constructor(
    private sharedService: SharedService,
    private http: HTTP,
    private dataLocalService: DataLocalService,
    private alertService: AlertService
  ) { }

  /**
   * GET: https://api.loomischile.cl/tripulantes/personal/
   * Carga de todo el personal
   * Parametros de respuesta negativa:
   * { respuesta:'no' }
   * 
   * Devuelve arreglo de objetos persona
   */
  async getPersonal():Promise<any>{
    return new Promise( (resolve) => {
      this.http.setServerTrustMode("nocheck");
      this.http.setDataSerializer("raw");
      this.http.setRequestTimeout(5);
      this.http.get(
        "https://api.loomischile.cl/api/tripulantes/personal/",
        {},
        {}
      ).then(
        resp => {
          console.log(resp);
          let respParsed = JSON.parse(resp.data);
          // console.log("data parseada: ", respParsed);
          // console.log(respParsed);
          if(respParsed == true){
            this.alertService.presentToast("Carga Correcta de Persona");
          }
          resolve(respParsed);
        },
        err => {
          // this.alertService.presentToast("Error al Cargar el Personal, inicia nuevamente")
          console.log("eror al cargar: ",err);  
          console.log("Error al cargar el personal");
          
        }
      ).catch(
        reason=>{
          console.log("Razon: ",reason);
          
        }
      )
    });
  }

  /**
   * GET: https://api.loomischile.cl/tripulantes/inicio/
   * Panel para accesar al software
   * Parametros de respuesta negativa:
   * { respuesta:'no' }
   * 
   * Informa si usuario esta autorizado o no
   */
  async login(user: string, key: string):Promise<any>{
    console.log("a enviar: ", user + " "+ key);
    
    return new Promise( (resolve) => {
      this.http.setServerTrustMode("nocheck");
      this.http.setRequestTimeout(3);
      this.http.setDataSerializer('json');
      this.http.post(
        this.sharedService.API_LOOMIS + "inicio/",
        {usuario: user, clave: key},
        {}
      ).then(
        resp => {
          console.log(resp);
          let respParsed = JSON.parse(resp.data);
          console.log(respParsed.respuesta);
          resolve(respParsed.respuesta);
        },
        err => {
          console.log(err);  
          this.alertService.presentToast("Error al intentar logear");
        }
      );
    });
  }

  /**
   * POST: https://api.loomischile.cl/tripulantes/vehiculo/
   * registro de tripulación
   *  Parametros de respuesta positiva:
   *   { respuesta:'ok' }
   *
   *   Parametros de respuesta negativa:
   *  { respuesta:'no' }
   * 
   * Informa si usuario esta autorizado o no
   */
  async sendTripulacion(patente: string, tripulacion: PersonalParaEnvio[]):Promise<any>{
    let tiempo1 = new Date();
    
    console.log("*****a enviar: ",{patente: patente, tripulacion: tripulacion});
    
    return new Promise( (resolve) => {
      // resolve("Enviado a la api");
      this.http.setServerTrustMode("nocheck");
      this.http.setRequestTimeout(5.0); //seconds
      this.http.setDataSerializer('json');
      this.http.post(
        this.sharedService.API_LOOMIS + "vehiculo/",
        {patente: patente, tripulacion: tripulacion},
        {}
      ).then(
        resp => {
          let tiempo2 = new Date();
          let  difference = (tiempo2.getTime() - tiempo1.getTime()) / 1000;
          console.log("Demora: ", difference);
          
          console.log(resp);
          resolve(resp);
        },
        err => {
          this.alertService.presentToast("Error al enviar, Intente nuevamente");
          console.log(err);
        }
      )
    });
  }

}
