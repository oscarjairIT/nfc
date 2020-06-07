import { Component, OnInit } from '@angular/core';

/* Agregadas */
import { Router } from '@angular/router';

@Component({
  selector: 'app-read-nfc',
  templateUrl: './read-nfc.page.html',
  styleUrls: ['./read-nfc.page.scss'],
})
export class ReadNfcPage implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
  }

  readNfc(){
    console.log("leyendo NFC");
    
  }

  goToList(){
    this.router.navigate(['/list']);
  }

}
