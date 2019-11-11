import { Injectable } from '@angular/core';
import {Book} from '../models/book.model';
import {Subject} from 'rxjs/Subject';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class BooksService {

  books: Book[] = [];
  booksSubject = new Subject<Book[]>();

  constructor() { }

  emitBooks() {
    this.booksSubject.next(this.books);
  }

  saveBooks() {
    firebase.database().ref('/books').set(this.books).then();
  }

  updateBook(id: number, book: Book) {
    firebase.database().ref('/books/' + id).update(book).then();
  }

  deletePhotoBook(photo) {
    return new Promise(
      (resolve, reject) => {
        firebase.storage().refFromURL(photo).delete().then(
          () => {
            resolve();
            console.log('Photo supprimée avec succès !');
          }).catch(
          (error) => {
            reject(error);
            console.log('Erreur de suppression de la photo : ' + error);
          }
        );
      }
    );

  }

  deleteInfosBook(id: number) {
    return new Promise(
      (resolve, reject) => {
        const databaseRef = firebase.database().ref().child('/books/' + id);
        databaseRef.remove().then( () => {
            resolve();
            console.log('Livre supprimé de la database avec succès !');
          })
          .catch( (error) => {
            reject(error);
            console.log('Erreur de suppression du livre dans la database : ' + error);
          }
        );
      }
    );
  }

  removeBook(id: number, book: Book) {
    this.deleteInfosBook(id);
    if (book.photo) {
      this.deletePhotoBook(book.photo);
    }
  }

  getBooks() {
    firebase.database().ref('/books')
      .on('value', (data) => {
        this.books = data.val() ? data.val() : [];
        this.emitBooks();
      });
  }

  getSingleBook(id: number) {
    return new Promise(
      (resolve, reject) => {
        firebase.database().ref('/books/' + id).once('value').then(
          (data) => {
            resolve(data.val());
            this.emitBooks();
          }, (err) => {
            reject(err);
          }
        );
      }
    );
  }

  createNewBook(newBook: Book) {
    this.books.push(newBook);
    this.saveBooks();
    this.emitBooks();

    /*firebase.database().ref('/books/').push(newBook).then(
      () => {
        console.log('Enregistrement du nouveau livre : réussi !');
      }).catch((error) => {
        console.log('Erreur d\'enregistrement : ' + error);
      }
    );*/
  }

  uploadFile(file: File) {
    return new Promise(
      (resolve, reject) => {
        const almostUniqueFileName = Date.now().toString();
        const upload = firebase.storage().ref()
                      .child('images/' + almostUniqueFileName + file.name)
                      .put(file);
        upload.on(firebase.storage.TaskEvent.STATE_CHANGED,
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            switch (snapshot.state) {
              case firebase.storage.TaskState.PAUSED: // or 'paused'
                console.log('Upload is paused');
                break;
              case firebase.storage.TaskState.RUNNING: // or 'running'
                console.log('Upload is running : ' + progress + '% done');
                break;
            }
          },
          (err) => {
            console.error('Erreur de chargement de la photo : ' + err.message);
            reject(err);
          },
          () => {
            upload.snapshot.ref.getDownloadURL().then(
              (downloadURL) => {
                console.error('Chargement réussi : photo disponible à ', downloadURL);
                resolve(downloadURL);
              }
            );
            // resolve(upload.snapshot.ref.getDownloadURL());
          }
        );
      }
    );
  }
}
