# ************************************************************
# Sequel Pro SQL dump
# Version 4541
#
# http://www.sequelpro.com/
# https://github.com/sequelpro/sequelpro
#
# Host: orangemanu.cchtmymwefrc.ap-northeast-2.rds.amazonaws.com (MySQL 5.6.27-log)
# Database: orangemanu
# Generation Time: 2016-12-30 11:26:04 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table admin
# ------------------------------------------------------------

DROP TABLE IF EXISTS `admin`;

CREATE TABLE `admin` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) CHARACTER SET utf8 NOT NULL,
  `email` varchar(100) CHARACTER SET utf8 NOT NULL,
  `password` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  `role` varchar(20) CHARACTER SET utf8 DEFAULT NULL,
  `fc_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fc_id` (`fc_id`),
  CONSTRAINT `admin_ibfk_1` FOREIGN KEY (`fc_id`) REFERENCES `fc` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin ROW_FORMAT=COMPACT;

LOCK TABLES `admin` WRITE;
/*!40000 ALTER TABLE `admin` DISABLE KEYS */;

INSERT INTO `admin` (`id`, `name`, `email`, `password`, `role`, `fc_id`)
VALUES
	(1,'이재준','j.lee@intertoday.com','qwer1234','superadmin',1),
	(2,'박석제','lucas@intertoday.com','qwer1234','superadmin',2);

/*!40000 ALTER TABLE `admin` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table branch
# ------------------------------------------------------------

DROP TABLE IF EXISTS `branch`;

CREATE TABLE `branch` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(20) CHARACTER SET utf8 NOT NULL,
  `fc_id` bigint(20) NOT NULL,
  `active` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `fc_id` (`fc_id`),
  CONSTRAINT `branch_ibfk_1` FOREIGN KEY (`fc_id`) REFERENCES `fc` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin ROW_FORMAT=COMPACT;

LOCK TABLES `branch` WRITE;
/*!40000 ALTER TABLE `branch` DISABLE KEYS */;

INSERT INTO `branch` (`id`, `name`, `fc_id`, `active`)
VALUES
	(1,'성동구',1,1),
	(2,'동대문구',1,1),
	(3,'서대문구',1,1),
	(4,'광진구',1,1),
	(5,'노원구',1,1),
	(6,'성북구',1,1),
	(7,'노원구',2,1);

/*!40000 ALTER TABLE `branch` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table course
# ------------------------------------------------------------

DROP TABLE IF EXISTS `course`;

CREATE TABLE `course` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(20) CHARACTER SET utf8 NOT NULL,
  `teacher_id` bigint(20) NOT NULL,
  `thumbnail` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  `desc` text CHARACTER SET utf8,
  `creator_id` bigint(20) NOT NULL,
  `created_dt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_dt` datetime DEFAULT NULL,
  `active` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `teacher_id` (`teacher_id`),
  KEY `creator_id` (`creator_id`),
  CONSTRAINT `course_ibfk_1` FOREIGN KEY (`teacher_id`) REFERENCES `teacher` (`id`),
  CONSTRAINT `course_ibfk_2` FOREIGN KEY (`creator_id`) REFERENCES `admin` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin ROW_FORMAT=COMPACT;

LOCK TABLES `course` WRITE;
/*!40000 ALTER TABLE `course` DISABLE KEYS */;

INSERT INTO `course` (`id`, `name`, `teacher_id`, `thumbnail`, `desc`, `creator_id`, `created_dt`, `updated_dt`, `active`)
VALUES
	(1,'커피 맛있게 만드는 법',1,NULL,'커피를 맛있게 내리는 법을 알려드립니다.',1,'2016-12-30 10:05:16',NULL,1),
	(2,'커피를 맛있게 마시는 방법',1,NULL,'커피를 맛있게 마시는 방법에 대해서 소개합니다.',2,'2016-12-30 10:46:23',NULL,1);

