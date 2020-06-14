import { Injectable } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

@Injectable({
  providedIn: 'root'
})
export class CameraService {

  

  constructor(private camera: Camera) { }

  async testCamera():Promise<any>{
    console.log("en testCamera");
    
    return new Promise( (resolve) => {

      const options: CameraOptions = {
        quality: 100,
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE
      }

      this.camera.getPicture(options).then((imageData) => {
        // imageData is either a base64 encoded string or a file URI
        // If it's base64 (DATA_URL):
        console.log("options: ", options);
        
        let base64Image = 'data:image/jpeg;base64,' + imageData;
        // console.log("base64: ",imageData);
        resolve(imageData);
        }, (err) => {
        // Handle error
        console.log(err);
        });

    });
  }

}
