const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, index: true }, 
  description: String,
  price: { type: Number, required: true },
  category: { type: String, index: true }, 
  imageUrl: String,
  stock: { type: Number, default: 0 },
});


productSchema.index({ category: 1, price: -1 }); // 1 - сортировка по возрастанию, -1 - по убыванию

module.exports = mongoose.model('Product', productSchema);
