import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable, Observer } from 'rxjs';
import { AlertController } from 'ionic-angular';

@Injectable()
export class DatabaseProvider {
  mqttState: Observable<boolean>;
  mqttStateObserver: Observer<boolean>;
  triggerState: Observable<boolean>;
  triggerStateObserver: Observer<boolean>

  constructor(public http: Http, public alert: AlertController) {
    console.log('Hello DatabaseProvider Provider');

    this.mqttState = new Observable<boolean>(observer => 
      this.mqttStateObserver = observer
    ).share();
    this.triggerState = new Observable<boolean>(observer =>
      this.triggerStateObserver = observer
    ).share();
  }

  changeMqttState(state: boolean){
    if (this.mqttStateObserver !== undefined) this.mqttStateObserver.next(state);
  }

  changeTriggerState(state: boolean){
    if (this.triggerStateObserver !== undefined) this.triggerStateObserver.next(state);
  }

  trigger(){
    this.alert.create({
      title: 'Device Triggered!',
      subTitle: 'Please wait for further assistance.',
      buttons: ['OK']
    }).present();
  }
}
