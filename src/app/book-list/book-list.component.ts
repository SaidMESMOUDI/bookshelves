import {Component, OnDestroy, OnInit} from '@angular/core';
import {Book} from '../models/book.model';
import {Subscription} from 'rxjs';
import {BooksService} from '../services/books.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.scss']
})
export class BookListComponent implements OnInit, OnDestroy {

  books: Book[];
  booksSubscription: Subscription;

  constructor(private booksService: BooksService,
              private router: Router) { }

  ngOnInit() {
    this.booksSubscription = this.booksService.booksSubject.subscribe(
      (books: Book[]) => {
        this.books = books;
      }
    );
    this.booksService.getBooks();
    this.booksService.emitBooks();
  }

  onNewBook() {
    this.router.navigate(['/books', 'new']);
  }

  onDeleteBook(id: number, book: Book) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce livre: ' + book.title + ' ?')) {
      this.booksService.removeBook(id, book);
    } else {
      this.router.navigate(['/books']);
    }
  }

  onViewBook(id: number) {
    this.router.navigate(['/books', 'view', id]);
  }

  onEditBook(id: number) {
    this.router.navigate(['/books', 'edit', id]);
  }

  ngOnDestroy() {
    this.booksSubscription.unsubscribe();
  }

}
