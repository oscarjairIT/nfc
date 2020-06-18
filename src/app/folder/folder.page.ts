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
import { ApiLoomisService } from '../services/api-loomis.service';
import { Tripulacion, PersonalParaEnvio } from '../models/tripulacion';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
})
export class FolderPage implements OnInit {

  // listaCargada: Persona[] = [
  //   {id_persona: "18021254K", id_tarjeta: "3253082088", nombre:"TARDONE LUCAS"}
  // ];
  listaCargada: Persona[] = [];
  listNFCs: Persona[] =[];
  noCoincide = true;
  RFIDDATA1: string;
  RFIDDATA2: string;
  RFIDDATA3: string;
  NFCREAD: any;
  public folder: string;
  patente = '';

  /*Data a enviar */
  tripulacion: Tripulacion = new Tripulacion();

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private themeService: ThemeService,
    private dataLocalService: DataLocalService,
    private alertService: AlertService,
    private nfc: NFC,
    private apiLoomis: ApiLoomisService,
    private alertController: AlertController
    ) {
      this.tripulacion.tripulacion = [];
    }

  ionViewWillEnter() {
    
    this.dataLocalService.isLogged().then(
      resp => {
        console.log(resp);
        if(resp != true){
          this.router.navigate(['/login']);
        }
      },
      err=>{
        console.log(err);  
        this.alertService.presentToast(err);
      }
    );
    
  }

  ngOnInit() {
    this.apiLoomis.getPersonal().then(
      resp =>{
        this.dataLocalService.savePersonalInicial(resp).then(
          ok=>{
            console.log("Request de servicio inicial de carga de personal: ",resp);
            // let respParsed = JSON.parse(resp.data);
            // for asignando resp a listaCargada
            resp.forEach(element => {
              // console.log(element.nfc);

              this.listaCargada.push({id_persona: element.id_persona, 
                                    id_tarjeta: element.id_tarjeta, 
                                      nombre: element.nombre});
            });
          }
        );
      },
      err =>{
        console.log(err);
      }
    );
    this.listeningNFC();
    this.folder = this.activatedRoute.snapshot.paramMap.get('id');
    this.toogleDarkMode();
    // this.patente = '';
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

  async quieroEnviar() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Confirmar',
      // subHeader: 'Subtitle',
      message: '¿Está seguro de enviar esta tripulación?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        },
        {
          text: 'Si',
          handler: () => {
            console.log('Confirm Okay');
            this.sendingTripulacion().then(
              resp=> {
                console.log(resp);

                /*Vaciando lista de envio y otras listas*/
                this.tripulacion.tripulacion = [];
                this.tripulacion.patente = '';
                this.listNFCs = [];
                this.patente = '';
              }
            );
          }
        }
      ]
    });

    await alert.present();
  }

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
    let code;
    this.nfc.addTagDiscoveredListener().subscribe(event => {
      console.log('HEXA: ', this.nfc.bytesToHexString(event.tag.id));
      let uno = this.nfc.bytesToHexString(event.tag.id)
      console.log("hexa dec ",parseInt(uno, 16));
      let dos = event.tag.id.reverse()
      console.log("hex invert: ",this.nfc.bytesToHexString(dos))
      console.log("Decimal invers: ",parseInt(this.nfc.bytesToHexString(dos), 16))
      // this.nfc.
      code = parseInt(this.nfc.bytesToHexString(dos), 16);
      
      /*Comparando nfc leido con lista de personal autorizado*/
      this.comparingNfcListCurrentNfc(code).then(
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
      // console.log("Lista Cargada: ", this.listaCargada);
      
      this.listaCargada.forEach(persona => {
        index ++;
        if(persona.id_tarjeta == nfc_code){
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

  /**
   *  Envia tripulacion
   */
  async sendingTripulacion():Promise<any>{
    return new Promise( (resolve) => {
      this.createTripulacion().then(
        tripulacion=>{
          // console.log("tripulacion antes de enviarse: ", tripulacion);
          console.log("patente de variable: ", this.tripulacion.patente);
          console.log("tripulacion de variable: ", this.tripulacion.tripulacion);
          
          this.apiLoomis.sendTripulacion(this.tripulacion.patente , this.tripulacion.tripulacion).then(
            resp=>{
              console.log("Tripulacion Enviada Correctamente");
              console.log(resp);
              this.alertService.presentToast("Enviado Correctamente");
              resolve(resp);
            },
            err=>{
              console.log(err);
            }
          );
        },
        err=>{
          console.log(err);
        }
      );
    });
  }

  /**
   * Crea Objeto Tripulacion
   */
  async createTripulacion():Promise<any>{
    console.log("Lista Inical Cargada es: ", this.listaCargada);
    console.log("Lista Autorizados: ", this.listNFCs);
    
    console.log("Lista para enviar antes de ser cargada: ", this.tripulacion);
    // this.tripulacion.tripulacion.push()
    return new Promise( (resolve) => {
      
      this.tripulacion.patente = this.patente;
      let index;
      for (index = 0; index < this.listNFCs.length; index++) {
        const element =  this.listNFCs[index];
        console.log("Leyendo: ", element);
        
        this.tripulacion.tripulacion.push({
          id_persona: element.id_persona,
          nombre_persona: element.nombre
        });
        console.log("Uno mas: ", this.tripulacion.tripulacion);
        
      }
      
      if(index >=  this.listNFCs.length){
        // console.log("ajuera",this.tripulacion);
        console.log("Lista para enviar luego de ser cargada: ", this.tripulacion);
        
        resolve(this.tripulacion);
      }

      // this.listaCargada.forEach(element => {

      //   this.tripulacion.tripulacion.push({
      //     id_persona: element.id_persona,
      //     nombre_persona: element.nombre_persona,
      //     apellido_persona: element.apellido_persona
      //   });

      // });
    });
  }

}
