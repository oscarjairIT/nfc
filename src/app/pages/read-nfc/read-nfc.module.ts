import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReadNfcPageRoutingModule } from './read-nfc-routing.module';

import { ReadNfcPage } from './read-nfc.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReadNfcPageRoutingModule
  ],
  declarations: [ReadNfcPage]
})
export class ReadNfcPageModule {}
