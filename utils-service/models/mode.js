const { Schema, model } = require('mongoose');

const ModeSchema = new Schema({
    name: { type: String, required: true, unique: true},
    description: { type: String, required: true },
    path: { type: String, required: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: false }
});

module.exports = model('Mode', ModeSchema);