
const Razorpay = require('razorpay');
const { razor_pay_keyId, razor_pay_keyVal } = require('../../utils/properties_util');
const router = require("express").Router();

let rzp = new Razorpay({
  key_id: razor_pay_keyId, // your `KEY_ID`
  key_secret: razor_pay_keyVal // your `KEY_SECRET`
})

async function createOrderId(req, res) {
    // req.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    try {
        if(!req.body.hasOwnProperty("price")){
            res.status(400).send("bad request , Amount attribute is missing in the req");
        }
        else if(  req.body.price<=0){
            res.status(400).send("bad request , Price cannot be zero or less than that");
        }
        else{

            const options={
                "amount": req.body.price,
                "currency": "INR",
               // "receipt": "qwsaq1", //to be generated here
               // "partial_payment": false
              }
            //   const { v4: uuidv4 } = require("uuid");
              const newId = Math.floor(100000000 + Math.random() * 900000000);
             
             
              options.receipt= newId;
    
              rzp.orders.create(options,function(err,order){
                console.log("Req is ",options)
                if(order!=null){
                    res.send(order);
                }
                else if(err){
                    res.status(err.statusCode).send(err);
                }
                console.log("order is ",order);console.log("Err is ",err)})

        }


    } catch (error) {
      console.log("ERROR IS",error);
      throw {
        statuscode: 500,
        message: "Unexpected error occured",
      };
    }
  }


router.post("/create/orderId", createOrderId);
module.exports = router;