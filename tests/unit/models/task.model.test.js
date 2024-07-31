const faker = require('faker');
const mongoose = require('mongoose');
const { Task } = require('../../../src/models');

describe('Task model', () => {
  let newTask;
  describe('Task validation', () => {
    beforeEach(() => {
      newTask = {
        createdBy: mongoose.Types.ObjectId(),
        title: faker.lorem.sentence(),
        content: faker.lorem.paragraph(),
        assignees: [mongoose.Types.ObjectId()],
        status: mongoose.Types.ObjectId(),
      };
    });

    test('should correctly validate a valid task', async () => {
      await expect(new Task(newTask).validate()).resolves.toBeUndefined();
    });

    test('should throw a validation error if createdBy is not provided', async () => {
      delete newTask.createdBy;
      await expect(new Task(newTask).validate()).rejects.toThrow();
    });

    test('should throw a validation error if title is not provided', async () => {
      delete newTask.title;
      await expect(new Task(newTask).validate()).rejects.toThrow();
    });

    test('should throw a validation error if content is not provided', async () => {
      delete newTask.content;
      await expect(new Task(newTask).validate()).rejects.toThrow();
    });

    test('should throw a validation error if assignees are not provided', async () => {
      newTask.assignees = [];
      await expect(new Task(newTask).validate()).rejects.toThrow();
    });

    test('should throw a validation error if status is not provided', async () => {
      delete newTask.status;
      await expect(new Task(newTask).validate()).rejects.toThrow();
    });

    test('should throw a validation error if priority is invalid', async () => {
      newTask.priority = 'invalid';
      await expect(new Task(newTask).validate()).rejects.toThrow();
    });

    test('should throw a validation error if comments are not valid', async () => {
      newTask.comments = {
        user: mongoose.Types.ObjectId(),
        content: '',
      };
      await expect(new Task(newTask).validate()).rejects.toThrow();
    });

    test('should throw a validation error if subTasks contain invalid ObjectId', async () => {
      newTask.subTasks = ['invalidObjectId'];
      await expect(new Task(newTask).validate()).rejects.toThrow();
    });

    test('should validate if all required fields are provided and valid', async () => {
      await expect(new Task(newTask).validate()).resolves.toBeUndefined();
    });

    test('should validate if description is provided', async () => {
      newTask.description = faker.lorem.sentence();
      await expect(new Task(newTask).validate()).resolves.toBeUndefined();
    });

    test('should validate if shortId is provided', async () => {
      newTask.shortId = faker.random.alphaNumeric(10);
      await expect(new Task(newTask).validate()).resolves.toBeUndefined();
    });

    test('should validate if updatedBy is provided', async () => {
      newTask.updatedBy = mongoose.Types.ObjectId();
      await expect(new Task(newTask).validate()).resolves.toBeUndefined();
    });

    test('should validate if attachments are provided', async () => {
      newTask.attachments = [faker.system.filePath()];
      await expect(new Task(newTask).validate()).resolves.toBeUndefined();
    });

    test('should validate if notifyAssigneesOnChange is set to false', async () => {
      newTask.notifyAssigneesOnChange = false;
      await expect(new Task(newTask).validate()).resolves.toBeUndefined();
    });

    test('should validate if labels are provided', async () => {
      newTask.labels = [faker.lorem.word()];
      await expect(new Task(newTask).validate()).resolves.toBeUndefined();
    });

    test('should validate if dueDate is provided', async () => {
      newTask.dueDate = new Date();
      await expect(new Task(newTask).validate()).resolves.toBeUndefined();
    });
  });

  describe('Task toJSON()', () => {
    test('should not return internal properties when toJSON is called', () => {
      const taskObject = new Task(newTask).toJSON();
      expect(taskObject).not.toHaveProperty('__v');
      expect(taskObject).not.toHaveProperty('_id');
    });
  });

  describe('Task field presence', () => {
    test('should have createdBy field', () => {
      const task = new Task(newTask);
      expect(task).toHaveProperty('createdBy');
    });

    test('should have title field', () => {
      const task = new Task(newTask);
      expect(task).toHaveProperty('title');
    });

    test('should have content field', () => {
      const task = new Task(newTask);
      expect(task).toHaveProperty('content');
    });

    test('should have assignees field', () => {
      const task = new Task(newTask);
      expect(task).toHaveProperty('assignees');
    });

    test('should have status field', () => {
      const task = new Task(newTask);
      expect(task).toHaveProperty('status');
    });
  });

  describe('Task default values', () => {
    test('should set priority to medium by default', () => {
      const task = new Task(newTask);
      expect(task.priority).toBe('medium');
    });

    test('should set notifyAssigneesOnChange to true by default', () => {
      const task = new Task(newTask);
      expect(task.notifyAssigneesOnChange).toBe(true);
    });
  });
});
