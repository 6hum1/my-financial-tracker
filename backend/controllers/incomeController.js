const express = require("express");
const xlsx = require('xlsx');
const User = require('../models/User');
const Income = require('../models/Income');


//add income source
exports.addIncome = async(req,res) => {
    const userId = req.user.id;

    try {
        const {icon ,source , amount, date} = req.body;

        //validation check for missing fields 
        if(!source || !amount || !date){
            return res.status(400).json({message : "All fields are required "});
        }

        const newIncome = await Income.create({
            userId,icon,source,amount,
            date : new Date(date)
        });
        console.log(newIncome);
        return res.status(200).json(newIncome);


    }catch(error){
        res.status(500).json({message : "Server Error"});
    }

}

//get all income source
exports.getAllIncome = async(req,res) =>{
    const userId = req.user.id;

    try {
        const income = await Income.find({userId}).sort({date : -1});

        return res.json(income);
    }catch(error){
        res.status(500).json({message : "Server error"});
    }
} 

//delete income souce
exports.deleteIncome = async(req,res) => {
    const userId = req.user.id;

    try{
        await Income.findByIdAndDelete(req.params.id);
        res.json({message : "Income deleted successfully"});
    }catch(error){
        console.log(error);
        res.status(500).json({message : "Server Error",err: error});
    }
} 



//download excel

exports.downloadIncomeExcel = async (req, res) => {
  const userId = req.user.id;

  try {
    const income = await Income.find({ userId }).sort({ date: -1 });

    const data = income.map((item) => ({
      Source: item.source,
      Amount: item.amount,
      Date: new Date(item.date).toLocaleDateString(),
    }));

    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(data);
    xlsx.utils.book_append_sheet(wb, ws, 'Income');

    const buffer = xlsx.write(wb, {
      type: 'buffer',
      bookType: 'xlsx',
    });

    res.setHeader('Content-Disposition', 'attachment; filename=income_details.xlsx');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(buffer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
