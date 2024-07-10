import {Router, Request, Response} from 'express';
import Todo from '../models/todo.model';

const router = Router();

router.get("/", async (req: Request, res: Response) => {
    try {
        const todos = await Todo.find();
        return res.status(200).json(todos);
    } catch (error) {
        return res.status(500).json({message: error});
    }
});

router.post("/", async (req: Request, res: Response) => {
    try {
        const todo = new Todo({
            title: req.body.title,
            description: req.body.description,
            severity: req.body.severity,
            isComplete: req.body.isComplete || false
        });
        const newTodo = await todo.save();
        return res.status(201).json(newTodo);
    } catch (error) {
        return res.status(500).json({message: error});
    }
})

router.get("/:id", async (req: Request, res: Response) => {
    try {
        const todo = await Todo.findById(req.params.id);
        if (!todo) {
            return res.status(404).json({message: "Todo not found"});
        }
        return res.status(200).json(todo);
    } catch (error) {
        return res.status(500).json({message: error});
    }
})

router.put("/:id", async (req: Request, res: Response) => {
    try {
        const todo = await Todo.findByIdAndUpdate(req.params.id, {
            title: req.body.title,
            description: req.body.description,
            severity: req.body.severity,
            isComplete: req.body.isComplete
        }, {new: true});
        if (!todo) {
            return res.status(404).json({message: "Todo not found"});
        }
        return res.status(200).json(todo);
    } catch (error) {
        return res.status(500).json({message: error});
    }
})

router.put("/:id/complete", async (req: Request, res: Response) => {
    try {
        const todo = await Todo.findByIdAndUpdate(req.params.id, {
            isComplete: req.body.isComplete
        }, {new: true});
        if (!todo) {
            return res.status(404).json({message: "Todo not found"});
        }
        return res.status(200).json(todo);
    } catch (error) {
        return res.status(500).json({message: error});
    }
})

router.delete("/:id", async (req: Request, res: Response) => {
    try {
        const todo = await Todo.findByIdAndDelete(req.params.id);
        if (!todo) {
            return res.status(404).json({message: "Todo not found"});
        }
        return res.status(200).json({message: "Todo deleted successfully"});
    } catch (error) {
        return res.status(500).json({message: error});
    }
})


export default router;
