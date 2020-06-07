import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ReadNfcPage } from './read-nfc.page';

describe('ReadNfcPage', () => {
  let component: ReadNfcPage;
  let fixture: ComponentFixture<ReadNfcPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReadNfcPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ReadNfcPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
