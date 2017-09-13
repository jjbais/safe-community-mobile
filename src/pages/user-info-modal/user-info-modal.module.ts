import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserInfoModalPage } from './user-info-modal';

@NgModule({
  declarations: [
    UserInfoModalPage,
  ],
  imports: [
    IonicPageModule.forChild(UserInfoModalPage),
  ],
})
export class UserInfoModalPageModule {}
