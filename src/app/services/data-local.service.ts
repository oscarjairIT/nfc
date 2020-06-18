import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Persona } from '../models/persona';

@Injectable({
  providedIn: 'root'
})
export class DataLocalService {

    // personas: Persona[] = [];
  DB: any[] = [];

  constructor(
    private storage: Storage
  ) { }

  /**
   * TEST
   * 1. Nombre: Carga personal
   *  Descripción: Método para carga de todo el personal
   */
  async savePersonalInicial(personas: Persona[]): Promise<any>{
    return new Promise( (resolve) => {
      this.storage.set('personas', personas).then(
        resp => {
          console.log("guardado: ",resp);
          resolve(resp);
          // this.storage.
        }
      )
    }); 
  }

  /**
   * Imprime/Retorna en consola toda la BD
   */
  async printAllData():Promise<any>{
    return new Promise( (resolve) => {
      this.storage.keys().then(
        keys => {
          keys.forEach(key => {
            this.storage.get(key).then(
              result => {
                console.log("en la BD hay: ",result);
                this.DB.push(result);
              }
            )
          });
          resolve(this.DB);
        }
      );
    });
  }

  /**
   * Setea TRUE el estado de isLogged en storage
   */
  async saveLogin():Promise<any>{
    return new Promise( (resolve) => {
      this.storage.set('isLogged', true).then(
        resp => {
          console.log("respuesta login: ",resp);
          resolve(resp);
        },
        err => {
          console.log(err);  
        }
      )
    });
  }

  /**
   * Devuelve estado de logeo
   */
  async isLogged():Promise<any>{
    return new Promise( (resolve) => {
      this.storage.get('isLogged').then(
        resp => {
          console.log("DatalocalService: ",resp);
          resolve(resp);
        },
        err =>{
          console.log("DatalocalService: ", err);  
        }
      );
    });
  }

}
