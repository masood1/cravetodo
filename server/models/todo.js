var mongoose = require('mongoose');

const todoEntry = new mongoose.Schema({
  todo : {
    type: String,
    unique: false,
    required: true,
  },
  completed : {
    type: Boolean,
    default: false
  }
})

const todoSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: false,
    required: true,
  },
  entries: [todoEntry]
});

const ToDo = mongoose.model('ToDo', todoSchema);

module.exports = ToDo;

