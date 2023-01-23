"use strict";
const Razorpay = require("razorpay");
const controller = require("./controller");
const adsController = require("../ads/controller");

const {
  razor_pay_keyId,
  razor_pay_keyVal,
} = require("../../utils/properties_util");
const paymentAttributesList = require("./constants/paymentAttributesList");
const router = require("express").Router();

let rzp = new Razorpay({
  key_id: razor_pay_keyId, // your `KEY_ID`
  key_secret: razor_pay_keyVal, // your `KEY_SECRET`
});

async function createOrderId(req, res) {
  // req.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
  try {
    if (!req.body.hasOwnProperty("price")) {
      res
        .status(400)
        .send("bad request , Amount attribute is missing in the req");
    } else if (req.body.price <= 0) {
      res
        .status(400)
        .send("bad request , Price cannot be zero or less than that");
    } else {
      const options = {
        amount: req.body.price,
        currency: "INR",
        // "receipt": "qwsaq1", //to be generated here
        // "partial_payment": false
      };
      //   const { v4: uuidv4 } = require("uuid");
      const newId = Math.floor(100000000 + Math.random() * 900000000);

      options.receipt = newId;

      rzp.orders.create(options, function (err, order) {
        console.log("Req is ", options);
        if (order != null) {
          res.send(order);
        } else if (err) {
          res.status(err.statusCode).send(err);
        }
        console.log("order is ", order);
        console.log("Err is ", err);
      });
    }
  } catch (error) {
    console.log("ERROR IS", error);
    throw {
      statuscode: 500,
      message: "Unexpected error occured",
    };
  }
}

async function createPayment(req, res) {
  try {
    let fail = false;
    const list = paymentAttributesList.paymentAttributes;
    Object.keys(req.body).forEach((key) => {
      if (!list.includes(key)) {
        res
          .status(400)
          .send("bad request , unknown attribute found in request");
        fail = true;
      }
    });
    if (fail) return;

    if (
      req.body.hasOwnProperty("paymentStatus") == false ||
      req.body.paymentStatus == null ||
      req.body.paymentStatus == ""
    ) {
      res.status(400).send("bad request , paymentStatus cannot be empty");
    } else if (
      req.body.hasOwnProperty("dateAndTime") == false ||
      req.body.dateAndTime == null ||
      req.body.dateAndTime == ""
    ) {
      res.status(400).send("bad request , dateAndTime cannot be empty");
    } else if (
      req.body.hasOwnProperty("doctorId") == false ||
      req.body.doctorId == null ||
      req.body.doctorId == ""
    ) {
      res.status(400).send("bad request , doctorId cannot be empty");
    } else if (
      req.body.hasOwnProperty("amount") == false ||
      req.body.amount == null ||
      req.body.amount == ""
    ) {
      res.status(400).send("bad request , amount cannot be empty");
    } else if (req.body.hasOwnProperty("couponApplied") == false) {
      res
        .status(400)
        .send("bad request , couponApplied field has to be present");
    } else if (
      req.body.hasOwnProperty("paymentType") == false ||
      req.body.paymentType == null ||
      req.body.paymentType == ""
    ) {
      res.status(400).send("bad request , paymentType cannot be empty");
    } else if (
      req.body.hasOwnProperty("orderId") == false ||
      req.body.orderId == null ||
      req.body.orderId == ""
    ) {
      res.status(400).send("bad request , orderId cannot be empty");
    } else {
      console.log("in router");
      await controller
        .createNewPayment(req.body)
        .then((data) => res.send(data))
        .catch((err) => res.status(err.statuscode).send(err));
    }
  } catch (error) {
    console.log(error);
    throw {
      statuscode: 500,
      message: "Unexpected error occured",
    };
  }
}

async function searchFieldInPayment(req, res) {
  try {
    let fail = false;
    const list = paymentAttributesList.paymentSearchList;
    Object.keys(req.body).forEach((key) => {
      if (!list.includes(key)) {
        res
          .status(400)
          .send("bad request , unknown attribute found in request");
        fail = true;
      }
    });
    if (fail) return;

    if (
      req.body.hasOwnProperty("role") == false ||
      req.body.role == null ||
      req.body.role == ""
    ) {
      res.status(400).send("bad request ,  role cannot be empty");
    } else if (req.body.hasOwnProperty("sortBy") == false) {
      res.status(400).send("bad request ,  sortBy cannot be empty");
    } else if (Object.keys(req.body).length <= 1) {
      res.status(400).send("bad request , please enter a field to search");
    } else {
      console.log("in router");
      await adsController
        .searchFieldInAds(req.body)
        .then((data) => res.send(data))
        .catch((err) => res.status(err.statuscode).send(err));
    }
  } catch (error) {
    console.log(error);
    throw {
      statuscode: 500,
      message: "Unexpected error occured",
    };
  }
}

router.post("/create", createPayment);
router.post("/searchInPayment", searchFieldInPayment);
router.post("/create/orderId", createOrderId);
module.exports = router;
