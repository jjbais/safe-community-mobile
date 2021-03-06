import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { DatabaseProvider } from '../database/database';
import { AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import * as mqtt from 'mqtt';

@Injectable()
export class MqttProvider {
  connectionType: string;
  url: string;
  port: string;
  brokerUrl: string;
  client: mqtt.Client;
  isConnected: boolean;
  rootTopic: string;

  constructor(public http: Http, public db: DatabaseProvider, public alert: AlertController, public storage: Storage) {
    console.log('Hello MqttProvider Provider');

    this.connectionType = 'ws';
    this.url = '192.168.200.1'; // safe.local, iot.eclipse.org
    this.port = '1884';          // 1884, 80/ws

    this.brokerUrl = this.connectionType + '://' + this.url + ':' + this.port;
    this.isConnected = false;
    this.rootTopic = 'community/';

    this.connect(this.brokerUrl);

    this.client.on('connect', () => {
      this.onConnect();
    });
    this.client.on('close', () => {
      this.db.changeMqttState(false);
    });
    this.client.on('message', (topic, message) => {
      this.onMessage(topic, message.toString());
    });
  }

  connect(brokerUrl: string) {
    this.client = mqtt.connect(brokerUrl);
  }

  disconnect() {
    this.client.end();
    this.isConnected = this.client.connected;
  }

  onConnect() {
    this.client.subscribe(this.rootTopic + '#');
    this.isConnected = this.client.connected;
    this.db.changeMqttState(true);
  }

  onMessage(topic: string, payload: string) {
    this.storage.get('userInfoLimay').then((value) => {
      if(topic === 'community/mobile/' + value.name + '/' + value.mobile + '/trigger/'){
        if(payload === 'true'){
          this.db.changeTriggerState(true);
        }else{
          this.db.changeTriggerState(false);
        }
      }
    });
    
  }

  publish(topic: string, payload: string) {
    this.client.publish(this.rootTopic + topic, payload, {qos: 0, retain: true, dup: false});
  }

  trigger(){
    this.publish('mobile/' + this.db.user.name + '/' + this.db.user.mobile + '/trigger/', 'true');
    this.location();
    this.alert.create({
      title: 'Device Triggered!',
      subTitle: 'Please wait for further assistance.',
      buttons: ['OK']
    }).present();
  }

  location(){
    this.publish('community/mobile/' + this.db.user.name + '/' + this.db.user.mobile + '/location/',  this.db.user.lat + '/' + this.db.user.long);
  }

}
