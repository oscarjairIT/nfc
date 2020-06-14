import { Injectable } from '@angular/core';
import { OCR, OCRSourceType, OCRResult } from '@ionic-native/ocr/ngx';

@Injectable({
  providedIn: 'root'
})
export class OcrService {

  filteredBase: string[] = [];

  constructor(private ocr: OCR) { }

  /**
   * Retorna array de strings con texto obtenido del string base64
   */
  async getOCR(base: string):Promise<any>{
    return new Promise( (resolve) => {
      this.ocr.recText(OCRSourceType.BASE64, base)
            .then(
              (res: OCRResult) => {
                // console.log(JSON.stringify(res))
                console.log("encontrdo en OCR: ",res.blocks.blocktext);                
                resolve(res.blocks.blocktext)
              }
            )
            .catch((error: any) => console.error(JSON.stringify(error)));
    })
  }

  async filterOcrString(base: string[]):Promise<any>{
    this.filteredBase = [];
    return new Promise( (resolve) => {

      base.forEach(element => {
        console.log("elemento bruto: ", element);
        
        // Quita caracteres especiales
        const basura = /[-+()\s]/g;
        let simple = element.replace(basura, '')
        console.log("elemento sin basura: ", simple);

        // Quita minusculas
        const minusculas = /[a-z]/g;
        let mayus = simple.replace(minusculas, '');
        console.log("elemento sin minusculas: ", mayus);
        
        
        // Quitar espacios
        let sinEspacios = mayus.trim();
        console.log("elemento sin espacios: ", sinEspacios);

        this.filteredBase.push(sinEspacios);
      });

      // verifica que string sea largo adecuado
      // verifica que string no sea la plabra chile
      // verifica que string contenga un numero
      this.filteredBase.forEach(element => {
        if (element.length == 6 && element != "CHILE" && (element.match(/\d+/)[0] != null)){
          this.filteredBase = [];
          this.filteredBase.push(element);
        }
      });

      if (this.filteredBase.length > 1 || this.filteredBase[0].length < 6 ) {
        this.filteredBase = ["ERROR"];
      }

      console.log('array base64 filtrado', this.filteredBase);
      resolve(this.filteredBase);
    });
  }

}
