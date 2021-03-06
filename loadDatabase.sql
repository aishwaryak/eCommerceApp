
create database ecommercedb;

use ecommercedb;

drop table product_table;

create table products_table(
	product_id int,
	asin varchar(20),
	productTitle varchar(100),
	productGroup varchar(30),
	categories int,
	productDescription varchar(200),
	price decimal,
	PRIMARY KEY (product_id));

LOAD DATA LOCAL INFILE 'products_table.txt' INTO TABLE products_table;

select * from products_table;

drop table category_table;

create table category_table(
	category_id int,
	category_name varchar(100),
	PRIMARY KEY (category_id));

LOAD DATA LOCAL INFILE 'category_table.txt' INTO TABLE category_table;	

select * from category_table;

drop table product_category_table;

create table product_category_table(
	product_id int,
	category_id int,
	FOREIGN KEY (product_id) REFERENCES products_table(product_id),
	FOREIGN KEY (category_id) REFERENCES category_table(category_id));

LOAD DATA LOCAL INFILE 'product_category_table.txt' INTO TABLE product_category_table;

select * from product_category_table;

drop table users_table;

create table users_table(
	user_id int NOT NULL AUTO_INCREMENT,
	firstname varchar(30),
	lastname varchar(30), 
	role varchar(10) NOT NULL,
	address varchar(50),
	city varchar(15),
	state varchar(2),
	zip varchar(8),
	email varchar(30),
	username varchar(20) NOT NULL UNIQUE,
	password varchar(30),
	PRIMARY KEY (user_id));

insert into users_table(firstname,lastname,role,address,city,state,zip,email,username,password) values('Henry','Smith','customer','2 B street','Pittsburgh','PA','15213','hsmith@g.com','hsmith','smith');

insert into users_table(firstname,lastname,role,address,city,state,zip,email,username,password) values('Tim','Bucktoo','customer','1 A street','Pittsburgh','PA','15213','tbuck@g.com','tbucktoo','bucktoo');

insert into users_table(firstname,lastname,role,address,city,state,zip,email,username,password) values('Jenny','Admin','admin','3 C street','Pittsburgh','PA','15213','jadmin@g.com','jadmin','admin');

SELECT * FROM users_table;
