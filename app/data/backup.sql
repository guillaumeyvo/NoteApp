BEGIN TRANSACTION;
CREATE TABLE `notes` (`id` INTEGER PRIMARY KEY AUTOINCREMENT, `content` VARCHAR(255) NOT NULL, `title` VARCHAR(255) NOT NULL, `createdAt` DATETIME NOT NULL, `updatedAt` DATETIME NOT NULL, `folderId` INTEGER REFERENCES `folders` (`id`) ON DELETE SET NULL ON UPDATE CASCADE);
INSERT INTO `notes` VALUES (4,'<p>tttttttttttttttttttttavjddsnkjfnjknbbnq</p>
','Rappel 1','2016-03-24 08:35:24.250 +00:00','2016-05-04 07:43:02.428 +00:00',2);
INSERT INTO `notes` VALUES (7,'<p>Contenu de la note</p>
','Rappel 4','2016-03-24 08:35:45.220 +00:00','2016-03-24 08:35:45.470 +00:00',3);
INSERT INTO `notes` VALUES (23,'<h3>QQQQQQQQQQQQQQQQQQQQQQQQQA</h3>
','Note 16','2016-03-26 17:24:04.455 +00:00','2016-05-03 17:25:05.217 +00:00',NULL);
INSERT INTO `notes` VALUES (27,'<h3><span style="color: inherit; font-family: inherit; line-height: 1.1;">Update 123</span><br></h3>

<p>"At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat."</p>
','Note 1705','2016-03-26 17:24:21.321 +00:00','2016-05-01 16:10:31.701 +00:00',NULL);
INSERT INTO `notes` VALUES (28,'<h3>The standard Lorem Ipsum passage, used since the 1500s</h3>

<p>&quot;Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.&quot;</p>

<h3>Section 1.10.32 of &quot;de Finibus Bonorum et Malorum&quot;, written by Cicero in 45 BC</h3>

<p>&quot;Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?&quot;</p>

<h3>1914 translation by H. Rackham</h3>

<p>&quot;But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who do not know how to pursue pleasure rationally encounter consequences that are extremely painful. Nor again is there anyone who loves or pursues or desires to obtain pain of itself, because it is pain, but because occasionally circumstances occur in which toil and pain can procure him some great pleasure. To take a trivial example, which of us ever undertakes laborious physical exercise, except to obtain some advantage from it? But who has any right to find fault with a man who chooses to enjoy a pleasure that has no annoying consequences, or one who avoids a pain that produces no resultant pleasure?&quot;</p>

<h3>Section 1.10.33 of &quot;de Finibus Bonorum et Malorum&quot;, written by Cicero in 45 BC</h3>

<p>&quot;At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.&quot;</p>
','Note 17','2016-03-26 17:24:23.938 +00:00','2016-03-26 17:24:24.203 +00:00',NULL);
INSERT INTO `notes` VALUES (29,'<h3>The standard Lorem Ipsum passage, used since the 1500s</h3>

<p>&quot;Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.&quot;</p>

<h3>Section 1.10.32 of &quot;de Finibus Bonorum et Malorum&quot;, written by Cicero in 45 BC</h3>

<p>&quot;Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?&quot;</p>

<h3>1914 translation by H. Rackham</h3>

<p>&quot;But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who do not know how to pursue pleasure rationally encounter consequences that are extremely painful. Nor again is there anyone who loves or pursues or desires to obtain pain of itself, because it is pain, but because occasionally circumstances occur in which toil and pain can procure him some great pleasure. To take a trivial example, which of us ever undertakes laborious physical exercise, except to obtain some advantage from it? But who has any right to find fault with a man who chooses to enjoy a pleasure that has no annoying consequences, or one who avoids a pain that produces no resultant pleasure?&quot;</p>

<h3>Section 1.10.33 of &quot;de Finibus Bonorum et Malorum&quot;, written by Cicero in 45 BC</h3>

<p>&quot;At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.&quot;</p>
','Note 17','2016-03-26 17:24:26.199 +00:00','2016-03-26 17:24:26.460 +00:00',NULL);
INSERT INTO `notes` VALUES (40,'AAAAAAAAAAA','QQQQQQ','2016-05-01 16:07:45.133 +00:00','2016-05-01 16:08:26.445 +00:00',NULL);
INSERT INTO `notes` VALUES (41,'Fake contenu de ma note','Titre de ma note','2016-05-01 18:29:47.728 +00:00','2016-05-01 18:29:47.909 +00:00',NULL);
INSERT INTO `notes` VALUES (42,'Ceci est le contenu de ma note','Titre','2016-05-03 18:31:13.855 +00:00','2016-05-03 18:31:13.959 +00:00',NULL);
INSERT INTO `notes` VALUES (43,'<span style="background-color: yellow;">Qwertyuiop</span>','ZZZZ','2016-05-03 18:32:28.692 +00:00','2016-05-03 18:33:24.102 +00:00',NULL);
INSERT INTO `notes` VALUES (46,'Blabla','Second test','2016-05-04 08:07:41.076 +00:00','2016-05-04 08:07:41.195 +00:00',13);
INSERT INTO `notes` VALUES (47,'<h1 style="margin-top: 0px; margin-bottom: 0px; padding: 0px; font-family: DauphinPlain; font-size: 70px; line-height: 90px; color: rgb(0, 0, 0); text-align: center;">Lorem Ipsum</h1><p style="margin-bottom: 15px; padding: 0px; text-align: justify; color: rgb(0, 0, 0); font-family: ''Open Sans'', Arial, sans-serif; font-size: 14px; letter-spacing: normal; line-height: 20px;">Lorem ipsum dolor sit amet, consectetur adipiscing elit. In accumsan nulla eu ultrices efficitur. Nullam vitae ultricies nisl. Maecenas ante ex, finibus at luctus ac, bibendum id felis. Vestibulum at rutrum orci. Maecenas in lorem mattis, tristique sem non, vestibulum magna. Proin quis eros accumsan, iaculis erat nec, gravida massa. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Mauris malesuada scelerisque turpis vitae viverra. Quisque nec condimentum urna. Ut interdum diam sed erat blandit, a ultricies sapien egestas. Nullam cursus velit sit amet porttitor pellentesque. Proin cursus velit mi. Quisque aliquet feugiat urna, non volutpat tortor pharetra sit amet.</p><p style="margin-bottom: 15px; padding: 0px; text-align: justify; color: rgb(0, 0, 0); font-family: ''Open Sans'', Arial, sans-serif; font-size: 14px; letter-spacing: normal; line-height: 20px;">Donec iaculis arcu in dolor interdum fermentum. Maecenas ligula ante, gravida sit amet semper non, fermentum quis turpis. Nullam vel ligula et tellus sagittis laoreet eget vitae ipsum. Donec luctus elit at diam sollicitudin pretium. Suspendisse vel hendrerit sapien. Vivamus non ex dictum, tempus ipsum et, eleifend turpis. Fusce sed sapien purus. Praesent mauris dolor, gravida et efficitur at, consequat nec ipsum.</p><p style="margin-bottom: 15px; padding: 0px; text-align: justify; color: rgb(0, 0, 0); font-family: ''Open Sans'', Arial, sans-serif; font-size: 14px; letter-spacing: normal; line-height: 20px;">Fusce convallis dui suscipit, dignissim ante eget, faucibus enim. Aenean elementum cursus purus vel faucibus. In imperdiet pellentesque cursus. Curabitur eu felis sit amet ante lacinia volutpat. Phasellus id varius urna. Aliquam congue in metus a ultrices. Nullam lacinia vestibulum arcu, quis bibendum sem dapibus vel. Aliquam erat volutpat. Fusce dapibus condimentum interdum. Sed et condimentum diam, ut mattis quam. Vestibulum in est non dolor congue rutrum aliquet ut mauris.</p>','Lorep Ipsum','2016-05-04 09:15:19.327 +00:00','2016-05-04 09:15:19.547 +00:00',13);
INSERT INTO `notes` VALUES (48,'<h1 style="margin-bottom: 15px; padding: 0px;"><span style="text-decoration: underline; background-color: yellow;">Fusce convallis</span></h1><h2 style="margin-bottom: 15px; padding: 0px; color: rgb(0, 0, 0); font-family: ''Open Sans'', Arial, sans-serif; font-size: 14px; letter-spacing: normal; line-height: 20px;">Fusce convallis dui suscipit, dignissim ante eget, faucibus enim. Aenean elementum cursus purus vel faucibus. In imperdiet pellentesque cursus. Curabitur eu felis sit amet ante lacinia volutpat. Phasellus id varius urna. Aliquam congue in metus a ultrices. Nullam lacinia vestibulum arcu, quis bibendum sem dapibus vel. Aliquam erat volutpat. Fusce dapibus condimentum interdum. Sed et condimentum diam, ut mattis quam. Vestibulum in est non dolor congue rutrum aliquet ut mauris.<br></h2><p style="margin-bottom: 15px; padding: 0px; text-align: justify; color: rgb(0, 0, 0); font-family: ''Open Sans'', Arial, sans-serif; font-size: 14px; letter-spacing: normal; line-height: 20px;">Morbi vel diam sapien. Nulla facilisi. Aenean porttitor libero nec placerat condimentum. Mauris risus elit, eleifend ut sem nec, condimentum efficitur nulla. Nunc efficitur scelerisque ultrices. Phasellus vitae mauris at velit placerat suscipit. Sed id sapien ac elit dapibus bibendum at et nulla. Vestibulum nisl massa, tristique nec arcu et, viverra laoreet sem. Nunc ultrices augue vel sagittis mollis. Nulla aliquam accumsan vestibulum. Nullam turpis lectus, dignissim ut felis quis, dignissim tempus leo. Integer feugiat lorem sed vestibulum egestas.</p>','Fusce convallis','2016-05-04 09:18:15.711 +00:00','2016-05-04 09:18:15.971 +00:00',2);
INSERT INTO `notes` VALUES (49,'Ceci est le contenu de votre premiere note','Ma premiere note','2016-05-04 14:29:08.432 +00:00','2016-05-04 14:29:08.906 +00:00',14);
INSERT INTO `notes` VALUES (50,'Ceci est le contenu de votre premiere note','Ma premiere note','2016-05-04 14:31:17.570 +00:00','2016-05-04 14:31:18.234 +00:00',14);
INSERT INTO `notes` VALUES (51,'Ceci est le contenu de votre premiere note','Ma premiere note','2016-05-04 14:39:13.060 +00:00','2016-05-04 14:39:13.685 +00:00',16);
INSERT INTO `notes` VALUES (52,'Ceci est le contenu de votre premiere note&nbsp;','Ma premiere note','2016-05-04 14:41:20.554 +00:00','2016-05-04 14:58:52.482 +00:00',17);
INSERT INTO `notes` VALUES (53,'zsfxdjgghvhbkjln;kml','qqqqq','2016-05-04 15:07:16.113 +00:00','2016-05-04 15:07:16.284 +00:00',13);
INSERT INTO `notes` VALUES (54,'xxxxxxxxxxxxxxxxxxxxxxxx','XXXXXXX','2016-05-04 15:12:37.345 +00:00','2016-05-04 15:12:37.506 +00:00',3);
CREATE TABLE `folders` (`id` INTEGER PRIMARY KEY AUTOINCREMENT, `name` VARCHAR(255) NOT NULL, `createdAt` DATETIME NOT NULL, `updatedAt` DATETIME NOT NULL, `UserId` INTEGER REFERENCES `Users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE);
INSERT INTO `folders` VALUES (2,'Folder 2','2016-03-24 08:34:00.966 +00:00','2016-03-24 08:34:01.037 +00:00',2);
INSERT INTO `folders` VALUES (3,'Folder 3','2016-03-24 08:34:05.583 +00:00','2016-03-24 08:34:05.781 +00:00',2);
INSERT INTO `folders` VALUES (4,'jhvugj','2016-03-24 15:07:40.691 +00:00','2016-03-24 15:07:40.691 +00:00',NULL);
INSERT INTO `folders` VALUES (5,'jhvugj','2016-03-24 15:07:50.086 +00:00','2016-03-24 15:07:50.086 +00:00',NULL);
INSERT INTO `folders` VALUES (6,'jhvugj','2016-03-24 15:21:15.307 +00:00','2016-03-24 15:21:15.307 +00:00',4);
INSERT INTO `folders` VALUES (7,'qqqqq','2016-05-02 00:02:37.506 +00:00','2016-05-02 00:02:37.590 +00:00',3);
INSERT INTO `folders` VALUES (13,'XXX','2016-05-04 08:07:40.794 +00:00','2016-05-04 08:07:40.976 +00:00',2);
INSERT INTO `folders` VALUES (14,'Favoris','2016-05-04 14:29:08.430 +00:00','2016-05-04 14:29:08.636 +00:00',6);
INSERT INTO `folders` VALUES (15,'Favoris','2016-05-04 14:31:17.569 +00:00','2016-05-04 14:31:17.813 +00:00',7);
INSERT INTO `folders` VALUES (16,'Favoris','2016-05-04 14:39:13.059 +00:00','2016-05-04 14:39:13.281 +00:00',8);
INSERT INTO `folders` VALUES (17,'Favoris','2016-05-04 14:41:20.552 +00:00','2016-05-04 14:41:20.708 +00:00',9);
CREATE TABLE `Users` (`id` INTEGER PRIMARY KEY AUTOINCREMENT, `email` VARCHAR(255) NOT NULL UNIQUE, `password_hash` VARCHAR(255), `email_verified` TINYINT(1), `token` VARCHAR(255), `createdAt` DATETIME NOT NULL, `updatedAt` DATETIME NOT NULL, UNIQUE (email));
INSERT INTO `Users` VALUES (2,'guillaumeyvo@yahoo.fr','$2a$10$UacS2KeNl.Y1Xx1o7R6Nuez51npYsokJT9UKPwxOtv.KgQDXkIWNe',1,'UbLpVmnJGMgPKrxp','2016-03-22 03:11:30.925 +00:00','2016-05-04 13:54:01.094 +00:00');
INSERT INTO `Users` VALUES (8,'guillaumeyvo@gmail.com','$2a$10$ZHoRCvipI7RWJsB5fBzTsOzVvEktS./ume0BJHnAaYN1MyThSWyy.',1,'mD9wG1RAZ4mkHZGn','2016-05-04 14:37:39.906 +00:00','2016-05-04 14:39:13.057 +00:00');
INSERT INTO `Users` VALUES (9,'guillaumepascal.yvo@ynov.com','$2a$10$HCACRS43wFc4Ti23MxCYm.RFz4sguAhMxobMx3.H2FPKsxU7AXCcy',1,'yNvKByJ1IF7yZOr2','2016-05-04 14:40:39.596 +00:00','2016-05-04 14:42:39.130 +00:00');
COMMIT;