/*!40000 ALTER TABLE `course` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table course_group
# ------------------------------------------------------------

DROP TABLE IF EXISTS `course_group`;

CREATE TABLE `course_group` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `group_id` varchar(255) CHARACTER SET utf8 NOT NULL,
  `course_id` bigint(20) NOT NULL,
  `order` bigint(20) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin ROW_FORMAT=COMPACT;



# Dump of table course_list
# ------------------------------------------------------------

DROP TABLE IF EXISTS `course_list`;

CREATE TABLE `course_list` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `course_id` bigint(20) NOT NULL,
  `type` varchar(100) CHARACTER SET utf8 NOT NULL COMMENT 'VIDEO, QUIZ, FINAL',
  `quiz_id` bigint(20) DEFAULT NULL,
  `video_id` bigint(20) DEFAULT NULL,
  `order` bigint(20) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `course_id` (`course_id`),
  KEY `video_id` (`video_id`),
  KEY `quiz_id` (`quiz_id`),
  CONSTRAINT `course_list_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `course` (`id`),
  CONSTRAINT `course_list_ibfk_2` FOREIGN KEY (`video_id`) REFERENCES `video` (`id`),
  CONSTRAINT `course_list_ibfk_3` FOREIGN KEY (`quiz_id`) REFERENCES `quiz` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin ROW_FORMAT=COMPACT;

LOCK TABLES `course_list` WRITE;
/*!40000 ALTER TABLE `course_list` DISABLE KEYS */;

INSERT INTO `course_list` (`id`, `course_id`, `type`, `quiz_id`, `video_id`, `order`)
VALUES
	(1,1,'VIDEO',NULL,1,0),
	(2,1,'QUIZ',1,NULL,0),
	(3,1,'FINAL',1,NULL,0);

/*!40000 ALTER TABLE `course_list` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table duty
# ------------------------------------------------------------

DROP TABLE IF EXISTS `duty`;

CREATE TABLE `duty` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) CHARACTER SET utf8 NOT NULL,
  `fc_id` bigint(20) NOT NULL,
  `active` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `fc_id` (`fc_id`),
  CONSTRAINT `duty_ibfk_1` FOREIGN KEY (`fc_id`) REFERENCES `fc` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin ROW_FORMAT=COMPACT;

LOCK TABLES `duty` WRITE;
/*!40000 ALTER TABLE `duty` DISABLE KEYS */;

INSERT INTO `duty` (`id`, `name`, `fc_id`, `active`)
VALUES
	(1,'아르바이트',1,1),
	(2,'사원',1,1),
	(3,'점주',1,1),
	(4,'아르바이트',2,1),
	(5,'직원',2,1),
	(6,'점장',2,1);

/*!40000 ALTER TABLE `duty` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table edu
# ------------------------------------------------------------

DROP TABLE IF EXISTS `edu`;

CREATE TABLE `edu` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) CHARACTER SET utf8 NOT NULL,
  `thumbnail` varchar(255) CHARACTER SET utf8 NOT NULL,
  `desc` text CHARACTER SET utf8 NOT NULL,
  `created_dt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_dt` datetime DEFAULT NULL,
  `start_dt` datetime DEFAULT NULL,
  `end_dt` datetime DEFAULT NULL,
  `active` tinyint(1) DEFAULT '1',
  `course_group_id` varchar(255) CHARACTER SET utf8 NOT NULL,
  `creator_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin ROW_FORMAT=COMPACT;

LOCK TABLES `edu` WRITE;
/*!40000 ALTER TABLE `edu` DISABLE KEYS */;

INSERT INTO `edu` (`id`, `name`, `thumbnail`, `desc`, `created_dt`, `updated_dt`, `start_dt`, `end_dt`, `active`, `course_group_id`, `creator_id`)
VALUES
	(1,'최초 교육과정을 생성합니다.','','','2016-12-30 11:08:35',NULL,'2016-12-30 00:00:00','2016-12-31 23:59:59',1,'qwer1234',1);

/*!40000 ALTER TABLE `edu` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table fc
# ------------------------------------------------------------

DROP TABLE IF EXISTS `fc`;

CREATE TABLE `fc` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) CHARACTER SET utf8 NOT NULL,
  `active` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin ROW_FORMAT=COMPACT;

LOCK TABLES `fc` WRITE;
/*!40000 ALTER TABLE `fc` DISABLE KEYS */;

