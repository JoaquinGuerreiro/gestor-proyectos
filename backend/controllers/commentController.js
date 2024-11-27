const Comment = require('../models/Comment');
const Project = require('../models/Project');
const catchAsync = require('../utils/catchAsync');

exports.getComments = catchAsync(async (req, res) => {
  const comments = await Comment.find({ project: req.params.projectId })
    .populate('author', 'username')
    .sort('-createdAt');

  res.status(200).json({
    status: 'success',
    data: comments
  });
});

exports.createComment = catchAsync(async (req, res) => {
  // Verificar que el proyecto existe
  const project = await Project.findById(req.params.projectId);
  if (!project) {
    return res.status(404).json({
      status: 'error',
      message: 'Proyecto no encontrado'
    });
  }

  const comment = await Comment.create({
    content: req.body.content,
    author: req.user.id,
    project: req.params.projectId
  });

  await comment.populate('author', 'username');

  res.status(201).json({
    status: 'success',
    data: comment
  });
}); 