# ************************************************************
# Sequel Pro SQL dump
# Version 4541
#
# http://www.sequelpro.com/
# https://github.com/sequelpro/sequelpro
#
# Host: intertoday.cyrj8prnlraf.ap-northeast-2.rds.amazonaws.com (MySQL 5.6.27)
# Database: fcedu
# Generation Time: 2016-12-28 09:16:51 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table assign_trainings
# ------------------------------------------------------------

DROP TABLE IF EXISTS `assign_trainings`;

CREATE TABLE `assign_trainings` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `assign_user_id` int(11) NOT NULL,
  `training_ids` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `title` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `about` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `assign_name` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `assign_trainings_assign_user_id_index` (`assign_user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

LOCK TABLES `assign_trainings` WRITE;
/*!40000 ALTER TABLE `assign_trainings` DISABLE KEYS */;

INSERT INTO `assign_trainings` (`id`, `assign_user_id`, `training_ids`, `title`, `about`, `assign_name`, `created_at`, `updated_at`)
VALUES
	(1,1,'181','1','20161203 새로운 교육','박석제','2016-12-26 16:11:28','2016-12-26 16:11:52'),
	(2,1,'178','1','일반상식','박석제','2016-12-26 16:17:48','2016-12-26 16:17:48'),
	(3,1,'181, 178','1','일반상식 외 1','박석제','2016-12-26 16:18:43','2016-12-26 16:18:43');

/*!40000 ALTER TABLE `assign_trainings` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table assign_users
# ------------------------------------------------------------

DROP TABLE IF EXISTS `assign_users`;

CREATE TABLE `assign_users` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `description` text COLLATE utf8_unicode_ci NOT NULL,
  `file_path` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

LOCK TABLES `assign_users` WRITE;
/*!40000 ALTER TABLE `assign_users` DISABLE KEYS */;

INSERT INTO `assign_users` (`id`, `title`, `description`, `file_path`, `created_at`, `updated_at`)
VALUES
	(1,'1','1','public/fbd9b4ff8fa14f1eccbd6a0a1f53097c.txt','2016-12-26 16:08:52','2016-12-26 16:48:36');

/*!40000 ALTER TABLE `assign_users` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table branches
# ------------------------------------------------------------

DROP TABLE IF EXISTS `branches`;

CREATE TABLE `branches` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `seq` int(11) NOT NULL DEFAULT '0',
  `isdel` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `branches` WRITE;
/*!40000 ALTER TABLE `branches` DISABLE KEYS */;

INSERT INTO `branches` (`id`, `name`, `seq`, `isdel`)
VALUES
	(1,'성동점',0,0),
	(2,'광진점',0,0),
	(3,'중랑점',0,0),
	(4,'동대문점',0,0),
	(5,'서초점',0,0),
	(6,'양재점',0,1),
	(7,'상계점',0,0),
	(8,'노원점',0,0),
	(9,'수락점',0,0),
	(10,'뚝섬점',0,0),
	(18,'창동점',0,0),
	(19,'강동점',0,0),
	(20,'수유점',0,0),
	(21,'압구정점',0,0),
	(22,'미아점',0,0),
	(23,'면목점',0,0),
	(24,'일산점',0,0),
	(25,'서대문점',0,0),
	(26,'광나루점',0,0),
	(27,'새로운점1',0,0),
	(28,'해운대점',0,0),
	(29,'새로운점2',0,0),
	(30,'Myworks',0,0),
	(31,'Wikibox',0,0),
	(32,'Kaymbo',0,0),
	(33,'Jaloo',0,0),
	(34,'Oozz',0,0),
	(35,'Wikizz',0,0),
	(36,'Yakidoo',0,0),
	(37,'Livefish',0,0),
	(38,'Cogilith',0,0),
	(39,'Skynoodle',0,0),
	(40,'Ailane',0,0),
	(41,'Quaxo',0,0),
	(42,'LiveZ',0,0),
	(43,'Linkbuzz',0,0),
	(44,'Dabfeed',0,0),
	(45,'Latz',0,0),
	(46,'Flashdog',0,0),
	(47,'Trunyx',0,0),
	(48,'Quinu',0,0),
	(49,'Divape',0,0),
	(50,'Gabcube',0,0),
	(51,'Browsedrive',0,0),
	(52,'Jatri',0,0),
	(53,'Riffpedia',0,0),
	(54,'Livetube',0,0),
	(55,'Yambee',0,0),
	(56,'Realmix',0,0),
	(57,'Zoozzy',0,0),
	(58,'Realpoint',0,0),
	(59,'Rhybox',0,0),
	(60,'Bubblebox',0,0),
	(61,'Voonder',0,0),
	(62,'Yodel',0,0),
	(63,'Jayo',0,0),
	(64,'Yata',0,0),
	(65,'Topicstorm',0,0),
	(66,'Edgetag',0,0),
	(67,'Tazzy',0,0),
	(68,'Pixoboo',0,0),
	(69,'Trilia',0,0),
	(70,'Thoughtstorm',0,0),
	(71,'Linkbridge',0,0),
	(72,'Thoughtbridge',0,0),
	(73,'Shufflester',0,0),
	(74,'Oodoo',0,0),
	(75,'Aivee',0,0),
	(76,'Mybuzz',0,0),
	(77,'Zooveo',0,0),
	(78,'Zoonoodle',0,0),
	(79,'Tagchat',0,0),
	(80,'Cogibox',0,0),
	(81,'Midel',0,0),
	(82,'Skyba',0,0),
	(83,'Innojam',0,0),
	(84,'Flashspan',0,0),
	(85,'Tambee',0,0),
	(86,'Tekfly',0,0),
	(87,'Trupe',0,0),
	(88,'Skinte',0,0),
	(89,'Photobug',0,0),
	(90,'Topicblab',0,0),
	(91,'Twitterwire',0,0),
	(92,'Aibox',0,0),
	(93,'Rhycero',0,0),
	(94,'Meezzy',0,0),
	(95,'Buzzshare',0,0),
	(96,'Zoovu',0,0),
	(97,'Skipfire',0,0),
	(98,'Feedspan',0,0),
	(99,'Yakijo',0,0),
	(100,'Jaxbean',0,0),
	(101,'Twimm',0,0),
	(102,'Edgeify',0,0),
	(103,'Gigashots',0,0),
	(104,'Yabox',0,0),
	(105,'Vinder',0,0),
	(106,'Dynabox',0,0),
	(107,'Jaxnation',0,0),
	(108,'Gigabox',0,0),
	(109,'Jabberstorm',0,0),
	(110,'Demivee',0,0),
	(111,'Demimbu',0,0),
	(112,'Skaboo',0,0),
	(113,'Quimba',0,0),
	(114,'Meemm',0,0),
	(115,'Mynte',0,0),
	(116,'Twitterlist',0,0),
	(117,'Photobean',0,0),
	(118,'Ntags',0,0),
	(119,'Eare',0,0),
	(120,'Skippad',0,0),
	(121,'Npath',0,0),
	(122,'Yotz',0,0),
	(123,'Topicware',0,0),
	(124,'Intertoday',0,0),
	(125,'테스2',0,0);

/*!40000 ALTER TABLE `branches` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table categories
# ------------------------------------------------------------

DROP TABLE IF EXISTS `categories`;

CREATE TABLE `categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;

INSERT INTO `categories` (`id`, `name`, `description`)
VALUES
	(1,'Web Programming','Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ultricies laoreet neque, vel vehicula sem posuere at. Nulla ac mi sit amet ex fermentum dignissim. Sed sollicitudin sem non porttitor venenatis. Aenean laoreet iaculis lorem eget feugiat. Nullam lorem libero, sodales sit amet magna in, semper vehicula tortor. Nam eget euismod mauris. Mauris quis risus ut ex cursus imperdiet vel vel mauris. Curabitur luctus id libero sit amet ultricies.'),
	(2,'Web Design','Aenean tristique cursus risus eu convallis. Integer leo turpis, sodales a enim vel, tempor elementum quam. Donec fermentum bibendum sagittis. Suspendisse interdum fringilla odio ac imperdiet. Sed pulvinar tristique ullamcorper. Sed eget augue non lectus lacinia pellentesque nec et velit. Sed consectetur pretium libero vitae vestibulum. Mauris ornare massa a odio euismod, quis volutpat nulla efficitur. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris vestibulum nisl et scelerisque hendrerit. Sed imperdiet fringilla sodales. Etiam eget placerat tellus, cursus luctus dolor. In maximus magna odio, vitae sagittis risus auctor vel. Donec congue semper nisi a vestibulum.'),
	(3,'Web Development','Etiam a felis gravida, pharetra turpis ut, elementum turpis. Nullam felis ipsum, elementum eget lectus in, viverra blandit ex. Ut in fringilla nisl, eget lacinia nibh. Nam dignissim arcu mi, eget maximus nunc fringilla et. Integer mi dolor, tristique at nunc sit amet, tempor tristique eros. Integer justo sem, placerat quis lorem eget, sollicitudin ultricies mi. Nunc aliquam, elit sit amet maximus pretium, urna ligula varius libero, et lobortis enim purus a mi. Maecenas ut quam eget lectus imperdiet placerat. Sed imperdiet id tellus in finibus. In ante dui, egestas sit amet tortor quis, congue tincidunt dui. Phasellus euismod facilisis urna, vel vestibulum mauris dictum eu.'),
	(4,'Business & Marketing','Ut euismod imperdiet porttitor. Sed accumsan malesuada nunc vitae mollis. Phasellus enim ligula, dapibus id tellus nec, egestas placerat lacus. Aenean turpis nisl, auctor vitae sapien vel, mollis vulputate ex. Morbi vitae mauris erat. Donec at tortor venenatis leo venenatis accumsan vitae at lorem. Vivamus mattis tempor arcu. Donec ultrices elit vel lorem convallis, suscipit blandit leo pellentesque. Maecenas nec massa sodales erat tempor blandit placerat ut urna. Donec enim augue, fringilla vel nunc vitae, consequat sollicitudin sapien. Duis eleifend, nibh eu porta aliquet, arcu neque faucibus nibh, quis euismod arcu risus ac nunc. Sed consectetur molestie risus, eget ultrices nunc consectetur non. Ut blandit, leo vitae molestie congue, magna erat ornare turpis, ut aliquet dolor diam scelerisque arcu.'),
	(5,'Search Engines','Morbi tempor varius nulla eget elementum. Quisque ac magna semper, pharetra urna at, imperdiet sem. Aliquam volutpat malesuada nulla quis convallis. Curabitur id finibus dui, eget pharetra nibh. Donec quis urna pellentesque, maximus ipsum sed, congue arcu. Aenean aliquet convallis turpis, at aliquam arcu scelerisque ut. Phasellus elementum neque sit amet sem mollis imperdiet. Morbi facilisis varius magna, eget porta enim tincidunt nec. Aenean in leo dui. Fusce pulvinar, ligula sodales molestie maximus, ante felis suscipit elit, vitae lacinia turpis neque vel turpis. Nunc vitae augue dui. Pellentesque eu mauris mattis, porta risus consequat, pretium sem. Cras mollis eu nibh eget rhoncus. Morbi eget est sed urna efficitur ultricies. Integer id turpis sagittis dolor lobortis blandit at vel nibh.');

/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table course_users
# ------------------------------------------------------------

DROP TABLE IF EXISTS `course_users`;

CREATE TABLE `course_users` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `training_user_id` int(11) DEFAULT NULL,
  `training_id` int(11) DEFAULT NULL,
  `course_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `seq` int(11) NOT NULL DEFAULT '0',
  `attempt_count` int(11) NOT NULL DEFAULT '0',
  `completed_rate` int(11) NOT NULL DEFAULT '0',
  `started_at` timestamp NULL DEFAULT NULL,
  `finished_at` timestamp NULL DEFAULT NULL,
  `playtime` int(11) NOT NULL DEFAULT '0',
  `exam_quiz_count` int(11) NOT NULL DEFAULT '0',
  `exam_quiz_correct_count` int(11) NOT NULL DEFAULT '0',
  `quiz_count` int(11) NOT NULL DEFAULT '0',
  `quiz_correct_count` int(11) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `course_users_training_user_id_course_id_user_id` (`training_user_id`,`course_id`,`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

LOCK TABLES `course_users` WRITE;
/*!40000 ALTER TABLE `course_users` DISABLE KEYS */;

INSERT INTO `course_users` (`id`, `training_user_id`, `training_id`, `course_id`, `user_id`, `seq`, `attempt_count`, `completed_rate`, `started_at`, `finished_at`, `playtime`, `exam_quiz_count`, `exam_quiz_correct_count`, `quiz_count`, `quiz_correct_count`, `created_at`, `updated_at`)
VALUES
	(1,1,181,77,94,2,0,0,NULL,NULL,0,0,0,0,0,'2016-12-20 17:00:22','2016-12-20 17:00:22'),
	(2,1,181,74,94,5,0,0,NULL,NULL,0,0,0,0,0,'2016-12-20 17:00:22','2016-12-20 17:00:22'),
	(3,1,181,75,94,5,0,0,NULL,NULL,0,0,0,0,0,'2016-12-20 17:00:22','2016-12-20 17:00:22'),
	(4,1,181,72,94,5,0,0,NULL,NULL,0,0,0,0,0,'2016-12-20 17:00:22','2016-12-20 17:00:22'),
	(5,1,181,73,94,5,0,0,NULL,NULL,0,0,0,0,0,'2016-12-20 17:00:22','2016-12-20 17:00:22'),
	(8,2,181,77,91,2,0,0,NULL,NULL,0,0,0,0,0,'2016-12-20 17:00:22','2016-12-20 17:00:22'),
	(9,2,181,74,91,5,0,0,NULL,NULL,0,0,0,0,0,'2016-12-20 17:00:22','2016-12-20 17:00:22'),
	(10,2,181,75,91,5,0,0,NULL,NULL,0,0,0,0,0,'2016-12-20 17:00:22','2016-12-20 17:00:22'),
	(11,2,181,72,91,5,0,0,NULL,NULL,0,0,0,0,0,'2016-12-20 17:00:22','2016-12-20 17:00:22'),
	(12,2,181,73,91,5,0,0,NULL,NULL,0,0,0,0,0,'2016-12-20 17:00:22','2016-12-20 17:00:22'),
	(15,3,181,77,92,2,0,0,NULL,NULL,0,0,0,0,0,'2016-12-20 17:00:22','2016-12-20 17:00:22'),
	(16,3,181,74,92,5,0,0,NULL,NULL,0,0,0,0,0,'2016-12-20 17:00:22','2016-12-20 17:00:22'),
	(17,3,181,75,92,5,0,0,NULL,NULL,0,0,0,0,0,'2016-12-20 17:00:22','2016-12-20 17:00:22'),
	(18,3,181,72,92,5,0,0,NULL,NULL,0,0,0,0,0,'2016-12-20 17:00:22','2016-12-20 17:00:22'),
	(19,3,181,73,92,5,0,0,NULL,NULL,0,0,0,0,0,'2016-12-20 17:00:22','2016-12-20 17:00:22'),
	(22,4,181,77,58,2,0,0,NULL,NULL,0,0,0,0,0,'2016-12-20 17:00:22','2016-12-20 17:00:22'),
	(23,4,181,74,58,5,0,0,NULL,NULL,0,0,0,0,0,'2016-12-20 17:00:22','2016-12-20 17:00:22'),
	(24,4,181,75,58,5,0,0,NULL,NULL,0,0,0,0,0,'2016-12-20 17:00:22','2016-12-20 17:00:22'),
	(25,4,181,72,58,5,0,0,NULL,NULL,0,0,0,0,0,'2016-12-20 17:00:22','2016-12-20 17:00:22'),
	(26,4,181,73,58,5,0,0,NULL,NULL,0,0,0,0,0,'2016-12-20 17:00:22','2016-12-20 17:00:22'),
	(29,5,181,77,56,2,0,0,NULL,NULL,0,0,0,0,0,'2016-12-20 17:00:22','2016-12-20 17:00:22'),
	(30,5,181,74,56,5,0,0,NULL,NULL,0,0,0,0,0,'2016-12-20 17:00:22','2016-12-20 17:00:22'),
	(31,5,181,75,56,5,0,0,NULL,NULL,0,0,0,0,0,'2016-12-20 17:00:22','2016-12-20 17:00:22'),
	(32,5,181,72,56,5,0,0,NULL,NULL,0,0,0,0,0,'2016-12-20 17:00:22','2016-12-20 17:00:22'),
	(33,5,181,73,56,5,0,0,NULL,NULL,0,0,0,0,0,'2016-12-20 17:00:22','2016-12-20 17:00:22'),
	(36,6,181,77,55,2,0,0,NULL,NULL,0,0,0,0,0,'2016-12-20 17:00:22','2016-12-20 17:00:22'),
	(37,6,181,74,55,5,0,0,NULL,NULL,0,0,0,0,0,'2016-12-20 17:00:22','2016-12-20 17:00:22'),
	(38,6,181,75,55,5,0,0,NULL,NULL,0,0,0,0,0,'2016-12-20 17:00:22','2016-12-20 17:00:22'),
	(39,6,181,72,55,5,0,0,NULL,NULL,0,0,0,0,0,'2016-12-20 17:00:22','2016-12-20 17:00:22'),
	(40,6,181,73,55,5,0,0,NULL,NULL,0,0,0,0,0,'2016-12-20 17:00:22','2016-12-20 17:00:22'),
	(43,7,181,77,54,2,0,0,NULL,NULL,0,0,0,0,0,'2016-12-20 17:00:22','2016-12-20 17:00:22'),
	(44,7,181,74,54,5,0,0,NULL,NULL,0,0,0,0,0,'2016-12-20 17:00:22','2016-12-20 17:00:22'),
	(45,7,181,75,54,5,0,0,NULL,NULL,0,0,0,0,0,'2016-12-20 17:00:22','2016-12-20 17:00:22'),
	(46,7,181,72,54,5,0,0,NULL,NULL,0,0,0,0,0,'2016-12-20 17:00:22','2016-12-20 17:00:22'),
	(47,7,181,73,54,5,0,0,NULL,NULL,0,0,0,0,0,'2016-12-20 17:00:22','2016-12-20 17:00:22'),
	(50,8,181,77,53,2,0,0,NULL,NULL,0,0,0,0,0,'2016-12-20 17:00:22','2016-12-20 17:00:22'),
	(51,8,181,74,53,5,0,0,NULL,NULL,0,0,0,0,0,'2016-12-20 17:00:22','2016-12-20 17:00:22'),
	(52,8,181,75,53,5,0,0,NULL,NULL,0,0,0,0,0,'2016-12-20 17:00:22','2016-12-20 17:00:22'),
	(53,8,181,72,53,5,0,0,NULL,NULL,0,0,0,0,0,'2016-12-20 17:00:22','2016-12-20 17:00:22'),
	(54,8,181,73,53,5,0,0,NULL,NULL,0,0,0,0,0,'2016-12-20 17:00:22','2016-12-20 17:00:22'),
	(57,9,181,77,52,2,0,0,NULL,NULL,0,0,0,0,0,'2016-12-20 17:00:22','2016-12-20 17:00:22'),
	(58,9,181,74,52,5,0,0,NULL,NULL,0,0,0,0,0,'2016-12-20 17:00:22','2016-12-20 17:00:22'),
	(59,9,181,75,52,5,0,0,NULL,NULL,0,0,0,0,0,'2016-12-20 17:00:22','2016-12-20 17:00:22'),
	(60,9,181,72,52,5,0,0,NULL,NULL,0,0,0,0,0,'2016-12-20 17:00:22','2016-12-20 17:00:22'),
	(61,9,181,73,52,5,0,0,NULL,NULL,0,0,0,0,0,'2016-12-20 17:00:22','2016-12-20 17:00:22'),
	(64,10,181,77,41,2,0,0,NULL,NULL,0,0,0,0,0,'2016-12-20 17:00:22','2016-12-20 17:00:22'),
	(65,10,181,74,41,5,0,0,NULL,NULL,0,0,0,0,0,'2016-12-20 17:00:22','2016-12-20 17:00:22'),
	(66,10,181,75,41,5,0,0,NULL,NULL,0,0,0,0,0,'2016-12-20 17:00:22','2016-12-20 17:00:22'),
	(67,10,181,72,41,5,0,0,NULL,NULL,0,0,0,0,0,'2016-12-20 17:00:22','2016-12-20 17:00:22'),
	(68,10,181,73,41,5,0,0,NULL,NULL,0,0,0,0,0,'2016-12-20 17:00:22','2016-12-20 17:00:22'),
	(71,11,181,77,40,2,0,0,NULL,NULL,0,0,0,0,0,'2016-12-20 17:00:22','2016-12-20 17:00:22'),
	(72,11,181,74,40,5,0,0,NULL,NULL,0,0,0,0,0,'2016-12-20 17:00:22','2016-12-20 17:00:22'),
	(73,11,181,75,40,5,0,0,NULL,NULL,0,0,0,0,0,'2016-12-20 17:00:22','2016-12-20 17:00:22'),
	(74,11,181,72,40,5,0,0,NULL,NULL,0,0,0,0,0,'2016-12-20 17:00:22','2016-12-20 17:00:22'),
	(75,11,181,73,40,5,0,0,NULL,NULL,0,0,0,0,0,'2016-12-20 17:00:22','2016-12-20 17:00:22'),
	(78,12,181,77,20,2,0,0,NULL,NULL,0,0,0,0,0,'2016-12-20 17:00:22','2016-12-20 17:00:22'),
	(79,12,181,74,20,5,0,0,NULL,NULL,0,0,0,0,0,'2016-12-20 17:00:22','2016-12-20 17:00:22'),
	(80,12,181,75,20,5,0,0,NULL,NULL,0,0,0,0,0,'2016-12-20 17:00:22','2016-12-20 17:00:22'),
	(81,12,181,72,20,5,0,0,NULL,NULL,0,0,0,0,0,'2016-12-20 17:00:22','2016-12-20 17:00:22'),
	(82,12,181,73,20,5,0,0,NULL,NULL,0,0,0,0,0,'2016-12-20 17:00:22','2016-12-20 17:00:22'),
	(85,13,181,77,2,2,1,75,'2016-12-27 15:28:58',NULL,14,0,0,5,3,'2016-12-20 17:00:22','2016-12-27 15:29:54'),
	(86,13,181,74,2,5,0,0,NULL,NULL,0,0,0,0,0,'2016-12-20 17:00:22','2016-12-20 17:00:22'),
	(87,13,181,75,2,5,0,0,NULL,NULL,0,0,0,0,0,'2016-12-20 17:00:22','2016-12-20 17:00:22'),
	(88,13,181,72,2,5,0,0,NULL,NULL,0,0,0,0,0,'2016-12-20 17:00:22','2016-12-20 17:00:22'),
	(89,13,181,73,2,5,0,0,NULL,NULL,0,0,0,0,0,'2016-12-20 17:00:22','2016-12-20 17:00:22'),
	(92,14,181,77,1,2,8,100,'2016-12-20 17:00:34','2016-12-20 17:01:37',34,0,0,5,3,'2016-12-20 17:00:22','2016-12-27 23:48:40'),
	(93,14,181,74,1,5,3,100,'2016-12-20 17:25:03','2016-12-20 17:25:37',16,3,1,2,0,'2016-12-20 17:00:22','2016-12-27 23:48:27'),
	(94,14,181,75,1,5,1,100,'2016-12-20 18:33:43','2016-12-20 18:33:54',0,0,0,3,2,'2016-12-20 17:00:22','2016-12-20 18:33:54'),
	(95,14,181,72,1,5,1,100,'2016-12-20 18:34:03','2016-12-20 18:35:00',14,7,2,2,1,'2016-12-20 17:00:22','2016-12-20 18:35:00'),
	(96,14,181,73,1,5,1,100,'2016-12-20 18:35:14','2016-12-20 18:36:32',12,5,1,3,2,'2016-12-20 17:00:22','2016-12-20 18:36:32');

/*!40000 ALTER TABLE `course_users` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table courses
# ------------------------------------------------------------

DROP TABLE IF EXISTS `courses`;

CREATE TABLE `courses` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `teacher` varchar(255) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `about` text,
  `grade` smallint(6) NOT NULL DEFAULT '0',
  `image` varchar(255) DEFAULT NULL,
  `create_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_activity` datetime DEFAULT NULL,
  `isdel` tinyint(1) NOT NULL DEFAULT '0',
  `ratings` int(11) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT COMMENT='강의정보';

LOCK TABLES `courses` WRITE;
/*!40000 ALTER TABLE `courses` DISABLE KEYS */;

INSERT INTO `courses` (`id`, `user_id`, `teacher`, `title`, `about`, `grade`, `image`, `create_date`, `last_activity`, `isdel`, `ratings`)
VALUES
	(68,NULL,'이재준','고급 알고리즘2','강의 질문은&nbsp;https://offline.startlink.help&nbsp;에서 해주세요!<br><br>새로운 고급 알고리즘 강의입니다.<br><br>날짜: 2016년 9월 19, 20, 21&nbsp;(오후 7시 ~ 10시), 24일 (오후 12시 30분&nbsp;~ 오후 3시 30분, 오후 3시 30분 ~ 오후 6시 30분), 25일 (오후 6시 ~ 오후 9시)<br>장소:&nbsp;강남역 CNN the Biz, 강남역 티오씨 팩토리, 강남역 공간더하기<br>커리큘럼9/19 기대값 다이나믹 프로그래밍<br><strong><em>9/20 다이나믹 프로그래밍 최적화</em></strong><br><strong>9/21 Suffix Array와 LCP</strong><br><strong>9/25&nbsp;FFT와 HLD</strong><br><span style=\"text-decoration: underline;\" data-mce-style=\"text-decoration: underline;\">9/24 세그먼트 트리 문제 풀이</span><br><span style=\"color: rgb(255, 0, 0);\" data-mce-style=\"color: #ff0000;\">9/24 네트워크 플로우 문제 풀이</span><br>상세 커리큘럼은 각 강의 페이지를 참고해주세요. (<a title=\"링크에 타이틀을 입력합니다.\" href=\"http://www.naver.com\" target=\"_blank\" data-mce-href=\"http://www.naver.com\">커리큘럼 항목 클릭!!</a>)<br><br><span style=\"color: rgb(51, 204, 204);\" data-mce-style=\"color: #33cccc;\"><strong>개별 수강도 가능합니다. 각 강의 페이지로 신청해주세요.</strong></span>',0,'img-20161024-580d8458e77bd','2016-09-30 16:03:18','2016-10-24 03:47:36',1,0),
	(69,NULL,NULL,'123','123',0,'placeholder.jpeg','2016-10-25 21:48:42',NULL,1,0),
	(70,NULL,'박석제','1차 새로운 강의를 등록합니다.','1차 강의',0,'img-20161027-58118447d4e45','2016-10-26 12:52:04','2016-10-27 04:36:00',1,0),
	(71,NULL,'강사명2','test','123',0,'placeholder.jpeg','2016-10-26 17:07:21',NULL,1,0),
	(72,NULL,'이재준','너도 알고 나도 아는 상식!!','상식은 상식이다.',0,'img-20161115-582abd41d8c90','2016-10-31 22:23:55','2016-11-15 07:46:10',0,0),
	(73,NULL,'박석제','일반상식 1','Lorem ipsum dolor sit amet, consectetur adipisicing elit. Id commodi voluptates, asperiores sit perspiciatis recusandae cum suscipit aliquid quia eligendi voluptate. Culpa eos, ut sequi voluptatum, quaerat quidem autem temporibus.',0,'noimage','2016-11-17 12:43:28','2016-11-17 03:54:12',0,0),
	(74,NULL,'박석제','일반상식 2','일반상식',0,'img-20161228-5862854865055','2016-11-17 12:55:27','2016-12-28 00:14:16',0,0),
	(75,NULL,'박석제','일반상식3','테스트',0,'img-20161205-5844fce597cda','2016-12-01 19:32:05','2016-12-05 05:36:37',0,0),
	(76,NULL,'1','1','1',0,'noimage','2016-12-05 19:41:43',NULL,1,0),
	(77,NULL,'이재준','새로운 강의 20161205','어떻게 하면 과연 어떻게 할까?',0,'noimage','2016-12-05 20:20:14',NULL,0,0),
	(78,NULL,'최순실','동영상','잘 살아보세',0,'img-20161228-5862847a374ef','2016-12-27 15:31:42','2016-12-28 00:10:50',0,0);

/*!40000 ALTER TABLE `courses` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table duties
# ------------------------------------------------------------

DROP TABLE IF EXISTS `duties`;

CREATE TABLE `duties` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `seq` int(11) NOT NULL DEFAULT '0',
  `isdel` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `duties` WRITE;
/*!40000 ALTER TABLE `duties` DISABLE KEYS */;

INSERT INTO `duties` (`id`, `name`, `seq`, `isdel`)
VALUES
	(1,'점주',0,0),
	(2,'매니저',0,0),
	(3,'사원',0,0),
	(5,'알바생',0,0),
	(7,'아르바이트',0,0),
	(8,'대리',0,0),
	(9,'기타',0,0),
	(10,'Engineer I',0,0),
	(11,'Programmer Analyst III',0,0),
	(12,'Financial Advisor',0,0),
	(13,'Software Engineer I',0,0),
	(14,'Accounting Assistant I',0,0),
	(15,'Nurse',0,0),
	(16,'Executive Secretary',0,0),
	(17,'Accounting Assistant II',0,0),
	(18,'Senior Sales Associate',0,0),
	(19,'Structural Analysis Engineer',0,0),
	(20,'Help Desk Operator',0,0),
	(21,'Community Outreach Specialist',0,0),
	(22,'Nuclear Power Engineer',0,0),
	(23,'Media Manager I',0,0),
	(24,'Legal Assistant',0,0),
	(25,'Cost Accountant',0,0),
	(26,'Chemical Engineer',0,0),
	(27,'Senior Editor',0,0),
	(28,'Tax Accountant',0,0),
	(29,'Environmental Tech',0,0),
	(30,'Geologist I',0,0),
	(31,'GIS Technical Architect',0,0),
	(32,'Help Desk Technician',0,0),
	(33,'Senior Cost Accountant',0,0),
	(34,'Payment Adjustment Coordinator',0,0),
	(35,'Safety Technician II',0,0),
	(36,'Actuary',0,0),
	(37,'Account Executive',0,0),
	(38,'Human Resources Assistant II',0,0),
	(39,'Senior Quality Engineer',0,0),
	(40,'Media Manager III',0,0),
	(41,'Mechanical Systems Engineer',0,0),
	(42,'Budget/Accounting Analyst IV',0,0),
	(43,'Product Engineer',0,0),
	(44,'Media Manager IV',0,0),
	(45,'Physical Therapy Assistant',0,0),
	(46,'Sales Representative',0,0),
	(47,'Speech Pathologist',0,0),
	(48,'Account Representative II',0,0),
	(49,'Analog Circuit Design manager',0,0),
	(50,'Geological Engineer',0,0),
	(51,'Recruiter',0,0),
	(52,'Senior Financial Analyst',0,0),
	(53,'Structural Engineer',0,0),
	(54,'Clinical Specialist',0,0),
	(55,'Office Assistant III',0,0),
	(56,'Paralegal',0,0),
	(57,'Office Assistant IV',0,0),
	(58,'Automation Specialist II',0,0),
	(59,'Compensation Analyst',0,0),
	(60,'Internal Auditor',0,0),
	(61,'Software Test Engineer II',0,0),
	(62,'Engineer II',0,0),
	(63,'Pharmacist',0,0),
	(64,'Recruiting Manager',0,0),
	(65,'Data Coordiator',0,0),
	(66,'Social Worker',0,0),
	(67,'Marketing Manager',0,0),
	(68,'Chief Design Engineer',0,0),
	(69,'Statistician III',0,0),
	(70,'Food Chemist',0,0),
	(71,'Software Engineer IV',0,0),
	(72,'Human Resources Assistant III',0,0),
	(73,'Graphic Designer',0,0),
	(74,'Biostatistician III',0,0),
	(75,'Assistant Manager',0,0),
	(76,'Librarian',0,0),
	(77,'Software Test Engineer I',0,0),
	(78,'VP Quality Control',0,0),
	(79,'Statistician I',0,0),
	(80,'Quality Engineer',0,0),
	(81,'Associate Professor',0,0),
	(82,'General Manager',0,0),
	(83,'VP Product Management',0,0);

/*!40000 ALTER TABLE `duties` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table employees
# ------------------------------------------------------------

DROP TABLE IF EXISTS `employees`;

CREATE TABLE `employees` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `branch` varchar(255) DEFAULT '',
  `duty` varchar(255) DEFAULT '',
  `isdel` tinyint(1) NOT NULL DEFAULT '0',
  `create_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `last_activity` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT COMMENT='회원정보';

LOCK TABLES `employees` WRITE;
/*!40000 ALTER TABLE `employees` DISABLE KEYS */;

INSERT INTO `employees` (`id`, `name`, `phone`, `email`, `password`, `branch`, `duty`, `isdel`, `create_date`, `last_activity`)
VALUES
	(10,'test5','0105555555','test5@example.com','$2y$10$.k52lExQFhVeziMZZGEX9.dgJfXeg.f5RkLJohvC31HCZ5pZC.JVi','1','3',0,'2016-09-08 20:50:42','2016-09-11 20:49:25'),
	(18,'test4','0104444444','test4@example.com','$2y$10$kDbfmVLR69Ogdhb3PljZ/eycrOPLIo3pCthd2Ph4IOYRc02TG3svC','1','1',0,'2016-09-08 21:29:20','2016-09-11 20:49:09'),
	(19,'test3','0103333333','test3@example.com','$2y$10$U/acZs5pZN8d5duzfRVS2uqa0d826cFXcExHdZHsJtvnXRYXFksoK','1','1',0,'2016-09-08 21:32:00','2016-09-11 20:48:55'),
	(20,'test2','0102222222','test3@example.com','$2y$10$cpaNO5Ua58OIvAnMokOcx.qps2CRFdhSf4aJHD4wCiwSvXdEFtA6m','1','1',0,'2016-09-09 12:33:33','2016-09-11 20:48:02'),
	(21,'test1','0101111111','test1@example.com','$2y$10$022gTxbuCJxSMwx6Tz750ekEJYegA4iDd.c3tY9BwawMjYk/whwzK','4','2',0,'2016-09-09 14:07:34','2016-09-12 22:33:57'),
	(23,'','','lucas@intertoday.com','$2y$10$DGD0hV932Ac5rWjVtBwC7O3N4yZOsO34T01rptRvOgJVfd8eMSZzS',NULL,NULL,1,'2016-09-12 19:10:34','2016-09-12 19:10:34'),
	(24,'','','1','$2y$10$YmRU/afGRtaPH0qMO0YMvueqUCk.aXsrJfCS0ZB3kl94jkCUA9fKu',NULL,NULL,1,'2016-09-12 19:14:13','2016-09-12 19:14:13'),
	(25,'1','1','','$2y$10$9.EH9dtiMB2No7Jra2579O5b8L11sfSB37.H3aaL4D4r.JQWkNG92',NULL,NULL,1,'2016-09-12 19:28:11','2016-09-12 19:28:11'),
	(26,'1','1','1','$2y$10$rUrWGIxvnQt3AmYgifpjCujxd/2VbomBI9ZvvG.hV/yNCpZ7pPBiS','1','1',1,'2016-09-12 19:45:46','2016-09-12 19:45:46'),
	(27,'1','1','1','$2y$10$BRGU7xxFobqrSNkJiYsfquY7Z.sCtic5NZ.qvbJHIQ6hGOMuwmzuK','1','1',1,'2016-09-12 19:52:36','2016-09-12 19:52:36');

/*!40000 ALTER TABLE `employees` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table migrations
# ------------------------------------------------------------

DROP TABLE IF EXISTS `migrations`;

CREATE TABLE `migrations` (
  `migration` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

LOCK TABLES `migrations` WRITE;
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;

INSERT INTO `migrations` (`migration`, `batch`)
VALUES
	('2016_09_29_105048_create_course_training_table',1),
	('2016_09_30_100239_create_users_table',2),
	('2016_10_04_073725_create_sessions_table',3),
	('2016_10_05_034844_create_user_trainings_table',4),
	('2016_10_10_124201_create_user_courses_table',5),
	('2016_10_12_053634_create_user_video_logs_table',5),
	('2016_10_12_053640_create_user_quiz_logs_table',5),
	('2016_10_14_104637_create_course_users_table',5),
	('2016_10_15_085751_create_training_users_table',5),
	('2016_11_17_021521_create_user_access_logs_table',6),
	('2016_12_03_050047_create_votes_table',6),
	('2016_12_12_185037_create_password_resets_table',6),
	('2016_12_19_161149_create_point_weights_table',6),
	('2016_12_20_050833_create_user_points_table',6),
	('2016_12_21_070151_create_assign_users_table',7),
	('2016_12_21_070212_create_assign_trainings_table',7);

/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table password_resets
# ------------------------------------------------------------

DROP TABLE IF EXISTS `password_resets`;

CREATE TABLE `password_resets` (
  `user_id` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `token` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `expiry_date` timestamp NULL DEFAULT NULL,
  `expired` tinyint(1) NOT NULL DEFAULT '0',
  KEY `password_resets_user_id_index` (`user_id`),
  KEY `password_resets_token_index` (`token`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;



# Dump of table point_weights
# ------------------------------------------------------------

DROP TABLE IF EXISTS `point_weights`;

CREATE TABLE `point_weights` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `value` int(11) NOT NULL DEFAULT '0',
  `point` int(11) NOT NULL DEFAULT '0',
  `isdel` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

LOCK TABLES `point_weights` WRITE;
/*!40000 ALTER TABLE `point_weights` DISABLE KEYS */;

INSERT INTO `point_weights` (`id`, `name`, `value`, `point`, `isdel`, `created_at`, `updated_at`)
VALUES
	(1,'교육 이수여부',45,27,0,NULL,'2016-12-28 01:54:08'),
	(2,'테스트/퀴즈 점수',19,11,0,NULL,'2016-12-28 01:54:08'),
	(3,'비디오 릴타임',5,3,0,NULL,'2016-12-27 23:58:12'),
	(4,'학습속도',77,46,0,NULL,'2016-12-28 01:54:09'),
	(5,'강의 반복 횟수',22,13,0,NULL,'2016-12-28 01:54:09');

/*!40000 ALTER TABLE `point_weights` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table quizzes
# ------------------------------------------------------------

DROP TABLE IF EXISTS `quizzes`;

CREATE TABLE `quizzes` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `session_content_id` int(11) DEFAULT NULL,
  `seq` tinyint(1) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `about` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `quiz_type` varchar(1) DEFAULT NULL,
  `answer` varchar(255) DEFAULT NULL,
  `point` smallint(6) NOT NULL DEFAULT '1',
  `options_count` tinyint(1) DEFAULT NULL,
  `option1` varchar(255) DEFAULT NULL,
  `option2` varchar(255) DEFAULT NULL,
  `option3` varchar(255) DEFAULT NULL,
  `option4` varchar(255) DEFAULT NULL,
  `option5` varchar(255) DEFAULT NULL,
  `create_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_activity` datetime DEFAULT NULL,
  `isdel` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT COMMENT='문항정보';

LOCK TABLES `quizzes` WRITE;
/*!40000 ALTER TABLE `quizzes` DISABLE KEYS */;

INSERT INTO `quizzes` (`id`, `session_content_id`, `seq`, `title`, `about`, `image`, `quiz_type`, `answer`, `point`, `options_count`, `option1`, `option2`, `option3`, `option4`, `option5`, `create_date`, `last_activity`, `isdel`)
VALUES
	(59,NULL,NULL,'1','1',NULL,'A','11',1,NULL,'','','','','','2016-09-27 18:12:27','2016-09-27 09:12:27',0),
	(60,NULL,NULL,'1','1',NULL,'A','1',1,NULL,'','','','','','2016-09-30 11:56:44','2016-09-30 02:56:44',0),
	(61,NULL,NULL,'1','1',NULL,'A','1',1,NULL,'','','','','','2016-09-30 12:08:34','2016-09-30 03:08:34',0),
	(62,NULL,NULL,'히스토그램에서 가장 큰 직사각형을 구하는 프로그램을 작성하시오.','히스토그램은 직사각형 여러 개가 아래쪽으로 정렬되어 있는 도형이다. 각 직사각형은 같은 너비를 가지고 있지만, 높이는 서로 다를 수도 있다. 예를 들어, 왼쪽 그림은 높이가 2, 1, 4, 5, 1, 3, 3이고 너비가 1인 직사각형으로 이루어진 히스토그램이다.',NULL,'A','',1,NULL,'','','','','','2016-09-30 16:10:42','2016-09-30 07:10:42',0),
	(63,NULL,NULL,'Final Test - Quiz 1','부연설명이 표시됩니다.',NULL,'B','0',1,NULL,'보기1','보기2','','','','2016-09-30 16:11:22','2016-10-06 12:45:29',0),
	(64,NULL,NULL,'Final Test - Quiz2','부연설명이 표시됩니다.',NULL,'C','0,2',1,NULL,'보기1','보기2','보기3','','','2016-09-30 16:11:41','2016-10-06 12:45:33',0),
	(65,37,NULL,'1','1',NULL,'A','1',1,NULL,'','','','','','2016-10-10 18:38:42','2016-10-10 09:38:42',0),
	(66,NULL,NULL,'밤에 가장 맛있는 음식은?','밤에 가장 사람들이 먹고 싶어 하는 음식을 물어봄으로써 어쩌고저쩌고...',NULL,'B','5',1,NULL,'치킨에 맥주','양꼬치에 칭따오','족발에 막걸리','삽겹살에 소주','답이 없음','2016-10-10 18:40:05','2016-10-24 12:39:36',0),
	(67,NULL,NULL,'1Question1','test',NULL,'B','1',1,NULL,'example1','example2','','','','2016-10-10 18:40:36','2016-10-13 02:30:53',0),
	(68,43,NULL,'Exam-Quiz1','Exam-Quiz1',NULL,'C','1,2',1,NULL,'1','2','3','','','2016-10-10 18:41:28','2016-10-10 09:41:28',0),
	(70,NULL,NULL,'세션 오더링을 검사하기 위해서 퀴즈를 하나 내겠습니다.','ㅁㄴㅇㄹ',NULL,'A','오더링',1,NULL,'','','','','','2016-10-24 21:59:48','2016-10-24 12:59:48',0),
	(71,NULL,NULL,'1','1',NULL,'C','2,3',1,NULL,'1','2','3','','','2016-10-25 20:05:46','2016-10-25 11:05:46',0),
	(72,43,NULL,'Exam-Quiz2','',NULL,'A','this',1,NULL,'','','','','','2016-10-25 20:19:38','2016-10-25 11:19:38',0),
	(73,NULL,NULL,'123','123',NULL,'A','123',1,NULL,'','','','','','2016-10-26 16:48:01','2016-10-26 07:48:48',0),
	(74,95,NULL,'1',NULL,NULL,'A',NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,'2016-10-29 16:17:17','2016-10-29 07:17:17',0),
	(91,99,1,'2',NULL,NULL,'A','1',1,0,NULL,NULL,NULL,NULL,NULL,'2016-10-29 19:10:50','2016-10-31 02:40:31',0),
	(92,99,1,'1',NULL,NULL,'B','1',1,2,'1','2',NULL,NULL,NULL,'2016-10-29 19:11:02','2016-10-29 10:11:02',0),
	(96,152,1,'123',NULL,NULL,'A','123',1,0,NULL,NULL,NULL,NULL,NULL,'2016-10-31 12:49:27','2016-10-31 03:49:27',1),
	(97,154,1,'123',NULL,NULL,'A','123',1,0,NULL,NULL,NULL,NULL,NULL,'2016-10-31 14:39:37','2016-10-31 05:39:37',0),
	(98,161,1,'1',NULL,NULL,'A','123',1,0,NULL,NULL,NULL,NULL,NULL,'2016-10-31 14:51:18','2016-10-31 05:51:41',0),
	(99,168,1,'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequuntur ea debitis soluta est accusamus blanditiis aliquid laboriosam at repellendus, mollitia! Aut eius accusantium in laudantium quidem ea debitis veritatis, repellendus!',NULL,NULL,'A','lorem',1,0,NULL,NULL,NULL,NULL,NULL,'2016-10-31 15:26:06','2016-11-07 07:08:18',0),
	(100,169,1,'당신이 좋아하는 색깔은 무엇입니까?',NULL,NULL,'C','1',1,5,'빨강','파랑','주황','노랑','초록','2016-10-31 15:29:25','2016-10-31 06:29:29',0),
	(101,169,2,'지구는 둥글다.',NULL,NULL,'B','1',1,2,'참','거짓',NULL,NULL,NULL,'2016-10-31 17:45:13','2016-10-31 08:45:13',0),
	(102,170,1,'A,B,C 중에 가장 먼저 오는 것은 A이다.',NULL,NULL,'B','1',1,2,'O','X',NULL,NULL,NULL,'2016-10-31 22:25:25','2016-10-31 13:25:25',0),
	(103,170,1,'1,2,3중에서 가장 높은 숫자는 1이다.',NULL,NULL,'B','2',1,2,'참','거짓',NULL,NULL,NULL,'2016-10-31 22:26:09','2016-10-31 13:26:09',0),
	(104,171,1,'다음중 가장 큰 숫자는 무엇인가?',NULL,NULL,'C','4',1,4,'1','2','3','4',NULL,'2016-10-31 22:29:02','2016-10-31 13:29:02',0),
	(105,171,1,'다음중 가장 작은 숫자는 무엇인가?',NULL,NULL,'C','1',1,5,'1','2','3','4','5','2016-10-31 22:29:30','2016-10-31 13:29:30',0),
	(106,171,1,'다음중 가운데 숫자는 무엇인가?',NULL,NULL,'C','3',1,5,'1','2','3','4','5','2016-10-31 22:29:47','2016-10-31 13:29:47',0),
	(107,171,1,'다음 중 두번째로 큰 숫자는 무엇인가?',NULL,NULL,'C','4',1,5,'1','2','3','4','5','2016-10-31 22:30:19','2016-10-31 13:30:19',0),
	(108,171,1,'다음중 뒤에서 두 번째로 높은 숫자는 무엇인가?',NULL,NULL,'C','4',1,5,'1','2','3','4','5','2016-10-31 22:31:44','2016-10-31 13:31:44',0),
	(109,181,1,'단답형1',NULL,NULL,'A','단답형1의 답',1,0,NULL,NULL,NULL,NULL,NULL,'2016-11-04 17:18:16','2016-11-04 08:18:16',0),
	(110,181,1,'당신은 남성인가 여성인가',NULL,NULL,'B','1',1,2,'여성','남성',NULL,NULL,NULL,'2016-11-04 17:18:53','2016-11-04 08:18:53',0),
	(111,182,1,'test1',NULL,NULL,'A','test1',1,0,NULL,NULL,NULL,NULL,NULL,'2016-11-04 17:19:45','2016-11-04 08:19:45',0),
	(112,192,1,'lucas의 본명은?',NULL,NULL,'B','1',1,2,'박석제','루카스',NULL,NULL,NULL,'2016-11-07 15:32:30','2016-11-07 06:32:30',0),
	(113,169,3,'1+1 = ?',NULL,NULL,'A','1',1,0,NULL,NULL,NULL,NULL,NULL,'2016-11-07 16:48:55','2016-11-07 07:48:55',0),
	(114,223,1,'test',NULL,NULL,'A','test',1,0,NULL,NULL,NULL,NULL,NULL,'2016-11-15 17:33:17','2016-11-15 08:33:17',0),
	(115,230,1,'1 - 1 = ?',NULL,NULL,'A','0',1,0,NULL,NULL,NULL,NULL,NULL,'2016-11-16 12:31:25','2016-11-16 03:31:25',0),
	(116,230,2,'치킨엔?',NULL,NULL,'B','1',1,2,'맥주','소주',NULL,NULL,NULL,'2016-11-16 12:43:19','2016-11-16 03:43:19',0),
	(117,232,1,'달핑이도 이빨이 있다.',NULL,NULL,'B','1',1,2,'참','거짓',NULL,NULL,NULL,'2016-11-17 12:45:29','2016-11-17 03:46:02',0),
	(118,232,1,'축구에서 드로잉한 공이 그대로 들어가면 골로 인정된다.',NULL,NULL,'B','2',1,2,'참','거짓',NULL,NULL,NULL,'2016-11-17 12:46:19','2016-11-17 03:53:07',0),
	(119,232,1,'용은 십장생의 하나이다.',NULL,NULL,'B','2',1,2,'참','거짓',NULL,NULL,NULL,'2016-11-17 12:46:50','2016-11-17 03:46:50',0),
	(120,233,1,'유교의 도덕적 사상에서 기본이 되는 3가지의 강령과 5가지의 인륜을 무엇이라 할까요?',NULL,NULL,'A','삼강오륜',1,0,NULL,NULL,NULL,NULL,NULL,'2016-11-17 12:47:46','2016-11-17 03:47:46',0),
	(121,233,1,'미국 캘리포니아주 남서부 애너하임에 위치해 있는 세계적인 유원지이자, 대규모의 오락시설인 이곳은 어디일까요?',NULL,NULL,'A','디즈니랜드',1,0,NULL,NULL,NULL,NULL,NULL,'2016-11-17 12:48:08','2016-11-17 03:48:08',0),
	(122,233,1,'다음 중에서 <부치는> 것은?',NULL,NULL,'C','2,4',1,4,'우표','짐','밥풀','편지',NULL,'2016-11-17 12:49:35','2016-11-17 03:49:35',0),
	(123,233,1,'물고기도 기침을 한다.',NULL,NULL,'B','1',1,2,'참','거짓',NULL,NULL,NULL,'2016-11-17 12:50:10','2016-11-17 03:50:10',0),
	(124,233,1,'소설이자 디즈니 애니메이션으로도 나온 <정글북> 의 주인공은?',NULL,NULL,'C','1',1,5,'아시아인','유럽인','북아메리카인','남아메리카인','알수없음','2016-11-17 12:52:06','2016-11-17 03:52:06',0),
	(125,235,1,'삽겹살은 황사예방 등 먼지제거에 좋은 음식이다.',NULL,NULL,'B','2',1,2,'참','거짓',NULL,NULL,NULL,'2016-11-17 12:59:08','2016-11-17 03:59:08',0),
	(126,235,1,'<말은 그럴 듯하게 하나 실천은 하지 않는 사람>을 __ 족이라 한다. 빈칸은?',NULL,NULL,'C','3',1,4,'APEC','ASEAN','NATO (Not Acting Talk Only)','UN',NULL,'2016-11-17 13:00:04','2016-11-17 04:00:04',0),
	(127,236,1,'축구에서 가장 흥미진진한 게임 스코어는 3대 2이다.',NULL,NULL,'B','1',1,2,'참','거짓',NULL,NULL,NULL,'2016-11-17 13:01:29','2016-11-17 04:02:43',0),
	(128,236,1,'서울특별시 광진구 자양동과 송파구 신천동을 잇는 한강의 다리이며, 1972년 7월에 준공 하였습니다 이곳은 어디일까요?',NULL,NULL,'A','잠실대교',1,0,NULL,NULL,NULL,NULL,NULL,'2016-11-17 13:01:57','2016-11-17 04:01:57',0),
	(129,236,1,'빵은 순수한 우리말이다.',NULL,'img-20161205-584520e080b02','B','2',1,2,'참','거짓',NULL,NULL,NULL,'2016-11-17 13:02:36','2016-12-05 08:10:08',0),
	(130,238,1,'123',NULL,'img-20161205-58450edab7710','A','123',1,0,NULL,NULL,NULL,NULL,NULL,'2016-12-05 14:42:45','2016-12-05 06:53:14',0),
	(131,239,1,'1234',NULL,'img-20161205-58450b2237eff','A','111',1,0,NULL,NULL,NULL,NULL,NULL,'2016-12-05 15:26:39','2016-12-05 06:37:22',0),
	(132,239,2,'2222',NULL,'img-20161205-58450fcdb3f61','B','1',1,2,'1','2',NULL,NULL,NULL,'2016-12-05 15:57:17','2016-12-05 06:57:17',0),
	(133,241,1,'첫번째 질문입니다. 답은 1이에요.',NULL,NULL,'A','1',1,0,NULL,NULL,NULL,NULL,NULL,'2016-12-05 20:26:11','2016-12-05 11:26:20',0),
	(134,241,1,'두번째 질문입니다. 답은 2에요.',NULL,NULL,'A','2',1,0,NULL,NULL,NULL,NULL,NULL,'2016-12-05 20:26:46','2016-12-05 11:26:46',0),
	(135,241,3,'34234234',NULL,NULL,'A','234324234',1,0,NULL,NULL,NULL,NULL,NULL,'2016-12-06 13:23:44','2016-12-06 04:23:44',1),
	(136,241,3,'sdafasf',NULL,NULL,'A','dfasdf',1,0,NULL,NULL,NULL,NULL,NULL,'2016-12-06 13:36:37','2016-12-06 04:36:37',1),
	(137,242,1,'퀴즈1. 우리 나라 국화는??',NULL,NULL,'A','무궁화',1,0,NULL,NULL,NULL,NULL,NULL,'2016-12-09 14:56:43','2016-12-09 14:56:50',0),
	(138,244,1,'Who am I?',NULL,NULL,'A','me',1,0,NULL,NULL,NULL,NULL,NULL,'2016-12-28 00:05:18','2016-12-28 00:05:18',0),
	(139,246,1,'what the fuck are you doing here?',NULL,NULL,'A','get outta here',1,0,NULL,NULL,NULL,NULL,NULL,'2016-12-28 00:07:26','2016-12-28 00:07:26',0);

/*!40000 ALTER TABLE `quizzes` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table session_contents
# ------------------------------------------------------------

DROP TABLE IF EXISTS `session_contents`;

CREATE TABLE `session_contents` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `course_id` int(11) DEFAULT NULL,
  `session_list_id` int(11) DEFAULT NULL,
  `content_id` int(11) DEFAULT NULL,
  `content_type` varchar(10) DEFAULT NULL,
  `content_title` varchar(255) NOT NULL,
  `content_about` varchar(100) DEFAULT NULL,
  `seq` smallint(6) NOT NULL DEFAULT '0' COMMENT '순서',
  `create_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_activity` datetime DEFAULT NULL,
  `isdel` tinyint(1) NOT NULL DEFAULT '0',
  `label` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT COMMENT='강의와 세션정보의 릴레이션 테이블';

LOCK TABLES `session_contents` WRITE;
/*!40000 ALTER TABLE `session_contents` DISABLE KEYS */;

INSERT INTO `session_contents` (`id`, `course_id`, `session_list_id`, `content_id`, `content_type`, `content_title`, `content_about`, `seq`, `create_date`, `last_activity`, `isdel`, `label`)
VALUES
	(35,NULL,108,35,'App\\Video','개념동영상','개념동영상을 시청하세요',0,'2016-09-30 16:09:58','2016-09-30 07:09:58',0,'비디오'),
	(36,NULL,108,62,'App\\Quiz','히스토그램에서 가장 큰 직사각형을 구하는 프로그램을 작성하시오.','히스토그램은 직사각형 여러 개가 아래쪽으로 정렬되어 있는 도형이다. 각 직사각형은 같은 너비를 가지고 있지만, 높이는 서로 다를 수도 있다. 예를 들어, 왼쪽 그림은 높이가 2, ',0,'2016-09-30 16:10:42','2016-09-30 07:10:42',0,'퀴즈'),
	(39,68,NULL,37,'App\\Video','test',NULL,1,'2016-10-10 18:39:55','2016-10-28 06:18:52',0,'비디오'),
	(42,68,NULL,66,'App\\Quiz','Question1','test1',8,'2016-10-10 18:40:46','2016-10-26 13:03:02',0,'퀴즈'),
	(43,68,NULL,NULL,'App\\Exam','Exam','',10,'2016-10-10 18:41:11','2016-10-26 13:03:02',0,'테스트'),
	(44,68,NULL,67,'App\\Quiz','Question1','test',0,'2016-10-10 21:55:33','2016-10-26 13:03:02',0,'퀴즈'),
	(47,68,NULL,38,'App\\Video','새로운 비디오를 생성하여 입력합니다. 과연 어떤 비디오가...','주저리주저리',2,'2016-10-10 21:59:46','2016-10-26 13:03:02',0,'비디오'),
	(49,68,NULL,66,'App\\Quiz','밤에 가장 맛있는 음식은?','밤에 가장 사람들이 먹고 싶어 하는 음식을 물어봄으로써 어쩌고저쩌고...',3,'2016-10-24 21:39:36','2016-10-26 13:03:02',0,'퀴즈'),
	(51,68,NULL,39,'App\\Video','사람은 무엇으로 사는가?',NULL,6,'2016-10-24 21:51:00','2016-10-28 06:21:15',0,'비디오'),
	(52,68,NULL,70,'App\\Quiz','세션 오더링을 검사하기 위해서 퀴즈를 하나 내겠습니다.','ㅁㄴㅇㄹ',7,'2016-10-24 21:59:48','2016-10-26 13:03:03',0,'퀴즈'),
	(53,68,NULL,71,'App\\Quiz','1','1',4,'2016-10-25 20:05:46','2016-10-26 13:03:02',0,'퀴즈'),
	(56,68,NULL,41,'App\\Video','재즈란?재즈란?재즈란?재즈란?재즈란?재즈란?재즈란?재즈란?재즈란?재즈란?재즈란?재즈란?재즈란?재즈란?재즈란?재즈란?재즈란?재즈란?',NULL,5,'2016-10-26 12:52:39','2016-10-28 06:19:23',0,'비디오'),
	(57,70,NULL,41,'App\\Video','강의비디오',NULL,0,'2016-10-26 12:52:39','2016-11-09 10:01:04',0,'비디오'),
	(168,70,NULL,NULL,'App\\Exam','Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequuntur ','',3,'2016-10-31 15:26:02','2016-11-01 02:29:19',0,'퀴즈'),
	(169,70,NULL,NULL,'App\\Exam','Exam','',4,'2016-10-31 15:27:20','2016-11-07 07:49:42',0,'테스트'),
	(170,72,NULL,NULL,'App\\Exam','[퀴즈1] 상식에 대해서 얼마나 알고 있는 퀴즈를 통해서 나의 상식을 알아보자.','',1,'2016-10-31 22:24:52','2016-11-15 07:16:39',0,'퀴즈'),
	(171,72,NULL,NULL,'App\\Exam','[테스트] 테스트를 통해서 얼마나 배웠는지 한 번 알아보자.','',2,'2016-10-31 22:28:46','2016-11-15 08:32:59',0,'테스트'),
	(181,68,NULL,NULL,'App\\Exam','final test','',11,'2016-11-04 17:17:26','2016-11-04 08:17:26',0,'테스트'),
	(182,68,NULL,NULL,'App\\Exam','final test2','',9,'2016-11-04 17:19:40','2016-11-04 08:19:40',0,'테스트'),
	(192,68,NULL,NULL,'App\\Exam','Final Test2','',13,'2016-11-07 15:31:58','2016-11-07 06:31:58',0,'테스트'),
	(222,72,NULL,74,'App\\Video','test2',NULL,0,'2016-11-15 17:23:09','2016-11-16 07:53:26',0,'비디오'),
	(230,72,NULL,NULL,'App\\Quiz','quiz','',4,'2016-11-16 12:31:16','2016-11-16 03:31:16',0,'퀴즈'),
	(231,73,NULL,75,'App\\Video','일반상식 공부방법',NULL,1,'2016-11-17 12:44:39','2016-11-17 03:44:39',0,'비디오'),
	(232,73,NULL,NULL,'App\\Quiz','상식 OX 문제','',1,'2016-11-17 12:45:03','2016-11-17 03:45:11',0,'퀴즈'),
	(233,73,NULL,NULL,'App\\Exam','파이널 테스트','',1,'2016-11-17 12:47:25','2016-11-17 03:47:25',0,'테스트'),
	(234,74,NULL,76,'App\\Video','조영식쌤의 까치 일반상식 이론 합격 강의',NULL,0,'2016-11-17 12:57:59','2016-11-17 03:57:59',0,'비디오'),
	(235,74,NULL,NULL,'App\\Quiz','상식 OX 문제','',1,'2016-11-17 12:58:20','2016-11-17 03:58:25',0,'퀴즈'),
	(236,74,NULL,NULL,'App\\Exam','파이널 테스트','',2,'2016-11-17 13:00:24','2016-11-17 04:00:24',0,'테스트'),
	(237,73,NULL,77,'App\\Video','비디오 생성',NULL,4,'2016-11-30 16:00:36','2016-11-30 07:00:36',0,'비디오'),
	(238,75,NULL,NULL,'App\\Quiz','test','',1,'2016-12-05 12:46:48','2016-12-05 03:46:48',0,'퀴즈'),
	(239,75,NULL,NULL,'App\\Quiz','test2','',2,'2016-12-05 15:26:29','2016-12-05 06:26:29',0,'퀴즈'),
	(240,77,NULL,78,'App\\Video','트와이스 TT',NULL,0,'2016-12-05 20:22:48','2016-12-06 13:05:28',0,'비디오'),
	(241,77,NULL,NULL,'App\\Quiz','퀴즈테스트1','',2,'2016-12-05 20:25:51','2016-12-05 11:25:51',0,'퀴즈'),
	(242,77,NULL,NULL,'App\\Quiz','퀴즈를 풀어봅시다.','',1,'2016-12-09 14:56:14','2016-12-09 14:56:14',0,'퀴즈'),
	(243,77,NULL,NULL,'App\\Quiz','우리나라','',4,'2016-12-27 15:07:51','2016-12-27 15:07:51',0,'퀴즈'),
	(244,78,NULL,NULL,'App\\Quiz','This is first question for you','',0,'2016-12-27 15:32:59','2016-12-28 00:08:23',0,'퀴즈'),
	(245,78,NULL,NULL,'App\\Exam','This is final Test you have to submit to us.','',2,'2016-12-27 15:35:10','2016-12-28 00:09:18',0,'테스트'),
	(246,78,NULL,NULL,'App\\Quiz','This is second question. It\'s very simple.','',1,'2016-12-27 15:51:18','2016-12-28 00:08:52',0,'퀴즈'),
	(247,78,NULL,NULL,'App\\Exam','123','',4,'2016-12-28 10:15:03','2016-12-28 10:15:03',0,'테스트');

/*!40000 ALTER TABLE `session_contents` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table session_exams
# ------------------------------------------------------------

DROP TABLE IF EXISTS `session_exams`;

CREATE TABLE `session_exams` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `session_list_id` int(11) DEFAULT NULL,
  `content_id` int(11) NOT NULL,
  `content_type` varchar(10) DEFAULT NULL,
  `content_title` varchar(255) NOT NULL,
  `content_about` varchar(100) DEFAULT NULL,
  `seq` smallint(6) NOT NULL DEFAULT '0' COMMENT '순서',
  `create_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_activity` datetime DEFAULT NULL,
  `isdel` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT COMMENT='강의와 세션정보의 릴레이션 테이블';

LOCK TABLES `session_exams` WRITE;
/*!40000 ALTER TABLE `session_exams` DISABLE KEYS */;

INSERT INTO `session_exams` (`id`, `session_list_id`, `content_id`, `content_type`, `content_title`, `content_about`, `seq`, `create_date`, `last_activity`, `isdel`)
VALUES
	(3,108,63,'App\\Quiz','Final Test - Quiz 1','부연설명이 표시됩니다.',0,'2016-09-30 16:11:23','2016-10-06 12:45:29',0),
	(4,108,64,'App\\Quiz','Final Test - Quiz2','부연설명이 표시됩니다.',0,'2016-09-30 16:11:41','2016-10-06 12:45:33',0);

/*!40000 ALTER TABLE `session_exams` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table session_lists
# ------------------------------------------------------------

DROP TABLE IF EXISTS `session_lists`;

CREATE TABLE `session_lists` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `course_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `seq` smallint(6) NOT NULL DEFAULT '0' COMMENT '순서',
  `create_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_activity` datetime DEFAULT NULL,
  `isdel` tinyint(1) NOT NULL DEFAULT '0',
  `ratings` int(11) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT COMMENT='강의와 세션정보의 릴레이션 테이블';

LOCK TABLES `session_lists` WRITE;
/*!40000 ALTER TABLE `session_lists` DISABLE KEYS */;

INSERT INTO `session_lists` (`id`, `course_id`, `title`, `seq`, `create_date`, `last_activity`, `isdel`, `ratings`)
VALUES
	(108,68,'9/19 기대값 다이나믹 프로그래밍',0,'2016-09-30 16:06:15',NULL,0,0),
	(109,68,'9/20 다이나믹 프로그래밍 최적화',0,'2016-09-30 16:06:35',NULL,0,0),
	(110,68,'9/21 Suffix Array와 LCP',0,'2016-09-30 16:06:45',NULL,0,0),
	(111,68,'9/25 FFT와 HLD',0,'2016-09-30 16:06:55',NULL,0,0),
	(112,68,'9/24 세그먼트 트리 문제 풀이',0,'2016-09-30 16:07:05',NULL,0,0),
	(113,68,'9/24 네트워크 플로우 문제 풀이',0,'2016-09-30 16:07:39',NULL,0,0);

/*!40000 ALTER TABLE `session_lists` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table sessions
# ------------------------------------------------------------

DROP TABLE IF EXISTS `sessions`;

CREATE TABLE `sessions` (
  `id` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `ip_address` varchar(45) COLLATE utf8_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8_unicode_ci,
  `payload` text COLLATE utf8_unicode_ci NOT NULL,
  `last_activity` int(11) NOT NULL,
  UNIQUE KEY `sessions_id_unique` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;

INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`)
VALUES
	('1mhKyHADxlM700kxhLxcV6rpakfndzLVh5Fu4Uie',54,'211.36.151.214','Mozilla/5.0 (Linux; Android 6.0.1; SM-G928L Build/MMB29K; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/55.0.2883.91 Mobile Safari/537.36;KAKAOTALK 1400257','YTo2OntzOjY6Il90b2tlbiI7czo0MDoiWHJXc2ZnVUJBRHZLb1RnZjJnYUlYbWZGSk5FZ25wcFRQcE9HSFF4VyI7czozOiJ1cmwiO2E6MDp7fXM6OToiX3ByZXZpb3VzIjthOjE6e3M6MzoidXJsIjtzOjM4OiJodHRwOi8vYWRtaW4tZGV2Mi5vcmFuZ2VuYW11Lm5ldC9sb2dpbiI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fXM6NTA6ImxvZ2luX3dlYl81OWJhMzZhZGRjMmIyZjk0MDE1ODBmMDE0YzdmNThlYTRlMzA5ODlkIjtpOjU0O3M6OToiX3NmMl9tZXRhIjthOjM6e3M6MToidSI7aToxNDgyOTEyMjU5O3M6MToiYyI7aToxNDgyOTEyMjI1O3M6MToibCI7czoxOiIwIjt9fQ==',1482912259),
	('2HRsBMugiHZiyanTnccfRXpXZyqlUKQcqzyHIcDH',NULL,'117.52.11.43','facebookexternalhit/1.1;kakaotalk-scrap/1.0;','YTo1OntzOjY6Il90b2tlbiI7czo0MDoiaWg4eVEwQjVadm9Vb0xoV1JiZktqSWdpS2Y2WEZPYUR5T3VYclRDZyI7czozOiJ1cmwiO2E6MTp7czo4OiJpbnRlbmRlZCI7czozMjoiaHR0cDovL2FkbWluLWRldjIub3JhbmdlbmFtdS5uZXQiO31zOjk6Il9wcmV2aW91cyI7YToxOntzOjM6InVybCI7czozMjoiaHR0cDovL2FkbWluLWRldjIub3JhbmdlbmFtdS5uZXQiO31zOjk6Il9zZjJfbWV0YSI7YTozOntzOjE6InUiO2k6MTQ4MjkxMDk2MztzOjE6ImMiO2k6MTQ4MjkxMDk2MztzOjE6ImwiO3M6MToiMCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=',1482910963),
	('aiOm2cZLOoQjZ6CijHNN4EBXHHJCYSCo9dwixsGB',54,'183.96.58.217','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.95 Safari/537.36','YTo2OntzOjY6Il90b2tlbiI7czo0MDoibXUwWnRTNVpHWGI1OWJ5NGRFSGtKQzYyQWNTVUdPU2JBT3NibGhUNyI7czozOiJ1cmwiO2E6MDp7fXM6OToiX3ByZXZpb3VzIjthOjE6e3M6MzoidXJsIjtzOjQyOiJodHRwOi8vYWRtaW4tZGV2Mi5vcmFuZ2VuYW11Lm5ldC9kYXNoYm9hcmQiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX1zOjUwOiJsb2dpbl93ZWJfNTliYTM2YWRkYzJiMmY5NDAxNTgwZjAxNGM3ZjU4ZWE0ZTMwOTg5ZCI7aTo1NDtzOjk6Il9zZjJfbWV0YSI7YTozOntzOjE6InUiO2k6MTQ4MjkxMDg4NztzOjE6ImMiO2k6MTQ4MjkxMDg3ODtzOjE6ImwiO3M6MToiMCI7fX0=',1482910887),
	('jHZ8goEZJ16Ry3aVpHuDmWvo2b2fjeMYhoKTZhBv',53,'223.62.3.39','Mozilla/5.0 (Linux; Android 6.0.1; SM-N920S Build/MMB29K; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/55.0.2883.91 Mobile Safari/537.36;KAKAOTALK 1400257','YTo2OntzOjY6Il90b2tlbiI7czo0MDoiR0RSU3Q0cG85RVcwS0VuVmtqZ3RyNmFMUE9ZZEhmbkVtaDB3bXNxQSI7czozOiJ1cmwiO2E6MDp7fXM6OToiX3ByZXZpb3VzIjthOjE6e3M6MzoidXJsIjtzOjM4OiJodHRwOi8vYWRtaW4tZGV2Mi5vcmFuZ2VuYW11Lm5ldC9sb2dpbiI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fXM6NTA6ImxvZ2luX3dlYl81OWJhMzZhZGRjMmIyZjk0MDE1ODBmMDE0YzdmNThlYTRlMzA5ODlkIjtpOjUzO3M6OToiX3NmMl9tZXRhIjthOjM6e3M6MToidSI7aToxNDgyOTE0ODc4O3M6MToiYyI7aToxNDgyOTEyMDE0O3M6MToibCI7czoxOiIwIjt9fQ==',1482914878),
	('lDrpXBCtSTUkoidqqsudm9WisFRjSuzGaKzgk1VV',NULL,'211.110.178.6','facebookexternalhit/1.1;kakaotalk-scrap/1.0;','YTo0OntzOjY6Il90b2tlbiI7czo0MDoiR09kUmRhUE1oa1h1Ym1YMjF6andPRDViRlU0cU5KeTM3YTkwVE1UUSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6Mzg6Imh0dHA6Ly9hZG1pbi1kZXYyLm9yYW5nZW5hbXUubmV0L2xvZ2luIjt9czo5OiJfc2YyX21ldGEiO2E6Mzp7czoxOiJ1IjtpOjE0ODI5MTIwMDE7czoxOiJjIjtpOjE0ODI5MTIwMDE7czoxOiJsIjtzOjE6IjAiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19',1482912001),
	('noasxx88dECMoQqBI4ZbO3DN28GQNljOYOnklErL',NULL,'211.110.178.6','facebookexternalhit/1.1;kakaotalk-scrap/1.0;','YTo1OntzOjY6Il90b2tlbiI7czo0MDoiTDlIQXlublhpRlg0SWtkcU1obEV6bXpnZEdkSElHYjZ2WmhBdnFwUiI7czozOiJ1cmwiO2E6MTp7czo4OiJpbnRlbmRlZCI7czozMjoiaHR0cDovL2FkbWluLWRldjIub3JhbmdlbmFtdS5uZXQiO31zOjk6Il9wcmV2aW91cyI7YToxOntzOjM6InVybCI7czozMjoiaHR0cDovL2FkbWluLWRldjIub3JhbmdlbmFtdS5uZXQiO31zOjk6Il9zZjJfbWV0YSI7YTozOntzOjE6InUiO2k6MTQ4MjkxMjAwMTtzOjE6ImMiO2k6MTQ4MjkxMjAwMTtzOjE6ImwiO3M6MToiMCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=',1482912001),
	('PGb6xsk79HbsFAsutTEa8DzxiI6JyICsAg9CqYn2',NULL,'183.96.58.217','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.95 Safari/537.36','YTo1OntzOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX1zOjY6Il90b2tlbiI7czo0MDoiNGprNm5Lb0puMzFsbm1yRGF0cDBWbDBlVklGYnhhTmdMNVlGSjlJRSI7czozOiJ1cmwiO2E6MTp7czo4OiJpbnRlbmRlZCI7czozMjoiaHR0cDovL2FkbWluLWRldjIub3JhbmdlbmFtdS5uZXQiO31zOjk6Il9wcmV2aW91cyI7YToxOntzOjM6InVybCI7czozODoiaHR0cDovL2FkbWluLWRldjIub3JhbmdlbmFtdS5uZXQvbG9naW4iO31zOjk6Il9zZjJfbWV0YSI7YTozOntzOjE6InUiO2k6MTQ4MjkxMDg5MTtzOjE6ImMiO2k6MTQ4MjkxMDg3ODtzOjE6ImwiO3M6MToiMCI7fX0=',1482910891),
	('qPnLfvLiyF7HPO7IBdxzyAkDZFxoMOoDNgxUyHkP',NULL,'117.52.11.43','facebookexternalhit/1.1;kakaotalk-scrap/1.0;','YTo0OntzOjY6Il90b2tlbiI7czo0MDoiTVBSSTVSekFwbU5nSFpoS2RTMFBoN1RBMDdLaUg0dUtCSWFaNVpXTCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6Mzg6Imh0dHA6Ly9hZG1pbi1kZXYyLm9yYW5nZW5hbXUubmV0L2xvZ2luIjt9czo5OiJfc2YyX21ldGEiO2E6Mzp7czoxOiJ1IjtpOjE0ODI5MTA5NjM7czoxOiJjIjtpOjE0ODI5MTA5NjM7czoxOiJsIjtzOjE6IjAiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19',1482910963);

/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table training_courses
# ------------------------------------------------------------

DROP TABLE IF EXISTS `training_courses`;

CREATE TABLE `training_courses` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `training_id` bigint(20) NOT NULL,
  `course_id` bigint(20) NOT NULL,
  `seq` smallint(6) NOT NULL DEFAULT '0' COMMENT '순서',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT COMMENT='강의와 세션 정보의 릴레이션 테이블';

LOCK TABLES `training_courses` WRITE;
/*!40000 ALTER TABLE `training_courses` DISABLE KEYS */;

INSERT INTO `training_courses` (`id`, `training_id`, `course_id`, `seq`)
VALUES
	(131,156,68,2),
	(132,157,68,2),
	(133,158,68,2),
	(134,159,68,2),
	(135,160,68,2),
	(136,165,70,3),
	(137,166,70,3),
	(138,161,68,3),
	(139,170,72,4),
	(140,175,70,4),
	(141,176,72,4),
	(142,166,72,3),
	(143,156,72,3),
	(144,178,74,4),
	(145,178,73,4),
	(146,179,72,4),
	(147,181,74,5),
	(148,181,75,5),
	(149,181,72,5),
	(150,181,73,5),
	(151,181,77,2),
	(152,184,78,7);

/*!40000 ALTER TABLE `training_courses` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table training_users
# ------------------------------------------------------------

DROP TABLE IF EXISTS `training_users`;

CREATE TABLE `training_users` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `training_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `assign_dt` date DEFAULT NULL,
  `due_dt` date DEFAULT NULL,
  `completed_rate` int(11) NOT NULL DEFAULT '0',
  `started_at` timestamp NULL DEFAULT NULL,
  `finished_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `training_users_training_id_user_id` (`training_id`,`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

LOCK TABLES `training_users` WRITE;
/*!40000 ALTER TABLE `training_users` DISABLE KEYS */;

INSERT INTO `training_users` (`id`, `training_id`, `user_id`, `assign_dt`, `due_dt`, `completed_rate`, `started_at`, `finished_at`, `created_at`, `updated_at`)
VALUES
	(1,181,94,'2016-12-03','2016-12-30',0,NULL,NULL,'2016-12-20 17:00:22','2016-12-20 17:35:55'),
	(2,181,91,'2016-12-03','2016-12-30',0,NULL,NULL,'2016-12-20 17:00:22','2016-12-20 17:35:55'),
	(3,181,92,'2016-12-03','2016-12-30',0,NULL,NULL,'2016-12-20 17:00:22','2016-12-20 17:35:55'),
	(4,181,58,'2016-12-03','2016-12-30',0,NULL,NULL,'2016-12-20 17:00:22','2016-12-20 17:35:55'),
	(5,181,56,'2016-12-03','2016-12-30',0,NULL,NULL,'2016-12-20 17:00:22','2016-12-20 17:35:55'),
	(6,181,55,'2016-12-03','2016-12-30',0,NULL,NULL,'2016-12-20 17:00:22','2016-12-20 17:35:55'),
	(7,181,54,'2016-12-03','2016-12-30',0,NULL,NULL,'2016-12-20 17:00:22','2016-12-20 17:35:55'),
	(8,181,53,'2016-12-03','2016-12-30',0,NULL,NULL,'2016-12-20 17:00:22','2016-12-20 17:35:55'),
	(9,181,52,'2016-12-03','2016-12-30',0,NULL,NULL,'2016-12-20 17:00:22','2016-12-20 17:35:55'),
	(10,181,41,'2016-12-03','2016-12-30',0,NULL,NULL,'2016-12-20 17:00:22','2016-12-20 17:35:55'),
	(11,181,40,'2016-12-03','2016-12-30',0,NULL,NULL,'2016-12-20 17:00:22','2016-12-20 17:35:55'),
	(12,181,20,'2016-12-03','2016-12-30',0,NULL,NULL,'2016-12-20 17:00:22','2016-12-20 17:35:55'),
	(13,181,2,'2016-12-03','2016-12-30',0,'2016-12-27 15:28:58',NULL,'2016-12-20 17:00:22','2016-12-27 15:28:58'),
	(14,181,1,'2016-12-03','2016-12-30',100,'2016-12-20 17:00:33','2016-12-27 23:47:47','2016-12-20 17:00:22','2016-12-27 23:47:47'),
	(99,181,196,'2016-12-03','2016-12-31',0,NULL,NULL,'2016-12-26 15:17:55','2016-12-26 15:21:32'),
	(100,181,198,'2016-12-03','2016-12-31',0,NULL,NULL,'2016-12-26 15:17:55','2016-12-26 15:21:32'),
	(101,181,197,'2016-12-03','2016-12-31',0,NULL,NULL,'2016-12-26 15:17:55','2016-12-26 15:21:32'),
	(102,181,199,'2016-12-03','2016-12-31',0,NULL,NULL,'2016-12-26 15:17:55','2016-12-26 15:21:32'),
	(103,178,196,'2016-11-29','2016-12-31',0,NULL,NULL,'2016-12-26 15:51:26','2016-12-26 15:51:26'),
	(104,178,198,'2016-11-29','2016-12-31',0,NULL,NULL,'2016-12-26 15:51:26','2016-12-26 15:51:26'),
	(105,178,197,'2016-11-29','2016-12-31',0,NULL,NULL,'2016-12-26 15:51:26','2016-12-26 15:51:26'),
	(106,178,199,'2016-11-29','2016-12-31',0,NULL,NULL,'2016-12-26 15:51:26','2016-12-26 15:51:26');

/*!40000 ALTER TABLE `training_users` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table trainings
# ------------------------------------------------------------

DROP TABLE IF EXISTS `trainings`;

CREATE TABLE `trainings` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `about` text NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `create_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_activity` datetime DEFAULT NULL,
  `isdel` smallint(6) NOT NULL DEFAULT '0',
  `assign_dt` date DEFAULT NULL,
  `due_dt` date DEFAULT NULL,
  `target` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT;

LOCK TABLES `trainings` WRITE;
/*!40000 ALTER TABLE `trainings` DISABLE KEYS */;

INSERT INTO `trainings` (`id`, `user_id`, `title`, `about`, `image`, `create_date`, `last_activity`, `isdel`, `assign_dt`, `due_dt`, `target`)
VALUES
	(156,NULL,'2016년 9월 고급 알고리즘','강의 질문은&nbsp;https://offline.startlink.help&nbsp;에서 해주세요!<br><br>새로운 고급 알고리즘 강의입니다.<br><br>날짜: 2016년 9월 19, 20, 21&nbsp;(오후 7시 ~ 10시), 24일 (오후 12시 30분&nbsp;~ 오후 3시 30분, 오후 3시 30분 ~ 오후 6시 30분), 25일 (오후 6시 ~ 오후 9시)<br>장소:&nbsp;강남역 CNN the Biz, 강남역 티오씨 팩토리, 강남역 공간더하기<br>커리큘럼9/19 기대값 다이나믹 프로그래밍<br>9/20 다이나믹 프로그래밍 최적화<br>9/21 Suffix Array와 LCP<br>9/25&nbsp;FFT와 HLD<br>9/24 세그먼트 트리 문제 풀이<br>9/24 네트워크 플로우 문제 풀이<br>상세 커리큘럼은 각 강의 페이지를 참고해주세요. (커리큘럼 항목 클릭!!)<br><br>개별 수강도 가능합니다. 각 강의 페이지로 신청해주세요.','img-20161024-580d84736a736','2016-09-30 15:57:59','2016-10-24 03:48:03',0,'2016-10-24','2016-10-31',NULL),
	(157,NULL,'1차 교육을 생성합니다.','1차 교육 내용입니다...','img-20161024-580df8c94a383','2016-10-24 21:04:25','2016-10-24 12:04:25',0,'2016-10-24','2016-10-31',NULL),
	(161,NULL,'2차 QA 교육을 등록합니다.','<span style=\"font-size: 8pt;\" data-mce-style=\"font-size: 8pt;\">폰트조절을 시도합니다.</span><br><span style=\"font-size: 10pt;\" data-mce-style=\"font-size: 10pt;\">폰트조절을 시도합니다.</span><br><span style=\"font-size: 12pt;\" data-mce-style=\"font-size: 12pt;\">폰트조절을 시도합니다.<br><span style=\"font-size: 14pt; font-family: \" data-mce-style=\"font-size: 14pt; font-family: \'arial black\', sans-serif;\">폰트조절을 시도합니다.</span></span><br>','img-20161026-581023980e888','2016-10-25 20:56:56','2016-10-26 03:31:36',0,'2016-10-26','2016-11-02',NULL),
	(165,NULL,'3차 QA 교육을 등록합니다.','3차 QA 교육을 등록합니다.','img-20161026-581023d8b2257','2016-10-26 12:32:40','2016-10-26 03:32:40',0,'2016-11-01','2016-11-07',NULL),
	(166,NULL,'4차 교육','4차 교육','placeholder.jpeg','2016-10-31 16:55:26',NULL,0,'2016-11-15','2016-11-29','점장'),
	(173,NULL,'5차 교육을 생성합니다.','.','placeholder.jpeg','2016-11-01 16:10:57',NULL,1,'2016-11-01','2016-11-08',NULL),
	(174,NULL,'5차 교육','.','img-20161101-5818403c84af7','2016-11-01 16:11:37','2016-11-01 07:11:37',1,'2016-11-01','2016-11-08',NULL),
	(175,NULL,'5차 교육','123','placeholder.jpeg','2016-11-01 16:13:13',NULL,1,'2016-11-01','2016-11-08',NULL),
	(176,NULL,'새로운 교육을 등록합니다.','새로운 교육을 등록합니다.','placeholder.jpeg','2016-11-02 15:43:25',NULL,0,'2016-11-07','2016-11-11',NULL),
	(177,NULL,'커피에 대하여','커피에 대하여','placeholder.jpeg','2016-11-14 16:33:33',NULL,0,'2016-11-14','2016-11-21','점원'),
	(178,NULL,'일반상식','일반상식/역사/인물/사회/경제/시사/국가/과학/지식/문학/소설/애니메이션/영화/만화/작품 등','img-20161117-582d2a7466e2d','2016-11-17 12:42:29','2016-11-17 03:56:36',0,'2016-11-29','2016-12-31','전체'),
	(179,NULL,'ㅕㅕㅕ','ㅐㅐ','placeholder.jpeg','2016-11-17 15:23:07',NULL,1,'2016-11-17','2016-11-24','ㅑㅑ'),
	(180,NULL,'1','1','placeholder.jpeg','2016-11-21 16:19:06',NULL,1,'2016-11-21','2016-11-28','1'),
	(181,NULL,'20161203 새로운 교육','점주','img-20161203-5842ae7837cfd','2016-12-03 20:30:23','2016-12-03 11:37:28',0,'2016-12-03','2016-12-31','점주만 대상으로 한다.'),
	(182,NULL,'1','1','placeholder.jpeg','2016-12-05 19:44:27',NULL,1,'2016-12-05','2016-12-12','1'),
	(183,NULL,'오렌지나무','월말정산 실무','placeholder.jpeg','2016-12-27 15:12:36',NULL,1,'2016-12-27','2017-01-03','전체'),
	(184,NULL,'박근혜','<p>잘 받아보아요</p>','placeholder.jpeg','2016-12-27 15:37:21',NULL,0,'2016-12-27','2017-01-03','점주');

/*!40000 ALTER TABLE `trainings` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table user_access_logs
# ------------------------------------------------------------

DROP TABLE IF EXISTS `user_access_logs`;

CREATE TABLE `user_access_logs` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `session_id` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `name` varchar(32) COLLATE utf8_unicode_ci DEFAULT NULL,
  `ip_address` varchar(45) COLLATE utf8_unicode_ci DEFAULT NULL,
  `device` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `browser` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `browser_version` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `platform` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `platform_version` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `login_at` timestamp NULL DEFAULT NULL,
  `logout_at` timestamp NULL DEFAULT NULL,
  `duration` int(11) DEFAULT NULL,
  `connect_url` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_access_logs_user_id_session_id_index` (`user_id`,`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

LOCK TABLES `user_access_logs` WRITE;
/*!40000 ALTER TABLE `user_access_logs` DISABLE KEYS */;

INSERT INTO `user_access_logs` (`id`, `user_id`, `session_id`, `name`, `ip_address`, `device`, `browser`, `browser_version`, `platform`, `platform_version`, `login_at`, `logout_at`, `duration`, `connect_url`)
VALUES
	(1,1,'DM3qmom0PaHQvz2zkae2lThkthpUgVnm264feEo9','박석제','127.0.0.1','Macintosh','Chrome','55.0.2883.95','OS X','10_12_1','2016-12-20 21:55:44',NULL,NULL,'http://localhost:8000'),
	(2,54,'tkhcTv4flyFVta8tih3vDlmOWDa8rYNbhpvjQXJz','박기범','211.36.158.136','WebKit','Chrome','55.0.2883.91','AndroidOS','6.0.1','2016-12-21 05:19:32',NULL,NULL,'http://m-dev.orangenamu.net'),
	(3,54,'ScEQg97C2SwhZWWRSmUfyRVuTg5E2vY8726IWc3v','박기범','211.36.147.107','WebKit','Chrome','55.0.2883.91','AndroidOS','6.0.1','2016-12-27 05:07:11',NULL,NULL,'http://m-dev.orangenamu.net'),
	(4,54,'GUpZvxfDhyFj7Nh2yjo7iYF1wdpydw4r8UJ3HOhC','박기범','211.36.147.107','WebKit','Chrome','55.0.2883.91','AndroidOS','6.0.1','2016-12-27 07:02:06',NULL,NULL,'http://m-dev.orangenamu.net'),
	(5,54,'VHMYdwIPebZVzkjTUnLEkYuGglWIqr5YeVVODriI','박기범','211.36.147.107','WebKit','Chrome','55.0.2883.91','AndroidOS','6.0.1','2016-12-27 09:26:04',NULL,NULL,'http://m-dev.orangenamu.net'),
	(6,2,'kZ1VBwHTPk1Mh6nwvlGZ6ujH2yzl4PzeHjnuelnX','이재준','1.231.175.130','iPhone','Safari','10.0','iOS','10_2','2016-12-27 15:28:46',NULL,NULL,'http://m-dev.orangenamu.net'),
	(7,1,'eSNELgK1CBfHNG1olEALaCcAA2KoIWQ81kZejzfa','박석제','175.252.217.24','iPhone','Safari','10.0','iOS','10_2','2016-12-27 23:41:24','2016-12-27 23:49:32',488,'http://m-dev.orangenamu.net'),
	(8,1,'08SILmSFegwkfFYEmVYIebE1rfZ4Z33tMGWGypXK','박석제','175.223.22.143','iPhone','Safari','10.0','iOS','10_2','2016-12-27 23:50:06','2016-12-27 23:50:31',25,'http://m-dev.orangenamu.net'),
	(9,54,'sueXbh8DxB5bdmx91myPBuYLARXfhXvbl2yhGxV9','박기범','211.36.147.107','WebKit','Chrome','55.0.2883.91','AndroidOS','6.0.1','2016-12-28 01:22:25',NULL,NULL,'http://m-dev.orangenamu.net');

/*!40000 ALTER TABLE `user_access_logs` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table user_courses
# ------------------------------------------------------------

DROP TABLE IF EXISTS `user_courses`;

CREATE TABLE `user_courses` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `parent_id` int(11) DEFAULT NULL,
  `lft` int(11) DEFAULT NULL,
  `rgt` int(11) DEFAULT NULL,
  `depth` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `training_user_id` int(11) DEFAULT NULL,
  `course_user_id` int(11) DEFAULT NULL,
  `session_content_id` int(11) DEFAULT NULL,
  `content_id` int(11) DEFAULT NULL,
  `content_title` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `content_type` varchar(10) COLLATE utf8_unicode_ci DEFAULT NULL,
  `seq` int(11) DEFAULT NULL,
  `attempt_count` int(11) NOT NULL DEFAULT '0',
  `started_at` timestamp NULL DEFAULT NULL,
  `finished_at` timestamp NULL DEFAULT NULL,
  `logs` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_courses_parent_id_index` (`parent_id`),
  KEY `user_courses_lft_index` (`lft`),
  KEY `user_courses_rgt_index` (`rgt`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

LOCK TABLES `user_courses` WRITE;
/*!40000 ALTER TABLE `user_courses` DISABLE KEYS */;

INSERT INTO `user_courses` (`id`, `parent_id`, `lft`, `rgt`, `depth`, `user_id`, `training_user_id`, `course_user_id`, `session_content_id`, `content_id`, `content_title`, `content_type`, `seq`, `attempt_count`, `started_at`, `finished_at`, `logs`, `created_at`, `updated_at`)
VALUES
	(1,NULL,1,10,0,1,14,92,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,NULL,'2016-12-20 17:00:33','2016-12-27 23:41:40'),
	(2,1,2,3,1,1,14,92,240,78,'트와이스 TT','App\\Video',1,5,'2016-12-20 17:00:34','2016-12-20 17:01:11','37','2016-12-20 17:00:33','2016-12-27 23:48:40'),
	(3,1,4,5,1,1,14,92,242,NULL,'퀴즈를 풀어봅시다.','App\\Quiz',2,7,'2016-12-20 17:01:11','2016-12-20 17:01:17','6;0/1;0','2016-12-20 17:00:33','2016-12-27 23:48:40'),
	(4,1,6,7,1,1,14,92,241,NULL,'퀴즈테스트1','App\\Quiz',3,7,'2016-12-20 17:01:17','2016-12-20 17:01:37','20;0/4;0','2016-12-20 17:00:33','2016-12-27 23:48:40'),
	(5,NULL,11,18,0,1,14,93,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,NULL,'2016-12-20 17:25:02','2016-12-27 23:41:40'),
	(6,5,12,13,1,1,14,93,234,76,'조영식쌤의 까치 일반상식 이론 합격 강의','App\\Video',1,3,'2016-12-20 17:25:03','2016-12-20 17:25:23','19','2016-12-20 17:25:02','2016-12-27 23:48:27'),
	(7,5,14,15,1,1,14,93,235,NULL,'상식 OX 문제','App\\Quiz',2,3,'2016-12-20 17:25:24','2016-12-20 17:25:31','7;2/2;0','2016-12-20 17:25:02','2016-12-27 23:48:27'),
	(8,5,16,17,1,1,14,93,236,NULL,'파이널 테스트','App\\Exam',3,3,'2016-12-20 17:25:31','2016-12-20 17:25:37','6;2/3;0','2016-12-20 17:25:03','2016-12-27 23:48:27'),
	(9,NULL,19,24,0,1,14,94,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,NULL,'2016-12-20 18:33:42','2016-12-27 23:41:40'),
	(10,9,20,21,1,1,14,94,238,NULL,'test','App\\Quiz',1,1,'2016-12-20 18:33:43','2016-12-20 18:33:48','3;1/1;1','2016-12-20 18:33:42','2016-12-27 23:41:40'),
	(11,9,22,23,1,1,14,94,239,NULL,'test2','App\\Quiz',2,2,'2016-12-20 18:33:48','2016-12-20 18:33:54','6;0/2;0','2016-12-20 18:33:42','2016-12-27 23:45:51'),
	(12,NULL,25,34,0,1,14,95,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,NULL,'2016-12-20 18:34:02','2016-12-27 23:41:40'),
	(13,12,26,27,1,1,14,95,222,74,'test2','App\\Video',1,2,'2016-12-20 18:34:03','2016-12-20 18:34:32','19','2016-12-20 18:34:02','2016-12-27 23:46:33'),
	(14,12,28,29,1,1,14,95,170,NULL,'[퀴즈1] 상식에 대해서 얼마나 알고 있는 퀴즈를 통해서 나의 상식을 알아보자.','App\\Exam',2,2,'2016-12-20 18:34:32','2016-12-20 18:34:43','11;2/2;0','2016-12-20 18:34:02','2016-12-27 23:46:41'),
	(15,12,30,31,1,1,14,95,171,NULL,'[테스트] 테스트를 통해서 얼마나 배웠는지 한 번 알아보자.','App\\Exam',3,2,'2016-12-20 18:34:43','2016-12-20 18:34:53','10;0/5;0','2016-12-20 18:34:02','2016-12-27 23:47:34'),
	(16,12,32,33,1,1,14,95,230,NULL,'quiz','App\\Quiz',4,2,'2016-12-20 18:34:53','2016-12-20 18:35:00','7;2/2;0','2016-12-20 18:34:02','2016-12-27 23:47:43'),
	(17,NULL,35,44,0,1,14,96,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,NULL,'2016-12-20 18:35:13','2016-12-27 23:41:40'),
	(18,17,36,37,1,1,14,96,231,75,'일반상식 공부방법','App\\Video',1,1,'2016-12-20 18:35:14','2016-12-20 18:35:59','21','2016-12-20 18:35:13','2016-12-27 23:41:40'),
	(19,17,38,39,1,1,14,96,232,NULL,'상식 OX 문제','App\\Quiz',2,1,'2016-12-20 18:35:59','2016-12-20 18:36:05','5;2/3;2','2016-12-20 18:35:14','2016-12-27 23:41:40'),
	(20,17,40,41,1,1,14,96,233,NULL,'파이널 테스트','App\\Exam',3,1,'2016-12-20 18:36:06','2016-12-20 18:36:14','6;1/5;1','2016-12-20 18:35:14','2016-12-27 23:41:40'),
	(21,17,42,43,1,1,14,96,237,77,'비디오 생성','App\\Video',4,1,'2016-12-20 18:36:14','2016-12-20 18:36:32',NULL,'2016-12-20 18:35:14','2016-12-27 23:41:40'),
	(22,NULL,45,54,0,2,NULL,85,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,NULL,'2016-12-27 15:28:57','2016-12-27 23:41:40'),
	(23,22,46,47,1,2,NULL,85,240,78,'트와이스 TT','App\\Video',1,1,'2016-12-27 15:28:58','2016-12-27 15:29:24','24','2016-12-27 15:28:57','2016-12-27 23:41:40'),
	(24,22,48,49,1,2,NULL,85,242,NULL,'퀴즈를 풀어봅시다.','App\\Quiz',2,1,'2016-12-27 15:29:24','2016-12-27 15:29:34','8;1/1;1','2016-12-27 15:28:58','2016-12-27 23:41:40'),
	(25,22,50,51,1,2,NULL,85,241,NULL,'퀴즈테스트1','App\\Quiz',3,1,'2016-12-27 15:29:34','2016-12-27 15:29:54','14;2/4;2','2016-12-27 15:28:58','2016-12-27 23:41:40'),
	(26,22,52,53,1,2,NULL,85,243,NULL,'우리나라','App\\Quiz',4,0,'2016-12-27 15:29:54',NULL,NULL,'2016-12-27 15:28:58','2016-12-27 23:41:40'),
	(27,1,8,9,1,1,NULL,92,243,NULL,'우리나라','App\\Quiz',4,0,'2016-12-27 23:41:40',NULL,NULL,'2016-12-27 23:41:40','2016-12-27 23:48:40');

/*!40000 ALTER TABLE `user_courses` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table user_points
# ------------------------------------------------------------

DROP TABLE IF EXISTS `user_points`;

CREATE TABLE `user_points` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `training_user_id` int(11) DEFAULT NULL,
  `training_id` int(11) DEFAULT NULL,
  `training_completed` decimal(5,2) NOT NULL DEFAULT '0.00',
  `quiz_completed` decimal(5,2) NOT NULL DEFAULT '0.00',
  `video_completed` decimal(5,2) NOT NULL DEFAULT '0.00',
  `training_speed` decimal(5,2) NOT NULL DEFAULT '0.00',
  `course_repeats` decimal(5,2) NOT NULL DEFAULT '0.00',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

LOCK TABLES `user_points` WRITE;
/*!40000 ALTER TABLE `user_points` DISABLE KEYS */;

INSERT INTO `user_points` (`id`, `user_id`, `training_user_id`, `training_id`, `training_completed`, `quiz_completed`, `video_completed`, `training_speed`, `course_repeats`, `created_at`, `updated_at`)
VALUES
	(1,1,14,181,1.00,0.40,0.93,1.00,1.00,'2016-12-20 21:56:08','2016-12-20 21:56:08'),
	(2,45,337,NULL,0.45,0.96,0.90,1.00,0.48,'2016-12-20 12:56:40','2016-12-20 12:56:40'),
	(3,38,66,NULL,0.05,0.86,0.88,0.53,0.60,'2016-12-20 12:56:40','2016-12-20 12:56:40'),
	(4,38,657,NULL,0.78,0.63,0.57,0.56,0.90,'2016-12-20 12:56:40','2016-12-20 12:56:40'),
	(5,47,867,NULL,0.38,0.54,0.26,0.17,0.36,'2016-12-20 12:56:40','2016-12-20 12:56:40'),
	(6,44,266,NULL,0.67,1.00,0.63,0.22,0.24,'2016-12-20 12:56:40','2016-12-20 12:56:40'),
	(7,54,450,NULL,0.65,0.89,0.08,0.01,0.02,'2016-12-20 12:56:40','2016-12-20 12:56:40'),
	(8,48,773,NULL,0.00,0.60,0.00,0.20,1.00,'2016-12-20 12:56:40','2016-12-20 12:56:40'),
	(9,100,878,NULL,0.00,0.92,0.35,0.04,0.13,'2016-12-20 12:56:40','2016-12-20 12:56:40'),
	(10,11,138,NULL,0.63,0.73,0.96,0.73,0.56,'2016-12-20 12:56:40','2016-12-20 12:56:40'),
	(11,39,314,NULL,0.79,0.05,0.68,0.00,0.27,'2016-12-20 12:56:40','2016-12-20 12:56:40'),
	(12,76,120,NULL,0.87,0.81,0.53,0.23,0.70,'2016-12-20 12:56:40','2016-12-20 12:56:40'),
	(13,71,969,NULL,0.53,0.90,0.04,0.60,1.00,'2016-12-20 12:56:40','2016-12-20 12:56:40'),
	(14,43,566,NULL,0.88,0.18,0.99,0.92,0.50,'2016-12-20 12:56:40','2016-12-20 12:56:40'),
	(15,60,853,NULL,0.00,0.77,0.42,0.36,0.91,'2016-12-20 12:56:40','2016-12-20 12:56:40'),
	(16,45,273,NULL,0.56,0.59,0.17,0.80,0.30,'2016-12-20 12:56:40','2016-12-20 12:56:40'),
	(17,33,3,NULL,0.60,0.31,0.51,0.32,0.29,'2016-12-20 12:56:40','2016-12-20 12:56:40'),
	(18,59,538,NULL,0.10,0.64,0.60,0.87,0.36,'2016-12-20 12:56:40','2016-12-20 12:56:40'),
	(19,75,697,NULL,0.11,0.31,0.38,0.08,0.13,'2016-12-20 12:56:40','2016-12-20 12:56:40'),
	(20,13,385,NULL,0.87,1.00,0.24,0.30,0.00,'2016-12-20 12:56:40','2016-12-20 12:56:40'),
	(21,49,174,NULL,1.00,0.04,0.06,1.00,0.61,'2016-12-20 12:56:40','2016-12-20 12:56:40'),
	(22,86,448,NULL,0.88,0.83,0.41,0.45,0.31,'2016-12-20 12:56:40','2016-12-20 12:56:40'),
	(23,73,293,NULL,0.29,0.65,0.90,0.45,0.26,'2016-12-20 12:56:40','2016-12-20 12:56:40'),
	(24,44,530,NULL,0.33,0.39,0.85,0.12,0.90,'2016-12-20 12:56:40','2016-12-20 12:56:40'),
	(25,3,369,NULL,0.90,0.49,0.93,0.30,0.90,'2016-12-20 12:56:40','2016-12-20 12:56:40'),
	(26,69,320,NULL,0.60,0.43,1.00,0.45,0.05,'2016-12-20 12:56:40','2016-12-20 12:56:40'),
	(27,91,277,NULL,0.30,0.67,0.24,0.17,0.68,'2016-12-20 12:56:40','2016-12-20 12:56:40'),
	(28,68,529,NULL,0.51,0.96,0.17,0.67,0.45,'2016-12-20 12:56:40','2016-12-20 12:56:40'),
	(29,99,867,NULL,0.45,0.95,0.30,0.07,0.30,'2016-12-20 12:56:40','2016-12-20 12:56:40'),
	(30,50,246,NULL,0.25,0.08,0.01,0.42,0.04,'2016-12-20 12:56:40','2016-12-20 12:56:40'),
	(31,58,253,NULL,0.70,0.62,0.33,0.43,0.00,'2016-12-20 12:56:40','2016-12-20 12:56:40'),
	(32,76,611,NULL,0.00,0.65,1.00,1.00,0.39,'2016-12-20 12:56:40','2016-12-20 12:56:40'),
	(33,31,522,NULL,0.18,0.85,0.91,0.65,0.50,'2016-12-20 12:56:40','2016-12-20 12:56:40'),
	(34,99,333,NULL,0.99,0.42,0.55,0.34,0.81,'2016-12-20 12:56:40','2016-12-20 12:56:40'),
	(35,14,182,NULL,0.70,0.03,0.83,0.81,0.53,'2016-12-20 12:56:40','2016-12-20 12:56:40'),
	(36,81,312,NULL,0.69,0.46,1.00,1.00,0.86,'2016-12-20 12:56:40','2016-12-20 12:56:40'),
	(37,85,112,NULL,0.92,0.00,0.57,0.00,0.82,'2016-12-20 12:56:40','2016-12-20 12:56:40'),
	(38,83,576,NULL,0.84,0.69,0.91,0.97,0.26,'2016-12-20 12:56:40','2016-12-20 12:56:40'),
	(39,4,774,NULL,0.38,0.00,0.07,0.19,0.55,'2016-12-20 12:56:40','2016-12-20 12:56:40'),
	(40,69,438,NULL,0.92,0.46,0.03,0.41,0.65,'2016-12-20 12:56:40','2016-12-20 12:56:40'),
	(41,81,374,NULL,0.83,0.21,0.37,0.57,0.36,'2016-12-20 12:56:40','2016-12-20 12:56:40'),
	(42,14,835,NULL,0.79,0.01,0.13,1.00,0.99,'2016-12-20 12:56:40','2016-12-20 12:56:40'),
	(43,85,470,NULL,0.35,0.68,0.35,0.12,0.80,'2016-12-20 12:56:40','2016-12-20 12:56:40'),
	(44,3,399,NULL,0.80,0.23,1.00,0.47,0.63,'2016-12-20 12:56:40','2016-12-20 12:56:40'),
	(45,22,961,NULL,0.59,0.10,0.02,0.06,0.00,'2016-12-20 12:56:40','2016-12-20 12:56:40'),
	(46,4,894,NULL,0.24,0.28,0.13,0.00,0.14,'2016-12-20 12:56:40','2016-12-20 12:56:40'),
	(47,77,325,NULL,0.59,0.00,0.60,1.00,0.84,'2016-12-20 12:56:40','2016-12-20 12:56:40'),
	(48,27,6,NULL,0.88,0.26,0.55,0.90,0.80,'2016-12-20 12:56:40','2016-12-20 12:56:40'),
	(49,78,808,NULL,0.45,0.79,0.00,0.65,0.32,'2016-12-20 12:56:40','2016-12-20 12:56:40'),
	(50,20,333,NULL,0.97,0.19,0.29,0.38,1.00,'2016-12-20 12:56:40','2016-12-20 12:56:40'),
	(51,66,901,NULL,0.09,0.50,0.53,0.35,0.20,'2016-12-20 12:56:40','2016-12-20 12:56:40');

/*!40000 ALTER TABLE `user_points` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table user_quiz_logs
# ------------------------------------------------------------

DROP TABLE IF EXISTS `user_quiz_logs`;

CREATE TABLE `user_quiz_logs` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `training_user_id` int(11) DEFAULT NULL,
  `course_user_id` int(11) DEFAULT NULL,
  `user_course_id` int(11) DEFAULT NULL,
  `content_type` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `quiz_id` int(11) DEFAULT NULL,
  `first_answer` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `attempt_count` int(11) NOT NULL DEFAULT '0',
  `completed` int(11) NOT NULL DEFAULT '0',
  `point` int(11) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

LOCK TABLES `user_quiz_logs` WRITE;
/*!40000 ALTER TABLE `user_quiz_logs` DISABLE KEYS */;

INSERT INTO `user_quiz_logs` (`id`, `training_user_id`, `course_user_id`, `user_course_id`, `content_type`, `quiz_id`, `first_answer`, `attempt_count`, `completed`, `point`, `created_at`, `updated_at`)
VALUES
	(1,14,92,3,'App\\Quiz',137,'무궁화',7,1,1,'2016-12-20 17:01:24','2016-12-20 21:55:58'),
	(2,14,92,4,'App\\Quiz',133,'1',7,1,1,'2016-12-20 17:01:34','2016-12-20 21:56:00'),
	(3,14,92,4,'App\\Quiz',134,'2',7,1,1,'2016-12-20 17:01:34','2016-12-20 21:56:00'),
	(4,14,92,4,'App\\Quiz',135,'1',7,0,0,'2016-12-20 17:01:34','2016-12-20 21:56:00'),
	(5,14,92,4,'App\\Quiz',136,'1',7,0,0,'2016-12-20 17:01:35','2016-12-20 21:56:00'),
	(6,14,93,7,'App\\Quiz',125,'1',3,0,0,'2016-12-20 17:25:29','2016-12-27 23:42:48'),
	(7,14,93,7,'App\\Quiz',126,'1',3,0,0,'2016-12-20 17:25:29','2016-12-27 23:42:48'),
	(8,14,93,8,'App\\Exam',127,'2',3,0,0,'2016-12-20 17:25:35','2016-12-27 23:43:11'),
	(9,14,93,8,'App\\Exam',128,'1',3,0,0,'2016-12-20 17:25:36','2016-12-27 23:43:11'),
	(10,14,93,8,'App\\Exam',129,'2',3,1,1,'2016-12-20 17:25:36','2016-12-27 23:43:11'),
	(11,14,94,10,'App\\Quiz',130,'123',1,1,1,'2016-12-20 18:33:46','2016-12-20 18:33:46'),
	(12,14,94,11,'App\\Quiz',131,'12',2,0,0,'2016-12-20 18:33:52','2016-12-27 23:45:48'),
	(13,14,94,11,'App\\Quiz',132,'1',2,1,1,'2016-12-20 18:33:52','2016-12-27 23:45:48'),
	(14,14,95,14,'App\\Exam',102,'1',2,1,1,'2016-12-20 18:34:41','2016-12-27 23:46:40'),
	(15,14,95,14,'App\\Exam',103,'2',2,1,1,'2016-12-20 18:34:41','2016-12-27 23:46:40'),
	(16,14,95,15,'App\\Exam',104,'1',2,0,0,'2016-12-20 18:34:51','2016-12-27 23:47:32'),
	(17,14,95,15,'App\\Exam',105,'2',2,0,0,'2016-12-20 18:34:51','2016-12-27 23:47:32'),
	(18,14,95,15,'App\\Exam',106,'1',2,0,0,'2016-12-20 18:34:51','2016-12-27 23:47:32'),
	(19,14,95,15,'App\\Exam',107,'3',2,0,0,'2016-12-20 18:34:51','2016-12-27 23:47:32'),
	(20,14,95,15,'App\\Exam',108,'3',2,0,0,'2016-12-20 18:34:51','2016-12-27 23:47:32'),
	(21,14,95,16,'App\\Quiz',115,'0',2,1,1,'2016-12-20 18:34:58','2016-12-27 23:47:41'),
	(22,14,95,16,'App\\Quiz',116,'2',2,0,0,'2016-12-20 18:34:58','2016-12-27 23:47:41'),
	(23,14,96,19,'App\\Quiz',117,'1',1,1,1,'2016-12-20 18:36:04','2016-12-20 18:36:04'),
	(24,14,96,19,'App\\Quiz',118,'2',1,1,1,'2016-12-20 18:36:04','2016-12-20 18:36:04'),
	(25,14,96,19,'App\\Quiz',119,'1',1,0,0,'2016-12-20 18:36:04','2016-12-20 18:36:04'),
	(26,14,96,20,'App\\Exam',120,'1',1,0,0,'2016-12-20 18:36:11','2016-12-20 18:36:11'),
	(27,14,96,20,'App\\Exam',121,'2',1,0,0,'2016-12-20 18:36:12','2016-12-20 18:36:12'),
	(28,14,96,20,'App\\Exam',122,'1',1,0,0,'2016-12-20 18:36:12','2016-12-20 18:36:12'),
	(29,14,96,20,'App\\Exam',123,'1',1,1,1,'2016-12-20 18:36:12','2016-12-20 18:36:12'),
	(30,14,96,20,'App\\Exam',124,'2',1,0,0,'2016-12-20 18:36:12','2016-12-20 18:36:12'),
	(31,NULL,85,24,'App\\Quiz',137,'무궁화',1,1,1,'2016-12-27 15:29:32','2016-12-27 15:29:32'),
	(32,NULL,85,25,'App\\Quiz',133,'1',1,1,1,'2016-12-27 15:29:48','2016-12-27 15:29:48'),
	(33,NULL,85,25,'App\\Quiz',134,'2',1,1,1,'2016-12-27 15:29:48','2016-12-27 15:29:48'),
	(34,NULL,85,25,'App\\Quiz',135,'ㅂ',1,0,0,'2016-12-27 15:29:48','2016-12-27 15:29:48'),
	(35,NULL,85,25,'App\\Quiz',136,'ㅂ',1,0,0,'2016-12-27 15:29:48','2016-12-27 15:29:48');

/*!40000 ALTER TABLE `user_quiz_logs` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table user_trainings
# ------------------------------------------------------------

DROP TABLE IF EXISTS `user_trainings`;

CREATE TABLE `user_trainings` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `parent_id` int(11) DEFAULT NULL,
  `lft` int(11) DEFAULT NULL,
  `rgt` int(11) DEFAULT NULL,
  `depth` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `training_id` int(11) DEFAULT NULL,
  `course_id` int(11) DEFAULT NULL,
  `session_list_id` int(11) DEFAULT NULL,
  `session_content_id` int(11) DEFAULT NULL,
  `is_exam` tinyint(4) NOT NULL DEFAULT '0',
  `started_at` timestamp NULL DEFAULT NULL,
  `finished_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_trainings_parent_id_index` (`parent_id`),
  KEY `user_trainings_lft_index` (`lft`),
  KEY `user_trainings_rgt_index` (`rgt`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

LOCK TABLES `user_trainings` WRITE;
/*!40000 ALTER TABLE `user_trainings` DISABLE KEYS */;

INSERT INTO `user_trainings` (`id`, `title`, `parent_id`, `lft`, `rgt`, `depth`, `user_id`, `training_id`, `course_id`, `session_list_id`, `session_content_id`, `is_exam`, `started_at`, `finished_at`, `created_at`, `updated_at`)
VALUES
	(1,'2016년 9월 고급 알고리즘2',NULL,1,24,0,1,156,NULL,NULL,NULL,0,NULL,NULL,'2016-10-06 19:49:01','2016-10-06 19:49:01'),
	(2,'강의 1',1,2,23,1,1,156,68,NULL,NULL,0,'2016-10-07 13:35:18',NULL,'2016-10-06 19:49:01','2016-10-07 13:35:18'),
	(3,'9/19 기대값 다이나믹 프로그래밍',2,3,12,2,1,156,68,108,NULL,0,'2016-10-07 13:35:20','2016-10-07 13:35:28','2016-10-06 19:49:01','2016-10-07 13:35:28'),
	(4,'개념동영상',3,4,5,3,1,156,68,108,35,0,'2016-10-07 13:35:20','2016-10-07 13:35:23','2016-10-06 19:49:01','2016-10-07 13:35:23'),
	(5,'히스토그램에서 가장 큰 직사각형을 구하는 프로그램을 작성하시오.',3,6,7,3,1,156,68,108,36,0,'2016-10-07 13:35:23','2016-10-07 13:35:25','2016-10-06 19:49:01','2016-10-07 13:35:25'),
	(6,'Final Test - Quiz 1',3,8,9,3,1,156,68,108,3,1,'2016-10-07 13:35:25','2016-10-07 13:35:26','2016-10-06 19:49:01','2016-10-07 13:35:26'),
	(7,'Final Test - Quiz2',3,10,11,3,1,156,68,108,4,1,'2016-10-07 13:35:27',NULL,'2016-10-06 19:49:01','2016-10-07 13:35:27'),
	(8,'9/20 다이나믹 프로그래밍 최적화',2,13,14,2,1,156,68,109,NULL,0,'2016-10-07 13:35:28','2016-10-07 10:48:36','2016-10-06 19:49:01','2016-10-07 13:35:28'),
	(9,'9/21 Suffix Array와 LCP',2,15,16,2,1,156,68,110,NULL,0,'2016-10-07 10:48:36','2016-10-07 10:48:37','2016-10-06 19:49:01','2016-10-07 10:48:37'),
	(10,'9/25 FFT와 HLD',2,17,18,2,1,156,68,111,NULL,0,'2016-10-07 10:48:37','2016-10-07 10:48:38','2016-10-06 19:49:01','2016-10-07 10:48:38'),
	(11,'9/24 세그먼트 트리 문제 풀이',2,19,20,2,1,156,68,112,NULL,0,'2016-10-07 10:48:38','2016-10-07 10:48:39','2016-10-06 19:49:01','2016-10-07 10:48:39'),
	(12,'9/24 네트워크 플로우 문제 풀이',2,21,22,2,1,156,68,113,NULL,0,'2016-10-07 10:48:39',NULL,'2016-10-06 19:49:01','2016-10-07 10:48:39');

/*!40000 ALTER TABLE `user_trainings` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table user_video_logs
# ------------------------------------------------------------

DROP TABLE IF EXISTS `user_video_logs`;

CREATE TABLE `user_video_logs` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `training_user_id` int(11) DEFAULT NULL,
  `course_user_id` int(11) DEFAULT NULL,
  `user_course_id` int(11) DEFAULT NULL,
  `video_id` int(11) DEFAULT NULL,
  `attempt_count` int(11) NOT NULL DEFAULT '0',
  `duration` int(11) NOT NULL DEFAULT '0',
  `passive_duration` int(11) NOT NULL DEFAULT '0',
  `record_interval` int(11) NOT NULL DEFAULT '0',
  `playtime` int(11) NOT NULL DEFAULT '0',
  `currenttime` int(11) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

LOCK TABLES `user_video_logs` WRITE;
/*!40000 ALTER TABLE `user_video_logs` DISABLE KEYS */;

INSERT INTO `user_video_logs` (`id`, `training_user_id`, `course_user_id`, `user_course_id`, `video_id`, `attempt_count`, `duration`, `passive_duration`, `record_interval`, `playtime`, `currenttime`, `created_at`, `updated_at`)
VALUES
	(1,14,92,2,78,2,15,12,2,34,2,'2016-12-20 17:00:41','2016-12-20 21:55:55'),
	(2,14,93,6,76,1,15,12,2,16,2,'2016-12-20 17:25:09','2016-12-20 19:41:58'),
	(3,14,95,13,74,1,15,12,2,14,14,'2016-12-20 18:34:09','2016-12-20 18:34:22'),
	(4,14,96,18,75,1,15,12,2,14,14,'2016-12-20 18:35:21','2016-12-20 18:35:35'),
	(5,14,96,21,77,0,15,12,2,12,12,'2016-12-20 18:36:21','2016-12-20 18:36:31'),
	(6,NULL,85,23,78,1,15,12,2,14,14,'2016-12-27 15:29:09','2016-12-27 15:29:22');

/*!40000 ALTER TABLE `user_video_logs` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table user_votes
# ------------------------------------------------------------

DROP TABLE IF EXISTS `user_votes`;

CREATE TABLE `user_votes` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `course_user_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `course_id` int(11) DEFAULT NULL,
  `course_score` decimal(3,1) DEFAULT NULL,
  `teacher_score` decimal(3,1) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_votes_course_user_id_index` (`course_user_id`),
  KEY `user_votes_user_id_index` (`user_id`),
  KEY `user_votes_course_id_index` (`course_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

LOCK TABLES `user_votes` WRITE;
/*!40000 ALTER TABLE `user_votes` DISABLE KEYS */;

INSERT INTO `user_votes` (`id`, `course_user_id`, `user_id`, `course_id`, `course_score`, `teacher_score`, `created_at`, `updated_at`)
VALUES
	(1,92,1,77,3.5,2.0,'2016-12-20 21:56:07','2016-12-20 21:56:07'),
	(2,93,1,74,3.0,1.5,'2016-12-27 23:43:26','2016-12-27 23:43:26'),
	(3,94,1,75,5.0,5.0,'2016-12-27 23:45:55','2016-12-27 23:45:55'),
	(4,95,1,72,5.0,5.0,'2016-12-27 23:47:47','2016-12-27 23:47:47');

/*!40000 ALTER TABLE `user_votes` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table users
# ------------------------------------------------------------

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(32) COLLATE utf8_unicode_ci NOT NULL,
  `email` varchar(320) COLLATE utf8_unicode_ci NOT NULL,
  `phone` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `password` varchar(64) COLLATE utf8_unicode_ci NOT NULL,
  `duty` int(11) DEFAULT NULL,
  `branch` int(11) DEFAULT NULL,
  `isdel` tinyint(4) NOT NULL DEFAULT '0',
  `remember_token` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;

INSERT INTO `users` (`id`, `name`, `email`, `phone`, `password`, `duty`, `branch`, `isdel`, `remember_token`, `created_at`, `updated_at`)
VALUES
	(1,'박석제','lucas@intertoday.com','010-aTMwd0VnL29wOHFsNm5Bd29KVE9ndz09-1407','$2y$10$TfrepEXSg5Azpuz3y21PBuXoER4rOxpWWinqXGOwzDrEAATlTjbja',5,5,0,'TPUxzVROPvptsJJU1p0VEvSFeR56osaPlMJoBOjm56AnaE9RyccYvsPmpv5O','2016-10-01 18:26:53','2016-12-28 01:11:07'),
	(2,'이재준','j.lee@intertoday.com','010-USszOTJDSHlKYjVoMndUcDViaDhIUT09-0510','$2y$10$QfOdiChntbiQcTX.Zqf9D.rosjtpErc.JUcdlX72NMUnVYToik5jO',1,2,0,'rybR7idpM6dAIjYR0PcLRMlYECfbDsiyu9FrezcWxrbprC0NTfsRryO9Ao2F','2016-10-19 19:21:02','2016-12-28 08:45:20'),
	(18,'김동수','dong@dong.com','010-kpdHP9VIdNE=-1111','$2y$10$zMHdWagHpjphxwvNztaWKuMNZXsPB7g/PZyrkTUW1Z.IPLSQ.yePS',1,1,1,NULL,'2016-10-19 21:14:09',NULL),
	(19,'김남윤','yun@yum.com','010-kpdHP9VIdNE=-3333','$2y$10$26NWVKjFGrR5z.eMGuJJJOQz2Z/kO8HmrAuv2DImxS/hH3hZyukuK',1,2,1,NULL,'2016-10-19 21:15:50',NULL),
	(20,'황규훈','jkajsf@asjdkfjasdf.com','010-wB6Rc3nhueQ=-0123','$2y$10$n13ptZ76mnA600mcD9kgu.GDNWTqR6IAD/ONrUM70Eyv0MCu8JboG',1,2,0,NULL,'2016-10-19 21:18:06',NULL),
	(40,'김남윤','yun@intertoday.com','010-ektGTFZrRjFmeERPMDhka25BV0txdz09-1234','$2y$10$bXIZ3giGEWRQRdiK1VUKhub2ZpbIgcC3yoHtpeRG3GD8QGKiWjk72',1,21,0,NULL,'2016-10-25 20:44:53',NULL),
	(41,'이재준','qwer@qwer.com','010-NmM5ZUdsUENBRnpGclBJYkRFN1lzUT09-1111','$2y$10$hcU3dUQvOycaZJ7E0L84oufAhLyCTNY31xfG/gJ1.2ra24EfDsdnq',1,2,0,NULL,'2016-10-25 20:52:39',NULL),
	(51,'test1','test1@example.com','010-MWtIU3hXRVJJdUxJVzlpbkJZb0QyUT09-9847','$2y$10$EVDbmgXcyexiwAZnCkCkFe0P5xqemwuVQJWQbxRcEcVYCsENucQKG',1,2,1,NULL,'2016-10-26 12:23:07',NULL),
	(52,'이재준2','j.lee2@intertoday.com','010-USszOTJDSHlKYjVoMndUcDViaDhIUT09-0511','$2y$10$PKt0Y9Wg0GoN5z10c1hX2ezij0MUxKJxeSIq.RvD0oiHaE4CckG5C',1,2,0,NULL,'2016-10-26 12:30:52',NULL),
	(53,'박민규','nbc21@nate.com','010-OE05UndDOWlTWXZYdHJHbmVxZUdjUT09-5567','$2y$10$QfOdiChntbiQcTX.Zqf9D.rosjtpErc.JUcdlX72NMUnVYToik5jO',1,2,0,'S6TMGI2UnLrS4Wn0Dvp7l3k8yDeV2eVimB3cm9vsUGkq8H75cKzkOFy2DMcs','2016-10-26 16:20:37','2016-12-28 07:40:20'),
	(54,'박기범','lapark7@naver.com','010-cXVGYjhYMTQvbjYyOVgwalRtT0ROZz09-9702','$2y$10$QfOdiChntbiQcTX.Zqf9D.rosjtpErc.JUcdlX72NMUnVYToik5jO',1,21,0,'F4NWKtKL7gQuL7Nze1TK1sZGD8kyCShK57FNa7ylqX4XzEAaw3YglUceHfTs','2016-10-26 16:30:27','2016-12-28 08:02:34'),
	(55,'이재성','j.lee2222@intertoday.com','010-TlhUd05BYmdRTys2QkxWWTdsQ0dqZz09-2222','$2y$10$B.9VLjblSTMMA1I9uC1msOQjuqiaZ64V0pWPdotm75JSdDSuwZayq',1,21,0,'jVQlD0MhU0XCCaph8huAUsWY4Rk0v3v2h0nkO2bldmjs9u2wklsL7mOAWy1P','2016-12-03 20:22:24','2016-12-03 20:33:46'),
	(56,'이재춘','j.lee333@intertoday.com','010-USszOTJDSHlKYjVoMndUcDViaDhIUT09-0512','$2y$10$fyVj80pBefGwdxusufrdleaPlVjKHQ75SSzPzOWJ2p2HuUBwe1Nvu',2,21,0,'t5gyGoydlMtn9dPTTfRz9ruOaa5OHH5jKqBH1IxqOxFEY05taimbu5RtZFKt','2016-12-03 20:27:53','2016-12-08 01:06:16'),
	(58,'이직원','lee@intertoday.com','010-TlhUd05BYmdRTys2QkxWWTdsQ0dqZz09-2223','$2y$10$kTrU.ApKP7kfjOdvsDxEeeoaaR6xb.BsKV1wP9ixZn3xyRqZwk7xO',1,2,0,NULL,'2016-12-09 15:00:52',NULL),
	(91,'박석제1','lucas1@intertoday.com','010-aTMwd0VnL29wOHFsNm5Bd29KVE9ndz09-1401','',5,1,0,NULL,'2016-12-12 15:08:15',NULL),
	(92,'박석제2','lucas2@intertoday.com','010-aTMwd0VnL29wOHFsNm5Bd29KVE9ndz09-1402','',5,1,0,NULL,'2016-12-12 15:08:15',NULL),
	(93,'박석제3','lucas3@intertoday.com','010-aTMwd0VnL29wOHFsNm5Bd29KVE9ndz09-1403','',5,1,0,NULL,'2016-12-12 15:08:16',NULL),
	(94,'박석제4','lucas4@intertoday.com','010-aTMwd0VnL29wOHFsNm5Bd29KVE9ndz09-1404','',5,1,0,NULL,'2016-12-12 15:08:16',NULL),
	(196,'Ernest Garrett','egarrett0@timesonline.co.uk','010-d2phTmxpY09TUzhrTGZmNmpTTmh4dz09-4481','1111',83,124,1,NULL,'2016-12-26 10:10:05','2016-12-27 09:54:07'),
	(197,'Peter Ramirez','pramirez2@jalbum.net','023-T1BlRFczV1RETWNpaFRzS0ozdE15QT09-1545','1111',11,31,0,NULL,'2016-12-26 10:10:05','2016-12-26 10:10:05'),
	(198,'박기범','wmontgomery1@wordpress.com','009-Tml3QXBsSkI4dDV1K3dyRHhWZU9RQT09-0247','1111',10,21,0,NULL,'2016-12-26 10:39:59','2016-12-27 15:41:26'),
	(199,'Jessica Stone','jstone3@yellowbook.com','058-SnZoM2lqTWhmU2F0di9HQ1NvaGdhdz09-8359','1111',12,32,0,NULL,'2016-12-26 10:39:59','2016-12-26 10:39:59');

/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table videos
# ------------------------------------------------------------

DROP TABLE IF EXISTS `videos`;

CREATE TABLE `videos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `about` varchar(255) DEFAULT NULL,
  `url` varchar(255) DEFAULT NULL,
  `create_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_activity` datetime DEFAULT NULL,
  `isdel` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT COMMENT='문항정보';

LOCK TABLES `videos` WRITE;
/*!40000 ALTER TABLE `videos` DISABLE KEYS */;

INSERT INTO `videos` (`id`, `title`, `about`, `url`, `create_date`, `last_activity`, `isdel`)
VALUES
	(28,'1','1','https://youtu.be/Wu9hhNzXc_Y','2016-09-27 18:12:20','2016-09-27 09:12:20',0),
	(29,'1','1','https://youtu.be/Wu9hhNzXc_Y','2016-09-29 12:43:51','2016-09-29 03:43:51',0),
	(30,'1','1','https://youtu.be/Wu9hhNzXc_Y','2016-09-30 11:21:49','2016-09-30 02:21:49',0),
	(31,'1','1','https://youtu.be/Wu9hhNzXc_Y','2016-09-30 11:40:03','2016-09-30 02:40:52',0),
	(32,'1','1','https://youtu.be/Wu9hhNzXc_Y','2016-09-30 11:51:41','2016-09-30 02:51:41',0),
	(33,'1','1','https://youtu.be/Wu9hhNzXc_Y','2016-09-30 11:56:38','2016-09-30 02:56:38',0),
	(34,'1','1','https://youtu.be/Wu9hhNzXc_Y','2016-09-30 12:08:30','2016-09-30 03:08:30',0),
	(35,'개념동영상','개념동영상을 시청하세요','https://youtu.be/Wu9hhNzXc_Y','2016-09-30 16:09:58','2016-09-30 07:09:58',0),
	(36,'1','1','https://youtu.be/Wu9hhNzXc_Y','2016-10-10 18:39:11','2016-10-10 09:39:11',0),
	(37,'test',NULL,'https://youtu.be/Wu9hhNzXc_Y','2016-10-10 18:39:55','2016-10-28 06:18:52',0),
	(38,'새로운 비디오를 생성하여 입력합니다. 과연 어떤 비디오가...','주저리주저리','https://youtu.be/Wu9hhNzXc_Y','2016-10-10 21:59:46','2016-10-10 12:59:46',0),
	(39,'사람은 무엇으로 사는가?',NULL,'https://youtu.be/Wu9hhNzXc_Y','2016-10-24 21:51:00','2016-10-28 06:21:14',0),
	(40,'123',NULL,'https://youtu.be/Wu9hhNzXc_Y','2016-10-25 21:14:56','2016-10-25 12:14:56',0),
	(41,'강의비디오',NULL,'https://youtu.be/Wu9hhNzXc_Y','2016-10-26 12:52:39','2016-11-09 10:01:04',0),
	(44,'1',NULL,'https://youtu.be/Wu9hhNzXc_Y','2016-10-31 14:58:35','2016-10-31 05:58:35',0),
	(45,'2',NULL,'https://youtu.be/Wu9hhNzXc_Y','2016-10-31 14:59:31','2016-10-31 05:59:31',0),
	(46,'3',NULL,'https://youtu.be/Wu9hhNzXc_Y','2016-10-31 14:59:45','2016-10-31 05:59:45',0),
	(47,'1',NULL,'https://youtu.be/Wu9hhNzXc_Y','2016-10-31 15:24:16','2016-10-31 06:24:16',0),
	(48,'2',NULL,'https://youtu.be/Wu9hhNzXc_Y','2016-10-31 15:24:27','2016-10-31 06:24:27',0),
	(49,'비메오영상',NULL,'https://youtu.be/Wu9hhNzXc_Y','2016-11-15 15:41:24','2016-11-15 06:41:24',0),
	(50,'test video',NULL,'https://youtu.be/Wu9hhNzXc_Y','2016-11-15 15:50:25','2016-11-15 06:50:25',0),
	(51,'1',NULL,'https://youtu.be/Wu9hhNzXc_Y','2016-11-15 16:11:25','2016-11-15 07:11:25',0),
	(52,'1',NULL,'https://youtu.be/Wu9hhNzXc_Y','2016-11-15 16:14:52','2016-11-15 07:14:52',0),
	(53,'test',NULL,'https://youtu.be/Wu9hhNzXc_Y','2016-11-15 16:44:15','2016-11-15 07:44:15',0),
	(54,'test',NULL,'https://youtu.be/Wu9hhNzXc_Y','2016-11-15 16:47:51','2016-11-15 07:47:51',0),
	(55,'test',NULL,'https://youtu.be/Wu9hhNzXc_Y','2016-11-15 16:49:02','2016-11-15 07:49:02',0),
	(56,'test2',NULL,'https://youtu.be/Wu9hhNzXc_Y','2016-11-15 16:50:38','2016-11-15 07:50:38',0),
	(57,'test3',NULL,'https://youtu.be/Wu9hhNzXc_Y','2016-11-15 16:51:43','2016-11-15 07:51:43',0),
	(58,'test',NULL,'https://youtu.be/Wu9hhNzXc_Y','2016-11-15 16:52:05','2016-11-15 07:52:05',0),
	(59,'test',NULL,'https://youtu.be/Wu9hhNzXc_Y','2016-11-15 16:52:56','2016-11-15 07:52:56',0),
	(60,'test2',NULL,'https://youtu.be/Wu9hhNzXc_Y','2016-11-15 16:54:06','2016-11-15 07:54:06',0),
	(61,'test',NULL,'https://youtu.be/Wu9hhNzXc_Y','2016-11-15 16:56:36','2016-11-15 07:56:36',0),
	(62,'test',NULL,'https://youtu.be/Wu9hhNzXc_Y','2016-11-15 16:59:21','2016-11-15 07:59:21',0),
	(63,'test',NULL,'https://youtu.be/Wu9hhNzXc_Y','2016-11-15 17:02:59','2016-11-15 08:02:59',0),
	(64,'test2',NULL,'https://youtu.be/Wu9hhNzXc_Y','2016-11-15 17:03:21','2016-11-15 08:03:21',0),
	(65,'2',NULL,'https://youtu.be/Wu9hhNzXc_Y','2016-11-15 17:04:16','2016-11-15 08:04:16',0),
	(66,'tets',NULL,'https://youtu.be/Wu9hhNzXc_Y','2016-11-15 17:09:14','2016-11-15 08:09:14',0),
	(67,'test',NULL,'https://youtu.be/Wu9hhNzXc_Y','2016-11-15 17:10:41','2016-11-15 08:10:41',0),
	(68,'test',NULL,'https://youtu.be/Wu9hhNzXc_Y','2016-11-15 17:11:29','2016-11-15 08:11:29',0),
	(69,'test',NULL,'https://youtu.be/Wu9hhNzXc_Y','2016-11-15 17:12:31','2016-11-15 08:12:31',0),
	(70,'test',NULL,'https://youtu.be/Wu9hhNzXc_Y','2016-11-15 17:13:17','2016-11-15 08:13:17',0),
	(71,'test2',NULL,'https://youtu.be/Wu9hhNzXc_Y','2016-11-15 17:15:36','2016-11-15 08:15:36',0),
	(72,'test3',NULL,'https://youtu.be/Wu9hhNzXc_Y','2016-11-15 17:17:19','2016-11-15 08:17:19',0),
	(73,'test4',NULL,'https://youtu.be/Wu9hhNzXc_Y','2016-11-15 17:21:12','2016-11-15 08:21:12',0),
	(74,'test2',NULL,'https://youtu.be/Wu9hhNzXc_Y','2016-11-15 17:23:09','2016-11-16 07:53:26',0),
	(75,'일반상식 공부방법',NULL,'https://youtu.be/Wu9hhNzXc_Y','2016-11-17 12:44:39','2016-11-17 03:44:39',0),
	(76,'조영식쌤의 까치 일반상식 이론 합격 강의',NULL,'https://youtu.be/Wu9hhNzXc_Y','2016-11-17 12:57:59','2016-11-17 03:57:59',0),
	(77,'비디오 생성',NULL,'https://youtu.be/Wu9hhNzXc_Y','2016-11-30 16:00:36','2016-11-30 07:00:36',0),
	(78,'트와이스 TT',NULL,'https://youtu.be/Wu9hhNzXc_Y','2016-12-05 20:22:48','2016-12-06 13:05:28',0),
	(79,'123',NULL,'https://youtu.be/Wu9hhNzXc_Y','2016-12-06 22:32:29','2016-12-06 13:32:29',0);

/*!40000 ALTER TABLE `videos` ENABLE KEYS */;
UNLOCK TABLES;



--
-- Dumping routines (PROCEDURE) for database 'fcedu'
--
DELIMITER ;;

# Dump of PROCEDURE sp_dashboard_title
# ------------------------------------------------------------

/*!50003 DROP PROCEDURE IF EXISTS `sp_dashboard_title` */;;
/*!50003 SET SESSION SQL_MODE="NO_ENGINE_SUBSTITUTION"*/;;
/*!50003 CREATE*/ /*!50020 DEFINER=`lucas`@`%`*/ /*!50003 PROCEDURE `sp_dashboard_title`()
BEGIN
	SET @user_count = 0; # 총 교육생 수
    SET @doing_trainings_count = 0; # 진행중인 교육과정 수
	SET @trainings_count = 0; # 총 교육과정 수 
    SET @prev_month_training_finished = 0; # 전달 종료된 교육의 수
    SET @this_month_training_finished = 0; # 이번 달 종료된 교육의 수
    SET @done_training_rate_compared = 0; # 전달대비 달성률
    SET @branches_count = 0; # 총 점포 수
    
    SELECT COUNT(DISTINCT user_id) INTO @user_count FROM training_users;
    SELECT COUNT(*) INTO @doing_trainings_count FROM trainings WHERE curdate() >= assign_dt AND curdate() <= due_dt;
    SELECT COUNT(*) INTO @trainings_count FROM trainings WHERE isdel != 1;
    SELECT IFNULL(COUNT(*), 0) INTO @prev_month_training_finished FROM training_users WHERE finished_at BETWEEN DATE_FORMAT(NOW() - INTERVAL 1 MONTH, '%Y-%m-01 00:00:00') AND DATE_FORMAT(LAST_DAY(NOW() - INTERVAL 1 MONTH), '%Y-%m-%d 23:59:59');
    SELECT IFNULL(COUNT(*), 0) INTO @this_month_training_finished FROM training_users WHERE finished_at BETWEEN DATE_FORMAT(NOW(), '%Y-%m-01 00:00:00') AND DATE_FORMAT(LAST_DAY(NOW()), '%Y-%m-%d 23:59:59');
    SELECT ROUND(((@this_month_training_finished - @done_training_rate_compared) / @done_training_rate_compared) * 100) INTO @done_training_rate_compared;
    SELECT COUNT(*) INTO @branches_count FROM branches WHERE isdel != 1;
    
    SELECT TRIM(FORMAT(IFNULL(@user_count, 0), 3)) + 0 AS users_count
		 , TRIM(FORMAT(IFNULL(@doing_trainings_count, 0), 3)) + 0 AS doing_trainings_count
         , TRIM(FORMAT(IFNULL(@trainings_count, 0), 3)) + 0 AS trainings_count
         , TRIM(IFNULL(@done_training_rate_compared, @this_month_training_finished * 100)) + 0 AS done_training_rate_compared # TRIM.. removes training zeros
         , TRIM(FORMAT(IFNULL(@branches_count, 0), 3)) + 0 AS branches_count;

END */;;

/*!50003 SET SESSION SQL_MODE=@OLD_SQL_MODE */;;
# Dump of PROCEDURE sp_getCourseDetails
# ------------------------------------------------------------

/*!50003 DROP PROCEDURE IF EXISTS `sp_getCourseDetails` */;;
/*!50003 SET SESSION SQL_MODE="NO_ENGINE_SUBSTITUTION"*/;;
/*!50003 CREATE*/ /*!50020 DEFINER=`lucas`@`%`*/ /*!50003 PROCEDURE `sp_getCourseDetails`(IN `pCourseId` INT)
BEGIN
	SELECT c.id
         , c.title
         , c.about
         , c.image
         , c.create_date
         , c.last_activity
         , c.isdel
         , u.id AS userid
         , u.name
         , (SELECT COUNT(*) FROM session_lists WHERE course_id = c.id) AS sessions_count
		 , IFNULL(c.ratings, 0) AS stars_count
	  FROM courses AS c
      LEFT JOIN users AS u
	    ON c.user_id = u.id      
	 WHERE c.id = pCourseId;

	SELECT s.id
		 , s.title
         , s.seq
         , s.create_date
         , s.last_activity
         , s.isdel
	  FROM courses AS c
	 INNER JOIN session_lists AS s
        ON c.id = s.course_id
	 WHERE c.id = pCourseId
     ORDER BY s.seq;

END */;;

/*!50003 SET SESSION SQL_MODE=@OLD_SQL_MODE */;;
# Dump of PROCEDURE sp_getTrainingDetails
# ------------------------------------------------------------

/*!50003 DROP PROCEDURE IF EXISTS `sp_getTrainingDetails` */;;
/*!50003 SET SESSION SQL_MODE="NO_ENGINE_SUBSTITUTION"*/;;
/*!50003 CREATE*/ /*!50020 DEFINER=`lucas`@`%`*/ /*!50003 PROCEDURE `sp_getTrainingDetails`(IN `pTrainingId` INT)
BEGIN
	SELECT t.id
         , t.title
         , t.about
         , t.image
         , t.create_date
         , t.last_activity
         , t.isdel
         , u.id AS userid
         , u.name
         , (SELECT COUNT(*) FROM training_courses WHERE training_id = t.id) AS courses_count
         , 10 AS stars_count
	  FROM trainings AS t
      LEFT JOIN users AS u
	    ON t.user_id = u.id      
	 WHERE t.id = pTrainingId;

	SELECT tc.id
         , tc.course_id
         , tc.seq
         , c.title
         , c.about
         , c.image
         , c.create_date
         , c.last_activity
         , c.isdel
         , u.id AS empid
         , u.name
         , (SELECT COUNT(*) FROM session_lists WHERE course_id = c.id AND isdel != 1) AS sessions_count
         , c.ratings AS stars_count
	  FROM training_courses AS tc
	 INNER JOIN courses AS c
        ON tc.course_id = c.id
	  LEFT JOIN users AS u
		ON c.user_id = u.id
	 WHERE tc.training_id = pTrainingId;
END */;;

/*!50003 SET SESSION SQL_MODE=@OLD_SQL_MODE */;;
DELIMITER ;

/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
