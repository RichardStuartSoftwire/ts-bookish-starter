import { Request, TYPES } from 'tedious';

import Book from '../models/Book';
import createConnection from './connection';

export default function getAllBooks(): Promise<Book[]> {
    return new Promise((resolve, reject) => {
        createConnection().then((connection) => {
            const books: Book[] = [];

            const request = new Request(
                `SELECT b.BookId, b.Title, a.Name as Author, b.ISBN, b.TotalCopies
                    FROM Book b
                    LEFT JOIN Book_Author Ba ON b.BookId = ba.BookId
                    LEFT JOIN Author a ON ba.AuthorId = a.AuthorId`,
                (err) => {
                    connection.close();
                    if (err) {
                        reject(err);
                    } else {
                        resolve(books);
                    }
                },
            );

            request.on('row', (columns) => {
                books.push(
                    new Book(
                        columns[0].value,
                        columns[1].value,
                        columns[2].value,
                        columns[3].value,
                        columns[4].value,
                    ),
                );
            });

            connection.execSql(request);
        }, reject);
    });
}

export function getSingleBook(bookId: number): Promise<Book | undefined> {
    return new Promise((resolve, reject) => {
        createConnection().then((connection) => {
            let book: Book;

            const request = new Request(
                `SELECT b.BookId, b.Title, a.Name as Author, b.ISBN, b.TotalCopies
                    FROM Book b
                    LEFT JOIN Book_Author Ba ON b.BookId = ba.BookId
                    LEFT JOIN Author a ON ba.AuthorId = a.AuthorId
                    WHERE b.BookId = @bookId`,
                (err) => {
                    connection.close();
                    if (err) {
                        reject(err);
                    } else {
                        resolve(book);
                    }
                },
            );

            request.addParameter('bookId', TYPES.Int, bookId);

            request.on('row', (columns) => {
                book = new Book(
                    columns[0].value,
                    columns[1].value,
                    columns[2].value,
                    columns[3].value,
                    columns[4].value,
                );
            });

            connection.execSql(request);
        }, reject);
    });
}

export function findAuthorByName(name: string): Promise<number | undefined> {
    return new Promise((resolve, reject) => {
        createConnection().then((connection) => {
            let authorId: number | undefined;

            const request = new Request(
                'SELECT AuthorId FROM Author WHERE Name = @name',
                (err) => {
                    connection.close();
                    if (err) {
                        reject(err);
                    } else {
                        resolve(authorId);
                    }
                },
            );

            request.addParameter('name', TYPES.NVarChar, name);

            request.on('row', (columns) => {
                authorId = columns[0].value;
            });

            connection.execSql(request);
        }, reject);
    });
}

export function createAuthor(name: string): Promise<number> {
    return new Promise((resolve, reject) => {
        createConnection().then((connection) => {
            let authorId: number;

            const request = new Request(
                'INSERT INTO Author (Name) OUTPUT INSERTED.AuthorId VALUES (@name)',
                (err) => {
                    connection.close();
                    if (err) {
                        reject(err);
                    } else {
                        resolve(authorId);
                    }
                },
            );

            request.addParameter('name', TYPES.NVarChar, name);

            request.on('row', (columns) => {
                authorId = columns[0].value;
            });

            connection.execSql(request);
        }, reject);
    });
}

export function createBook(book: {
    title: string;
    isbn: string;
    totalCopies: number;
}): Promise<number> {
    return new Promise((resolve, reject) => {
        createConnection().then((connection) => {
            let bookId: number;

            const request = new Request(
                'INSERT INTO Book (Title, ISBN, TotalCopies) OUTPUT INSERTED.BookId VALUES (@title, @isbn, @totalCopies)',
                (err) => {
                    connection.close();
                    if (err) {
                        reject(err);
                    } else {
                        resolve(bookId);
                    }
                },
            );

            request.addParameter('title', TYPES.NVarChar, book.title);
            request.addParameter('isbn', TYPES.NVarChar, book.isbn);
            request.addParameter('totalCopies', TYPES.Int, book.totalCopies);

            request.on('row', (columns) => {
                bookId = columns[0].value;
            });

            connection.execSql(request);
        }, reject);
    });
}

export function linkBookAuthor(
    bookId: number,
    authorId: number,
): Promise<void> {
    return new Promise((resolve, reject) => {
        createConnection().then((connection) => {
            const request = new Request(
                'INSERT INTO Book_Author (BookId, AuthorId) VALUES (@bookId, @authorId)',
                (err) => {
                    connection.close();
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                },
            );

            request.addParameter('bookId', TYPES.Int, bookId);
            request.addParameter('authorId', TYPES.Int, authorId);

            connection.execSql(request);
        }, reject);
    });
}
