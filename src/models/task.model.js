const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const taskSchema = mongoose.Schema(
  {
    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Created by user is required'],
    },
    updatedBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
    description: {
      type: String,
    },
    shortId: {
      type: String,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
    },
    attachments: [
      {
        type: String,
      },
    ],
    comments: {
      user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
      },
      content: {
        type: String,
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
    assignees: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Assignees are required'],
      },
    ],
    status: {
      type: mongoose.Schema.ObjectId,
      ref: 'Status',
      required: [true, 'Status is required'],
    },
    notifyAssigneesOnChange: {
      type: Boolean,
      default: true,
    },
    subTasks: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Task',
      },
    ],
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    dueDate: {
      type: Date,
    },
    labels: [
      {
        type: String,
      },
    ],
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
taskSchema.plugin(toJSON);
taskSchema.plugin(paginate);

/**
 * @typedef Task
 */
const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
