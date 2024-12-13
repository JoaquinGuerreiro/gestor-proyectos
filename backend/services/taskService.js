const Task = require('../models/Task');
const Project = require('../models/Project');
const CustomError = require('../utils/CustomError');

class TaskService {
  async createTask(taskData) {
    try {
      console.log('Datos recibidos:', taskData);
      
      // Verificar si el usuario es miembro del proyecto
      const project = await Project.findById(taskData.project);
      
      if (!project) {
        throw new CustomError('Proyecto no encontrado', 404);
      }

      // Verificar si el usuario es creador del proyecto
      const isCreator = project.creators.some(
        creator => creator.toString() === taskData.creator
      );

      if (!isCreator) {
        throw new CustomError('No tienes permisos para crear tareas en este proyecto', 403);
      }

      const task = new Task(taskData);
      await task.save();
      
      return await Task.findById(task._id)
        .populate('project', 'name')
        .populate('creator', 'username');
    } catch (error) {
      console.error('Error en createTask:', error);
      if (error instanceof CustomError) throw error;
      throw new CustomError(error.message || 'Error al crear la tarea', 500);
    }
  }

  async getTasks(userId) {
    try {
      return await Task.find({ creator: userId })
        .populate('project', 'name')
        .sort({ createdAt: -1 });
    } catch (error) {
      throw new CustomError('Error al obtener las tareas', 500);
    }
  }

  async updateTask(taskId, userId, updateData) {
    try {
      const task = await Task.findOneAndUpdate(
        { _id: taskId, creator: userId },
        updateData,
        { new: true, runValidators: true }
      ).populate('project', 'name');

      if (!task) {
        throw new CustomError('Tarea no encontrada', 404);
      }

      return task;
    } catch (error) {
      if (error instanceof CustomError) throw error;
      throw new CustomError('Error al actualizar la tarea', 500);
    }
  }

  async deleteTask(taskId, userId) {
    try {
      const task = await Task.findOneAndDelete({
        _id: taskId,
        creator: userId
      });

      if (!task) {
        throw new CustomError('Tarea no encontrada', 404);
      }

      return task;
    } catch (error) {
      throw new CustomError('Error al eliminar la tarea', 500);
    }
  }
}

module.exports = new TaskService(); 