const express = require("express");

const {
  createDemo,
  getAllDemo,
  searchDemo
} = require("../controller/demoController");

const router = express.Router();


// =====================================================
// POST
// Create document
// =====================================================

router.post("/", createDemo);


// =====================================================
// GET SEARCH
// IMPORTANT: Keep /search before /
// =====================================================

router.get("/search", searchDemo);


// =====================================================
// GET ALL / FILTER
// =====================================================

router.get("/", getAllDemo);


module.exports = router;