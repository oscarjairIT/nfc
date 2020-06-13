import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router, NavigationExtras  } from '@angular/router';
import { ThemeService } from '../services/theme.service';
import { SharedService } from '../services/shared.service';
import { AuthService } from '../services/auth.service';
import { ViajeService } from '../services/viaje.service';
import { DataLocalService } from '../services/data-local.service';
import { Persona } from '../models/persona';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
})
export class FolderPage implements OnInit {
  public folder: string;
  patente = '';

  /**
   * Variables para tests
   */
  personasIniciales: Persona[] = [
    {id_persona: 1, nombre_persona: 'Juan', apellido_persona: 'Perez', imagen: 'http://www.looomis.cl/img/img.jpg'},
    {id_persona:2,nombre_persona:'Jose',apellido_persona:'Diaz',imagen:"http://www.looomis.cl/img/img.jpg"}
  ]

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private themeService: ThemeService,
    private authService: AuthService,
    private dataLocalService: DataLocalService
    ) { }

  ionViewWillEnter() {
      // this.authService.getToken().then(() => {
      //   if(!this.authService.isLoggedIn) {
      //     console.log("no está logeado, mandando a login");
      //     this.router.navigate(['/login']);
      //   }
      // });

  }

  ngOnInit() {
    this.folder = this.activatedRoute.snapshot.paramMap.get('id');
    // this.service.getGet();
    // this.authService.login("oacevedo@dhemax.cl", "dhemax1234");
    this.toogleDarkMode();
    this.patente = '';
    console.log('NgOnInit');

    this.dataLocalService.savePersonalInicial(this.personasIniciales).then(
      resp => {
        console.log("from ionViewWillEnter",resp);
      }
    );
    
    this.dataLocalService.printAllData().then(
      resp => {
        console.log("respuesta: ", resp);  
      }
    )
  }

  goToReadNfc(){    
    // this.service.getGet();
    // this.authService.login("oacevedo@dhemax.cl", "dhemax1234");
    let navigationExtras: NavigationExtras = {
      queryParams: {
        patente: this.patente
      }
    };
    this.router.navigate(['/read-nfc'], navigationExtras);
  }

  patenteOnChange(e){
    console.log(e.detail.value);
    this.patente = e.detail.value;
  }

  toogleDarkMode(){
    this.themeService.toogleAppTheme();
  }

}
