import { Router, Request, Response } from 'express';
import Todo from '../models/todo.model';

const router = Router();

/**
 * GET request handler for retrieving all Todos.
 *
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @returns {Response} - Returns a JSON response with status 200 and an array of Todos if successful.
 *                      Returns a JSON response with status 500 and an error message if an error occurs.
 */
router.get("/", async (req: Request, res: Response): Promise<Response> => {
    try {
        const todos = await Todo.find();
        return res.status(200).json(todos);
    } catch (error) {
        return res.status(500).json({ message: (error as Error).message });
    }
});

/**
 * POST request handler for creating a new Todo.
 *
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @returns {Response} - Returns a JSON response with status 201 and the newly created Todo if successful.
 *                      Returns a JSON response with status 500 and an error message if an error occurs.
 */
router.post("/", async (req: Request, res: Response): Promise<Response> => {
    try {
        const { title, description, severity, isComplete = false } = req.body;
        const todo = new Todo({
            title,
            description,
            severity,
            isComplete
        });
        const newTodo = await todo.save();
        return res.status(201).json(newTodo);
    } catch (error) {
        return res.status(500).json({ message: (error as Error).message });
    }
});

/**
 * GET request handler for retrieving a single Todo by its ID.
 *
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @returns {Response} - Returns a JSON response with status 200 and the requested Todo if successful.
 *                      Returns a JSON response with status 404 and a message if the Todo is not found.
 *                      Returns a JSON response with status 500 and an error message if an error occurs.
 */
router.get("/:id", async (req: Request, res: Response): Promise<Response> => {
    try {
        const todo = await Todo.findById(req.params.id);

        if (!todo) return res.status(404).json({ message: "Todo not found" });

        return res.status(200).json(todo);
    } catch (error) {
        return res.status(500).json({ message: (error as Error).message });
    }
});

/**
 * PUT request handler for updating a Todo by its ID.
 *
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @returns {Response} - Returns a JSON response with status 200 and the updated Todo if successful.
 *                      Returns a JSON response with status 404 and a message if the Todo is not found.
 *                      Returns a JSON response with status 500 and an error message if an error occurs.
 */
router.put("/:id", async (req: Request, res: Response): Promise<Response> => {
    try {
        const { title, description, severity, isComplete } = req.body;
        const todo = await Todo.findByIdAndUpdate(req.params.id, {
            title,
            description,
            severity,
            isComplete
        }, { new: true });

        if (!todo) return res.status(404).json({ message: "Todo not found" });

        return res.status(200).json(todo);
    } catch (error) {
        return res.status(500).json({ message: (error as Error).message });
    }
});

/**
 * PUT request handler for marking a Todo as complete or incomplete by its ID.
 *
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @returns {Response} - Returns a JSON response with status 200 and the updated Todo if successful.
 *                      Returns a JSON response with status 404 and a message if the Todo is not found.
 *                      Returns a JSON response with status 500 and an error message if an error occurs.
 */
router.put("/:id/complete", async (req: Request, res: Response): Promise<Response> => {
    try {
        const { isComplete } = req.body;
        const todo = await Todo.findByIdAndUpdate(req.params.id, {
            isComplete
        }, { new: true });

        if (!todo) return res.status(404).json({ message: "Todo not found" });

        return res.status(200).json(todo);
    } catch (error) {
        return res.status(500).json({ message: (error as Error).message });
    }
});

/**
 * DELETE request handler for deleting a Todo by its ID.
 *
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @returns {Response} - Returns a JSON response with status 200 and a success message if the Todo is deleted successfully.
 *                      Returns a JSON response with status 404 and a message if the Todo is not found.
 *                      Returns a JSON response with status 500 and an error message if an error occurs.
 */
router.delete("/:id", async (req: Request, res: Response): Promise<Response> => {
    try {
        const todo = await Todo.findByIdAndDelete(req.params.id);

        if (!todo) return res.status(404).json({ message: "Todo not found" });

        return res.status(200).json({ message: "Todo deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: (error as Error).message });
    }
});

export default router;
