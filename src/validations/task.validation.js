const Joi = require('joi');
const { objectId } = require('./custom.validation'); // Assuming you have custom validation functions

const createTask = {
  body: Joi.object().keys({
    description: Joi.string().allow(''),
    shortId: Joi.string().allow(''),
    title: Joi.string().required(),
    content: Joi.string().required(),
    attachments: Joi.array().items(Joi.string()).default([]),
    comments: Joi.array()
      .items(
        Joi.object({
          user: Joi.string().custom(objectId).required(),
          content: Joi.string().required(),
          createdAt: Joi.date().default(Date.now),
        })
      )
      .default([]),
    assignees: Joi.array().items(Joi.string().custom(objectId)).min(1).required(),
    status: Joi.string().custom(objectId).required(),
    notifyAssigneesOnChange: Joi.boolean().default(true),
    subTasks: Joi.array().items(Joi.string().custom(objectId)).default([]),
    priority: Joi.string().valid('low', 'medium', 'high').default('medium'),
    dueDate: Joi.date(),
    labels: Joi.array().items(Joi.string()).default([]),
  }),
};

const getTasks = {
  query: Joi.object().keys({
    assignees: Joi.string(),
    createdBy: Joi.string(),
    createdAt: Joi.date(),
    status: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer().min(1).default(10),
    page: Joi.number().integer().min(1).default(1),
  }),
};

const getTask = {
  params: Joi.object().keys({
    taskId: Joi.string().custom(objectId).required(),
  }),
};

const updateTask = {
  params: Joi.object().keys({
    taskId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object()
    .keys({
      title: Joi.string(),
      content: Joi.string(),
      description: Joi.string(),
      attachments: Joi.array().items(Joi.string()),
      assignees: Joi.array().items(Joi.string().custom(objectId)),
      status: Joi.string().custom(objectId),
      notifyAssigneesOnChange: Joi.boolean(),
      subTasks: Joi.array().items(Joi.string().custom(objectId)),
      priority: Joi.string().valid('low', 'medium', 'high'),
      dueDate: Joi.date(),
      labels: Joi.array().items(Joi.string()),
      comments: Joi.array()
        .items(
          Joi.object({
            user: Joi.string().custom(objectId).required(),
            content: Joi.string().required(),
            createdAt: Joi.date().default(Date.now),
          })
        )
        .default([]),
    })
    .min(1),
};

const deleteTask = {
  params: Joi.object().keys({
    taskId: Joi.string().custom(objectId).required(),
  }),
};

module.exports = {
  createTask,
  getTasks,
  getTask,
  updateTask,
  deleteTask,
};