INSERT INTO `fc` (`id`, `name`, `active`)
VALUES
	(1,'오렌지나무시스템',1),
	(2,'맘스터치',1),
	(3,'K미술학원',1);

/*!40000 ALTER TABLE `fc` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table log_user_point
# ------------------------------------------------------------

DROP TABLE IF EXISTS `log_user_point`;

CREATE TABLE `log_user_point` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) NOT NULL,
  `edu_id` bigint(20) NOT NULL,
  `complete` decimal(10,2) DEFAULT '0.00',
  `quiz_correction` decimal(10,2) DEFAULT '0.00',
  `final_correction` decimal(10,2) DEFAULT '0.00',
  `reeltime` decimal(10,2) DEFAULT '0.00',
  `speed` decimal(10,2) DEFAULT '0.00',
  `repetition` decimal(10,2) DEFAULT '0.00',
  `evaluated_dt` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `edu_id` (`edu_id`),
  CONSTRAINT `log_user_point_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `log_user_point_ibfk_2` FOREIGN KEY (`edu_id`) REFERENCES `edu` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin ROW_FORMAT=COMPACT;



# Dump of table log_user_quiz
# ------------------------------------------------------------

DROP TABLE IF EXISTS `log_user_quiz`;

CREATE TABLE `log_user_quiz` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) NOT NULL,
  `answer` varchar(255) CHARACTER SET utf8 NOT NULL COMMENT '유저가 제출한 답안',
  `correction` tinyint(1) DEFAULT '0' COMMENT '정답 여부',
  `created_dt` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `log_user_quiz_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin ROW_FORMAT=COMPACT;



# Dump of table log_user_video
# ------------------------------------------------------------

DROP TABLE IF EXISTS `log_user_video`;

CREATE TABLE `log_user_video` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) NOT NULL,
  `video_id` bigint(20) NOT NULL,
  `start_dt` datetime DEFAULT NULL,
  `end_dt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `video_id` (`video_id`),
  CONSTRAINT `log_user_video_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `log_user_video_ibfk_2` FOREIGN KEY (`video_id`) REFERENCES `video` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin ROW_FORMAT=COMPACT;



# Dump of table point_weight
# ------------------------------------------------------------

DROP TABLE IF EXISTS `point_weight`;

CREATE TABLE `point_weight` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `setter_id` bigint(20) NOT NULL,
  `created_dt` datetime DEFAULT CURRENT_TIMESTAMP,
  `point_complete` decimal(5,1) DEFAULT '0.0',
  `point_quiz` decimal(5,1) DEFAULT '0.0',
  `point_final` decimal(5,1) DEFAULT '0.0',
  `point_reeltime` decimal(5,1) DEFAULT '0.0',
  `point_speed` decimal(5,1) DEFAULT '0.0',
  `point_repetition` decimal(5,1) DEFAULT '0.0',
  PRIMARY KEY (`id`),
  KEY `setter_id` (`setter_id`),
  CONSTRAINT `point_weight_ibfk_1` FOREIGN KEY (`setter_id`) REFERENCES `admin` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin ROW_FORMAT=COMPACT;

LOCK TABLES `point_weight` WRITE;
/*!40000 ALTER TABLE `point_weight` DISABLE KEYS */;

INSERT INTO `point_weight` (`id`, `setter_id`, `created_dt`, `point_complete`, `point_quiz`, `point_final`, `point_reeltime`, `point_speed`, `point_repetition`)
VALUES
	(1,1,'2016-12-30 10:51:32',9999.9,0.0,0.0,0.0,0.0,0.0);

/*!40000 ALTER TABLE `point_weight` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table quiz
# ------------------------------------------------------------

DROP TABLE IF EXISTS `quiz`;

CREATE TABLE `quiz` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `type` varchar(100) CHARACTER SET utf8 NOT NULL,
  `name` varchar(20) CHARACTER SET utf8 NOT NULL,
  `auestion` varchar(255) CHARACTER SET utf8 NOT NULL,
  `answer` varchar(255) CHARACTER SET utf8 NOT NULL,
  `option_id` varchar(255) CHARACTER SET utf8 NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin ROW_FORMAT=COMPACT;

LOCK TABLES `quiz` WRITE;
/*!40000 ALTER TABLE `quiz` DISABLE KEYS */;

