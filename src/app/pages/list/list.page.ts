import { Component, OnInit } from '@angular/core';

/* Agregadas */
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { Viaje } from './../../models/viaje';

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

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { 
    this.activatedRoute.queryParams.subscribe(params => {
      if (params){
        this.viaje = JSON.parse(params.viaje);
        this.title = this.viaje.patente;
        this.listNFCs = this.viaje.numerosDeSerie;
        console.log(this.viaje);
        // console.log("dentro if");
      }
      // console.log("despues if");
    });
  }

  ngOnInit() {
  }

  goToInicio(){
    this.router.navigate(['']);
  }

  saveViaje(){
    console.log("Guardando ...");
    
  }

}
