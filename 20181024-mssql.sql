

CREATE DATABASE carPlusGame
COLLATE Chinese_Taiwan_Stroke_CI_AI;

USE carPlusGame;

-- Alter DATABASE carPlusGame COLLATE Chinese_Taiwan_Stroke_CI_AI

CREATE TABLE carPlusGame.dbo.game
(
  [id] UNIQUEIDENTIFIER NOT NULL,
  [name] nvarchar(45) NOT NULL DEFAULT '',
  [parameters] NVARCHAR(max) NOT NULL,
  [description] nvarchar(max) NOT NULL,
  [game_cover_image_url] varchar(500) NOT NULL DEFAULT '',
  [code] varchar(50) NOT NULL DEFAULT '',
  PRIMARY KEY ([id])
);



CREATE TABLE carPlusGame.dbo.game_item
(
  [id] UNIQUEIDENTIFIER NOT NULL,
  [name] nvarchar(50) NOT NULL DEFAULT '',
  [type] int NOT NULL DEFAULT '0',
  [image_url] nvarchar(500) NOT NULL DEFAULT '',
  [game_point] decimal(18,2) NOT NULL DEFAULT '0.00',
  [car_plus_point] decimal(18,2) NOT NULL DEFAULT '0.00',
  [date_created] datetime NOT NULL DEFAULT GETDATE(),
  [enabled_add_score_rate] bit NOT NULL DEFAULT '0' ,
  [enabled_add_game_point_rate] bit NOT NULL DEFAULT '0',
  [used_times] int NOT NULL DEFAULT '-1' ,
  [add_score_rate] float DEFAULT '0' ,
  [add_game_point_rate] float DEFAULT '0' ,
  [level_min_limit] int DEFAULT '-1' ,
  [description] nvarchar(1000) NOT NULL DEFAULT '',
  [enabled] bit NOT NULL DEFAULT '1',
  [sprite_folder_path] nvarchar(500) NOT NULL DEFAULT '',
  [description_short] nvarchar(100) NOT NULL DEFAULT '',
  PRIMARY KEY ([id])
);



CREATE TABLE carPlusGame.dbo.game_question
(
  [id] UNIQUEIDENTIFIER NOT NULL,
  [question] nvarchar(500) NOT NULL DEFAULT '',
  [answer] nvarchar(max) NOT NULL,
  [sort] int NOT NULL DEFAULT '0',
  PRIMARY KEY ([id])
)
;


CREATE TABLE carPlusGame.dbo.member
(
  [id] UNIQUEIDENTIFIER NOT NULL,
  [level] int NOT NULL DEFAULT '1' ,
  [car_plus_member_id] varchar(50) DEFAULT NULL ,
  [experience] decimal(18,2) NOT NULL DEFAULT '0.00' ,
  [car_plus_point] decimal(18,2) NOT NULL DEFAULT '0.00' ,
  [game_point] decimal(18,2) NOT NULL DEFAULT '0.00' ,
  [nick_name] nvarchar(50) NOT NULL DEFAULT '',
  [date_created] datetime NOT NULL DEFAULT GETDATE(),
  [date_updated] datetime NOT NULL DEFAULT GETDATE(),
  [is_block] bit NOT NULL DEFAULT 0,
  PRIMARY KEY ([id])
)
;


CREATE TABLE carPlusGame.dbo.member_game_history
(
  [id] UNIQUEIDENTIFIER NOT NULL,
  [member_id] UNIQUEIDENTIFIER NOT NULL,
  [game_id] UNIQUEIDENTIFIER NOT NULL,
  [game_score] decimal(18,2) NOT NULL DEFAULT '0.00',
  [game_point] decimal(18,2) NOT NULL DEFAULT '0.00',
  [date_created] datetime NOT NULL DEFAULT GETDATE(),
  [date_finished] datetime DEFAULT NULL,
  [before_experience] decimal(18,2) NOT NULL DEFAULT '0.00',
  [after_experience] decimal(18,2) NOT NULL DEFAULT '0.00',
  [change_experience] decimal(18,2) NOT NULL DEFAULT '0.00',
  [before_level] int NOT NULL DEFAULT '0',
  [after_level] int NOT NULL DEFAULT '0',
  [change_level] int NOT NULL DEFAULT '0',
  PRIMARY KEY ([id])
)
;



