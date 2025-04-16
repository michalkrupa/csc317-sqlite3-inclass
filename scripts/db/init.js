const sqlite3 = require("sqlite3").verbose();

// Create or open the 'animals.db' database.
const db = new sqlite3.Database("animals.db", (err) => {
  if (err) {
    return console.error("Error opening database:", err.message);
  }
  console.log("Connected to the animals database.");
});

//Create an animals table in animals.db
db.run(`
  CREATE TABLE IF NOT EXISTS Animals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    habitat TEXT NOT NULL,
    life_expectancy INTEGER,
    in_danger INTEGER
  )
`, (err) => {
  if (err) {
    return console.error("Error creating table:", err.message);
  }
  console.log("Animals table created (if it didn't already exist).");
});

// //Insert a new record

// //Create an insert statement template
// //? will be replaced w/ array index vals using db.run
const insertQuery = `
  INSERT INTO Animals (name, habitat, life_expectancy, in_danger)
  VALUES (?, ?, ?, ?)
`;

// //Insert records using the insert query template
db.run(insertQuery, ["Elephant", "Savannah", 60, 1], function(err) {
  if (err) {
    return console.error("Error inserting Elephant:", err.message);
  }
  console.log(`A row has been inserted with rowid ${this.lastID}`);
});

db.run(insertQuery, ["Turtle", "Ocean", 100, 0], function(err) {
  if (err) {
    return console.error("Error inserting Turtle:", err.message);
  }
  console.log(`A row has been inserted with rowid ${this.lastID}`);
});

db.run(insertQuery, ["Dog", "Domestic", 13, 0], function(err) {
  if (err) {
    return console.error("Error inserting Dog:", err.message);
  }
  console.log(`A row has been inserted with rowid ${this.lastID}`);
});

db.all("SELECT * FROM Animals", (err, rows) => {
  if (err) {
    return console.error("Error fetching data:", err.message);
  }
  console.log("All Animals:", rows);
});

// // Use a select to recall all records
// // Where life_expectancy is greater than 50
db.all("SELECT * FROM Animals WHERE life_expectancy > ?", [50], (err, rows) => {
  if (err) {
    return console.error("Error fetching data:", err.message);
  }
  console.log("Animals with life expectancy over 50 years:", rows);
});


// // Use an update query
// // to set dog's in_danger property to 1 (true)
db.run("UPDATE Animals SET in_danger = ? WHERE name = ?", [1, "Dog"], function(err) {
  if (err) {
    return console.error("Error updating data:", err.message);
  }
  console.log(`Rows updated: ${this.changes}`);
});

// // Delete the dog record :'(
db.run("DELETE FROM Animals WHERE name = ?", ["Dog"], function(err) {
  if (err) {
    return console.error("Error deleting data:", err.message);
  }
  console.log(`Rows deleted: ${this.changes}`);
});

// // Close the connection to ensure
// // that the database does not have
// // empty connections allocated
db.close((err) => {
  if (err) {
    return console.error("Error closing the database:", err.message);
  }
  console.log("Database connection closed.");
});