CREATE TABLE `bamazon`.`products` (
  `item_id` INT NOT NULL AUTO_INCREMENT,
  `product_name` VARCHAR(45) NOT NULL,
  `department_name` VARCHAR(45) NULL,
  `price` FLOAT NULL,
  `stock` INT NULL,
  `created` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted` TIMESTAMP NULL,
  PRIMARY KEY (`item_id`));

CREATE TABLE `bamazon`.`departments` (
  `department_id` INT NOT NULL AUTO_INCREMENT,
  `department_name` VARCHAR(45) NOT NULL,
  `overhead_cost` VARCHAR(45) NULL,
  `product_sales` VARCHAR(45) NULL,
  -- `created` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  -- `updated` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  -- `deleted` TIMESTAMP NULL,
  PRIMARY KEY (`department_id`));
