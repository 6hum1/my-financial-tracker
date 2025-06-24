const express = require("express");
const xlsx = require('xlsx');
const User = require('../models/User');
const Expense = require('../models/Expense');


//add expense source
exports.addExpense = async(req,res) => {
    const userId = req.user.id;

    try {
        const {icon ,category , amount, date} = req.body;

        //validation check for missing fields 
        if(!category || !amount || !date){
            return res.status(400).json({message : "All fields are required "});
        }

        const newExpense = await Expense.create({
            userId,category ,category,amount,
            date : new Date(date)
        });

        return res.status(200).json(newExpense);


    }catch(error){
        console.log(error)
        res.status(500).json({message : "Server Error",err:error});
    }

}

//get all expense source
exports.getAllExpense = async(req,res) =>{
    const userId = req.user.id;

    try {
        const expense = await Expense.find({userId}).sort({date : -1});

        return res.json(expense);
    }catch(error){
        res.status(500).json({message : "Server error"});
    }
} 

//delete expense souce
exports.deleteExpense = async(req,res) => {
    const userId = req.user.id;

    try{
        await Expense.findByIdAndDelete(req.params.id);
        res.json({message : "Expense deleted successfully"});
    }catch(error){
        res.status(500).json({message : "Server Error"});
    }
} 



//download excel

exports.downloadExpenseExcel = async (req, res) => {
  const userId = req.user.id;

  try {
    const expenses = await Expense.find({ userId }).sort({ date: -1 });

    const data = expenses.map((item) => ({
      Category: item.category,
      Amount: item.amount,
      Date: new Date(item.date).toLocaleDateString()
    }));

    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(data);
    xlsx.utils.book_append_sheet(wb, ws, 'Expenses');

    // Generate buffer
    const buffer = xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' });

    // Set headers for download
    res.setHeader('Content-Disposition', 'attachment; filename=expense_details.xlsx');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

    res.send(buffer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};
