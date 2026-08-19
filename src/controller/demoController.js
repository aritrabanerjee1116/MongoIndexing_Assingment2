const Demo = require("../models/demoModel");



// CREATE DOCUMENT
// POST /api/demo


const createDemo = async (req, res) => {
  try {
    const {
      username,
      email,
      firstName,
      lastName,
      description,
      tags,
      status,
      location
    } = req.body;


 
    // Basic validation
  

    if (
      !username ||
      !email ||
      !firstName ||
      !lastName ||
      !description ||
      !location
    ) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing"
      });
    }



    // Check duplicate username
    

    const existingUsername = await Demo.findOne({
      username
    });

    if (existingUsername) {
      return res.status(400).json({
        success: false,
        message: "Username already exists"
      });
    }


    
    // Check duplicate email
    

    const existingEmail = await Demo.findOne({
      email
    });

    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: "Email already exists"
      });
    }


   
    // Create document
  

    const demo = await Demo.create({
      username,
      email,
      firstName,
      lastName,
      description,
      tags,
      status,
      location
    });


    return res.status(201).json({
      success: true,
      message: "Document created successfully",
      data: demo
    });

  } catch (error) {

    console.error("Create Demo Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};




// GET ALL DOCUMENTS
// GET /api/demo
//
// Supports filters:
// ?username=
// ?email=
// ?firstName=
// ?lastName=
// ?tag=
// ?status=


const getAllDemo = async (req, res) => {
  try {

    const {
      username,
      email,
      firstName,
      lastName,
      tag,
      status
    } = req.query;


    const filter = {};


   
    // Username filter
    // Single-field index
  

    if (username) {
      filter.username = username;
    }


   
    // Email filter
    // Unique index
    

    if (email) {
      filter.email = email;
    }


   
    // Compound index
    // firstName + lastName
   

    if (firstName) {
      filter.firstName = firstName;
    }

    if (lastName) {
      filter.lastName = lastName;
    }


    
    // Multikey index
    // Search inside tags array
    

    if (tag) {
      filter.tags = tag;
    }


   
    // Partial index
    // status = active
  

    if (status) {
      filter.status = status;
    }


    const demos = await Demo.find(filter);


    return res.status(200).json({
      success: true,
      count: demos.length,
      data: demos
    });

  } catch (error) {

    console.error("Get Demo Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};




// SEARCH DOCUMENTS
// GET /api/demo/search
//
// Supports:
// Text search
// Tag search
// Geospatial search


const searchDemo = async (req, res) => {
  try {

    const {
      text,
      tag,
      longitude,
      latitude,
      maxDistance
    } = req.query;


    
    // 1. TEXT SEARCH
   

    if (text) {

      const results = await Demo.find({
        $text: {
          $search: text
        }
      });


      return res.status(200).json({
        success: true,
        searchType: "Text Search",
        count: results.length,
        data: results
      });
    }



    
    // 2. MULTIKEY / TAG SEARCH
   

    if (tag) {

      const results = await Demo.find({
        tags: tag
      });


      return res.status(200).json({
        success: true,
        searchType: "Multikey Search",
        count: results.length,
        data: results
      });
    }



   
    // 3. GEOSPATIAL SEARCH
    

    if (longitude && latitude) {

      const distance = Number(maxDistance) || 5000;


      const results = await Demo.find({
        location: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [
                Number(longitude),
                Number(latitude)
              ]
            },
            $maxDistance: distance
          }
        }
      });


      return res.status(200).json({
        success: true,
        searchType: "Geospatial Search",
        maxDistance: `${distance} meters`,
        count: results.length,
        data: results
      });
    }



   
    // No search parameter
   

    return res.status(400).json({
      success: false,
      message:
        "Please provide text, tag, or longitude and latitude"
    });

  } catch (error) {

    console.error("Search Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};



module.exports = {
  createDemo,
  getAllDemo,
  searchDemo
};