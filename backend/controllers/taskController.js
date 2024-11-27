const taskService = require('../services/taskService');
const catchAsync = require('../utils/catchAsync');
const Task = require('../models/Task');

console.log('Cargando controlador de tareas...');

exports.createTask = catchAsync(async (req, res) => {
  const task = await taskService.createTask({
    ...req.body,
    creator: req.user.id
  });

  res.status(201).json({
    status: 'success',
    data: task
  });
});

exports.getTasks = catchAsync(async (req, res) => {
  console.log('Controller: getTasks');
  console.log('User ID:', req.user.id);
  
  const tasks = await Task.find({ creator: req.user.id })
    .populate('project', 'name')
    .sort({ createdAt: -1 });
  
  console.log('Tasks found:', tasks.length);
  
  res.status(200).json({
    status: 'success',
    data: tasks
  });
});

exports.updateTask = catchAsync(async (req, res) => {
  const task = await taskService.updateTask(req.params.id, req.user.id, req.body);
  
  res.status(200).json({
    status: 'success',
    data: task
  });
});

exports.deleteTask = catchAsync(async (req, res) => {
  await taskService.deleteTask(req.params.id, req.user.id);
  
  res.status(204).json({
    status: 'success',
    data: null
  });
});

console.log('Métodos exportados del controlador:', Object.keys(exports)); 