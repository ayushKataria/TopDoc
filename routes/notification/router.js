"use strict";
const router = require("express").Router();
let controller = require("./controller");

async function createNotification(req, res) {
  console.log("inside createNotification router", req.body);
  try {
    let ids = req.body.id;
    if (ids.length > 0) {
      for (let i = 0; i < ids.length; i++) {
        if (
          ids[i].hasOwnProperty("id") == false ||
          ids[i].id == null ||
          ids[i].id == ""
        ) {
          return res.status(400).send("bad request , id cannot be empty");
        } else if (
          ids[i].hasOwnProperty("name") == false ||
          ids[i].name == null ||
          ids[i].name == ""
        ) {
          return res.status(400).send("bad request , name cannot be empty");
        } else if (
          ids[i].hasOwnProperty("mobile") == false ||
          ids[i].mobile == null ||
          ids[i].mobile == ""
        ) {
          return res.status(400).send("bad request , mobile cannot be empty");
        } else if (
          ids[i].hasOwnProperty("email") == false ||
          ids[i].email == null ||
          ids[i].email == ""
        ) {
          return res.status(400).send("bad request , email cannot be empty");
        }
      }
    }
    if (
      req.body.hasOwnProperty("priority") == false ||
      req.body.hasOwnProperty("priority") == null ||
      req.body.hasOwnProperty("priority") == ""
    ) {
      res.status(400).send("bad request, priority field is missing");
    } else if (
      req.body.hasOwnProperty("message") == false ||
      req.body.hasOwnProperty("message") == null ||
      req.body.hasOwnProperty("message") == ""
    ) {
      res.status(400).send("bad request, message field is missing");
    } else if (
      req.body.hasOwnProperty("time") == false ||
      req.body.hasOwnProperty("time") == null ||
      req.body.hasOwnProperty("time") == ""
    ) {
      res.status(400).send("bad request, time field is missing");
    } else if (
      req.body.hasOwnProperty("status") == false ||
      req.body.hasOwnProperty("status") == null ||
      req.body.hasOwnProperty("status") == ""
    ) {
      res.status(400).send("bad request, status field is missing");
    } else if (
      req.body.hasOwnProperty("medium") == false ||
      req.body.hasOwnProperty("medium") == null ||
      req.body.hasOwnProperty("medium") == ""
    ) {
      res.status(400).send("bad request, medium field is missing");
    } else if (
      req.body.hasOwnProperty("senderId") == false ||
      req.body.hasOwnProperty("senderId") == null ||
      req.body.hasOwnProperty("senderId") == ""
    ) {
      res.status(400).send("bad request, senderId field is missing");
    } else {
      console.log("inside else");

      controller
        .manualNotification(req.body)
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

router.post("/v1/create", createNotification);

module.exports = router;
