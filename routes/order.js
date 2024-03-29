const { response } = require("express");
const Order = require("../models/Order");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");

const router = require("express").Router();

//create

router.post("/", verifyTokenAndAuthorization, async (req, res) => {
    // Set the userId property of the new order
  

    const newOrder = new Order(req.body);
    try {
        const savedOrder = await newOrder.save();
        res.status(201).json(savedOrder);
    } catch (err) {
        res.status(500).json(err);
    }
});



//update
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedOrder);
  } catch (err) {
    res.status(500).json(err);
  }
});

// //Delete

router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.status(200).json("Product has been deleted");
  } catch (err) {
    res.status(500).json(err);
  }
});

// //GET user order
router.get("/find/:userId", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const orders = await Order.find({userId: req.params.userId});

    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json(err);
  }
});

// //GET ALL Products
router.get("/", verifyTokenAndAdmin, async (req, res) => {
try{
    const orders = await Order.find();
    res.status(200).json(orders);
}catch(err){
    res.status(500).json(err);
}


});

//GET MONTHLY INCOME
router.get("/income", verifyTokenAndAdmin,async (req,res)=>{
    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth()-1));
    const previousMonth = new Date(new Date().new.setMonth(lastMonth.getMonth()-1));

    try{
        const income = await Order.aggregate([
            {   $match: {createdAt: { $gte: previousMonth}}},
            {
                $project: {
                month: { $month:"$createdAt"},
                sales: "$amount",
                },
                
                    $group:{
                        _id:"$month",
                        total:{$sum: "$sales"},
                    },
            },

        ]);
        res.status(200).json(income);
    }catch(err){
        res.status(500).json(err);
    }
});

module.exports = router;