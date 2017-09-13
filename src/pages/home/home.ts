import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { Subscription } from 'rxjs';
import { DatabaseProvider } from '../../providers/database/database';
import { MqttProvider } from '../../providers/mqtt/mqtt'
import { AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { UserInfoModalPage } from '../user-info-modal/user-info-modal';

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
  isMqttConnected: boolean;
  isTriggerd: boolean;

  constructor(
    public navCtrl: NavController,
    public db: DatabaseProvider,
    public mqtt: MqttProvider,
    public alert: AlertController,
    public storage: Storage,
    public modal: ModalController
  ) {
    storage.get('userInfoLimay').then((value) => {
      console.log(value);
      if (!value) {
        this.openInfoEditor();
      }
    });

    this.mqttStateSubscription = db.mqttState.subscribe(mqttState => {
      if (mqttState) {
        this.connection = 'Connected';
        this.connectionColor = 'secondary';
        this.isMqttConnected = true;
      } else {
        this.connection = 'Not Connected';
        this.connectionColor = 'danger';
        this.isMqttConnected = false;
      }
    });
    this.triggerStateSubscription = db.triggerState.subscribe(triggerState => {
      if (triggerState) {
        this.buttonColor = 'secondary';
        this.buttonDisabled = true;
        this.isTriggerd = true;
      } else {
        this.buttonColor = 'danger';
        this.buttonDisabled = false;
        this.isTriggerd = false;
      }
    });

    db.changeMqttState(false);
    db.changeTriggerState(false);
  }

  ngOnDestroy() {
    this.mqttStateSubscription.unsubscribe();
    this.triggerStateSubscription.unsubscribe();
  }

  trigger() {
    this.storage.get('userInfoLimay').then((value) => {
      if (!value) {
        this.openInfoEditor();
      } else {
        if (this.isMqttConnected) {
          this.mqtt.trigger();
        } else {
          this.alert.create({
            title: 'Error!',
            subTitle: 'Device is not connected. Please try again.',
            buttons: ['OK']
          }).present();
        }
      }
    });
  }

  openInfoEditor() {
    this.modal.create(UserInfoModalPage).present();
  }
}