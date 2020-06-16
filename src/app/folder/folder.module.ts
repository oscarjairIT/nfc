import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FolderPageRoutingModule } from './folder-routing.module';

import { FolderPage } from './folder.page';
import { ComponentsModule } from '../components/components.module';
import { NFC, Ndef } from "@ionic-native/nfc/ngx";



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FolderPageRoutingModule,
    ComponentsModule
  ],
  declarations: [FolderPage],
  providers: [
    NFC,
    Ndef
  ]
})
export class FolderPageModule {

  constructor() {

  }


}
