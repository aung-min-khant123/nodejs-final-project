const express = require("express");
const cors = require("cors");
const path = require("path");
const db = require("./database");

const app = express();
const PORT = 8000;

app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/api/products", (req, res) => {
  // res.json([
  //     {
  //         id: 1,
  //         name: "Product1",
  //         price: 50,
  //     },
  //     {
  //         id: 2,
  //         name: "Product2",
  //         price: 50,
  //     }
  // ])
  const sql = "SELECT * FROM products";

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching products:", err);

      return res.status(500).json({
        error: "Database error",
      });
    }

    res.json(results);
  });
});

app.get("/api/products/:id", (req, res) => {

    const { id } = req.params;

    const sql = "SELECT * FROM products WHERE id = ?";

    db.query(sql, [id], (err, results) => {

        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.json(results[0]);
    });
});

app.listen(PORT, () => {
  console.log("Server is running");
});
