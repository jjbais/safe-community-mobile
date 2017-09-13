import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Storage } from '@ionic/storage'

interface User{
  name: string;
  mobile: string;
  lat: number;
  long: number;
}

@IonicPage()
@Component({
  selector: 'page-user-info-modal',
  templateUrl: 'user-info-modal.html',
})
export class UserInfoModalPage {
  isUserInfo: boolean;
  user: User = {name: '', mobile:'', lat:0, long:0}

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage, public view: ViewController) {
    storage.get('userInfoLimay').then((value) => {
      if(value){
        this.isUserInfo = true;
        this.user = JSON.parse(value);
      }else{
        this.isUserInfo = false;
        this.user = {name: '', mobile:'', lat:0, long:0};
      }
    });
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserInfoModalPage');
  }

  updateInfo(){
    this.storage.set('userInfoLimay', JSON.stringify(this.user));
    this.view.dismiss();
  }

  dismiss(){
    this.view.dismiss();
  }

}
