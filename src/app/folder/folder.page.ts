import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router, NavigationExtras  } from '@angular/router';
import { ThemeService } from '../services/theme.service';
import { SharedService } from '../services/shared.service';
import { ViajeService } from '../services/viaje.service';
import { DataLocalService } from '../services/data-local.service';
import { Persona } from '../models/persona';
import { AlertService } from '../services/alert.service';
import { NFC } from '@ionic-native/nfc/ngx';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
})
export class FolderPage implements OnInit {
  listaCargada: Persona[] = [
    {id_persona: 1, nfc: "b34cec3e", nombre_persona: "Daniel", apellido_persona: "Ahumada", imagen: "dasd"},
    {id_persona: 1, nfc: "04178062ff3480", nombre_persona: "Ricardo", apellido_persona: "Valenzuela", imagen: "dasd"},
  ];
  listNFCs: Persona[] = [
    {id_persona: 1, nfc: "42vcx42", nombre_persona: "Ismael", apellido_persona: "Oyarzun", imagen: "dasd"}
  ];
  noCoincide = true;
  RFIDDATA1: string;
  RFIDDATA2: string;
  RFIDDATA3: string;
  NFCREAD: any;
  public folder: string;
  patente = '';

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private themeService: ThemeService,
    private dataLocalService: DataLocalService,
    private alertService: AlertService,
    private nfc: NFC
    ) { }

  ionViewWillEnter() {
    // Testeando guardado de estado logeado
    this.dataLocalService.saveLogin().then(
      resp => {
        this.alertService.presentToast(resp);
        this.dataLocalService.printAllData();
      }
    );
  }

  ngOnInit() {
    this.listeningNFC();
    this.folder = this.activatedRoute.snapshot.paramMap.get('id');
    this.toogleDarkMode();
    this.patente = '';
  }

  // goToReadNfc(){    
  //   // this.service.getGet();
  //   // this.authService.login("oacevedo@dhemax.cl", "dhemax1234");
  //   let navigationExtras: NavigationExtras = {
  //     queryParams: {
  //       patente: this.patente
  //     }
  //   };
  //   this.router.navigate(['/read-nfc'], navigationExtras);
  // }

  patenteOnChange(e){
    console.log(e.detail.value);
    this.patente = e.detail.value;
  }

  toogleDarkMode(){
    this.themeService.toogleAppTheme();
  }

  deleteItem(item) {
    let index = this.listNFCs.indexOf(item);

    if(index > -1){
      this.listNFCs.splice(index, 1);
    }
  }

  listeningNFC(){
    console.log("listening ..");
    
    this.nfc.addTagDiscoveredListener().subscribe(event => {
      /*LOGS */
      // console.log('Tag detected: ' + JSON.stringify(event));
      // console.log('received ndef message. the tag contains: ', event.tag);
      console.log('numero de serie', this.nfc.bytesToHexString(event.tag.id));
      /*Variables */
      this.RFIDDATA1 = 'Tag detected: ' + JSON.stringify(event)
      this.RFIDDATA2 = 'received ndef message. the tag contains: ', event.tag
      // this.RFIDDATA3= 'numero de serie', this.nfc.bytesToHexString(event.tag.id)
      this.RFIDDATA3= this.nfc.bytesToHexString(event.tag.id)
      console.log("Leido: ",this.RFIDDATA3);
      
      /*Comparando nfc leido con lista de personal autorizado*/
      this.comparingNfcListCurrentNfc(this.RFIDDATA3).then(
        resp => {
          console.log("respuesta de comparacion: ", resp);
          /*Agregando a la Lista */
          this.listNFCs.push(resp);
        },
        err => {
          console.log(err);
          this.alertService.presentToast("Error leyendo personal");
        }
      );



      // let a = event.tag.id;
      // a.reverse();
      // // console.log('tag publico: ', parseInt(this.nfc.bytesToHexString(a), 16));
      // a = parseInt(this.nfc.bytesToHexString(a), 16)
      // this.NFCREAD = event
    });
  }

  /**
   * Compara el NFC leido con la lista de personal cargada inicialmente
   */
  async comparingNfcListCurrentNfc(nfc_code: string):Promise<any>{
    this.noCoincide = true;
    return new Promise( (resolve) => {
      let index = 0;
      // console.log(this.listaCargada.length);
      
      this.listaCargada.forEach(persona => {
        index ++;
        if(persona.nfc == nfc_code){
          this.noCoincide = false;
          console.log("Autorizado");          
          this.alertService.presentToast("Autorizado");
          resolve(persona);
        }
        if(index >= this.listaCargada.length && this.noCoincide){
          console.log("No Autorizado");  
          this.alertService.presentToast("No Autorizado");
        }
      });

      console.log("en comparing");
      
    });
  }

}
