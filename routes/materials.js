import express from 'express';
import multer from 'multer';
import Material from '../models/material.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// GET all materials
router.get('/', async (req, res) => {
    try {
        const materials = await Material.find().select('-imageUrl');
        res.json(materials);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET a material by ID
router.get('/:id', getMaterial, (req, res) => {
    res.json(res.material);
});

// POST a new material
router.post('/', upload.single('image'), async (req, res) => {
    const material = new Material({
        name: req.body.name,
        technology: req.body.technology,
        colors: req.body.colors.split(','),
        pricePerGram: req.body.pricePerGram,
        imageUrl: req.file ? `/uploads/${req.file.filename}` : ''
    });
    try {
        const newMaterial = await material.save();
        res.status(201).json(newMaterial);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PUT update a material
router.put('/:id', upload.single('image'), getMaterial, async (req, res) => {
    if (req.body.name != null) res.material.name = req.body.name;
    if (req.body.technology != null) res.material.technology = req.body.technology;
    if (req.body.colors != null) res.material.colors = req.body.colors.split(',');
    if (req.body.pricePerGram != null) res.material.pricePerGram = req.body.pricePerGram;
    if (req.file != null) res.material.imageUrl = `/uploads/${req.file.filename}`;

    try {
        const updatedMaterial = await res.material.save();
        res.json(updatedMaterial);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE a material
router.delete('/:id', getMaterial, async (req, res) => {
    try {
        await res.material.remove();
        res.json({ message: 'Deleted Material' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Middleware to get material by ID
async function getMaterial(req, res, next) {
    let material;
    try {
        material = await Material.findById(req.params.id);
        if (material == null) return res.status(404).json({ message: 'Cannot find material' });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
    res.material = material;
    next();
}

export default router;
