import { Component, OnInit, ViewChild  } from '@angular/core';

/* Agregadas */
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { NFC, Ndef } from '@ionic-native/nfc/ngx';
import { Viaje } from './../../models/viaje';
import { IonInfiniteScroll } from '@ionic/angular';
import { ViajeService } from 'src/app/services/viaje.service';

@Component({
  selector: 'app-read-nfc',
  templateUrl: './read-nfc.page.html',
  styleUrls: ['./read-nfc.page.scss'],
})
export class ReadNfcPage implements OnInit {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  RFIDDATA1: string;
  RFIDDATA2: string;
  RFIDDATA3: string;
  NFCREAD: any;

  nfcDefaults = ["VACIO1", "VACIO2"] //para pruebas
  listNFCs: string[] = ["VACIO1", "VACIO2", "VACIO3", "VACIO4","VACIO5", "VACIO6","VACIO7", "VACIO8" , "VACIO9",  "VACIO10", "VACIO11", "VACIO12", "VACIO13"];
  patente: string;
  viaje: Viaje = new Viaje();

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private nfc: NFC, 
    private ndef: Ndef,
    private viajeService: ViajeService
  ) { 
    this.activatedRoute.queryParams.subscribe(params => {
      // console.log("params: ",params);
      if (params){
        this.patente = params.patente;
      }
      // console.log("constructor ",this.patente);
      
    });
  }

  ngOnInit() {
    this.listeningNFC();

    // this.viajeService.createVehiculo('JJKK88').then(
    //   resp => {
    //     console.log("createVehiculo respuesta: ",resp);  
    //   }
    // );
    // this.viajeService.getVehiculoIDByPatente("PRUEBA1").then(
    //   resp => {
    //     console.log("getVehiculoIDByPatente respuesta: ", resp);  
    //   }
    // );
  }

  readNfc(){
    console.log("leyendo NFC");
    this.listeningNFC();
  }

  goToList(){
    this.viaje.patente = this.patente;
    this.viaje.numerosDeSerie = this.listNFCs;
    // console.log("goToList ",this.patente);
    
    // console.log("Origen: ",this.viaje);
    
    let navigationExtras: NavigationExtras = {
      queryParams: {
        viaje: JSON.stringify(this.viaje)
      }
    };
    this.router.navigate(['/list'], navigationExtras);
  }

  deleteItem(item) {
    let index = this.listNFCs.indexOf(item);

    if(index > -1){
      this.listNFCs.splice(index, 1);
    }
  }

  /*no funka */
  listeningNfc2(){
    this.nfc.addNdefListener(() => {
      console.log('successfully attached ndef listener');
    }, (err) => {
      console.log('error attaching ndef listener', err);
    }).subscribe((event) => {
      console.log('received ndef message. the tag contains: ', event.tag);
      console.log('decoded tag id', this.nfc.bytesToHexString(event.tag.id));
    
      let message = this.ndef.textRecord('Hello world');
      this.nfc.share([message]).then(
        onSucess => {
          console.log(onSucess);
          
        }
      ).catch(
        onError => {
          console.log(onError);
          
        }
      );
    });
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

      /*Agregando a la Lista */
      this.listNFCs.push(this.RFIDDATA3);

      let a = event.tag.id;
      a.reverse();
      // console.log('tag publico: ', parseInt(this.nfc.bytesToHexString(a), 16));
      a = parseInt(this.nfc.bytesToHexString(a), 16)
      this.NFCREAD = event
    })
  }

}
