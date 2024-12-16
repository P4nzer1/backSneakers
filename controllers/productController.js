const Product = require('../models/Product');

// Получение всех продуктов
exports.getProducts = async (_, res) => {
  try {
    const products = await Product.find();
    
    const transformedProducts = products.map(product => {
      const productObj = product.toObject(); 
      productObj.id = productObj._id;        
      delete productObj._id;                
      delete productObj.__v;                 
      return productObj;
    });

    res.json(transformedProducts);
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

    const productObj = product.toObject();
    productObj.id = productObj._id;
    delete productObj._id;
    delete productObj.__v;

    res.json(productObj);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении продукта', error });
  }
};

// Создание нового продукта
exports.createProduct = async (req, res) => {
  try {
    const { name, price, description, brand , stock } = req.body;
    const images = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];
    const newProduct = new Product({
      name,
      price,
      description,
      brand,
      stock,
      images
    });
    await newProduct.save();

    // После сохранения также можно преобразовать:
    const productObj = newProduct.toObject();
    productObj.id = productObj._id;
    delete productObj._id;
    delete productObj.__v;

    res.status(201).json(productObj);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при создании продукта', error });
  }
};

exports.getBrands = async (req, res) => {
  try {
    const brands = await Product.distinct('brand');
    res.json(brands);
  } catch (error) {
    console.error('Ошибка при получении брендов:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
