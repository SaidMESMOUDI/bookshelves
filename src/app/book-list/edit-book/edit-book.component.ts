import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Book} from '../../models/book.model';
import {BooksService} from '../../services/books.service';
import {ActivatedRoute, Router} from '@angular/router';


@Component({
  selector: 'app-edit-book',
  templateUrl: './edit-book.component.html',
  styleUrls: ['./edit-book.component.scss']
})
export class EditBookComponent implements OnInit {

  editForm: FormGroup;
  id: number = this.route.snapshot.params.id;

  lastBook: Book;
  lastTitle: string;
  lastAuthor: string;
  lastPhoto: string;

  fileIsUploading = false;
  fileUrl: string;
  fileUploaded = false;

  constructor(private formBuilder: FormBuilder,
              private booksService: BooksService,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {
    this.initForm();
  }

  private initForm() {
    this.booksService.getSingleBook(+this.id).then(
      (book: Book) => {
        this.lastBook = book;
        this.lastTitle = book.title;
        this.lastAuthor = book.author;
        this.lastPhoto = book.photo;
      }
    );

    this.editForm = this.formBuilder.group(
      {
        title: ['', Validators.required],
        author: ['', Validators.required]
      }
    );
  }

  onEditBook() {
    if (confirm('Are you sure to edit this book n°' + (+this.id + 1))) {
      const title = this.editForm.get('title').value;
      const author = this.editForm.get('author').value;
      const editBook = new Book(title, author);

      if (this.fileUrl && this.fileUrl !== '') {
        editBook.photo = this.fileUrl;
      }
      this.booksService.deletePhotoBook(this.lastPhoto);
      this.booksService.updateBook(this.id, editBook);
      this.router.navigate(['/books']);
    } else {
      this.router.navigate(['/books']);
    }
  }

  onUploadFile(file: File) {
    this.fileIsUploading = true;
    this.booksService.uploadFile(file).then(
      (url: string) => {
        this.fileUrl = url;
        this.fileIsUploading = false;
        this.fileUploaded = true;
      }
    );
  }

  detectFiles(event) {
    this.onUploadFile(event.target.files[0]);
  }

  onBack() {
    this.router.navigate(['/books']);
  }

}
