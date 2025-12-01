const router = require('express').Router();
const Report = require('../models/Report');

// CREATE REPORT
router.post('/', async (req, res) => {
    const newReport = new Report(req.body);
    try {
        const savedReport = await newReport.save();
        res.status(200).json(savedReport);
    } catch (err) {
        res.status(500).json(err);
    }
});

// GET ALL REPORTS (For Dashboard)
router.get('/', async (req, res) => {
    try {
        const reports = await Report.find().populate('kitchen');
        res.status(200).json(reports);
    } catch (err) {
        res.status(500).json(err);
    }
});

// GET REPORTS BY KITCHEN
router.get('/kitchen/:kitchenId', async (req, res) => {
    try {
        const reports = await Report.find({ kitchen: req.params.kitchenId });
        res.status(200).json(reports);
    } catch (err) {
        res.status(500).json(err);
    }
});

// UPDATE REPORT (Status/Details)
router.put('/:id', async (req, res) => {
    try {
        const updatedReport = await Report.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        res.status(200).json(updatedReport);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;
