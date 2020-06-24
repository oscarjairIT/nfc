import { Component, OnInit, ViewChild  } from '@angular/core';

/* Agregadas */
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { NFC, Ndef } from '@ionic-native/nfc/ngx';
import { IonInfiniteScroll } from '@ionic/angular';
import { CameraService } from 'src/app/services/camera.service';
import { AlertService } from 'src/app/services/alert.service';
import { Persona } from '../../models/persona';
import { ApiLoomisService } from 'src/app/services/api-loomis.service';
import { AlertController } from '@ionic/angular';
import { Tripulacion, PersonalParaEnvio } from '../../models/tripulacion';
import { DataLocalService } from 'src/app/services/data-local.service';
import { OnDestroy } from '@angular/core';
import { Observable, Subscription, timer } from 'rxjs';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-read-nfc',
  templateUrl: './read-nfc.page.html',
  styleUrls: ['./read-nfc.page.scss'],
})
export class ReadNfcPage implements OnInit, OnDestroy {

  listaCargada: Persona[] = [];
  listNFCs: Persona[] =[];
  noCoincide = true;
  RFIDDATA1: string;
  RFIDDATA2: string;
  RFIDDATA3: string;
  NFCREAD: any;
  patente = '';
  enviandoSinPatente = false;
  enviandoConPatente = false;

  noQuieroEnviar = true;

    /*Data a enviar */
    tripulacion: Tripulacion = new Tripulacion();

  subscripcion: Subscription;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private nfc: NFC, 
    private ndef: Ndef,
    private alertService: AlertService,
    private apiLoomis: ApiLoomisService,
    private alertController: AlertController,
    private dataLocalService: DataLocalService,
    public modalController: ModalController
  ) { 
    this.tripulacion.tripulacion = [];

    this.activatedRoute.queryParams.subscribe(params => {
      // console.log("params: ",params);
      if (params){
        this.patente = params.patente;
        this.listaCargada = JSON.parse(params.personal);
      }
      if(this.listaCargada.length < 2){
        // getPersonal(){
          console.log("intentando cargar en read-nfc");
          
          this.dataLocalService.getPersonal().then(
            resp => {
              this.listaCargada = resp;
              console.log("resp ",resp);
              console.log("lista cargada ",this.listaCargada);
              
              
            }
          )
        // }
      }
      // console.log("constructor ",this.patente);
      this.listaCargada.push({id_persona: "TEST id persona", id_tarjeta: "3253082088", nombre:"PERSONA TEST"});
      console.log("Lista Cargada en constructor ", this.listaCargada);
      
      
    });

    
  }

  ngOnInit() {
    this.listeningNFC();
    
  }

  cancelarProceso(){
    if (this.subscripcion) {
      this.subscripcion.unsubscribe();
    }
    this.router.navigate(['folder']);
  }

  ngOnDestroy() {
    this.subscripcion.unsubscribe();
  }

  siQuieroEnviar(){
    
    this.sendingTripulacion().then(
      resp=> {
        console.log(resp);

        /*Vaciando lista de envio y otras listas*/
        this.tripulacion.tripulacion = [];
        this.tripulacion.patente = '';
        this.listNFCs = [];

        this.router.navigate(['/folder']);
      });
  }

  async quieroEnviar() {
    const alert = await this.alertController.create({
      cssClass: 'alertCustomCss{font-size: 30px;}',
      header: 'Confirmar',
      // subHeader: 'Subtitle',
      message: '¿Está seguro de enviar esta tripulación?',
      buttons: [
        {
          text: "No",
          role: 'cancel',
          cssClass: 'font-size: 40px;',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        },
        {
          text: 'SI',
          handler: () => {
            console.log('Confirm Okay');

            this.sendingTripulacion().then(
              resp=> {
                console.log(resp);

                /*Vaciando lista de envio y otras listas*/
                this.tripulacion.tripulacion = [];
                this.tripulacion.patente = '';
                this.listNFCs = [];

                this.router.navigate(['/folder']);
              }
            );


          }
        }
      ]
    });

    await alert.present();



  }

  quieroEnviar2(){
    this.noQuieroEnviar = false;
  }

  noEstoySeguro(){
    this.noQuieroEnviar = true;
  }


  // async presentPopover(ev: any) {
  //   const popover = await this.popoverController.create({
  //     component: PopoverComponent,
  //     cssClass: 'my-custom-class',
  //     event: ev,
  //     translucent: true
  //   });
  //   return await popover.present();
  // }

  // async presentModal() {
  //   const modal = await this.modalController.create({
  //     component: ModalPage,
  //     cssClass: 'my-custom-class'
  //   });
  //   return await modal.present();
  // }


  deleteItem(item) {
    let index = this.listNFCs.indexOf(item);

    if(index > -1){
      this.listNFCs.splice(index, 1);
    }
  }

  forzarEscaneo(){
    // this.getPersonalToLocal();
    this.alertService.presentToast("Iniciando Escaneo");
    this.listeningNFC();
  }

  listeningNFC(){

    if (this.subscripcion) {
      this.subscripcion.unsubscribe();
    }
    
    console.log("listening ..");
    
    let code;
    this.subscripcion =  this.nfc.addTagDiscoveredListener().subscribe(event => {
      console.log('HEXA: ', this.nfc.bytesToHexString(event.tag.id));
      let uno = this.nfc.bytesToHexString(event.tag.id)
      console.log("hexa dec ",parseInt(uno, 16));
      let dos = event.tag.id.reverse()
      console.log("hex invert: ",this.nfc.bytesToHexString(dos))
      console.log("Decimal invers: ",parseInt(this.nfc.bytesToHexString(dos), 16))
      // this.nfc.
      code = parseInt(this.nfc.bytesToHexString(dos), 16);
      console.log("Code: ", code);

      // this.comparing(code)
      
      
      /*Comparando nfc leido con lista de personal autorizado*/
      this.comparingNfcListCurrentNfc(code).then(
        resp => {
          console.log("respuesta de comparacion: ", resp);
          if(resp == 'vacio'){
            console.log("vacio");
            console.log("No Autorizado");  
            this.alertService.presentToast("No Autorizado");
          } else {
            /*Agregando a la Lista */
            this.listNFCs.push(resp);
            console.log("Actualiza lista NFC: ",this.listNFCs);

          }
          
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
    return new Promise( (resolve, reject) => {
      let index = 0;
      // console.log(this.listaCargada.length);
      // console.log("Lista Cargada: ", this.listaCargada);
      
      this.listaCargada.forEach(persona => {
        index ++;
        // console.log("Comparando: ");
        
        // console.log(persona.id_tarjeta);
        // console.log(nfc_code);
        
        
        if(persona.id_tarjeta == nfc_code){
          this.noCoincide = false;
          console.log("Autorizado");          
          this.alertService.presentToast("Autorizado");
          resolve(persona);
          return;
        }
        if(index >= this.listaCargada.length && this.noCoincide){
          console.log("No Autorizado");  
          this.alertService.presentToast("No Autorizado");
        }
      });
      index = 0;
      this.noCoincide = true;
      console.log("en comparing");

      resolve('vacio');
      return;
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
      this.patente = this.patente.toUpperCase();
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
