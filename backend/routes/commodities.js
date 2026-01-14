const router = require('express').Router();
const Commodity = require('../models/Commodity');
const { verifyToken, verifyTokenAndAdmin } = require('../middleware/auth');

// GET ALL COMMODITIES
router.get('/', verifyToken, async (req, res) => {
    try {
        const { region, category, q, sortBy, order } = req.query;
        let query = {};
        if (region) query.region = region;
        if (category) query.category = category;
        if (q) query.name = { $regex: q, $options: 'i' };

        let sortOptions = {};
        if (sortBy) {
            sortOptions[sortBy] = order === 'desc' ? -1 : 1;
        }

        // Optimization: Exclude 'history' field to reduce payload size as it grows indefinitely
        const commodities = await Commodity.find(query)
            .select('-history')
            .sort(sortOptions);
        res.status(200).json(commodities);
    } catch (err) {
        res.status(500).json(err);
    }
});

// CREATE COMMODITY
router.post('/', verifyTokenAndAdmin, async (req, res) => {
    try {
        const newCommodity = new Commodity(req.body);
        const savedCommodity = await newCommodity.save();
        res.status(201).json(savedCommodity);
    } catch (err) {
        if (err.name === 'ValidationError') {
            return res.status(400).json(err);
        }
        res.status(500).json(err);
    }
});

// DELETE COMMODITY
router.delete('/:id', verifyTokenAndAdmin, async (req, res) => {
    try {
        await Commodity.findByIdAndDelete(req.params.id);
        res.status(200).json("Commodity has been deleted...");
    } catch (err) {
        res.status(500).json(err);
    }
});

// UPDATE COMMODITY
router.put('/:id', verifyTokenAndAdmin, async (req, res) => {
    try {
        const commodity = await Commodity.findById(req.params.id);
        if (!commodity) return res.status(404).json("Commodity not found");

        // Handle legacy data where price might be stored as averagePrice
        const currentPrice = commodity.price || commodity._doc.averagePrice || 0;

        if (req.body.price && Number(req.body.price) !== currentPrice) {
            commodity.history.push({
                price: currentPrice,
                date: Date.now(),
                updatedBy: req.user ? req.user.username : 'Admin'
            });
        }

        Object.assign(commodity, req.body);
        
        const updatedCommodity = await commodity.save();
        res.status(200).json(updatedCommodity);
    } catch (err) {
        if (err.name === 'ValidationError') {
            return res.status(400).json(err);
        }
        res.status(500).json(err);
    }
});

module.exports = router;