CREATE TABLE carPlusGame.dbo.member_game_history_game_item
(
  [member_game_item_id] UNIQUEIDENTIFIER NOT NULL,
  [member_game_history_id] UNIQUEIDENTIFIER NOT NULL,
  [date_created] datetime NOT NULL DEFAULT GETDATE(),
  [date_updated] datetime NOT NULL DEFAULT GETDATE(),
  PRIMARY KEY ([member_game_item_id],[member_game_history_id])
)
;


CREATE TABLE carPlusGame.dbo.member_game_item
(
  [id] UNIQUEIDENTIFIER NOT NULL,
  [member_id] UNIQUEIDENTIFIER NOT NULL,
  [game_item_id] UNIQUEIDENTIFIER NOT NULL,
  [enabled] bit NOT NULL,
  [date_created] datetime NOT NULL DEFAULT GETDATE(),
  [date_updated] datetime NOT NULL DEFAULT GETDATE(),
  [total_used_times] int NOT NULL,
  [remain_times] int NOT NULL,
  [date_last_used] datetime DEFAULT NULL,
  [is_using] bit NOT NULL DEFAULT '0' ,
  [member_game_point_history_id] UNIQUEIDENTIFIER DEFAULT NULL,
  PRIMARY KEY ([id])
)
;





CREATE TABLE carPlusGame.dbo.member_login
(
  [client_id] UNIQUEIDENTIFIER NOT NULL,
  [member_id] UNIQUEIDENTIFIER NOT NULL,
  [is_logout] bit NOT NULL DEFAULT '0',
  [date_created] datetime NOT NULL DEFAULT GETDATE(),
  [date_updated] datetime NOT NULL DEFAULT GETDATE(),
  [date_last_logout] datetime DEFAULT NULL,
  PRIMARY KEY ([client_id],[member_id])
)
;



CREATE TABLE carPlusGame.dbo.vars
(
  [key] varchar(100) NOT NULL,
  [description] varchar(200) NOT NULL DEFAULT '',
  [meta_str_1] nvarchar(100) DEFAULT NULL,
  [meta_str_2] nvarchar(100) DEFAULT NULL,
  [meta_int_1] int DEFAULT NULL,
  [meta_int_2] int DEFAULT NULL,
  [meta_str_long] nvarchar(max),
  [meta_date_1] datetime DEFAULT NULL,
  [meta_date_2] datetime DEFAULT NULL,
  PRIMARY KEY ([key])
)
;


CREATE TABLE carPlusGame.dbo.member_game_point_history
(
  [id] UNIQUEIDENTIFIER NOT NULL,
  [member_id] UNIQUEIDENTIFIER NOT NULL,
  [type] int NOT NULL DEFAULT '0',
  [before_game_point] decimal(18,2) NOT NULL DEFAULT '0.00',
  [after_game_point] decimal(18,2) NOT NULL DEFAULT '0.00',
  [change_game_point] decimal(18,2) NOT NULL DEFAULT '0.00',
  [before_car_plus_point] decimal(18,2) NOT NULL DEFAULT '0.00',
  [after_car_plus_point] decimal(18,2) NOT NULL DEFAULT '0.00',
  [change_car_plus_point] decimal(18,2) NOT NULL DEFAULT '0.00',
  [date_created] datetime NOT NULL DEFAULT GETDATE(),
  [description] nvarchar(100) NOT NULL DEFAULT '',
  [game_item_id] UNIQUEIDENTIFIER DEFAULT NULL,
  [member_game_item_id] UNIQUEIDENTIFIER DEFAULT NULL,
  [member_game_history_id] UNIQUEIDENTIFIER DEFAULT NULL,
  [admin_user_name] nvarchar(100) NULL DEFAULT NULL,
  [admin_user_id] UNIQUEIDENTIFIER NULL DEFAULT NULL,
  PRIMARY KEY ([id])
)
;


