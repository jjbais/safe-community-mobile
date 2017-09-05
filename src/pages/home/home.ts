import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Subscription } from 'rxjs';
import { DatabaseProvider } from '../../providers/database/database';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  mqttState: boolean;
  connection: string;
  connectionColor: string;
  buttonColor: string;
  buttonDisabled: boolean;
  mqttStateSubscription: Subscription;
  triggerStateSubscription: Subscription;

  constructor(public navCtrl: NavController, public db: DatabaseProvider) {
    this.mqttStateSubscription = db.mqttState.subscribe(state => {
      if(state){
        this.connection = 'Connected';
        this.connectionColor = 'secondary';
        this.mqttState = true;
      }else{
        this.connection = 'Not Connected';
        this.connectionColor = 'danger';
        this.mqttState = false;
      }
    });
    this.triggerStateSubscription = db.triggerState.subscribe(state => {
      if(state){
        this.buttonColor = 'secondary';
        this.buttonDisabled = true;
      }else if(state && !this.mqttState){
        this.buttonColor = 'danger';
        this.buttonDisabled = true;
      }else if(!state && this.mqttState){
        this.buttonColor = 'danger';
        this.buttonDisabled = false;
      }else{
        this.buttonColor = 'danger';
        this.buttonDisabled = true;
      }
    });

    db.changeMqttState(true);
    db.changeTriggerState(false);
  }

  ngOnDestroy(){
    this.mqttStateSubscription.unsubscribe();
    this.triggerStateSubscription.unsubscribe();
  }

  trigger(){
    this.db.trigger();
  }
}