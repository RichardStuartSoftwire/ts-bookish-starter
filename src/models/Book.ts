export default class Book {
    bookId: number;
    title: string;
    author: string;
    isbn: string;
    totalCopies: number;

    constructor(
        bookId: number,
        title: string,
        author: string,
        isbn: string,
        totalCopies: number,
    ) {
        this.bookId = bookId;
        this.title = title;
        this.author = author;
        this.isbn = isbn;
        this.totalCopies = totalCopies;
    }
}
