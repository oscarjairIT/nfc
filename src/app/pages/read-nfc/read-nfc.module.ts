import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReadNfcPageRoutingModule } from './read-nfc-routing.module';

import { ReadNfcPage } from './read-nfc.page';
import { NFC, Ndef } from "@ionic-native/nfc/ngx";
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReadNfcPageRoutingModule,
    ComponentsModule
  ],
  declarations: [ReadNfcPage],
  providers: [
    NFC,
    Ndef
  ]
})
export class ReadNfcPageModule {}
