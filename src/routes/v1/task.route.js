const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const taskValidation = require('../../validations/task.validation');
const taskController = require('../../controllers/task.controller');

const router = express.Router();

router
  .route('/')
  .post(auth('manageTasks'), validate(taskValidation.createTask), taskController.createTask)
  .get(auth('getTasks'), validate(taskValidation.getTasks), taskController.getTasks);

router
  .route('/:taskId')
  .get(auth('getTasks'), validate(taskValidation.getTask), taskController.getTask)
  .patch(auth('manageTasks'), validate(taskValidation.updateTask), taskController.updateTask)
  .delete(auth('manageTasks'), validate(taskValidation.deleteTask), taskController.deleteTask);

module.exports = router;
/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: Task management and retrieval
 */

/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Create a task
 *     description: Only admins can create tasks.
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *               - assignees
 *               - status
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               description:
 *                 type: string
 *               shortId:
 *                 type: string
 *               attachments:
 *                 type: array
 *                 items:
 *                   type: string
 *               comments:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: string
 *                       format: objectId
 *                     content:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *               assignees:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: objectId
 *               status:
 *                 type: string
 *                 format: objectId
 *               notifyAssigneesOnChange:
 *                 type: boolean
 *               subTasks:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: objectId
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high]
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *               labels:
 *                 type: array
 *                 items:
 *                   type: string
 *               isEmailVerified:
 *                 type: boolean
 *             example:
 *               title: "Sample Task"
 *               content: "Task content"
 *               assignees: ["605c72ef8f3b2c001f4d8e8e"]
 *               status: "605c72ef8f3b2c001f4d8e8e"
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *
 *   get:
 *     summary: Get all tasks
 *     description: Retrieve a list of tasks with optional filtering and pagination. Only admins can retrieve all tasks.
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: assignees
 *         schema:
 *           type: string
 *           format: objectId
 *         description: Filter tasks by assignees
 *       - in: query
 *         name: createdAt
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Filter tasks by creation date
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           format: objectId
 *         description: Filter tasks by status
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: Sort tasks by field (e.g., title:asc)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 10
 *         description: Maximum number of tasks to return
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Task'
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 totalPages:
 *                   type: integer
 *                   example: 1
 *                 totalResults:
 *                   type: integer
 *                   example: 1
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /tasks/{taskId}:
 *   get:
 *     summary: Get a task
 *     description: Retrieve a specific task by its ID. Users can fetch their own tasks, and admins can fetch any task.
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *         description: Task ID
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   patch:
 *     summary: Update a task
 *     description: Update a specific task. Users can update their own tasks, and admins can update any task.
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *         description: Task ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               description:
 *                 type: string
 *               shortId:
 *                 type: string
 *               attachments:
 *                 type: array
 *                 items:
 *                   type: string
 *               comments:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: string
 *                       format: objectId
 *                     content:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *               assignees:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: objectId
 *               status:
 *                 type: string
 *                 format: objectId
 *               notifyAssigneesOnChange:
 *                 type: boolean
 *               subTasks:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: objectId
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high]
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *               labels:
 *                 type: array
 *                 items:
 *                   type: string
 *               isEmailVerified:
 *                 type: boolean
 *             example:
 *               title: "Updated Task"
 *               content: "Updated task content"
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   delete:
 *     summary: Delete a task
 *     description: Delete a specific task. Users can delete their own tasks, and admins can delete any task.
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *         description: Task ID
 *     responses:
 *       "200":
 *         description: No content
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
