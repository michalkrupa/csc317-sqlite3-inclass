# SQLite in Node.js: A Simple Introduction

This guide will walk you through:
1. Installing SQLite (via the `sqlite3` library) in a Node.js project.
2. Creating a database with Node.js.
3. Creating a table.
4. Populating the table with data.
5. Running queries on the table.

We’ll use a simple **animals** example, where we store data on animals’ life expectancy, habitat, and whether they’re in danger. Whenever we encounter a specific SQLite or `sqlite3` method or keyword, we’ll briefly explain it.

---

## 1. Installing SQLite (`sqlite3` Library)
To install SQLite in a Node.js project, we use the [`sqlite3` package](https://www.npmjs.com/package/sqlite3). Run this command in your project folder:

```bash
npm install sqlite3
```

**Why `sqlite3`?**  
- `sqlite3` is a Node.js library that lets us create and interact with SQLite databases directly from our Node.js applications.  
- SQLite is a self-contained, file-based database; no separate server is needed.

---

## 2. Creating a Database via Node.js
Let's create and open a database file called `animals.db`:

```js
const sqlite3 = require("sqlite3").verbose();

// Create or open the 'animals.db' database.
const db = new sqlite3.Database("animals.db", (err) => {
  if (err) {
    return console.error("Error opening database:", err.message);
  }
  console.log("Connected to the animals database.");
});
```

**What does `require("sqlite3").verbose()` do?**  
- When we `require("sqlite3")`, we load the SQLite library in Node.  
- `.verbose()` makes the library log additional information to the console, which can help debug.

**What does `new sqlite3.Database("animals.db", callback)` do?**  
- It either creates a new database file named `animals.db` if it doesn’t exist, or opens it if it already exists.  
- We also provide a callback to handle any error and confirm a successful connection.

---

## 3. Creating a Table

We’ll create a table named `Animals` with the following columns:
- `id` (INTEGER, primary key, auto-incremented)
- `name` (TEXT)
- `habitat` (TEXT)
- `life_expectancy` (INTEGER)
- `in_danger` (INTEGER representing a boolean: 0 means false, 1 means true)

```js
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
```

**What does `db.run()` do?**  
- `db.run()` executes a SQL statement such as `CREATE TABLE`.  
- In this case, we check `IF NOT EXISTS` so that if the table already exists, it won’t be recreated or overwritten.

**Key Points:**
- `PRIMARY KEY AUTOINCREMENT` automatically gives each entry a unique numeric ID.
- `TEXT NOT NULL` means the column stores text and cannot be left empty (NULL).
- `INTEGER` means a numeric value; storing an integer helps if we want to do numeric operations (e.g., filter life expectancy by greater/less than).

---

## 4. Populating the Table

We’ll insert a few animals into our `Animals` table:

```js
const insertQuery = `
  INSERT INTO Animals (name, habitat, life_expectancy, in_danger)
  VALUES (?, ?, ?, ?)
`;

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
```

**What does `INSERT INTO` do?**  
- `INSERT INTO table (columns...) VALUES (...)` is the SQL statement to insert new rows into your table.

**What does `(?, ?, ?, ?)` mean?**  
- These are placeholders (parameters) for values that we pass in separately to help prevent SQL injection attacks.  
- They also make queries cleaner and more maintainable.

**What is `db.run(query, values, callback)`?**  
- This runs an `INSERT` (or other non-query statement) with given parameters (`values`) and a callback to handle success or error.

**What is `this.lastID`?**  
- Within the callback, `this.lastID` gives us the ID of the last inserted row.  

---

## 5. Running Queries

### 5.1 Selecting Data
Now let’s run a simple `SELECT` query to view all animals in the table:

```js
db.all("SELECT * FROM Animals", (err, rows) => {
  if (err) {
    return console.error("Error fetching data:", err.message);
  }
  console.log("All Animals:", rows);
});
```

**What does `db.all()` do?**  
- `db.all()` executes a SQL query and fetches **all** resulting rows.  
- The callback gives us an array of rows (`rows`).

### 5.2 Selecting with Conditions
Let’s find animals that live longer than 50 years:

```js
db.all("SELECT * FROM Animals WHERE life_expectancy > ?", [50], (err, rows) => {
  if (err) {
    return console.error("Error fetching data:", err.message);
  }
  console.log("Animals with life expectancy over 50 years:", rows);
});
```

### 5.3 Updating Data
If we want to mark the “Dog” record as in danger, we can update it:

```js
db.run("UPDATE Animals SET in_danger = ? WHERE name = ?", [1, "Dog"], function(err) {
  if (err) {
    return console.error("Error updating data:", err.message);
  }
  console.log(`Rows updated: ${this.changes}`);
});
```

**What does `db.run(query, params, callback)` do here?**  
- It executes an `UPDATE` statement.  
- `this.changes` tells us how many rows were changed.

### 5.4 Deleting Data
To remove the “Dog” record:

```js
db.run("DELETE FROM Animals WHERE name = ?", ["Dog"], function(err) {
  if (err) {
    return console.error("Error deleting data:", err.message);
  }
  console.log(`Rows deleted: ${this.changes}`);
});
```

**What does `DELETE FROM` do?**  
- `DELETE FROM table WHERE condition` removes rows that match the given condition.

---

## 6. Closing the Database Connection

When you’re done with all queries, it’s a good practice to close the connection:

```js
db.close((err) => {
  if (err) {
    return console.error("Error closing the database:", err.message);
  }
  console.log("Database connection closed.");
});
```

**What does `db.close()` do?**  
- Closes the connection to the database, freeing resources.

---

# Summary

- **Install** `sqlite3` via `npm install sqlite3`.
- **Create/Open** a database with `new sqlite3.Database("filename.db")`.
- **Create a table** with `db.run("CREATE TABLE IF NOT EXISTS...")`.
- **Insert data** with an `INSERT INTO` statement.
- **Run queries** (SELECT, UPDATE, DELETE) using `db.run()` or `db.all()`.

With these steps, you’ve set up a basic Node.js application that uses SQLite to store and query data. Our animal examples demonstrated how to **create** a table, **insert** data, **select** and **filter** rows, **update** records, and **delete** data. Always remember to handle errors gracefully and close your database connection when you’re done.


====================================

# Relational Databases & Hands-on SQLite Fun

## Part 1: Introduction to Relational Databases

Relational databases store data in **tables**, which look a bit like spreadsheets. Each table contains **rows** (individual records) and **columns** (fields or attributes of the data). The power of a relational database lies in how tables can be linked to each other through **relationships**.

### Key Concepts

1. **Table**: A structured arrangement of rows (records) and columns (fields).
2. **Row (Record)**: One set of data in a table. For example, one row could contain the information about a single “Animal.”
3. **Column (Field)**: A single attribute of data stored in every row (e.g., “habitat” or “lifeExpectancy”).
4. **Primary Key**: A unique identifier for each row in a table. Often an auto-incremented number (ID).
5. **Foreign Key**: A column in one table that references a primary key in another table, linking the two tables together.
6. **Query**: A command used to interact with the database, commonly written in SQL (Structured Query Language).
7. **Relationship**: The logical link between two tables (e.g., one-to-one, one-to-many, many-to-many).

### A Brief History of SQL (Structured Query Language)

- **Origins**: SQL was developed in the 1970s by IBM. Its creation was influenced by E.F. Codd’s research on the relational model.
- **Popularity**: SQL is arguably the most widely used language for interacting with relational databases:
  - It’s **easy** to read and learn (comparatively!).
  - It’s **standardized**, although different database systems (MySQL, PostgreSQL, SQLite, etc.) can have small variations.
  - It allows both simple and very **powerful** data manipulations.

### Why SQL is Still So Popular

1. **Mature and Well-Supported**: Over 40 years of development, strong community support, and well-tested libraries.
2. **Widespread**: Many different database systems use SQL, so learning it can be transferred across projects.
3. **Declarative**: You specify *what* you want from the data, not *how* to get it.
4. **Scalable**: Can handle small prototypes or massive enterprise applications with equal efficiency.

### Making a Table: A Real-World Use Case Example

Let’s imagine you run a small store and want to track customer orders. You might create a table called `orders`:

```sql
CREATE TABLE orders (
    order_id INTEGER PRIMARY KEY,
    customer_name TEXT NOT NULL,
    item TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    order_date TEXT
);
```

- Here, `order_id` is your **Primary Key**.
- `customer_name`, `item`, `quantity`, and `order_date` are columns with respective data types.
- `TEXT`, `INTEGER`, and other data types vary by the database system, but typically follow a similar naming scheme in SQL.

---

## Part 2: Installing and Using SQLite

SQLite is a lightweight, file-based database engine. It’s perfect for small projects or learning the basics of SQL.

### Installation Steps

#### Windows

1. Go to the official SQLite website (or use a package manager like [Chocolatey](https://chocolatey.org/) if you have it).
2. Download the **SQLite Tools for Windows** (a zip file).
3. Unzip the folder and move the `sqlite3.exe` file into a convenient location (e.g., `C:\sqlite`).
4. (Optional) Add `C:\sqlite` to your system `PATH` so you can call `sqlite3` from any folder in the Command Prompt.

#### macOS

1. Open the Terminal.
2. Type `brew install sqlite` if you have [Homebrew](https://brew.sh/). Otherwise, you can download the precompiled binaries from the SQLite website.
3. Verify installation by typing `sqlite3 --version`.

#### Linux (Ubuntu/Debian example)

1. Open a terminal.
2. Run `sudo apt-get update`.
3. Then run `sudo apt-get install sqlite3`.
4. Verify by typing `sqlite3 --version`.

---

## Create a New Database Called “animals”

We’ll do this using the SQLite shell (often just called `sqlite3`).

1. **Open** your terminal or command prompt.
2. **Navigate** to the folder where you want to store your database file.
3. Type:

   ```bash
   sqlite3 animals.db
   ```

   This creates a new file named `animals.db` (or opens it if it already exists) and starts the SQLite shell.

### Make a Table Named “animals”

Inside the SQLite shell, create the table like so:

```sql
CREATE TABLE animals (
    name TEXT NOT NULL,
    habitat TEXT NOT NULL,
    mammal BOOLEAN NOT NULL,
    food TEXT NOT NULL,
    lifeExpectancy INTEGER NOT NULL
);
```

### Insert Some Rows

Next, we’ll add rows for six animals: pandas, snow leopards, marmots, kangaroos, koalas, and the bald eagle.

```sql
INSERT INTO animals (name, habitat, mammal, food, lifeExpectancy)
VALUES
    ('Panda', 'Forest', 1, 'Bamboo', 20),
    ('Snow Leopard', 'Mountains', 1, 'Meat', 15),
    ('Marmot', 'Mountains', 1, 'Plants', 15),
    ('Kangaroo', 'Grassland', 1, 'Plants', 23),
    ('Koala', 'Forest', 1, 'Eucalyptus Leaves', 15);
```

Note that in SQLite:

- `1` is treated as `true` (for `mammal`).
- `0` is treated as `false`.

### Modifying Data (UPDATE, ALTER, etc.)

#### Update a Row

Let’s say we got the life expectancy of Koalas wrong—turns out they can live up to 18 years. We can update that row:

```sql
UPDATE animals
SET lifeExpectancy = 18
WHERE name = "Koala";
```

#### Add Another Column (Altering the Table)

Need to store an `endangeredLevel`? No problem:

```sql
ALTER TABLE animals
ADD COLUMN endangeredLevel TEXT;
```

Then, we can update the data:

```sql
UPDATE animals
SET endangeredLevel = "Vulnerable"
WHERE name IN ("Panda", "Snow Leopard", "Bald Eagle");
```

Feel free to tweak the data as you see fit!

### Making Queries

The real magic is in how to retrieve data.

**Example 1**: Get all animals living over 20 years:

```sql
SELECT name, lifeExpectancy
FROM animals
WHERE lifeExpectancy > 20;
```

**Example 2**: Get all non-mammals:

```sql
SELECT *
FROM animals
WHERE mammal = 0;
```

**Example 3**: Sort animals by their life expectancy descending:

```sql
SELECT *
FROM animals
ORDER BY lifeExpectancy DESC;
```

Use your imagination! Experimenting with various queries is a fantastic way to learn.

---

## Keep It Fun & Inclusive

- Don’t be afraid to rename animals in German just for fun, e.g., “Koala” as “Koala (Der Flauschige!)” in your table.
- Feel free to add columns like `favoriteToy`, `populationEstimate`, or anything that reflects your curiosity or cause you want to highlight.

The **key** is to experiment, break things, fix them, and explore. That’s how we truly learn!

---

### Any Questions?

- Which animal do you want to add next?
- Do you have any interesting facts about an animal that you’d like to store in this database?
- Anything you’d like to do differently? Let me know — I’m all ears!

Viel Spaß (Have fun) and happy coding!