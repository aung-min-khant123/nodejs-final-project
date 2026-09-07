const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
});

db.query("CREATE DATABASE IF NOT EXISTS ecommerce", (err) => {
  if (err) {
    console.error(err);
    return;
  }

  console.log("Database created");

  db.changeUser({ database: "ecommerce" }, (err) => {
    if (err) {
      console.error(err);
      return;
    }

    const sql = `
            CREATE TABLE IF NOT EXISTS products (
                id INT PRIMARY KEY AUTO_INCREMENT,
                name VARCHAR(100) NOT NULL,
                price DECIMAL(10,2) NOT NULL,
                image_url VARCHAR(500)
            )
        `;

    db.query(sql, (err) => {
      if (err) {
        console.error(err);
        return;
      }

      console.log("Products table created");

      // Check if products already exist
      const checkProducts = `
                SELECT COUNT(*) AS count
                FROM products
            `;

      db.query(checkProducts, (err, row) => {
        if (err) {
          console.error("Error checking products:", err);
          return;
        }

        // Only insert if table is empty
        if (row[0].count == 0) {
          const insertProducts = `
                        INSERT INTO products (name, price, image_url)
                        VALUES
                            ('Argentina 2026 Messi Home Shirt', 89.99, 'http://localhost:8000/images/Lm2026.png'),
                            ('Brazil 2026 Neymar Home Shirt', 84.99, 'http://localhost:8000/images/Ney102026.png'),
                            ('France 2026 Mbappe Home Shirt', 89.99, 'http://localhost:8000/images/Mbappe2026.png'),
                            ('Portugal 2026 Ronaldo Home Shirt', 89.99, 'http://localhost:8000/images/Cr72026.png'),
                    `;
          db.query(insertProducts, (err) => {
            if (err) {
              console.error("Error inserting products:", err);
              return;
            }

            console.log("Products inserted successfully");
          });
        } else {
          console.log("Products already exist. Skipping insert.");
        }
      });
    });
  });
});

module.exports = db;
