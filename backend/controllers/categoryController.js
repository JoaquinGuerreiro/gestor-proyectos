const Category = require('../models/Category');

exports.createCategory = async (req, res) => {
  try {
    const category = new Category({
      ...req.body,
      creator: req.user._id
    });
    await category.save();
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al crear la categoría' });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ creator: req.user._id });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener las categorías' });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const category = await Category.findOneAndUpdate(
      { _id: req.params.id, creator: req.user._id },
      req.body,
      { new: true }
    );
    
    if (!category) {
      return res.status(404).json({ mensaje: 'Categoría no encontrada' });
    }
    
    res.json(category);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar la categoría' });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findOneAndDelete({
      _id: req.params.id,
      creator: req.user._id
    });
    
    if (!category) {
      return res.status(404).json({ mensaje: 'Categoría no encontrada' });
    }
    
    res.json({ mensaje: 'Categoría eliminada' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar la categoría' });
  }
};

exports.getCategory = async (req, res) => {
  try {
    const category = await Category.findOne({
      _id: req.params.id,
      creator: req.user._id
    });
    
    if (!category) {
      return res.status(404).json({ mensaje: 'Categoría no encontrada' });
    }
    
    res.json(category);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener la categoría' });
  }
}; 