-- phpMyAdmin SQL Dump
-- version 4.7.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Jan 29, 2018 at 09:06 AM
-- Server version: 5.7.19
-- PHP Version: 5.6.31

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `nhc`
--

-- --------------------------------------------------------

--
-- Structure for view `hospitalization_active`
--

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `hospitalization_active`  AS  select `hospitalization`.`id` AS `id`,`hospitalization`.`uuid` AS `uuid`,`hospitalization`.`entrance` AS `entrance`,`hospitalization`.`animal` AS `animal`,`hospitalization`.`quantity` AS `quantity`,`hospitalization`.`cage` AS `cage`,`hospitalization`.`exit` AS `exit`,`hospitalization`.`exit_reason` AS `exit_reason`,`hospitalization`.`staff_only` AS `staff_only`,`hospitalization`.`dangerous` AS `dangerous`,`hospitalization`.`medication` AS `medication`,`hospitalization`.`comment` AS `comment`,`hospitalization`.`for_adoption` AS `for_adoption`,`hospitalization`.`adoption_from` AS `adoption_from`,`hospitalization`.`origin` AS `origin`,`hospitalization`.`id_number` AS `id_number`,`hospitalization`.`status_code` AS `status_code`,`hospitalization`.`exit_comment` AS `exit_comment`,`hospitalization`.`just_comment` AS `just_comment`,`hospitalization`.`reserved` AS `reserved`,`hospitalization`.`menu_percentage` AS `menu_percentage`,`hospitalization`.`reserved_for` AS `reserved_for`,`hospitalization`.`male_quantity` AS `male_quantity`,`hospitalization`.`female_quantity` AS `female_quantity`,`hospitalization`.`entrance_reason` AS `entrance_reason`,`hospitalization`.`hospitalization_comment` AS `hospitalization_comment`,`hospitalization`.`contact` AS `contact` from `hospitalization` having (`hospitalization`.`status_code` <> 'END') ;

--
-- VIEW  `hospitalization_active`
-- Data: None
--

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
