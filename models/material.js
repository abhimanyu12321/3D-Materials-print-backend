import mongoose from 'mongoose';

const materialSchema = new mongoose.Schema({
    name: { type: String, required: true },
    technology: { type: String, required: true },
    colors: { type: [String], required: true },
    pricePerGram: { type: Number, required: true },
    imageUrl: { type: String, required: true }
});

const Material = mongoose.model('Material', materialSchema);

export default Material;
