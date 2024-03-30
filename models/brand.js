const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  products: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'product'
  }
});

const brandModel = mongoose.model('brand', brandSchema);

module.exports = brandModel;