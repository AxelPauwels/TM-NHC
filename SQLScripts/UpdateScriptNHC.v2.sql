CREATE TABLE `hedgehog_container` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `number` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `number_UNIQUE` (`number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE `hedgehog_container_division` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



CREATE TABLE `nhc`.`hospitalization_hedgehog_container` (
  `id` INT NOT NULL,
  `hospitalization` INT(10) UNSIGNED NOT NULL,
  `hedgehog_container_division` INT NOT NULL,
  `hedgehog_container` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_hospitalization_hedgehog_container_idx` (`hospitalization` ASC),
  INDEX `fk_hedgehog_container_division_hedgehog_container_idx` (`hedgehog_container_division` ASC),
  INDEX `fk_hospitalization_hedgehog_container_hospitalization_hedge_idx` (`hedgehog_container` ASC),
  CONSTRAINT `fk_hosp_hedge_cont_hosp`
    FOREIGN KEY (`hospitalization`)
    REFERENCES `nhc`.`hospitalization` (`id`)
    ON DELETE RESTRICT
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_hosp_hedge_cont_div`
    FOREIGN KEY (`hedgehog_container_division`)
    REFERENCES `nhc`.`hedgehog_container_division` (`id`)
    ON DELETE RESTRICT
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_hosp_hedge_cont_hedge_cont`
    FOREIGN KEY (`hedgehog_container`)
    REFERENCES `nhc`.`hedgehog_container` (`id`)
    ON DELETE RESTRICT
    ON UPDATE NO ACTION);

	
	