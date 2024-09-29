const mongoose = require('mongoose');
const { Schema } = mongoose;

const fileSchema = new Schema({
  filename: String,
  mimetype: String,
  size: Number,
  // Другие метаданные, которые вам нужны
});

const File = mongoose.model('File', fileSchema);
