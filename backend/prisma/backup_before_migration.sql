-- MariaDB dump 10.18  Distrib 10.4.17-MariaDB, for Win64 (AMD64)
--
-- Host: 127.0.0.1    Database: e_comm
-- ------------------------------------------------------
-- Server version	10.4.17-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `_categorytoproduct`
--

DROP TABLE IF EXISTS `_categorytoproduct`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `_categorytoproduct` (
  `A` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `B` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  UNIQUE KEY `_CategoryToProduct_AB_unique` (`A`,`B`),
  KEY `_CategoryToProduct_B_index` (`B`),
  CONSTRAINT `_CategoryToProduct_A_fkey` FOREIGN KEY (`A`) REFERENCES `category` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `_CategoryToProduct_B_fkey` FOREIGN KEY (`B`) REFERENCES `product` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `_categorytoproduct`
--

LOCK TABLES `_categorytoproduct` WRITE;
/*!40000 ALTER TABLE `_categorytoproduct` DISABLE KEYS */;
INSERT INTO `_categorytoproduct` VALUES ('cmpcf4w6q000cqbv8jxl0440e','cmpcf4w76000gqbv8q5cfefo6'),('cmpcf4w6q000cqbv8jxl0440e','cmpcf4w7h000hqbv8z3mqsij4'),('cmpcf4w6q000cqbv8jxl0440e','cmpcf4w7l000iqbv8fgkibhkl'),('cmpcf4w6u000dqbv8leex4deh','cmpcf4w7r000jqbv82fok71y0'),('cmpcf4w6u000dqbv8leex4deh','cmpcf4w7w000kqbv8h1fnqb9e'),('cmpcf4w73000fqbv8lyt0g128','cmpcf4w80000lqbv8mcy01m1h'),('cmpcf4w73000fqbv8lyt0g128','cmpcf4w84000mqbv8zf8d90wa');
/*!40000 ALTER TABLE `_categorytoproduct` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `_producttotag`
--

DROP TABLE IF EXISTS `_producttotag`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `_producttotag` (
  `A` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `B` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  UNIQUE KEY `_ProductToTag_AB_unique` (`A`,`B`),
  KEY `_ProductToTag_B_index` (`B`),
  CONSTRAINT `_ProductToTag_A_fkey` FOREIGN KEY (`A`) REFERENCES `product` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `_ProductToTag_B_fkey` FOREIGN KEY (`B`) REFERENCES `tag` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `_producttotag`
--

LOCK TABLES `_producttotag` WRITE;
/*!40000 ALTER TABLE `_producttotag` DISABLE KEYS */;
/*!40000 ALTER TABLE `_producttotag` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `area`
--

DROP TABLE IF EXISTS `area`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `area` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `cityId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `deliveryCharge` double NOT NULL DEFAULT 0,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Area_name_cityId_key` (`name`,`cityId`),
  KEY `Area_cityId_idx` (`cityId`),
  CONSTRAINT `Area_cityId_fkey` FOREIGN KEY (`cityId`) REFERENCES `city` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `area`
--

LOCK TABLES `area` WRITE;
/*!40000 ALTER TABLE `area` DISABLE KEYS */;
/*!40000 ALTER TABLE `area` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `attribute`
--

DROP TABLE IF EXISTS `attribute`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `attribute` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `showOnFilter` tinyint(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Attribute_name_key` (`name`),
  UNIQUE KEY `Attribute_slug_key` (`slug`),
  KEY `Attribute_slug_idx` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `attribute`
--

LOCK TABLES `attribute` WRITE;
/*!40000 ALTER TABLE `attribute` DISABLE KEYS */;
/*!40000 ALTER TABLE `attribute` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `attributevalue`
--

DROP TABLE IF EXISTS `attributevalue`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `attributevalue` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `attributeId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `showOnFilter` tinyint(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`),
  UNIQUE KEY `AttributeValue_value_attributeId_key` (`value`,`attributeId`),
  KEY `AttributeValue_attributeId_idx` (`attributeId`),
  CONSTRAINT `AttributeValue_attributeId_fkey` FOREIGN KEY (`attributeId`) REFERENCES `attribute` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `attributevalue`
--

LOCK TABLES `attributevalue` WRITE;
/*!40000 ALTER TABLE `attributevalue` DISABLE KEYS */;
/*!40000 ALTER TABLE `attributevalue` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `brand`
--

DROP TABLE IF EXISTS `brand`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `brand` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `logo` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `content` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `seoData` longtext COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Brand_slug_key` (`slug`),
  KEY `Brand_slug_idx` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `brand`
--

LOCK TABLES `brand` WRITE;
/*!40000 ALTER TABLE `brand` DISABLE KEYS */;
INSERT INTO `brand` VALUES ('cmpc6cn8n00bvqb00im8bd4rr','CeraVe','cerave',NULL,'2026-05-19 05:10:30.312','2026-05-19 05:10:30.312',NULL,NULL),('cmpc6coga00bzqb008g9lzpxi','Nivea','nivea',NULL,'2026-05-19 05:10:31.883','2026-05-19 05:10:31.883',NULL,NULL),('cmpc6cp1s00c3qb00h7ol7qh3','Garnier','garnier',NULL,'2026-05-19 05:10:32.657','2026-05-19 05:10:32.657',NULL,NULL),('cmpc6csys00g5qb00t9yj8oq5','The Derma Co','the-derma-co',NULL,'2026-05-19 05:10:37.732','2026-05-19 05:10:37.732',NULL,NULL),('cmpc6cwpd00gkqb00svn2q0jy','Dot &amp; key','dot-amp-key',NULL,'2026-05-19 05:10:42.578','2026-05-19 05:10:42.578',NULL,NULL),('cmpc6cypp00gtqb00vifurapn','Chemist at Play','chemist-at-play',NULL,'2026-05-19 05:10:45.181','2026-05-19 05:10:45.181',NULL,NULL),('cmpc6czhf00gxqb00mohgv58h','Loreal','loreal',NULL,'2026-05-19 05:10:46.179','2026-05-19 05:10:46.179',NULL,NULL),('cmpc6d9fu00i5qb001e0ceoi0','Minimalist','minimalist',NULL,'2026-05-19 05:10:59.082','2026-05-19 05:10:59.082',NULL,NULL),('cmpc6dkmd00jbqb00hzqucxih','WishCare','wishcare',NULL,'2026-05-19 05:11:13.573','2026-05-19 05:11:13.573',NULL,NULL),('cmpc6evse00kwqb000rlsbpy1','Fixderma','fixderma',NULL,'2026-05-19 05:12:14.702','2026-05-19 05:12:14.702',NULL,NULL),('cmpc6fa1100m7qb00wrt71q93','Avene','avene',NULL,'2026-05-19 05:12:33.157','2026-05-19 05:12:33.157',NULL,NULL),('cmpc6fb9700meqb00g17gha1l','Neutrogena','neutrogena',NULL,'2026-05-19 05:12:34.747','2026-05-19 05:12:34.747',NULL,NULL),('cmpc6fc1z00miqb00l17w03sz','Simple','simple',NULL,'2026-05-19 05:12:35.784','2026-05-19 05:12:35.784',NULL,NULL),('cmpc6gbo900mpqb00oxdxasgk','Cosrx','cosrx',NULL,'2026-05-19 05:13:21.945','2026-05-19 05:13:21.945',NULL,NULL),('cmpc6gdr900n2qb00rsvqynkf','Vaseline','vaseline',NULL,'2026-05-19 05:13:24.646','2026-05-19 05:13:24.646',NULL,NULL),('cmpc6gesr00n6qb00tf9je46x','Maybelline','maybelline',NULL,'2026-05-19 05:13:25.996','2026-05-19 05:13:25.996',NULL,NULL),('cmpc6gf7i00naqb00sm4bg6w0','Dove','dove',NULL,'2026-05-19 05:13:26.527','2026-05-19 05:13:26.527',NULL,NULL),('cmpc6gh6h00nhqb00tkeutxuy','POND\'S','pond-s',NULL,'2026-05-19 05:13:29.082','2026-05-19 05:13:29.082',NULL,NULL),('cmpc6gn5f00o9qb00ek1i3mzh','The Ordinary','the-ordinary',NULL,'2026-05-19 05:13:36.819','2026-05-19 05:13:36.819',NULL,NULL),('cmpc6gwtd00pcqb00rdq6jbbj','Yc Whitening','yc-whitening',NULL,'2026-05-19 05:13:49.345','2026-05-19 05:13:49.345',NULL,NULL),('cmpc6h3ni00qdqb001qzbsul5','Veet','veet',NULL,'2026-05-19 05:13:58.206','2026-05-19 05:13:58.206',NULL,NULL),('cmpc6h93u00qsqb00oe2ritv4','W.Dressroom','w-dressroom',NULL,'2026-05-19 05:14:05.274','2026-05-19 05:14:05.274',NULL,NULL),('cmpc6had700qzqb00urgsx6pd','APLB','aplb',NULL,'2026-05-19 05:14:06.907','2026-05-19 05:14:06.907',NULL,NULL),('cmpc6hbor00r3qb00gzeuwq2z','Omi','omi',NULL,'2026-05-19 05:14:08.619','2026-05-19 05:14:08.619',NULL,NULL),('cmpc6hdjt00raqb00e5rio210','Medicube','medicube',NULL,'2026-05-19 05:14:11.034','2026-05-19 05:14:11.034',NULL,NULL),('cmpc6hizp00rzqb00w1xxhzzh','Anua','anua',NULL,'2026-05-19 05:14:18.086','2026-05-19 05:14:18.086',NULL,NULL);
/*!40000 ALTER TABLE `brand` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `buildercomponent`
--

DROP TABLE IF EXISTS `buildercomponent`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `buildercomponent` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `label` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `BuilderComponent_name_key` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `buildercomponent`
--

LOCK TABLES `buildercomponent` WRITE;
/*!40000 ALTER TABLE `buildercomponent` DISABLE KEYS */;
INSERT INTO `buildercomponent` VALUES ('cmpcf4w89000nqbv83cwlbji4','HeroBanner','Hero Banner','Hero','2026-05-19 09:16:25.257','2026-05-19 09:16:25.257'),('cmpcf4w9b0010qbv8v3mfaus9','SpecialOffersBanner','Special Offers','Marketing','2026-05-19 09:16:25.296','2026-05-19 09:16:25.296'),('cmpcf4waf001hqbv81g1t0ip8','ProductShowcase','Product Grid','Commerce','2026-05-19 09:16:25.335','2026-05-19 09:16:25.335'),('cmpcf4wb2001qqbv8hrbolrdr','PromoBadgeGrid','Promo Features','Marketing','2026-05-19 09:16:25.359','2026-05-19 09:16:25.359'),('cmpcf4wbb001tqbv8z32livpj','TestimonialSection','Testimonials','Content','2026-05-19 09:16:25.367','2026-05-19 09:16:25.367'),('cmpcf4wbz0022qbv86ruy5pzn','HotDealsSection','Hot Deals','Commerce','2026-05-19 09:16:25.392','2026-05-19 09:16:25.392'),('cmpcf4wcc0029qbv833z523e9','ConsultationBanner','Consultation','Marketing','2026-05-19 09:16:25.404','2026-05-19 09:16:25.404'),('cmpcf4wdd002mqbv8v5htb1sj','RoutineBanner','Routine','Marketing','2026-05-19 09:16:25.441','2026-05-19 09:16:25.441'),('cmpcf4wed0031qbv854c8p9pj','NewArrivalsSection','New Arrivals','Commerce','2026-05-19 09:16:25.478','2026-05-19 09:16:25.478');
/*!40000 ALTER TABLE `buildercomponent` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `buildercomponentcontent`
--

DROP TABLE IF EXISTS `buildercomponentcontent`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `buildercomponentcontent` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `componentId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `key` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`value`)),
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `BuilderComponentContent_componentId_key_key` (`componentId`,`key`),
  KEY `BuilderComponentContent_componentId_idx` (`componentId`),
  CONSTRAINT `BuilderComponentContent_componentId_fkey` FOREIGN KEY (`componentId`) REFERENCES `buildercomponent` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `buildercomponentcontent`
--

LOCK TABLES `buildercomponentcontent` WRITE;
/*!40000 ALTER TABLE `buildercomponentcontent` DISABLE KEYS */;
INSERT INTO `buildercomponentcontent` VALUES ('cmpcf4w8e000pqbv8tt8hxij7','cmpcf4w89000nqbv83cwlbji4','title','\"Discover Natural Beauty\"','2026-05-19 09:16:25.262','2026-05-19 09:16:25.262'),('cmpcf4w8j000rqbv82lsg9onz','cmpcf4w89000nqbv83cwlbji4','subtitle','\"Premium skincare for your daily routine\"','2026-05-19 09:16:25.267','2026-05-19 09:16:25.267'),('cmpcf4w8o000tqbv8fknabfsg','cmpcf4w89000nqbv83cwlbji4','ctaText','\"Shop Now\"','2026-05-19 09:16:25.273','2026-05-19 09:16:25.273'),('cmpcf4w8y000vqbv8ar9et0er','cmpcf4w89000nqbv83cwlbji4','ctaHref','\"/products\"','2026-05-19 09:16:25.283','2026-05-19 09:16:25.283'),('cmpcf4w90000xqbv8bch401fw','cmpcf4w89000nqbv83cwlbji4','imageSrc','\"https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80\"','2026-05-19 09:16:25.285','2026-05-19 09:16:25.285'),('cmpcf4w94000zqbv8aqkuvvz7','cmpcf4w89000nqbv83cwlbji4','textAlign','\"left\"','2026-05-19 09:16:25.289','2026-05-19 09:16:25.289'),('cmpcf4w9h0012qbv82cb8n5rd','cmpcf4w9b0010qbv8v3mfaus9','title','\"Special Offers\"','2026-05-19 09:16:25.301','2026-05-19 09:16:25.301'),('cmpcf4w9m0014qbv8t4ozad1w','cmpcf4w9b0010qbv8v3mfaus9','subtitle','\"Get the best deals\"','2026-05-19 09:16:25.306','2026-05-19 09:16:25.306'),('cmpcf4w9q0016qbv8mm66f7w9','cmpcf4w9b0010qbv8v3mfaus9','ctaText','\"Shop Now\"','2026-05-19 09:16:25.311','2026-05-19 09:16:25.311'),('cmpcf4w9s0018qbv8o60d4x4o','cmpcf4w9b0010qbv8v3mfaus9','ctaHref','\"/products?sort=discount\"','2026-05-19 09:16:25.313','2026-05-19 09:16:25.313'),('cmpcf4w9w001aqbv82c85751y','cmpcf4w9b0010qbv8v3mfaus9','bgColor','\"from-blue-600 via-blue-700 to-indigo-800\"','2026-05-19 09:16:25.317','2026-05-19 09:16:25.317'),('cmpcf4wa1001cqbv8xr8betao','cmpcf4w9b0010qbv8v3mfaus9','leftImageSrc','\"https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=400&q=80\"','2026-05-19 09:16:25.321','2026-05-19 09:16:25.321'),('cmpcf4wa7001eqbv8gyac9ysk','cmpcf4w9b0010qbv8v3mfaus9','rightImageSrc','\"https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=400&q=80\"','2026-05-19 09:16:25.328','2026-05-19 09:16:25.328'),('cmpcf4wac001gqbv8imxf9wbk','cmpcf4w9b0010qbv8v3mfaus9','textAlign','\"left\"','2026-05-19 09:16:25.333','2026-05-19 09:16:25.333'),('cmpcf4wak001jqbv8ddok2b63','cmpcf4waf001hqbv81g1t0ip8','title','\"Shop by Category\"','2026-05-19 09:16:25.341','2026-05-19 09:16:25.341'),('cmpcf4wap001lqbv8tn346489','cmpcf4waf001hqbv81g1t0ip8','subtitle','\"Browse our curated collection of premium products\"','2026-05-19 09:16:25.345','2026-05-19 09:16:25.345'),('cmpcf4wau001nqbv8giz7uep2','cmpcf4waf001hqbv81g1t0ip8','showcaseCategoryId','\"all\"','2026-05-19 09:16:25.350','2026-05-19 09:16:25.350'),('cmpcf4waz001pqbv8jg3dmdie','cmpcf4waf001hqbv81g1t0ip8','textAlign','\"left\"','2026-05-19 09:16:25.355','2026-05-19 09:16:25.355'),('cmpcf4wb7001sqbv811rm7pj1','cmpcf4wb2001qqbv8hrbolrdr','badges','[{\"title\":\"Buy 1 Get 1\",\"subtitle\":\"Free\",\"iconName\":\"Gift\",\"bgColor\":\"from-blue-500 to-blue-700\",\"href\":\"/products?offer=bogo\"},{\"title\":\"Stock\",\"subtitle\":\"Clearance\",\"iconName\":\"Package\",\"bgColor\":\"from-emerald-500 to-teal-700\",\"href\":\"/products?offer=clearance\"},{\"title\":\"Combo\",\"subtitle\":\"Sale\",\"iconName\":\"Boxes\",\"bgColor\":\"from-purple-500 to-indigo-700\",\"href\":\"/products?offer=combo\"},{\"title\":\"Makeup\",\"subtitle\":\"Sale\",\"iconName\":\"Sparkles\",\"bgColor\":\"from-rose-500 to-pink-700\",\"href\":\"/products?offer=makeup\"}]','2026-05-19 09:16:25.364','2026-05-19 09:16:25.364'),('cmpcf4wbi001vqbv8dpkbsnbs','cmpcf4wbb001tqbv8z32livpj','title','\"Real Results, Real Beauty\"','2026-05-19 09:16:25.374','2026-05-19 09:16:25.374'),('cmpcf4wbk001xqbv8o9ceypqp','cmpcf4wbb001tqbv8z32livpj','subtitle','\"See what our customers are saying\"','2026-05-19 09:16:25.376','2026-05-19 09:16:25.376'),('cmpcf4wbp001zqbv8dotytk8z','cmpcf4wbb001tqbv8z32livpj','textAlign','\"center\"','2026-05-19 09:16:25.381','2026-05-19 09:16:25.381'),('cmpcf4wbu0021qbv8pqbtpqu4','cmpcf4wbb001tqbv8z32livpj','testimonials','[{\"name\":\"Sarah Johnson\",\"avatar\":\"https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80\",\"rating\":5,\"review\":\"Absolutely love the glow serum! My skin has never looked better. Saw visible results within just 2 weeks of daily use.\",\"product\":\"Radiance Glow Serum\"},{\"name\":\"Emily Chen\",\"avatar\":\"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80\",\"rating\":5,\"review\":\"The moisturizer is so hydrating without being heavy. Perfect for my combination skin type. Highly recommend!\",\"product\":\"Hydra Boost Moisturizer\"},{\"name\":\"Aisha Rahman\",\"avatar\":\"https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80\",\"rating\":4,\"review\":\"Great value for money. The vitamin C serum helped fade my dark spots significantly. Will repurchase for sure.\",\"product\":\"Vitamin C Brightening Serum\"},{\"name\":\"Lisa Park\",\"avatar\":\"https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80\",\"rating\":5,\"review\":\"The sunscreen is lightweight and doesn\'t leave a white cast. Finally found my HG sunscreen! Perfect under makeup.\",\"product\":\"Invisible Shield SPF 50\"}]','2026-05-19 09:16:25.387','2026-05-19 09:16:25.387'),('cmpcf4wc20024qbv8kk6nopxi','cmpcf4wbz0022qbv86ruy5pzn','title','\"Hot Deals\"','2026-05-19 09:16:25.395','2026-05-19 09:16:25.395'),('cmpcf4wc40026qbv80dvsxag6','cmpcf4wbz0022qbv86ruy5pzn','subtitle','\"Grab them before they\'re gone!\"','2026-05-19 09:16:25.396','2026-05-19 09:16:25.396'),('cmpcf4wc80028qbv8up16povk','cmpcf4wbz0022qbv86ruy5pzn','deals','[{\"name\":\"Premium Face Wash Bundle\",\"originalPrice\":\"৳1,800\",\"salePrice\":\"৳999\",\"discount\":\"45% OFF\",\"image\":\"https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=400&q=80\",\"endsIn\":\"2d 14h\"},{\"name\":\"Korean Skincare Set\",\"originalPrice\":\"৳3,500\",\"salePrice\":\"৳2,100\",\"discount\":\"40% OFF\",\"image\":\"https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=400&q=80\",\"endsIn\":\"1d 8h\"},{\"name\":\"Anti-Aging Combo Pack\",\"originalPrice\":\"৳4,200\",\"salePrice\":\"৳2,520\",\"discount\":\"40% OFF\",\"image\":\"https://images.unsplash.com/photo-1596755389378-c31d21fd1273?auto=format&fit=crop&w=400&q=80\",\"endsIn\":\"3d 5h\"},{\"name\":\"SPF Protection Kit\",\"originalPrice\":\"৳2,000\",\"salePrice\":\"৳1,200\",\"discount\":\"40% OFF\",\"image\":\"https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?auto=format&fit=crop&w=400&q=80\",\"endsIn\":\"5h 30m\"}]','2026-05-19 09:16:25.400','2026-05-19 09:16:25.400'),('cmpcf4wci002bqbv8hqa9hpi6','cmpcf4wcc0029qbv833z523e9','title','\"Doctor\'s Skincare Consultation\"','2026-05-19 09:16:25.411','2026-05-19 09:16:25.411'),('cmpcf4wcl002dqbv8u31hwgbp','cmpcf4wcc0029qbv833z523e9','subtitle','\"Get free personalized consultation from top skin specialists.\"','2026-05-19 09:16:25.414','2026-05-19 09:16:25.414'),('cmpcf4wcq002fqbv8iz53c623','cmpcf4wcc0029qbv833z523e9','ctaText','\"Book Free Session\"','2026-05-19 09:16:25.419','2026-05-19 09:16:25.419'),('cmpcf4wcy002hqbv8zdslc7n7','cmpcf4wcc0029qbv833z523e9','ctaHref','\"/consultation\"','2026-05-19 09:16:25.427','2026-05-19 09:16:25.427'),('cmpcf4wd0002jqbv8nqgv2nw4','cmpcf4wcc0029qbv833z523e9','imageSrc','\"https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=800&q=80\"','2026-05-19 09:16:25.429','2026-05-19 09:16:25.429'),('cmpcf4wd6002lqbv8cfrq0bdt','cmpcf4wcc0029qbv833z523e9','imageAlign','\"right\"','2026-05-19 09:16:25.434','2026-05-19 09:16:25.434'),('cmpcf4wdi002oqbv85v5v9dzm','cmpcf4wdd002mqbv8v5htb1sj','title','\"Daily Skincare Routine Guide\"','2026-05-19 09:16:25.447','2026-05-19 09:16:25.447'),('cmpcf4wdn002qqbv82p2gynje','cmpcf4wdd002mqbv8v5htb1sj','subtitle','\"Simple steps for glowing health\"','2026-05-19 09:16:25.451','2026-05-19 09:16:25.451'),('cmpcf4wdq002sqbv8lcuaci42','cmpcf4wdd002mqbv8v5htb1sj','description','\"Consistency is key to skin health. Follow our morning and night skincare routine guides tailored specifically for your skin profile to achieve natural, glowing beauty.\"','2026-05-19 09:16:25.455','2026-05-19 09:16:25.455'),('cmpcf4wdu002uqbv8e1egfyqy','cmpcf4wdd002mqbv8v5htb1sj','ctaText','\"Read Routine Guide\"','2026-05-19 09:16:25.459','2026-05-19 09:16:25.459'),('cmpcf4wdz002wqbv8ztpkhzxu','cmpcf4wdd002mqbv8v5htb1sj','ctaHref','\"/guides/routine\"','2026-05-19 09:16:25.463','2026-05-19 09:16:25.463'),('cmpcf4we1002yqbv8yqmbr8el','cmpcf4wdd002mqbv8v5htb1sj','imageSrc','\"https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80\"','2026-05-19 09:16:25.465','2026-05-19 09:16:25.465'),('cmpcf4we50030qbv8qmobqekk','cmpcf4wdd002mqbv8v5htb1sj','imageAlign','\"left\"','2026-05-19 09:16:25.469','2026-05-19 09:16:25.469'),('cmpcf4wef0033qbv8tds1yqm7','cmpcf4wed0031qbv854c8p9pj','title','\"New Arrivals\"','2026-05-19 09:16:25.480','2026-05-19 09:16:25.480'),('cmpcf4weh0035qbv8roiwj9sk','cmpcf4wed0031qbv854c8p9pj','subtitle','\"Be the first to try our latest organic additions\"','2026-05-19 09:16:25.482','2026-05-19 09:16:25.482'),('cmpcf4wek0037qbv8tvncxyfu','cmpcf4wed0031qbv854c8p9pj','ctaHref','\"/products?sort=newest\"','2026-05-19 09:16:25.485','2026-05-19 09:16:25.485');
/*!40000 ALTER TABLE `buildercomponentcontent` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `builderpage`
--

DROP TABLE IF EXISTS `builderpage`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `builderpage` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `key` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'builder',
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'draft',
  `draftVersionId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `publishedVersionId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `BuilderPage_key_key` (`key`),
  UNIQUE KEY `BuilderPage_slug_key` (`slug`),
  KEY `BuilderPage_key_idx` (`key`),
  KEY `BuilderPage_slug_idx` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `builderpage`
--

LOCK TABLES `builderpage` WRITE;
/*!40000 ALTER TABLE `builderpage` DISABLE KEYS */;
INSERT INTO `builderpage` VALUES ('cmpaz4bez0000qbn8p5edswxq','home','/','Home','builder','published','cmpch0soh0003qbbwskh4tjm4','cmpch0soh0003qbbwskh4tjm4','2026-05-18 09:00:18.251','2026-05-19 10:09:14.381');
/*!40000 ALTER TABLE `builderpage` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `builderpageversion`
--

DROP TABLE IF EXISTS `builderpageversion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `builderpageversion` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `pageId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `version` int(11) NOT NULL,
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'draft',
  `document` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`document`)),
  `createdById` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `publishedAt` datetime(3) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `activeFrom` datetime(3) DEFAULT NULL,
  `activeTo` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `BuilderPageVersion_pageId_version_key` (`pageId`,`version`),
  KEY `BuilderPageVersion_pageId_status_idx` (`pageId`,`status`),
  CONSTRAINT `BuilderPageVersion_pageId_fkey` FOREIGN KEY (`pageId`) REFERENCES `builderpage` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `builderpageversion`
--

LOCK TABLES `builderpageversion` WRITE;
/*!40000 ALTER TABLE `builderpageversion` DISABLE KEYS */;
INSERT INTO `builderpageversion` VALUES ('cmpaz4bfa0002qbn8gdvu1gjd','cmpaz4bez0000qbn8p5edswxq',1,'archived','{\"schemaVersion\":1,\"page\":{\"key\":\"home\",\"slug\":\"/\",\"title\":\"Home\"},\"sections\":[{\"id\":\"hero_banner_5e361b4d-5b45-4a40-b923-05727410a1ce\",\"type\":\"HeroBanner\",\"props\":{\"title\":\"Discover Natural Beauty\",\"subtitle\":\"Premium skincare for your daily routine\",\"ctaText\":\"Shop Now\",\"ctaHref\":\"/products\",\"imageSrc\":\"https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80\",\"textAlign\":\"left\"}},{\"id\":\"special_offers_banner_72c8d6be-5bbc-46fc-8f1e-f6c4c3a14b72\",\"type\":\"SpecialOffersBanner\",\"props\":{\"title\":\"Special Offers\",\"subtitle\":\"Get the best deals\",\"ctaText\":\"Shop Now\",\"ctaHref\":\"/products?sort=discount\",\"bgColor\":\"from-blue-600 via-blue-700 to-indigo-800\",\"leftImageSrc\":\"https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=400&q=80\",\"rightImageSrc\":\"https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=400&q=80\",\"textAlign\":\"center\"}}]}','cmpasjs0a0000qbzcflw0m65f','2026-05-18 09:00:19.585','2026-05-18 09:00:18.262',NULL,NULL),('cmpazasiq0001qbc4enp5kpdh','cmpaz4bez0000qbn8p5edswxq',2,'archived','{\"schemaVersion\":1,\"page\":{\"key\":\"home\",\"slug\":\"/\",\"title\":\"Home\"},\"sections\":[{\"id\":\"hero_banner_5e361b4d-5b45-4a40-b923-05727410a1ce\",\"type\":\"HeroBanner\",\"props\":{\"title\":\"Discover Natural Beauty\",\"subtitle\":\"Premium skincare for your daily routine\",\"ctaText\":\"Shop Now\",\"ctaHref\":\"/products\",\"imageSrc\":\"https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80\",\"textAlign\":\"left\"}},{\"id\":\"special_offers_banner_72c8d6be-5bbc-46fc-8f1e-f6c4c3a14b72\",\"type\":\"SpecialOffersBanner\",\"props\":{\"title\":\"Special Offers\",\"subtitle\":\"Get the best deals\",\"ctaText\":\"Shop Now\",\"ctaHref\":\"/products?sort=discount\",\"bgColor\":\"from-blue-600 via-blue-700 to-indigo-800\",\"leftImageSrc\":\"https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=400&q=80\",\"rightImageSrc\":\"https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=400&q=80\",\"textAlign\":\"center\"}},{\"id\":\"hero_banner_272f6335-2dc9-483c-b5ae-1fb87e352115\",\"type\":\"HeroBanner\",\"props\":{\"title\":\"Discover Natural Beauty\",\"subtitle\":\"Premium skincare for your daily routine\",\"ctaText\":\"Shop Now\",\"ctaHref\":\"/products\",\"imageSrc\":\"https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80\",\"textAlign\":\"left\"}}]}','cmpasjs0a0000qbzcflw0m65f','2026-05-18 09:05:21.838','2026-05-18 09:05:20.354',NULL,NULL),('cmpazofmu0003qbc47fgjzn3n','cmpaz4bez0000qbn8p5edswxq',3,'draft','{\"schemaVersion\":1,\"page\":{\"key\":\"home\",\"slug\":\"/\",\"title\":\"Home\"},\"sections\":[{\"id\":\"new_arrivals_section_5154ef33-5dc4-4623-91e5-14000c5754dd\",\"type\":\"NewArrivalsSection\",\"props\":{\"title\":\"Just Dropped\",\"subtitle\":\"NEW ARRIVALS\",\"ctaHref\":\"/products?sort=newest\"}},{\"id\":\"hot_deals_section_49031253-6e81-411d-8810-178b232143b6\",\"type\":\"HotDealsSection\",\"props\":{}},{\"id\":\"hero_banner_e5c3ab63-5bd1-4666-8c6a-a40f072dada3\",\"type\":\"HeroBanner\",\"props\":{\"title\":\"Discover Natural Beauty\",\"subtitle\":\"Premium skincare for your daily routine\",\"ctaText\":\"Shop Now\",\"ctaHref\":\"/products\",\"imageSrc\":\"https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80\",\"textAlign\":\"left\"}},{\"id\":\"special_offers_banner_495d9aa5-ef43-45f0-a7e2-ce6f02798801\",\"type\":\"SpecialOffersBanner\",\"props\":{\"title\":\"Special Offers\",\"subtitle\":\"Get the best deals\",\"ctaText\":\"Shop Now\",\"ctaHref\":\"/products?sort=discount\",\"bgColor\":\"from-blue-600 via-blue-700 to-indigo-800\",\"leftImageSrc\":\"https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=400&q=80\",\"rightImageSrc\":\"https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=400&q=80\",\"textAlign\":\"left\"}}]}','cmpasjs0a0000qbzcflw0m65f',NULL,'2026-05-18 09:15:56.839',NULL,NULL),('cmpazp7dx0005qbc45cex9fxu','cmpaz4bez0000qbn8p5edswxq',4,'archived','{\"schemaVersion\":1,\"page\":{\"key\":\"home\",\"slug\":\"/\",\"title\":\"Home\"},\"sections\":[{\"id\":\"hero_banner_e5c3ab63-5bd1-4666-8c6a-a40f072dada3\",\"type\":\"HeroBanner\",\"props\":{\"title\":\"Discover Natural Beauty\",\"subtitle\":\"Premium skincare for your daily routine\",\"ctaText\":\"Shop Now\",\"ctaHref\":\"/products\",\"imageSrc\":\"https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80\",\"textAlign\":\"left\"}},{\"id\":\"new_arrivals_section_5154ef33-5dc4-4623-91e5-14000c5754dd\",\"type\":\"NewArrivalsSection\",\"props\":{\"title\":\"Just Dropped\",\"subtitle\":\"NEW ARRIVALS\",\"ctaHref\":\"/products?sort=newest\"}},{\"id\":\"hot_deals_section_49031253-6e81-411d-8810-178b232143b6\",\"type\":\"HotDealsSection\",\"props\":{}},{\"id\":\"special_offers_banner_495d9aa5-ef43-45f0-a7e2-ce6f02798801\",\"type\":\"SpecialOffersBanner\",\"props\":{\"title\":\"Special Offers\",\"subtitle\":\"Get the best deals\",\"ctaText\":\"Shop Now\",\"ctaHref\":\"/products?sort=discount\",\"bgColor\":\"from-blue-600 via-blue-700 to-indigo-800\",\"leftImageSrc\":\"https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=400&q=80\",\"rightImageSrc\":\"https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=400&q=80\",\"textAlign\":\"left\"}},{\"id\":\"routine_banner_839ad324-ec1f-4f64-b69d-7efb7167ecc6\",\"type\":\"RoutineBanner\",\"props\":{\"title\":\"Simplify Your Skincare Routine\",\"subtitle\":\"Curated just for you\",\"description\":\"Discover easy-to-follow skincare routines with products selected by experts to give you glowing, healthy skin every day.\",\"ctaText\":\"Explore Routines\",\"ctaHref\":\"/products\",\"imageSrc\":\"https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=600&q=80\",\"imageAlign\":\"left\"}}]}','cmpasjs0a0000qbzcflw0m65f','2026-05-18 09:16:32.865','2026-05-18 09:16:32.806',NULL,NULL),('cmpc50xpl0001qb00umnthrt0','cmpaz4bez0000qbn8p5edswxq',5,'archived','{\"schemaVersion\":1,\"page\":{\"key\":\"home\",\"slug\":\"/\",\"title\":\"Home\"},\"sections\":[{\"id\":\"hero_banner_2d34f26a-00ee-4178-b242-3e648acdc427\",\"type\":\"HeroBanner\",\"props\":{\"title\":\"Discover Natural Beauty\",\"subtitle\":\"Premium skincare for your daily routine\",\"ctaText\":\"Shop Now\",\"ctaHref\":\"/products\",\"imageSrc\":\"https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80\",\"textAlign\":\"left\"}},{\"id\":\"consultation_banner_427d2886-f999-4294-a806-dbd40e3d3140\",\"type\":\"ConsultationBanner\",\"props\":{\"title\":\"Doctor\'s Skincare Consultation\",\"subtitle\":\"Get personalized skincare advice from certified dermatologists\",\"ctaText\":\"Book Now\",\"ctaHref\":\"/consultation\",\"imageSrc\":\"https://images.unsplash.com/photo-1559599101-f09722fb4948?auto=format&fit=crop&w=800&q=80\",\"imageAlign\":\"right\"}},{\"id\":\"promo_badge_grid_92bf1089-6775-4148-b7cd-c6bb9e420591\",\"type\":\"PromoBadgeGrid\",\"props\":{}},{\"id\":\"special_offers_banner_c24aa7a6-b63a-46f7-baac-354a4dd7f48d\",\"type\":\"SpecialOffersBanner\",\"props\":{\"title\":\"Special Offers\",\"subtitle\":\"Get the best deals\",\"ctaText\":\"Shop Now\",\"ctaHref\":\"/products?sort=discount\",\"bgColor\":\"from-blue-600 via-blue-700 to-indigo-800\",\"leftImageSrc\":\"https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=400&q=80\",\"rightImageSrc\":\"https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=400&q=80\",\"textAlign\":\"left\"}},{\"id\":\"new_arrivals_section_6d0f6a9a-5e0e-4d2b-abe5-38cfb12d27dc\",\"type\":\"NewArrivalsSection\",\"props\":{\"title\":\"Just Dropped\",\"subtitle\":\"NEW ARRIVALS\",\"ctaHref\":\"/products?sort=newest\"}},{\"id\":\"testimonial_section_c9e668cc-4c79-4989-9d9a-c67398856bbd\",\"type\":\"TestimonialSection\",\"props\":{\"title\":\"Real Results, Real Beauty\",\"subtitle\":\"See what our customers are saying\",\"textAlign\":\"center\"}},{\"id\":\"routine_banner_0fa0f9a0-e358-4410-a68d-3cfc9c5ab7e7\",\"type\":\"RoutineBanner\",\"props\":{\"title\":\"Simplify Your Skincare Routine\",\"subtitle\":\"Curated just for you\",\"description\":\"Discover easy-to-follow skincare routines with products selected by experts to give you glowing, healthy skin every day.\",\"ctaText\":\"Explore Routines\",\"ctaHref\":\"/products\",\"imageSrc\":\"https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=600&q=80\",\"imageAlign\":\"left\"}}]}','cmpasjs0a0000qbzcflw0m65f','2026-05-19 06:27:35.223','2026-05-19 04:33:24.391',NULL,NULL),('cmpcajeaz0001qb1wnb4rdw5m','cmpaz4bez0000qbn8p5edswxq',6,'archived','{\"schemaVersion\":1,\"page\":{\"key\":\"home\",\"slug\":\"/\",\"title\":\"Home\"},\"sections\":[{\"id\":\"hero_1\",\"type\":\"HeroBanner\",\"props\":{\"title\":\"Summer Mega Sale Special\",\"subtitle\":\"Premium skincare for your daily routine\",\"ctaText\":\"Shop Now\",\"ctaHref\":\"/products\",\"imageSrc\":\"https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80\",\"textAlign\":\"left\",\"themeVariant\":\"default\"}},{\"id\":\"promo_badges_1\",\"type\":\"PromoBadgeGrid\",\"props\":{}},{\"id\":\"product_showcase_1\",\"type\":\"ProductShowcase\",\"props\":{\"title\":\"Shop by Category\",\"subtitle\":\"Browse our curated collection of premium products\",\"showcaseCategoryId\":\"all\",\"textAlign\":\"left\"}}]}','cmpasjs0a0000qbzcflw0m65f','2026-05-19 07:07:43.807','2026-05-19 07:07:43.788',NULL,NULL),('cmpcgocsw0001qbbwuqokrzh0','cmpaz4bez0000qbn8p5edswxq',7,'archived','{\"schemaVersion\":1,\"page\":{\"key\":\"home\",\"slug\":\"/\",\"title\":\"Home\"},\"sections\":[{\"id\":\"hero_1\",\"type\":\"HeroBanner\",\"props\":{\"title\":\"Summer Mega Sale Special\",\"subtitle\":\"Premium skincare for your daily routine\",\"ctaText\":\"Shop Now\",\"ctaHref\":\"/products\",\"imageSrc\":\"https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80\",\"textAlign\":\"left\",\"themeVariant\":\"default\"}},{\"id\":\"promo_badges_1\",\"type\":\"PromoBadgeGrid\",\"props\":{}},{\"id\":\"product_showcase_1\",\"type\":\"ProductShowcase\",\"props\":{\"title\":\"Shop by Category\",\"subtitle\":\"Browse our curated collection of premium products\",\"showcaseCategoryId\":\"all\",\"textAlign\":\"left\"}}]}','cmpcf4vv30000qbv86314wrt3','2026-05-19 09:59:32.878','2026-05-19 09:59:32.814',NULL,NULL),('cmpch0soh0003qbbwskh4tjm4','cmpaz4bez0000qbn8p5edswxq',8,'published','{\"schemaVersion\":1,\"page\":{\"key\":\"home\",\"slug\":\"/\",\"title\":\"Home\"},\"sections\":[{\"id\":\"hero_banner_0319ed03-0fee-4c24-9d6a-cf10effd5a90\",\"type\":\"HeroBanner\",\"props\":{\"title\":\"Discover Natural Beauty\",\"subtitle\":\"Premium skincare for your daily routine\",\"ctaText\":\"buy now\",\"ctaHref\":\"/products\",\"imageSrc\":\"https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80\",\"textAlign\":\"center\",\"themeVariant\":\"default\"}}]}','cmpcf4vv30000qbv86314wrt3','2026-05-19 10:09:14.375','2026-05-19 10:09:13.266',NULL,NULL);
/*!40000 ALTER TABLE `builderpageversion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `buildertemplate`
--

DROP TABLE IF EXISTS `buildertemplate`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `buildertemplate` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `packId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `pageType` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'home',
  `document` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`document`)),
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `BuilderTemplate_packId_idx` (`packId`),
  CONSTRAINT `BuilderTemplate_packId_fkey` FOREIGN KEY (`packId`) REFERENCES `buildertemplatepack` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `buildertemplate`
--

LOCK TABLES `buildertemplate` WRITE;
/*!40000 ALTER TABLE `buildertemplate` DISABLE KEYS */;
INSERT INTO `buildertemplate` VALUES ('cmpcagtik0001qbacoqmhojqx','cmpcagtij0000qbac574aa9d4','Eid Campaign 2026 - Layout 1','home','{\"schemaVersion\":1,\"page\":{\"key\":\"home\",\"slug\":\"/\",\"title\":\"Home\"},\"sections\":[{\"id\":\"hero_1\",\"type\":\"HeroBanner\",\"props\":{\"title\":\"Eid Campaign 2026 Special\",\"subtitle\":\"Premium skincare for your daily routine\",\"ctaText\":\"Shop Now\",\"ctaHref\":\"/products\",\"imageSrc\":\"https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80\",\"textAlign\":\"left\",\"themeVariant\":\"eid\"}},{\"id\":\"promo_badges_1\",\"type\":\"PromoBadgeGrid\",\"props\":{}},{\"id\":\"product_showcase_1\",\"type\":\"ProductShowcase\",\"props\":{\"title\":\"Shop by Category\",\"subtitle\":\"Browse our curated collection of premium products\",\"showcaseCategoryId\":\"all\",\"textAlign\":\"left\"}}]}','2026-05-19 07:05:43.531','2026-05-19 07:05:43.531'),('cmpcagtkq0003qbac61go3kng','cmpcagtkq0002qbacwvpk0fi9','Puja Special 2026 - Layout 1','home','{\"schemaVersion\":1,\"page\":{\"key\":\"home\",\"slug\":\"/\",\"title\":\"Home\"},\"sections\":[{\"id\":\"hero_1\",\"type\":\"HeroBanner\",\"props\":{\"title\":\"Puja Special 2026 Special\",\"subtitle\":\"Premium skincare for your daily routine\",\"ctaText\":\"Shop Now\",\"ctaHref\":\"/products\",\"imageSrc\":\"https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80\",\"textAlign\":\"left\",\"themeVariant\":\"puja\"}},{\"id\":\"promo_badges_1\",\"type\":\"PromoBadgeGrid\",\"props\":{}},{\"id\":\"product_showcase_1\",\"type\":\"ProductShowcase\",\"props\":{\"title\":\"Shop by Category\",\"subtitle\":\"Browse our curated collection of premium products\",\"showcaseCategoryId\":\"all\",\"textAlign\":\"left\"}}]}','2026-05-19 07:05:43.611','2026-05-19 07:05:43.611'),('cmpcagtku0005qbacicppnf73','cmpcagtku0004qbacwbdzyx91','Summer Mega Sale - Layout 1','home','{\"schemaVersion\":1,\"page\":{\"key\":\"home\",\"slug\":\"/\",\"title\":\"Home\"},\"sections\":[{\"id\":\"hero_1\",\"type\":\"HeroBanner\",\"props\":{\"title\":\"Summer Mega Sale Special\",\"subtitle\":\"Premium skincare for your daily routine\",\"ctaText\":\"Shop Now\",\"ctaHref\":\"/products\",\"imageSrc\":\"https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80\",\"textAlign\":\"left\",\"themeVariant\":\"default\"}},{\"id\":\"promo_badges_1\",\"type\":\"PromoBadgeGrid\",\"props\":{}},{\"id\":\"product_showcase_1\",\"type\":\"ProductShowcase\",\"props\":{\"title\":\"Shop by Category\",\"subtitle\":\"Browse our curated collection of premium products\",\"showcaseCategoryId\":\"all\",\"textAlign\":\"left\"}}]}','2026-05-19 07:05:43.614','2026-05-19 07:05:43.614'),('cmpcagtky0007qbacc4kxpt1l','cmpcagtky0006qbacltsfy8hb','Ramadan 2027 - Layout 1','home','{\"schemaVersion\":1,\"page\":{\"key\":\"home\",\"slug\":\"/\",\"title\":\"Home\"},\"sections\":[{\"id\":\"hero_1\",\"type\":\"HeroBanner\",\"props\":{\"title\":\"Ramadan 2027 Super Deals\",\"subtitle\":\"Premium skincare for your daily routine\",\"ctaText\":\"Shop Now\",\"ctaHref\":\"/products\",\"imageSrc\":\"https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80\",\"textAlign\":\"left\",\"themeVariant\":\"eid\"}},{\"id\":\"promo_badges_1\",\"type\":\"PromoBadgeGrid\",\"props\":{}},{\"id\":\"product_showcase_1\",\"type\":\"ProductShowcase\",\"props\":{\"title\":\"Shop by Category\",\"subtitle\":\"Browse our curated collection of premium products\",\"showcaseCategoryId\":\"all\",\"textAlign\":\"left\"}}]}','2026-05-19 07:05:43.618','2026-05-19 07:05:43.618'),('cmpcagtl30009qbac4jdxxz52','cmpcagtl30008qbacghh7aagp','Black Friday 2026 - Layout 1','home','{\"schemaVersion\":1,\"page\":{\"key\":\"home\",\"slug\":\"/\",\"title\":\"Home\"},\"sections\":[{\"id\":\"hero_1\",\"type\":\"HeroBanner\",\"props\":{\"title\":\"Black Friday 2026 Super Deals\",\"subtitle\":\"Premium skincare for your daily routine\",\"ctaText\":\"Shop Now\",\"ctaHref\":\"/products\",\"imageSrc\":\"https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80\",\"textAlign\":\"left\",\"themeVariant\":\"default\"}},{\"id\":\"promo_badges_1\",\"type\":\"PromoBadgeGrid\",\"props\":{}},{\"id\":\"product_showcase_1\",\"type\":\"ProductShowcase\",\"props\":{\"title\":\"Shop by Category\",\"subtitle\":\"Browse our curated collection of premium products\",\"showcaseCategoryId\":\"all\",\"textAlign\":\"left\"}}]}','2026-05-19 07:05:43.623','2026-05-19 07:05:43.623'),('cmpcagtlj000bqbacdv51pfqo','cmpcagtlj000aqbacfefuhbvu','New Year 2027 - Layout 1','home','{\"schemaVersion\":1,\"page\":{\"key\":\"home\",\"slug\":\"/\",\"title\":\"Home\"},\"sections\":[{\"id\":\"hero_1\",\"type\":\"HeroBanner\",\"props\":{\"title\":\"New Year 2027 Super Deals\",\"subtitle\":\"Premium skincare for your daily routine\",\"ctaText\":\"Shop Now\",\"ctaHref\":\"/products\",\"imageSrc\":\"https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80\",\"textAlign\":\"left\",\"themeVariant\":\"default\"}},{\"id\":\"promo_badges_1\",\"type\":\"PromoBadgeGrid\",\"props\":{}},{\"id\":\"product_showcase_1\",\"type\":\"ProductShowcase\",\"props\":{\"title\":\"Shop by Category\",\"subtitle\":\"Browse our curated collection of premium products\",\"showcaseCategoryId\":\"all\",\"textAlign\":\"left\"}}]}','2026-05-19 07:05:43.640','2026-05-19 07:05:43.640');
/*!40000 ALTER TABLE `buildertemplate` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `buildertemplatepack`
--

DROP TABLE IF EXISTS `buildertemplatepack`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `buildertemplatepack` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `key` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'locked',
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `BuilderTemplatePack_key_key` (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `buildertemplatepack`
--

LOCK TABLES `buildertemplatepack` WRITE;
/*!40000 ALTER TABLE `buildertemplatepack` DISABLE KEYS */;
INSERT INTO `buildertemplatepack` VALUES ('cmpcagtij0000qbac574aa9d4','eid-2026','Eid Campaign 2026','unlocked','2026-05-19 07:05:43.531','2026-05-19 07:05:43.531'),('cmpcagtkq0002qbacwvpk0fi9','puja-2026','Puja Special 2026','unlocked','2026-05-19 07:05:43.611','2026-05-19 07:05:43.611'),('cmpcagtku0004qbacwbdzyx91','summer-sale','Summer Mega Sale','unlocked','2026-05-19 07:05:43.614','2026-05-19 07:05:43.614'),('cmpcagtky0006qbacltsfy8hb','ramadan-2027','Ramadan 2027','locked','2026-05-19 07:05:43.618','2026-05-19 07:05:43.618'),('cmpcagtl30008qbacghh7aagp','black-friday','Black Friday 2026','locked','2026-05-19 07:05:43.623','2026-05-19 07:05:43.623'),('cmpcagtlj000aqbacfefuhbvu','new-year-2027','New Year 2027','locked','2026-05-19 07:05:43.640','2026-05-19 07:05:43.640');
/*!40000 ALTER TABLE `buildertemplatepack` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cart`
--

DROP TABLE IF EXISTS `cart`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cart` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Cart_userId_key` (`userId`),
  CONSTRAINT `Cart_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart`
--

LOCK TABLES `cart` WRITE;
/*!40000 ALTER TABLE `cart` DISABLE KEYS */;
INSERT INTO `cart` VALUES ('cmpcf4w4p0003qbv8fk6fz2pn','cmpcf4w4k0001qbv8zf7kqc5z','2026-05-19 09:16:25.129','2026-05-19 09:16:25.129');
/*!40000 ALTER TABLE `cart` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cartitem`
--

DROP TABLE IF EXISTS `cartitem`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cartitem` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `cartId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `productId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `variantId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `CartItem_cartId_variantId_key` (`cartId`,`variantId`),
  KEY `CartItem_productId_fkey` (`productId`),
  KEY `CartItem_variantId_fkey` (`variantId`),
  CONSTRAINT `CartItem_cartId_fkey` FOREIGN KEY (`cartId`) REFERENCES `cart` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `CartItem_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `product` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `CartItem_variantId_fkey` FOREIGN KEY (`variantId`) REFERENCES `productvariant` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cartitem`
--

LOCK TABLES `cartitem` WRITE;
/*!40000 ALTER TABLE `cartitem` DISABLE KEYS */;
/*!40000 ALTER TABLE `cartitem` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `category`
--

DROP TABLE IF EXISTS `category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `category` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `image` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `parentId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `content` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `seoData` longtext COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Category_slug_key` (`slug`),
  KEY `Category_slug_idx` (`slug`),
  KEY `Category_parentId_fkey` (`parentId`),
  CONSTRAINT `Category_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `category` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category`
--

LOCK TABLES `category` WRITE;
/*!40000 ALTER TABLE `category` DISABLE KEYS */;
INSERT INTO `category` VALUES ('cmpcf4w6q000cqbv8jxl0440e','Organic Skincare','organic-skincare',NULL,NULL,'2026-05-19 09:16:25.203','2026-05-19 09:16:25.203','Natural skin health products',NULL),('cmpcf4w6u000dqbv8leex4deh','Fresh Fruits','fresh-fruits',NULL,NULL,'2026-05-19 09:16:25.206','2026-05-19 09:16:25.206','Healthy delicious fresh fruits',NULL),('cmpcf4w6y000eqbv8zzueh2dp','Green Vegetables','green-vegetables',NULL,NULL,'2026-05-19 09:16:25.211','2026-05-19 09:16:25.211','Organic locally grown greens',NULL),('cmpcf4w73000fqbv8lyt0g128','Dairy & Eggs','dairy-eggs',NULL,NULL,'2026-05-19 09:16:25.215','2026-05-19 09:16:25.215','Fresh farm milk, cheese, and eggs',NULL);
/*!40000 ALTER TABLE `category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `city`
--

DROP TABLE IF EXISTS `city`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `city` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `stateId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `deliveryCharge` double NOT NULL DEFAULT 0,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `City_name_stateId_key` (`name`,`stateId`),
  KEY `City_stateId_idx` (`stateId`),
  CONSTRAINT `City_stateId_fkey` FOREIGN KEY (`stateId`) REFERENCES `state` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `city`
--

LOCK TABLES `city` WRITE;
/*!40000 ALTER TABLE `city` DISABLE KEYS */;
INSERT INTO `city` VALUES ('cmpaq0cga000dqbawtkvtkrr4','Patuakhali','cmpaq0cfr0007qbawc24yw59l','active',0,'2026-05-18 04:45:16.427','2026-05-18 04:45:16.427'),('cmpaq0cge000fqbawdlfbijsu','Jhalokati','cmpaq0cfr0007qbawc24yw59l','active',0,'2026-05-18 04:45:16.430','2026-05-18 04:45:16.430'),('cmpaq0cgg000hqbawwbc4mg8t','Bhola','cmpaq0cfr0007qbawc24yw59l','active',0,'2026-05-18 04:45:16.432','2026-05-18 04:45:16.432'),('cmpaq0cgi000jqbawvsa5fh6s','Barisal','cmpaq0cfr0007qbawc24yw59l','active',0,'2026-05-18 04:45:16.435','2026-05-18 04:45:16.435'),('cmpaq0cgl000lqbawn4o5grko','Barguna District','cmpaq0cfr0007qbawc24yw59l','active',0,'2026-05-18 04:45:16.437','2026-05-18 04:45:16.437'),('cmpaq0cgn000nqbawwdm1vbb6','Pirojpur','cmpaq0cfr0007qbawc24yw59l','active',0,'2026-05-18 04:45:16.439','2026-05-18 04:45:16.439'),('cmpaq0cgq000pqbawxv8by82o','Chandpur','cmpaq0cg3000aqbawbktxbewt','active',0,'2026-05-18 04:45:16.442','2026-05-18 04:45:16.442'),('cmpaq0cgt000rqbaw5rd1q0n1','Rangamati','cmpaq0cg3000aqbawbktxbewt','active',0,'2026-05-18 04:45:16.445','2026-05-18 04:45:16.445'),('cmpaq0cgv000tqbawsz0d2a4q','Brahmanbaria','cmpaq0cg3000aqbawbktxbewt','active',0,'2026-05-18 04:45:16.448','2026-05-18 04:45:16.448'),('cmpaq0cgx000vqbawjl75qyqe','Lakshmipur','cmpaq0cg3000aqbawbktxbewt','active',0,'2026-05-18 04:45:16.450','2026-05-18 04:45:16.450'),('cmpaq0ch0000xqbaw6tqpyzpd','Cumilla','cmpaq0cg3000aqbawbktxbewt','active',0,'2026-05-18 04:45:16.452','2026-05-18 04:45:16.452'),('cmpaq0ch2000zqbawpi7nki3c','Chittagong Area','cmpaq0cg3000aqbawbktxbewt','active',0,'2026-05-18 04:45:16.455','2026-05-18 04:45:16.455'),('cmpaq0ch40011qbawq7h3dkbk','Feni','cmpaq0cg3000aqbawbktxbewt','active',0,'2026-05-18 04:45:16.457','2026-05-18 04:45:16.457'),('cmpaq0ch70013qbawwo0510q3','Noakhali','cmpaq0cg3000aqbawbktxbewt','active',0,'2026-05-18 04:45:16.459','2026-05-18 04:45:16.459'),('cmpaq0ch90015qbaw6vkysdjl','Bandarban District','cmpaq0cg3000aqbawbktxbewt','active',0,'2026-05-18 04:45:16.462','2026-05-18 04:45:16.462'),('cmpaq0chc0017qbawtpl9l4lx','Cox\'s Bazar','cmpaq0cg3000aqbawbktxbewt','active',0,'2026-05-18 04:45:16.464','2026-05-18 04:45:16.464'),('cmpaq0che0019qbawfu9jwejx','Khagrachari','cmpaq0cg3000aqbawbktxbewt','active',0,'2026-05-18 04:45:16.466','2026-05-18 04:45:16.466'),('cmpaq0chg001bqbawseauiwem','Dhaka City','cmpaq0cfp0006qbaw1bkhrmdk','active',0,'2026-05-18 04:45:16.469','2026-05-18 04:45:16.469'),('cmpaq0chi001dqbaw4p3dg5lj','Savar (Dhaka Sub Area)','cmpaq0cfp0006qbaw1bkhrmdk','active',0,'2026-05-18 04:45:16.471','2026-05-18 04:45:16.471'),('cmpaq0chk001fqbaw8av567ja','Narayanganj (Dhaka Sub Area)','cmpaq0cfp0006qbaw1bkhrmdk','active',0,'2026-05-18 04:45:16.473','2026-05-18 04:45:16.473'),('cmpaq0chm001hqbawhny5c358','Tongi','cmpaq0cfp0006qbaw1bkhrmdk','active',0,'2026-05-18 04:45:16.475','2026-05-18 04:45:16.475'),('cmpaq0cho001jqbawv83az9dn','Gazipur','cmpaq0cfp0006qbaw1bkhrmdk','active',0,'2026-05-18 04:45:16.477','2026-05-18 04:45:16.477'),('cmpaq0chr001lqbawpnvjzrox','Faridpur','cmpaq0cfp0006qbaw1bkhrmdk','active',0,'2026-05-18 04:45:16.479','2026-05-18 04:45:16.479'),('cmpaq0cht001nqbawtq1qdiud','Madaripur','cmpaq0cfp0006qbaw1bkhrmdk','active',0,'2026-05-18 04:45:16.481','2026-05-18 04:45:16.481'),('cmpaq0chv001pqbawwaelbjnd','Kishoreganj','cmpaq0cfp0006qbaw1bkhrmdk','active',0,'2026-05-18 04:45:16.484','2026-05-18 04:45:16.484'),('cmpaq0chx001rqbawpzeyyg74','Manikganj','cmpaq0cfp0006qbaw1bkhrmdk','active',0,'2026-05-18 04:45:16.486','2026-05-18 04:45:16.486'),('cmpaq0chz001tqbawljak4od8','Munshiganj','cmpaq0cfp0006qbaw1bkhrmdk','active',0,'2026-05-18 04:45:16.488','2026-05-18 04:45:16.488'),('cmpaq0ci1001vqbawia48pzdl','Gopalganj','cmpaq0cfp0006qbaw1bkhrmdk','active',0,'2026-05-18 04:45:16.490','2026-05-18 04:45:16.490'),('cmpaq0ci3001xqbawfmmmrh95','Rajbari','cmpaq0cfp0006qbaw1bkhrmdk','active',0,'2026-05-18 04:45:16.492','2026-05-18 04:45:16.492'),('cmpaq0ci5001zqbawf8zpospk','Narsingdi','cmpaq0cfp0006qbaw1bkhrmdk','active',0,'2026-05-18 04:45:16.494','2026-05-18 04:45:16.494'),('cmpaq0ci80021qbaw6ozyfshi','Tangail','cmpaq0cfp0006qbaw1bkhrmdk','active',0,'2026-05-18 04:45:16.496','2026-05-18 04:45:16.496'),('cmpaq0cia0023qbaweks3btod','Shariatpur','cmpaq0cfp0006qbaw1bkhrmdk','active',0,'2026-05-18 04:45:16.498','2026-05-18 04:45:16.498'),('cmpaq0cid0025qbawdwp7yvx3','Dhamrai','cmpaq0cfp0006qbaw1bkhrmdk','active',0,'2026-05-18 04:45:16.501','2026-05-18 04:45:16.501'),('cmpaq0cif0027qbawsvfo4w22','Dohar Upazila','cmpaq0cfp0006qbaw1bkhrmdk','active',0,'2026-05-18 04:45:16.503','2026-05-18 04:45:16.503'),('cmpaq0cii0029qbaw0cr9eezb','Magura','cmpaq0cft0008qbaw0yoel6pg','active',0,'2026-05-18 04:45:16.506','2026-05-18 04:45:16.506'),('cmpaq0cik002bqbaw8gb7rjk1','Jashore','cmpaq0cft0008qbaw0yoel6pg','active',0,'2026-05-18 04:45:16.509','2026-05-18 04:45:16.509'),('cmpaq0cin002dqbawtb06ovso','Jhenaidah','cmpaq0cft0008qbaw0yoel6pg','active',0,'2026-05-18 04:45:16.512','2026-05-18 04:45:16.512'),('cmpaq0cip002fqbawiffu3i51','Kushtia','cmpaq0cft0008qbaw0yoel6pg','active',0,'2026-05-18 04:45:16.514','2026-05-18 04:45:16.514'),('cmpaq0cir002hqbaw3xqfxq9y','Khulna','cmpaq0cft0008qbaw0yoel6pg','active',0,'2026-05-18 04:45:16.516','2026-05-18 04:45:16.516'),('cmpaq0ciu002jqbawqqcoakk0','Meherpur','cmpaq0cft0008qbaw0yoel6pg','active',0,'2026-05-18 04:45:16.518','2026-05-18 04:45:16.518'),('cmpaq0ciw002lqbawk628sleq','Satkhira','cmpaq0cft0008qbaw0yoel6pg','active',0,'2026-05-18 04:45:16.520','2026-05-18 04:45:16.520'),('cmpaq0ciy002nqbawcju058zf','Narail','cmpaq0cft0008qbaw0yoel6pg','active',0,'2026-05-18 04:45:16.522','2026-05-18 04:45:16.522'),('cmpaq0cj0002pqbawq5cyw31y','Chuadanga','cmpaq0cft0008qbaw0yoel6pg','active',0,'2026-05-18 04:45:16.524','2026-05-18 04:45:16.524'),('cmpaq0cj2002rqbawo8m76l6i','Bagerhat District','cmpaq0cft0008qbaw0yoel6pg','active',0,'2026-05-18 04:45:16.526','2026-05-18 04:45:16.526'),('cmpaq0cj5002tqbawqpfxg8so','Sherpur','cmpaq0cfl0005qbaw5bf4o619','active',0,'2026-05-18 04:45:16.530','2026-05-18 04:45:16.530'),('cmpaq0cj7002vqbawbne8n59o','Jamalpur','cmpaq0cfl0005qbaw5bf4o619','active',0,'2026-05-18 04:45:16.532','2026-05-18 04:45:16.532'),('cmpaq0cj9002xqbawkp03bfiv','Netrokona','cmpaq0cfl0005qbaw5bf4o619','active',0,'2026-05-18 04:45:16.534','2026-05-18 04:45:16.534'),('cmpaq0cjb002zqbawyk9f0lq0','Mymensingh','cmpaq0cfl0005qbaw5bf4o619','active',0,'2026-05-18 04:45:16.536','2026-05-18 04:45:16.536'),('cmpaq0cje0031qbawfbl954uo','Natore','cmpaq0cg00009qbaw28p6wr07','active',0,'2026-05-18 04:45:16.539','2026-05-18 04:45:16.539'),('cmpaq0cjg0033qbawxhvkt3e7','Chapainawabganj','cmpaq0cg00009qbaw28p6wr07','active',0,'2026-05-18 04:45:16.541','2026-05-18 04:45:16.541'),('cmpaq0cji0035qbaw1rgr3gu8','Pabna','cmpaq0cg00009qbaw28p6wr07','active',0,'2026-05-18 04:45:16.543','2026-05-18 04:45:16.543'),('cmpaq0cjl0037qbawtjovb8nl','Joypurhat','cmpaq0cg00009qbaw28p6wr07','active',0,'2026-05-18 04:45:16.545','2026-05-18 04:45:16.545'),('cmpaq0cjn0039qbawfij5yijc','Naogaon','cmpaq0cg00009qbaw28p6wr07','active',0,'2026-05-18 04:45:16.548','2026-05-18 04:45:16.548'),('cmpaq0cjp003bqbaw1uwxqtbw','Bogura','cmpaq0cg00009qbaw28p6wr07','active',0,'2026-05-18 04:45:16.550','2026-05-18 04:45:16.550'),('cmpaq0cjr003dqbaw98nmvqeh','Rajshahi','cmpaq0cg00009qbaw28p6wr07','active',0,'2026-05-18 04:45:16.552','2026-05-18 04:45:16.552'),('cmpaq0cjt003fqbaw6v01ul3u','Sirajganj','cmpaq0cg00009qbaw28p6wr07','active',0,'2026-05-18 04:45:16.554','2026-05-18 04:45:16.554'),('cmpaq0cjw003hqbawx0wzip3j','Habiganj','cmpaq0cg4000bqbaw3xf977yy','active',0,'2026-05-18 04:45:16.557','2026-05-18 04:45:16.557'),('cmpaq0cjy003jqbawxalzu27j','Sunamganj','cmpaq0cg4000bqbaw3xf977yy','active',0,'2026-05-18 04:45:16.559','2026-05-18 04:45:16.559'),('cmpaq0ck2003lqbawsikoeiw8','Moulvibazar','cmpaq0cg4000bqbaw3xf977yy','active',0,'2026-05-18 04:45:16.562','2026-05-18 04:45:16.562'),('cmpaq0ck5003nqbaw8chsk9tx','Sylhet','cmpaq0cg4000bqbaw3xf977yy','active',0,'2026-05-18 04:45:16.566','2026-05-18 04:45:16.566'),('cmpaq0ck8003pqbaw55hh0jtf','Dinajpur','cmpaq0cfg0004qbawykedbkcn','active',0,'2026-05-18 04:45:16.569','2026-05-18 04:45:16.569'),('cmpaq0cka003rqbawt7mj9b6j','Rangpur','cmpaq0cfg0004qbawykedbkcn','active',0,'2026-05-18 04:45:16.571','2026-05-18 04:45:16.571'),('cmpaq0ckc003tqbaw0yofcsw5','Gaibandha','cmpaq0cfg0004qbawykedbkcn','active',0,'2026-05-18 04:45:16.573','2026-05-18 04:45:16.573'),('cmpaq0ckf003vqbawgcymlcos','Kurigram','cmpaq0cfg0004qbawykedbkcn','active',0,'2026-05-18 04:45:16.575','2026-05-18 04:45:16.575'),('cmpaq0cki003xqbawvduw5fi5','Thakurgaon','cmpaq0cfg0004qbawykedbkcn','active',0,'2026-05-18 04:45:16.578','2026-05-18 04:45:16.578'),('cmpaq0ckk003zqbawixgk8t4v','Panchagarh','cmpaq0cfg0004qbawykedbkcn','active',0,'2026-05-18 04:45:16.580','2026-05-18 04:45:16.580'),('cmpaq0ckm0041qbawy11eg94l','Nilphamari','cmpaq0cfg0004qbawykedbkcn','active',0,'2026-05-18 04:45:16.582','2026-05-18 04:45:16.582'),('cmpaq0cko0043qbawwb8r038s','Lalmonirhat','cmpaq0cfg0004qbawykedbkcn','active',0,'2026-05-18 04:45:16.584','2026-05-18 04:45:16.584');
/*!40000 ALTER TABLE `city` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `coupon`
--

DROP TABLE IF EXISTS `coupon`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `coupon` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `code` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `discount` double NOT NULL,
  `type` enum('PERCENT','FIXED') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PERCENT',
  `minOrder` double NOT NULL DEFAULT 0,
  `maxUses` int(11) NOT NULL DEFAULT 100,
  `usedCount` int(11) NOT NULL DEFAULT 0,
  `active` tinyint(1) NOT NULL DEFAULT 1,
  `expiresAt` datetime(3) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Coupon_code_key` (`code`),
  KEY `Coupon_code_idx` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `coupon`
--

LOCK TABLES `coupon` WRITE;
/*!40000 ALTER TABLE `coupon` DISABLE KEYS */;
/*!40000 ALTER TABLE `coupon` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `importlog`
--

DROP TABLE IF EXISTS `importlog`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `importlog` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'idle',
  `totalProducts` int(11) NOT NULL DEFAULT 0,
  `imported` int(11) NOT NULL DEFAULT 0,
  `failed` int(11) NOT NULL DEFAULT 0,
  `lastPage` int(11) NOT NULL DEFAULT 1,
  `errors` longtext COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `startedAt` datetime(3) DEFAULT NULL,
  `finishedAt` datetime(3) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `importlog`
--

LOCK TABLES `importlog` WRITE;
/*!40000 ALTER TABLE `importlog` DISABLE KEYS */;
/*!40000 ALTER TABLE `importlog` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `importtask`
--

DROP TABLE IF EXISTS `importtask`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `importtask` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `pageNumber` int(11) NOT NULL,
  `perPage` int(11) NOT NULL DEFAULT 20,
  `totalItems` int(11) NOT NULL DEFAULT 0,
  `imported` int(11) NOT NULL DEFAULT 0,
  `failed` int(11) NOT NULL DEFAULT 0,
  `details` longtext COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `startedAt` datetime(3) DEFAULT NULL,
  `finishedAt` datetime(3) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `importtask`
--

LOCK TABLES `importtask` WRITE;
/*!40000 ALTER TABLE `importtask` DISABLE KEYS */;
INSERT INTO `importtask` VALUES ('cmpc6cb4h0003qb00k157fs8x','Selective Import (10 items)','done',0,20,10,10,0,'[\"[11:10:14] 🚀 Starting: Selective Import (10 items)\",\"[11:10:14] Fetching category map from WooCommerce...\",\"[11:10:18] ✔️ 144 categories cached.\",\"[11:10:18] Fetching 10 specific product(s)...\",\"[11:10:28] ⬇️ Processing \\\"Cerave Hydrating Cleanser For Normal To Dry Skin 237ml (USA)\\\" (ID: 55919)\",\"[11:10:28]   🖼️ Downloading main image...\",\"[11:10:30]   ✔️ Main image saved.\",\"[11:10:30]   🛠️ Creating core product record...\",\"[11:10:30] ✅ Completed \\\"Cerave Hydrating Cleanser For Normal To Dry Skin 237ml (USA)\\\". Status: created\",\"[11:10:30] ⬇️ Processing \\\"Nivea Soft Moisturizing Cream 100ml(EU)\\\" (ID: 55911)\",\"[11:10:30]   🖼️ Downloading main image...\",\"[11:10:31]   ✔️ Main image saved.\",\"[11:10:31]   🛠️ Creating core product record...\",\"[11:10:31] ✅ Completed \\\"Nivea Soft Moisturizing Cream 100ml(EU)\\\". Status: created\",\"[11:10:31] ⬇️ Processing \\\"Garnier Bright Complete Vitamin C Booster Serum \\\" (ID: 55890)\",\"[11:10:31]   🖼️ Downloading main image...\",\"[11:10:32]   ✔️ Main image saved.\",\"[11:10:32]   🛠️ Creating core product record...\",\"[11:10:32]   ⚙️ Fetching variations from WooCommerce...\",\"[11:10:33]   ⚙️ Processing 2 variations...\",\"[11:10:36] ✅ Completed \\\"Garnier Bright Complete Vitamin C Booster Serum \\\". Status: created\",\"[11:10:36] ⬇️ Processing \\\"The Derma Co Sali-Cinamide Anti-Acne Face Wash 80ml\\\" (ID: 55869)\",\"[11:10:36]   🖼️ Downloading main image...\",\"[11:10:37]   ✔️ Main image saved.\",\"[11:10:37]   🛠️ Creating core product record...\",\"[11:10:37] ✅ Completed \\\"The Derma Co Sali-Cinamide Anti-Acne Face Wash 80ml\\\". Status: created\",\"[11:10:37] ⬇️ Processing \\\"Nivea Refreshingly Soft Moisturizing Cream (egypt)\\\" (ID: 55859)\",\"[11:10:37]   🖼️ Downloading main image...\",\"[11:10:38]   ✔️ Main image saved.\",\"[11:10:38]   🛠️ Creating core product record...\",\"[11:10:38]   ⚙️ Fetching variations from WooCommerce...\",\"[11:10:39]   ⚙️ Processing 2 variations...\",\"[11:10:42] ✅ Completed \\\"Nivea Refreshingly Soft Moisturizing Cream (egypt)\\\". Status: created\",\"[11:10:42] ⬇️ Processing \\\"Dot and Key Blueberry Hydrate Barrier Repair Sunscreen SPF 50+ PA++++\\\" (ID: 55825)\",\"[11:10:42]   🖼️ Downloading main image...\",\"[11:10:42]   ✔️ Main image saved.\",\"[11:10:42]   🛠️ Creating core product record...\",\"[11:10:42] ✅ Completed \\\"Dot and Key Blueberry Hydrate Barrier Repair Sunscreen SPF 50+ PA++++\\\". Status: created\",\"[11:10:42] ⬇️ Processing \\\"Dot & Key CICA Calming Mattifying Sunscreen SPF 50 PA++++ 50gm\\\" (ID: 55822)\",\"[11:10:42]   🖼️ Downloading main image...\",\"[11:10:43]   ✔️ Main image saved.\",\"[11:10:43]   🛠️ Creating core product record...\",\"[11:10:43] ✅ Completed \\\"Dot & Key CICA Calming Mattifying Sunscreen SPF 50 PA++++ 50gm\\\". Status: created\",\"[11:10:43] ⬇️ Processing \\\"Dot & Key Strawberry Dew Tinted Sunscreen SPF 50+ Dailly Wear - 05 Beige\\\" (ID: 55818)\",\"[11:10:43]   🖼️ Downloading main image...\",\"[11:10:44]   ✔️ Main image saved.\",\"[11:10:44]   🛠️ Creating core product record...\",\"[11:10:44] ✅ Completed \\\"Dot & Key Strawberry Dew Tinted Sunscreen SPF 50+ Dailly Wear - 05 Beige\\\". Status: created\",\"[11:10:44] ⬇️ Processing \\\"Chemist at Play Brightening Body Wash (3% Vitamin C + Niacinamide + Alpha Arbutin + Glycolic Acid + Camu Camu) – 236ml\\\" (ID: 55800)\",\"[11:10:44]   🖼️ Downloading main image...\",\"[11:10:45]   ❌ Main image download failed: source: bad seek to 16266\\nsource: bad seek to 16250\\nsource: bad seek to 16242\\nsource: bad seek to 16238\\nsource: bad seek to 16236\\nsource: bad seek to 16235\\nheif: Invalid input: Unspecified: Bitstream not supported by this decoder (2.0)\",\"[11:10:45]   🛠️ Creating core product record...\",\"[11:10:45] ✅ Completed \\\"Chemist at Play Brightening Body Wash (3% Vitamin C + Niacinamide + Alpha Arbutin + Glycolic Acid + Camu Camu) – 236ml\\\". Status: created\",\"[11:10:45] ⬇️ Processing \\\"Loreal Studio Line Xtreme Hold Indestructible Hair Gel 9 150ml\\\" (ID: 55783)\",\"[11:10:45]   🖼️ Downloading main image...\",\"[11:10:46]   ✔️ Main image saved.\",\"[11:10:46]   🛠️ Creating core product record...\",\"[11:10:46] ✅ Completed \\\"Loreal Studio Line Xtreme Hold Indestructible Hair Gel 9 150ml\\\". Status: created\",\"[11:10:46] ✅ Task complete! Imported: 10, Failed: 0\"]','2026-05-19 05:10:14.649','2026-05-19 05:10:46.190','2026-05-19 05:10:14.610'),('cmpc6cjfa0084qb00p8ibesaj','Batch 1 (Products 1 - 20)','pending',1,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:25.366'),('cmpc6cjfa0085qb00e5y5l8ar','Batch 2 (Products 21 - 40)','pending',2,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:25.366'),('cmpc6cjfa0086qb00fz1zolmp','Batch 3 (Products 41 - 60)','pending',3,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:25.366'),('cmpc6cjfa0087qb00jcl38w5s','Batch 4 (Products 61 - 80)','pending',4,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:25.366'),('cmpc6cjfb0088qb00lfl8riya','Batch 5 (Products 81 - 100)','pending',5,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:25.366'),('cmpc6cjfb0089qb004u4oitgf','Batch 6 (Products 101 - 120)','pending',6,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:25.366'),('cmpc6cjfb008aqb005dsabb10','Batch 7 (Products 121 - 140)','pending',7,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:25.366'),('cmpc6cjfb008bqb00fqmw7rdc','Batch 8 (Products 141 - 160)','pending',8,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:25.366'),('cmpc6cjfb008cqb00sua04pct','Batch 9 (Products 161 - 180)','pending',9,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:25.366'),('cmpc6cjfb008dqb004o24sxh6','Batch 10 (Products 181 - 200)','pending',10,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:25.366'),('cmpc6cjfb008eqb00d3c189er','Batch 11 (Products 201 - 220)','pending',11,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:25.366'),('cmpc6cjfb008fqb00dq0w9s82','Batch 12 (Products 221 - 240)','pending',12,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:25.366'),('cmpc6cjfb008gqb00z499d21k','Batch 13 (Products 241 - 260)','pending',13,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:25.366'),('cmpc6cjfb008hqb00sn4g5f94','Batch 14 (Products 261 - 280)','pending',14,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:25.366'),('cmpc6cjfb008iqb00a3p5y3rh','Batch 15 (Products 281 - 300)','pending',15,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:25.366'),('cmpc6cjfb008jqb00oy6rioz1','Batch 16 (Products 301 - 320)','pending',16,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:25.366'),('cmpc6cjfb008kqb00jq2y8dfd','Batch 17 (Products 321 - 340)','pending',17,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:25.366'),('cmpc6cjfb008lqb006d75pnza','Batch 18 (Products 341 - 360)','pending',18,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:25.366'),('cmpc6cjfb008mqb004n10gci3','Batch 19 (Products 361 - 380)','pending',19,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:25.366'),('cmpc6cjfb008nqb00tgwrb2fu','Batch 20 (Products 381 - 400)','pending',20,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:25.366'),('cmpc6cjfb008oqb00z3frdtt5','Batch 21 (Products 401 - 420)','pending',21,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:25.366'),('cmpc6cjfb008pqb007oi99qaw','Batch 22 (Products 421 - 440)','pending',22,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:25.366'),('cmpc6cjfb008qqb003jimwswh','Batch 23 (Products 441 - 460)','pending',23,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:25.366'),('cmpc6cjfb008rqb00ew2wq4e7','Batch 24 (Products 461 - 480)','pending',24,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:25.366'),('cmpc6cjfb008sqb00k8xewxaz','Batch 25 (Products 481 - 500)','pending',25,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:25.366'),('cmpc6cjfb008tqb00q2qsj2ax','Batch 26 (Products 501 - 520)','pending',26,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:25.366'),('cmpc6cjfb008uqb00z3hsww14','Batch 27 (Products 521 - 540)','pending',27,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:25.366'),('cmpc6cjfb008vqb009aaia0va','Batch 28 (Products 541 - 560)','pending',28,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:25.366'),('cmpc6cjfb008wqb00yqfog5cr','Batch 29 (Products 561 - 580)','pending',29,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:25.366'),('cmpc6cjfb008xqb00emsmm667','Batch 30 (Products 581 - 600)','pending',30,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:25.366'),('cmpc6cjfb008yqb007k6146ne','Batch 31 (Products 601 - 620)','pending',31,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:25.366'),('cmpc6cjfb008zqb00ry4ab32l','Batch 32 (Products 621 - 640)','pending',32,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:25.366'),('cmpc6cjfb0090qb00f5ij84fv','Batch 33 (Products 641 - 660)','pending',33,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:25.366'),('cmpc6cjfb0091qb00e2pbgz4x','Batch 34 (Products 661 - 680)','pending',34,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:25.366'),('cmpc6cjfb0092qb00zcmi6wn0','Batch 35 (Products 681 - 700)','pending',35,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:25.366'),('cmpc6cjfb0093qb00ezlt62i7','Batch 36 (Products 701 - 720)','pending',36,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:25.366'),('cmpc6cjfb0094qb00n3thfmn4','Batch 37 (Products 721 - 740)','pending',37,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:25.366'),('cmpc6cjfb0095qb004jnokk93','Batch 38 (Products 741 - 760)','pending',38,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:25.366'),('cmpc6cjfb0096qb0050twrtug','Batch 39 (Products 761 - 780)','pending',39,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:25.366'),('cmpc6cjfb0097qb00eqgymoak','Batch 40 (Products 781 - 800)','pending',40,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:25.366'),('cmpc6cjfb0098qb00cajitp0i','Batch 41 (Products 801 - 820)','pending',41,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:25.366'),('cmpc6cjfb0099qb00bcgwwz82','Batch 42 (Products 821 - 840)','pending',42,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:25.366'),('cmpc6cjfb009aqb00oxyzu5g0','Batch 43 (Products 841 - 860)','pending',43,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:25.366'),('cmpc6cjfb009bqb0046bunnx6','Batch 44 (Products 861 - 880)','pending',44,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:25.366'),('cmpc6cjfb009cqb00ziv5inn3','Batch 45 (Products 881 - 900)','pending',45,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:25.366'),('cmpc6cjfb009dqb00i8jcf1p6','Batch 46 (Products 901 - 920)','pending',46,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:25.366'),('cmpc6cjfb009eqb00jayayqoh','Batch 47 (Products 921 - 940)','pending',47,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:25.366'),('cmpc6cjfb009fqb007mf0a4ta','Batch 48 (Products 941 - 960)','pending',48,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:25.366'),('cmpc6cjfb009gqb00zkpj0haw','Batch 49 (Products 961 - 980)','pending',49,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:25.366'),('cmpc6cjfb009hqb00wrd45ik2','Batch 50 (Products 981 - 1000)','pending',50,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:25.366'),('cmpc6cjfb009iqb002wdx1fdc','Batch 51 (Products 1001 - 1020)','pending',51,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:25.366'),('cmpc6cjfb009jqb008391uya8','Batch 52 (Products 1021 - 1040)','pending',52,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:25.366'),('cmpc6cjfb009kqb00wr23carl','Batch 53 (Products 1041 - 1060)','pending',53,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:25.366'),('cmpc6cjfb009lqb00u421wi5x','Batch 54 (Products 1061 - 1080)','pending',54,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:25.366'),('cmpc6cjfb009mqb000tepe2o8','Batch 55 (Products 1081 - 1100)','pending',55,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:25.366'),('cmpc6cjfb009nqb00xn7llkr3','Batch 56 (Products 1101 - 1120)','pending',56,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:25.366'),('cmpc6cjfb009oqb00l9sr2iif','Batch 57 (Products 1121 - 1140)','pending',57,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:25.366'),('cmpc6cjfb009pqb00vcavjxjy','Batch 58 (Products 1141 - 1160)','pending',58,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:25.366'),('cmpc6cjfb009qqb007b6u3id0','Batch 59 (Products 1161 - 1180)','pending',59,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:25.366'),('cmpc6cjfb009rqb00t6n3cjrd','Batch 60 (Products 1181 - 1200)','pending',60,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:25.366'),('cmpc6cjfb009sqb00fcbzj2de','Batch 61 (Products 1201 - 1220)','pending',61,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:25.366'),('cmpc6cjfb009tqb00et0icy7j','Batch 62 (Products 1221 - 1240)','pending',62,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:25.366'),('cmpc6cjfb009uqb00flgmv0nc','Batch 63 (Products 1241 - 1260)','pending',63,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:25.366'),('cmpc6cjfb009vqb00snd59uu5','Batch 64 (Products 1261 - 1280)','pending',64,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:25.366'),('cmpc6cjfb009wqb00v9mneqbj','Batch 65 (Products 1281 - 1300)','pending',65,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:25.366'),('cmpc6cjfb009xqb00s1914uq6','Batch 66 (Products 1301 - 1320)','pending',66,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:25.366'),('cmpc6cjfb009yqb00p6pnmis2','Batch 67 (Products 1321 - 1340)','pending',67,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:25.366'),('cmpc6cjfb009zqb00nutg7n5b','Batch 68 (Products 1341 - 1360)','pending',68,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:25.366'),('cmpc6cjfb00a0qb0073cfz7z4','Batch 69 (Products 1361 - 1380)','pending',69,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:25.366'),('cmpc6cjfb00a1qb00bek5o0ex','Batch 70 (Products 1381 - 1400)','pending',70,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:25.366'),('cmpc6cjfb00a2qb00k17djk1p','Batch 71 (Products 1401 - 1420)','pending',71,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:25.366'),('cmpc6cjfb00a3qb00tttqko8j','Batch 72 (Products 1421 - 1440)','pending',72,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:25.366'),('cmpc6cjfb00a4qb00a8vzg8uq','Batch 73 (Products 1441 - 1460)','pending',73,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:25.366'),('cmpc6cjfb00a5qb00o0ox8o0i','Batch 74 (Products 1461 - 1480)','pending',74,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:25.366'),('cmpc6cjfb00a6qb00zf18maae','Batch 75 (Products 1481 - 1500)','pending',75,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:25.366'),('cmpc6cjfb00a7qb008aidu5mr','Batch 76 (Products 1501 - 1520)','pending',76,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:25.366'),('cmpc6cjfc00a8qb003gky8ug4','Batch 77 (Products 1521 - 1540)','pending',77,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:25.366'),('cmpc6cjfc00a9qb00mkv4dhoq','Batch 78 (Products 1541 - 1560)','pending',78,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:25.366'),('cmpc6cjfc00aaqb00o87br0o2','Batch 79 (Products 1561 - 1580)','pending',79,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:25.366'),('cmpc6cjfc00abqb00csdfqeu2','Batch 80 (Products 1581 - 1600)','pending',80,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:25.366'),('cmpc6cjfc00acqb0062o8c8vc','Batch 81 (Products 1601 - 1620)','pending',81,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:25.366'),('cmpc6cjfc00adqb00bzb5jsyw','Batch 82 (Products 1621 - 1640)','pending',82,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:25.366'),('cmpc6cjfc00aeqb00z2a38gi4','Batch 83 (Products 1641 - 1660)','pending',83,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:25.366'),('cmpc6cjfc00afqb00deg63bev','Batch 84 (Products 1661 - 1680)','pending',84,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:25.366'),('cmpc6cjfc00agqb00qqtt9ody','Batch 85 (Products 1681 - 1700)','pending',85,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:25.366'),('cmpc6cjfc00ahqb00c6jhlgpu','Batch 86 (Products 1701 - 1720)','pending',86,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:25.366'),('cmpc6cjfc00aiqb00az720hw4','Batch 87 (Products 1721 - 1740)','pending',87,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:25.366'),('cmpc6cjfc00ajqb0004fq50e1','Batch 88 (Products 1741 - 1760)','pending',88,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:25.366'),('cmpc6cjfc00akqb00l7unkueq','Batch 89 (Products 1761 - 1780)','pending',89,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:25.366'),('cmpc6cjfc00alqb00s45oietx','Batch 90 (Products 1781 - 1800)','pending',90,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:25.366'),('cmpc6cjfc00amqb00eyt6dcsh','Batch 91 (Products 1801 - 1820)','pending',91,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:25.366'),('cmpc6cjfc00anqb00wzzt1ka7','Batch 92 (Products 1821 - 1840)','pending',92,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:25.366'),('cmpc6cjfc00aoqb0047l6s2i3','Batch 93 (Products 1841 - 1860)','pending',93,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:25.366'),('cmpc6cjfc00apqb005bo0r6g6','Batch 94 (Products 1861 - 1880)','pending',94,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:25.366'),('cmpc6cjfc00aqqb00yddjs365','Batch 95 (Products 1881 - 1900)','pending',95,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:25.366'),('cmpc6cjfc00arqb002zsvaspi','Batch 96 (Products 1901 - 1920)','pending',96,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:25.366'),('cmpc6cjfc00asqb00fndr99sh','Batch 97 (Products 1921 - 1940)','pending',97,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:25.366'),('cmpc6cjfc00atqb00yi59ecx1','Batch 98 (Products 1941 - 1960)','pending',98,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:25.366'),('cmpc6cjfc00auqb00rtq9ilsl','Batch 99 (Products 1961 - 1980)','pending',99,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:25.366'),('cmpc6cjfc00avqb00f6ydjy3q','Batch 100 (Products 1981 - 2000)','pending',100,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:25.366'),('cmpc6cjfc00awqb002q00kwqs','Batch 101 (Products 2001 - 2020)','pending',101,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:25.366'),('cmpc6cjfc00axqb006cu69uer','Batch 102 (Products 2021 - 2040)','pending',102,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:25.366'),('cmpc6cjfc00ayqb004dlekgyr','Batch 103 (Products 2041 - 2060)','pending',103,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:25.366'),('cmpc6cjfc00azqb00s36huw81','Batch 104 (Products 2061 - 2080)','pending',104,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:25.366'),('cmpc6cjfc00b0qb0063c6joah','Batch 105 (Products 2081 - 2100)','pending',105,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:25.366'),('cmpc6cjfc00b1qb002jjk81qm','Batch 106 (Products 2101 - 2120)','pending',106,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:25.366'),('cmpc6cjfc00b2qb00vmuky53d','Batch 107 (Products 2121 - 2140)','pending',107,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:25.366'),('cmpc6cjfc00b3qb008xogfmzw','Batch 108 (Products 2141 - 2160)','pending',108,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:25.366'),('cmpc6cjfc00b4qb00286rrbyk','Batch 109 (Products 2161 - 2180)','pending',109,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:25.366'),('cmpc6cjfc00b5qb00rao2efzn','Batch 110 (Products 2181 - 2200)','pending',110,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:25.366'),('cmpc6cjfc00b6qb00wf0p4xp3','Batch 111 (Products 2201 - 2220)','pending',111,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:25.366'),('cmpc6cjfc00b7qb00ni60hv3m','Batch 112 (Products 2221 - 2240)','pending',112,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:25.366'),('cmpc6cjfc00b8qb00a31myq82','Batch 113 (Products 2241 - 2260)','pending',113,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:25.366'),('cmpc6cjfc00b9qb00tt4t8pfk','Batch 114 (Products 2261 - 2280)','pending',114,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:25.366'),('cmpc6cjfc00baqb009opzdovv','Batch 115 (Products 2281 - 2300)','pending',115,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:25.366'),('cmpc6cjfc00bbqb00p9pngfnn','Batch 116 (Products 2301 - 2320)','pending',116,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:25.366'),('cmpc6cjfc00bcqb00tbxz68ka','Batch 117 (Products 2321 - 2340)','pending',117,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:25.366'),('cmpc6cjfc00bdqb006pmaecd7','Batch 118 (Products 2341 - 2360)','pending',118,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:25.366'),('cmpc6cjfc00beqb00kyv30lpc','Batch 119 (Products 2361 - 2380)','pending',119,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:25.366'),('cmpc6cjfc00bfqb00h60ro9s1','Batch 120 (Products 2381 - 2400)','pending',120,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:25.366'),('cmpc6cjfc00bgqb002fiknhaq','Batch 121 (Products 2401 - 2420)','pending',121,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:25.366'),('cmpc6cjfc00bhqb004b3z7v81','Batch 122 (Products 2421 - 2440)','pending',122,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:25.366'),('cmpc6cjfc00biqb007yshcbx3','Batch 123 (Products 2441 - 2460)','pending',123,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:25.366'),('cmpc6cjfc00bjqb00jzqbhguo','Batch 124 (Products 2461 - 2480)','pending',124,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:25.366'),('cmpc6cjfc00bkqb00v1jrzqwd','Batch 125 (Products 2481 - 2500)','pending',125,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:25.366'),('cmpc6cjfc00blqb00khrilzee','Batch 126 (Products 2501 - 2520)','pending',126,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:25.366'),('cmpc6cjfc00bmqb00micnc2da','Batch 127 (Products 2521 - 2540)','pending',127,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:25.366'),('cmpc6cjfc00bnqb00ffggu4rz','Batch 128 (Products 2541 - 2560)','pending',128,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:25.366'),('cmpc6cjfc00boqb00rmo2r27c','Batch 129 (Products 2561 - 2580)','pending',129,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:25.366'),('cmpc6cjfc00bpqb003p7l7qet','Batch 130 (Products 2581 - 2600)','pending',130,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:25.366'),('cmpc6cjfc00bqqb00yqs3qe4s','Batch 131 (Products 2601 - 2620)','pending',131,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:25.366'),('cmpc6cjfc00brqb00etxc1kzh','Batch 132 (Products 2621 - 2640)','pending',132,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:25.366'),('cmpc6cjfc00bsqb002cgxamfp','Batch 133 (Products 2641 - 2660)','pending',133,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:25.366'),('cmpc6cjfc00btqb00soep90ax','Batch 134 (Products 2661 - 2666)','pending',134,20,6,0,0,'[]',NULL,NULL,'2026-05-19 05:10:25.366'),('cmpc6cr6100c6qb004496xerx','Batch 1 (Products 1 - 20)','done',1,20,20,20,0,'[\"[11:10:46] 🚀 Starting: Batch 1 (Products 1 - 20)\",\"[11:10:46] Fetching category map from WooCommerce...\",\"[11:10:46] ✔️ 144 categories cached.\",\"[11:10:46] Fetching page 1 from WooCommerce (20 per page)...\",\"[11:10:47] ✔️ Fetched 20 products.\",\"[11:10:47] ⬇️ Processing \\\"Cerave Hydrating Cleanser For Normal To Dry Skin 237ml (USA)\\\" (ID: 55919)\",\"[11:10:47]   🖼️ Downloading main image...\",\"[11:10:47]   ✔️ Main image saved.\",\"[11:10:47]   🛠️ Updating core product record...\",\"[11:10:47] ✅ Completed \\\"Cerave Hydrating Cleanser For Normal To Dry Skin 237ml (USA)\\\". Status: updated\",\"[11:10:48] ⬇️ Processing \\\"Nivea Soft Moisturizing Cream 100ml(EU)\\\" (ID: 55911)\",\"[11:10:48]   🖼️ Downloading main image...\",\"[11:10:48]   ✔️ Main image saved.\",\"[11:10:48]   🛠️ Updating core product record...\",\"[11:10:48] ✅ Completed \\\"Nivea Soft Moisturizing Cream 100ml(EU)\\\". Status: updated\",\"[11:10:48] ⬇️ Processing \\\"Garnier Bright Complete Vitamin C Booster Serum \\\" (ID: 55890)\",\"[11:10:48]   🖼️ Downloading main image...\",\"[11:10:48]   ✔️ Main image saved.\",\"[11:10:48]   🛠️ Updating core product record...\",\"[11:10:48]   ⚙️ Fetching variations from WooCommerce...\",\"[11:10:49]   ⚙️ Processing 2 variations...\",\"[11:10:49] ✅ Completed \\\"Garnier Bright Complete Vitamin C Booster Serum \\\". Status: updated\",\"[11:10:49] ⬇️ Processing \\\"The Derma Co Sali-Cinamide Anti-Acne Face Wash 80ml\\\" (ID: 55869)\",\"[11:10:49]   🖼️ Downloading main image...\",\"[11:10:49]   ✔️ Main image saved.\",\"[11:10:49]   🛠️ Updating core product record...\",\"[11:10:49] ✅ Completed \\\"The Derma Co Sali-Cinamide Anti-Acne Face Wash 80ml\\\". Status: updated\",\"[11:10:49] ⬇️ Processing \\\"Nivea Refreshingly Soft Moisturizing Cream (egypt)\\\" (ID: 55859)\",\"[11:10:49]   🖼️ Downloading main image...\",\"[11:10:49]   ✔️ Main image saved.\",\"[11:10:49]   🛠️ Updating core product record...\",\"[11:10:49]   ⚙️ Fetching variations from WooCommerce...\",\"[11:10:50]   ⚙️ Processing 2 variations...\",\"[11:10:50] ✅ Completed \\\"Nivea Refreshingly Soft Moisturizing Cream (egypt)\\\". Status: updated\",\"[11:10:50] ⬇️ Processing \\\"Dot and Key Blueberry Hydrate Barrier Repair Sunscreen SPF 50+ PA++++\\\" (ID: 55825)\",\"[11:10:50]   🖼️ Downloading main image...\",\"[11:10:50]   ✔️ Main image saved.\",\"[11:10:50]   🛠️ Updating core product record...\",\"[11:10:50] ✅ Completed \\\"Dot and Key Blueberry Hydrate Barrier Repair Sunscreen SPF 50+ PA++++\\\". Status: updated\",\"[11:10:50] ⬇️ Processing \\\"Dot & Key CICA Calming Mattifying Sunscreen SPF 50 PA++++ 50gm\\\" (ID: 55822)\",\"[11:10:50]   🖼️ Downloading main image...\",\"[11:10:50]   ✔️ Main image saved.\",\"[11:10:50]   🛠️ Updating core product record...\",\"[11:10:50] ✅ Completed \\\"Dot & Key CICA Calming Mattifying Sunscreen SPF 50 PA++++ 50gm\\\". Status: updated\",\"[11:10:50] ⬇️ Processing \\\"Dot & Key Strawberry Dew Tinted Sunscreen SPF 50+ Dailly Wear - 05 Beige\\\" (ID: 55818)\",\"[11:10:50]   🖼️ Downloading main image...\",\"[11:10:50]   ✔️ Main image saved.\",\"[11:10:50]   🛠️ Updating core product record...\",\"[11:10:50] ✅ Completed \\\"Dot & Key Strawberry Dew Tinted Sunscreen SPF 50+ Dailly Wear - 05 Beige\\\". Status: updated\",\"[11:10:50] ⬇️ Processing \\\"Chemist at Play Brightening Body Wash (3% Vitamin C + Niacinamide + Alpha Arbutin + Glycolic Acid + Camu Camu) – 236ml\\\" (ID: 55800)\",\"[11:10:50]   🖼️ Downloading main image...\",\"[11:10:50]   ❌ Main image download failed: source: bad seek to 16266\\nsource: bad seek to 16250\\nsource: bad seek to 16242\\nsource: bad seek to 16238\\nsource: bad seek to 16236\\nsource: bad seek to 16235\\nheif: Invalid input: Unspecified: Bitstream not supported by this decoder (2.0)\",\"[11:10:50]   🛠️ Updating core product record...\",\"[11:10:50] ✅ Completed \\\"Chemist at Play Brightening Body Wash (3% Vitamin C + Niacinamide + Alpha Arbutin + Glycolic Acid + Camu Camu) – 236ml\\\". Status: updated\",\"[11:10:50] ⬇️ Processing \\\"Loreal Studio Line Xtreme Hold Indestructible Hair Gel 9 150ml\\\" (ID: 55783)\",\"[11:10:50]   🖼️ Downloading main image...\",\"[11:10:50]   ✔️ Main image saved.\",\"[11:10:50]   🛠️ Updating core product record...\",\"[11:10:50] ✅ Completed \\\"Loreal Studio Line Xtreme Hold Indestructible Hair Gel 9 150ml\\\". Status: updated\",\"[11:10:50] ⬇️ Processing \\\"Dot and Key Retinol + Ceramide Night Repair Cream\\\" (ID: 55773)\",\"[11:10:50]   🖼️ Downloading main image...\",\"[11:10:51]   ✔️ Main image saved.\",\"[11:10:51]   🛠️ Creating core product record...\",\"[11:10:51]   ⚙️ Fetching variations from WooCommerce...\",\"[11:10:52]   ⚙️ Processing 2 variations...\",\"[11:10:54] ✅ Completed \\\"Dot and Key Retinol + Ceramide Night Repair Cream\\\". Status: created\",\"[11:10:54] ⬇️ Processing \\\"Dot & Key Watermelon Refresh Gel Face Wash with Vitamin C & Cucumber (15ml)\\\" (ID: 55769)\",\"[11:10:54]   🖼️ Downloading main image...\",\"[11:10:54]   ✔️ Main image saved.\",\"[11:10:54]   🛠️ Creating core product record...\",\"[11:10:54] ✅ Completed \\\"Dot & Key Watermelon Refresh Gel Face Wash with Vitamin C & Cucumber (15ml)\\\". Status: created\",\"[11:10:54] ⬇️ Processing \\\"Dot & Key Watermelon Cooling ICY Gel Moisturizer (60ml)\\\" (ID: 55759)\",\"[11:10:54]   🖼️ Downloading main image...\",\"[11:10:57]   ✔️ Main image saved.\",\"[11:10:57]   🛠️ Creating core product record...\",\"[11:10:57] ✅ Completed \\\"Dot & Key Watermelon Cooling ICY Gel Moisturizer (60ml)\\\". Status: created\",\"[11:10:57] ⬇️ Processing \\\"Minimalist Salicylic Acid + LHA 2% Cleanser 100ml\\\" (ID: 55752)\",\"[11:10:57]   🖼️ Downloading main image...\",\"[11:10:59]   ✔️ Main image saved.\",\"[11:10:59]   🛠️ Creating core product record...\",\"[11:10:59] ✅ Completed \\\"Minimalist Salicylic Acid + LHA 2% Cleanser 100ml\\\". Status: created\",\"[11:10:59] ⬇️ Processing \\\"Minimalist Vitamin B5 10% Moisturizer 50g\\\" (ID: 55749)\",\"[11:10:59]   🖼️ Downloading main image...\",\"[11:10:59]   ✔️ Main image saved.\",\"[11:10:59]   🛠️ Creating core product record...\",\"[11:10:59] ✅ Completed \\\"Minimalist Vitamin B5 10% Moisturizer 50g\\\". Status: created\",\"[11:10:59] ⬇️ Processing \\\"Minimalist B12 + Repair Complex 5.5% Face Moisturizer\\\" (ID: 55740)\",\"[11:10:59]   🖼️ Downloading main image...\",\"[11:11:00]   ✔️ Main image saved.\",\"[11:11:00]   🛠️ Creating core product record...\",\"[11:11:00]   ⚙️ Fetching variations from WooCommerce...\",\"[11:11:01]   ⚙️ Processing 2 variations...\",\"[11:11:02] ✅ Completed \\\"Minimalist B12 + Repair Complex 5.5% Face Moisturizer\\\". Status: created\",\"[11:11:02] ⬇️ Processing \\\"Minimalist SPF 60 Sunscreen with Silymarin + Hyaluronic Acid + Vitamin E PA++++ for All Skin Types\\\" (ID: 55735)\",\"[11:11:02]   🖼️ Downloading main image...\",\"[11:11:04]   ✔️ Main image saved.\",\"[11:11:04]   🛠️ Creating core product record...\",\"[11:11:04] ✅ Completed \\\"Minimalist SPF 60 Sunscreen with Silymarin + Hyaluronic Acid + Vitamin E PA++++ for All Skin Types\\\". Status: created\",\"[11:11:04] ⬇️ Processing \\\"Minimalist AHA BHA 10% Face Exfoliator 30ml\\\" (ID: 55728)\",\"[11:11:04]   🖼️ Downloading main image...\",\"[11:11:05]   ✔️ Main image saved.\",\"[11:11:05]   🛠️ Creating core product record...\",\"[11:11:05] ✅ Completed \\\"Minimalist AHA BHA 10% Face Exfoliator 30ml\\\". Status: created\",\"[11:11:05] ⬇️ Processing \\\"Minimalist Hyaluronic + PGA 2% Face Serum 30ml\\\" (ID: 55724)\",\"[11:11:05]   🖼️ Downloading main image...\",\"[11:11:06]   ✔️ Main image saved.\",\"[11:11:06]   🛠️ Creating core product record...\",\"[11:11:06] ✅ Completed \\\"Minimalist Hyaluronic + PGA 2% Face Serum 30ml\\\". Status: created\",\"[11:11:06] ⬇️ Processing \\\"Minimalist Tranexamic 3% Face Serum 30ml\\\" (ID: 55720)\",\"[11:11:06]   🖼️ Downloading main image...\",\"[11:11:07]   ✔️ Main image saved.\",\"[11:11:07]   🛠️ Creating core product record...\",\"[11:11:07] ✅ Completed \\\"Minimalist Tranexamic 3% Face Serum 30ml\\\". Status: created\",\"[11:11:07] ✅ Task complete! Imported: 20, Failed: 0\"]','2026-05-19 05:10:46.194','2026-05-19 05:11:07.821','2026-05-19 05:10:35.400'),('cmpc6cr6100c7qb00l21j0pyj','Batch 2 (Products 21 - 40)','done',2,20,20,20,0,'[\"[11:11:07] 🚀 Starting: Batch 2 (Products 21 - 40)\",\"[11:11:07] Fetching category map from WooCommerce...\",\"[11:11:07] ✔️ 144 categories cached.\",\"[11:11:07] Fetching page 2 from WooCommerce (20 per page)...\",\"[11:11:09] ✔️ Fetched 20 products.\",\"[11:11:09] ⬇️ Processing \\\"Minimalist Multi-Peptides 10% Face Serum 30ml\\\" (ID: 55717)\",\"[11:11:09]   🖼️ Downloading main image...\",\"[11:11:10]   ✔️ Main image saved.\",\"[11:11:10]   🛠️ Creating core product record...\",\"[11:11:10] ✅ Completed \\\"Minimalist Multi-Peptides 10% Face Serum 30ml\\\". Status: created\",\"[11:11:10] ⬇️ Processing \\\"The Derma Co 15% AHA +1% BHA Beginner Face Peeling Solution 30ml\\\" (ID: 55713)\",\"[11:11:10]   🖼️ Downloading main image...\",\"[11:11:11]   ✔️ Main image saved.\",\"[11:11:11]   🛠️ Creating core product record...\",\"[11:11:11] ✅ Completed \\\"The Derma Co 15% AHA +1% BHA Beginner Face Peeling Solution 30ml\\\". Status: created\",\"[11:11:11] ⬇️ Processing \\\"The Derma Co 2% Salicylic Acid Face Serum for Active Acne\\\" (ID: 55709)\",\"[11:11:11]   🖼️ Downloading main image...\",\"[11:11:12]   ✔️ Main image saved.\",\"[11:11:12]   🛠️ Creating core product record...\",\"[11:11:12] ✅ Completed \\\"The Derma Co 2% Salicylic Acid Face Serum for Active Acne\\\". Status: created\",\"[11:11:12] ⬇️ Processing \\\"The Derma Co 2% Kojic Acid Face Serum With 1% Alpha Arbutin & Niacinamide For Dark Spots & Pigmentation 30ml\\\" (ID: 55705)\",\"[11:11:12]   🖼️ Downloading main image...\",\"[11:11:12]   ✔️ Main image saved.\",\"[11:11:12]   🛠️ Creating core product record...\",\"[11:11:12] ✅ Completed \\\"The Derma Co 2% Kojic Acid Face Serum With 1% Alpha Arbutin & Niacinamide For Dark Spots & Pigmentation 30ml\\\". Status: created\",\"[11:11:12] ⬇️ Processing \\\"Wishcare AHA BHA Anti-Dandruff Shampoo 250ml\\\" (ID: 55700)\",\"[11:11:12]   🖼️ Downloading main image...\",\"[11:11:13]   ✔️ Main image saved.\",\"[11:11:13]   🛠️ Creating core product record...\",\"[11:11:13] ✅ Completed \\\"Wishcare AHA BHA Anti-Dandruff Shampoo 250ml\\\". Status: created\",\"[11:11:13] ⬇️ Processing \\\"WishCare Multi-Vitamin Brightening Body Lotion with 5% Vitamin C & 5% Niacinamide 200ml\\\" (ID: 55697)\",\"[11:11:13]   🖼️ Downloading main image...\",\"[11:11:14]   ✔️ Main image saved.\",\"[11:11:14]   🛠️ Creating core product record...\",\"[11:11:14] ✅ Completed \\\"WishCare Multi-Vitamin Brightening Body Lotion with 5% Vitamin C & 5% Niacinamide 200ml\\\". Status: created\",\"[11:11:14] ⬇️ Processing \\\"WishCare 5% Niacinamide Oil Balance Fluid Sunscreen\\\" (ID: 55693)\",\"[11:11:14]   🖼️ Downloading main image...\",\"[11:11:15]   ✔️ Main image saved.\",\"[11:11:15]   🛠️ Creating core product record...\",\"[11:11:15] ✅ Completed \\\"WishCare 5% Niacinamide Oil Balance Fluid Sunscreen\\\". Status: created\",\"[11:11:15] ⬇️ Processing \\\"WishCare Daily Tinted Fluid Sunscreen\\\" (ID: 55687)\",\"[11:11:15]   🖼️ Downloading main image...\",\"[11:11:16]   ✔️ Main image saved.\",\"[11:11:16]   🛠️ Creating core product record...\",\"[11:11:16] ✅ Completed \\\"WishCare Daily Tinted Fluid Sunscreen\\\". Status: created\",\"[11:11:16] ⬇️ Processing \\\"Wishcare Triple Bond Repair Shampoo\\\" (ID: 55684)\",\"[11:11:16]   🖼️ Downloading main image...\",\"[11:11:17]   ✔️ Main image saved.\",\"[11:11:17]   🛠️ Creating core product record...\",\"[11:11:17] ✅ Completed \\\"Wishcare Triple Bond Repair Shampoo\\\". Status: created\",\"[11:11:17] ⬇️ Processing \\\"Minimalist 0.3% Retinol Face Serum for All Skin Types 30ml\\\" (ID: 55680)\",\"[11:11:17]   🖼️ Downloading main image...\",\"[11:11:18]   ✔️ Main image saved.\",\"[11:11:18]   🛠️ Creating core product record...\",\"[11:11:18] ✅ Completed \\\"Minimalist 0.3% Retinol Face Serum for All Skin Types 30ml\\\". Status: created\",\"[11:11:18] ⬇️ Processing \\\"The Derma Co 2% Kojic Acid Face Serum for Dark Spots & Pigmentation 30ml\\\" (ID: 55677)\",\"[11:11:18]   🖼️ Downloading main image...\",\"[11:11:19]   ✔️ Main image saved.\",\"[11:11:19]   🛠️ Creating core product record...\",\"[11:11:19] ✅ Completed \\\"The Derma Co 2% Kojic Acid Face Serum for Dark Spots & Pigmentation 30ml\\\". Status: created\",\"[11:11:19] ⬇️ Processing \\\"The Derma Co. 2% Salicylic Acid Gel Face Wash 100ml\\\" (ID: 55674)\",\"[11:11:19]   🖼️ Downloading main image...\",\"[11:11:20]   ✔️ Main image saved.\",\"[11:11:20]   🛠️ Creating core product record...\",\"[11:11:20] ✅ Completed \\\"The Derma Co. 2% Salicylic Acid Gel Face Wash 100ml\\\". Status: created\",\"[11:11:20] ⬇️ Processing \\\"The Derma co 10% Vitamin C Face Serum for Skin Radiance 30ml\\\" (ID: 55669)\",\"[11:11:20]   🖼️ Downloading main image...\",\"[11:11:21]   ✔️ Main image saved.\",\"[11:11:21]   🛠️ Creating core product record...\",\"[11:11:21] ✅ Completed \\\"The Derma co 10% Vitamin C Face Serum for Skin Radiance 30ml\\\". Status: created\",\"[11:11:21] ⬇️ Processing \\\"The Derma Co 1% Hyaluronic Sunscreen Aqua Gel SPF 50 (50g)\\\" (ID: 55664)\",\"[11:11:21]   🖼️ Downloading main image...\",\"[11:11:23]   ✔️ Main image saved.\",\"[11:11:23]   🛠️ Creating core product record...\",\"[11:11:23] ✅ Completed \\\"The Derma Co 1% Hyaluronic Sunscreen Aqua Gel SPF 50 (50g)\\\". Status: created\",\"[11:11:23] ⬇️ Processing \\\"Chemist At Play 1% Salicylic Acid Body Wash for Acne Control 473 ml\\\" (ID: 55658)\",\"[11:11:23]   🖼️ Downloading main image...\",\"[11:11:25]   ✔️ Main image saved.\",\"[11:11:25]   🛠️ Creating core product record...\",\"[11:11:25] ✅ Completed \\\"Chemist At Play 1% Salicylic Acid Body Wash for Acne Control 473 ml\\\". Status: created\",\"[11:11:25] ⬇️ Processing \\\"Bare Anatomy Advanced Hair Growth Serum Roll-On with Redensyl, Rosemary & Rice Water- 25 ml | Pack of 2\\\" (ID: 55654)\",\"[11:11:25]   🖼️ Downloading main image...\",\"[11:11:26]   ✔️ Main image saved.\",\"[11:11:26]   🛠️ Creating core product record...\",\"[11:11:26] ✅ Completed \\\"Bare Anatomy Advanced Hair Growth Serum Roll-On with Redensyl, Rosemary & Rice Water- 25 ml | Pack of 2\\\". Status: created\",\"[11:11:26] ⬇️ Processing \\\"Chemist At Play Exfoliating Body Wash 4% Lactic acid + salicylic Acid + vitamin E 236ml\\\" (ID: 55648)\",\"[11:11:26]   🖼️ Downloading main image...\",\"[11:11:27]   ✔️ Main image saved.\",\"[11:11:27]   🛠️ Creating core product record...\",\"[11:11:27] ✅ Completed \\\"Chemist At Play Exfoliating Body Wash 4% Lactic acid + salicylic Acid + vitamin E 236ml\\\". Status: created\",\"[11:11:27] ⬇️ Processing \\\"Chemist at Play Neck Knee Elbow Brightening Roll On 40ml\\\" (ID: 55643)\",\"[11:11:27]   🖼️ Downloading main image...\",\"[11:11:29]   ✔️ Main image saved.\",\"[11:11:29]   🛠️ Creating core product record...\",\"[11:11:29] ✅ Completed \\\"Chemist at Play Neck Knee Elbow Brightening Roll On 40ml\\\". Status: created\",\"[11:11:29] ⬇️ Processing \\\"Chemist At Play 2% Salicylic Acid Face Wash for Acne & Oil Control - 100 ml\\\" (ID: 55639)\",\"[11:11:29]   🖼️ Downloading main image...\",\"[11:11:30]   ✔️ Main image saved.\",\"[11:11:30]   🛠️ Creating core product record...\",\"[11:11:30] ✅ Completed \\\"Chemist At Play 2% Salicylic Acid Face Wash for Acne & Oil Control - 100 ml\\\". Status: created\",\"[11:11:30] ⬇️ Processing \\\"Bare Anatomy Anti Dandruff Shampoo with Salicylic Acid & Biotin – 250ml\\\" (ID: 55636)\",\"[11:11:30]   🖼️ Downloading main image...\",\"[11:11:31]   ✔️ Main image saved.\",\"[11:11:31]   🛠️ Creating core product record...\",\"[11:11:31] ✅ Completed \\\"Bare Anatomy Anti Dandruff Shampoo with Salicylic Acid & Biotin – 250ml\\\". Status: created\",\"[11:11:31] ✅ Task complete! Imported: 20, Failed: 0\"]','2026-05-19 05:11:07.824','2026-05-19 05:11:31.423','2026-05-19 05:10:35.400'),('cmpc6cr6100c8qb001fkgrodq','Batch 3 (Products 41 - 60)','done',3,20,20,20,0,'[\"[11:12:07] 🚀 Starting: Batch 3 (Products 41 - 60)\",\"[11:12:07] Fetching category map from WooCommerce...\",\"[11:12:07] ✔️ 144 categories cached.\",\"[11:12:07] Fetching page 3 from WooCommerce (20 per page)...\",\"[11:12:09] ✔️ Fetched 20 products.\",\"[11:12:09] ⬇️ Processing \\\"Bare Anatomy Hair Fall Control Shampoo with Peptides – 250ml\\\" (ID: 55633)\",\"[11:12:09]   🖼️ Downloading main image...\",\"[11:12:10]   ✔️ Main image saved.\",\"[11:12:10]   🛠️ Creating core product record...\",\"[11:12:10] ✅ Completed \\\"Bare Anatomy Hair Fall Control Shampoo with Peptides – 250ml\\\". Status: created\",\"[11:12:10] ⬇️ Processing \\\"Exfoliating Body Scrub with Coffee & Brown Sugar - 75 gm\\\" (ID: 55630)\",\"[11:12:10]   🖼️ Downloading main image...\",\"[11:12:11]   ✔️ Main image saved.\",\"[11:12:11]   🛠️ Creating core product record...\",\"[11:12:11] ✅ Completed \\\"Exfoliating Body Scrub with Coffee & Brown Sugar - 75 gm\\\". Status: created\",\"[11:12:11] ⬇️ Processing \\\"Fixderma Nigrifix Cream | A patented solution to treat hyperpigmentation\\\" (ID: 55622)\",\"[11:12:11]   🖼️ Downloading main image...\",\"[11:12:12]   ✔️ Main image saved.\",\"[11:12:12]   🖼️ Downloading 2 gallery images...\",\"[11:12:14]   ✔️ Gallery images saved.\",\"[11:12:14]   🛠️ Creating core product record...\",\"[11:12:14]   ⚙️ Fetching variations from WooCommerce...\",\"[11:12:15]   ⚙️ Processing 2 variations...\",\"[11:12:15] ✅ Completed \\\"Fixderma Nigrifix Cream | A patented solution to treat hyperpigmentation\\\". Status: created\",\"[11:12:15] ⬇️ Processing \\\"Minimalist Tranexamic 3% Face Serum 30ml\\\" (ID: 55616)\",\"[11:12:15]   🖼️ Downloading main image...\",\"[11:12:17]   ✔️ Main image saved.\",\"[11:12:17]   🖼️ Downloading 1 gallery images...\",\"[11:12:18]   ✔️ Gallery images saved.\",\"[11:12:18]   🛠️ Creating core product record...\",\"[11:12:18] ✅ Completed \\\"Minimalist Tranexamic 3% Face Serum 30ml\\\". Status: created\",\"[11:12:18] ⬇️ Processing \\\"Minimalist Niacinamide 5% Face Serum 30ml\\\" (ID: 55610)\",\"[11:12:18]   🖼️ Downloading main image...\",\"[11:12:19]   ✔️ Main image saved.\",\"[11:12:19]   🛠️ Creating core product record...\",\"[11:12:19] ✅ Completed \\\"Minimalist Niacinamide 5% Face Serum 30ml\\\". Status: created\",\"[11:12:19] ⬇️ Processing \\\"Minimalist L-Ascorbic Acid 8% Lip Treatment Balm 12g\\\" (ID: 55607)\",\"[11:12:19]   🖼️ Downloading main image...\",\"[11:12:20]   ✔️ Main image saved.\",\"[11:12:20]   🛠️ Creating core product record...\",\"[11:12:20] ✅ Completed \\\"Minimalist L-Ascorbic Acid 8% Lip Treatment Balm 12g\\\". Status: created\",\"[11:12:20] ⬇️ Processing \\\"Minimalist Vitamin C + E + Ferulic 16% Face Serum 20ml\\\" (ID: 55603)\",\"[11:12:20]   🖼️ Downloading main image...\",\"[11:12:22]   ✔️ Main image saved.\",\"[11:12:22]   🛠️ Creating core product record...\",\"[11:12:22] ✅ Completed \\\"Minimalist Vitamin C + E + Ferulic 16% Face Serum 20ml\\\". Status: created\",\"[11:12:22] ⬇️ Processing \\\"Minimalist Alpha Arbutin 2% Face Serum 30ml\\\" (ID: 55598)\",\"[11:12:22]   🖼️ Downloading main image...\",\"[11:12:23]   ✔️ Main image saved.\",\"[11:12:23]   🛠️ Creating core product record...\",\"[11:12:23] ✅ Completed \\\"Minimalist Alpha Arbutin 2% Face Serum 30ml\\\". Status: created\",\"[11:12:23] ⬇️ Processing \\\"Wishcare Vitamin C Pure Glow Milk Sunscreen Ultra Light SPF 50+ PA++++\\\" (ID: 55584)\",\"[11:12:23]   🖼️ Downloading main image...\",\"[11:12:25]   ✔️ Main image saved.\",\"[11:12:25]   🛠️ Creating core product record...\",\"[11:12:25] ✅ Completed \\\"Wishcare Vitamin C Pure Glow Milk Sunscreen Ultra Light SPF 50+ PA++++\\\". Status: created\",\"[11:12:25] ⬇️ Processing \\\"WishCare Multi Peptide Anti Hairfall Shampoo 250ml\\\" (ID: 55579)\",\"[11:12:25]   🖼️ Downloading main image...\",\"[11:12:26]   ✔️ Main image saved.\",\"[11:12:26]   🛠️ Creating core product record...\",\"[11:12:26] ✅ Completed \\\"WishCare Multi Peptide Anti Hairfall Shampoo 250ml\\\". Status: created\",\"[11:12:26] ⬇️ Processing \\\"Re\'equil Ceramide & Hyaluronic Acid Moisturiser for normal to dry skin\\\" (ID: 55565)\",\"[11:12:26]   🖼️ Downloading main image...\",\"[11:12:27]   ✔️ Main image saved.\",\"[11:12:27]   🛠️ Creating core product record...\",\"[11:12:27] ✅ Completed \\\"Re\'equil Ceramide & Hyaluronic Acid Moisturiser for normal to dry skin\\\". Status: created\",\"[11:12:27] ⬇️ Processing \\\"Re\'equil 0.1% Retinol Night Cream\\\" (ID: 55562)\",\"[11:12:27]   🖼️ Downloading main image...\",\"[11:12:28]   ✔️ Main image saved.\",\"[11:12:28]   🛠️ Creating core product record...\",\"[11:12:28] ✅ Completed \\\"Re\'equil 0.1% Retinol Night Cream\\\". Status: created\",\"[11:12:28] ⬇️ Processing \\\"Flicka Professional Silk Touch Multi-Function Moisturizer and Primer\\\" (ID: 55557)\",\"[11:12:28]   🖼️ Downloading main image...\",\"[11:12:30]   ✔️ Main image saved.\",\"[11:12:30]   🛠️ Creating core product record...\",\"[11:12:30] ✅ Completed \\\"Flicka Professional Silk Touch Multi-Function Moisturizer and Primer\\\". Status: created\",\"[11:12:30] ⬇️ Processing \\\"Fixderma Dewrav Brightening & Oil-Free Face Moisturizer\\\" (ID: 55553)\",\"[11:12:30]   🖼️ Downloading main image...\",\"[11:12:31]   ✔️ Main image saved.\",\"[11:12:31]   🛠️ Creating core product record...\",\"[11:12:31] ✅ Completed \\\"Fixderma Dewrav Brightening & Oil-Free Face Moisturizer\\\". Status: created\",\"[11:12:31] ⬇️ Processing \\\"Chemist at Play Exfoliating Body Scrub containing natural AHAs, coffee, and brown sugar\\\" (ID: 55550)\",\"[11:12:31]   🖼️ Downloading main image...\",\"[11:12:32]   ✔️ Main image saved.\",\"[11:12:32]   🛠️ Creating core product record...\",\"[11:12:32] ✅ Completed \\\"Chemist at Play Exfoliating Body Scrub containing natural AHAs, coffee, and brown sugar\\\". Status: created\",\"[11:12:32] ⬇️ Processing \\\"Avène Cicalfate+ Repairing Protective Cream For Sensitive Irritate Skin 100ml\\\" (ID: 55525)\",\"[11:12:32]   🖼️ Downloading main image...\",\"[11:12:33]   ✔️ Main image saved.\",\"[11:12:33]   🛠️ Creating core product record...\",\"[11:12:33] ✅ Completed \\\"Avène Cicalfate+ Repairing Protective Cream For Sensitive Irritate Skin 100ml\\\". Status: created\",\"[11:12:33] ⬇️ Processing \\\"Minimalist Niacinamide 10% Face Serum 30ml\\\" (ID: 55413)\",\"[11:12:33]   🖼️ Downloading main image...\",\"[11:12:34]   ✔️ Main image saved.\",\"[11:12:34]   🛠️ Creating core product record...\",\"[11:12:34] ✅ Completed \\\"Minimalist Niacinamide 10% Face Serum 30ml\\\". Status: created\",\"[11:12:34] ⬇️ Processing \\\"Neutrogena Ultra Sheer Dry-Touch Sunblock SPF50+ 88ml\\\" (ID: 55281)\",\"[11:12:34]   🖼️ Downloading main image...\",\"[11:12:34]   ✔️ Main image saved.\",\"[11:12:34]   🛠️ Creating core product record...\",\"[11:12:34] ✅ Completed \\\"Neutrogena Ultra Sheer Dry-Touch Sunblock SPF50+ 88ml\\\". Status: created\",\"[11:12:34] ⬇️ Processing \\\"Simple Kind to Skin Refreshing Facial Wash Gel 150ml\\\" (ID: 55266)\",\"[11:12:34]   🖼️ Downloading main image...\",\"[11:12:35]   ✔️ Main image saved.\",\"[11:12:35]   🛠️ Creating core product record...\",\"[11:12:35] ✅ Completed \\\"Simple Kind to Skin Refreshing Facial Wash Gel 150ml\\\". Status: created\",\"[11:12:35] ⬇️ Processing \\\"Deconstruct Vitamin C & Ferulic Acid Sеrum 30ml\\\" (ID: 55259)\",\"[11:12:35]   🖼️ Downloading main image...\",\"[11:12:36]   ✔️ Main image saved.\",\"[11:12:36]   🛠️ Creating core product record...\",\"[11:12:36] ✅ Completed \\\"Deconstruct Vitamin C & Ferulic Acid Sеrum 30ml\\\". Status: created\",\"[11:12:36] ✅ Task complete! Imported: 20, Failed: 0\"]','2026-05-19 05:12:07.730','2026-05-19 05:12:36.861','2026-05-19 05:10:35.400'),('cmpc6cr6100c9qb00xhs7i7j4','Batch 4 (Products 61 - 80)','done',4,20,20,20,0,'[\"[11:13:14] 🚀 Starting: Batch 4 (Products 61 - 80)\",\"[11:13:14] Fetching category map from WooCommerce...\",\"[11:13:14] ✔️ 144 categories cached.\",\"[11:13:14] Fetching page 4 from WooCommerce (20 per page)...\",\"[11:13:21] ✔️ Fetched 20 products.\",\"[11:13:21] ⬇️ Processing \\\"COSRX The Alpha Arbutin 2 Discoloration Care Serum 50ml\\\" (ID: 55108)\",\"[11:13:21]   🖼️ Downloading main image...\",\"[11:13:21]   ✔️ Main image saved.\",\"[11:13:21]   🛠️ Creating core product record...\",\"[11:13:21] ✅ Completed \\\"COSRX The Alpha Arbutin 2 Discoloration Care Serum 50ml\\\". Status: created\",\"[11:13:21] ⬇️ Processing \\\"W7 12 Hour HD Foundation 30ml\\\" (ID: 54989)\",\"[11:13:21]   🖼️ Downloading main image...\",\"[11:13:22]   ✔️ Main image saved.\",\"[11:13:22]   🛠️ Creating core product record...\",\"[11:13:22] ✅ Completed \\\"W7 12 Hour HD Foundation 30ml\\\". Status: created\",\"[11:13:22] ⬇️ Processing \\\"Lady Speed Stick Invisible Dry Power Anti Perspirant Deodorant Wild Freesia 39.6g\\\" (ID: 54945)\",\"[11:13:22]   🖼️ Downloading main image...\",\"[11:13:23]   ✔️ Main image saved.\",\"[11:13:23]   🛠️ Creating core product record...\",\"[11:13:23] ✅ Completed \\\"Lady Speed Stick Invisible Dry Power Anti Perspirant Deodorant Wild Freesia 39.6g\\\". Status: created\",\"[11:13:23] ⬇️ Processing \\\"Tretinoin Tretin 0.025% Cream 30g\\\" (ID: 54932)\",\"[11:13:23]   🖼️ Downloading main image...\",\"[11:13:23]   ✔️ Main image saved.\",\"[11:13:23]   🛠️ Creating core product record...\",\"[11:13:23] ✅ Completed \\\"Tretinoin Tretin 0.025% Cream 30g\\\". Status: created\",\"[11:13:23] ⬇️ Processing \\\"Vaseline Gluta Hya Serum Burst Lotion Smoothing Perfector 300ml\\\" (ID: 54927)\",\"[11:13:23]   🖼️ Downloading main image...\",\"[11:13:24]   ✔️ Main image saved.\",\"[11:13:24]   🛠️ Creating core product record...\",\"[11:13:24] ✅ Completed \\\"Vaseline Gluta Hya Serum Burst Lotion Smoothing Perfector 300ml\\\". Status: created\",\"[11:13:24] ⬇️ Processing \\\"Maybelline Super Stay Lumi-Matte Up To 30HR Wear Foundation with SPF16 35ml\\\" (ID: 54924)\",\"[11:13:24]   🖼️ Downloading main image...\",\"[11:13:25]   ✔️ Main image saved.\",\"[11:13:25]   🛠️ Creating core product record...\",\"[11:13:26] ✅ Completed \\\"Maybelline Super Stay Lumi-Matte Up To 30HR Wear Foundation with SPF16 35ml\\\". Status: created\",\"[11:13:26] ⬇️ Processing \\\"Dove Exfoliating Pomegranate Seeds & Shea Butter Scent Body Scrub 225ml\\\" (ID: 54919)\",\"[11:13:26]   🖼️ Downloading main image...\",\"[11:13:26]   ✔️ Main image saved.\",\"[11:13:26]   🛠️ Creating core product record...\",\"[11:13:26] ✅ Completed \\\"Dove Exfoliating Pomegranate Seeds & Shea Butter Scent Body Scrub 225ml\\\". Status: created\",\"[11:13:26] ⬇️ Processing \\\"Minimalist SPF 50 PA ++++ Sunscreen with Multi-Vitamins 50g\\\" (ID: 54913)\",\"[11:13:26]   🖼️ Downloading main image...\",\"[11:13:27]   ✔️ Main image saved.\",\"[11:13:27]   🛠️ Creating core product record...\",\"[11:13:27] ✅ Completed \\\"Minimalist SPF 50 PA ++++ Sunscreen with Multi-Vitamins 50g\\\". Status: created\",\"[11:13:27] ⬇️ Processing \\\"Pond\'s Light Moisturiser For Soft Glowing Skin (50ml)\\\" (ID: 54909)\",\"[11:13:27]   🖼️ Downloading main image...\",\"[11:13:29]   ✔️ Main image saved.\",\"[11:13:29]   🛠️ Creating core product record...\",\"[11:13:29] ✅ Completed \\\"Pond\'s Light Moisturiser For Soft Glowing Skin (50ml)\\\". Status: created\",\"[11:13:29] ⬇️ Processing \\\"DOT & KEY Vitamin C+E Super Bright Sunscreen SPF 50+ PA++++ –(80gm)\\\" (ID: 54905)\",\"[11:13:29]   🖼️ Downloading main image...\",\"[11:13:29]   ✔️ Main image saved.\",\"[11:13:29]   🛠️ Creating core product record...\",\"[11:13:29] ✅ Completed \\\"DOT & KEY Vitamin C+E Super Bright Sunscreen SPF 50+ PA++++ –(80gm)\\\". Status: created\",\"[11:13:29] ⬇️ Processing \\\"Nivea Refreshingly Soft Moisturizing Cream 100ml\\\" (ID: 54901)\",\"[11:13:29]   🖼️ Downloading main image...\",\"[11:13:30]   ✔️ Main image saved.\",\"[11:13:30]   🛠️ Creating core product record...\",\"[11:13:30] ✅ Completed \\\"Nivea Refreshingly Soft Moisturizing Cream 100ml\\\". Status: created\",\"[11:13:30] ⬇️ Processing \\\"Zayn & Myza Vitamin C Face Serum (30ml)\\\" (ID: 54897)\",\"[11:13:30]   🖼️ Downloading main image...\",\"[11:13:30]   ✔️ Main image saved.\",\"[11:13:30]   🛠️ Creating core product record...\",\"[11:13:30] ✅ Completed \\\"Zayn & Myza Vitamin C Face Serum (30ml)\\\". Status: created\",\"[11:13:30] ⬇️ Processing \\\"TRESemme Keratin Smooth Deep Smoothing Mask with Hydrolysed Keratin for 72Hrs Frizz Control 440ml\\\" (ID: 54893)\",\"[11:13:30]   🖼️ Downloading main image...\",\"[11:13:32]   ✔️ Main image saved.\",\"[11:13:32]   🛠️ Creating core product record...\",\"[11:13:32] ✅ Completed \\\"TRESemme Keratin Smooth Deep Smoothing Mask with Hydrolysed Keratin for 72Hrs Frizz Control 440ml\\\". Status: created\",\"[11:13:32] ⬇️ Processing \\\"Olay Night Cream: Natural White 7 in 1 Night Cream (50g)\\\" (ID: 54887)\",\"[11:13:32]   🖼️ Downloading main image...\",\"[11:13:32]   ✔️ Main image saved.\",\"[11:13:32]   🛠️ Creating core product record...\",\"[11:13:32] ✅ Completed \\\"Olay Night Cream: Natural White 7 in 1 Night Cream (50g)\\\". Status: created\",\"[11:13:32] ⬇️ Processing \\\"Mistine Acne Clear Facial Foam (100gm)\\\" (ID: 54882)\",\"[11:13:32]   🖼️ Downloading main image...\",\"[11:13:33]   ✔️ Main image saved.\",\"[11:13:33]   🛠️ Creating core product record...\",\"[11:13:33] ✅ Completed \\\"Mistine Acne Clear Facial Foam (100gm)\\\". Status: created\",\"[11:13:33] ⬇️ Processing \\\"The Derma Co 10% Niacinamide Serum For Fades Acne Marks & Dark Spots 30ml\\\" (ID: 54874)\",\"[11:13:33]   🖼️ Downloading main image...\",\"[11:13:35]   ✔️ Main image saved.\",\"[11:13:35]   🛠️ Creating core product record...\",\"[11:13:35] ✅ Completed \\\"The Derma Co 10% Niacinamide Serum For Fades Acne Marks & Dark Spots 30ml\\\". Status: created\",\"[11:13:35] ⬇️ Processing \\\"Simple Water Boost Micellar Facial Gel Wash For Dry Or Dehydrated skin 150ml\\\" (ID: 54870)\",\"[11:13:35]   🖼️ Downloading main image...\",\"[11:13:36]   ✔️ Main image saved.\",\"[11:13:36]   🛠️ Creating core product record...\",\"[11:13:36] ✅ Completed \\\"Simple Water Boost Micellar Facial Gel Wash For Dry Or Dehydrated skin 150ml\\\". Status: created\",\"[11:13:36] ⬇️ Processing \\\"The Ordinary Alpha Arbutin 2% + Ha 60ml | New Updated Version\\\" (ID: 54866)\",\"[11:13:36]   🖼️ Downloading main image...\",\"[11:13:36]   ✔️ Main image saved.\",\"[11:13:36]   🛠️ Creating core product record...\",\"[11:13:36] ✅ Completed \\\"The Ordinary Alpha Arbutin 2% + Ha 60ml | New Updated Version\\\". Status: created\",\"[11:13:36] ⬇️ Processing \\\"Dot & Key Vitamin C + E Sunscreen, SPF 50+ PA++++ 80g\\\" (ID: 54863)\",\"[11:13:36]   🖼️ Downloading main image...\",\"[11:13:37]   ✔️ Main image saved.\",\"[11:13:37]   🛠️ Creating core product record...\",\"[11:13:37] ✅ Completed \\\"Dot & Key Vitamin C + E Sunscreen, SPF 50+ PA++++ 80g\\\". Status: created\",\"[11:13:37] ⬇️ Processing \\\"Garnier SkinActive Vitamin C Glow Boost Serum for Tired and Dull Skin 30ml\\\" (ID: 54859)\",\"[11:13:37]   🖼️ Downloading main image...\",\"[11:13:38]   ✔️ Main image saved.\",\"[11:13:38]   🛠️ Creating core product record...\",\"[11:13:38] ✅ Completed \\\"Garnier SkinActive Vitamin C Glow Boost Serum for Tired and Dull Skin 30ml\\\". Status: created\",\"[11:13:38] ✅ Task complete! Imported: 20, Failed: 0\"]','2026-05-19 05:13:14.227','2026-05-19 05:13:38.356','2026-05-19 05:10:35.400'),('cmpc6cr6100caqb004n1jmvio','Batch 5 (Products 81 - 100)','done',5,20,20,20,0,'[\"[11:13:38] 🚀 Starting: Batch 5 (Products 81 - 100)\",\"[11:13:38] Fetching category map from WooCommerce...\",\"[11:13:38] ✔️ 144 categories cached.\",\"[11:13:38] Fetching page 5 from WooCommerce (20 per page)...\",\"[11:13:40] ✔️ Fetched 20 products.\",\"[11:13:40] ⬇️ Processing \\\"Maybelline Super Stay Matte Ink Liquid Lipstick 5ml\\\" (ID: 54850)\",\"[11:13:40]   🖼️ Downloading main image...\",\"[11:13:40]   ✔️ Main image saved.\",\"[11:13:40]   🛠️ Creating core product record...\",\"[11:13:40] ✅ Completed \\\"Maybelline Super Stay Matte Ink Liquid Lipstick 5ml\\\". Status: created\",\"[11:13:40] ⬇️ Processing \\\"Laikou Japan Sakura Sunscreen SPF50 PA+++ (50g)\\\" (ID: 54847)\",\"[11:13:40]   🖼️ Downloading main image...\",\"[11:13:41]   ✔️ Main image saved.\",\"[11:13:41]   🛠️ Creating core product record...\",\"[11:13:41] ✅ Completed \\\"Laikou Japan Sakura Sunscreen SPF50 PA+++ (50g)\\\". Status: created\",\"[11:13:41] ⬇️ Processing \\\"Lafz Essential Onion And Black Seed Hair Oil\\\" (ID: 54840)\",\"[11:13:41]   🖼️ Downloading main image...\",\"[11:13:43]   ✔️ Main image saved.\",\"[11:13:43]   🛠️ Creating core product record...\",\"[11:13:43]   ⚙️ Fetching variations from WooCommerce...\",\"[11:13:44]   ⚙️ Processing 3 variations...\",\"[11:13:45] ✅ Completed \\\"Lafz Essential Onion And Black Seed Hair Oil\\\". Status: created\",\"[11:13:45] ⬇️ Processing \\\"Joya Sanitary Napkin Extra Heavy Flow Wings 8 Pads Pack Buy 1 Get 1\\\" (ID: 54836)\",\"[11:13:45]   🖼️ Downloading main image...\",\"[11:13:46]   ✔️ Main image saved.\",\"[11:13:46]   🛠️ Creating core product record...\",\"[11:13:46] ✅ Completed \\\"Joya Sanitary Napkin Extra Heavy Flow Wings 8 Pads Pack Buy 1 Get 1\\\". Status: created\",\"[11:13:46] ⬇️ Processing \\\"The Derma Co Pore Minimizing Face Serum with 4% Niacinamide, 5% PHA and p-REFINYL® 30ml\\\" (ID: 54819)\",\"[11:13:46]   🖼️ Downloading main image...\",\"[11:13:47]   ✔️ Main image saved.\",\"[11:13:47]   🖼️ Downloading 1 gallery images...\",\"[11:13:47]   ✔️ Gallery images saved.\",\"[11:13:47]   🛠️ Creating core product record...\",\"[11:13:47] ✅ Completed \\\"The Derma Co Pore Minimizing Face Serum with 4% Niacinamide, 5% PHA and p-REFINYL® 30ml\\\". Status: created\",\"[11:13:47] ⬇️ Processing \\\"Innsaei Low pH Daily Gel Cleanser 5.5 (150ml)\\\" (ID: 54828)\",\"[11:13:47]   🖼️ Downloading main image...\",\"[11:13:48]   ✔️ Main image saved.\",\"[11:13:48]   🛠️ Creating core product record...\",\"[11:13:48] ✅ Completed \\\"Innsaei Low pH Daily Gel Cleanser 5.5 (150ml)\\\". Status: created\",\"[11:13:48] ⬇️ Processing \\\"YC Whitening Face Wash With Lemon Extract (50ml)\\\" (ID: 54816)\",\"[11:13:48]   🖼️ Downloading main image...\",\"[11:13:49]   ✔️ Main image saved.\",\"[11:13:49]   🛠️ Creating core product record...\",\"[11:13:49] ✅ Completed \\\"YC Whitening Face Wash With Lemon Extract (50ml)\\\". Status: created\",\"[11:13:49] ⬇️ Processing \\\"The Derma Co 1% Hyaluronic Sunscreen Aqua Ultra Light Gel with SPF50 PA++++ 50g\\\" (ID: 54783)\",\"[11:13:49]   🖼️ Downloading main image...\",\"[11:13:49]   ✔️ Main image saved.\",\"[11:13:49]   🛠️ Creating core product record...\",\"[11:13:49] ✅ Completed \\\"The Derma Co 1% Hyaluronic Sunscreen Aqua Ultra Light Gel with SPF50 PA++++ 50g\\\". Status: created\",\"[11:13:49] ⬇️ Processing \\\"Kodomo Baby Lotion 180ml\\\" (ID: 54773)\",\"[11:13:49]   🖼️ Downloading main image...\",\"[11:13:50]   ✔️ Main image saved.\",\"[11:13:50]   🛠️ Creating core product record...\",\"[11:13:50] ✅ Completed \\\"Kodomo Baby Lotion 180ml\\\". Status: created\",\"[11:13:50] ⬇️ Processing \\\"Simple Kind To Skin Hydrating Light Moisturiser 125ml\\\" (ID: 54767)\",\"[11:13:50]   🖼️ Downloading main image...\",\"[11:13:51]   ✔️ Main image saved.\",\"[11:13:51]   🛠️ Creating core product record...\",\"[11:13:51] ✅ Completed \\\"Simple Kind To Skin Hydrating Light Moisturiser 125ml\\\". Status: created\",\"[11:13:51] ⬇️ Processing \\\"Tretinoin Tretin 0.05% Cream 30g\\\" (ID: 54759)\",\"[11:13:51]   🖼️ Downloading main image...\",\"[11:13:51]   ✔️ Main image saved.\",\"[11:13:51]   🛠️ Creating core product record...\",\"[11:13:51] ✅ Completed \\\"Tretinoin Tretin 0.05% Cream 30g\\\". Status: created\",\"[11:13:51] ⬇️ Processing \\\"Simple Kind to Skin Refreshing Facial Gel Wash 150ml NEW\\\" (ID: 54756)\",\"[11:13:51]   🖼️ Downloading main image...\",\"[11:13:51]   ✔️ Main image saved.\",\"[11:13:51]   🛠️ Creating core product record...\",\"[11:13:51] ✅ Completed \\\"Simple Kind to Skin Refreshing Facial Gel Wash 150ml NEW\\\". Status: created\",\"[11:13:51] ⬇️ Processing \\\"Dot & Key Vitamin C + E Sunscreen SPF 50+ PA++++ 50g\\\" (ID: 54749)\",\"[11:13:51]   🖼️ Downloading main image...\",\"[11:13:52]   ✔️ Main image saved.\",\"[11:13:52]   🛠️ Creating core product record...\",\"[11:13:52] ✅ Completed \\\"Dot & Key Vitamin C + E Sunscreen SPF 50+ PA++++ 50g\\\". Status: created\",\"[11:13:52] ⬇️ Processing \\\"POND\'S Hydra Miracle Super Light Gel with Cica Hyamino 100ml\\\" (ID: 54744)\",\"[11:13:52]   🖼️ Downloading main image...\",\"[11:13:53]   ✔️ Main image saved.\",\"[11:13:53]   🛠️ Creating core product record...\",\"[11:13:53] ✅ Completed \\\"POND\'S Hydra Miracle Super Light Gel with Cica Hyamino 100ml\\\". Status: created\",\"[11:13:53] ⬇️ Processing \\\"Kojie San Skin Lightening Kojic Acid Soap 3x 65g (Pack of 3)\\\" (ID: 54740)\",\"[11:13:53]   🖼️ Downloading main image...\",\"[11:13:54]   ✔️ Main image saved.\",\"[11:13:54]   🛠️ Creating core product record...\",\"[11:13:54] ✅ Completed \\\"Kojie San Skin Lightening Kojic Acid Soap 3x 65g (Pack of 3)\\\". Status: created\",\"[11:13:54] ⬇️ Processing \\\"Lafz Onion Seed Oil Shampoo (200ml)\\\" (ID: 54732)\",\"[11:13:54]   🖼️ Downloading main image...\",\"[11:13:55]   ✔️ Main image saved.\",\"[11:13:55]   🛠️ Creating core product record...\",\"[11:13:55] ✅ Completed \\\"Lafz Onion Seed Oil Shampoo (200ml)\\\". Status: created\",\"[11:13:55] ⬇️ Processing \\\"YC Whitening Face Wash Milk Extract (50ml)\\\" (ID: 54716)\",\"[11:13:55]   🖼️ Downloading main image...\",\"[11:13:55]   ✔️ Main image saved.\",\"[11:13:55]   🛠️ Creating core product record...\",\"[11:13:55] ✅ Completed \\\"YC Whitening Face Wash Milk Extract (50ml)\\\". Status: created\",\"[11:13:55] ⬇️ Processing \\\"Maybelline Fit Me Matte + Poreless Liquid Foundation 16H Oil Control with SPF 22, 30ml\\\" (ID: 54698)\",\"[11:13:55]   🖼️ Downloading main image...\",\"[11:13:56]   ✔️ Main image saved.\",\"[11:13:56]   🛠️ Creating core product record...\",\"[11:13:56] ✅ Completed \\\"Maybelline Fit Me Matte + Poreless Liquid Foundation 16H Oil Control with SPF 22, 30ml\\\". Status: created\",\"[11:13:56] ⬇️ Processing \\\"Veet Hair Removal Cream Normal Skin (100gm)\\\" (ID: 54692)\",\"[11:13:56]   🖼️ Downloading main image...\",\"[11:13:58]   ✔️ Main image saved.\",\"[11:13:58]   🛠️ Creating core product record...\",\"[11:13:58] ✅ Completed \\\"Veet Hair Removal Cream Normal Skin (100gm)\\\". Status: created\",\"[11:13:58] ⬇️ Processing \\\"Vaseline Lip Therapy Original Lip Balm 4.8g\\\" (ID: 54689)\",\"[11:13:58]   🖼️ Downloading main image...\",\"[11:13:59]   ✔️ Main image saved.\",\"[11:13:59]   🛠️ Creating core product record...\",\"[11:13:59] ✅ Completed \\\"Vaseline Lip Therapy Original Lip Balm 4.8g\\\". Status: created\",\"[11:13:59] ✅ Task complete! Imported: 20, Failed: 0\"]','2026-05-19 05:13:38.360','2026-05-19 05:13:59.500','2026-05-19 05:10:35.400'),('cmpc6cr6100cbqb00u8acg98n','Batch 6 (Products 101 - 120)','done',6,20,20,20,0,'[\"[11:13:59] 🚀 Starting: Batch 6 (Products 101 - 120)\",\"[11:13:59] Fetching category map from WooCommerce...\",\"[11:13:59] ✔️ 144 categories cached.\",\"[11:13:59] Fetching page 6 from WooCommerce (20 per page)...\",\"[11:14:02] ✔️ Fetched 20 products.\",\"[11:14:02] ⬇️ Processing \\\"Dove Exfoliating Pomegranate Seeds & Shea Butter Scent Body Scrub 225ml\\\" (ID: 54686)\",\"[11:14:02]   🖼️ Downloading main image...\",\"[11:14:02]   ❌ Main image download failed: source: bad seek to 17983\\nsource: bad seek to 17965\\nsource: bad seek to 17956\\nsource: bad seek to 17952\\nheif: Invalid input: Unspecified: Bitstream not supported by this decoder (2.0)\",\"[11:14:02]   🛠️ Creating core product record...\",\"[11:14:02] ✅ Completed \\\"Dove Exfoliating Pomegranate Seeds & Shea Butter Scent Body Scrub 225ml\\\". Status: created\",\"[11:14:02] ⬇️ Processing \\\"L’Oréal Paris Elvive Hydra Pure 72h Purifying Shampoo 400ml\\\" (ID: 54678)\",\"[11:14:02]   🖼️ Downloading main image...\",\"[11:14:03]   ✔️ Main image saved.\",\"[11:14:03]   🛠️ Creating core product record...\",\"[11:14:03] ✅ Completed \\\"L’Oréal Paris Elvive Hydra Pure 72h Purifying Shampoo 400ml\\\". Status: created\",\"[11:14:03] ⬇️ Processing \\\"Avene Cicalfat + Restorative Protective Cream 40ml\\\" (ID: 54669)\",\"[11:14:03]   🖼️ Downloading main image...\",\"[11:14:04]   ✔️ Main image saved.\",\"[11:14:04]   🛠️ Creating core product record...\",\"[11:14:04] ✅ Completed \\\"Avene Cicalfat + Restorative Protective Cream 40ml\\\". Status: created\",\"[11:14:04] ⬇️ Processing \\\"W.Dressroom Moisturizing Perfume Hand Cream #97 April Cotton 20ml\\\" (ID: 54663)\",\"[11:14:04]   🖼️ Downloading main image...\",\"[11:14:05]   ✔️ Main image saved.\",\"[11:14:05]   🛠️ Creating core product record...\",\"[11:14:05] ✅ Completed \\\"W.Dressroom Moisturizing Perfume Hand Cream #97 April Cotton 20ml\\\". Status: created\",\"[11:14:05] ⬇️ Processing \\\"W.Dressroom No.09 Gogo Mango Dress & Living Clear Perfume 70ml\\\" (ID: 54660)\",\"[11:14:05]   🖼️ Downloading main image...\",\"[11:14:05]   ✔️ Main image saved.\",\"[11:14:05]   🛠️ Creating core product record...\",\"[11:14:05] ✅ Completed \\\"W.Dressroom No.09 Gogo Mango Dress & Living Clear Perfume 70ml\\\". Status: created\",\"[11:14:05] ⬇️ Processing \\\"APLB Tranexamic Acid Niacinamide Body Lotion – 300 ml\\\" (ID: 54630)\",\"[11:14:05]   🖼️ Downloading main image...\",\"[11:14:06]   ✔️ Main image saved.\",\"[11:14:06]   🛠️ Creating core product record...\",\"[11:14:06] ✅ Completed \\\"APLB Tranexamic Acid Niacinamide Body Lotion – 300 ml\\\". Status: created\",\"[11:14:06] ⬇️ Processing \\\"OMI Sun Bears Active Protect Milk Sunscreen SPF 50+ PA++++ 30g\\\" (ID: 54607)\",\"[11:14:06]   🖼️ Downloading main image...\",\"[11:14:08]   ✔️ Main image saved.\",\"[11:14:08]   🛠️ Creating core product record...\",\"[11:14:08] ✅ Completed \\\"OMI Sun Bears Active Protect Milk Sunscreen SPF 50+ PA++++ 30g\\\". Status: created\",\"[11:14:08] ⬇️ Processing \\\"APLB Glutathione Niacinamide Skin care 4 types Sachet\\\" (ID: 54600)\",\"[11:14:08]   🖼️ Downloading main image...\",\"[11:14:10]   ✔️ Main image saved.\",\"[11:14:10]   🛠️ Creating core product record...\",\"[11:14:10] ✅ Completed \\\"APLB Glutathione Niacinamide Skin care 4 types Sachet\\\". Status: created\",\"[11:14:10] ⬇️ Processing \\\"Medicube Zero Pore Moisture Sun Serum SPF50+ Pa++++50ml\\\" (ID: 54517)\",\"[11:14:10]   🖼️ Downloading main image...\",\"[11:14:11]   ✔️ Main image saved.\",\"[11:14:11]   🛠️ Creating core product record...\",\"[11:14:11] ✅ Completed \\\"Medicube Zero Pore Moisture Sun Serum SPF50+ Pa++++50ml\\\". Status: created\",\"[11:14:11] ⬇️ Processing \\\"WishCare AHA + BHA Body Lotion 200ml\\\" (ID: 54501)\",\"[11:14:11]   🖼️ Downloading main image...\",\"[11:14:11]   ✔️ Main image saved.\",\"[11:14:11]   🛠️ Creating core product record...\",\"[11:14:11] ✅ Completed \\\"WishCare AHA + BHA Body Lotion 200ml\\\". Status: created\",\"[11:14:11] ⬇️ Processing \\\"Dot & Key Vitamin C + E Super Bright Gel Face Wash 100ml\\\" (ID: 54503)\",\"[11:14:11]   🖼️ Downloading main image...\",\"[11:14:12]   ✔️ Main image saved.\",\"[11:14:12]   🛠️ Creating core product record...\",\"[11:14:12] ✅ Completed \\\"Dot & Key Vitamin C + E Super Bright Gel Face Wash 100ml\\\". Status: created\",\"[11:14:12] ⬇️ Processing \\\"Chemist at Play Daily Exfoliating Body Wash AHA BHA Vitamin E 236ml\\\" (ID: 54496)\",\"[11:14:12]   🖼️ Downloading main image...\",\"[11:14:14]   ✔️ Main image saved.\",\"[11:14:14]   🛠️ Creating core product record...\",\"[11:14:14] ✅ Completed \\\"Chemist at Play Daily Exfoliating Body Wash AHA BHA Vitamin E 236ml\\\". Status: created\",\"[11:14:14] ⬇️ Processing \\\"Fixderma Salyzap Body Wash For Body Acne 100ml\\\" (ID: 54481)\",\"[11:14:14]   🖼️ Downloading main image...\",\"[11:14:14]   ✔️ Main image saved.\",\"[11:14:14]   🛠️ Creating core product record...\",\"[11:14:14] ✅ Completed \\\"Fixderma Salyzap Body Wash For Body Acne 100ml\\\". Status: created\",\"[11:14:14] ⬇️ Processing \\\"Fixderma Moisturizing Cream 60gm\\\" (ID: 54477)\",\"[11:14:14]   🖼️ Downloading main image...\",\"[11:14:15]   ✔️ Main image saved.\",\"[11:14:15]   🛠️ Creating core product record...\",\"[11:14:15] ✅ Completed \\\"Fixderma Moisturizing Cream 60gm\\\". Status: created\",\"[11:14:15] ⬇️ Processing \\\"Fixderma Moisturizing Lotion 150gm\\\" (ID: 54474)\",\"[11:14:15]   🖼️ Downloading main image...\",\"[11:14:16]   ✔️ Main image saved.\",\"[11:14:16]   🛠️ Creating core product record...\",\"[11:14:16] ✅ Completed \\\"Fixderma Moisturizing Lotion 150gm\\\". Status: created\",\"[11:14:16] ⬇️ Processing \\\"Fixderma Skarfix TX De Pigmentation & Brightening Face Serum (30ml)\\\" (ID: 54470)\",\"[11:14:16]   🖼️ Downloading main image...\",\"[11:14:17]   ✔️ Main image saved.\",\"[11:14:17]   🛠️ Creating core product record...\",\"[11:14:17] ✅ Completed \\\"Fixderma Skarfix TX De Pigmentation & Brightening Face Serum (30ml)\\\". Status: created\",\"[11:14:17] ⬇️ Processing \\\"ANUA PDRN 100 Hyaluronic Acid Glow Pad (60 Pads) 180 ml\\\" (ID: 54399)\",\"[11:14:17]   🖼️ Downloading main image...\",\"[11:14:18]   ✔️ Main image saved.\",\"[11:14:18]   🛠️ Creating core product record...\",\"[11:14:18] ✅ Completed \\\"ANUA PDRN 100 Hyaluronic Acid Glow Pad (60 Pads) 180 ml\\\". Status: created\",\"[11:14:18] ⬇️ Processing \\\"Anua Heartleaf Silky Moisture Sun Cream SPF 50+ PA++++ 50ml\\\" (ID: 54373)\",\"[11:14:18]   🖼️ Downloading main image...\",\"[11:14:19]   ✔️ Main image saved.\",\"[11:14:19]   🛠️ Creating core product record...\",\"[11:14:19] ✅ Completed \\\"Anua Heartleaf Silky Moisture Sun Cream SPF 50+ PA++++ 50ml\\\". Status: created\",\"[11:14:19] ⬇️ Processing \\\"ANUA Heartleaf Centella Red Spot Cream - 30ml\\\" (ID: 54357)\",\"[11:14:19]   🖼️ Downloading main image...\",\"[11:14:20]   ✔️ Main image saved.\",\"[11:14:20]   🛠️ Creating core product record...\",\"[11:14:20] ✅ Completed \\\"ANUA Heartleaf Centella Red Spot Cream - 30ml\\\". Status: created\",\"[11:14:20] ⬇️ Processing \\\"Anua Heartleaf 77 Clear Pad 70ea 160ml\\\" (ID: 54346)\",\"[11:14:20]   🖼️ Downloading main image...\",\"[11:14:21]   ✔️ Main image saved.\",\"[11:14:21]   🛠️ Creating core product record...\",\"[11:14:21] ✅ Completed \\\"Anua Heartleaf 77 Clear Pad 70ea 160ml\\\". Status: created\",\"[11:14:21] ✅ Task complete! Imported: 20, Failed: 0\"]','2026-05-19 05:13:59.504','2026-05-19 05:14:21.590','2026-05-19 05:10:35.400'),('cmpc6cr6100ccqb00r2wrgd6n','Batch 7 (Products 121 - 140)','pending',7,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:35.400'),('cmpc6cr6100cdqb00e5ln5frg','Batch 8 (Products 141 - 160)','pending',8,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:35.400'),('cmpc6cr6100ceqb00t1f5t6fd','Batch 9 (Products 161 - 180)','pending',9,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:35.400'),('cmpc6cr6100cfqb00m8ib3ynb','Batch 10 (Products 181 - 200)','pending',10,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:35.400'),('cmpc6cr6100cgqb00c8jyz5x7','Batch 11 (Products 201 - 220)','pending',11,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:35.400'),('cmpc6cr6100chqb00yjpw6wh6','Batch 12 (Products 221 - 240)','pending',12,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:35.400'),('cmpc6cr6100ciqb00c911cbpc','Batch 13 (Products 241 - 260)','pending',13,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:35.400'),('cmpc6cr6100cjqb00cyrw3puz','Batch 14 (Products 261 - 280)','pending',14,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:35.400'),('cmpc6cr6100ckqb009alghw87','Batch 15 (Products 281 - 300)','pending',15,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:35.400'),('cmpc6cr6200clqb00psaj65bg','Batch 16 (Products 301 - 320)','pending',16,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:35.400'),('cmpc6cr6200cmqb007b9rp7m1','Batch 17 (Products 321 - 340)','pending',17,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:35.400'),('cmpc6cr6200cnqb00q76nnbzz','Batch 18 (Products 341 - 360)','pending',18,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:35.400'),('cmpc6cr6200coqb00kpo7dxgc','Batch 19 (Products 361 - 380)','pending',19,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:35.400'),('cmpc6cr6200cpqb009ksapgsy','Batch 20 (Products 381 - 400)','pending',20,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:35.400'),('cmpc6cr6200cqqb000k814vu3','Batch 21 (Products 401 - 420)','pending',21,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:35.400'),('cmpc6cr6200crqb00vg6nr8vq','Batch 22 (Products 421 - 440)','pending',22,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:35.400'),('cmpc6cr6200csqb00zyhffb98','Batch 23 (Products 441 - 460)','pending',23,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:35.400'),('cmpc6cr6200ctqb00oahfliuz','Batch 24 (Products 461 - 480)','pending',24,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:35.400'),('cmpc6cr6200cuqb001tch9c8n','Batch 25 (Products 481 - 500)','pending',25,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:35.400'),('cmpc6cr6200cvqb00gy5gx7y1','Batch 26 (Products 501 - 520)','pending',26,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:35.400'),('cmpc6cr6200cwqb00fomm5yx3','Batch 27 (Products 521 - 540)','pending',27,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:35.400'),('cmpc6cr6200cxqb00eyp9iytg','Batch 28 (Products 541 - 560)','pending',28,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:35.400'),('cmpc6cr6200cyqb00eba1vq50','Batch 29 (Products 561 - 580)','pending',29,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:35.400'),('cmpc6cr6200czqb00vian5tuw','Batch 30 (Products 581 - 600)','pending',30,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:35.400'),('cmpc6cr6200d0qb00yj96w4m9','Batch 31 (Products 601 - 620)','pending',31,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:35.400'),('cmpc6cr6200d1qb00n1i4px3u','Batch 32 (Products 621 - 640)','pending',32,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:35.400'),('cmpc6cr6200d2qb00wn1623q3','Batch 33 (Products 641 - 660)','pending',33,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:35.400'),('cmpc6cr6200d3qb00tak6x0p6','Batch 34 (Products 661 - 680)','pending',34,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:35.400'),('cmpc6cr6200d4qb00fk3g5568','Batch 35 (Products 681 - 700)','pending',35,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:35.400'),('cmpc6cr6200d5qb00yhbey5at','Batch 36 (Products 701 - 720)','pending',36,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:35.400'),('cmpc6cr6200d6qb00xa6dfqh6','Batch 37 (Products 721 - 740)','pending',37,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:35.400'),('cmpc6cr6200d7qb00vgkzn233','Batch 38 (Products 741 - 760)','pending',38,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:35.400'),('cmpc6cr6200d8qb00b8jd0kzb','Batch 39 (Products 761 - 780)','pending',39,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:35.400'),('cmpc6cr6200d9qb00fyj5jbzq','Batch 40 (Products 781 - 800)','pending',40,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:35.400'),('cmpc6cr6200daqb00icopp7hi','Batch 41 (Products 801 - 820)','pending',41,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:35.400'),('cmpc6cr6200dbqb00ck2cn8js','Batch 42 (Products 821 - 840)','pending',42,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:35.400'),('cmpc6cr6200dcqb00a6e29irr','Batch 43 (Products 841 - 860)','pending',43,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:35.400'),('cmpc6cr6200ddqb00r5kcko9z','Batch 44 (Products 861 - 880)','pending',44,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:35.400'),('cmpc6cr6200deqb00xlt4z0av','Batch 45 (Products 881 - 900)','pending',45,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:35.400'),('cmpc6cr6200dfqb00u4b25a1a','Batch 46 (Products 901 - 920)','pending',46,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:35.400'),('cmpc6cr6200dgqb007mpr1z8g','Batch 47 (Products 921 - 940)','pending',47,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:35.400'),('cmpc6cr6200dhqb00wamn7vho','Batch 48 (Products 941 - 960)','pending',48,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:35.400'),('cmpc6cr6200diqb00w2piq3be','Batch 49 (Products 961 - 980)','pending',49,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:35.400'),('cmpc6cr6200djqb0027snqrsf','Batch 50 (Products 981 - 1000)','pending',50,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:35.400'),('cmpc6cr6200dkqb00ufysbam2','Batch 51 (Products 1001 - 1020)','pending',51,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:35.400'),('cmpc6cr6200dlqb00uwnmkjtr','Batch 52 (Products 1021 - 1040)','pending',52,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:35.400'),('cmpc6cr6200dmqb00709butq7','Batch 53 (Products 1041 - 1060)','pending',53,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:35.400'),('cmpc6cr6200dnqb006u55o5qk','Batch 54 (Products 1061 - 1080)','pending',54,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:35.400'),('cmpc6cr6200doqb00b6ovly5r','Batch 55 (Products 1081 - 1100)','pending',55,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:35.400'),('cmpc6cr6200dpqb00d39tuo8u','Batch 56 (Products 1101 - 1120)','pending',56,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:35.400'),('cmpc6cr6200dqqb007cfcp6jx','Batch 57 (Products 1121 - 1140)','pending',57,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:35.400'),('cmpc6cr6200drqb0036duw08x','Batch 58 (Products 1141 - 1160)','pending',58,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:35.400'),('cmpc6cr6200dsqb00vmvvfupm','Batch 59 (Products 1161 - 1180)','pending',59,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:35.400'),('cmpc6cr6200dtqb00i6lsbg15','Batch 60 (Products 1181 - 1200)','pending',60,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:35.400'),('cmpc6cr6200duqb00ex3l0zmn','Batch 61 (Products 1201 - 1220)','pending',61,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:35.400'),('cmpc6cr6200dvqb00nt5utpn8','Batch 62 (Products 1221 - 1240)','pending',62,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:35.400'),('cmpc6cr6200dwqb006ucaemqr','Batch 63 (Products 1241 - 1260)','pending',63,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:35.400'),('cmpc6cr6200dxqb00321368xq','Batch 64 (Products 1261 - 1280)','pending',64,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:35.400'),('cmpc6cr6300dyqb00qoke8ihl','Batch 65 (Products 1281 - 1300)','pending',65,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:35.400'),('cmpc6cr6300dzqb00wvmk9lfd','Batch 66 (Products 1301 - 1320)','pending',66,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:35.400'),('cmpc6cr6300e0qb003tsxttdf','Batch 67 (Products 1321 - 1340)','pending',67,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:35.400'),('cmpc6cr6300e1qb00t8ebnhqg','Batch 68 (Products 1341 - 1360)','pending',68,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:35.400'),('cmpc6cr6300e2qb00319ihmcs','Batch 69 (Products 1361 - 1380)','pending',69,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:35.400'),('cmpc6cr6300e3qb003bws1phc','Batch 70 (Products 1381 - 1400)','pending',70,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:35.400'),('cmpc6cr6300e4qb00l5ulnre6','Batch 71 (Products 1401 - 1420)','pending',71,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:35.400'),('cmpc6cr6300e5qb00sjgp6scv','Batch 72 (Products 1421 - 1440)','pending',72,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:35.400'),('cmpc6cr6300e6qb005ed5flsg','Batch 73 (Products 1441 - 1460)','pending',73,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:35.400'),('cmpc6cr6300e7qb00o4n7xf5a','Batch 74 (Products 1461 - 1480)','pending',74,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:35.400'),('cmpc6cr6300e8qb005g7bo6bf','Batch 75 (Products 1481 - 1500)','pending',75,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:35.400'),('cmpc6cr6300e9qb00mmqsak22','Batch 76 (Products 1501 - 1520)','pending',76,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:35.400'),('cmpc6cr6300eaqb002ornbg27','Batch 77 (Products 1521 - 1540)','pending',77,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:35.400'),('cmpc6cr6300ebqb0048vlq7zj','Batch 78 (Products 1541 - 1560)','pending',78,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:35.400'),('cmpc6cr6300ecqb00jcnduu2t','Batch 79 (Products 1561 - 1580)','pending',79,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:35.400'),('cmpc6cr6300edqb00bb2p4woo','Batch 80 (Products 1581 - 1600)','pending',80,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:35.400'),('cmpc6cr6300eeqb00nknfyuuv','Batch 81 (Products 1601 - 1620)','pending',81,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:35.400'),('cmpc6cr6300efqb00w75nbh2t','Batch 82 (Products 1621 - 1640)','pending',82,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:35.400'),('cmpc6cr6300egqb00wvur1834','Batch 83 (Products 1641 - 1660)','pending',83,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:35.400'),('cmpc6cr6300ehqb00w0ot6joj','Batch 84 (Products 1661 - 1680)','pending',84,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:35.400'),('cmpc6cr6300eiqb00yrw4d0ym','Batch 85 (Products 1681 - 1700)','pending',85,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:35.400'),('cmpc6cr6300ejqb00mbwmuvuh','Batch 86 (Products 1701 - 1720)','pending',86,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:35.400'),('cmpc6cr6300ekqb00i9929q46','Batch 87 (Products 1721 - 1740)','pending',87,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:35.400'),('cmpc6cr6300elqb00jxxkr2um','Batch 88 (Products 1741 - 1760)','pending',88,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:35.400'),('cmpc6cr6300emqb00pmp9xcyt','Batch 89 (Products 1761 - 1780)','pending',89,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:35.400'),('cmpc6cr6300enqb005ecjh4q6','Batch 90 (Products 1781 - 1800)','pending',90,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:35.400'),('cmpc6cr6300eoqb00wt7q8ieq','Batch 91 (Products 1801 - 1820)','pending',91,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:35.400'),('cmpc6cr6300epqb00xbx9fo8b','Batch 92 (Products 1821 - 1840)','pending',92,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:35.400'),('cmpc6cr6300eqqb00v0nkq558','Batch 93 (Products 1841 - 1860)','pending',93,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:35.400'),('cmpc6cr6300erqb00cdpa6jbd','Batch 94 (Products 1861 - 1880)','pending',94,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:35.400'),('cmpc6cr6300esqb00q1w253tm','Batch 95 (Products 1881 - 1900)','pending',95,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:35.400'),('cmpc6cr6300etqb00wzpo5psv','Batch 96 (Products 1901 - 1920)','pending',96,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:35.400'),('cmpc6cr6300euqb00cz1gtzp1','Batch 97 (Products 1921 - 1940)','pending',97,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:35.400'),('cmpc6cr6300evqb00uv1ij9c2','Batch 98 (Products 1941 - 1960)','pending',98,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:35.400'),('cmpc6cr6300ewqb000ipjmm56','Batch 99 (Products 1961 - 1980)','pending',99,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:35.400'),('cmpc6cr6300exqb006l71cf7w','Batch 100 (Products 1981 - 2000)','pending',100,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:35.400'),('cmpc6cr6300eyqb00y83ocruj','Batch 101 (Products 2001 - 2020)','pending',101,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:35.400'),('cmpc6cr6300ezqb00d9lpg5r2','Batch 102 (Products 2021 - 2040)','pending',102,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:35.400'),('cmpc6cr6300f0qb003c5eypsh','Batch 103 (Products 2041 - 2060)','pending',103,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:35.400'),('cmpc6cr6300f1qb00tmot3rhx','Batch 104 (Products 2061 - 2080)','pending',104,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:35.400'),('cmpc6cr6300f2qb00q4yezdro','Batch 105 (Products 2081 - 2100)','pending',105,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:35.400'),('cmpc6cr6300f3qb0022ffjvo8','Batch 106 (Products 2101 - 2120)','pending',106,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:35.400'),('cmpc6cr6300f4qb00cv66u5fh','Batch 107 (Products 2121 - 2140)','pending',107,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:35.400'),('cmpc6cr6300f5qb009eb40pyr','Batch 108 (Products 2141 - 2160)','pending',108,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:35.400'),('cmpc6cr6300f6qb00fyrcinw5','Batch 109 (Products 2161 - 2180)','pending',109,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:35.400'),('cmpc6cr6300f7qb00od4n5lem','Batch 110 (Products 2181 - 2200)','pending',110,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:35.400'),('cmpc6cr6300f8qb00r9xvqtf9','Batch 111 (Products 2201 - 2220)','pending',111,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:35.400'),('cmpc6cr6300f9qb00tsl0u1da','Batch 112 (Products 2221 - 2240)','pending',112,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:35.400'),('cmpc6cr6300faqb00rz3yh3jm','Batch 113 (Products 2241 - 2260)','pending',113,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:35.400'),('cmpc6cr6300fbqb000mihog05','Batch 114 (Products 2261 - 2280)','pending',114,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:35.400'),('cmpc6cr6300fcqb0040qacee5','Batch 115 (Products 2281 - 2300)','pending',115,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:35.400'),('cmpc6cr6300fdqb00zzyg03qv','Batch 116 (Products 2301 - 2320)','pending',116,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:35.400'),('cmpc6cr6300feqb00erg7x39m','Batch 117 (Products 2321 - 2340)','pending',117,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:35.400'),('cmpc6cr6300ffqb008aa4mr0h','Batch 118 (Products 2341 - 2360)','pending',118,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:35.400'),('cmpc6cr6300fgqb00mkl8w221','Batch 119 (Products 2361 - 2380)','pending',119,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:35.400'),('cmpc6cr6300fhqb003quazoi0','Batch 120 (Products 2381 - 2400)','pending',120,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:35.400'),('cmpc6cr6300fiqb005q6bgmcw','Batch 121 (Products 2401 - 2420)','pending',121,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:35.400'),('cmpc6cr6300fjqb00es9pcc8n','Batch 122 (Products 2421 - 2440)','pending',122,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:35.400'),('cmpc6cr6300fkqb00yn2jxei3','Batch 123 (Products 2441 - 2460)','pending',123,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:35.400'),('cmpc6cr6300flqb00w7jb91zm','Batch 124 (Products 2461 - 2480)','pending',124,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:35.400'),('cmpc6cr6300fmqb00bda35254','Batch 125 (Products 2481 - 2500)','pending',125,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:35.400'),('cmpc6cr6300fnqb00xxxwgj6j','Batch 126 (Products 2501 - 2520)','pending',126,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:35.400'),('cmpc6cr6300foqb00lwyuugpf','Batch 127 (Products 2521 - 2540)','pending',127,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:35.400'),('cmpc6cr6300fpqb001899jbu4','Batch 128 (Products 2541 - 2560)','pending',128,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:35.400'),('cmpc6cr6300fqqb00a76tc0pq','Batch 129 (Products 2561 - 2580)','pending',129,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:35.400'),('cmpc6cr6300frqb008dbxi0qx','Batch 130 (Products 2581 - 2600)','pending',130,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:35.400'),('cmpc6cr6300fsqb00utvq9veb','Batch 131 (Products 2601 - 2620)','pending',131,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:35.400'),('cmpc6cr6300ftqb0025j4jku5','Batch 132 (Products 2621 - 2640)','pending',132,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:35.400'),('cmpc6cr6300fuqb004u5dipvl','Batch 133 (Products 2641 - 2660)','pending',133,20,20,0,0,'[]',NULL,NULL,'2026-05-19 05:10:35.400'),('cmpc6cr6300fvqb00fq1rd9vr','Batch 134 (Products 2661 - 2666)','pending',134,20,6,0,0,'[]',NULL,NULL,'2026-05-19 05:10:35.400');
/*!40000 ALTER TABLE `importtask` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `media`
--

DROP TABLE IF EXISTS `media`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `media` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `fileName` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `originalName` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `fileType` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'image/webp',
  `fileSize` int(11) NOT NULL,
  `altText` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `caption` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `width` int(11) DEFAULT NULL,
  `height` int(11) DEFAULT NULL,
  `urlThumbnail` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `urlMedium` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `urlFull` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `media`
--

LOCK TABLES `media` WRITE;
/*!40000 ALTER TABLE `media` DISABLE KEYS */;
INSERT INTO `media` VALUES ('cmpc6cn7o00buqb00nkkqycm8','mpc6cn4arfider.webp','Cerave-Hydrating-Cleanser-For-Normal-To-Dry-Skin-237m.jpg','image/webp',17292,'CeraVe Hydrating Cleanser for Normal to Dry Skin 237ml (USA Edition)','Cerave Hydrating Cleanser For Normal To Dry Skin 237m',NULL,NULL,900,900,'/uploads/media/thumb/mpc6cn4arfider-thumb.webp','/uploads/media/medium/mpc6cn4arfider-medium.webp','/uploads/media/full/mpc6cn4arfider-full.webp','2026-05-19 05:10:30.277','2026-05-19 05:10:30.277'),('cmpc6cog600byqb00hwfpkok5','mpc6cod52m7z4h.webp','Nivea-Soft-Moisturizing-Cream-100mlEU-1.jpg','image/webp',21378,'Nivea Soft Moisturizing Cream 100ml(EU)','Nivea Soft Moisturizing Cream 100mlEU 1',NULL,NULL,900,900,'/uploads/media/thumb/mpc6cod52m7z4h-thumb.webp','/uploads/media/medium/mpc6cod52m7z4h-medium.webp','/uploads/media/full/mpc6cod52m7z4h-full.webp','2026-05-19 05:10:31.879','2026-05-19 05:10:31.879'),('cmpc6cp1q00c2qb00mts0kl39','mpc6cozvpntk98.webp','Garnier-Bright-Complete-Vitamin-C-Booster-Serum-1.webp','image/webp',7980,'Garnier Bright Complete Vitamin C Booster Serum ','Garnier Bright Complete Vitamin C Booster Serum 1',NULL,NULL,500,500,'/uploads/media/thumb/mpc6cozvpntk98-thumb.webp','/uploads/media/medium/mpc6cozvpntk98-medium.webp','/uploads/media/full/mpc6cozvpntk98-full.webp','2026-05-19 05:10:32.655','2026-05-19 05:10:32.655'),('cmpc6cr9700fwqb00frhh3rh7','mpc6cr6ecidzxy.webp','Garnier-Bright-Complete-Vitamin-C-Booster-Serum-30ml.jpg','image/webp',13700,'Garnier Bright Complete Vitamin C Booster Serum','Garnier Bright Complete Vitamin C Booster Serum 30ml',NULL,NULL,900,900,'/uploads/media/thumb/mpc6cr6ecidzxy-thumb.webp','/uploads/media/medium/mpc6cr6ecidzxy-medium.webp','/uploads/media/full/mpc6cr6ecidzxy-full.webp','2026-05-19 05:10:35.515','2026-05-19 05:10:35.515'),('cmpc6crqq00g0qb00nfpg6r7s','mpc6crnpbf1d6b.webp','Garnier-Bright-Complete-Vitamin-C-Booster-Serum.jpg','image/webp',26160,'Garnier Bright Complete Vitamin C Booster Serum','Garnier Bright Complete Vitamin C Booster Serum',NULL,NULL,900,900,'/uploads/media/thumb/mpc6crnpbf1d6b-thumb.webp','/uploads/media/medium/mpc6crnpbf1d6b-medium.webp','/uploads/media/full/mpc6crnpbf1d6b-full.webp','2026-05-19 05:10:36.146','2026-05-19 05:10:36.146'),('cmpc6csyq00g4qb000epzg8jg','mpc6csvis0gx2j.webp','The-Derma-Co-Sali-Cinamide-Anti-Acne-Face-Wash-80ml.jpg','image/webp',29974,'The Derma Co Sali-Cinamide Anti-Acne Face Wash (80ml)','The Derma Co Sali Cinamide Anti Acne Face Wash 80ml',NULL,NULL,900,900,'/uploads/media/thumb/mpc6csvis0gx2j-thumb.webp','/uploads/media/medium/mpc6csvis0gx2j-medium.webp','/uploads/media/full/mpc6csvis0gx2j-full.webp','2026-05-19 05:10:37.730','2026-05-19 05:10:37.730'),('cmpc6ctr900g8qb00uq59bzjj','mpc6ctnle7zedc.webp','Nivea-Refreshingly-Soft-Moisturizing-Cream-egypt.webp','image/webp',36148,'Nivea Refreshingly Soft Moisturizing Cream (egypt)','Nivea Refreshingly Soft Moisturizing Cream egypt',NULL,NULL,1000,1000,'/uploads/media/thumb/mpc6ctnle7zedc-thumb.webp','/uploads/media/medium/mpc6ctnle7zedc-medium.webp','/uploads/media/full/mpc6ctnle7zedc-full.webp','2026-05-19 05:10:38.758','2026-05-19 05:10:38.758'),('cmpc6cvhu00gbqb00vbwoybcu','mpc6cvem95kxc3.webp','Nivea-Refreshingly-Soft-Moisturizing-Cream-egypt.jpg','image/webp',27790,'Nivea Refreshingly Soft Moisturizing Cream (egypt)','Nivea Refreshingly Soft Moisturizing Cream egypt',NULL,NULL,900,900,'/uploads/media/thumb/mpc6cvem95kxc3-thumb.webp','/uploads/media/medium/mpc6cvem95kxc3-medium.webp','/uploads/media/full/mpc6cvem95kxc3-full.webp','2026-05-19 05:10:41.010','2026-05-19 05:10:41.010'),('cmpc6cwc500gfqb00yunrxxnc','mpc6cw72hhfoj6.webp','Nivea-Refreshingly-Soft-Moisturizing-Cream-egypt-100ml.webp','image/webp',36818,'Nivea Refreshingly Soft Moisturizing Cream (egypt)','Nivea Refreshingly Soft Moisturizing Cream egypt 100ml',NULL,NULL,1200,1200,'/uploads/media/thumb/mpc6cw72hhfoj6-thumb.webp','/uploads/media/medium/mpc6cw72hhfoj6-medium.webp','/uploads/media/full/mpc6cw72hhfoj6-full.webp','2026-05-19 05:10:42.101','2026-05-19 05:10:42.101'),('cmpc6cwoa00gjqb0094v0s8dt','mpc6cwk0rhq2pg.webp','Dot-Key-Cica-Calming-Mattifying-Sunscreen-SPF-50-PA-80gm.jpg','image/webp',21528,'Dot & Key Cica Calming Mattifying Sunscreen SPF 50 PA++++ (80gm)','Dot Key Cica Calming Mattifying Sunscreen SPF 50 PA 80gm',NULL,NULL,1080,1080,'/uploads/media/thumb/mpc6cwk0rhq2pg-thumb.webp','/uploads/media/medium/mpc6cwk0rhq2pg-medium.webp','/uploads/media/full/mpc6cwk0rhq2pg-full.webp','2026-05-19 05:10:42.538','2026-05-19 05:10:42.538'),('cmpc6cxgf00gnqb00deppxzby','mpc6cxce89hsk5.webp','Dot-Key-CICA-Calming-Mattifying-Sunscreen-SPF-50-PA-50gm.png','image/webp',15024,'Dot & Key CICA Calming Mattifying Sunscreen SPF 50 PA++++ 50gm','Dot Key CICA Calming Mattifying Sunscreen SPF 50 PA 50gm',NULL,NULL,1080,1080,'/uploads/media/thumb/mpc6cxce89hsk5-thumb.webp','/uploads/media/medium/mpc6cxce89hsk5-medium.webp','/uploads/media/full/mpc6cxce89hsk5-full.webp','2026-05-19 05:10:43.551','2026-05-19 05:10:43.551'),('cmpc6cy1g00gqqb00ihcack64','mpc6cxz8jmxyg5.webp','Dot-Key-Strawberry-Dew-Tinted-Sunscreen-SPF-50-Dailly-Wear-05-Beige.webp','image/webp',8964,'Dot & Key Strawberry Dew Tinted Sunscreen SPF 50+ Dailly Wear - 05 Beige','Dot Key Strawberry Dew Tinted Sunscreen SPF 50 Dailly Wear 05 Beige',NULL,NULL,760,760,'/uploads/media/thumb/mpc6cxz8jmxyg5-thumb.webp','/uploads/media/medium/mpc6cxz8jmxyg5-medium.webp','/uploads/media/full/mpc6cxz8jmxyg5-full.webp','2026-05-19 05:10:44.308','2026-05-19 05:10:44.308'),('cmpc6czhd00gwqb00hudbcvbq','mpc6czfexsubim.webp','Loreal-Studio-Line-Xtreme-Hold-Indestructible-Hair-Gel-9-150ml.png','image/webp',9164,'Loreal Studio Line Xtreme Hold Indestructible Hair Gel 9 150ml','Loreal Studio Line Xtreme Hold Indestructible Hair Gel 9 150ml',NULL,NULL,470,470,'/uploads/media/thumb/mpc6czfexsubim-thumb.webp','/uploads/media/medium/mpc6czfexsubim-medium.webp','/uploads/media/full/mpc6czfexsubim-full.webp','2026-05-19 05:10:46.177','2026-05-19 05:10:46.177'),('cmpc6d3oe00hoqb00apjt0p48','mpc6d3lej4vg43.webp','Retinol-Night-Repair-Cream-with-Ceramides.webp','image/webp',24402,'Retinol Night Repair Cream with Ceramides','Retinol Night Repair Cream with Ceramides',NULL,NULL,700,700,'/uploads/media/thumb/mpc6d3lej4vg43-thumb.webp','/uploads/media/medium/mpc6d3lej4vg43-medium.webp','/uploads/media/full/mpc6d3lej4vg43-full.webp','2026-05-19 05:10:51.615','2026-05-19 05:10:51.615'),('cmpc6d5k200huqb00774qa7zc','mpc6d5fkgx3v82.webp','Dot-Key-Retinol-Night-Repair-Cream-with-Ceramides.jpg','image/webp',21170,'Dot-Key-Retinol-Night-Repair-Cream-with-Ceramides 15ml','Dot Key Retinol Night Repair Cream with Ceramides',NULL,NULL,874,1142,'/uploads/media/thumb/mpc6d5fkgx3v82-thumb.webp','/uploads/media/medium/mpc6d5fkgx3v82-medium.webp','/uploads/media/full/mpc6d5fkgx3v82-full.webp','2026-05-19 05:10:54.050','2026-05-19 05:10:54.050'),('cmpc6d5tm00hyqb00kdd6bh35','mpc6d5rb9yy98d.webp','Dot-Key-Watermelon-Refresh-Gel-Face-Wash-with-Vitamin-C-Cucumber-15ml.webp','image/webp',7526,'Dot & Key Watermelon Refresh Gel Face Wash with Vitamin C & Cucumber (15ml)','Dot Key Watermelon Refresh Gel Face Wash with Vitamin C Cucumber 15ml',NULL,NULL,800,800,'/uploads/media/thumb/mpc6d5rb9yy98d-thumb.webp','/uploads/media/medium/mpc6d5rb9yy98d-medium.webp','/uploads/media/full/mpc6d5rb9yy98d-full.webp','2026-05-19 05:10:54.394','2026-05-19 05:10:54.394'),('cmpc6d8e900i1qb00kddlm45m','mpc6d7x9szmmhm.webp','Dot-Key-Watermelon-Cooling-ICY-Gel-Moisturizer-60ml.png','image/webp',54398,'Dot & Key Watermelon Cooling ICY Gel Moisturizer (60ml)','Dot Key Watermelon Cooling ICY Gel Moisturizer 60ml',NULL,NULL,2526,2560,'/uploads/media/thumb/mpc6d7x9szmmhm-thumb.webp','/uploads/media/medium/mpc6d7x9szmmhm-medium.webp','/uploads/media/full/mpc6d7x9szmmhm-full.webp','2026-05-19 05:10:57.729','2026-05-19 05:10:57.729'),('cmpc6d9fq00i4qb00giw82e48','mpc6d9bt1hz8lr.webp','Minimalist-Salicylic-Acid-LHA-2-Cleanser-100ml.jpg','image/webp',14972,'Minimalist Salicylic Acid + LHA 2% Cleanser (100ml)','Minimalist Salicylic Acid LHA 2 Cleanser 100ml',NULL,NULL,900,900,'/uploads/media/thumb/mpc6d9bt1hz8lr-thumb.webp','/uploads/media/medium/mpc6d9bt1hz8lr-medium.webp','/uploads/media/full/mpc6d9bt1hz8lr-full.webp','2026-05-19 05:10:59.079','2026-05-19 05:10:59.079'),('cmpc6d9r400i8qb00r3oy8uom','mpc6d9ob97vb09.webp','Minimalist-Vitamin-B5-10-Moisturizer-50g-1.jpg','image/webp',13350,'Minimalist Vitamin B5 10% Moisturizer (50g)','Minimalist Vitamin B5 10 Moisturizer 50g 1',NULL,NULL,900,900,'/uploads/media/thumb/mpc6d9ob97vb09-thumb.webp','/uploads/media/medium/mpc6d9ob97vb09-medium.webp','/uploads/media/full/mpc6d9ob97vb09-full.webp','2026-05-19 05:10:59.488','2026-05-19 05:10:59.488'),('cmpc6da5e00ibqb002kcx5e91','mpc6d9yt3as1w8.webp','Minimalist-B12-Repair-Complex-5.5-Face-Moisturizer.avif','image/webp',15538,'Minimalist B12 + Repair Complex 5.5% Face Moisturizer','Minimalist B12 Repair Complex 5.5 Face Moisturizer',NULL,NULL,840,1260,'/uploads/media/thumb/mpc6d9yt3as1w8-thumb.webp','/uploads/media/medium/mpc6d9yt3as1w8-medium.webp','/uploads/media/full/mpc6d9yt3as1w8-full.webp','2026-05-19 05:11:00.002','2026-05-19 05:11:00.002'),('cmpc6dbk000ieqb005t09jdvy','mpc6dbccik6o2l.webp','Minimalist-B12-Repair-Complex-5.5-Face-Moisturizer-1.avif','image/webp',15538,'Minimalist B12 + Repair Complex 5.5% Face Moisturizer','Minimalist B12 Repair Complex 5.5 Face Moisturizer 1',NULL,NULL,840,1260,'/uploads/media/thumb/mpc6dbccik6o2l-thumb.webp','/uploads/media/medium/mpc6dbccik6o2l-medium.webp','/uploads/media/full/mpc6dbccik6o2l-full.webp','2026-05-19 05:11:01.824','2026-05-19 05:11:01.824'),('cmpc6dc1800iiqb0075yqtvk7','mpc6dbwthjv901.webp','Minimalist-B12-Repair-Complex-5.5-Face-Moisturizer2.webp','image/webp',13472,'Minimalist B12 + Repair Complex 5.5% Face Moisturizer','Minimalist B12 Repair Complex 5.5 Face Moisturizer2',NULL,NULL,1500,1500,'/uploads/media/thumb/mpc6dbwthjv901-thumb.webp','/uploads/media/medium/mpc6dbwthjv901-medium.webp','/uploads/media/full/mpc6dbwthjv901-full.webp','2026-05-19 05:11:02.445','2026-05-19 05:11:02.445'),('cmpc6dd9y00imqb00hv14o15c','mpc6dd6t9ujv03.webp','Minimalist-SPF-60-Sunscreen-with-Silymarin-50g.jpg','image/webp',23408,'Minimalist SPF 60 Sunscreen with Silymarin (50g)','Minimalist SPF 60 Sunscreen with Silymarin 50g',NULL,NULL,900,900,'/uploads/media/thumb/mpc6dd6t9ujv03-thumb.webp','/uploads/media/medium/mpc6dd6t9ujv03-medium.webp','/uploads/media/full/mpc6dd6t9ujv03-full.webp','2026-05-19 05:11:04.054','2026-05-19 05:11:04.054'),('cmpc6dedq00ipqb008nv1197d','mpc6deantlaijs.webp','Minimalist-AHA-BHA-10-Face-Exfoliator-30ml.jpg','image/webp',13444,'Minimalist AHA BHA 10% Face Exfoliator (30ml)','Minimalist AHA BHA 10 Face Exfoliator 30ml',NULL,NULL,900,900,'/uploads/media/thumb/mpc6deantlaijs-thumb.webp','/uploads/media/medium/mpc6deantlaijs-medium.webp','/uploads/media/full/mpc6deantlaijs-full.webp','2026-05-19 05:11:05.486','2026-05-19 05:11:05.486'),('cmpc6dfdu00isqb007uo3j24k','mpc6dfapgwhvn3.webp','Minimalist-Hyaluronic-PGA-2-Face-Serum-30ml.jpg','image/webp',16288,'Minimalist Hyaluronic + PGA 2% Face Serum 30ml','Minimalist Hyaluronic PGA 2 Face Serum 30ml',NULL,NULL,900,900,'/uploads/media/thumb/mpc6dfapgwhvn3-thumb.webp','/uploads/media/medium/mpc6dfapgwhvn3-medium.webp','/uploads/media/full/mpc6dfapgwhvn3-full.webp','2026-05-19 05:11:06.786','2026-05-19 05:11:06.786'),('cmpc6dg6000ivqb00zh3xvzd0','mpc6dg2ltg2mfn.webp','Minimalist-Tranexamic-3-Face-Serum-30ml.jpg','image/webp',13498,'Minimalist Tranexamic 3% Face Serum 30ml','Minimalist Tranexamic 3 Face Serum 30ml',NULL,NULL,900,900,'/uploads/media/thumb/mpc6dg2ltg2mfn-thumb.webp','/uploads/media/medium/mpc6dg2ltg2mfn-medium.webp','/uploads/media/full/mpc6dg2ltg2mfn-full.webp','2026-05-19 05:11:07.800','2026-05-19 05:11:07.800'),('cmpc6di5e00iyqb00hxfilvzk','mpc6di0qk1k15f.webp','Minimalist-Multi-Peptides-10-Face-Serum-30ml.webp','image/webp',35114,'Minimalist Multi-Peptides 10% Face Serum 30ml','Minimalist Multi Peptides 10 Face Serum 30ml',NULL,NULL,1486,1500,'/uploads/media/thumb/mpc6di0qk1k15f-thumb.webp','/uploads/media/medium/mpc6di0qk1k15f-medium.webp','/uploads/media/full/mpc6di0qk1k15f-full.webp','2026-05-19 05:11:10.371','2026-05-19 05:11:10.371'),('cmpc6dit300j1qb00gcjqp2d6','mpc6diox3lze96.webp','The-Derma-Co-15-AHA-1-BHA-Beginner-Face-Peeling-Solution-30ml.webp','image/webp',45382,'The Derma Co 15% AHA + 1% BHA Beginner Face Peeling Solution (30ml)','The Derma Co 15 AHA 1 BHA Beginner Face Peeling Solution 30ml',NULL,NULL,990,990,'/uploads/media/thumb/mpc6diox3lze96-thumb.webp','/uploads/media/medium/mpc6diox3lze96-medium.webp','/uploads/media/full/mpc6diox3lze96-full.webp','2026-05-19 05:11:11.223','2026-05-19 05:11:11.223'),('cmpc6djlh00j4qb00yq3vdzt9','mpc6djhyigp1tj.webp','The-Derma-Co-2-Salicylic-Acid-Face-Serum-30ml.jpg','image/webp',35110,'The Derma Co 2% Salicylic Acid Face Serum (30ml)','The Derma Co 2 Salicylic Acid Face Serum 30ml',NULL,NULL,1000,1000,'/uploads/media/thumb/mpc6djhyigp1tj-thumb.webp','/uploads/media/medium/mpc6djhyigp1tj-medium.webp','/uploads/media/full/mpc6djhyigp1tj-full.webp','2026-05-19 05:11:12.245','2026-05-19 05:11:12.245'),('cmpc6djvo00j7qb006a0ca8gl','mpc6djtgto2ion.webp','The-Derma-Co-2-Kojic-Acid-Face-Serum-30ml.webp','image/webp',9378,'The Derma Co 2% Kojic Acid Face Serum (30ml)','The Derma Co 2 Kojic Acid Face Serum 30ml',NULL,NULL,760,760,'/uploads/media/thumb/mpc6djtgto2ion-thumb.webp','/uploads/media/medium/mpc6djtgto2ion-medium.webp','/uploads/media/full/mpc6djtgto2ion-full.webp','2026-05-19 05:11:12.613','2026-05-19 05:11:12.613'),('cmpc6dkma00jaqb00bb9gjt7l','mpc6dkj4gakw8x.webp','Wishcare-AHA-BHA-Anti-Dandruff-Shampoo-250ml-1.jpg','image/webp',16640,'Wishcare AHA BHA Anti-Dandruff Shampoo 250ml','Wishcare AHA BHA Anti Dandruff Shampoo 250ml 1',NULL,NULL,1080,1080,'/uploads/media/thumb/mpc6dkj4gakw8x-thumb.webp','/uploads/media/medium/mpc6dkj4gakw8x-medium.webp','/uploads/media/full/mpc6dkj4gakw8x-full.webp','2026-05-19 05:11:13.571','2026-05-19 05:11:13.571'),('cmpc6dl2k00jeqb00ed7wtd4r','mpc6dkyv7mc9bu.webp','Multi-Vitamin-Brightening-Body-Lotion.webp','image/webp',15896,'WishCare Multi-Vitamin Brightening Body Lotion (200ml)','Multi Vitamin Brightening Body Lotion',NULL,NULL,1000,1000,'/uploads/media/thumb/mpc6dkyv7mc9bu-thumb.webp','/uploads/media/medium/mpc6dkyv7mc9bu-medium.webp','/uploads/media/full/mpc6dkyv7mc9bu-full.webp','2026-05-19 05:11:14.156','2026-05-19 05:11:14.156'),('cmpc6dlu200jhqb00krgme93a','mpc6dlr9250qub.webp','WishCare-5-Niacinamide-Oil-Balance-Fluid-Sunscreen.jpg','image/webp',13094,'WishCare 5% Niacinamide Oil Balance Fluid Sunscreen','WishCare 5 Niacinamide Oil Balance Fluid Sunscreen',NULL,NULL,900,900,'/uploads/media/thumb/mpc6dlr9250qub-thumb.webp','/uploads/media/medium/mpc6dlr9250qub-medium.webp','/uploads/media/full/mpc6dlr9250qub-full.webp','2026-05-19 05:11:15.146','2026-05-19 05:11:15.146'),('cmpc6dmkc00jkqb00nonam4tx','mpc6dmhgmdsadb.webp','WishCare-Daily-Tinted-Fluid-Sunscreen.jpg','image/webp',12534,'WishCare Daily Tinted Fluid Sunscreen','WishCare Daily Tinted Fluid Sunscreen',NULL,NULL,900,900,'/uploads/media/thumb/mpc6dmhgmdsadb-thumb.webp','/uploads/media/medium/mpc6dmhgmdsadb-medium.webp','/uploads/media/full/mpc6dmhgmdsadb-full.webp','2026-05-19 05:11:16.092','2026-05-19 05:11:16.092'),('cmpc6dnbd00jnqb00vitb5rkw','mpc6dn7pj154b5.webp','Wishcare-Triple-Bond-Repair-Shampoo.webp','image/webp',14114,'Wishcare Triple Bond Repair Shampoo.','Wishcare Triple Bond Repair Shampoo',NULL,NULL,1000,1000,'/uploads/media/thumb/mpc6dn7pj154b5-thumb.webp','/uploads/media/medium/mpc6dn7pj154b5-medium.webp','/uploads/media/full/mpc6dn7pj154b5-full.webp','2026-05-19 05:11:17.066','2026-05-19 05:11:17.066'),('cmpc6do9x00jqqb00nohma2tx','mpc6do6om8johi.webp','Minimalist-0.3-Retinol-Face-Serum-for-All-Skin-Types-30ml.jpg','image/webp',24602,'Minimalist 0.3% Retinol Face Serum for All Skin Types 30ml','Minimalist 0.3 Retinol Face Serum for All Skin Types 30ml',NULL,NULL,1080,1080,'/uploads/media/thumb/mpc6do6om8johi-thumb.webp','/uploads/media/medium/mpc6do6om8johi-medium.webp','/uploads/media/full/mpc6do6om8johi-full.webp','2026-05-19 05:11:18.309','2026-05-19 05:11:18.309'),('cmpc6dotz00jtqb00zmbpxbqo','mpc6doo2nrxpvu.webp','The-Derma-Co-2-Kojic-Acid-Face-Serum-30ml.avif','image/webp',36528,'The Derma Co 2% Kojic Acid Face Serum (30ml)','The Derma Co 2 Kojic Acid Face Serum 30ml',NULL,NULL,1000,1000,'/uploads/media/thumb/mpc6doo2nrxpvu-thumb.webp','/uploads/media/medium/mpc6doo2nrxpvu-medium.webp','/uploads/media/full/mpc6doo2nrxpvu-full.webp','2026-05-19 05:11:19.031','2026-05-19 05:11:19.031'),('cmpc6dpn200jwqb00k0s8upn8','mpc6dpk9t7e2ub.webp','The-Derma-Co.-2-Salicylic-Acid-Gel-Face-Wash-100ml.jpg','image/webp',17488,'The Derma Co. 2% Salicylic Acid Gel Face Wash 100ml','The Derma Co. 2 Salicylic Acid Gel Face Wash 100ml',NULL,NULL,900,900,'/uploads/media/thumb/mpc6dpk9t7e2ub-thumb.webp','/uploads/media/medium/mpc6dpk9t7e2ub-medium.webp','/uploads/media/full/mpc6dpk9t7e2ub-full.webp','2026-05-19 05:11:20.078','2026-05-19 05:11:20.078'),('cmpc6dqni00jzqb00lrfxvkfg','mpc6dqkmcudb3v.webp','The-Derma-Co-10-Vitamin-C-Face-Serum-30ml.jpg','image/webp',26650,'The Derma Co 10% Vitamin C Face Serum (30ml)','The Derma Co 10 Vitamin C Face Serum 30ml',NULL,NULL,900,900,'/uploads/media/thumb/mpc6dqkmcudb3v-thumb.webp','/uploads/media/medium/mpc6dqkmcudb3v-medium.webp','/uploads/media/full/mpc6dqkmcudb3v-full.webp','2026-05-19 05:11:21.390','2026-05-19 05:11:21.390'),('cmpc6dsea00k2qb00unl95n9d','mpc6dsaak4k4bv.webp','The-Derma-Co-1-Hyaluronic-Sunscreen-Aqua-Gel-SPF-50-50g.jpg','image/webp',73566,'The Derma Co 1% Hyaluronic Sunscreen Aqua Gel SPF 50 (50g','The Derma Co 1 Hyaluronic Sunscreen Aqua Gel SPF 50 50g',NULL,NULL,900,900,'/uploads/media/thumb/mpc6dsaak4k4bv-thumb.webp','/uploads/media/medium/mpc6dsaak4k4bv-medium.webp','/uploads/media/full/mpc6dsaak4k4bv-full.webp','2026-05-19 05:11:23.651','2026-05-19 05:11:23.651'),('cmpc6dtn300k5qb00orrdr31s','mpc6dtd991brgd.webp','Chemist-At-Play-1-Salicylic-Acid-Body-Wash-473ml.jpg','image/webp',37122,'Chemist At Play 1% Salicylic Acid Body Wash 473ml','Chemist At Play 1 Salicylic Acid Body Wash 473ml',NULL,NULL,2560,2560,'/uploads/media/thumb/mpc6dtd991brgd-thumb.webp','/uploads/media/medium/mpc6dtd991brgd-medium.webp','/uploads/media/full/mpc6dtd991brgd-full.webp','2026-05-19 05:11:25.264','2026-05-19 05:11:25.264'),('cmpc6dup400k8qb00apt4bc2y','mpc6dukpk8ndc5.webp','Advanced-Hair-Growth-Serum-Roll-On-Pack-of-2.jpg','image/webp',18266,'Advanced Hair Growth Serum Roll-On (Pack of 2)','Advanced Hair Growth Serum Roll On Pack of 2',NULL,NULL,900,900,'/uploads/media/thumb/mpc6dukpk8ndc5-thumb.webp','/uploads/media/medium/mpc6dukpk8ndc5-medium.webp','/uploads/media/full/mpc6dukpk8ndc5-full.webp','2026-05-19 05:11:26.632','2026-05-19 05:11:26.632'),('cmpc6dvoj00kbqb00lgh2i8mu','mpc6dvlbwwoybu.webp','Chemist-At-Play-Exfoliating-Body-Wash-4-Lactic-acid-salicylic-Acid-vitamin-E-236ml.jpg','image/webp',21224,'Chemist At Play Exfoliating Body Wash 4% Lactic acid + salicylic Acid + vitamin E 236ml','Chemist At Play Exfoliating Body Wash 4 Lactic acid salicylic Acid vitamin E 236ml',NULL,NULL,900,900,'/uploads/media/thumb/mpc6dvlbwwoybu-thumb.webp','/uploads/media/medium/mpc6dvlbwwoybu-medium.webp','/uploads/media/full/mpc6dvlbwwoybu-full.webp','2026-05-19 05:11:27.907','2026-05-19 05:11:27.907'),('cmpc6dwot00keqb0056zonbqt','mpc6dwl8mano2a.webp','Chemist-at-Play-Neck-Knee-Elbow-Brightening-Roll-On-40ml.jpg','image/webp',12282,'Chemist at Play Neck Knee Elbow Brightening Roll On 40ml','Chemist at Play Neck Knee Elbow Brightening Roll On 40ml',NULL,NULL,900,900,'/uploads/media/thumb/mpc6dwl8mano2a-thumb.webp','/uploads/media/medium/mpc6dwl8mano2a-medium.webp','/uploads/media/full/mpc6dwl8mano2a-full.webp','2026-05-19 05:11:29.213','2026-05-19 05:11:29.213'),('cmpc6dxc200khqb001t3x7bu9','mpc6dx6jxlwmh3.webp','1000122065.webp','image/webp',32384,'2% Salicylic Acid Face Wash for Acne & Oil Control (100ml)','1000122065',NULL,NULL,1600,1600,'/uploads/media/thumb/mpc6dx6jxlwmh3-thumb.webp','/uploads/media/medium/mpc6dx6jxlwmh3-medium.webp','/uploads/media/full/mpc6dx6jxlwmh3-full.webp','2026-05-19 05:11:30.051','2026-05-19 05:11:30.051'),('cmpc6dydt00kkqb009ds3pazg','mpc6dyaq72pss0.webp','Bare-Anatomy-Anti-Dandruff-Shampoo-250ml.jpg','image/webp',16620,'Bare Anatomy Anti Dandruff Shampoo (250ml)','Bare Anatomy Anti Dandruff Shampoo 250ml',NULL,NULL,900,900,'/uploads/media/thumb/mpc6dyaq72pss0-thumb.webp','/uploads/media/medium/mpc6dyaq72pss0-medium.webp','/uploads/media/full/mpc6dyaq72pss0-full.webp','2026-05-19 05:11:31.409','2026-05-19 05:11:31.409'),('cmpc6es9n00knqb00mif9e7i7','mpc6es75u5qe97.webp','Bare-Anatomy-Hair-Fall-Control-Shampoo-with-Peptides-250ml.webp','image/webp',13722,'Bare Anatomy Hair Fall Control Shampoo with Peptides (250ml)','Bare Anatomy Hair Fall Control Shampoo with Peptides 250ml',NULL,NULL,800,800,'/uploads/media/thumb/mpc6es75u5qe97-thumb.webp','/uploads/media/medium/mpc6es75u5qe97-medium.webp','/uploads/media/full/mpc6es75u5qe97-full.webp','2026-05-19 05:12:10.139','2026-05-19 05:12:10.139'),('cmpc6esyh00kqqb00vv948c3y','mpc6esuilog6ax.webp','Exfoliating-Body-Scrub-with-Coffee-Brown-Sugar-75-gm.webp','image/webp',23264,'Exfoliating Body Scrub with Coffee & Brown Sugar - 75 gm','Exfoliating Body Scrub with Coffee Brown Sugar 75 gm',NULL,NULL,1080,1080,'/uploads/media/thumb/mpc6esuilog6ax-thumb.webp','/uploads/media/medium/mpc6esuilog6ax-medium.webp','/uploads/media/full/mpc6esuilog6ax-full.webp','2026-05-19 05:12:11.034','2026-05-19 05:12:11.034'),('cmpc6eu2700ktqb00lk2pmn3s','mpc6etzd069eeu.webp','Nigrifix-Cream-Patented-Hyperpigmentation-Treatment-100gm-1.jpg','image/webp',20226,'Fixderma Nigrifix Cream | A patented solution to treat hyperpigmentation','Nigrifix Cream Patented Hyperpigmentation Treatment 100gm 1',NULL,NULL,900,900,'/uploads/media/thumb/mpc6etzd069eeu-thumb.webp','/uploads/media/medium/mpc6etzd069eeu-medium.webp','/uploads/media/full/mpc6etzd069eeu-full.webp','2026-05-19 05:12:12.464','2026-05-19 05:12:12.464'),('cmpc6euww00kuqb00whyj8f2t','mpc6eutp81ip4i.webp','Nigrifix-Cream-Patented-Hyperpigmentation-Treatment-100gm.jpg','image/webp',20226,'Nigrifix Cream: Patented Hyperpigmentation Treatment 30gm','Nigrifix Cream Patented Hyperpigmentation Treatment 100gm',NULL,NULL,900,900,'/uploads/media/thumb/mpc6eutp81ip4i-thumb.webp','/uploads/media/medium/mpc6eutp81ip4i-medium.webp','/uploads/media/full/mpc6eutp81ip4i-full.webp','2026-05-19 05:12:13.568','2026-05-19 05:12:13.568'),('cmpc6evrf00kvqb0055d5rv63','mpc6evmucdsjwi.webp','Fixderma-Nigrifix-Cream-50gm.webp','image/webp',22650,'Fixderma Nigrifix Cream 50gm','Fixderma Nigrifix Cream 50gm',NULL,NULL,1200,1200,'/uploads/media/thumb/mpc6evmucdsjwi-thumb.webp','/uploads/media/medium/mpc6evmucdsjwi-medium.webp','/uploads/media/full/mpc6evmucdsjwi-full.webp','2026-05-19 05:12:14.668','2026-05-19 05:12:14.668'),('cmpc6exza00l5qb00zghn0awi','mpc6exvvpitt8q.webp','Minimalist-Tranexamic-3-Face-Serum-30ml.png','image/webp',23660,'Minimalist Tranexamic 3% Face Serum 30ml','Minimalist Tranexamic 3 Face Serum 30ml',NULL,NULL,840,1260,'/uploads/media/thumb/mpc6exvvpitt8q-thumb.webp','/uploads/media/medium/mpc6exvvpitt8q-medium.webp','/uploads/media/full/mpc6exvvpitt8q-full.webp','2026-05-19 05:12:17.542','2026-05-19 05:12:17.542'),('cmpc6ez1600l6qb000exemjbw','mpc6eyxg75r4jg.webp','Minimalist-Tranexamic-3-Face-Serum-30ml-2.jpg','image/webp',37078,'Minimalist Tranexamic 3% Face Serum 30ml','Minimalist Tranexamic 3 Face Serum 30ml 2',NULL,NULL,900,900,'/uploads/media/thumb/mpc6eyxg75r4jg-thumb.webp','/uploads/media/medium/mpc6eyxg75r4jg-medium.webp','/uploads/media/full/mpc6eyxg75r4jg-full.webp','2026-05-19 05:12:18.906','2026-05-19 05:12:18.906'),('cmpc6eztu00l9qb00qnruc70m','mpc6ezr8xwb2un.webp','Minimalist-Niacinamide-5-Face-Serum-30ml.png','image/webp',16640,'Minimalist Niacinamide 5% Face Serum 30ml','Minimalist Niacinamide 5 Face Serum 30ml',NULL,NULL,793,800,'/uploads/media/thumb/mpc6ezr8xwb2un-thumb.webp','/uploads/media/medium/mpc6ezr8xwb2un-medium.webp','/uploads/media/full/mpc6ezr8xwb2un-full.webp','2026-05-19 05:12:19.938','2026-05-19 05:12:19.938'),('cmpc6f0la00lcqb00xs0r41b5','mpc6f0ieyeo91p.webp','Minimalist-L-Ascorbic-Acid-8-Lip-Treatment-Balm-12g.jpg','image/webp',20690,'Minimalist L-Ascorbic Acid 8% Lip Treatment Balm 12g','Minimalist L Ascorbic Acid 8 Lip Treatment Balm 12g',NULL,NULL,900,900,'/uploads/media/thumb/mpc6f0ieyeo91p-thumb.webp','/uploads/media/medium/mpc6f0ieyeo91p-medium.webp','/uploads/media/full/mpc6f0ieyeo91p-full.webp','2026-05-19 05:12:20.926','2026-05-19 05:12:20.926'),('cmpc6f1r400lfqb00bdu2uzws','mpc6f1nz353448.webp','Minimalist-Vitamin-C-E-Ferulic-16-Face-Serum-20ml.jpg','image/webp',11364,'Minimalist Vitamin C + E + Ferulic 16% Face Serum 20ml','Minimalist Vitamin C E Ferulic 16 Face Serum 20ml',NULL,NULL,900,900,'/uploads/media/thumb/mpc6f1nz353448-thumb.webp','/uploads/media/medium/mpc6f1nz353448-medium.webp','/uploads/media/full/mpc6f1nz353448-full.webp','2026-05-19 05:12:22.432','2026-05-19 05:12:22.432'),('cmpc6f2qh00liqb00j5ezb0tk','mpc6f2mdrqwh5k.webp','nLcKlLJUixnvdVmhGGKyMkCWeyAeUsmNACI1mLoU.jpg','image/webp',27026,'Minimalist Alpha Arbutin 2% Face Serum 30ml','nLcKlLJUixnvdVmhGGKyMkCWeyAeUsmNACI1mLoU',NULL,NULL,980,980,'/uploads/media/thumb/mpc6f2mdrqwh5k-thumb.webp','/uploads/media/medium/mpc6f2mdrqwh5k-medium.webp','/uploads/media/full/mpc6f2mdrqwh5k-full.webp','2026-05-19 05:12:23.706','2026-05-19 05:12:23.706'),('cmpc6f3zd00llqb00lqroxn4e','mpc6f3w3tw11v9.webp','Wishcare-Vitamin-C-Pure-Glow-Milk-Sunscreen-SPF-50.jpg','image/webp',15496,'Wishcare Vitamin C Pure Glow Milk Sunscreen SPF 50+','Wishcare Vitamin C Pure Glow Milk Sunscreen SPF 50',NULL,NULL,900,900,'/uploads/media/thumb/mpc6f3w3tw11v9-thumb.webp','/uploads/media/medium/mpc6f3w3tw11v9-medium.webp','/uploads/media/full/mpc6f3w3tw11v9-full.webp','2026-05-19 05:12:25.321','2026-05-19 05:12:25.321'),('cmpc6f4py00loqb00al441l5p','mpc6f4n8slcase.webp','WishCare-Multi-Peptide-Anti-Hairfall-Shampoo-250ml.jpg','image/webp',17980,'WishCare Multi Peptide Anti Hairfall Shampoo 250ml','WishCare Multi Peptide Anti Hairfall Shampoo 250ml',NULL,NULL,900,900,'/uploads/media/thumb/mpc6f4n8slcase-thumb.webp','/uploads/media/medium/mpc6f4n8slcase-medium.webp','/uploads/media/full/mpc6f4n8slcase-full.webp','2026-05-19 05:12:26.278','2026-05-19 05:12:26.278'),('cmpc6f5zw00lrqb00rcm4g106','mpc6f5w3vyc8hc.webp','Reequil-Ceramide-Hyaluronic-Acid-Moisturiser-for-normal-to-dry-skin.jpg','image/webp',12484,'Re\'equil Ceramide & Hyaluronic Acid Moisturiser for normal to dry skin','Reequil Ceramide Hyaluronic Acid Moisturiser for normal to dry skin',NULL,NULL,900,900,'/uploads/media/thumb/mpc6f5w3vyc8hc-thumb.webp','/uploads/media/medium/mpc6f5w3vyc8hc-medium.webp','/uploads/media/full/mpc6f5w3vyc8hc-full.webp','2026-05-19 05:12:27.932','2026-05-19 05:12:27.932'),('cmpc6f6k600luqb00k64qwd1b','mpc6f6hh2sktv5.webp','Reequil-0.1-Retinol-Night-Cream.jpg','image/webp',10102,'Re\'equil 0.1% Retinol Night Cream','Reequil 0.1 Retinol Night Cream',NULL,NULL,900,900,'/uploads/media/thumb/mpc6f6hh2sktv5-thumb.webp','/uploads/media/medium/mpc6f6hh2sktv5-medium.webp','/uploads/media/full/mpc6f6hh2sktv5-full.webp','2026-05-19 05:12:28.663','2026-05-19 05:12:28.663'),('cmpc6f7ky00lxqb00ai64lzr2','mpc6f7hi35sriu.webp','Flicka-Professional-Silk-Touch-Multi-Function-Moisturizer.jpg','image/webp',16840,'Flicka Professional Silk Touch Multi-Function Moisturizer','Flicka Professional Silk Touch Multi Function Moisturizer',NULL,NULL,900,900,'/uploads/media/thumb/mpc6f7hi35sriu-thumb.webp','/uploads/media/medium/mpc6f7hi35sriu-medium.webp','/uploads/media/full/mpc6f7hi35sriu-full.webp','2026-05-19 05:12:29.987','2026-05-19 05:12:29.987'),('cmpc6f8m200m0qb00frmi9q4o','mpc6f8hhvpeu2g.webp','Fixderma-Dewrav-Brightening-Oil-Free-Face-Moisturizer.jpg','image/webp',34426,'Fixderma Dewrav Brightening & Oil-Free Face Moisturizer','Fixderma Dewrav Brightening Oil Free Face Moisturizer',NULL,NULL,900,900,'/uploads/media/thumb/mpc6f8hhvpeu2g-thumb.webp','/uploads/media/medium/mpc6f8hhvpeu2g-medium.webp','/uploads/media/full/mpc6f8hhvpeu2g-full.webp','2026-05-19 05:12:31.322','2026-05-19 05:12:31.322'),('cmpc6f9a100m3qb0097n9l74u','mpc6f95yq6ztvx.webp','Chemist-at-Play-Exfoliating-Body-Scrub-containing-natural-AHAs-coffee-and-brown-sugar.jpg','image/webp',81396,'Chemist at Play Exfoliating Body Scrub containing natural AHAs, coffee, and brown sugar','Chemist at Play Exfoliating Body Scrub containing natural AHAs coffee and brown sugar',NULL,NULL,1000,990,'/uploads/media/thumb/mpc6f95yq6ztvx-thumb.webp','/uploads/media/medium/mpc6f95yq6ztvx-medium.webp','/uploads/media/full/mpc6f95yq6ztvx-full.webp','2026-05-19 05:12:32.185','2026-05-19 05:12:32.185'),('cmpc6fa0w00m6qb00lcuz84sg','mpc6f9yazc9ffd.webp','Avene-Cicalfate-Repairing-Protective-Cream-For-Sensitive-Irritate-Skin-100ml.webp','image/webp',19406,'Avène Cicalfate+ Repairing Protective Cream For Sensitive Irritate Skin 100ml','Avene Cicalfate Repairing Protective Cream For Sensitive Irritate Skin 100ml',NULL,NULL,680,680,'/uploads/media/thumb/mpc6f9yazc9ffd-thumb.webp','/uploads/media/medium/mpc6f9yazc9ffd-medium.webp','/uploads/media/full/mpc6f9yazc9ffd-full.webp','2026-05-19 05:12:33.153','2026-05-19 05:12:33.153'),('cmpc6fank00maqb00kgo059pp','mpc6faeyp63cga.webp','Minimalist-Niacinamide-10-Face-Serum.avif','image/webp',27038,'Minimalist Niacinamide 10% Face Serum (30ml)','Minimalist Niacinamide 10 Face Serum',NULL,NULL,1100,1600,'/uploads/media/thumb/mpc6faeyp63cga-thumb.webp','/uploads/media/medium/mpc6faeyp63cga-medium.webp','/uploads/media/full/mpc6faeyp63cga-full.webp','2026-05-19 05:12:33.969','2026-05-19 05:12:33.969'),('cmpc6fb9400mdqb00jnxlcdrm','mpc6fb76hmxhjb.webp','Neutrogena-Ultra-Sheer-Dry-Touch-Sunblock-SPF50-80mlGlowBD.jpg','image/webp',10446,'Neutrogena-Ultra-Sheer-Dry-Touch-Sunblock-SPF50-80mlGlowBD','Neutrogena Ultra Sheer Dry Touch Sunblock SPF50 80mlGlowBD',NULL,NULL,600,600,'/uploads/media/thumb/mpc6fb76hmxhjb-thumb.webp','/uploads/media/medium/mpc6fb76hmxhjb-medium.webp','/uploads/media/full/mpc6fb76hmxhjb-full.webp','2026-05-19 05:12:34.745','2026-05-19 05:12:34.745'),('cmpc6fc1x00mhqb00anramnup','mpc6fbz3udyui3.webp','Simple-Kind-to-Skin-Refreshing-Facial-Wash-Gel-150ml.webp','image/webp',13534,'Simple Kind to Skin Refreshing Facial Wash Gel 150ml','Simple Kind to Skin Refreshing Facial Wash Gel 150ml',NULL,NULL,800,800,'/uploads/media/thumb/mpc6fbz3udyui3-thumb.webp','/uploads/media/medium/mpc6fbz3udyui3-medium.webp','/uploads/media/full/mpc6fbz3udyui3-full.webp','2026-05-19 05:12:35.781','2026-05-19 05:12:35.781'),('cmpc6fcvj00mlqb00k5dc5whw','mpc6fcslmfzn3v.webp','Deconstruct-Vitamin-C-Ferulic-Acid-S%D0%B5rum-30ml.webp','image/webp',15490,'Deconstruct Vitamin C & Ferulic Acid Sеrum 30ml','Deconstruct Vitamin C Ferulic Acid S%D0%B5rum 30ml',NULL,NULL,720,720,'/uploads/media/thumb/mpc6fcslmfzn3v-thumb.webp','/uploads/media/medium/mpc6fcslmfzn3v-medium.webp','/uploads/media/full/mpc6fcslmfzn3v-full.webp','2026-05-19 05:12:36.848','2026-05-19 05:12:36.848'),('cmpc6gbna00moqb007zum78sl','mpc6gbkz9cjnqr.webp','COSRX-Alpha-Arbutin-2-Discoloration-Care-Serum-50ml.jpg','image/webp',14128,'COSRX The Alpha Arbutin 2 Discoloration Care Serum 50ml','COSRX Alpha Arbutin 2 Discoloration Care Serum 50ml',NULL,NULL,600,600,'/uploads/media/thumb/mpc6gbkz9cjnqr-thumb.webp','/uploads/media/medium/mpc6gbkz9cjnqr-medium.webp','/uploads/media/full/mpc6gbkz9cjnqr-full.webp','2026-05-19 05:13:21.911','2026-05-19 05:13:21.911'),('cmpc6gc5n00msqb00iz5cmls7','mpc6gc2a5bldnh.webp','W7-12-Hour-HD-Foundation-30ml.avif','image/webp',24888,'W7 12 Hour HD Foundation 30ml','W7 12 Hour HD Foundation 30ml',NULL,NULL,759,757,'/uploads/media/thumb/mpc6gc2a5bldnh-thumb.webp','/uploads/media/medium/mpc6gc2a5bldnh-medium.webp','/uploads/media/full/mpc6gc2a5bldnh-full.webp','2026-05-19 05:13:22.571','2026-05-19 05:13:22.571'),('cmpc6gcy400mvqb00l6p6f1lb','mpc6gcstljtg8f.webp','Lady-Speed-Stick-Invisible-Dry-Power-Anti-Perspirant-Deodorant-Wild-Freesia-39.6g.avif','image/webp',23798,'Lady Speed Stick Invisible Dry Power Anti Perspirant Deodorant Wild Freesia 39.6g','Lady Speed Stick Invisible Dry Power Anti Perspirant Deodorant Wild Freesia 39.6g',NULL,NULL,1080,1080,'/uploads/media/thumb/mpc6gcstljtg8f-thumb.webp','/uploads/media/medium/mpc6gcstljtg8f-medium.webp','/uploads/media/full/mpc6gcstljtg8f-full.webp','2026-05-19 05:13:23.597','2026-05-19 05:13:23.597'),('cmpc6gd7o00myqb00kce6jte6','mpc6gd5s0afym4.webp','Tretinoin-Tretin-0.025-Cream-30g.webp','image/webp',12436,'Tretinoin Tretin 0.025% Cream 30g','Tretinoin Tretin 0.025 Cream 30g',NULL,NULL,600,600,'/uploads/media/thumb/mpc6gd5s0afym4-thumb.webp','/uploads/media/medium/mpc6gd5s0afym4-medium.webp','/uploads/media/full/mpc6gd5s0afym4-full.webp','2026-05-19 05:13:23.941','2026-05-19 05:13:23.941'),('cmpc6gdr700n1qb00hyxvnc5f','mpc6gdlp0bj6z7.webp','Vaseline-Gluta-Hya-Serum-Burst-Lotion-Smoothing-Perfector-300ml.avif','image/webp',29204,'Vaseline Gluta Hya Serum Burst Lotion Smoothing Perfector 300ml','Vaseline Gluta Hya Serum Burst Lotion Smoothing Perfector 300ml',NULL,NULL,1080,1080,'/uploads/media/thumb/mpc6gdlp0bj6z7-thumb.webp','/uploads/media/medium/mpc6gdlp0bj6z7-medium.webp','/uploads/media/full/mpc6gdlp0bj6z7-full.webp','2026-05-19 05:13:24.644','2026-05-19 05:13:24.644'),('cmpc6gert00n5qb00jmidu4yl','mpc6geoueef7o8.webp','Maybelline-Super-Stay-Lumi-Matte-Up-To-30HR-Wear-Foundation-with-SPF16-35ml.jpg','image/webp',16892,'Maybelline Super Stay Lumi-Matte Up To 30HR Wear Foundation with SPF16 35ml','Maybelline Super Stay Lumi Matte Up To 30HR Wear Foundation with SPF16 35ml',NULL,NULL,1000,1000,'/uploads/media/thumb/mpc6geoueef7o8-thumb.webp','/uploads/media/medium/mpc6geoueef7o8-medium.webp','/uploads/media/full/mpc6geoueef7o8-full.webp','2026-05-19 05:13:25.962','2026-05-19 05:13:25.962'),('cmpc6gf7g00n9qb00dgfrznmi','mpc6gf51lenmvy.webp','Dove-Exfoliating-Pomegranate-Seeds-Shea-Butter-Scent-Body-Scrub-225ml-1.jpg','image/webp',14788,'Dove Exfoliating Pomegranate Seeds & Shea Butter Scent Body Scrub 225ml','Dove Exfoliating Pomegranate Seeds Shea Butter Scent Body Scrub 225ml 1',NULL,NULL,800,800,'/uploads/media/thumb/mpc6gf51lenmvy-thumb.webp','/uploads/media/medium/mpc6gf51lenmvy-medium.webp','/uploads/media/full/mpc6gf51lenmvy-full.webp','2026-05-19 05:13:26.524','2026-05-19 05:13:26.524'),('cmpc6gg3c00ndqb005oyu964c','mpc6gg0gmgj1q5.webp','Untitled-design-1.jpg','image/webp',16566,'Minimalist SPF 50 PA ++++ Sunscreen with Multi-Vitamins 50g','Untitled design 1',NULL,NULL,900,900,'/uploads/media/thumb/mpc6gg0gmgj1q5-thumb.webp','/uploads/media/medium/mpc6gg0gmgj1q5-medium.webp','/uploads/media/full/mpc6gg0gmgj1q5-full.webp','2026-05-19 05:13:27.672','2026-05-19 05:13:27.672'),('cmpc6gh6f00ngqb002yzbxpli','mpc6gh3ri69c1y.webp','Ponds-Light-Moisturiser-For-Soft-Glowing-Skin-50ml.jpg','image/webp',11252,'Pond\'s Light Moisturiser For Soft Glowing Skin (50ml)','Ponds Light Moisturiser For Soft Glowing Skin 50ml',NULL,NULL,900,900,'/uploads/media/thumb/mpc6gh3ri69c1y-thumb.webp','/uploads/media/medium/mpc6gh3ri69c1y-medium.webp','/uploads/media/full/mpc6gh3ri69c1y-full.webp','2026-05-19 05:13:29.079','2026-05-19 05:13:29.079'),('cmpc6ghjt00nkqb00vin91k89','mpc6ghgcra29om.webp','DOT-KEY-Vitamin-CE-Super-Bright-Sunscreen-SPF-50-PA-%E2%80%9380gm.jpg','image/webp',10638,'DOT & KEY Vitamin C+E Super Bright Sunscreen SPF 50+ PA++++ –(80gm)','DOT KEY Vitamin CE Super Bright Sunscreen SPF 50 PA %E2%80%9380gm',NULL,NULL,900,900,'/uploads/media/thumb/mpc6ghgcra29om-thumb.webp','/uploads/media/medium/mpc6ghgcra29om-medium.webp','/uploads/media/full/mpc6ghgcra29om-full.webp','2026-05-19 05:13:29.562','2026-05-19 05:13:29.562'),('cmpc6ghy900nnqb00gc9jk028','mpc6ghvdy1b1ls.webp','Nivea-Refreshingly-Soft-Moisturizing-Cream-100ml.webp','image/webp',24248,'Nivea Refreshingly Soft Moisturizing Cream (100ml)','Nivea Refreshingly Soft Moisturizing Cream 100ml',NULL,NULL,720,720,'/uploads/media/thumb/mpc6ghvdy1b1ls-thumb.webp','/uploads/media/medium/mpc6ghvdy1b1ls-medium.webp','/uploads/media/full/mpc6ghvdy1b1ls-full.webp','2026-05-19 05:13:30.081','2026-05-19 05:13:30.081'),('cmpc6gig500nqqb00u1vquneb','mpc6gibj9cgkav.webp','Zayn-Myza-Vitamin-C-Face-Serum-30ml.webp','image/webp',18660,'Zayn & Myza Vitamin C Face Serum (30ml)','Zayn Myza Vitamin C Face Serum 30ml',NULL,NULL,1500,1500,'/uploads/media/thumb/mpc6gibj9cgkav-thumb.webp','/uploads/media/medium/mpc6gibj9cgkav-medium.webp','/uploads/media/full/mpc6gibj9cgkav-full.webp','2026-05-19 05:13:30.725','2026-05-19 05:13:30.725'),('cmpc6gjot00ntqb0053ido0ao','mpc6gjle4kehmh.webp','Untitled-design.jpg','image/webp',28840,'TRESemme Keratin Smooth Deep Smoothing Mask with Hydrolysed Keratin for 72Hrs Frizz Control 440ml','Untitled design',NULL,NULL,900,900,'/uploads/media/thumb/mpc6gjle4kehmh-thumb.webp','/uploads/media/medium/mpc6gjle4kehmh-medium.webp','/uploads/media/full/mpc6gjle4kehmh-full.webp','2026-05-19 05:13:32.334','2026-05-19 05:13:32.334'),('cmpc6gk6e00nwqb00rdvwsrxw','mpc6gk1uz95bo2.webp','Olay-Night-Cream-Natural-White-7-in-1-Night-Cream.webp','image/webp',33446,'Olay Night Cream: Natural White 7 in 1 Night Cream','Olay Night Cream Natural White 7 in 1 Night Cream',NULL,NULL,1200,1200,'/uploads/media/thumb/mpc6gk1uz95bo2-thumb.webp','/uploads/media/medium/mpc6gk1uz95bo2-medium.webp','/uploads/media/full/mpc6gk1uz95bo2-full.webp','2026-05-19 05:13:32.967','2026-05-19 05:13:32.967'),('cmpc6gkwz00nzqb00uokt5l2z','mpc6gku9vc74x7.webp','Mistine-Acne-Clear-Facial-Foam-100gm.jpg','image/webp',16154,'Mistine Acne Clear Facial Foam (100gm)','Mistine Acne Clear Facial Foam 100gm',NULL,NULL,900,900,'/uploads/media/thumb/mpc6gku9vc74x7-thumb.webp','/uploads/media/medium/mpc6gku9vc74x7-medium.webp','/uploads/media/full/mpc6gku9vc74x7-full.webp','2026-05-19 05:13:33.924','2026-05-19 05:13:33.924'),('cmpc6glwc00o2qb00trf15jl0','mpc6glt4behtxa.webp','The-Derma-Co-10-Niacinamide-Serum-For-Fades-Acne-Marks-Dark-Spots-30ml.jpg','image/webp',24496,'The Derma Co 10% Niacinamide Serum For Fades Acne Marks & Dark Spots 30ml','The Derma Co 10 Niacinamide Serum For Fades Acne Marks Dark Spots 30ml',NULL,NULL,900,900,'/uploads/media/thumb/mpc6glt4behtxa-thumb.webp','/uploads/media/medium/mpc6glt4behtxa-medium.webp','/uploads/media/full/mpc6glt4behtxa-full.webp','2026-05-19 05:13:35.196','2026-05-19 05:13:35.196'),('cmpc6gmvl00o5qb00wlogujpb','mpc6gmrq949c6r.webp','Simple-Water-Boost-Micellar-Facial-Gel-Wash-For-Dry-Or-Dehydrated-skin-150ml.jpg','image/webp',19014,'Simple Water Boost Micellar Facial Gel Wash For Dry Or Dehydrated skin 150ml','Simple Water Boost Micellar Facial Gel Wash For Dry Or Dehydrated skin 150ml',NULL,NULL,900,900,'/uploads/media/thumb/mpc6gmrq949c6r-thumb.webp','/uploads/media/medium/mpc6gmrq949c6r-medium.webp','/uploads/media/full/mpc6gmrq949c6r-full.webp','2026-05-19 05:13:36.466','2026-05-19 05:13:36.466'),('cmpc6gn5c00o8qb009flxwuwg','mpc6gn3cy1u0m3.webp','The-Ordinary-Alpha-Arbutin-2-HA-60ml-New-Updated-Version.jpg','image/webp',9920,'The Ordinary Alpha Arbutin 2% + HA 60ml | New Updated Version','The Ordinary Alpha Arbutin 2 HA 60ml New Updated Version',NULL,NULL,800,800,'/uploads/media/thumb/mpc6gn3cy1u0m3-thumb.webp','/uploads/media/medium/mpc6gn3cy1u0m3-medium.webp','/uploads/media/full/mpc6gn3cy1u0m3-full.webp','2026-05-19 05:13:36.817','2026-05-19 05:13:36.817'),('cmpc6gnib00ocqb00al7870vb','mpc6gneorv36xn.webp','Dot-Key-Vitamin-C-E-Sunscreen.jpg','image/webp',18744,'Dot & Key Vitamin C + E Sunscreen, SPF 50+ PA++++ 80g','Dot Key Vitamin C E Sunscreen',NULL,NULL,900,900,'/uploads/media/thumb/mpc6gneorv36xn-thumb.webp','/uploads/media/medium/mpc6gneorv36xn-medium.webp','/uploads/media/full/mpc6gneorv36xn-full.webp','2026-05-19 05:13:37.284','2026-05-19 05:13:37.284'),('cmpc6goat00ofqb00i86ert5p','mpc6go7ujz47hy.webp','Garnier-SkinActive-Vitamin-C-Glow-Boost-Serum-for-Tired-and-Dull-Skin-30ml.jpg','image/webp',14430,'Garnier SkinActive Vitamin C Glow Boost Serum for Tired and Dull Skin 30ml','Garnier SkinActive Vitamin C Glow Boost Serum for Tired and Dull Skin 30ml',NULL,NULL,900,900,'/uploads/media/thumb/mpc6go7ujz47hy-thumb.webp','/uploads/media/medium/mpc6go7ujz47hy-medium.webp','/uploads/media/full/mpc6go7ujz47hy-full.webp','2026-05-19 05:13:38.309','2026-05-19 05:13:38.309'),('cmpc6gq8700oiqb00jzx1d5er','mpc6gq4nmxk9xl.webp','Maybelline-Super-Stay-Matte-Ink-Liquid-Lipstick-5ml.jpg','image/webp',25882,'Maybelline Super Stay Matte Ink Liquid Lipstick 5ml','Maybelline Super Stay Matte Ink Liquid Lipstick 5ml',NULL,NULL,1060,1130,'/uploads/media/thumb/mpc6gq4nmxk9xl-thumb.webp','/uploads/media/medium/mpc6gq4nmxk9xl-medium.webp','/uploads/media/full/mpc6gq4nmxk9xl-full.webp','2026-05-19 05:13:40.808','2026-05-19 05:13:40.808'),('cmpc6gqoc00olqb00ikkxeew5','mpc6gqk9dogc3c.webp','Laikou-Japan-Sakura-Sunscreen-SPF50-PA-50g.webp','image/webp',12802,'Laikou Japan Sakura Sunscreen SPF50 PA+++ (50g)','Laikou Japan Sakura Sunscreen SPF50 PA 50g',NULL,NULL,1000,1000,'/uploads/media/thumb/mpc6gqk9dogc3c-thumb.webp','/uploads/media/medium/mpc6gqk9dogc3c-medium.webp','/uploads/media/full/mpc6gqk9dogc3c-full.webp','2026-05-19 05:13:41.388','2026-05-19 05:13:41.388'),('cmpc6grz300ooqb00orfyuntb','mpc6grpjqevg7p.webp','Lafz-Essential-Onion-and-Black-Seed-Hair-Oil.webp','image/webp',57744,'Lafz Essential Onion and Black Seed Hair Oil','Lafz Essential Onion and Black Seed Hair Oil',NULL,NULL,1780,1780,'/uploads/media/thumb/mpc6grpjqevg7p-thumb.webp','/uploads/media/medium/mpc6grpjqevg7p-medium.webp','/uploads/media/full/mpc6grpjqevg7p-full.webp','2026-05-19 05:13:43.071','2026-05-19 05:13:43.071'),('cmpc6gtqm00oxqb00qy0avlof','mpc6gtfyansv4l.webp','Lafz-Essential-Onion-and-Black-Seed-Hair-Oil2.webp','image/webp',67270,'Lafz Essential Onion And Black Seed Hair Oil','Lafz Essential Onion and Black Seed Hair Oil2',NULL,NULL,1200,1200,'/uploads/media/thumb/mpc6gtfyansv4l-thumb.webp','/uploads/media/medium/mpc6gtfyansv4l-medium.webp','/uploads/media/full/mpc6gtfyansv4l-full.webp','2026-05-19 05:13:45.359','2026-05-19 05:13:45.359'),('cmpc6gupm00p1qb00tne57uqn','mpc6gum8r85d5e.webp','Joya-Sanitary-Napkin-Extra-Heavy-Flow-Wings-8-Pads-Pack-Buy-1-Get-1.jpg','image/webp',41502,'Joya Sanitary Napkin Extra Heavy Flow Wings 8 Pads Pack Buy 1 Get 1','Joya Sanitary Napkin Extra Heavy Flow Wings 8 Pads Pack Buy 1 Get 1',NULL,NULL,900,900,'/uploads/media/thumb/mpc6gum8r85d5e-thumb.webp','/uploads/media/medium/mpc6gum8r85d5e-medium.webp','/uploads/media/full/mpc6gum8r85d5e-full.webp','2026-05-19 05:13:46.618','2026-05-19 05:13:46.618'),('cmpc6gv3700p4qb00xknf2kus','mpc6guxqv9vzep.webp','The-Derma-Co-Pore-Minimizing-Face-Serum-with-4-Niacinamide-5-PHA-and-p-REFINYL%C2%AE-30ml-1.jpg','image/webp',22888,'The Derma Co Pore Minimizing Face Serum with 4% Niacinamide, 5% PHA and p-REFINYL® 30ml','The Derma Co Pore Minimizing Face Serum with 4 Niacinamide 5 PHA and p REFINYL%C2%AE 30ml 1',NULL,NULL,1166,1296,'/uploads/media/thumb/mpc6guxqv9vzep-thumb.webp','/uploads/media/medium/mpc6guxqv9vzep-medium.webp','/uploads/media/full/mpc6guxqv9vzep-full.webp','2026-05-19 05:13:47.107','2026-05-19 05:13:47.107'),('cmpc6gvo500p5qb00lf7tme8g','mpc6gvkl7xyf0r.webp','The-Derma-Co-Pore-Minimizing-Face-Serum-with-4-Niacinamide-5-PHA-and-p-REFINYL%C2%AE-30ml.jpg','image/webp',22888,'The Derma Co Pore Minimizing Face Serum with 4% Niacinamide, 5% PHA and p-REFINYL® 30ml','The Derma Co Pore Minimizing Face Serum with 4 Niacinamide 5 PHA and p REFINYL%C2%AE 30ml',NULL,NULL,1166,1296,'/uploads/media/thumb/mpc6gvkl7xyf0r-thumb.webp','/uploads/media/medium/mpc6gvkl7xyf0r-medium.webp','/uploads/media/full/mpc6gvkl7xyf0r-full.webp','2026-05-19 05:13:47.862','2026-05-19 05:13:47.862'),('cmpc6gw5f00p8qb00jeb6vsav','mpc6gw2kcljgwi.webp','Innsaei-Low-pH-Daily-Gel-Cleanser-5.5-150ml.jpg','image/webp',13898,'Innsaei Low pH Daily Gel Cleanser 5.5 (150ml)','Innsaei Low pH Daily Gel Cleanser 5.5 150ml',NULL,NULL,1000,1000,'/uploads/media/thumb/mpc6gw2kcljgwi-thumb.webp','/uploads/media/medium/mpc6gw2kcljgwi-medium.webp','/uploads/media/full/mpc6gw2kcljgwi-full.webp','2026-05-19 05:13:48.483','2026-05-19 05:13:48.483'),('cmpc6gwso00pbqb00s9saqhln','mpc6gwnwp5ccqb.webp','whatsapp-image-2023-01-11-at-5.05.13-pm.webp','image/webp',42736,'YC Whitening Face Wash With Lemon Extract (50ml)','whatsapp image 2023 01 11 at 5.05.13 pm',NULL,NULL,1200,1200,'/uploads/media/thumb/mpc6gwnwp5ccqb-thumb.webp','/uploads/media/medium/mpc6gwnwp5ccqb-medium.webp','/uploads/media/full/mpc6gwnwp5ccqb-full.webp','2026-05-19 05:13:49.321','2026-05-19 05:13:49.321'),('cmpc6gx9n00pfqb00d3wo0pfl','mpc6gx6qf8siag.webp','The-Derma-Co-1-Hyaluronic-Sunscreen-Aqua-Ultra-Light-Gel-with-SPF50-PA-50g.jpg','image/webp',13354,'The Derma Co 1% Hyaluronic Sunscreen Aqua Ultra Light Gel with SPF50 PA++++ 50g','The Derma Co 1 Hyaluronic Sunscreen Aqua Ultra Light Gel with SPF50 PA 50g',NULL,NULL,1000,1000,'/uploads/media/thumb/mpc6gx6qf8siag-thumb.webp','/uploads/media/medium/mpc6gx6qf8siag-medium.webp','/uploads/media/full/mpc6gx6qf8siag-full.webp','2026-05-19 05:13:49.931','2026-05-19 05:13:49.931'),('cmpc6gxv200piqb00sncxnws7','mpc6gxsafme57c.webp','Kodomo-Baby-Lotion-180ml.jpg','image/webp',27412,'Kodomo Baby Lotion 180ml','Kodomo Baby Lotion 180ml',NULL,NULL,1000,1000,'/uploads/media/thumb/mpc6gxsafme57c-thumb.webp','/uploads/media/medium/mpc6gxsafme57c-medium.webp','/uploads/media/full/mpc6gxsafme57c-full.webp','2026-05-19 05:13:50.703','2026-05-19 05:13:50.703'),('cmpc6gy5100plqb00wx3pduvj','mpc6gy1m5i1vbr.webp','Simple-Kind-To-Skin-Hydrating-Light-Moisturiser-125ml.webp','image/webp',14266,'Simple Kind To Skin Hydrating Light Moisturiser 125ml','Simple Kind To Skin Hydrating Light Moisturiser 125ml',NULL,NULL,1080,1080,'/uploads/media/thumb/mpc6gy1m5i1vbr-thumb.webp','/uploads/media/medium/mpc6gy1m5i1vbr-medium.webp','/uploads/media/full/mpc6gy1m5i1vbr-full.webp','2026-05-19 05:13:51.061','2026-05-19 05:13:51.061'),('cmpc6gydu00poqb00dkdxh60e','mpc6gybmoyazvg.webp','Tretinoin-Tretin-0.05-Cream-30g.webp','image/webp',5228,'Tretinoin Tretin 0.05% Cream 30g','Tretinoin Tretin 0.05 Cream 30g',NULL,NULL,640,640,'/uploads/media/thumb/mpc6gybmoyazvg-thumb.webp','/uploads/media/medium/mpc6gybmoyazvg-medium.webp','/uploads/media/full/mpc6gybmoyazvg-full.webp','2026-05-19 05:13:51.378','2026-05-19 05:13:51.378'),('cmpc6gyoe00prqb00mx98e65n','mpc6gyluzns70y.webp','Simple-Kind-to-Skin-Refreshing-Facial-Gel-Wash-150ml-NEW.webp','image/webp',10900,'Simple Kind to Skin Refreshing Facial Gel Wash 150ml NEW','Simple Kind to Skin Refreshing Facial Gel Wash 150ml NEW',NULL,NULL,600,600,'/uploads/media/thumb/mpc6gyluzns70y-thumb.webp','/uploads/media/medium/mpc6gyluzns70y-medium.webp','/uploads/media/full/mpc6gyluzns70y-full.webp','2026-05-19 05:13:51.759','2026-05-19 05:13:51.759'),('cmpc6gzfp00puqb00k3zwnmvk','mpc6gz974h5wfx.webp','Dot-Key-Vitamin-C-E-Sunscreen-SPF-50-PA-50g.jpg','image/webp',36158,'Dot & Key Vitamin C + E Sunscreen SPF 50+ PA++++ 50g','Dot Key Vitamin C E Sunscreen SPF 50 PA 50g',NULL,NULL,1500,1500,'/uploads/media/thumb/mpc6gz974h5wfx-thumb.webp','/uploads/media/medium/mpc6gz974h5wfx-medium.webp','/uploads/media/full/mpc6gz974h5wfx-full.webp','2026-05-19 05:13:52.741','2026-05-19 05:13:52.741'),('cmpc6gzvl00pxqb0059c3k1t9','mpc6gzuax8yyuw.webp','PONDS-Hydra-Miracle-Light-Moisturiser-with-Cica-Hyamino-100ml.jpg','image/webp',7678,'POND\'S Hydra Miracle Super Light Gel with Cica Hyamino 100ml','PONDS Hydra Miracle Light Moisturiser with Cica Hyamino 100ml',NULL,NULL,470,470,'/uploads/media/thumb/mpc6gzuax8yyuw-thumb.webp','/uploads/media/medium/mpc6gzuax8yyuw-medium.webp','/uploads/media/full/mpc6gzuax8yyuw-full.webp','2026-05-19 05:13:53.313','2026-05-19 05:13:53.313'),('cmpc6h0i300q0qb00y7lurp8y','mpc6h0eh4xz5bd.webp','Kojie-San-Skin-Lightening-Kojic-Acid-Soap-3x-65g-Pack-of-3.png','image/webp',39430,'Kojie San Skin Lightening Kojic Acid Soap 3x 65g (Pack of 3)','Kojie San Skin Lightening Kojic Acid Soap 3x 65g Pack of 3',NULL,NULL,1000,1000,'/uploads/media/thumb/mpc6h0eh4xz5bd-thumb.webp','/uploads/media/medium/mpc6h0eh4xz5bd-medium.webp','/uploads/media/full/mpc6h0eh4xz5bd-full.webp','2026-05-19 05:13:54.124','2026-05-19 05:13:54.124'),('cmpc6h16j00q3qb00boooti8j','mpc6h11lxkkyn8.webp','Lafz-Onion-Seed-Oil-Shampoo-200ml.webp','image/webp',30026,'Lafz Onion Seed Oil Shampoo (200ml)','Lafz Onion Seed Oil Shampoo 200ml',NULL,NULL,1280,1280,'/uploads/media/thumb/mpc6h11lxkkyn8-thumb.webp','/uploads/media/medium/mpc6h11lxkkyn8-medium.webp','/uploads/media/full/mpc6h11lxkkyn8-full.webp','2026-05-19 05:13:55.003','2026-05-19 05:13:55.003'),('cmpc6h1tf00q6qb000crgko24','mpc6h1omgci1z2.webp','YC-Whitening-Face-Wash-Milk-Extract-50ml.webp','image/webp',36586,'YC Whitening Face Wash Milk Extract (50ml)','YC Whitening Face Wash Milk Extract 50ml',NULL,NULL,1240,1240,'/uploads/media/thumb/mpc6h1omgci1z2-thumb.webp','/uploads/media/medium/mpc6h1omgci1z2-medium.webp','/uploads/media/full/mpc6h1omgci1z2-full.webp','2026-05-19 05:13:55.827','2026-05-19 05:13:55.827'),('cmpc6h2m900q9qb009fjm7gr5','mpc6h2jltqhqml.webp','Maybelline-Fit-Me-Matte-Poreless-Liquid-Foundation-16H-Oil-Control-with-SPF-22-30ml.jpg','image/webp',9512,'Maybelline Fit Me Matte + Poreless Liquid Foundation 16H Oil Control with SPF 22, 30ml','Maybelline Fit Me Matte Poreless Liquid Foundation 16H Oil Control with SPF 22 30ml',NULL,NULL,900,900,'/uploads/media/thumb/mpc6h2jltqhqml-thumb.webp','/uploads/media/medium/mpc6h2jltqhqml-medium.webp','/uploads/media/full/mpc6h2jltqhqml-full.webp','2026-05-19 05:13:56.865','2026-05-19 05:13:56.865'),('cmpc6h3mh00qcqb00rghphipd','mpc6h3j0svnjdh.webp','Veet-Hair-Removal-Cream-Normal-Skin-100gm.jpg','image/webp',28484,'Veet Hair Removal Cream Normal Skin (100gm)','Veet Hair Removal Cream Normal Skin 100gm',NULL,NULL,900,900,'/uploads/media/thumb/mpc6h3j0svnjdh-thumb.webp','/uploads/media/medium/mpc6h3j0svnjdh-medium.webp','/uploads/media/full/mpc6h3j0svnjdh-full.webp','2026-05-19 05:13:58.169','2026-05-19 05:13:58.169'),('cmpc6h4n000qgqb00b5jrzc4w','mpc6h4jn9o7x2n.webp','Vaseline-Lip-Therapy-Original-Lip-Balm-4.8g.jpg','image/webp',44206,'Vaseline Lip Therapy Original Lip Balm 4.8g','Vaseline Lip Therapy Original Lip Balm 4.8g',NULL,NULL,867,1000,'/uploads/media/thumb/mpc6h4jn9o7x2n-thumb.webp','/uploads/media/medium/mpc6h4jn9o7x2n-medium.webp','/uploads/media/full/mpc6h4jn9o7x2n-full.webp','2026-05-19 05:13:59.485','2026-05-19 05:13:59.485'),('cmpc6h81300qlqb00tgxs2o1y','mpc6h7uxoykz8v.webp','LOreal-Paris-Elvive-Hydra-Pure-72h-Purifying-Shampoo-400ml.jpg','image/webp',35340,'L’Oréal Paris Elvive Hydra Pure 72h Purifying Shampoo 400ml','LOreal Paris Elvive Hydra Pure 72h Purifying Shampoo 400ml',NULL,NULL,2560,2560,'/uploads/media/thumb/mpc6h7uxoykz8v-thumb.webp','/uploads/media/medium/mpc6h7uxoykz8v-medium.webp','/uploads/media/full/mpc6h7uxoykz8v-full.webp','2026-05-19 05:14:03.879','2026-05-19 05:14:03.879'),('cmpc6h8td00qoqb00x7tgqjys','mpc6h8jtws4ex0.webp','Avene-Cicalfate-Restorative-Protective-Cream-40ml.jpg','image/webp',20300,'Avene Cicalfate+ Restorative Protective Cream 40ml','Avene Cicalfate Restorative Protective Cream 40ml',NULL,NULL,2400,2400,'/uploads/media/thumb/mpc6h8jtws4ex0-thumb.webp','/uploads/media/medium/mpc6h8jtws4ex0-medium.webp','/uploads/media/full/mpc6h8jtws4ex0-full.webp','2026-05-19 05:14:04.897','2026-05-19 05:14:04.897'),('cmpc6h92t00qrqb003aivrg6j','mpc6h907jiuh4v.webp','W.Dressroom-Moisturizing-Perfume-Hand-Cream-97-April-Cotton-20ml.webp','image/webp',14108,'W.Dressroom Moisturizing Perfume Hand Cream #97 April Cotton 20ml','W.Dressroom Moisturizing Perfume Hand Cream 97 April Cotton 20ml',NULL,NULL,760,760,'/uploads/media/thumb/mpc6h907jiuh4v-thumb.webp','/uploads/media/medium/mpc6h907jiuh4v-medium.webp','/uploads/media/full/mpc6h907jiuh4v-full.webp','2026-05-19 05:14:05.237','2026-05-19 05:14:05.237'),('cmpc6h9cw00qvqb007qdv07xr','mpc6h9aoyhatk8.webp','W.Dressroom-No.09-Gogo-Mango-Dress-Living-Clear-Perfume-70ml.webp','image/webp',6476,'W.Dressroom No.09 Gogo Mango Dress & Living Clear Perfume 70ml','W.Dressroom No.09 Gogo Mango Dress Living Clear Perfume 70ml',NULL,NULL,760,760,'/uploads/media/thumb/mpc6h9aoyhatk8-thumb.webp','/uploads/media/medium/mpc6h9aoyhatk8-medium.webp','/uploads/media/full/mpc6h9aoyhatk8-full.webp','2026-05-19 05:14:05.601','2026-05-19 05:14:05.601'),('cmpc6hac600qyqb00nildpiby','mpc6ha96zxqbl0.webp','APLB-Tranexamic-Acid-Niacinamide-Body-Lotion-%E2%80%93-300-ml.jpg','image/webp',22552,'APLB Tranexamic Acid Niacinamide Body Lotion – 300 ml','APLB Tranexamic Acid Niacinamide Body Lotion %E2%80%93 300 ml',NULL,NULL,900,900,'/uploads/media/thumb/mpc6ha96zxqbl0-thumb.webp','/uploads/media/medium/mpc6ha96zxqbl0-medium.webp','/uploads/media/full/mpc6ha96zxqbl0-full.webp','2026-05-19 05:14:06.870','2026-05-19 05:14:06.870'),('cmpc6hbom00r2qb0037tj6fqv','mpc6hbksl79g7d.webp','OMI-Sun-Bears-Active-Protect-Milk-Sunscreen-SPF-50-PA-30g2.jpg','image/webp',11016,'OMI Sun Bears Active Protect Milk Sunscreen SPF 50+ PA++++ 30g','OMI Sun Bears Active Protect Milk Sunscreen SPF 50 PA 30g2',NULL,NULL,900,900,'/uploads/media/thumb/mpc6hbksl79g7d-thumb.webp','/uploads/media/medium/mpc6hbksl79g7d-medium.webp','/uploads/media/full/mpc6hbksl79g7d-full.webp','2026-05-19 05:14:08.614','2026-05-19 05:14:08.614'),('cmpc6hcrl00r6qb005flcapl0','mpc6hco4bt0ob3.webp','APLB-Glutathione-Niacinamide-Skincare-4-Types-Sachet.jpg','image/webp',33432,'APLB Glutathione Niacinamide Skincare 4 Types Sachet','APLB Glutathione Niacinamide Skincare 4 Types Sachet',NULL,NULL,900,900,'/uploads/media/thumb/mpc6hco4bt0ob3-thumb.webp','/uploads/media/medium/mpc6hco4bt0ob3-medium.webp','/uploads/media/full/mpc6hco4bt0ob3-full.webp','2026-05-19 05:14:10.017','2026-05-19 05:14:10.017'),('cmpc6hdis00r9qb006wan12z3','mpc6hdcyqdnx1t.webp','Medicube-Zero-Pore-Moisture-Sun-Serum-SPF50-Pa50ml.jpg','image/webp',19882,'Medicube Zero Pore Moisture Sun Serum SPF50+ Pa++++50ml','Medicube Zero Pore Moisture Sun Serum SPF50 Pa50ml',NULL,NULL,2000,2000,'/uploads/media/thumb/mpc6hdcyqdnx1t-thumb.webp','/uploads/media/medium/mpc6hdcyqdnx1t-medium.webp','/uploads/media/full/mpc6hdcyqdnx1t-full.webp','2026-05-19 05:14:10.997','2026-05-19 05:14:10.997'),('cmpc6he8b00rdqb000czrept7','mpc6he3358eb59.webp','WishCare-AHA-BHA-Body-Lotion-For-Dry-Skin-200ml.jpg','image/webp',19474,'WishCare AHA BHA Body Lotion For Dry Skin 200ml','WishCare AHA BHA Body Lotion For Dry Skin 200ml',NULL,NULL,2004,2004,'/uploads/media/thumb/mpc6he3358eb59-thumb.webp','/uploads/media/medium/mpc6he3358eb59-medium.webp','/uploads/media/full/mpc6he3358eb59-full.webp','2026-05-19 05:14:11.915','2026-05-19 05:14:11.915'),('cmpc6heye00rgqb00dgkrl0dr','mpc6hes6kvn0at.webp','Dot-Key-Vitamin-C-E-Super-Bright-Gel-Face-Wash-100ml.jpg','image/webp',47740,'Dot & Key Vitamin C + E Super Bright Gel Face Wash 100ml','Dot Key Vitamin C E Super Bright Gel Face Wash 100ml',NULL,NULL,1500,1500,'/uploads/media/thumb/mpc6hes6kvn0at-thumb.webp','/uploads/media/medium/mpc6hes6kvn0at-medium.webp','/uploads/media/full/mpc6hes6kvn0at-full.webp','2026-05-19 05:14:12.855','2026-05-19 05:14:12.855'),('cmpc6hfxm00rjqb001f8scvlu','mpc6hft100sew4.webp','Chemist-at-Play-Daily-Exfoliating-Body-Wash-AHA-BHA-Vitamin-E-236ml.jpg','image/webp',33150,'Chemist at Play Daily Exfoliating Body Wash AHA BHA Vitamin E 236ml','Chemist at Play Daily Exfoliating Body Wash AHA BHA Vitamin E 236ml',NULL,NULL,1000,1000,'/uploads/media/thumb/mpc6hft100sew4-thumb.webp','/uploads/media/medium/mpc6hft100sew4-medium.webp','/uploads/media/full/mpc6hft100sew4-full.webp','2026-05-19 05:14:14.122','2026-05-19 05:14:14.122'),('cmpc6hgas00rmqb00n03tdj6s','mpc6hg6dl4iqoc.webp','salyzap-salicylic-acid-body-wash-for-acne-100ml.webp','image/webp',22868,'Fixderma Salyzap Body Wash For Body Acne 100ml','salyzap salicylic acid body wash for acne 100ml',NULL,NULL,1024,1024,'/uploads/media/thumb/mpc6hg6dl4iqoc-thumb.webp','/uploads/media/medium/mpc6hg6dl4iqoc-medium.webp','/uploads/media/full/mpc6hg6dl4iqoc-full.webp','2026-05-19 05:14:14.596','2026-05-19 05:14:14.596'),('cmpc6hgxr00rpqb00wtmwjgwy','mpc6hgtcde3l20.webp','Fixderma-Moisturizing-Cream-60gm.webp','image/webp',55754,'Fixderma Moisturizing Cream 60gm','Fixderma Moisturizing Cream 60gm',NULL,NULL,1024,1024,'/uploads/media/thumb/mpc6hgtcde3l20-thumb.webp','/uploads/media/medium/mpc6hgtcde3l20-medium.webp','/uploads/media/full/mpc6hgtcde3l20-full.webp','2026-05-19 05:14:15.423','2026-05-19 05:14:15.423'),('cmpc6hhd300rsqb00perx6uid','mpc6hhal6b7wig.webp','Fixderma-Moisturizing-Lotion-150gm.jpg','image/webp',18288,'Fixderma Moisturizing Lotion 150gm','Fixderma Moisturizing Lotion 150gm',NULL,NULL,800,900,'/uploads/media/thumb/mpc6hhal6b7wig-thumb.webp','/uploads/media/medium/mpc6hhal6b7wig-medium.webp','/uploads/media/full/mpc6hhal6b7wig-full.webp','2026-05-19 05:14:15.976','2026-05-19 05:14:15.976'),('cmpc6hicr00rvqb00ax0lirzd','mpc6hi9k6dywvj.webp','Fixderma-Skarfix-TX-De-Pigmentation-Brightening-Face-Serum-30ml.jpg','image/webp',34460,'Fixderma Skarfix TX De Pigmentation & Brightening Face Serum (30ml)','Fixderma Skarfix TX De Pigmentation Brightening Face Serum 30ml',NULL,NULL,900,900,'/uploads/media/thumb/mpc6hi9k6dywvj-thumb.webp','/uploads/media/medium/mpc6hi9k6dywvj-medium.webp','/uploads/media/full/mpc6hi9k6dywvj-full.webp','2026-05-19 05:14:17.260','2026-05-19 05:14:17.260'),('cmpc6hizn00ryqb00kvnoak2e','mpc6hiw9zyui8i.webp','ANUA-PDRN-100-Hyaluronic-Acid-Glow-Pad-60-Pads-180-ml.jpg','image/webp',14450,'ANUA PDRN 100 Hyaluronic Acid Glow Pad (60 Pads) 180 ml','ANUA PDRN 100 Hyaluronic Acid Glow Pad 60 Pads 180 ml',NULL,NULL,900,900,'/uploads/media/thumb/mpc6hiw9zyui8i-thumb.webp','/uploads/media/medium/mpc6hiw9zyui8i-medium.webp','/uploads/media/full/mpc6hiw9zyui8i-full.webp','2026-05-19 05:14:18.083','2026-05-19 05:14:18.083'),('cmpc6hjym00s2qb00m8jko1wi','mpc6hjvdfunwok.webp','Anua-Heartleaf-Silky-Moisture-Sun-Cream-SPF-50-PA-50ml.jpg','image/webp',10150,'Anua Heartleaf Silky Moisture Sun Cream SPF 50+ PA++++ 50ml','Anua Heartleaf Silky Moisture Sun Cream SPF 50 PA 50ml',NULL,NULL,900,900,'/uploads/media/thumb/mpc6hjvdfunwok-thumb.webp','/uploads/media/medium/mpc6hjvdfunwok-medium.webp','/uploads/media/full/mpc6hjvdfunwok-full.webp','2026-05-19 05:14:19.343','2026-05-19 05:14:19.343'),('cmpc6hkyg00s5qb00m8jaqa1f','mpc6hkutwwtfre.webp','ANUA-Heartleaf-Centella-Red-Spot-Cream.jpg','image/webp',19534,'ANUA Heartleaf Centella Red Spot Cream','ANUA Heartleaf Centella Red Spot Cream',NULL,NULL,900,900,'/uploads/media/thumb/mpc6hkutwwtfre-thumb.webp','/uploads/media/medium/mpc6hkutwwtfre-medium.webp','/uploads/media/full/mpc6hkutwwtfre-full.webp','2026-05-19 05:14:20.632','2026-05-19 05:14:20.632'),('cmpc6hlnb00s8qb00thacdjki','mpc6hlib490e5w.webp','Anua-Heartleaf-77-Clear-Pad-70ea-160ml.jpg','image/webp',27766,'Anua Heartleaf 77 Clear Pad 70ea 160ml','Anua Heartleaf 77 Clear Pad 70ea 160ml',NULL,NULL,1990,1994,'/uploads/media/thumb/mpc6hlib490e5w-thumb.webp','/uploads/media/medium/mpc6hlib490e5w-medium.webp','/uploads/media/full/mpc6hlib490e5w-full.webp','2026-05-19 05:14:21.527','2026-05-19 05:14:21.527');
/*!40000 ALTER TABLE `media` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order`
--

DROP TABLE IF EXISTS `order`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `order` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `customerName` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `customerPhone` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('PENDING','CONFIRMED','PROCESSING','SHIPPED','DELIVERED','CANCELLED') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PENDING',
  `total` double NOT NULL,
  `subtotal` double NOT NULL,
  `deliveryFee` double NOT NULL DEFAULT 0,
  `discount` double NOT NULL DEFAULT 0,
  `rewardPoints` int(11) NOT NULL DEFAULT 0,
  `deliveryAddress` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `deliveryCity` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deliveryArea` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deliveryState` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deliveryStateId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deliveryCityId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deliveryAreaId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deliverySlot` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `paymentMethod` enum('COD','CARD','BKASH','NAGAD') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'COD',
  `paymentStatus` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'UNPAID',
  `couponCode` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `notes` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `Order_userId_idx` (`userId`),
  KEY `Order_status_idx` (`status`),
  KEY `Order_deliveryStateId_idx` (`deliveryStateId`),
  KEY `Order_deliveryCityId_idx` (`deliveryCityId`),
  KEY `Order_deliveryAreaId_idx` (`deliveryAreaId`),
  CONSTRAINT `Order_deliveryAreaId_fkey` FOREIGN KEY (`deliveryAreaId`) REFERENCES `area` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `Order_deliveryCityId_fkey` FOREIGN KEY (`deliveryCityId`) REFERENCES `city` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `Order_deliveryStateId_fkey` FOREIGN KEY (`deliveryStateId`) REFERENCES `state` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `Order_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order`
--

LOCK TABLES `order` WRITE;
/*!40000 ALTER TABLE `order` DISABLE KEYS */;
/*!40000 ALTER TABLE `order` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orderitem`
--

DROP TABLE IF EXISTS `orderitem`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `orderitem` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `orderId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `productId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `variantId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `quantity` int(11) NOT NULL,
  `price` double NOT NULL,
  PRIMARY KEY (`id`),
  KEY `OrderItem_orderId_idx` (`orderId`),
  KEY `OrderItem_productId_fkey` (`productId`),
  KEY `OrderItem_variantId_fkey` (`variantId`),
  CONSTRAINT `OrderItem_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `order` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `OrderItem_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `product` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `OrderItem_variantId_fkey` FOREIGN KEY (`variantId`) REFERENCES `productvariant` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orderitem`
--

LOCK TABLES `orderitem` WRITE;
/*!40000 ALTER TABLE `orderitem` DISABLE KEYS */;
/*!40000 ALTER TABLE `orderitem` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `otpverification`
--

DROP TABLE IF EXISTS `otpverification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `otpverification` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `code` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `verified` tinyint(1) NOT NULL DEFAULT 0,
  `attempts` int(11) NOT NULL DEFAULT 0,
  `blockedUntil` datetime(3) DEFAULT NULL,
  `expiresAt` datetime(3) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `OTPVerification_phone_key` (`phone`),
  KEY `OTPVerification_phone_idx` (`phone`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `otpverification`
--

LOCK TABLES `otpverification` WRITE;
/*!40000 ALTER TABLE `otpverification` DISABLE KEYS */;
/*!40000 ALTER TABLE `otpverification` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `page`
--

DROP TABLE IF EXISTS `page`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `page` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` longtext COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `css` longtext COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'draft',
  `seoData` longtext COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Page_slug_key` (`slug`),
  KEY `Page_slug_idx` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `page`
--

LOCK TABLES `page` WRITE;
/*!40000 ALTER TABLE `page` DISABLE KEYS */;
/*!40000 ALTER TABLE `page` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product`
--

DROP TABLE IF EXISTS `product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `product` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `price` double NOT NULL,
  `stock` int(11) NOT NULL DEFAULT 0,
  `image` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `images` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `unit` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'piece',
  `weight` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `featured` tinyint(1) NOT NULL DEFAULT 0,
  `brandId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `shortDescription` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `specialPrice` double DEFAULT NULL,
  `specialPriceEnd` datetime(3) DEFAULT NULL,
  `specialPriceStart` datetime(3) DEFAULT NULL,
  `productType` enum('SIMPLE','VARIABLE') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'SIMPLE',
  `faqs` longtext COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `specifications` longtext COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `downsellProducts` longtext COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `upsellProducts` longtext COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `downsellCategoryIds` longtext COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `upsellCategoryIds` longtext COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `externalId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `seoData` longtext COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `averageRating` double NOT NULL DEFAULT 0,
  `ratingCount` int(11) NOT NULL DEFAULT 0,
  `comparePrice` double DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Product_slug_key` (`slug`),
  UNIQUE KEY `Product_externalId_key` (`externalId`),
  KEY `Product_slug_idx` (`slug`),
  KEY `Product_brandId_idx` (`brandId`),
  KEY `Product_name_idx` (`name`),
  CONSTRAINT `Product_brandId_fkey` FOREIGN KEY (`brandId`) REFERENCES `brand` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product`
--

LOCK TABLES `product` WRITE;
/*!40000 ALTER TABLE `product` DISABLE KEYS */;
INSERT INTO `product` VALUES ('cmpcf4w76000gqbv8q5cfefo6','Aloe Vera Soothing Gel','aloe-vera-soothing-gel','Pure cooling organic aloe vera gel for body and face hydration.',450,100,'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80','[\"https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80\"]','tube','150ml',1,NULL,'2026-05-19 09:16:25.218','2026-05-19 09:16:25.218',NULL,NULL,NULL,NULL,'SIMPLE',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,0,NULL),('cmpcf4w7h000hqbv8z3mqsij4','Vitamin C Glow Serum','vitamin-c-glow-serum','Highly effective daily vitamin C serum for brighter, radiant skin.',1200,50,'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80','[\"https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80\"]','bottle','30ml',1,NULL,'2026-05-19 09:16:25.230','2026-05-19 09:16:25.230',NULL,NULL,NULL,NULL,'SIMPLE',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,0,NULL),('cmpcf4w7l000iqbv8fgkibhkl','Tea Tree Cleansing Foam','tea-tree-cleansing-foam','Refreshing foam wash with natural tea tree extract for acne control.',650,75,'https://images.unsplash.com/photo-1556229174-5e42a09e45af?auto=format&fit=crop&w=800&q=80','[\"https://images.unsplash.com/photo-1556229174-5e42a09e45af?auto=format&fit=crop&w=800&q=80\"]','bottle','120ml',1,NULL,'2026-05-19 09:16:25.234','2026-05-19 09:16:25.234',NULL,NULL,NULL,NULL,'SIMPLE',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,0,NULL),('cmpcf4w7r000jqbv82fok71y0','Organic Red Apples','organic-red-apples','Sweet, crisp and juicy red apples sourced from local orchards.',280,200,'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=800&q=80','[\"https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=800&q=80\"]','kg','1kg',1,NULL,'2026-05-19 09:16:25.239','2026-05-19 09:16:25.239',NULL,NULL,NULL,NULL,'SIMPLE',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,0,NULL),('cmpcf4w7w000kqbv8h1fnqb9e','Fresh Organic Bananas','fresh-organic-bananas','Sweet organic yellow bananas rich in potassium and energy.',120,150,'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=800&q=80','[\"https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=800&q=80\"]','dozen','12pcs',1,NULL,'2026-05-19 09:16:25.244','2026-05-19 09:16:25.244',NULL,NULL,NULL,NULL,'SIMPLE',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,0,NULL),('cmpcf4w80000lqbv8mcy01m1h','Fresh Milk 1L','fresh-milk-1l','Pasteurized pure dairy milk from organic country farms.',95,80,'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=800&q=80','[\"https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=800&q=80\"]','bottle','1L',1,NULL,'2026-05-19 09:16:25.249','2026-05-19 09:16:25.249',NULL,NULL,NULL,NULL,'SIMPLE',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,0,NULL),('cmpcf4w84000mqbv8zf8d90wa','Brown Farm Eggs 12pcs','brown-farm-eggs-12pcs','Farm-fresh healthy brown eggs packed with proteins.',150,120,'https://images.unsplash.com/photo-1516448620398-c5f44bf9f441?auto=format&fit=crop&w=800&q=80','[\"https://images.unsplash.com/photo-1516448620398-c5f44bf9f441?auto=format&fit=crop&w=800&q=80\"]','box','12pcs',1,NULL,'2026-05-19 09:16:25.252','2026-05-19 09:16:25.252',NULL,NULL,NULL,NULL,'SIMPLE',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,0,NULL);
/*!40000 ALTER TABLE `product` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `productvariant`
--

DROP TABLE IF EXISTS `productvariant`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `productvariant` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `productId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sku` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `price` double NOT NULL,
  `stock` int(11) NOT NULL DEFAULT 0,
  `image` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `isDefault` tinyint(1) NOT NULL DEFAULT 0,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `specialPrice` double DEFAULT NULL,
  `enabled` tinyint(1) NOT NULL DEFAULT 1,
  `specialPriceEnd` datetime(3) DEFAULT NULL,
  `specialPriceStart` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ProductVariant_productId_idx` (`productId`),
  CONSTRAINT `ProductVariant_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `product` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `productvariant`
--

LOCK TABLES `productvariant` WRITE;
/*!40000 ALTER TABLE `productvariant` DISABLE KEYS */;
/*!40000 ALTER TABLE `productvariant` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `review`
--

DROP TABLE IF EXISTS `review`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `review` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `productId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `externalId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `rating` int(11) NOT NULL DEFAULT 5,
  `content` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `reviewer` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `reviewerEmail` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Review_externalId_key` (`externalId`),
  KEY `Review_productId_idx` (`productId`),
  CONSTRAINT `Review_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `product` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `review`
--

LOCK TABLES `review` WRITE;
/*!40000 ALTER TABLE `review` DISABLE KEYS */;
/*!40000 ALTER TABLE `review` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `setting`
--

DROP TABLE IF EXISTS `setting`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `setting` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `key` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Setting_key_key` (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `setting`
--

LOCK TABLES `setting` WRITE;
/*!40000 ALTER TABLE `setting` DISABLE KEYS */;
INSERT INTO `setting` VALUES ('cmpaybd7k0000qbq0lvjklt8s','HOME_PAGE_CONFIG','{\"blocks\":[{\"id\":\"block_c7ft9an8d\",\"type\":\"HeroBanner\",\"data\":{\"title\":\"Discover Natural Beauty\",\"subtitle\":\"Premium skincare for your daily routine\",\"ctaText\":\"Shop Now\",\"ctaHref\":\"/products\",\"imageSrc\":\"https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80\",\"textAlign\":\"left\"}},{\"id\":\"block_1vt89bsvf\",\"type\":\"SpecialOffersBanner\",\"data\":{\"title\":\"Special Offers\",\"subtitle\":\"Get the best deals\",\"ctaText\":\"Shop Now\",\"ctaHref\":\"/products?sort=discount\",\"bgColor\":\"from-blue-600 via-blue-700 to-indigo-800\",\"leftImageSrc\":\"https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=400&q=80\",\"rightImageSrc\":\"https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=400&q=80\",\"textAlign\":\"left\"}},{\"id\":\"block_d01jttht3\",\"type\":\"ProductShowcase\",\"data\":{\"title\":\"Shop by Category\",\"subtitle\":\"Browse our curated collection of premium products\",\"showcaseCategoryId\":\"all\",\"textAlign\":\"left\"}},{\"id\":\"block_i31o36r2x\",\"type\":\"ProductShowcase\",\"data\":{\"title\":\"Shop by Category\",\"subtitle\":\"Browse our curated collection of premium products\",\"showcaseCategoryId\":\"all\",\"textAlign\":\"left\"}},{\"id\":\"block_10jl8llpo\",\"type\":\"ProductShowcase\",\"data\":{\"title\":\"Shop by Category\",\"subtitle\":\"Browse our curated collection of premium products\",\"showcaseCategoryId\":\"all\",\"textAlign\":\"left\"}},{\"id\":\"block_j9p2les8u\",\"type\":\"PromoBadgeGrid\",\"data\":{}},{\"id\":\"block_amv3apig7\",\"type\":\"TestimonialSection\",\"data\":{\"title\":\"Real Results, Real Beauty\",\"subtitle\":\"See what our customers are saying\",\"textAlign\":\"center\"}},{\"id\":\"block_y2rbfbh5s\",\"type\":\"HotDealsSection\",\"data\":{}},{\"id\":\"block_zotqegkc6\",\"type\":\"ConsultationBanner\",\"data\":{\"title\":\"Doctor\'s Skincare Consultation\",\"subtitle\":\"Get personalized skincare advice from certified dermatologists\",\"ctaText\":\"Book Now\",\"ctaHref\":\"/consultation\",\"imageSrc\":\"https://images.unsplash.com/photo-1559599101-f09722fb4948?auto=format&fit=crop&w=800&q=80\",\"imageAlign\":\"right\"}},{\"id\":\"block_poupr53ph\",\"type\":\"RoutineBanner\",\"data\":{\"title\":\"Simplify Your Skincare Routine\",\"subtitle\":\"Curated just for you\",\"description\":\"Discover easy-to-follow skincare routines with products selected by experts to give you glowing, healthy skin every day.\",\"ctaText\":\"Explore Routines\",\"ctaHref\":\"/products\",\"imageSrc\":\"https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=600&q=80\",\"imageAlign\":\"left\"}},{\"id\":\"block_oroj7q9y6\",\"type\":\"NewArrivalsSection\",\"data\":{\"title\":\"Just Dropped\",\"subtitle\":\"NEW ARRIVALS\",\"ctaHref\":\"/products?sort=newest\"}}]}','2026-05-18 08:37:47.519','2026-05-18 08:39:07.313');
/*!40000 ALTER TABLE `setting` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `state`
--

DROP TABLE IF EXISTS `state`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `state` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `State_name_key` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `state`
--

LOCK TABLES `state` WRITE;
/*!40000 ALTER TABLE `state` DISABLE KEYS */;
INSERT INTO `state` VALUES ('cmpaq0cfg0004qbawykedbkcn','Rangpur Division','active','2026-05-18 04:45:16.397','2026-05-18 04:45:16.397'),('cmpaq0cfl0005qbaw5bf4o619','Mymensingh Division','active','2026-05-18 04:45:16.402','2026-05-18 04:45:16.402'),('cmpaq0cfp0006qbaw1bkhrmdk','Dhaka Division','active','2026-05-18 04:45:16.405','2026-05-18 04:45:16.405'),('cmpaq0cfr0007qbawc24yw59l','Barisal Division','active','2026-05-18 04:45:16.407','2026-05-18 04:45:16.407'),('cmpaq0cft0008qbaw0yoel6pg','Khulna Division','active','2026-05-18 04:45:16.409','2026-05-18 04:45:16.409'),('cmpaq0cg00009qbaw28p6wr07','Rajshahi Division','active','2026-05-18 04:45:16.417','2026-05-18 04:45:16.417'),('cmpaq0cg3000aqbawbktxbewt','Chittagong Division','active','2026-05-18 04:45:16.419','2026-05-18 04:45:16.419'),('cmpaq0cg4000bqbaw3xf977yy','Sylhet Division','active','2026-05-18 04:45:16.421','2026-05-18 04:45:16.421');
/*!40000 ALTER TABLE `state` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tag`
--

DROP TABLE IF EXISTS `tag`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tag` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Tag_name_key` (`name`),
  UNIQUE KEY `Tag_slug_key` (`slug`),
  KEY `Tag_slug_idx` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tag`
--

LOCK TABLES `tag` WRITE;
/*!40000 ALTER TABLE `tag` DISABLE KEYS */;
/*!40000 ALTER TABLE `tag` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `password` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `isGuest` tinyint(1) NOT NULL DEFAULT 0,
  `role` enum('USER','ADMIN','SUPER_ADMIN') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'USER',
  `permissions` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `city` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `area` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `gender` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `dateOfBirth` datetime(3) DEFAULT NULL,
  `rewardPoints` int(11) NOT NULL DEFAULT 0,
  `refreshToken` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `User_email_key` (`email`),
  UNIQUE KEY `User_phone_key` (`phone`),
  KEY `User_email_idx` (`email`),
  KEY `User_phone_idx` (`phone`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES ('cmpcf4vv30000qbv86314wrt3','rahat.ete@gmail.com','$2a$12$S59WcX.WL0eRNLG3o4jRxOYfpHaYUFs0vKwX9Ug1MI5xPRev3FDE6','Admin User','01700000000',0,'SUPER_ADMIN',NULL,NULL,NULL,NULL,NULL,NULL,0,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjbXBjZjR2djMwMDAwcWJ2ODYzMTR3cnQzIiwicm9sZSI6IlNVUEVSX0FETUlOIiwiaWF0IjoxNzc5MTg0NDIzLCJleHAiOjE3Nzk3ODkyMjN9.i5_KF2JF7PokEXwmqPiHweeVY9di5t3CyjpWNJwFMHU','2026-05-19 09:16:24.783','2026-05-19 09:53:43.068'),('cmpcf4w4k0001qbv8zf7kqc5z','user@freshcart.com','$2a$12$9FyfASJy5rR/3oXQVuTiXOeTNU/o0avenObRbYwSuPBE9zG6u9/Ye','Rahim Ahmed','01800000000',0,'USER',NULL,'123 Gulshan Avenue','Dhaka','Gulshan-2',NULL,NULL,0,NULL,'2026-05-19 09:16:25.124','2026-05-19 09:16:25.124');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `useraddress`
--

DROP TABLE IF EXISTS `useraddress`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `useraddress` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `label` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Home',
  `address` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `city` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `area` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `state` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `stateId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cityId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `areaId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `isDefault` tinyint(1) NOT NULL DEFAULT 0,
  `recipientName` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `recipientPhone` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `UserAddress_userId_idx` (`userId`),
  KEY `UserAddress_stateId_idx` (`stateId`),
  KEY `UserAddress_cityId_idx` (`cityId`),
  KEY `UserAddress_areaId_idx` (`areaId`),
  CONSTRAINT `UserAddress_areaId_fkey` FOREIGN KEY (`areaId`) REFERENCES `area` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `UserAddress_cityId_fkey` FOREIGN KEY (`cityId`) REFERENCES `city` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `UserAddress_stateId_fkey` FOREIGN KEY (`stateId`) REFERENCES `state` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `UserAddress_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `useraddress`
--

LOCK TABLES `useraddress` WRITE;
/*!40000 ALTER TABLE `useraddress` DISABLE KEYS */;
/*!40000 ALTER TABLE `useraddress` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `variantattribute`
--

DROP TABLE IF EXISTS `variantattribute`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `variantattribute` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `variantId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `VariantAttribute_variantId_idx` (`variantId`),
  CONSTRAINT `VariantAttribute_variantId_fkey` FOREIGN KEY (`variantId`) REFERENCES `productvariant` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `variantattribute`
--

LOCK TABLES `variantattribute` WRITE;
/*!40000 ALTER TABLE `variantattribute` DISABLE KEYS */;
/*!40000 ALTER TABLE `variantattribute` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `variation`
--

DROP TABLE IF EXISTS `variation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `variation` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Variation_name_key` (`name`),
  UNIQUE KEY `Variation_slug_key` (`slug`),
  KEY `Variation_slug_idx` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `variation`
--

LOCK TABLES `variation` WRITE;
/*!40000 ALTER TABLE `variation` DISABLE KEYS */;
/*!40000 ALTER TABLE `variation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `variationvalue`
--

DROP TABLE IF EXISTS `variationvalue`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `variationvalue` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `variationId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `VariationValue_value_variationId_key` (`value`,`variationId`),
  KEY `VariationValue_variationId_idx` (`variationId`),
  CONSTRAINT `VariationValue_variationId_fkey` FOREIGN KEY (`variationId`) REFERENCES `variation` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `variationvalue`
--

LOCK TABLES `variationvalue` WRITE;
/*!40000 ALTER TABLE `variationvalue` DISABLE KEYS */;
/*!40000 ALTER TABLE `variationvalue` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `wallettransaction`
--

DROP TABLE IF EXISTS `wallettransaction`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `wallettransaction` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `amount` double NOT NULL,
  `type` enum('TOPUP','DEDUCTION','REFUND') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'TOPUP',
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'COMPLETED',
  `note` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  KEY `WalletTransaction_userId_idx` (`userId`),
  CONSTRAINT `WalletTransaction_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wallettransaction`
--

LOCK TABLES `wallettransaction` WRITE;
/*!40000 ALTER TABLE `wallettransaction` DISABLE KEYS */;
/*!40000 ALTER TABLE `wallettransaction` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `wishlist`
--

DROP TABLE IF EXISTS `wishlist`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `wishlist` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `productId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `Wishlist_userId_productId_key` (`userId`,`productId`),
  KEY `Wishlist_productId_fkey` (`productId`),
  CONSTRAINT `Wishlist_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `product` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `Wishlist_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wishlist`
--

LOCK TABLES `wishlist` WRITE;
/*!40000 ALTER TABLE `wishlist` DISABLE KEYS */;
/*!40000 ALTER TABLE `wishlist` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `wordpresssetting`
--

DROP TABLE IF EXISTS `wordpresssetting`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `wordpresssetting` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `siteUrl` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `consumerKey` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `consumerSecret` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `apiVersion` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'wc/v3',
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wordpresssetting`
--

LOCK TABLES `wordpresssetting` WRITE;
/*!40000 ALTER TABLE `wordpresssetting` DISABLE KEYS */;
INSERT INTO `wordpresssetting` VALUES ('cmpc6btc40002qb008vv9g167','https://glowbd.com','BRk6QAtTUEoQOhMRa1lRT2YABAQMUURSFltXVRBMaEZHPFNSSzwKBARXBQ==','BQE6RVhTAEMROxIVbQkAQWtTAAcAURdcSwxbAkAQaEJIbl0GG2ZQUlEBBQ==','wc/v3','2026-05-19 05:09:51.556','2026-05-19 05:09:51.556');
/*!40000 ALTER TABLE `wordpresssetting` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-20 10:48:55
