-- MySQL dump 10.13  Distrib 8.0.33, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: prestashop
-- ------------------------------------------------------
-- Server version	11.7.2-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `ps_product`
--

DROP TABLE IF EXISTS `ps_product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ps_product` (
  `id_product` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `id_supplier` int(10) unsigned DEFAULT NULL,
  `id_manufacturer` int(10) unsigned DEFAULT NULL,
  `id_category_default` int(10) unsigned DEFAULT NULL,
  `id_shop_default` int(10) unsigned NOT NULL DEFAULT 1,
  `id_tax_rules_group` int(11) unsigned NOT NULL,
  `on_sale` tinyint(1) unsigned NOT NULL DEFAULT 0,
  `online_only` tinyint(1) unsigned NOT NULL DEFAULT 0,
  `ean13` varchar(13) DEFAULT NULL,
  `isbn` varchar(32) DEFAULT NULL,
  `upc` varchar(12) DEFAULT NULL,
  `mpn` varchar(40) DEFAULT NULL,
  `ecotax` decimal(17,6) NOT NULL DEFAULT 0.000000,
  `quantity` int(10) NOT NULL DEFAULT 0,
  `minimal_quantity` int(10) unsigned NOT NULL DEFAULT 1,
  `low_stock_threshold` int(10) DEFAULT NULL,
  `low_stock_alert` tinyint(1) NOT NULL DEFAULT 0,
  `price` decimal(20,6) NOT NULL DEFAULT 0.000000,
  `wholesale_price` decimal(20,6) NOT NULL DEFAULT 0.000000,
  `unity` varchar(255) DEFAULT NULL,
  `unit_price` decimal(20,6) NOT NULL DEFAULT 0.000000,
  `unit_price_ratio` decimal(20,6) NOT NULL DEFAULT 0.000000,
  `additional_shipping_cost` decimal(20,6) NOT NULL DEFAULT 0.000000,
  `reference` varchar(64) DEFAULT NULL,
  `supplier_reference` varchar(64) DEFAULT NULL,
  `location` varchar(255) NOT NULL DEFAULT '',
  `width` decimal(20,6) NOT NULL DEFAULT 0.000000,
  `height` decimal(20,6) NOT NULL DEFAULT 0.000000,
  `depth` decimal(20,6) NOT NULL DEFAULT 0.000000,
  `weight` decimal(20,6) NOT NULL DEFAULT 0.000000,
  `out_of_stock` int(10) unsigned NOT NULL DEFAULT 2,
  `additional_delivery_times` tinyint(1) unsigned NOT NULL DEFAULT 1,
  `quantity_discount` tinyint(1) DEFAULT 0,
  `customizable` tinyint(2) NOT NULL DEFAULT 0,
  `uploadable_files` tinyint(4) NOT NULL DEFAULT 0,
  `text_fields` tinyint(4) NOT NULL DEFAULT 0,
  `active` tinyint(1) unsigned NOT NULL DEFAULT 0,
  `redirect_type` enum('','404','410','301-product','302-product','301-category','302-category','200-displayed','404-displayed','410-displayed','default') NOT NULL DEFAULT 'default',
  `id_type_redirected` int(10) unsigned NOT NULL DEFAULT 0,
  `available_for_order` tinyint(1) NOT NULL DEFAULT 1,
  `available_date` date DEFAULT NULL,
  `show_condition` tinyint(1) NOT NULL DEFAULT 0,
  `condition` enum('new','used','refurbished') NOT NULL DEFAULT 'new',
  `show_price` tinyint(1) NOT NULL DEFAULT 1,
  `indexed` tinyint(1) NOT NULL DEFAULT 0,
  `visibility` enum('both','catalog','search','none') NOT NULL DEFAULT 'both',
  `cache_is_pack` tinyint(1) NOT NULL DEFAULT 0,
  `cache_has_attachments` tinyint(1) NOT NULL DEFAULT 0,
  `is_virtual` tinyint(1) NOT NULL DEFAULT 0,
  `cache_default_attribute` int(10) unsigned DEFAULT NULL,
  `date_add` datetime NOT NULL,
  `date_upd` datetime NOT NULL,
  `advanced_stock_management` tinyint(1) NOT NULL DEFAULT 0,
  `pack_stock_type` int(11) unsigned NOT NULL DEFAULT 3,
  `state` int(11) unsigned NOT NULL DEFAULT 1,
  `product_type` enum('standard','pack','virtual','combinations','') NOT NULL DEFAULT '',
  PRIMARY KEY (`id_product`),
  KEY `reference_idx` (`reference`),
  KEY `supplier_reference_idx` (`supplier_reference`),
  KEY `product_supplier` (`id_supplier`),
  KEY `product_manufacturer` (`id_manufacturer`,`id_product`),
  KEY `id_category_default` (`id_category_default`),
  KEY `indexed` (`indexed`),
  KEY `date_add` (`date_add`),
  KEY `state` (`state`,`date_upd`)
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ps_product`
--

/*!40000 ALTER TABLE `ps_product` DISABLE KEYS */;
INSERT INTO `ps_product` VALUES (1,1,1,4,1,1,0,0,'','','','',0.000000,0,1,0,0,23.900000,5.490000,'',0.000000,0.000000,0.000000,'demo_1','','',0.000000,0.000000,0.000000,0.300000,2,1,0,0,0,0,1,'301-category',0,1,'0000-00-00',0,'new',1,1,'both',0,0,0,1,'2026-05-05 15:55:12','2026-05-05 15:55:12',0,3,1,'combinations'),(2,1,1,5,1,1,0,0,'','','','',0.000000,0,1,0,0,35.900000,5.490000,'',0.000000,0.000000,0.000000,'demo_3','','',0.000000,0.000000,0.000000,0.300000,2,1,0,0,0,0,1,'404',0,1,'0000-00-00',0,'new',1,1,'both',0,0,0,9,'2026-05-05 15:55:12','2026-05-05 15:55:12',0,3,1,'combinations'),(3,1,2,9,1,1,0,0,'','','','',0.000000,0,1,0,0,29.000000,5.490000,'',0.000000,0.000000,0.000000,'demo_6','','',0.000000,0.000000,0.000000,0.300000,2,1,0,0,0,0,1,'301-category',0,1,'0000-00-00',0,'new',1,1,'both',0,0,0,13,'2026-05-05 15:55:12','2026-05-05 15:55:12',0,3,1,'combinations'),(4,1,2,9,1,1,0,0,'','','','',0.000000,0,1,0,0,29.000000,5.490000,'',0.000000,0.000000,0.000000,'demo_5','','',0.000000,0.000000,0.000000,0.300000,2,1,0,0,0,0,1,'404',0,1,'0000-00-00',0,'new',1,1,'both',0,0,0,16,'2026-05-05 15:55:12','2026-05-05 15:55:12',0,3,1,'combinations'),(5,1,2,9,1,1,0,0,'','','','',0.000000,0,1,0,0,29.000000,5.490000,'',0.000000,0.000000,0.000000,'demo_7','','',0.000000,0.000000,0.000000,0.300000,2,1,0,0,0,0,1,'301-category',0,1,'0000-00-00',0,'new',1,1,'both',0,0,0,19,'2026-05-05 15:55:12','2026-05-05 15:55:12',0,3,1,'combinations'),(6,2,1,8,1,1,0,0,'','','','',0.000000,0,1,0,0,11.900000,5.490000,'',0.000000,0.000000,0.000000,'demo_11','','',0.000000,0.000000,0.000000,0.300000,2,1,0,0,0,0,1,'301-category',0,1,'0000-00-00',0,'new',1,1,'both',0,0,0,0,'2026-05-05 15:55:12','2026-05-05 15:55:12',0,3,1,'standard'),(7,2,1,8,1,1,0,0,'','','','',0.000000,0,1,0,0,11.900000,5.490000,'',0.000000,0.000000,0.000000,'demo_12','','',0.000000,0.000000,0.000000,0.300000,2,1,0,0,0,0,1,'301-category',0,1,'0000-00-00',0,'new',1,1,'both',0,0,0,0,'2026-05-05 15:55:12','2026-05-05 15:55:12',0,3,1,'standard'),(8,2,1,8,1,1,0,0,'','','','',0.000000,0,1,0,0,11.900000,5.490000,'',0.000000,0.000000,0.000000,'demo_13','','',0.000000,0.000000,0.000000,0.300000,2,1,0,0,0,0,1,'404',0,1,'0000-00-00',0,'new',1,1,'both',0,0,0,0,'2026-05-05 15:55:12','2026-05-05 15:55:12',0,3,1,'standard'),(9,2,1,8,1,1,0,0,'','','','',0.000000,0,1,0,0,18.900000,5.490000,'',0.000000,0.000000,0.000000,'demo_15','','',0.000000,0.000000,0.000000,0.300000,2,1,0,0,0,0,1,'301-category',0,1,'0000-00-00',0,'new',1,1,'both',0,0,0,22,'2026-05-05 15:55:12','2026-05-05 15:55:12',0,3,1,'combinations'),(10,2,1,8,1,1,0,0,'','','','',0.000000,0,1,0,0,18.900000,5.490000,'',0.000000,0.000000,0.000000,'demo_16','','',0.000000,0.000000,0.000000,0.300000,2,1,0,0,0,0,1,'301-category',0,1,'0000-00-00',0,'new',1,1,'both',0,0,0,24,'2026-05-05 15:55:12','2026-05-05 15:55:12',0,3,1,'combinations'),(11,2,1,8,1,1,0,0,'','','','',0.000000,0,1,0,0,18.900000,5.490000,'',0.000000,0.000000,0.000000,'demo_17','','',0.000000,0.000000,0.000000,0.300000,2,1,0,0,0,0,1,'301-category',0,1,'0000-00-00',0,'new',1,1,'both',0,0,0,26,'2026-05-05 15:55:12','2026-05-05 15:55:12',0,3,1,'combinations'),(12,2,2,9,1,1,0,0,'','','','',0.000000,0,1,0,0,9.000000,5.490000,'',0.000000,0.000000,0.000000,'demo_18','','',0.000000,0.000000,0.000000,0.300000,2,1,0,0,0,0,1,'301-category',0,1,'0000-00-00',0,'new',1,1,'both',0,0,1,0,'2026-05-05 15:55:12','2026-05-05 15:55:12',0,3,1,'virtual'),(13,2,2,9,1,1,0,0,'','','','',0.000000,0,1,0,0,9.000000,5.490000,'',0.000000,0.000000,0.000000,'demo_19','','',0.000000,0.000000,0.000000,0.300000,2,1,0,0,0,0,1,'301-category',0,1,'0000-00-00',0,'new',1,1,'both',0,0,1,0,'2026-05-05 15:55:12','2026-05-05 15:55:12',0,3,1,'virtual'),(14,2,2,9,1,1,0,0,'','','','',0.000000,0,1,0,0,9.000000,5.490000,'',0.000000,0.000000,0.000000,'demo_20','','',0.000000,0.000000,0.000000,0.300000,2,1,0,0,0,0,1,'301-category',0,1,'0000-00-00',0,'new',1,1,'both',0,0,1,0,'2026-05-05 15:55:12','2026-05-05 15:55:12',0,3,1,'virtual'),(15,2,0,8,1,1,0,0,'','','','',0.000000,0,1,0,0,35.000000,5.490000,'',0.000000,0.000000,0.000000,'demo_21','','',0.000000,0.000000,0.000000,0.300000,2,1,0,0,0,0,1,'301-category',0,1,'0000-00-00',0,'new',1,1,'both',1,0,0,0,'2026-05-05 15:55:12','2026-05-05 15:55:12',0,3,1,'pack'),(16,2,2,7,1,1,0,0,'','','','',0.000000,0,1,0,0,12.900000,5.490000,'',0.000000,0.000000,0.000000,'demo_8','','',0.000000,0.000000,0.000000,0.300000,2,1,0,0,0,0,1,'301-category',0,1,'0000-00-00',0,'new',1,1,'both',0,0,0,28,'2026-05-05 15:55:12','2026-05-05 15:55:12',0,3,1,'combinations'),(17,2,2,7,1,1,0,0,'','','','',0.000000,0,1,0,0,12.900000,5.490000,'',0.000000,0.000000,0.000000,'demo_9','','',0.000000,0.000000,0.000000,0.300000,2,1,0,0,0,0,1,'301-category',0,1,'0000-00-00',0,'new',1,1,'both',0,0,0,32,'2026-05-05 15:55:12','2026-05-05 15:55:12',0,3,1,'combinations'),(18,2,2,7,1,1,0,0,'','','','',0.000000,0,1,0,0,12.900000,5.490000,'',0.000000,0.000000,0.000000,'demo_10','','',0.000000,0.000000,0.000000,0.300000,2,1,0,0,0,0,1,'301-category',0,1,'0000-00-00',0,'new',1,1,'both',0,0,0,36,'2026-05-05 15:55:12','2026-05-05 15:55:12',0,3,1,'combinations'),(19,2,1,8,1,1,0,0,'','','','',0.000000,0,1,0,0,13.900000,5.490000,'',0.000000,0.000000,0.000000,'demo_14','','',0.000000,0.000000,0.000000,0.300000,2,1,0,1,0,1,1,'301-category',0,1,'0000-00-00',0,'new',1,1,'both',0,0,0,0,'2026-05-05 15:55:12','2026-05-05 15:55:12',0,3,1,'standard'),(20,0,0,0,1,0,0,0,'','','','',0.000000,0,0,NULL,0,19.990000,0.000000,'',0.000000,0.000000,0.000000,'REF001','','',0.000000,0.000000,0.000000,0.000000,2,0,0,0,0,0,1,'',0,1,'0000-00-00',0,'new',1,1,'both',0,0,0,0,'2026-05-06 19:45:03','2026-05-06 19:45:03',0,0,0,''),(21,0,0,0,1,0,0,0,'','','','',0.000000,0,0,NULL,0,29.990000,0.000000,'',0.000000,0.000000,0.000000,'REF002','','',0.000000,0.000000,0.000000,0.000000,2,0,0,0,0,0,1,'',0,1,'0000-00-00',0,'new',1,1,'both',0,0,0,0,'2026-05-06 19:45:06','2026-05-06 19:45:06',0,0,0,''),(22,0,0,0,1,0,0,0,'','','','',0.000000,0,0,NULL,0,9.990000,0.000000,'',0.000000,0.000000,0.000000,'REF003','','',0.000000,0.000000,0.000000,0.000000,2,0,0,0,0,0,1,'',0,1,'0000-00-00',0,'new',1,1,'both',0,0,0,0,'2026-05-06 19:45:06','2026-05-06 19:45:06',0,0,0,''),(30,0,0,0,1,0,0,0,'','','','',0.000000,0,0,NULL,0,100.000000,0.000000,'',0.000000,0.000000,0.000000,'RP-demo_1','','',0.000000,0.000000,0.000000,0.000000,2,0,0,0,0,0,1,'',0,1,'0000-00-00',0,'new',1,1,'both',0,0,0,0,'2026-05-07 22:47:12','2026-05-07 22:47:12',0,0,0,''),(31,0,0,0,1,0,0,0,'','','','',0.000000,0,0,NULL,0,60.000000,0.000000,'',0.000000,0.000000,0.000000,'RP-demo_2','','',0.000000,0.000000,0.000000,0.000000,2,0,0,0,0,0,1,'',0,1,'0000-00-00',0,'new',1,1,'both',0,0,0,0,'2026-05-07 22:47:13','2026-05-07 22:47:13',0,0,0,''),(32,0,0,0,1,0,0,0,'','','','',0.000000,0,0,NULL,0,1500.000000,0.000000,'',0.000000,0.000000,0.000000,'RP-demo_3','','',0.000000,0.000000,0.000000,0.000000,2,0,0,0,0,0,1,'',0,1,'0000-00-00',0,'new',1,1,'both',0,0,0,0,'2026-05-07 22:47:13','2026-05-07 22:47:13',0,0,0,''),(33,0,0,0,1,0,0,0,'','','','',0.000000,0,0,NULL,0,1150.000000,0.000000,'',0.000000,0.000000,0.000000,'RP-demo_4','','',0.000000,0.000000,0.000000,0.000000,2,0,0,0,0,0,1,'',0,1,'0000-00-00',0,'new',1,1,'both',0,0,0,0,'2026-05-07 22:47:13','2026-05-07 22:47:13',0,0,0,''),(34,0,0,0,1,0,0,0,'','','','',0.000000,0,0,NULL,0,240.000000,0.000000,'',0.000000,0.000000,0.000000,'RP-demo_5','','',0.000000,0.000000,0.000000,0.000000,2,0,0,0,0,0,1,'',0,1,'0000-00-00',0,'new',1,1,'both',0,0,0,0,'2026-05-07 22:47:13','2026-05-07 22:47:13',0,0,0,''),(35,0,0,0,1,0,0,0,'','','','',0.000000,0,0,NULL,0,25.000000,0.000000,'',0.000000,0.000000,0.000000,'RP-demo_6','','',0.000000,0.000000,0.000000,0.000000,2,0,0,0,0,0,1,'',0,1,'0000-00-00',0,'new',1,1,'both',0,0,0,0,'2026-05-07 22:47:13','2026-05-07 22:47:13',0,0,0,''),(36,0,0,0,1,0,0,0,'','','','',0.000000,0,0,NULL,0,125.000000,0.000000,'',0.000000,0.000000,0.000000,'RP-demo_7','','',0.000000,0.000000,0.000000,0.000000,2,0,0,0,0,0,1,'',0,1,'0000-00-00',0,'new',1,1,'both',0,0,0,0,'2026-05-07 22:47:14','2026-05-07 22:47:14',0,0,0,'');
/*!40000 ALTER TABLE `ps_product` ENABLE KEYS */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-07 22:48:19
