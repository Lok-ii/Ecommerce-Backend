const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  products: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'product'
  }
});

const categoryModel = mongoose.model('category', categorySchema);

module.exports = categoryModel;