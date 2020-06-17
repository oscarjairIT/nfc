import { Injectable } from '@angular/core';
import { Persona } from '../models/persona';
import { Tripulacion, PersonalParaEnvio } from '../models/tripulacion';
import { HTTP } from '@ionic-native/http/ngx';
import { SharedService } from './shared.service';
import { DataLocalService } from './data-local.service';

@Injectable({
  providedIn: 'root'
})
export class ApiLoomisService {

  /**
   * Variables para tests
   */
  personasIniciales: Persona[] = [
    {id_persona: 1, nfc: 'b34cec3e' ,nombre_persona: 'Juana', apellido_persona: 'Perez', imagen: 'https://previews.123rf.com/images/dolgachov/dolgachov1604/dolgachov160401829/54866409-personas-el-cuidado-de-la-salud-de-la-vista-de-negocios-y-concepto-de-la-educaci%C3%B3n-la-cara-de-mujer-jov.jpg'},
    {id_persona:2, nfc: '04178062ff3480' ,nombre_persona:'Jose',apellido_persona:'Diaz',imagen:"https://www.capacitacionadministrativa.com/wp-content/uploads/2018/05/testimonio3.jpg"}
  ]

  constructor(
    private sharedService: SharedService,
    private http: HTTP,
    private dataLocalService: DataLocalService
  ) { }

  // SIN PROBAR
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
      this.dataLocalService.savePersonalInicial(this.personasIniciales).then(
        resp =>{
          resolve(resp);
        },
        err =>{
          console.log(err);  
        }
      );
      // this.http.get(
      //   this.sharedService.API_LOOMIS + "tripulantes/personal/",
      //   {},
      //   {}
      // ).then(
      //   resp => {
      //     console.log(resp);
      //     resolve(resp);
      //   },
      //   err => {
      //     console.log(err);  
      //   }
      // )
    });
  }

  // SIN PROBAR
  /**
   * GET: https://api.loomischile.cl/tripulantes/inicio/
   * Panel para accesar al software
   * Parametros de respuesta negativa:
   * { respuesta:'no' }
   * 
   * Informa si usuario esta autorizado o no
   */
  async login(user: string, key: string):Promise<any>{
    return new Promise( (resolve) => {
      this.http.get(
        this.sharedService.API_LOOMIS + "tripulantes/inicio/",
        {usuario: user, clave: key},
        {}
      ).then(
        resp => {
          console.log(resp);
          resolve(resp);
        },
        err => {
          console.log(err);  
        }
      );
    });
  }

  // SIN PROBAR
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
  async sendTripulacion(tripulacion: Tripulacion):Promise<any>{
    return new Promise( (resolve) => {
      resolve("Enviado a la api");
      // this.http.post(
      //   this.sharedService.API_LOOMIS + "tripulantes/vehiculo/",
      //   {patente: tripulacion.patente, tripulacion: tripulacion.tripulacion},
      //   {}
      // ).then(
      //   resp => {
      //     console.log(resp);
      //     resolve(resp);
      //   },
      //   err => {
      //     console.log(err);
      //   }
      // )
    });
  }

}
