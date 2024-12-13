const Project = require('../models/Project');
const catchAsync = require('../utils/catchAsync');
const CustomError = require('../utils/CustomError');
const Comment = require('../models/Comment');
const User = require('../models/User');
const path = require('path');
const fs = require('fs');

exports.createProject = catchAsync(async (req, res) => {
  console.log('Creating project with data:', req.body);
  console.log('User ID:', req.user._id);
  
  const project = await Project.create({
    ...req.body,
    creators: [req.user._id]
  });

  const populatedProject = await Project.findById(project._id)
    .populate('creators', 'username email');

  console.log('Created project:', populatedProject);

  res.status(201).json({
    status: 'success',
    data: populatedProject,
    message: 'Proyecto creado exitosamente'
  });
});

exports.updateProject = catchAsync(async (req, res) => {
  const project = await Project.findOne({
    _id: req.params.id,
    creators: req.user._id
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
  ).populate('creators', 'username email');

  res.status(200).json({
    status: 'success',
    data: updatedProject
  });
});

exports.getProjects = catchAsync(async (req, res) => {
  console.log('Getting projects for user:', req.user._id);
  
  const projects = await Project.find({ creators: req.user._id })
    .populate('creators', 'username email')
    .sort({ createdAt: -1 });

  console.log('Found projects:', projects);

  res.status(200).json({
    status: 'success',
    data: projects
  });
});

exports.deleteProject = catchAsync(async (req, res) => {
  const project = await Project.findOneAndDelete({
    _id: req.params.id,
    creators: req.user._id
  });

  if (!project) {
    return res.status(404).json({
      status: 'error',
      message: 'Proyecto no encontrado o no tienes permisos para eliminarlo'
    });
  }

  res.status(200).json({
    status: 'success',
    message: 'Proyecto eliminado exitosamente'
  });
});

exports.toggleProjectVisibility = catchAsync(async (req, res) => {
  const project = await projectService.updateProject(
    req.params.id,
    req.user._id,
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
    req.user._id,
    email,
    role
  );
  res.json({
    status: 'success',
    data: project
  });
});

exports.removeProjectMember = catchAsync(async (req, res) => {
  console.log('Removing member from project:', {
    projectId: req.params.id,
    userToRemoveId: req.params.userId,
    currentUserId: req.user._id
  });

  // Buscar el proyecto
  const project = await Project.findById(req.params.id);
  
  if (!project) {
    console.log('Project not found');
    return res.status(404).json({
      status: 'error',
      message: 'Proyecto no encontrado'
    });
  }

  console.log('Project found:', {
    projectId: project._id,
    creators: project.creators,
    currentUser: req.user._id
  });

  // Verificar si el usuario actual es un creador del proyecto
  const isCreator = project.creators.some(creator => {
    const creatorId = creator.toString();
    const currentUserId = req.user._id.toString();
    const isMatch = creatorId === currentUserId;
    console.log('Comparing creator IDs:', { creatorId, currentUserId, isMatch });
    return isMatch;
  });

  console.log('Is current user a creator?', isCreator);

  if (!isCreator) {
    console.log('Permission denied: User is not a creator');
    return res.status(403).json({
      status: 'error',
      message: 'No tienes permisos para eliminar miembros de este proyecto'
    });
  }

  // Verificar que el usuario a eliminar no sea el creador original
  const isOriginalCreator = project.creators[0].toString() === req.params.userId;
  console.log('Is user to remove the original creator?', {
    originalCreatorId: project.creators[0].toString(),
    userToRemoveId: req.params.userId,
    isOriginalCreator
  });

  if (isOriginalCreator) {
    console.log('Cannot remove original creator');
    return res.status(403).json({
      status: 'error',
      message: 'No se puede eliminar al creador original del proyecto'
    });
  }

  // Eliminar el usuario de la lista de creadores
  const originalLength = project.creators.length;
  project.creators = project.creators.filter(creator => {
    const keepCreator = creator.toString() !== req.params.userId;
    console.log('Filtering creator:', {
      creatorId: creator.toString(),
      userToRemoveId: req.params.userId,
      keepCreator
    });
    return keepCreator;
  });
  console.log(`Removed ${originalLength - project.creators.length} creators`);

  await project.save();
  console.log('Project saved successfully');

  res.status(200).json({
    status: 'success',
    data: project,
    message: 'Miembro eliminado exitosamente'
  });
});

exports.getProject = catchAsync(async (req, res) => {
  const project = await Project.findById(req.params.id)
    .populate('creators', 'username email');

  if (!project) {
    throw new CustomError('Proyecto no encontrado', 404);
  }

  res.status(200).json({
    status: 'success',
    data: project
  });
});

exports.getPublicProjects = catchAsync(async (req, res) => {
  const projects = await Project.find({ isPublic: true })
    .populate('creators', 'username email')
    .sort({ createdAt: -1 });

  res.status(200).json({
    status: 'success',
    data: projects
  });
});

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
    creator: req.user._id,
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

exports.inviteUser = catchAsync(async (req, res) => {
  const { projectId } = req.params;
  const { userId } = req.body;

  // Verificar que el proyecto exista
  const project = await Project.findById(projectId);
  if (!project) {
    throw new CustomError('Proyecto no encontrado', 404);
  }

  // Verificar que el usuario que invita sea uno de los creators
  if (!project.creators.includes(req.user._id)) {
    throw new CustomError('No tienes permisos para invitar usuarios a este proyecto', 403);
  }

  // Verificar que el usuario a invitar exista
  const userToInvite = await User.findById(userId);
  if (!userToInvite) {
    throw new CustomError('Usuario no encontrado', 404);
  }

  // Verificar si el usuario ya es creator
  if (project.creators.includes(userId)) {
    throw new CustomError('El usuario ya es parte del proyecto', 400);
  }

  // Agregar el nuevo usuario a creators
  project.creators.push(userId);
  await project.save();

  // Poblar los creators antes de enviar la respuesta
  const updatedProject = await Project.findById(projectId)
    .populate('creators', 'username email');

  res.status(200).json({
    status: 'success',
    data: updatedProject,
    message: 'Usuario invitado exitosamente'
  });
});

exports.getProjectCreators = catchAsync(async (req, res) => {
  const project = await Project.findById(req.params.id)
    .populate('creators', 'username email');

  if (!project) {
    throw new CustomError('Proyecto no encontrado', 404);
  }

  res.status(200).json({
    status: 'success',
    data: {
      creators: project.creators
    }
  });
});

exports.removeMember = catchAsync(async (req, res) => {
  const { projectId, userId } = req.params;
  const project = await Project.findById(projectId);

  if (!project) {
    throw new CustomError('Proyecto no encontrado', 404);
  }

  // Verificar si el usuario que hace la petición es el creador original
  if (project.creators[0].toString() !== req.user._id) {
    throw new CustomError('Solo el creador original puede eliminar miembros', 403);
  }

  // Verificar que no se intente eliminar al creador original
  if (userId === project.creators[0].toString()) {
    throw new CustomError('No se puede eliminar al creador original', 400);
  }

  // Eliminar el usuario de creators
  project.creators = project.creators.filter(
    creator => creator.toString() !== userId
  );

  await project.save();

  res.status(200).json({
    status: 'success',
    message: 'Miembro eliminado exitosamente'
  });
});

exports.uploadImage = catchAsync(async (req, res) => {
  console.log('Upload request received');
  console.log('Request file:', req.file);
  
  if (!req.file) {
    return res.status(400).json({
      status: 'error',
      message: 'No se ha subido ninguna imagen'
    });
  }

  // Verificar la ruta del archivo y su existencia
  const uploadsDir = path.join(__dirname, '..', 'public', 'uploads');
  const fullPath = path.join(uploadsDir, req.file.filename);
  
  console.log('Uploads directory:', uploadsDir);
  console.log('Full file path:', fullPath);
  console.log('Directory exists:', fs.existsSync(uploadsDir));
  console.log('File exists:', fs.existsSync(fullPath));
  console.log('Directory contents:', fs.readdirSync(uploadsDir));

  const imageUrl = `/uploads/${req.file.filename}`;
  console.log('Generated image URL:', imageUrl);

  res.status(200).json({
    status: 'success',
    data: {
      imageUrl,
      fullPath,
      filename: req.file.filename
    }
  });
}); 