CREATE TABLE `nhc`.`contact` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `street` VARCHAR(255) NULL,
  `number` VARCHAR(255) NULL,
  `postal` VARCHAR(255) NULL,
  `city` VARCHAR(255) NULL,
  `email` VARCHAR(255) NULL,
  PRIMARY KEY (`id`));

  
  CREATE TABLE `nhc`.`quarantaine_action` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`));
  
  
  
  CREATE TABLE `nhc`.`quarantaine` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `hospitalization` INT(10) UNSIGNED NOT NULL,
  `date` DATETIME NOT NULL,
  `extra_info` VARCHAR(255) NULL,
  `quarantaine_action` INT NOT NULL,
  PRIMARY KEY (`id`));

  
ALTER TABLE `nhc`.`quarantaine` 
ADD INDEX `fk_quarantaine_quarantaine_action_idx` (`quarantaine_action` ASC);
ALTER TABLE `nhc`.`quarantaine` 
ADD CONSTRAINT `fk_quarantaine_quarantaine_action`
  FOREIGN KEY (`quarantaine_action`)
  REFERENCES `nhc`.`quarantaine_action` (`id`)
  ON DELETE RESTRICT
  ON UPDATE NO ACTION;

  
  ALTER TABLE `nhc`.`quarantaine` 
ADD INDEX `fk_quarantaine_hospitalization_idx` (`hospitalization` ASC);
ALTER TABLE `nhc`.`quarantaine` 
ADD CONSTRAINT `fk_quarantaine_hospitalization`
  FOREIGN KEY (`hospitalization`)
  REFERENCES `nhc`.`hospitalization` (`id`)
  ON DELETE RESTRICT
  ON UPDATE NO ACTION;

  
  CREATE TABLE `nhc`.`hospitalization_comment` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`));

  
  CREATE TABLE `nhc`.`hospitalization_group` (
  `id` INT NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`));

  
  
  ALTER TABLE `nhc`.`hospitalization` 
ADD COLUMN `hospitalization_group` INT NULL AFTER `entrance_reason`,
ADD COLUMN `hospitalization_comment` INT NULL AFTER `hospitalization_group`,
ADD COLUMN `postal` VARCHAR(255) NULL AFTER `hospitalization_comment`,
ADD COLUMN `contact` INT NULL AFTER `postal`;


ALTER TABLE `nhc`.`hospitalization` 
ADD INDEX `fk_hospitalization_hospitalization_group_idx` (`hospitalization_group` ASC),
ADD INDEX `fk_hospitalization_hospitalization_comment_idx` (`hospitalization_comment` ASC),
ADD INDEX `fk_hospitalization_contact_idx` (`contact` ASC);
ALTER TABLE `nhc`.`hospitalization` 
ADD CONSTRAINT `fk_hospitalization_hospitalization_group`
  FOREIGN KEY (`hospitalization_group`)
  REFERENCES `nhc`.`hospitalization_group` (`id`)
  ON DELETE RESTRICT
  ON UPDATE NO ACTION,
ADD CONSTRAINT `fk_hospitalization_hospitalization_comment`
  FOREIGN KEY (`hospitalization_comment`)
  REFERENCES `nhc`.`hospitalization_comment` (`id`)
  ON DELETE RESTRICT
  ON UPDATE NO ACTION,
ADD CONSTRAINT `fk_hospitalization_contact`
  FOREIGN KEY (`contact`)
  REFERENCES `nhc`.`contact` (`id`)
  ON DELETE RESTRICT
  ON UPDATE NO ACTION;

  
  CREATE TABLE `nhc`.`recur_model` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`));

  
  CREATE TABLE `nhc`.`taskv2_category` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`));

  
  CREATE TABLE `nhc`.`taskv2_model` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `recur_model` INT NULL,
  `recur_day` INT NULL,
  `recur_multiplier` INT NULL,
  `task_category` INT NOT NULL,
  `cage` INT(10) UNSIGNED NULL,
  `information` VARCHAR(255) NULL,
  `priority` INT NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  INDEX `fk_taskv2_model_recur_model_idx` (`recur_model` ASC),
  INDEX `fk_taskv2_model_taskv2_category_idx` (`task_category` ASC),
  INDEX `fk_taskv2_model_cage_idx` (`cage` ASC),
  CONSTRAINT `fk_taskv2_model_recur_model`
    FOREIGN KEY (`recur_model`)
    REFERENCES `nhc`.`recur_model` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_taskv2_model_taskv2_category`
    FOREIGN KEY (`task_category`)
    REFERENCES `nhc`.`taskv2_category` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_taskv2_model_cage`
    FOREIGN KEY (`cage`)
    REFERENCES `nhc`.`cage` (`id`)
    ON DELETE RESTRICT
    ON UPDATE NO ACTION);
	
	
	CREATE TABLE `nhc`.`taskv2` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `taskv2_model` INT NULL,
  `cage` INT(10) UNSIGNED NULL,
  `custom_name` VARCHAR(255) NULL,
  `date_created` DATETIME NOT NULL,
  `date_completed` DATETIME NULL,
  `staff_name` VARCHAR(255) NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_taskv2_cage_idx` (`cage` ASC),
  INDEX `fk_taskv2_taskv2_model_idx` (`taskv2_model` ASC),
  CONSTRAINT `fk_taskv2_cage`
    FOREIGN KEY (`cage`)
    REFERENCES `nhc`.`cage` (`id`)
    ON DELETE RESTRICT
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_taskv2_taskv2_model`
    FOREIGN KEY (`taskv2_model`)
    REFERENCES `nhc`.`taskv2_model` (`id`)
    ON DELETE RESTRICT
    ON UPDATE NO ACTION);

	

  
  