import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs';
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

}
