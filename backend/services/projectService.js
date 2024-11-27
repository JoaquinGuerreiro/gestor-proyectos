const Project = require('../models/Project');
const CustomError = require('../utils/CustomError');

class ProjectService {
  async createProject(projectData) {
    try {
      const project = new Project(projectData);
      await project.save();
      return project;
    } catch (error) {
      if (error.code === 11000) {
        throw new CustomError('Ya existe un proyecto con ese nombre', 400);
      }
      throw new CustomError('Error al crear el proyecto', 500);
    }
  }

  async getProjects(userId) {
    try {
      return await Project.find({ creator: userId })
        .populate('creator', '_id username email')
        .sort({ createdAt: -1 });
    } catch (error) {
      throw new CustomError('Error al obtener los proyectos', 500);
    }
  }
}

module.exports = new ProjectService(); 