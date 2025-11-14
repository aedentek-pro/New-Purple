"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const assignment_controller_1 = require("../controllers/assignment.controller");
const router = (0, express_1.Router)();
const assignmentValidators = [
    (0, express_validator_1.body)('course').isMongoId().withMessage('Course is required'),
    (0, express_validator_1.body)('title').isString().withMessage('Title is required'),
    (0, express_validator_1.body)('prompt').isString().withMessage('Prompt is required'),
];
router.get('/', assignment_controller_1.getAssignments);
router.get('/:id', [(0, express_validator_1.param)('id').isMongoId()], assignment_controller_1.getAssignmentById);
router.post('/', assignmentValidators, assignment_controller_1.createAssignment);
router.put('/:id', [(0, express_validator_1.param)('id').isMongoId(), ...assignmentValidators], assignment_controller_1.updateAssignment);
router.delete('/:id', [(0, express_validator_1.param)('id').isMongoId()], assignment_controller_1.deleteAssignment);
exports.default = router;