INSERT INTO `quiz` (`id`, `type`, `name`, `auestion`, `answer`, `option_id`)
VALUES
	(1,'QUIZ','QUIZ 01','커피를 볶는 것을 로스팅이라고 한다.','1','qwer1234');

/*!40000 ALTER TABLE `quiz` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table quiz_option
# ------------------------------------------------------------

DROP TABLE IF EXISTS `quiz_option`;

CREATE TABLE `quiz_option` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `opt_id` varchar(255) CHARACTER SET utf8 NOT NULL,
  `option` varchar(255) CHARACTER SET utf8 NOT NULL,
  `order` bigint(20) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin ROW_FORMAT=COMPACT;

LOCK TABLES `quiz_option` WRITE;
/*!40000 ALTER TABLE `quiz_option` DISABLE KEYS */;

INSERT INTO `quiz_option` (`id`, `opt_id`, `option`, `order`)
VALUES
	(1,'qwer1234','선택지1',0),
	(2,'qwer1234','선택지2',0);

/*!40000 ALTER TABLE `quiz_option` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table teacher
# ------------------------------------------------------------

DROP TABLE IF EXISTS `teacher`;

CREATE TABLE `teacher` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(20) CHARACTER SET utf8 NOT NULL,
  `desc` text CHARACTER SET utf8,
  `active` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin ROW_FORMAT=COMPACT;

LOCK TABLES `teacher` WRITE;
/*!40000 ALTER TABLE `teacher` DISABLE KEYS */;

INSERT INTO `teacher` (`id`, `name`, `desc`, `active`)
VALUES
	(1,'이재준','이재준 강사에 대한 설명입니다.',1),
	(2,'박석제','박석제 강사에 대한 설명입니다.',1);

/*!40000 ALTER TABLE `teacher` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table training_edu
# ------------------------------------------------------------

DROP TABLE IF EXISTS `training_edu`;

CREATE TABLE `training_edu` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `edu_id` bigint(20) NOT NULL,
  `assigner` bigint(20) NOT NULL,
  `created_dt` datetime DEFAULT CURRENT_TIMESTAMP,
  `active` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `edu_id` (`edu_id`),
  KEY `assigner` (`assigner`),
  CONSTRAINT `training_edu_ibfk_1` FOREIGN KEY (`edu_id`) REFERENCES `edu` (`id`),
  CONSTRAINT `training_edu_ibfk_2` FOREIGN KEY (`assigner`) REFERENCES `admin` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin ROW_FORMAT=COMPACT;

LOCK TABLES `training_edu` WRITE;
/*!40000 ALTER TABLE `training_edu` DISABLE KEYS */;

INSERT INTO `training_edu` (`id`, `edu_id`, `assigner`, `created_dt`, `active`)
VALUES
	(1,1,1,'2016-12-30 11:08:53',1);

/*!40000 ALTER TABLE `training_edu` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table training_users
# ------------------------------------------------------------

DROP TABLE IF EXISTS `training_users`;

CREATE TABLE `training_users` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) NOT NULL,
  `training_edu_id` bigint(20) NOT NULL,
  `start_dt` datetime DEFAULT NULL,
  `end_dt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `training_edu_id` (`training_edu_id`),
  CONSTRAINT `training_users_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `training_users_ibfk_2` FOREIGN KEY (`training_edu_id`) REFERENCES `edu` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin ROW_FORMAT=COMPACT;

LOCK TABLES `training_users` WRITE;
/*!40000 ALTER TABLE `training_users` DISABLE KEYS */;

INSERT INTO `training_users` (`id`, `user_id`, `training_edu_id`, `start_dt`, `end_dt`)
VALUES
	(1,1,1,'2016-12-30 00:00:00',NULL),
	(2,2,1,'2016-12-30 00:00:00',NULL);