CREATE TABLE carPlusGame.dbo.admin_user
(
  [id] UNIQUEIDENTIFIER NOT NULL,
  [name] nvarchar(50) NOT NULL DEFAULT '',
  [account] nvarchar(50) NOT NULL,
  [password] nvarchar(500) NOT NULL,
  [date_created] datetime NOT NULL DEFAULT GETDATE(),
  [date_updated] datetime NOT NULL DEFAULT GETDATE(),
  PRIMARY KEY ([id])
);


CREATE TABLE carPlusGame.dbo.member_block_history
(
  [id] UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID(),
  [member_id] UNIQUEIDENTIFIER NOT NULL,
  [reason] nvarchar(500) NOT NULL DEFAULT '',
  [is_deleted] bit NOT NULL DEFAULT '0',
  [admin_user_name] nvarchar(100) NOT NULL DEFAULT '',
  [admin_user_id] UNIQUEIDENTIFIER NOT NULL,
  [date_created] datetime NOT NULL DEFAULT GETDATE(),
  [date_updated] datetime NOT NULL DEFAULT GETDATE(),
  [delete_admin_user_name] nvarchar(100) NULL DEFAULT NULL,
  [delete_admin_user_id] UNIQUEIDENTIFIER NULL DEFAULT NULL,
  PRIMARY KEY ([id])
);


CREATE TABLE carPlusGame.dbo.member_game_item_order
(
  [id] UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID(),
  [member_id] UNIQUEIDENTIFIER NOT NULL,
  [game_item_id] UNIQUEIDENTIFIER NOT NULL,
  [point_type] INT NOT NULL DEFAULT '0',
  [game_item_count] INT NOT NULL DEFAULT '0',
  [point_amount] decimal(18,2) NOT NULL DEFAULT '0.00' ,
  [date_created] datetime NOT NULL DEFAULT GETDATE(),
  [member_game_point_history_id] UNIQUEIDENTIFIER NOT NULL,
  [member_game_item_id] UNIQUEIDENTIFIER NOT NULL,
  PRIMARY KEY ([id])
);


CREATE TABLE carPlusGame.dbo.member_login_daily_history
(
  [member_id] UNIQUEIDENTIFIER NOT NULL,
  [date_record] datetime NOT NULL,
  [date_created] datetime NOT NULL DEFAULT GETDATE(),
  [date_updated] datetime NOT NULL DEFAULT GETDATE(),
  [login_times] INT NOT NULL DEFAULT '0',
  PRIMARY KEY ([member_id],[date_record])
);


INSERT INTO carPlusGame.dbo.admin_user (id,name,account,password,date_created,date_updated) VALUES 
('45929BC8-D0BA-476E-851A-89448C9B0020','管理者','carplus','24fe07faf9348a8bfd4d3929ebab84613c7575c5680f9461cd1f6e04f5c7bd9b','2018-12-02 18:01:48.000','2018-12-02 18:01:48.000')
,('92D609E7-186C-4D90-A088-EB6A1A5EF9D4','客服','service','7420efe99e1a3a16ceae0d1fcfa082398f62d87948859940d5e7536903975906','2018-12-02 18:01:48.000','2018-12-02 18:01:48.000')
;


INSERT INTO carPlusGame.dbo.game (id,name,parameters,description,game_cover_image_url,code) VALUES 
('0821CE27-D446-11E8-9087-0242AC110002','射擊吧超人','{"degreeConfig":{"max":100,"min":1},"rotationSpeed":0.015,"shellInitPower":13,"shellInitWeightSpeed":0.1,"moveModes":[{"xSpeed":1,"ySpeed":0,"circleSpeed":0,"radius":0},{"xSpeed":0,"ySpeed":1,"circleSpeed":0,"radius":0},{"xSpeed":1,"ySpeed":1,"circleSpeed":0,"radius":0},{"xSpeed":0,"ySpeed":0,"circleSpeed":5,"radius":60},{"xSpeed":0.5,"ySpeed":0.5,"circleSpeed":5,"radius":30}]}','超人透過砲彈射擊壞人，按住螢幕瞄準，鬆手即發射，角度正確即可射擊成功，殺死越多壞人分數越高。','','shot')
,('08219C81-D446-11E8-9087-0242AC110002','超人接接樂','{"gameTime":60,"types":[{"score":-2,"name":"bomb"},{"score":3,"name":"gift01"},{"score":3,"name":"gift02"},{"score":3,"name":"gift03"}],"lessTime":5,"fallSpeed":3,"moveSpeed":3}','天空中會落下氣球與炸彈，可透過點擊畫面改變左右方向，接到氣球可加分，接到炸彈會扣分或扣時間，限時3分鐘，接到越多氣球分數越高','','catch')
;

