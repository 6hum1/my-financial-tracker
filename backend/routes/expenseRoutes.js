const express = require("express");
const {addExpense,getAllExpense,deleteExpense,downloadExpenseExcel} = require("../controllers/expenseController");
const router = express.Router();
const {protect} = require("../middleware/authMiddleware")

router.post("/add",protect,addExpense);
router.get("/get",protect,getAllExpense);
router.get("/downloadexcel",protect,downloadExpenseExcel);
router.delete("/:id",protect,deleteExpense);


module.exports = router ;