const faker = require('faker');
const { Task } = require('../../../src/models');

describe('User model', () => {
  describe('User validation', () => {
    let newTask;
    beforeEach(() => {
      newTask = {
        name: faker.name.findName(),
        email: faker.internet.email().toLowerCase(),
        password: 'password1',
        role: 'user',
      };
    });

    test('should correctly validate a valid user', async () => {
      await expect(new Task(newTask).validate()).rejects.toThrow();
    });

    test('should throw a validation error if email is invalid', async () => {
      newTask.email = 'invalidEmail';
      await expect(new Task(newTask).validate()).rejects.toThrow();
    });

    test('should throw a validation error if password length is less than 8 characters', async () => {
      newTask.password = 'passwo1';
      await expect(new Task(newTask).validate()).rejects.toThrow();
    });

    test('should throw a validation error if password does not contain numbers', async () => {
      newTask.password = 'password';
      await expect(new Task(newTask).validate()).rejects.toThrow();
    });

    test('should throw a validation error if password does not contain letters', async () => {
      newTask.password = '11111111';
      await expect(new Task(newTask).validate()).rejects.toThrow();
    });

    test('should throw a validation error if role is unknown', async () => {
      newTask.role = 'invalid';
      await expect(new Task(newTask).validate()).rejects.toThrow();
    });
    // });

    // describe('User toJSON()', () => {
    //   test('should not return user password when toJSON is called', () => {
    //     const newTask = {
    //       name: faker.name.findName(),
    //       email: faker.internet.email().toLowerCase(),
    //       password: 'password1',
    //       role: 'user',
    //     };
    //     expect(new Task(newTask).toJSON()).not.toHaveProperty('password');
    //   });
  });
});
