DROP DATABASE IF EXISTS bamazon_DB;
CREATE DATABASE bamazon_db;
use bamazon_db;

CREATE TABLE department (
  id int NOT NULL AUTO_INCREMENT,
  departmentName VARCHAR(32),
  overheadCost DECIMAL(9,2),
  PRIMARY KEY (id)
);

CREATE TABLE product (
  id int NOT NULL AUTO_INCREMENT,
  productName VARCHAR(200),
  departmentId int,
  price DECIMAL(9,2),
  stockQuantity int,
  FOREIGN KEY (departmentId) REFERENCES department(id),
  PRIMARY KEY (id)
);

CREATE TABLE sale (
  id int NOT NULL AUTO_INCREMENT,
  productId int,
  quantityPurchased int,
  cDate DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (productId) REFERENCES product (id),
  PRIMARY KEY (id)
);

# Populate Department & Products
INSERT INTO department (departmentName, overheadCost)
    VALUES ("Sporting Goods", 77777.77),
      ("Books", 33333.33),
      ("Furniture", 55555.55),
      ("Fashion", 88888.88)
      ;

INSERT INTO product (productName, departmentId, price, stockQuantity)
    VALUES
      
      ("Garmin ForeRunner Watch XT910", 1, 555.55, 5),
      ("Garmin Footpod", 1, 77.77, 7),
      ("Garmin HR Monitor", 1, 100, 10),
      ("Mizuno WaveRunner - size perfect", 1, 125.95, 10),
      ("JavaScript Genius", 2, 33.33, 5),
      ("Java or Go", 2, 25.95, 10),
      ("Jack Daniel's Running Formula", 2, 30, 15),
      ("Modern Sofa 5 in Red", 3, 5000.00, 2),
      ("Love Sofa Modern Traditional 8 Blue", 3, 3000.00, 5),
      ("Leather Luxury High-end Sofa", 3, 10000, 10),
      ("Lucky Jeans - white - medium", 4, 99.99, 8),
      ("ViX Yellow Polka Dot Bikini - XS", 4, 500.98, 9),
      ("RP Polo shirt - medium", 4, 75.50, 10);

# INSERT INTO sale
INSERT INTO sale (productId, quantityPurchased)
  VALUES (1, 3), (2, 5), (3, 7), (4, 2), (5, 5), (6, 6), (7, 10), (8, 1), (9, 2), (10, 6), (11, 3), (12, 7), (13, 9);

# SUPERVISOR QUERY
SELECT p.departmentId, d.departmentName, d.overheadCost, SUM(s.quantityPurchased * p.price) as productSales,
  (SUM(s.quantityPurchased * p.price) - d.overheadCost) as totalProfit
  FROM sale s LEFT JOIN product p ON s.productId = p.id
  INNER JOIN department d ON p.departmentId = d.id
  GROUP BY p.departmentId
  ORDER BY totalProfit DESC;
