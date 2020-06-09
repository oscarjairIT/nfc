import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { AlertService } from 'src/app/services/alert.service';

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
  ) { }

  ngOnInit() {
  }

  login(form: NgForm) {
    this.authService.loginAsync(form.value.email, form.value.password).then(
      data => {
        console.log("data: ",data);  
        if (this.authService.isLoggedIn){
          this.navCtrl.navigateRoot('/folder/Inbox');
        }  
      },
      error => {
        console.log(error);
      }
    );
  }
}
