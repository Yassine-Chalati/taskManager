// middlewares/validationMiddleware.js
const { body, validationResult } = require('express-validator');

// Validate task fields
exports.validateTask = [
    body('title').notEmpty().withMessage('Title is required'),
    body('priority').isIn(['low', 'medium', 'high']).withMessage('Priority must be one of: low, medium, high'),
    body('description').notEmpty().withMessage('Description is required'),
    // Validate that the due_date is a valid ISO8601 date
    body('due_date')
        .isISO8601().withMessage('Due date must be in a valid ISO8601 format')
        .toDate(), // Optionally convert to Date object if needed
    body('status').isIn(['pending', 'in-progress', 'completed']).withMessage('Status must be one of: pending, in-progress, completed'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];
