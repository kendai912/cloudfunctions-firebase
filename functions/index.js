const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const admin = require("./model/firebase");
const db = admin.firestore();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions/api

// local
// http://localhost:5000/react-firebase-d79a3/us-central1/api

const app = express();
app.use(cors());

// get all items
app.get("/", async (req, res, next) => {
  try {
    const todoSnapshot = await db
      .collection("todos")
      .orderBy("isDone", "asc")
      .orderBy("limit", "asc")
      .get();
    const todos = todoSnapshot.docs.map((x) => {
      return {
        id: x.id,
        data: x.data(),
      };
    });
    res.send(todos);
  } catch (e) {
    next(e);
  }
});

// post item
app.post("/", async (req, res, next) => {
  try {
    const postData = req.body;
    if (!postData) {
      throw new Error("Data is blank");
    }
    const newData = {
      ...postData,
      ...{
        limit: admin.firestore.Timestamp.fromDate(new Date(postData.limit)),
      },
    };
    const ref = await db.collection("todos").add(newData);
    res.send({
      id: ref.id,
      data: postData,
    });
  } catch (e) {
    next(e);
  }
});

// update item
app.put("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const newData = req.body;
    if (!id) {
      throw new Error("id is blank");
    }
    if (!newData) {
      throw new Error("data is blank");
    }
    const ref = await db.collection("todos").doc(id).update(newData);
    res.send({
      id: ref.id,
      data: newData,
    });
  } catch (e) {
    next(e);
  }
});

// delete item
app.delete("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!id) {
      throw new Error("id is blank");
    }
    const ref = await db.collection("todos").doc(id).delete();
    res.send({
      id: ref.id,
    });
  } catch (e) {
    next(e);
  }
});

const api = functions.https.onRequest(app);
module.exports = { api };
