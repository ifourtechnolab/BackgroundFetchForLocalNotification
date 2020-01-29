import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { BackgroundFetch, BackgroundFetchConfig } from '@ionic-native/background-fetch/ngx';
import { LocalNotifications, ILocalNotification } from '@ionic-native/local-notifications/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(private platform: Platform, private backgroundMode: BackgroundMode, private backgroundFetch: BackgroundFetch,
              private localNotifications: LocalNotifications) {
    this.platform.ready().then(this.onDeviceReady.bind(this));
  }

  onDeviceReady() {
    this.backgroundMode.on('activate').subscribe(() => {
      console.log('Background Mode active');
    });

    const config: BackgroundFetchConfig = {
      stopOnTerminate: false
    };

    this.backgroundFetch.configure(config).then(() => {
      console.log('Background Fetch initialized');
      this.scheduleNotification();
      this.backgroundFetch.finish();
    }).catch(e => console.log('Error initializing background fetch', e));
  }

  scheduleNotification() {
    const currentDate = new Date();
    const arrDate: string[] = [];

    for (let index = 0; index < 5; index++) {
      currentDate.setHours(currentDate.getHours() + 1);
      arrDate.push(currentDate.toISOString());
    }
    console.log(arrDate);

    const arr: ILocalNotification[] = [];
    let cnt = 0;

    arrDate.forEach(element => {
      cnt++;
      const dt = new Date(element.replace(' ', 'T'));

      arr.push({
        id: cnt,
        title: 'Local Notify',
        text: 'Local notification received.',
        trigger: { at: dt },
        vibrate: true,
        wakeup: true,
        led: 'FF0000',
        foreground: true
      });
    });
    this.localNotifications.schedule(arr);
  }
}
