import { Component } from '@angular/core';
import * as firebase from 'firebase';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor() {
    // Your web app's Firebase configuration
    const firebaseConfig = {
      apiKey: 'AIzaSyD14Xl4uwW6uZjQ_ny0gJ0pEBzZDe6-zQ0',
      authDomain: 'bookshelves-5a799.firebaseapp.com',
      databaseURL: 'https://bookshelves-5a799.firebaseio.com',
      projectId: 'bookshelves-5a799',
      storageBucket: 'bookshelves-5a799.appspot.com',
      messagingSenderId: '505858227864',
      appId: '1:505858227864:web:cc3ce5b3bcbe14a1d85aed',
      measurementId: 'G-11N9P000RZ'
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    firebase.analytics();
  }

}
