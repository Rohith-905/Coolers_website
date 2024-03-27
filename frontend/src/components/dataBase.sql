use Coolers;
create table authentication(username varchar(100),password varchar(100));
CREATE TABLE soldGoods (
  id INT AUTO_INCREMENT PRIMARY KEY,
  invoice_number VARCHAR(50) unique NOT NULL,
  customer_name VARCHAR(100) NOT NULL,
  shop_address VARCHAR(255) NOT NULL,
  vehicle_number VARCHAR(20) NOT NULL,
  date varchar(10) NOT NULL,
  additional_details_json TEXT NOT NULL,
  paidAmount	INTEGER,
  overallTotalAmount integer,
  dueAmount integer
);
CREATE TABLE purchasedGoods (
  id INT AUTO_INCREMENT PRIMARY KEY,
  invoice_number VARCHAR(50) unique NOT NULL,
  customer_name VARCHAR(100) NOT NULL,
  shop_address VARCHAR(255) NOT NULL,
  vehicle_number VARCHAR(20) NOT NULL,
  date varchar(10) NOT NULL,
  additional_details_json TEXT NOT NULL,
  paidAmount	INTEGER,
  overallTotalAmount integer,
  dueAmount integer
);
create table vendor_due(name varchar(200) UNIQUE, amount integer);
create table customer_due (name varchar(200) UNIQUE, amount integer);