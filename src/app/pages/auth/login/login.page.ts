import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { AlertService } from 'src/app/services/alert.service';
import { ApiLoomisService } from 'src/app/services/api-loomis.service';
import { DataLocalService } from 'src/app/services/data-local.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(
    private modalController: ModalController,
    private authService: AuthService,
    private navCtrl: NavController,
    private apiLoomisService: ApiLoomisService,
    private alertService: AlertService,
    private dataLocalService: DataLocalService
  ) { }

  ngOnInit() {
  }

  login(form: NgForm) {
    this.authService.loginAsync(form.value.email, form.value.password).then(
      data => {
        console.log("data: ",data);  
        if (this.authService.isLoggedIn){
          this.navCtrl.navigateRoot('folder');
        }  
      },
      error => {
        console.log(error);
      }
    );
  }

  /**
   * 
   */
  loginLoomis(form: NgForm) {
    this.apiLoomisService.login(form.value.email, form.value.password).then(
      resp => {

        this.dataLocalService.saveLogin().then(
          correct => {
            this.alertService.presentToast(resp);  
            this.navCtrl.navigateRoot('folder');
          },
          err => {
            console.log(err);
            this.alertService.presentToast('error al intentar guardar estado logeado');
          }
        );

      },
      error => {
        console.log(error);
      }
    );
  }
}
