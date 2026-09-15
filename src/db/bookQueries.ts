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
