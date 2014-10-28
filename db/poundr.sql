/*
SQLyog Community v11.2 Beta1 (64 bit)
MySQL - 5.5.32 : Database - poundr
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`poundr` /*!40100 DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci */;

USE `poundr`;

/*Table structure for table `apiaccess` */

DROP TABLE IF EXISTS `apiaccess`;

CREATE TABLE `apiaccess` (
  `user_id` int(11) NOT NULL,
  `access_token` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `expire` int(11) DEFAULT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `apiaccess` */

insert  into `apiaccess`(`user_id`,`access_token`,`expire`) values (1,'f8adf9686e6b5ff13b38dde48bbb23bd',1412826725);

/*Table structure for table `celebrities` */

DROP TABLE IF EXISTS `celebrities`;

CREATE TABLE `celebrities` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `fan_page` varchar(255) NOT NULL,
  `like_number` int(10) DEFAULT '0',
  `dont_care_number` int(10) DEFAULT '0',
  `dis_like_number` int(10) DEFAULT '0',
  `comment_number` int(10) DEFAULT '0',
  `image` varchar(255) DEFAULT NULL,
  `status` tinyint(2) DEFAULT '1',
  `created` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

/*Data for the table `celebrities` */

insert  into `celebrities`(`id`,`name`,`fan_page`,`like_number`,`dont_care_number`,`dis_like_number`,`comment_number`,`image`,`status`,`created`) values (1,'Cele Test','fb/cele_test',1,1,1,1,NULL,1,'2014-10-01 10:56:59');

/*Table structure for table `comments` */

DROP TABLE IF EXISTS `comments`;

CREATE TABLE `comments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `celebrity_id` int(11) NOT NULL,
  `content` text CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `like_number` int(10) DEFAULT '0',
  `status` tinyint(2) DEFAULT '1',
  `created` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

/*Data for the table `comments` */

insert  into `comments`(`id`,`user_id`,`celebrity_id`,`content`,`like_number`,`status`,`created`) values (1,1,1,'aaaaaaaaaaaaaa',0,1,'2014-10-01 10:57:23'),(2,1,1,'aaaaaaaaaaaaaa',0,1,'2014-10-03 04:33:40'),(3,1,1,'mmmmmmm',0,1,'2014-10-02 04:33:40');

/*Table structure for table `like_celebrity_users` */

DROP TABLE IF EXISTS `like_celebrity_users`;

CREATE TABLE `like_celebrity_users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `celebrity_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `action` tinyint(2) DEFAULT '2',
  `status` tinyint(2) DEFAULT '1',
  `created` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

/*Data for the table `like_celebrity_users` */

insert  into `like_celebrity_users`(`id`,`celebrity_id`,`user_id`,`action`,`status`,`created`) values (1,1,1,1,0,'2014-10-03 05:46:32'),(2,1,1,1,0,'2014-10-03 05:47:08'),(3,1,1,2,0,'2014-10-03 05:48:01'),(4,1,1,3,0,'2014-10-03 05:51:59');

/*Table structure for table `like_comment_users` */

DROP TABLE IF EXISTS `like_comment_users`;

CREATE TABLE `like_comment_users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `comment_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `status` tinyint(2) DEFAULT '1',
  `created` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

/*Data for the table `like_comment_users` */

insert  into `like_comment_users`(`id`,`comment_id`,`user_id`,`status`,`created`) values (1,1,2,0,'2014-10-02 15:07:40');

/*Table structure for table `users` */

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(128) NOT NULL,
  `password` varchar(128) NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `gender` varchar(50) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `timezone` varchar(255) DEFAULT NULL,
  `facebook_id` varchar(100) DEFAULT NULL,
  `status` tinyint(2) DEFAULT '1',
  `last_visit` timestamp NULL DEFAULT '0000-00-00 00:00:00',
  `created` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

/*Data for the table `users` */

insert  into `users`(`id`,`email`,`password`,`first_name`,`last_name`,`avatar`,`gender`,`location`,`timezone`,`facebook_id`,`status`,`last_visit`,`created`) values (1,'honnuoc@gmail.com','202cb962ac59075b964b07152d234b70','Khoa','Tran',NULL,NULL,NULL,NULL,NULL,1,'2014-10-01 10:53:12','2014-09-30 10:53:07'),(2,'honnuoc@yao.com','202cb962ac59075b964b07152d234b70','K','T',NULL,NULL,NULL,'7','10152746642277888',1,'2014-10-02 15:07:25','2014-10-01 15:07:20'),(3,'honnuoc@yahoo.com','787fc3254174b257d14af35a1aeed5b6','Khoa','Trần',NULL,NULL,NULL,'7','10152746642277888',1,'0000-00-00 00:00:00','2014-10-02 17:14:57');

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
