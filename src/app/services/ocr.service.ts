import { Injectable } from '@angular/core';
import { OCR, OCRSourceType, OCRResult } from '@ionic-native/ocr/ngx';

@Injectable({
  providedIn: 'root'
})
export class OcrService {

  constructor(private ocr: OCR) { }

  async testOCR(base: string):Promise<any>{
    console.log("en OCR test");
    
    return new Promise( (resolve) => {
      // this.ocr.recText(OCRSourceType.NORMFILEURL, "./../assets/www/assets/patemte4.png")
      // this.ocr.recText(OCRSourceType.NORMFILEURL, "src://assets/www/assets/patente1.jpg")
      // this.ocr.recText(OCRSourceType.BASE64, '') //funcionando
      this.ocr.recText(OCRSourceType.BASE64, base)
            .then(
              (res: OCRResult) => {
                
                // console.log(JSON.stringify(res))
                resolve(res.blocks.blocktext)
              }
            )
            .catch((error: any) => console.error(JSON.stringify(error)));
    })
  }

}
