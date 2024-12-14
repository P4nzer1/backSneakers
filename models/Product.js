const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, index: true }, 
  description: String,
  price: { type: Number, required: true },
  category: { type: String, index: true }, 
  images: [String],
  stock: { type: Number, default: 0 },
  brand: String,
  createdAt: { type: Date, default: Date.now }
});


productSchema.index({ category: 1, price: -1 }); // 1 - сортировка по возрастанию, -1 - по убыванию

module.exports = mongoose.model('Product', productSchema)
