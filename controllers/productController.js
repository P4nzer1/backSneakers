const Product = require('../models/Product');

// Получение всех продуктов
exports.getProducts = async (_, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении продуктов', error });
  }
};

// Получение продукта по ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Продукт не найден' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении продукта', error });
  }
};

// Создание нового продукта
exports.createProduct = async (req, res) => {
  try {
    const { name, price, description, brand } = req.body;
    const newProduct = new Product({
      name,
      price,
      description,
      brand
    });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при создании продукта', error });
  }
};
