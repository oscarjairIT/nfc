import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router, NavigationExtras  } from '@angular/router';
import { ThemeService } from '../services/theme.service';
import { SharedService } from '../services/shared.service';
import { ViajeService } from '../services/viaje.service';
import { DataLocalService } from '../services/data-local.service';
import { Persona } from '../models/persona';
import { AlertService } from '../services/alert.service';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
})
export class FolderPage implements OnInit {
  public folder: string;
  patente = '';

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private themeService: ThemeService,
    private dataLocalService: DataLocalService,
    private alertService: AlertService
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
    this.folder = this.activatedRoute.snapshot.paramMap.get('id');
    this.toogleDarkMode();
    this.patente = '';
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
