import { Component, OnInit } from '@angular/core';

/* Agregadas */
import { ActivatedRoute, Router } from '@angular/router';
import { NFC, Ndef } from '@ionic-native/nfc/ngx';

@Component({
  selector: 'app-read-nfc',
  templateUrl: './read-nfc.page.html',
  styleUrls: ['./read-nfc.page.scss'],
})
export class ReadNfcPage implements OnInit {

  RFIDDATA1: string;
  RFIDDATA2: string;
  RFIDDATA3: string;
  NFCREAD: any;

  nfcDefaults = ["VACIO1", "VACIO2"]
  data: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private nfc: NFC, 
    private ndef: Ndef
  ) { 
    this.activatedRoute.queryParams.subscribe(params => {
      console.log("params: ",params);
      if (params && params.special){
        this.data = params.patente;
      }
    });
  }

  ngOnInit() {
    this.listeningNFC();
  }

  readNfc(){
    console.log("leyendo NFC");
    this.listeningNFC();
  }

  goToList(){
    this.router.navigate(['/list']);
  }

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
      console.log('Tag detected: ' + JSON.stringify(event));
      console.log('received ndef message. the tag contains: ', event.tag);
      console.log('numero de serie', this.nfc.bytesToHexString(event.tag.id));
      /*Variables */
      this.RFIDDATA1 = 'Tag detected: ' + JSON.stringify(event)
      this.RFIDDATA2 = 'received ndef message. the tag contains: ', event.tag
      this.RFIDDATA3= 'numero de serie', this.nfc.bytesToHexString(event.tag.id)
      let a = event.tag.id;
      a.reverse();
      console.log('tag publico: ', parseInt(this.nfc.bytesToHexString(a), 16));
      a = parseInt(this.nfc.bytesToHexString(a), 16)
      this.NFCREAD = event
    })
  }

}
