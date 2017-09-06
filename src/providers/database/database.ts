import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable, Observer } from 'rxjs';

@Injectable()
export class DatabaseProvider {
  mqttState: Observable<boolean>;
  mqttStateObserver: Observer<boolean>;
  triggerState: Observable<boolean>;
  triggerStateObserver: Observer<boolean>;

  user = {
    name: 'Jerome Joseph Bais',
    mobile: '09279574701',
    lat: 14.561160,
    long: 120.590756
  }

  constructor(public http: Http) {
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
}
