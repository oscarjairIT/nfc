import { Injectable } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

@Injectable({
  providedIn: 'root'
})
export class CameraService {

  

  constructor(private camera: Camera) { }

  /**
   * Devuelve string base64 de foto tomada
   * nose donde se guarda aun, pero se puede borrar las fotos de la camara
   */
  async takePicture():Promise<any>{    
    return new Promise( (resolve) => {

      const options: CameraOptions = {
        quality: 100,
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE
      }

      this.camera.getPicture(options).then((imageData) => {
        console.log("CameraOptions: ", options);        
        let base64Image = 'data:image/jpeg;base64,' + imageData;
        resolve(imageData);
        }, (err) => {
        // Handle error
        console.log(err);
        });

    });
  }

}
