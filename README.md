## 安裝說明
1. 安裝 git
2. 安裝 node js
3. 安裝相依套件
    ```bash 
    npm i && npm i -g typescript
    ```
4. 啟動
    - windows system
        ```bash
        npm run start:windows
        ```
    - linux system
        ```bash
        npm start
        ```

## 系統連線參數設定

> 只要修改或新增專案中的 `.env` 檔案就可以
```bash
APP_PORT = 8080     # web listening port 

# DB 相關資訊
DB_HOST=192.168.100.177
DB_PORT=3306
DB_USER=api
DB_PASSWORD=1qaz@WSX
DB_DATABASE_NAME=carPlusGame

TOKEN_SECURITY_KEY=@emagSulpRac770@


# 格上系統 DB 相關資訊
DB_CAR_PLUS_HOST=192.168.100.177
DB_CAR_PLUS_PORT=3306
DB_CAR_PLUS_USER=api
DB_CAR_PLUS_PASSWORD=1qaz@WSX
DB_CAR_PLUS_DATABASE_NAME=carPlusGame

# 測試 ID
CAR_PLUS_TEST_ID_1 = 688086
CAR_PLUS_TEST_ID_2 = 688102
CAR_PLUS_TEST_ID_3 = 688103
```


----

# 遊戲參數

- 射擊參數

```javascript

    // 砲管角度
    const degreeConfig = {
    max: 100,
    min: 1
    }

    // 砲管旋轉速度
    const rotationSpeed = 0.015;

    // 射擊初速度
    const shellInitPower = 13;

    // 初始重量速度
    const shellInitWeightSpeed = 0.1;

    // 怪物移動模式
    const moveModes = [
        { xSpeed: 1, ySpeed: 0, circleSpeed: 0, radius: 0 }, // mode 1  水平移動
        { xSpeed: 0, ySpeed: 1, circleSpeed: 0, radius: 0 }, // mode 2  上下移動
        { xSpeed: 1, ySpeed: 1, circleSpeed: 0, radius: 0 }, // mode 3  斜向移動
        { xSpeed: 0, ySpeed: 0, circleSpeed: 5, radius: 60 }, // mode 4  原地旋轉
        { xSpeed: .5, ySpeed: .5, circleSpeed: 5, radius: 30 }, // mode 5  邊斜向移動邊旋轉
    ]
    // 怪物 1等不會動 4~5等使用 mode1 ~ mode4
    // 怪物 6~10等會依序使用 mode1 ~ mode5
    // 怪物 11等開始會有加成（每5等加一次
    // 11~15 plus = 2 ; 16~20 plus = 3
    // xSpeed * plus ; ySpeed * plus ; 旋轉速度不改變 ; radius旋轉半徑 + (5 * plus) 旋轉半徑最大限制100

    // 5等開始縮小怪物尺寸 scale *= (level * 0.01)  最小到0.5
    // 15等之後xSpeed、ySpeed會隨機 1~xSpeed、1~ySpeed

```
- sample

```json
        {
            "degreeConfig": {
                "max": 100,
                "min": 1
            },
            "rotationSpeed": 0.015,
            "shellInitPower": 13,
            "shellInitWeightSpeed": 0.1,
            "moveModes": [
                {
                    "xSpeed": 1,
                    "ySpeed": 0,
                    "circleSpeed": 0,
                    "radius": 0
                },
                {
                    "xSpeed": 0,
                    "ySpeed": 1,
                    "circleSpeed": 0,
                    "radius": 0
                },
                {
                    "xSpeed": 1,
                    "ySpeed": 1,
                    "circleSpeed": 0,
                    "radius": 0
                },
                {
                    "xSpeed": 0,
                    "ySpeed": 0,
                    "circleSpeed": 5,
                    "radius": 60
                },
                {
                    "xSpeed": 0.5,
                    "ySpeed": 0.5,
                    "circleSpeed": 5,
                    "radius": 30
                }
            ]
        }
```


- 接接樂參數
```javascript

    // 遊戲時間（秒）
    const gameTime = 60; 

    // 掉落物品
    const types = [
        { score: -2, name: 'bomb'
        }, // 炸彈 減少分數
        { score: 3, name: 'gift01'
        }, // 禮物 增加分數
        { score: 3, name: 'gift02'
        },
        { score: 3, name: 'gift03'
        },
    ]
    // 接到炸彈扣的時間（ 0 ~ 5 隨機
    const lessTime = 5;

    // 掉落速度
    const fallSpeed = 3;

    // 超人移動速度
    const moveSpeed = 3;
```
- sample
```json
    {
      "gameTime": 60,
      "types": [
        {
          "score": -2,
          "name": "bomb"
        },
        {
          "score": 3,
          "name": "gift01"
        },
        {
          "score": 3,
          "name": "gift02"
        },
        {
          "score": 3,
          "name": "gift03"
        }
      ],
      "lessTime": 5,
      "fallSpeed": 3,
      "moveSpeed": 3
    }
```


# 資料重置
truncate 

- member
- member_game_history
- member_game_history_game_item
- member_game_item
- member_login
- member_game_point_history
- member_block_history
- member_game_item_order
- member_login_daily_history
- game_operational_report