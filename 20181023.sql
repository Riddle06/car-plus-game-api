-- MySQL dump 10.13  Distrib 8.0.12, for macos10.13 (x86_64)
--
-- Host: localhost    Database: carPlusGame
-- ------------------------------------------------------
-- Server version	8.0.12

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
 SET NAMES utf8 ;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `game`
--

DROP TABLE IF EXISTS `game`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `game` (
  `id` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `parameters` json NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `game_cover_image_url` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `game`
--

LOCK TABLES `game` WRITE;
/*!40000 ALTER TABLE `game` DISABLE KEYS */;
INSERT INTO `game` VALUES ('08219c81-d446-11e8-9087-0242ac110002','超人接接樂','{}','天空中會落下氣球與炸彈，可透過點擊畫\n面改變左右方向，接到氣球可加分，接到\n炸彈會扣分或扣時間，限時3分鐘，接到越\n多氣球分數越高',''),('0821ce27-d446-11e8-9087-0242ac110002','射擊吧超人','{}','超人透過砲彈射擊壞人，按住螢幕瞄準，鬆手即\n發射，角度正確即可射擊成功，殺死越多壞人分\n數越高。','');
/*!40000 ALTER TABLE `game` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `game_item`
--

DROP TABLE IF EXISTS `game_item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `game_item` (
  `id` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `type` enum('role','tool') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'role',
  `image_url` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `point` decimal(18,2) NOT NULL DEFAULT '0.00',
  `date_created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `enabled_add_scroe_rate` tinyint(1) NOT NULL DEFAULT '0' COMMENT '啟用遊戲後',
  `enabled_add_game_point_rate` tinyint(1) NOT NULL DEFAULT '0',
  `used_times` int(11) NOT NULL DEFAULT '-1' COMMENT '使用次數：\n-1 無限\n',
  `add_scroe_rate` float DEFAULT '0' COMMENT '加分數的比例 0.1 => 10%',
  `add_game_point_rate` float DEFAULT '0' COMMENT '加超人幣的比例 0.1 => 10%',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `game_item`
--

LOCK TABLES `game_item` WRITE;
/*!40000 ALTER TABLE `game_item` DISABLE KEYS */;
INSERT INTO `game_item` VALUES ('8234f2f6-d446-11e8-9087-0242ac110002','頭像','role','',10.00,'2018-10-20 16:59:53',0,0,-1,0,0),('980d93e6-d446-11e8-9087-0242ac110002','頭像2','role','',20.00,'2018-10-20 16:59:53',0,0,-1,0,0),('c66f3992-d446-11e8-9087-0242ac110002','分數+10%','role','',100.00,'2018-10-20 17:01:47',1,0,2,0.1,0),('ee49f754-d446-11e8-9087-0242ac110002','超人幣+10%','role','',100.00,'2018-10-20 17:01:47',0,1,2,0,0.1);
/*!40000 ALTER TABLE `game_item` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `game_question`
--

DROP TABLE IF EXISTS `game_question`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `game_question` (
  `id` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `question` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `answer` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `sort` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `game_question`
--

LOCK TABLES `game_question` WRITE;
/*!40000 ALTER TABLE `game_question` DISABLE KEYS */;
/*!40000 ALTER TABLE `game_question` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `member`
--

DROP TABLE IF EXISTS `member`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `member` (
  `id` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `level` int(11) NOT NULL DEFAULT '1' COMMENT '目前等級',
  `car_plus_member_id` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '格上的會員 id',
  `experience` decimal(18,2) NOT NULL DEFAULT '0.00' COMMENT '經驗值',
  `car_plus_point` decimal(18,2) NOT NULL DEFAULT '0.00' COMMENT '格上紅利',
  `game_point` decimal(18,2) NOT NULL DEFAULT '0.00' COMMENT '超人幣',
  `nick_name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `date_created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `date_updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `member`
--

LOCK TABLES `member` WRITE;
/*!40000 ALTER TABLE `member` DISABLE KEYS */;
INSERT INTO `member` VALUES ('19df9956-d445-11e8-9087-0242ac110002',1,'0988e11c-9ce0-4bd6-a6a9-0e1ebcedd1df',0.00,0.00,0.00,'Rex','2018-10-20 16:50:30','2018-10-20 16:50:30'),('88d9bf14-cf52-42be-b1ca-7a64c42d3575',1,NULL,0.00,0.00,0.00,'測試','2018-10-20 18:39:23','2018-10-20 18:39:23'),('933a83b8-4cad-418c-8f38-8da170be3ee7',1,NULL,0.00,0.00,0.00,'測試','2018-10-20 19:31:45','2018-10-20 19:31:45'),('9efb28f4-9c35-499b-9a00-d530c3faa0e7',1,NULL,0.00,0.00,0.00,'測試','2018-10-20 19:34:12','2018-10-20 19:34:12'),('c12f4f54-8a94-4b8d-b608-a37e1bf14cd3',1,NULL,0.00,0.00,0.00,'測試','2018-10-20 19:35:10','2018-10-20 19:35:10');
/*!40000 ALTER TABLE `member` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `member_game_history`
--

DROP TABLE IF EXISTS `member_game_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `member_game_history` (
  `id` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `member_id` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `game_id` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `game_score` decimal(18,2) NOT NULL DEFAULT '0.00',
  `date_created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `date_finished` datetime DEFAULT NULL,
  `before_experience` decimal(18,2) NOT NULL DEFAULT '0.00',
  `after_experience` decimal(18,2) NOT NULL DEFAULT '0.00',
  `change_experience` decimal(18,2) NOT NULL DEFAULT '0.00',
  `before_level` int(11) NOT NULL DEFAULT '0',
  `after_level` int(11) NOT NULL DEFAULT '0',
  `change_level` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `member_game_history`
--

LOCK TABLES `member_game_history` WRITE;
/*!40000 ALTER TABLE `member_game_history` DISABLE KEYS */;
/*!40000 ALTER TABLE `member_game_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `member_game_history_game_item`
--

DROP TABLE IF EXISTS `member_game_history_game_item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `member_game_history_game_item` (
  `member_game_item_id` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `member_game_history_id` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `date_created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `date_updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`member_game_item_id`,`member_game_history_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `member_game_history_game_item`
--

LOCK TABLES `member_game_history_game_item` WRITE;
/*!40000 ALTER TABLE `member_game_history_game_item` DISABLE KEYS */;
/*!40000 ALTER TABLE `member_game_history_game_item` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `member_game_item`
--

DROP TABLE IF EXISTS `member_game_item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `member_game_item` (
  `id` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `member_id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `game_item_id` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `enabled` tinyint(1) NOT NULL,
  `date_created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `date_updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `total_used_times` int(11) NOT NULL,
  `remain_times` int(11) NOT NULL,
  `date_last_used` datetime NOT NULL,
  `is_using` tinyint(1) NOT NULL DEFAULT '0' COMMENT '正在使用中',
  `member_game_point_history_id` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `member_game_item`
--

LOCK TABLES `member_game_item` WRITE;
/*!40000 ALTER TABLE `member_game_item` DISABLE KEYS */;
/*!40000 ALTER TABLE `member_game_item` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `member_game_point_history`
--

DROP TABLE IF EXISTS `member_game_point_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `member_game_point_history` (
  `id` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `member_id` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` enum('game','car_plus_point_transfer_to_game_point','game_point_transfer_to_car_plus_point','game_point_transfer_to_game_item') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'game',
  `before_game_point` decimal(18,2) NOT NULL DEFAULT '0.00',
  `after_game_point` decimal(18,2) NOT NULL DEFAULT '0.00',
  `change_game_point` decimal(18,2) NOT NULL DEFAULT '0.00',
  `before_car_plus_point` decimal(18,2) NOT NULL DEFAULT '0.00',
  `after_car_plus_point` decimal(18,2) NOT NULL DEFAULT '0.00',
  `change_car_plus_point` decimal(18,2) NOT NULL DEFAULT '0.00',
  `date_created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `description` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `game_item_id` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `member_game_item_id` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `member_game_point_history`
--

LOCK TABLES `member_game_point_history` WRITE;
/*!40000 ALTER TABLE `member_game_point_history` DISABLE KEYS */;
/*!40000 ALTER TABLE `member_game_point_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `member_login`
--

DROP TABLE IF EXISTS `member_login`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `member_login` (
  `client_id` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `member_id` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_logout` tinyint(1) NOT NULL DEFAULT '0',
  `date_created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `date_updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `date_last_logout` datetime DEFAULT NULL,
  PRIMARY KEY (`client_id`,`member_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `member_login`
--

LOCK TABLES `member_login` WRITE;
/*!40000 ALTER TABLE `member_login` DISABLE KEYS */;
/*!40000 ALTER TABLE `member_login` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vars`
--

DROP TABLE IF EXISTS `vars`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `vars` (
  `key` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `meta_str_1` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `meta_str_2` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `meta_int_1` int(11) DEFAULT NULL,
  `meta_int_2` int(11) DEFAULT NULL,
  `meta_str_long` longtext COLLATE utf8mb4_unicode_ci,
  `meta_date_1` datetime DEFAULT NULL,
  `meta_date_2` datetime DEFAULT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vars`
--

LOCK TABLES `vars` WRITE;
/*!40000 ALTER TABLE `vars` DISABLE KEYS */;
INSERT INTO `vars` VALUES ('test','test_description',NULL,NULL,1,0,NULL,NULL,NULL);
/*!40000 ALTER TABLE `vars` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2018-10-23 22:45:45
