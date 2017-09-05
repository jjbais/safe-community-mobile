import { Component, OnDestroy } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Observable, Subscription } from 'rxjs';
import { DatabaseProvider } from '../../providers/database/database';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  connection: string;
  connectionColor: string;
  buttonColor: string;
  buttonDisabled: boolean;
  mqttStateSubscription: Subscription;
  triggerStateSubscription: Subscription;

  constructor(public navCtrl: NavController, public db: DatabaseProvider) {
    this.buttonColor = 'danger';
    this.buttonDisabled = false;
    this.connection  = 'Not Connected';
    this.connectionColor = 'danger';

    this.mqttStateSubscription = db.mqttState.subscribe(state => {
      if(state){
        this.connection = 'Connected';
        this.connectionColor = 'secondary';
        this.buttonDisabled = false;
      }else{
        this.connection = 'Not Connected';
        this.connectionColor = 'danger';
        this.buttonDisabled = true;
      }
    });
    this.triggerStateSubscription = db.triggerState.subscribe(state => {
      if(state){
        this.buttonColor = 'secondary';
        this.buttonDisabled = true;
      }else{
        this.buttonColor = 'danger';
        this.buttonDisabled = false;
      }
    });
  }

  ngOnDestroy(){
    this.mqttStateSubscription.unsubscribe();
    this.triggerStateSubscription.unsubscribe();
  }

  trigger(){
    this.db.trigger();
  }
}