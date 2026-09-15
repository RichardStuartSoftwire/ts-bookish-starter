import { Router, Request, Response } from 'express';
import getAllBooks from '../db/bookQueries';

class BookController {
    router: Router;

    constructor() {
        this.router = Router();
        this.router.get('/', this.getBooks.bind(this));
        this.router.get('/:id', this.getBook.bind(this));
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

    getBook(req: Request, res: Response) {
        // TODO: implement functionality
        return res.status(500).json({
            error: 'server_error',
            error_description: 'Endpoint not implemented yet.',
        });
    }

    createBook(req: Request, res: Response) {
        // TODO: implement functionality
        return res.status(500).json({
            error: 'server_error',
            error_description: 'Endpoint not implemented yet.',
        });
    }
}

export default new BookController().router;
