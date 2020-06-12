import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  darkMode = true;

  constructor(
    private plt: Platform
  ) { 
    this.plt.ready().then(() => {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");
      prefersDark.addListener(e => {
        this.setAppTheme(e.matches);
      });
    });
  }

  toogleAppTheme(){
    // this.darkMode = !this.darkMode;
    this.setAppTheme(this.darkMode);
  }

  setAppTheme(dark){
    this.darkMode = dark;

    if(this.darkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }
}
