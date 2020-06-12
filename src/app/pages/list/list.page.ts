import { Component, OnInit } from '@angular/core';

/* Agregadas */
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { Viaje } from './../../models/viaje';
import { ViajeService } from 'src/app/services/viaje.service';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
})
export class ListPage implements OnInit {

  viaje: Viaje = new Viaje();

  /*Card variables*/
  title: string;
  listNFCs: string[];
  patente_id: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private viajeService: ViajeService,
    private alertService: AlertService
  ) { 
    this.activatedRoute.queryParams.subscribe(params => {
      if (params){
        this.viaje = JSON.parse(params.viaje);
        this.title = this.viaje.patente;
        this.listNFCs = this.viaje.numerosDeSerie;
        console.log("this.viaje: ",this.viaje);

        this.viajeService.createVehiculo(this.viaje.patente).then(
          resp => {
            this.patente_id = resp.id;
            console.log("patente creada id: ",this.patente_id);
          }
        );
        // console.log("dentro if");
      }
      // console.log("despues if");
    });
    // console.log("patente antes de enviarse: ",this.viaje.patente);
    

  }

  ngOnInit() {
  }

  goToInicio(){
    this.router.navigate(['']);
  }

  saveViaje(){
    console.log("Guardando ...");
    this.alertService.presentToast("Enviando ....");
    
    this.listNFCs.forEach(nfc => {

          this.viajeService.createTarjeta(this.patente_id, nfc).then(
            resp => {
              console.log("enviando nfc: ", nfc);
            }
          )
    });
    
    console.log("Enviado Correctamente");    
    this.alertService.presentToast("Enviado Correctamente");
    this.router.navigate(['']);
  }

}
