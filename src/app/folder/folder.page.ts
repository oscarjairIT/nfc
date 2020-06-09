import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

/* Agregadas */
import { Router, NavigationExtras  } from '@angular/router';
import { ThemeService } from '../services/theme.service';
import { SharedService } from '../services/shared.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
})
export class FolderPage implements OnInit {
  public folder: string;
  private patente: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private themeService: ThemeService,
    private service: SharedService,
    private authService: AuthService
    ) { }

  ionViewWillEnter() {
      this.authService.getToken().then(() => {
        if(!this.authService.isLoggedIn) {
          // this.navCtrl.navigateRoot('/dashboard');
          console.log("no está logeado, mandando a login");
          this.router.navigate(['/login']);
        }
      });
  }

  ngOnInit() {
    this.folder = this.activatedRoute.snapshot.paramMap.get('id');
    // this.service.getGet();
    // this.authService.login("oacevedo@dhemax.cl", "dhemax1234");
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
