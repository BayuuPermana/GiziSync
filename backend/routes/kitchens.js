const router = require('express').Router();
const Kitchen = require('../models/Kitchen');

// CREATE KITCHEN
router.post('/', async (req, res) => {
    const newKitchen = new Kitchen(req.body);
    try {
        const savedKitchen = await newKitchen.save();
        res.status(200).json(savedKitchen);
    } catch (err) {
        res.status(500).json(err);
    }
});

// GET ALL KITCHENS
router.get('/', async (req, res) => {
    try {
        const kitchens = await Kitchen.find();
        res.status(200).json(kitchens);
    } catch (err) {
        res.status(500).json(err);
    }
});

// DELETE KITCHEN
router.delete('/:id', async (req, res) => {
    try {
        await Kitchen.findByIdAndDelete(req.params.id);
        res.status(200).json("Kitchen has been deleted...");
    } catch (err) {
        res.status(500).json(err);
    }
});

// UPDATE KITCHEN
router.put('/:id', async (req, res) => {
    try {
        const updatedKitchen = await Kitchen.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        res.status(200).json(updatedKitchen);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;