INSERT INTO carPlusGame.dbo.game_item (id,name,[type],image_url,game_point,car_plus_point,date_created,enabled_add_score_rate,enabled_add_game_point_rate,used_times,add_score_rate,add_game_point_rate,level_min_limit,description,enabled,sprite_folder_path,description_short) VALUES 
('2D58AB3C-272F-4587-B9FC-17045B6DA54A','格上紅利',4,'/static/images/icon_bonus.png',500.00,1.00,'2018-10-24 22:48:44.000',0,0,-1,0,0,-1,'於遊戲中獲得之超人幣可購買成為格上紅利，可使用於格上服務折抵，每日限制購買1點。',1,'/static/images/bouns/','')
,('6855F7CC-74F0-4C73-B281-1901BBE94395','超人隊員',1,'',1500.00,0.00,'2018-11-10 15:18:30.000',0,0,-1,0,0,4,'經歷許多挑戰後，正式成為超人隊員，裝備有超人的必備披風，擁有超人的各種基本技能。',1,'/static/images/superman02/','')
,('28CCBE12-023B-42D9-97E0-23B1AFB56029','富翁果實',2,'/static/images/icon_coinup.png',500.00,0.00,'2018-10-24 22:48:44.000',0,1,2,0,1.1,-1,'有錢的富翁託人煉製的神祕果實，使用後的兩場比賽，該場獲得超人幣加乘10%。使用後效果無法中斷，可與能量果實同時使用)',1,'/static/images/coinup/','該場遊戲 超人幣 +10% (效用持續兩場)')
,('CB1CAAA5-3323-4308-AFC6-4108E6F6BB1D','超人隊長',1,'',7500.00,0.00,'2018-11-10 15:18:30.000',0,0,-1,0,0,7,'超人中的隊長，有著高超領導力與堅忍的意志力，所有超人都聽命於隊長，裝備也比隊員們更多更厲害。',1,'/static/images/superman03/','')
,('BCDC5657-F5EF-4D97-ADEE-5BD2129202C2','超人幣',3,'/static/images/icon_coin500.png',500.00,1.00,'2018-10-24 22:48:44.000',0,0,-1,0,0,-1,'使用格上服務所產生之紅利回饋，可購買超人幣，購買遊戲內之道具或角色，1點紅利可兌換500超人幣。',1,'/static/images/coin500/','')
,('2B1B43B8-396F-4FA2-80DE-A6B5F49AF7E2','實習超人',1,'',500.00,0.00,'2018-11-10 15:18:30.000',0,0,-1,0,0,2,'正在進行超人技能訓練的實習超人，配備僅有基本的超人內褲，需經過訓練才能成為真正的超人成員。',1,'/static/images/superman01/','')
,('920A9F93-102F-4B55-9ED5-A93F887DAF27','能量果實',2,'/static/images/icon_coinup.png',500.00,0.00,'2018-10-24 22:48:44.000',1,0,2,1.1,0,-1,'充滿能量的神祕果實，使用後的兩場比賽，遊戲分數加乘10%。(使用後效果無法中斷，可與富翁果實同時使用)',1,'/static/images/scoreup/','該場遊戲 分數 +10% (效用持續兩場)')
,('5D00CE87-93C9-4C54-9F3F-B1B432D2CBD6','一般上班族',1,'',0.00,0.00,'2018-11-10 15:31:39.000',0,0,-1,0,0,-1,'夢想成為超人的一般上班族，內心熱血，有一顆想幫助別人的心，閒暇時間會cosplay成超人參加聚會。',0,'/static/images/superman00/','')
,('6F683116-B9F2-43E9-8E03-F89AAFCF2D5E','力霸超人',1,'',12500.00,0.00,'2018-11-10 15:18:30.000',0,0,-1,0,0,12,'超人中的隱藏角色，力量系的超人，是超人隊長遭遇困境時變身而來，限等級12以上購買使用。',1,'/static/images/superman04/','')
;

