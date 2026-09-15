import { Router, Request, Response } from 'express';
import getAllBooks, {
    getSingleBook,
    findAuthorByName,
    createAuthor,
    createBook as createBookQuery,
    linkBookAuthor,
} from '../db/bookQueries';

class BookController {
    router: Router;

    constructor() {
        this.router = Router();
        this.router.get('/', this.getBooks.bind(this));
        this.router.get('/:bookId', this.getBook.bind(this));
        this.router.post('/', this.createBook.bind(this));
    }

    async getBooks(req: Request, res: Response) {
        try {
            const books = await getAllBooks();
            res.json(books);
        } catch (err) {
            console.error(err);
            res.status(500).json({
                error: 'server_error',
                error_description: 'Failed to retrieve books.',
            });
        }
    }

    async getBook(req: Request, res: Response) {
        try {
            const book = await getSingleBook(parseInt(req.params.bookId, 10));
            console.log(book);
            if (!book) {
                return res.status(404).json({
                    error: 'not_found',
                    error_description: 'Book not found.',
                });
            }
            res.json(book);
        } catch (err) {
            console.error(err);
            res.status(500).json({
                error: 'server_error',
                error_description: 'Failed to retrieve book.',
            });
        }
    }

    async createBook(req: Request, res: Response) {
        const { title, isbn, author } = req.body;
        const totalCopies = Number(req.body.totalCopies);

        if (!title || !isbn || !author || Number.isNaN(totalCopies)) {
            return res.status(400).json({
                error: 'invalid_request',
                error_description:
                    'title, isbn, totalCopies, and author are required.',
            });
        }

        try {
            let authorId = await findAuthorByName(author);
            if (!authorId) {
                authorId = await createAuthor(author);
            }

            const bookId = await createBookQuery({ title, isbn, totalCopies });
            await linkBookAuthor(bookId, authorId);

            const book = await getSingleBook(bookId);
            res.status(201).json(book);
        } catch (err) {
            console.error(err);
            res.status(500).json({
                error: 'server_error',
                error_description: 'Failed to create book.',
            });
        }
    }
}

export default new BookController().router;