/*!40000 ALTER TABLE `training_users` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table user_rating
# ------------------------------------------------------------

DROP TABLE IF EXISTS `user_rating`;

CREATE TABLE `user_rating` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) NOT NULL,
  `course_id` bigint(20) DEFAULT NULL,
  `teacher_id` bigint(20) DEFAULT NULL,
  `rate` decimal(2,1) DEFAULT '0.0',
  `created_dt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_dt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `course_id` (`course_id`),
  KEY `teacher_id` (`teacher_id`),
  CONSTRAINT `user_rating_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `user_rating_ibfk_2` FOREIGN KEY (`course_id`) REFERENCES `course` (`id`),
  CONSTRAINT `user_rating_ibfk_3` FOREIGN KEY (`teacher_id`) REFERENCES `teacher` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin ROW_FORMAT=COMPACT;

LOCK TABLES `user_rating` WRITE;
/*!40000 ALTER TABLE `user_rating` DISABLE KEYS */;

INSERT INTO `user_rating` (`id`, `user_id`, `course_id`, `teacher_id`, `rate`, `created_dt`, `updated_dt`)
VALUES
	(1,1,1,1,9.9,'2016-12-30 10:43:32',NULL),
	(2,2,2,2,0.0,'2016-12-30 10:43:48',NULL);

/*!40000 ALTER TABLE `user_rating` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table users
# ------------------------------------------------------------

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(20) CHARACTER SET utf8 NOT NULL,
  `password` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  `email` varchar(100) CHARACTER SET utf8 NOT NULL,
  `phone` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  `fc_id` bigint(20) NOT NULL,
  `duty_id` bigint(20) NOT NULL,
  `branch_id` bigint(20) NOT NULL,
  `active` tinyint(1) DEFAULT '1',
  `created_dt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_dt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `phone` (`phone`),
  KEY `fc_id` (`fc_id`),
  KEY `duty_id` (`duty_id`),
  KEY `branch_id` (`branch_id`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`fc_id`) REFERENCES `fc` (`id`),
  CONSTRAINT `users_ibfk_2` FOREIGN KEY (`duty_id`) REFERENCES `duty` (`id`),
  CONSTRAINT `users_ibfk_3` FOREIGN KEY (`branch_id`) REFERENCES `branch` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin ROW_FORMAT=COMPACT;

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;

INSERT INTO `users` (`id`, `name`, `password`, `email`, `phone`, `fc_id`, `duty_id`, `branch_id`, `active`, `created_dt`, `updated_dt`)
VALUES
	(1,'이재준','qwer1234','j.lee@intertoday.com','010-jaksdjf-0510',1,1,1,1,'2016-12-30 09:57:21',NULL),
	(2,'박석제','qwer1234','lucas@intertoday.com','010-hjndjfa-2009',2,6,7,1,'2016-12-30 09:57:57',NULL);

/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table video
# ------------------------------------------------------------

DROP TABLE IF EXISTS `video`;

CREATE TABLE `video` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(20) CHARACTER SET utf8 NOT NULL,
  `type` varchar(100) CHARACTER SET utf8 NOT NULL,
  `url` varchar(255) CHARACTER SET utf8 NOT NULL,
  `creator_id` bigint(20) NOT NULL,
  `created_dt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_dt` datetime DEFAULT NULL,
  `active` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `creator_id` (`creator_id`),
  CONSTRAINT `video_ibfk_1` FOREIGN KEY (`creator_id`) REFERENCES `admin` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin ROW_FORMAT=COMPACT;

LOCK TABLES `video` WRITE;
/*!40000 ALTER TABLE `video` DISABLE KEYS */;

INSERT INTO `video` (`id`, `name`, `type`, `url`, `creator_id`, `created_dt`, `updated_dt`, `active`)
VALUES
	(1,'원두 고르기','VIMEO','http://vimeo.com/asdf',1,'2016-12-30 10:10:29',NULL,1),
	(2,'알맞게 로스팅하는 법','YOUTUBE','http://youtube.com/asdf',2,'2016-12-30 10:11:06',NULL,1);

/*!40000 ALTER TABLE `video` ENABLE KEYS */;
UNLOCK TABLES;



/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
