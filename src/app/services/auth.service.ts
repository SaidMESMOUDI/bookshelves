import { Injectable } from '@angular/core';
import {Router} from '@angular/router';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router: Router) { }

  createNewUser(email: string, password: string) {
    return new Promise(
      ((resolve, reject) => {
        firebase.auth().createUserWithEmailAndPassword(email, password).then(
          () => {
            resolve();
          },
          (err) => {
            reject(err);
          }
        );
      })
    );
  }

  signInUser(email: string, password: string) {
    return new Promise(
      ((resolve, reject) => {
        firebase.auth().signInWithEmailAndPassword(email, password).then(
          () => {
            resolve();
          },
          (err) => {
            reject(err);
          }
        );
      })
    );
  }

  signOut() {
    firebase.auth().signOut();
  }
}
