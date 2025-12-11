const categoryService = require("../services/categoryService");

const getAll = async (req, res) => {
  try {
    const categories = await categoryService.getAllCategories();
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getById = async (req, res) => {
  try {
    const category = await categoryService.getCategoryById(req.params.id);
    res.status(200).json(category);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

const create = async (req, res) => {
  try {
    const newCat = await categoryService.createCategory(req.body);
    res.status(201).json(newCat);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const update = async (req, res) => {
  try {
    const category = await categoryService.updateCategory(
      req.params.id,
      req.body
    );
    res
      .status(200)
      .json({ message: "Cập nhật danh mục thành công!", category });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const remove = async (req, res) => {
  try {
    const result = await categoryService.deleteCategory(req.params.id);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
};
