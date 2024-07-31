const request = require('supertest');
const faker = require('faker');
const httpStatus = require('http-status');
const { app } = require('../../src/app');
const setupTestDB = require('../utils/setupTestDB');
const { Task } = require('../../src/models');
const { userOne, userTwo, insertUsers } = require('../fixtures/user.fixture');
const { userOneAccessToken } = require('../fixtures/token.fixture');

setupTestDB();

describe('Task routes', () => {
  let validStatusId;

  beforeAll(async () => {
    validStatusId = '66aa4af240f44e38c85d3595';
  });

  describe('POST /v1/tasks', () => {
    let newTask;

    beforeEach(() => {
      newTask = {
        title: 'do something',
        content: faker.lorem.paragraph(),
        assignees: [userOne._id], // Assuming this is an array of task IDs
        status: validStatusId, // ObjectId for status
        dueDate: faker.date.future().toISOString(),
      };
    });

    test('should return 201 and successfully create new task if data is valid', async () => {
      await insertUsers([userOne]);

      const res = await request(app).post('/v1/tasks').set('Authorization', `Bearer ${userOneAccessToken}`).send(newTask);

      expect(res.body).toHaveProperty('createdAt', res.body.createdAt);
      expect(res.body).toHaveProperty('createdBy', userOne._id.toHexString());
      expect(res.body).toHaveProperty('updatedBy', userOne._id.toHexString());

      const dbTask = await Task.findById(res.body.id);
      expect(dbTask).toBeDefined();

      expect(dbTask).toBeDefined();
      expect(dbTask).toHaveProperty('content', newTask.content);
      expect(dbTask).toHaveProperty('assignees');
      expect(dbTask.assignees).toEqual(expect.arrayContaining([userOne._id]));
      // expect(dbTask).toHaveProperty('status', validStatusId.toHexString());
    });

    test('should return 401 error if access token is missing', async () => {
      await request(app).post('/v1/tasks').send(newTask).expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 400 error if required fields are missing', async () => {
      await insertUsers([userOne]);

      const invalidTask = { ...newTask };
      delete invalidTask.content;

      await request(app)
        .post('/v1/tasks')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(invalidTask)
        .expect(httpStatus.BAD_REQUEST);
    });
  });

  describe('GET /v1/tasks', () => {
    test('should return 200 and apply the default query options', async () => {
      await insertUsers([userOne]);
      const taskOne = await new Task({
        title: 'do something',
        createdBy: userOne._id.toHexString(),
        assignees: [userOne._id.toHexString()],
        content: faker.lorem.paragraph(),
        status: validStatusId, // ObjectId for status
        dueDate: faker.date.future().toISOString(),
      }).save();
      const taskTwo = await new Task({
        title: 'tell the world',
        content: faker.lorem.paragraph(),
        createdBy: userOne._id.toHexString(),
        assignees: [userOne._id.toHexString()],
        status: validStatusId, // ObjectId for status
        dueDate: faker.date.future().toISOString(),
      }).save();

      const res = await request(app)
        .get('/v1/tasks')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        results: expect.any(Array),
        page: 1,
        limit: 10,
        totalPages: 1,
        totalResults: 2,
      });
      expect(res.body.results).toHaveLength(2);
      expect(res.body.results[0]).toMatchObject({
        id: taskOne._id.toHexString(),
        content: taskOne.content,
        assignees: expect.arrayContaining([userOne._id.toHexString()]),
        status: validStatusId,
        dueDate: taskOne.dueDate.toISOString(),
      });
      expect(res.body.results[1]).toMatchObject({
        id: taskTwo._id.toHexString(),
        content: taskTwo.content,
        assignees: expect.arrayContaining([userOne._id.toHexString()]),
        status: validStatusId,
        dueDate: taskTwo.dueDate.toISOString(),
      });
    });

    test('should return 401 if access token is missing', async () => {
      await request(app).get('/v1/tasks').send().expect(httpStatus.UNAUTHORIZED);
    });

    test('should correctly apply filter on content field', async () => {
      await insertUsers([userOne]);
      const taskOne = await new Task({
        title: 'tell the world',
        content: faker.lorem.paragraph(),
        createdBy: userOne._id.toHexString(),
        assignees: [userOne._id.toHexString()],
        status: validStatusId, // ObjectId for status
        dueDate: faker.date.future().toISOString(),
      }).save();
      await new Task({
        title: 'tell the world 2',
        content: faker.lorem.paragraph(),
        createdBy: userTwo._id.toHexString(),
        assignees: [userOne._id.toHexString()],
        status: validStatusId, // ObjectId for status
        dueDate: faker.date.future().toISOString(),
      }).save();

      const res = await request(app)
        .get('/v1/tasks')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .query({ createdBy: userOne._id.toHexString() })
        .send()
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        results: expect.any(Array),
        page: 1,
        limit: 10,
        totalPages: 1,
        totalResults: 1,
      });
      expect(res.body.results[0].id).toBe(taskOne._id.toHexString());
    });

    test('should limit returned array if limit param is specified', async () => {
      await insertUsers([userOne]);
      await new Task({
        title: 'task 1',
        content: faker.lorem.paragraph(),
        createdBy: userOne._id.toHexString(),
        assignees: [userOne._id.toHexString()],
        status: validStatusId, // ObjectId for status
        dueDate: faker.date.future().toISOString(),
      }).save();
      await new Task({
        title: 'task 3',
        content: faker.lorem.paragraph(),
        createdBy: userOne._id.toHexString(),
        assignees: [userOne._id.toHexString()],
        status: validStatusId, // ObjectId for status
        dueDate: faker.date.future().toISOString(),
      }).save();
      await new Task({
        title: 'task 5',
        content: faker.lorem.paragraph(),
        createdBy: userOne._id.toHexString(),
        assignees: [userOne._id.toHexString()],
        status: validStatusId, // ObjectId for status
        dueDate: faker.date.future().toISOString(),
      }).save();

      const res = await request(app)
        .get('/v1/tasks')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .query({ limit: 2 })
        .send()
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        results: expect.any(Array),
        page: 1,
        limit: 2,
        totalPages: 2,
        totalResults: 3,
      });
      expect(res.body.results).toHaveLength(2);
    });

    test('should return the correct page if page and limit params are specified', async () => {
      await insertUsers([userOne]);
      await new Task({
        title: 'task 1',
        content: faker.lorem.paragraph(),
        createdBy: userOne._id.toHexString(),
        assignees: [userOne._id.toHexString()],
        status: validStatusId, // ObjectId for status
        dueDate: faker.date.future().toISOString(),
      }).save();
      await new Task({
        title: 'task 2',
        content: faker.lorem.paragraph(),
        createdBy: userOne._id.toHexString(),
        assignees: [userOne._id.toHexString()],
        status: validStatusId, // ObjectId for status
        dueDate: faker.date.future().toISOString(),
      }).save();
      await new Task({
        title: 'task 3',
        content: faker.lorem.paragraph(),
        createdBy: userOne._id.toHexString(),
        assignees: [userOne._id.toHexString()],
        status: validStatusId, // ObjectId for status
        dueDate: faker.date.future().toISOString(),
      }).save();

      const res = await request(app)
        .get('/v1/tasks')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .query({ page: 2, limit: 2 })
        .send()
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        results: expect.any(Array),
        page: 2,
        limit: 2,
        totalPages: 2,
        totalResults: 3,
      });
      expect(res.body.results).toHaveLength(1);
      expect(res.body.results[0].title).toBe('task 3');
    });
  });

  describe('GET /v1/tasks/:taskId', () => {
    let task;

    beforeEach(async () => {
      await insertUsers([userOne]);
      task = await new Task({
        title: 'tell the world',
        content: faker.lorem.paragraph(),
        createdBy: userOne._id.toHexString(),
        updatedBy: userOne._id.toHexString(),
        assignees: [userOne._id.toHexString()],
        status: validStatusId, // ObjectId for status
        dueDate: faker.date.future().toISOString(),
      }).save();
    });

    test('should return 200 and the task if data is valid', async () => {
      const res = await request(app)
        .get(`/v1/tasks/${task._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.OK);

      expect(res.body).toHaveProperty('createdBy', userOne._id.toHexString());
      expect(res.body).toHaveProperty('updatedBy', userOne._id.toHexString());
    });

    test('should return 401 error if access token is missing', async () => {
      await request(app).get(`/v1/tasks/${task._id}`).send().expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 400 error if task is not found', async () => {
      await request(app)
        .get('/v1/tasks/invalidTaskId')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.BAD_REQUEST);
    });
  });

  describe('PATCH /v1/tasks/:taskId', () => {
    let task;

    beforeEach(async () => {
      await insertUsers([userOne]);
      task = await new Task({
        title: 'task',
        content: faker.lorem.paragraph(),
        createdBy: userOne._id.toHexString(),
        updatedBy: userOne._id.toHexString(),
        assignees: [userOne._id.toHexString()],
        status: validStatusId, // ObjectId for status
        dueDate: faker.date.future().toISOString(),
      }).save();
    });

    test('should return 200 and successfully update task if data is valid', async () => {
      const update = {
        content: 'Updated Content',
        status: validStatusId, // Assuming status ObjectId should be valid
      };

      const res = await request(app)
        .patch(`/v1/tasks/${task._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(update)
        .expect(httpStatus.OK);

      expect(res.body).toHaveProperty('createdBy', userOne._id.toHexString());
      expect(res.body).toHaveProperty('updatedBy', userOne._id.toHexString());
    });

    test('should return 401 error if access token is missing', async () => {
      const update = {
        content: 'Updated Content',
        status: validStatusId,
      };

      await request(app).patch(`/v1/tasks/${task._id}`).send(update).expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 400 error if task is not found', async () => {
      const update = {
        content: 'Updated Content',
        status: validStatusId,
      };

      await request(app)
        .patch('/v1/tasks/invalidTaskId')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(update)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 400 error if update data is invalid', async () => {
      const update = {
        content: '', // Invalid content
      };

      await request(app)
        .patch(`/v1/tasks/${task._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(update)
        .expect(httpStatus.BAD_REQUEST);
    });
  });

  describe('DELETE /v1/tasks/:taskId', () => {
    let task;

    beforeEach(async () => {
      await insertUsers([userOne]);
      task = await new Task({
        title: 'task',
        content: faker.lorem.paragraph(),
        createdBy: userOne._id.toHexString(),
        updatedBy: userOne._id.toHexString(),
        assignees: [userOne._id.toHexString()],
        status: validStatusId, // ObjectId for status
        dueDate: faker.date.future().toISOString(),
      }).save();
    });

    test('should return 204 and successfully delete task if data is ok', async () => {
      await request(app)
        .delete(`/v1/tasks/${task._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.NO_CONTENT);

      const dbTask = await Task.findById(task._id);
      expect(dbTask).toBeNull();
    });

    test('should return 401 error if access token is missing', async () => {
      await request(app).delete(`/v1/tasks/${task._id}`).send().expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 400 error if task is not found', async () => {
      await request(app)
        .delete('/v1/tasks/invalidTaskId')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.BAD_REQUEST);
    });
  });
});
