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

  sinPersonal = true;

  enviarPatente = false;
  noDecideComoEnviar = true;
  personalNoCargado = true;



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
      
      
    }

  ionViewWillEnter() {
    this.enviarPatente = false;
    this.noDecideComoEnviar = true;
    this.personalNoCargado = true;
    this.getPersonal();
    
    this.dataLocalService.isLogged().then(
      resp => {
        console.log(resp);
        if(resp == false){
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
    this.enviarPatente = false;
    this.noDecideComoEnviar = true;
    this.personalNoCargado = true;

    if(this.personalNoCargado){
      this.getPersonal();
    }
    this.folder = this.activatedRoute.snapshot.paramMap.get('id');
    this.toogleDarkMode();
  }

  goToReadNfc(){    
    if(this.personalNoCargado){
      this.getPersonal();
    }
    let navigationExtras: NavigationExtras = {
      queryParams: {
        patente: this.patente,
        personal: JSON.stringify(this.listaCargada)
      }
    };
    this.router.navigate(['/read-nfc'], navigationExtras);
  }

  patenteOnChange(e){
    console.log(e.detail.value);
    this.patente = e.detail.value;
  }

  usarPatente(){
    if(this.personalNoCargado){
      this.getPersonal();
    }
    this.enviarPatente = true;
    this.noDecideComoEnviar = false;
  }

  cancelar(){
    this.enviarPatente = false;
    this.noDecideComoEnviar = true;
  }

  toogleDarkMode(){
    this.themeService.toogleAppTheme();
  }

  getPersonal(){
    this.apiLoomis.getPersonal().then(
      resp =>{
        this.dataLocalService.savePersonalInicial(resp);
        this.listaCargada = [];
        this.personalNoCargado = false;
        console.log("Request de servicio inicial de carga de personal: ",resp);
        resp.forEach(element => {
          // console.log(element.nfc);
          
          this.listaCargada.push({id_persona: element.id_persona, 
                                id_tarjeta: element.id_tarjeta, 
                                  nombre: element.nombre});
        });
      },
      err => {
        console.log("Error al obtener personal ",err);
        this.alertService.presentToast("Error al Cargar el personal");
      }
    );
  }



}
