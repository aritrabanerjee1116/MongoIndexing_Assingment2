const mongoose = require("mongoose");

const demoSchema = new mongoose.Schema(
  {
  
    // BASIC FIELDS
   

    username: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },

    firstName: {
      type: String,
      required: true,
      trim: true
    },

    lastName: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      required: true,
      trim: true
    },

    
    // ARRAY FIELD
    // Used for Multikey Index
   

    tags: {
      type: [String],
      default: []
    },

    
    // STATUS
    // Used for Partial Index
    

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active"
    },

    
    // LOCATION
    // Used for Geospatial Index
    

    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: true
      },

      coordinates: {
        type: [Number],
        required: true
      }
    }
  },
  {
    timestamps: true
  }
);



// 1. SINGLE-FIELD INDEX
// Index on username


demoSchema.index(
  { username: 1 },
  { unique: true }
);


// =====================================================
// 2. COMPOUND INDEX
// Index on firstName + lastName
// =====================================================

demoSchema.index({
  firstName: 1,
  lastName: 1
});


// =====================================================
// 3. MULTIKEY INDEX
// Index on array field tags
// MongoDB automatically makes this a Multikey Index
// =====================================================

demoSchema.index({
  tags: 1
});


// =====================================================
// 4. TEXT INDEX
// Full-text search on description
// =====================================================

demoSchema.index({
  description: "text"
});


// =====================================================
// 5. GEOSPATIAL INDEX
// 2dsphere index on GeoJSON location
// =====================================================

demoSchema.index({
  location: "2dsphere"
});


// =====================================================
// 6. PARTIAL INDEX
// Index only documents where status = active
// =====================================================

demoSchema.index(
  { status: 1 },
  {
    partialFilterExpression: {
      status: "active"
    }
  }
);


// =====================================================
// 7. UNIQUE INDEX
// Email must be unique
// =====================================================

demoSchema.index(
  { email: 1 },
  { unique: true }
);


const Demo = mongoose.model("Demo", demoSchema);

module.exports = Demo;