INSERT INTO carPlusGame.dbo.game_question (id,question,answer,sort) VALUES 
('D803B45E-3373-4495-91D0-0F8662F9B517','如何購買道具？','進入遊戲中的「購物商城」，就可以挑選您想購買的道具喔~',7)
,('2F417EBA-3205-4EB8-BFD6-11B0E30843E7','超人大挑戰超人幣與格上紅利可以互相轉換嗎？
是一款什麼樣的遊戲？','目前開放格上紅利可轉換為遊戲中可使用之超人幣，
可透過遊戲商城中以格上紅利購買超人幣方式進行轉換

目前尚未開放遊戲累積之超人幣可轉換為格上紅利。
',10)
,('AEC79867-A8A5-42B2-8B53-2E55D96F29D7','超人幣與格上紅利如何在遊戲中使用？','超人幣與格上紅利可於「購物商城」中使用，超人幣可直接購買道具與超人角色。
格上紅利則需先將其換成超人幣，方可於商城中使用。

特別注意：格上紅利一經轉換為超人幣後目前是無法復原成格上紅利的喔！
',4)
,('C69906C7-C8BA-4671-9BCD-3DC319EC3DE3','道具的功能為何？','道具共有兩種果實
能量果實：該場遊戲分數+10% (效果持續兩場)
富翁果實：該場遊戲超人幣+10% (效果持續兩場)

透過道具的使用，可以加快超人幣的累積與等級的提升，
這兩樣道具都可透過遊戲商城進行購買喔！
',9)
,('B22971E8-062F-4246-B68F-4271CCED4BF0','如何更換角色？','進入個人設定後，下方有之角色與道具列表，點擊想要更換的角色，點下使用即可更換！
',8)
,('D34D457E-DAF9-4828-B0CA-47F87BF0861E','如何使用道具？','購買道具後可於個人設定中點擊道具進行使用，或於遊戲開始前於遊戲說明頁點擊使用即可。',11)
,('BDB8ACCD-4E5A-458B-8870-5133AF036A92','
道具可中途停止使用嗎？
','能量果實與富翁果實都會持續兩場遊戲的效力，無法中途停止喔',12)
,('CE194033-7682-495E-9358-7C95FE9BBA09','如何購買角色？','進入遊戲中的「購物商城」，就可以挑選您想購買的角色，角色購買過後即可永久使用。
角色有設定等級限制，達到的等級越高，才可解鎖購買定更厲害的角色，所以要多多進行遊戲挑戰提升等級喔！
',6)
,('0DCAC501-3141-4F52-95EA-8ABAD3B085CE','如何進入遊戲？','經由格上租車行動官網中，登入會員後即可於會員專區中看到超人大挑戰的連結喔，點擊後即可進入喔！
之後還會開放更多格上的行動服務，也可進入超人大挑戰遊戲喔！',3)
,('EB618609-5EAE-48C1-8745-9F4CB43B012D','如何才能升級？','透過不斷進行遊戲，與提升遊戲中的表現，累積分數到達一定的數量後就可以提升等級囉！',5)
;
INSERT INTO carPlusGame.dbo.game_question (id,question,answer,sort) VALUES 
('06A344FB-3E74-492B-8E17-B0B0233BB996','若進行遊戲中跳離遊戲，遊戲的分數和超人幣會計算嗎？','遊戲開始進行後，若在遊戲結束前跳離遊戲，則分數和超人幣皆不列入計算。
且已使用之道具也無法復原喔！
',13)
,('9ABE0AE0-BFF4-4AA3-8612-BF7A472DBC92','超人大挑戰是一款什麼樣的遊戲？','超人大挑戰是格上會員專屬的一款遊戲，會員化身為超人，於城市中進行大挑戰。
透過遊戲中可獲得分數與超人幣，累積分數可提升等級，獲得的超人幣可購買遊戲中道具。
除了這些之外，平常於格上消費所產生的紅利也可於小遊戲當中使用喔！
',1)
,('6FA4048B-E755-49DD-B69B-F1762D5FE418','超人大挑戰限定為格上會員才可進行遊戲嗎？','進入超人大挑戰遊戲限定需有格上會員身分方可進入喔！',2)
;


INSERT INTO carPlusGame.dbo.vars ([key],description,meta_str_1,meta_str_2,meta_int_1,meta_int_2,meta_str_long,meta_date_1,meta_date_2) VALUES 
('host','遊戲網站 host ','www.car-plus.com.tw',NULL,NULL,NULL,NULL,NULL,NULL)
,('level-up-information','升級所需要資訊',NULL,NULL,NULL,NULL,'[
    {
        "level": 1,
        "experience": 0,
        "levelUpGetGamePoint": 0
    },
    {
        "level": 2,
        "experience": 1500,
        "levelUpGetGamePoint": 200
    },
    {
        "level": 3,
        "experience": 2200,
        "levelUpGetGamePoint": 200
    },
    {
        "level": 4,
        "experience": 2500,
        "levelUpGetGamePoint": 250
    },
    {
        "level": 5,
        "experience": 2800,
        "levelUpGetGamePoint": 300
    },
    {
        "level": 6,
        "experience": 3100,
        "levelUpGetGamePoint": 400
    },
    {
        "level": 7,
        "experience": 4500,
        "levelUpGetGamePoint": 550
    },
    {
        "level": 8,
        "experience": 5500,
        "levelUpGetGamePoint": 750
    },
    {
        "level": 9,
        "experience": 7000,
        "levelUpGetGamePoint": 800
    },
    {
        "level": 10,
        "experience": 11000,
        "levelUpGetGamePoint": 1000
    },
    {
        "level": 11,
        "experience": 17000,
        "levelUpGetGamePoint": 1200
    },
    {
        "level": 12,
        "experience": 23000,
        "levelUpGetGamePoint": 1400
    },
    {
        "level": 13,
        "experience": 30000,
        "levelUpGetGamePoint": 1600
    },
    {
        "level": 14,
        "experience": 40000,
        "levelUpGetGamePoint": 1800
    },
    {
        "level": 15,
        "experience": 60000,
        "levelUpGetGamePoint": 2500
    }
]',NULL,NULL)
,('share-text','分享文案','我在超人大挑戰裡獲得 {{score}} 分，快來跟我一起玩 https://{{host}}',NULL,NULL,NULL,NULL,NULL,NULL)
,('test-data','測試資料',NULL,NULL,3,NULL,NULL,NULL,NULL)
;

ALTER TABLE carPlusGame.dbo.[member] ADD short_id varchar(50) DEFAULT '' NOT NULL;

----- 2019-02-26

CREATE TABLE carPlusGame.dbo.game_operational_report
( 
  [date_record] datetime NOT NULL,
  [login_times] INT NOT NULL DEFAULT '0',
  [game_times] INT NOT NULL DEFAULT '0',
  [catch_game_times] INT NOT NULL DEFAULT '0',
  [catch_game_score] decimal(18,2) NOT NULL DEFAULT '0.00',
  [catch_game_point] decimal(18,2) NOT NULL DEFAULT '0.00',
  [shot_game_times] INT NOT NULL DEFAULT '0',
  [shot_game_score] decimal(18,2) NOT NULL DEFAULT '0.00',
  [shot_game_point] decimal(18,2) NOT NULL DEFAULT '0.00',
  [cost_game_point] decimal(18,2) NOT NULL DEFAULT '0.00',
  [cost_car_plus_point] decimal(18,2) NOT NULL DEFAULT '0.00',
  PRIMARY KEY ([date_record])
);

