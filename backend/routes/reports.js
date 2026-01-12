const router = require('express').Router();
const Report = require('../models/Report');
const { verifyToken, verifyTokenAndAdmin } = require('../middleware/auth');

// CREATE REPORT
router.post('/', verifyToken, async (req, res) => {
    const newReport = new Report(req.body);
    try {
        const savedReport = await newReport.save();
        res.status(200).json(savedReport);
    } catch (err) {
        res.status(500).json(err);
    }
});

// GET STATS (Price Trends & Regional Data)
router.get('/stats', verifyToken, async (req, res) => {
    try {
        const today = new Date();
        const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

        // 1. Price Trends (Daily Avg for common items)
        const trendsRaw = await Report.aggregate([
            { $match: { date: { $gte: lastWeek } } },
            { $unwind: "$items" },
            { $match: { "items.commodity": { $regex: /beras|telur|rice|egg/i } } },
            {
                $group: {
                    _id: {
                        date: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
                        commodity: "$items.commodity"
                    },
                    avgPrice: { $avg: "$items.pricePerUnit" }
                }
            },
            { $sort: { "_id.date": 1 } }
        ]);

        const trendsMap = {};
        trendsRaw.forEach(t => {
            const date = t._id.date;
            const name = t._id.commodity;
            if (!trendsMap[date]) trendsMap[date] = { date };
            trendsMap[date][name] = t.avgPrice;
        });
        const trends = Object.values(trendsMap).sort((a, b) => new Date(a.date) - new Date(b.date));

        // 2. Regional Stats
        const kitchenStats = await Report.aggregate([
            { $sort: { date: -1 } },
            {
                $group: {
                    _id: "$kitchen",
                    totalExpenditure: { $sum: "$totalExpenditure" },
                    date: { $first: "$date" },
                    items: { $first: "$items" }
                }
            },
            { $lookup: { from: "kitchens", localField: "_id", foreignField: "_id", as: "kitchenInfo" } },
            { $unwind: "$kitchenInfo" },
            {
                $project: {
                    kitchenName: "$kitchenInfo.name",
                    city: "$kitchenInfo.location.city",
                    totalExpenditure: 1,
                    date: 1,
                    items: 1
                }
            }
        ]);

        res.status(200).json({ trends, kitchenStats });
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
});

// GET ALL REPORTS (For Dashboard)
router.get('/', verifyToken, async (req, res) => {
    try {
        const { q, status, sortBy, order } = req.query;
        let query = {};

        if (status) {
            query.status = status;
        }

        if (q) {
            const Kitchen = require('../models/Kitchen');
            const matchingKitchens = await Kitchen.find({ name: { $regex: q, $options: 'i' } }).select('_id');
            const kitchenIds = matchingKitchens.map(k => k._id);
            query.kitchen = { $in: kitchenIds };
        }

        let sortOptions = {};
        if (sortBy) {
            sortOptions[sortBy] = order === 'desc' ? -1 : 1;
        }

        const reports = await Report.find(query)
            .populate('kitchen', 'name')
            .sort(sortOptions)
            .lean();
            
        res.status(200).json(reports);
    } catch (err) {
        res.status(500).json(err);
    }
});

// GET REPORTS BY KITCHEN
router.get('/kitchen/:kitchenId', verifyToken, async (req, res) => {
    try {
        const reports = await Report.find({ kitchen: req.params.kitchenId }).lean();
        res.status(200).json(reports);
    } catch (err) {
        res.status(500).json(err);
    }
});

// UPDATE REPORT (Status/Details)
router.put('/:id', verifyTokenAndAdmin, async (req, res) => {
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