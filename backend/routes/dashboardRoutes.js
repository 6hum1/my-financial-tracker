const express = require("express");
const {protect} = require("../middleware/authMiddleware");
const {getdashboardData} = require('../controllers/dashboardController');

const router = express.Router();

router.get('/',protect,getdashboardData);

module.exports = router;