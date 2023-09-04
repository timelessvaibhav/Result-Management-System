require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();

app.use(cors());

const pool = mysql.createPool({
  host: process.env.HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DATABASE,
});

// Create the students table
pool.query(
  `CREATE TABLE IF NOT EXISTS students (
      id INT AUTO_INCREMENT PRIMARY KEY,
      rollno VARCHAR(255) NOT NULL,
      name VARCHAR(255) NOT NULL,
      dob DATE NOT NULL,
      score INT NOT NULL
  )`,
  (error) => {
    if (error) {
      console.log(error);
    }
  }
);

// Create the teachers table
pool.query(
  `CREATE TABLE IF NOT EXISTS teachers (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(255) NOT NULL,
      password VARCHAR(255) NOT NULL
  )`,
  (error) => {
    if (error) {
      console.log(error);
    } else {
      // Insert a default teacher record
      pool.query(
        `INSERT INTO teachers (username, password) VALUES (?, ?)`,
        ["Teacher", "abc@123"],
        (insertError) => {
          if (insertError) {
            console.log("Error inserting default teacher:", insertError);
          } else {
            console.log("Default teacher inserted successfully.");
          }
        }
      );
    }
  }
);

// Middleware
app.use(bodyParser.json());

// End Point to Handle Teacher Login
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Query the database to check if the teacher exists
    const [rows] = await pool
      .promise()
      .query(
        "SELECT id, username FROM teachers WHERE username = ? AND password = ?",
        [username, password]
      );

    if (rows.length > 0) {
      // Successful login
      res.json({ message: "Login successful", role: "teacher" });
    } else {
      // Invalid credentials
      res.status(401).json({ message: "Invalid username or password" });
    }
  } catch (error) {
    console.error("Error querying the database:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Endpoint to handle form submission
app.post("/submit", async (req, res) => {
  const { rollno, name, dob, score } = req.body;

  // Validation
  const errors = [];

  if (!rollno) {
    errors.push({ field: "rollno", message: "Roll No. is required" });
  }

  if (!name) {
    errors.push({ field: "name", message: "Name is required" });
  }

  if (!dob) {
    errors.push({ field: "dob", message: "Date of Birth is required" });
  } else {
    const currentDate = new Date();
    const submittedDate = new Date(dob);

    if (submittedDate > currentDate) {
      errors.push({
        field: "dob",
        message: "Date of Birth cannot be in the future",
      });
    }
  }

  if (!score) {
    errors.push({ field: "score", message: "Score is required" });
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  try {
    // Create a new record in the database
    await pool
      .promise()
      .query(
        "INSERT INTO students (rollno, name, dob, score) VALUES (?, ?, ?, ?)",
        [rollno, name, dob, score]
      );

    res.status(200).json({ message: "Record stored successfully" });
  } catch (error) {
    console.error("Error inserting record into the database:", error);
    res.status(500).json({ message: "Error storing record" });
  }
});

// Endpoint to fetch records
app.get("/records", async (req, res) => {
  try {
    // Fetch records from the database
    const [rows] = await pool.promise().query("SELECT * FROM students");

    res.json(rows);
  } catch (error) {
    console.error("Error fetching records:", error);
    res.status(500).json({ message: "Error fetching records" });
  }
});

// Endpoint to update a record
app.put("/records", async (req, res) => {
  const updatedRecord = req.body;

  try {
    // Update the record in the database
    await pool
      .promise()
      .query(
        "UPDATE students SET name = ?, dob = ?, score = ? WHERE rollno = ?",
        [
          updatedRecord.name,
          updatedRecord.dob,
          updatedRecord.score,
          updatedRecord.rollno,
        ]
      );

    res.status(200).json({ message: "Record updated successfully" });
  } catch (error) {
    console.error("Error updating record:", error);
    res.status(500).json({ message: "Error updating record" });
  }
});

// Endpoint to delete a record
app.delete("/records/:rollno", async (req, res) => {
  const rollno = req.params.rollno;

  try {
    // Check if the record exists
    const [existingRecord] = await pool
      .promise()
      .query("SELECT * FROM students WHERE rollno = ?", [rollno]);

    if (existingRecord.length === 0) {
      // If the record doesn't exist in the database
      return res.status(404).json({ message: "Record not found" });
    }

    // Delete the record from the database
    await pool
      .promise()
      .query("DELETE FROM students WHERE rollno = ?", [rollno]);

    res.status(200).json({ message: "Record deleted successfully" });
  } catch (error) {
    console.error("Error deleting record:", error);
    res.status(500).json({ message: "Error deleting record" });
  }
});

//endpoint to check if a student result exists
app.post("/find", async (req, res) => {
  const { rollno, dob } = req.body;

  try {
    // Query the database to find the matching record
    const [result] = await pool
      .promise()
      .query("SELECT * FROM students WHERE rollno = ? AND dob = ?", [
        rollno,
        dob,
      ]);

    if (result.length > 0) {
      // Record found
      res.status(200).json(result[0]); // Send the first matching record
    } else {
      // No matching record found
      res.status(404).json({
        message: "No Result Found for the Given Roll Number and Date of Birth",
      });
    }
  } catch (error) {
    console.error("Error finding record:", error);
    res.status(500).json({ message: "Error finding record" });
  }
});

// Endpoint to display student result for the given roll number
app.get("/find/:rollNumber", async (req, res) => {
  const rollNumber = req.params.rollNumber;
  const dob = req.query.dob; // Get the dob from the query parameters

  try {
    // Query the database to find the matching record
    const [result] = await pool
      .promise()
      .query("SELECT * FROM students WHERE rollno = ? AND dob = ?", [
        rollNumber,
        dob,
      ]);

    if (result.length > 0) {
      // Record found
      res.status(200).json(result[0]); // Send the first matching record
    } else {
      // No matching record found
      res.status(404).json({ message: "Result not found" });
    }
  } catch (error) {
    console.error("Error finding record:", error);
    res.status(500).json({ message: "Error finding record" });
  }
});

// Start the server
app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});
