const Project = require('../models/Project');
const catchAsync = require('../utils/catchAsync');
const CustomError = require('../utils/CustomError');
const Comment = require('../models/Comment');

exports.createProject = catchAsync(async (req, res) => {
  const project = await Project.create({
    ...req.body,
    creator: req.user.id
  });

  res.status(201).json({
    status: 'success',
    data: project,
    message: 'Proyecto creado exitosamente'
  });
});

exports.updateProject = catchAsync(async (req, res) => {
  const project = await Project.findOne({
    _id: req.params.id,
    creator: req.user.id
  });

  if (!project) {
    return res.status(404).json({
      status: 'error',
      message: 'Proyecto no encontrado o no tienes permisos para editarlo'
    });
  }

  const updatedProject = await Project.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  res.status(200).json({
    status: 'success',
    data: updatedProject
  });
});

exports.getProjects = catchAsync(async (req, res) => {
  console.log('Usuario autenticado:', req.user.id);
  
  const projects = await Project.find({ creator: req.user.id });
  
  console.log('Proyectos encontrados:', projects.length);
  console.log('IDs de los proyectos:', projects.map(p => ({
    id: p._id,
    creator: p.creator,
    name: p.name
  })));

  res.status(200).json({
    status: 'success',
    data: projects
  });
});

exports.deleteProject = catchAsync(async (req, res) => {
  const project = await Project.findOne({
    _id: req.params.id,
    creator: req.user.id
  });

  if (!project) {
    return res.status(404).json({
      status: 'error',
      message: 'Proyecto no encontrado o no tienes permisos para eliminarlo'
    });
  }

  await Project.findByIdAndDelete(req.params.id);

  res.status(200).json({
    status: 'success',
    message: 'Proyecto eliminado exitosamente'
  });
});

exports.toggleProjectVisibility = catchAsync(async (req, res) => {
  const project = await projectService.updateProject(
    req.params.id,
    req.user.id,
    { isPublic: req.body.isPublic }
  );
  res.json({
    status: 'success',
    data: project
  });
});

exports.addProjectMember = catchAsync(async (req, res) => {
  const { email, role } = req.body;
  const project = await projectService.addMember(
    req.params.id,
    req.user.id,
    email,
    role
  );
  res.json({
    status: 'success',
    data: project
  });
});

exports.removeProjectMember = catchAsync(async (req, res) => {
  const project = await projectService.removeMember(
    req.params.id,
    req.user.id,
    req.params.userId
  );
  res.json({
    status: 'success',
    data: project
  });
});

exports.getProject = async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      creator: req.user._id
    }).populate('tasks');
    
    if (!project) {
      return res.status(404).json({ mensaje: 'Proyecto no encontrado' });
    }
    
    res.json(project);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener el proyecto' });
  }
};

exports.getPublicProjects = async (req, res) => {
  try {
    const projects = await Project.find({ isPublic: true })
      .populate('creator', 'username email')
      .sort('-createdAt');

    res.status(200).json({
      status: 'success',
      data: projects
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error al obtener los proyectos públicos'
    });
  }
};

exports.getComments = catchAsync(async (req, res) => {
  const { projectId } = req.params;
  
  const comments = await Comment.find({ project: projectId })
    .populate('creator', 'username')
    .sort('-createdAt');

  res.status(200).json({
    status: 'success',
    data: comments
  });
});

exports.addComment = catchAsync(async (req, res) => {
  const { projectId } = req.params;
  const { content } = req.body;

  // Verificar que el proyecto existe
  const project = await Project.findById(projectId);
  if (!project) {
    throw new CustomError('Proyecto no encontrado', 404);
  }

  const comment = await Comment.create({
    content,
    creator: req.user.id,
    project: projectId
  });

  const populatedComment = await Comment.findById(comment._id)
    .populate('creator', 'username');

  res.status(201).json({
    status: 'success',
    data: populatedComment
  });
});

exports.deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    await Comment.findByIdAndDelete(commentId);

    res.status(200).json({
      status: 'success',
      message: 'Comentario eliminado exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error al eliminar el comentario'
    });
  }
}; 