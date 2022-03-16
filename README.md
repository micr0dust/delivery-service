# 外送系統 API 文件

網站位址：<https://hello-cycu-delivery-service.herokuapp.com>

## 索引

## [使用者](#api-詳細資料---使用者)

- [/member/register 註冊](#memberregister-註冊)
- [/member/login 登入](#memberlogin-登入)
- [/member/update 更新使用者資料](#memberupdate-更新使用者資料)
- [/member/delete 刪除帳號](#memberdelete-刪除帳號)
- [/member/email/send 請求驗證 email 發送](#memberemailsend-請求驗證-email-發送)
- [/member/email/verify 驗證 email](#memberemailverify-驗證-email)
- [/member/user/info 獲取使用者資料](#memberuserinfo-獲取使用者資料)
- [/member/user/token 請求新令牌 (token)](#memberusertoken-請求新令牌-token)
- [/member/user/order 訂單寄出](#memberuserorder-訂單寄出)
- [/member/store 獲取商家列表](#memberstore-獲取商家列表)
- [/member/store/product 獲取特定商家所有商品](#memberstoreproduct-獲取特定商家所有商品)
- [各項輸入允許格式1 (regex)](#各項輸入允許格式1-regex)

## [商家](#api-詳細資料---商家)

- [/store/business/order/get 商家獲取訂單](#storebusinessorderget-商家獲取訂單)
- [/store/login 商家開啟營業模式](#storelogin-商家開啟營業模式)
- [/store/get 獲取商家資訊](#storeget-獲取商家資訊)
- [/store/establish 建立商家](#storeestablish-建立商家)
- [/store/delete 刪除商家](#storedelete-刪除商家)
- [/store/product/add 新增商品](#storeproductadd-新增商品)
- [/store/product/remove 刪除商品](#storeproductremove-刪除商品)
- [各項輸入允許格式2 (regex)](#各項輸入允許格式2-regex)

## API 詳細資料 - 使用者

## /member/register 註冊

- 以姓名、郵箱、密碼註冊帳號，並返回時效為一小時的 token
- method: POST
- request

body

```json
    {
    "name" : "userName",  
    "email" : "userEmail",  
    "password" : "userPassword"  
    } 
```

- response
- status code 200  

header

```json
    {
    "token": "userToken"
    }
```

body

```json
    {  
      "status": "註冊成功",  
      "code": true,  
      "result": {  
              "name": "userName",  
              "email": "userEmail"  
        }  
    }  
```

- status code 500  

body

```json
    {  
      "status": "註冊失敗",  
      "code": false,  
      "result": "error message"  
    }   
```

## /member/login 登入

- 以郵箱、密碼登入帳號，並返回時效為一小時的 token
- method: POST
- request

body

```json
    {  
    "email" : "userEmail",  
    "password" : "userPassword"  
    }  
```

- response
- status code 200  

header

```json
    {
    "token": "userToken"
    "refresh_token": "userRefreshToken"
    }
```

body

```json
    {  
      "status": "登入成功",  
      "code": true,  
      "result": "歡迎 user 的登入"  
    }  
```

- status code 400  

body

```json
    {  
      "status": "登入失敗",  
      "code": false,  
      "result": "請輸入正確的帳號或密碼"  
    }  
```

## /member/update 更新使用者資料

- 以使用者 token 請求，成功將更新使用者資料，資料未填寫將不更新
- method: PUT
- request

header

```json
    {  
    "token" : "userToken",  
    "Content-Type" : "application/x-www-form-urlencoded"  
    }  
```

body

```json
    {  
    "name" : "userName",
    "email" : "userEmail",
    "phone" : "userPhone",
    "password" : "userPassword",
    "gender" : "userGender",
    "birthday" : "userBirthday"
    }  
```

- response
- status code 200  

body

```json
    {  
      "status": "更改成功",  
      "code": true,  
      "result": "資料更改成功"  
    }  
```

- status code 500  

body

```json
    {  
      "status": "更改失敗",  
      "code": false,  
      "result": "error message"  
    } 
```

- status code 403  

body

```json
    {  
      "status": "token錯誤",  
      "code": false,  
      "result": "請重新登入"  
    }  
```

## /member/delete 刪除帳號

- 以 access_token 和密碼請求，刪除帳號。如有店家身分或商品將一併刪除。
- method: DELETE
- request

header

```json
    {  
    "refresh_token" : "accessToken",
    "Content-Type" : "application/x-www-form-urlencoded"
    }  
```

- response
- status code 200

body

```json
{
  "status": "帳號已成功刪除",
  "code": true,
  "result": "成功刪除帳號"
}
```

- status code 400  

body

```json
    {  
      "status": "刪除失敗",  
      "code": false,  
      "result": "error message"  
    }  
```

- status code 500  

body

```json
    {  
      "status": "帳號無法刪除",  
      "code": false,  
      "result": "error message"  
    }  
```

- status code 403  

body

```json
    {  
      "status": "token錯誤",  
      "code": false,  
      "result": "請重新登入"  
    }  
```

## /member/email/send 請求驗證 email 發送

- 以使用者 token 請求，成功將發送驗證碼 email
- method: POST
- request

header

```json
    {  
    "token" : "userToken",  
    "Content-Type" : "application/x-www-form-urlencoded"  
    }  
```

- response
- status code 200  

body

```json
    {  
      "status": "成功發送驗證碼",  
      "code": true  
    }  
```

- status code 500  

body

```json
    {  
         "status": "無法發送驗證碼",  
         "code": false,  
         "result": "error message"  
        }  
```

- status code 403  

body

```json
    {  
      "status": "token錯誤",  
      "code": false,  
      "result": "請重新登入"  
    }  
```

## /member/email/verify 驗證 email

- 以使用者 token 和 verityCode 請求，返回 email 是否驗證成功
- method: POST
- request

header

```json
    {  
    "token" : "userToken",  
    "Content-Type" : "application/x-www-form-urlencoded"  
    }  
```

body

```json
    {  
    "verityCode" : "userVerityCode"
    }  
```

- response
- status code 200  

body

```json
    {  
      "status": "驗證成功",  
      "code": true,  
      "result": "驗證成功"  
    } 
```

- status code 401  

body

```json
    {  
    "status": "驗證碼錯誤",
        "code": false,
        "result": "請確認驗證碼" 
    }  
```

- status code 403  

body

```json
    {  
      "status": "token錯誤",  
      "code": false,  
      "result": "請重新登入"  
    }  
```

## /member/user/info 獲取使用者資料

- 以使用者 token 請求，返回使用者資料
- method: GET
- request

header

```json
    {  
    "token" : "userToken",  
    "Content-Type" : "application/x-www-form-urlencoded"  
    }  
```

- response
- status code 200  

body

```json
    {  
      "status": "成功獲取使用者資料",  
      "code": true,  
      "result": {  
          "name": "userName",  
            "email": "userEmail",  
           "create_date": "2021-12-20 12:53:50",  
            "update_date": "2021-12-22 15:23:22",  
            "verityCode": true,  
            "gender": "男",  
            "phone": "0955544555",  
            "birthday": "2003-01-01"  
          }  
    }  
```

- status code 400  

body

```json
    {  
        "status": "無法獲取使用者資料",  
        "code": false,  
        "result": "error message"  
        }  
```

- status code 403  

body

```json
    {  
      "status": "token錯誤",  
      "code": false,  
      "result": "請重新登入"  
    }  
```

## /member/user/token 請求新令牌 (token)

- 以使用者 refresh_token 請求，返回一個新的 token
- method: GET
- request

header

```json
    {  
    "refresh_token" : "userRefreshToken",  
    "Content-Type" : "application/x-www-form-urlencoded"  
    }  
```

- response
- status code 200  

header

```json
    {
      "token": "userToken"
    }
```

body

```json
    {
      "status": "成功獲取新token",
      "code": true,
      "result": "token時效為半小時"
    }
```

- status code 500  

body

```json
    {  
        "status": "無法獲取token",  
        "code": false,  
        "result": "error message"  
        }  
```

- status code 403  

body

```json
    {  
      "status": "token錯誤",  
      "code": false,  
      "result": "請重新登入"  
    }  
```

## /member/user/order 訂單寄出

- 以使用者 access_token 和 Json 陣列形式的資料請求，在資料庫中新增一個訂單。
- method: POST
- request

header

```json
    {  
    "refresh_token" : "accessToken",  
    "Content-Type" : "application/x-www-form-urlencoded"  
    }  
```

body

```json
  [
    {
      "id": "6211e1afb27988329badd497",
      "count": 4,
      "note": "熱"
    },{
      "id": "6211e1d8b27988329badd498",
      "count": 1,
      "note": "冰的"
    }
  ]
```

- response
- status code 201  

body

```json
    {
      "status": "點餐成功",
      "code": true,
      "result": "[{\"id\":\"6211e1afb27988329badd497\",\"count\":4,\"note\":\"熱\"},{\"id\":\"6211e1d8b27988329badd498\",\"count\":1,\"note\":\"冰的\"}]"
    }
```

- status code 500  

body

```json
    {  
        "status": "點餐失敗",  
        "code": false,  
        "result": "error message"  
        }  
```

- status code 403  

body

```json
    {  
      "status": "token錯誤",  
      "code": false,  
      "result": "請重新登入"  
    }  
```

## /member/store 獲取商家列表

- 以使用者 token 請求，返回商家列表
- method: GET
- request

header

```json
    {  
    "token" : "userToken",  
    "Content-Type" : "application/x-www-form-urlencoded"  
    }  
```

- response
- status code 200  

body

```json
  {
  "status": "成功獲取商家列表",
  "code": true,
  "result": [
      {
      "name": "友朋小吃",
      "address": "桃園市中壢區OO街OO號",
      "id": "8y3un9ka"
      },
      {
        "name": "燒肉飯店",
        "address": "台北市中山區OO街OO號",
        "id": "9xe72aqx"
      }
    ]
  }
```

- status code 500  

body

```json
    {  
        "status": "無法獲取商家列表",  
        "code": false,  
        "result": "error message"  
        }  
```

- status code 403  

body

```json
    {  
      "status": "token錯誤",  
      "code": false,  
      "result": "請重新登入"  
    }  
```

## /member/store/product 獲取特定商家所有商品

- 以使用者 token 、商家Id請求，返回特定商家的所有商品
- method: GET
- request

header

```json
    {  
    "token" : "userToken",
    "id" : "storeId",
    "Content-Type" : "application/x-www-form-urlencoded"  
    }  
```

- response
- status code 200  

body

```json
    {  
      "status": "成功獲取商品資料",  
      "code": true,  
      "result": [
            {
                  "name": "奶茶",
                  "price": "30",
                  "describe": "",
                  "type": "飲料"
            },
            {
                  "name": "漢堡",
                  "price": "1395",
                  "describe": "美味蟹堡",
                  "type": "熱食"
            }
        ]
    }
```

- status code 500  

body

```json
    {  
        "status": "無法獲取商品資料",  
        "code": false,  
        "result": "error message"  
        }  
```

- status code 403  

body

```json
    {  
      "status": "token錯誤",  
      "code": false,  
      "result": "請重新登入"  
    }  
```

## 各項輸入允許格式1 (regex)

name:

```dart
/^.{1,20}$/
```

email:

```java
/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
```

password:

```java
/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/
```

phone:

```java
/^09[0-9]{8}$/
```

gender:

```java
/^(男|女|跨性別|不願透漏)$/
```

birthday:

```java
/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/
```

describe:

```java
/^.{0,30}$/
```

id:

```java
/^[a-fA-F0-9]{24}$/
```

count:

```java
/^[1-9][0-9]?$|^100$/
```

## API 詳細資料 - 商家

## /store/business/order/get 商家獲取訂單

- 以商家的 access_token 請求，返回此商家所有的訂單
- method: GET
- request

header

```json
    {  
    "token" : "storeAccessToken",  
    "Content-Type" : "application/x-www-form-urlencoded"  
    }  
```

- response
- status code 200  

body

```json
    {
    "status": "成功獲取訂單",
      "code": true,
    "result": [
    {
      "DATE": "2022-02-20T06:29:32.928Z",
      "id": "61c9774137e1ba4becbbe1c7",
      "_id": "6211dfd06fdc48d566ae202e",
      "order": "[{\"id\":\"620cdd750813c9620d3c7fd0\",\"count\":\"2\"},{\"id\":\"620cdc8c8e1bae9b3962b1f2\",\"count\":\"1\",\"describe\":\"去冰\"}]",
      "store": "62062d8d136e8a533bb22e48"
    },
    {
      "DATE": "2022-02-20T06:30:55.254Z",
      "id": "61c9774137e1ba4becbbe1c7",
      "_id": "6211e02249403543cdb3148f",
      "order": "[{\"id\":\"620cdd750813c9620d3c7fd0\",\"count\":\"4\"},{\"id\":\"620cdc8c8e1bae9b3962b1f2\",\"count\":\"1\",\"describe\":\"熱\"}]",
      "store": "62062d8d136e8a533bb22e48"
    },
    {
      "DATE": "2022-02-20T06:43:44.598Z",
      "id": "61c9774137e1ba4becbbe1c7",
      "_id": "6211e32327e60f21cc93d7a9",
      "order": "[{\"id\":\"6211e1afb27988329badd497\",\"count\":\"1\"},]",
      "store": "62062d8d136e8a533bb22e48"
    }
    ]
    }
```

- status code 500  

body

```json
    {  
        "status": "無法獲取訂單",  
        "code": false,  
        "result": "error message"  
        }  
```

- status code 403  

body

```json
    {  
      "status": "token錯誤",  
      "code": false,  
      "result": "請重新登入"  
    }  
```

## /store/business/token 商家獲取 token

- 以商家的 refresh_token 請求，返回此商家營業模式的 token
- method: GET
- request

header

```json
    {  
    "refresh_token" : "storeRefreshToken",  
    "Content-Type" : "application/x-www-form-urlencoded"  
    }  
```

- response
- status code 200  

header

```json
    {  
    "token" : "storeAccessToken"
    }  
```

body

```json
  {
  "status": "成功獲取新token",
  "code": true,
  "result": "token時效為半小時"
  }
```

- status code 500  

body

```json
    {  
        "status": "無法獲取token",  
        "code": false,  
        "result": "error message"  
        }  
```

- status code 403  

body

```json
    {  
      "status": "token錯誤",  
      "code": false,  
      "result": "請重新登入"  
    }  
```

## /store/login 商家開啟營業模式

- 以商家的 access_token 請求，返回營業模式專屬的一組 access_token 和 refresh_token
- method: POST
- request

header

```json
    {  
    "token" : "storeAccessToken",  
    "Content-Type" : "application/x-www-form-urlencoded"  
    }  
```

- response
- status code 200  

header

```json
    {  
    "token" : "bussinessAccessToken",  
    "refresh_token" : "bussinessRefreshToken"  
    }  
```

body

```json
    {
      "status": "成功",
      "code": true,
      "result": "友朋小吃 的營運模式已開啟"
    }
```

- status code 500  

body

```json
    {  
        "status": "切換失敗",  
        "code": false,  
        "result": "error message"  
        }  
```

- status code 403  

body

```json
    {  
      "status": "token錯誤",  
      "code": false,  
      "result": "請重新登入"  
    }  
```

## /store/get 獲取商家資訊

- 以商家的 access_token 請求，返回商家名稱、地址等相關資訊
- method: GET
- request

header

```json
    {  
    "token" : "storeAccessToken",  
    "Content-Type" : "application/x-www-form-urlencoded"  
    }  
```

- response
- status code 200  

body

```json
{
  "status": "成功獲取店家資料",
  "code": true,
  "result": {
    "name": "友朋小吃",
    "address": "桃園市中壢區OO街OO號",
    "create_date": "2022-02-11 17:34:03",
    "last_login": "2022-02-25 17:53:25",
    "product": [
      "6211e1afb27988329badd497",
      "6211e1d8b27988329badd498"
    ]
  }
}
```

- status code 500  

body

```json
    {  
      "status": "切換失敗",  
      "code": false,  
      "result": "error message"  
    }  
```

- status code 403  

body

```json
    {  
      "status": "token錯誤",  
      "code": false,  
      "result": "請重新登入"  
    }  
```

## /store/establish 建立商家

- 以店名和地址為帳號建立商家
- method: POST
- request

header

```json
    {  
    "token" : "accessToken",  
    "Content-Type" : "application/x-www-form-urlencoded"  
    }  
```

body

```json
{
  "name": "店名",
  "address": "地址"
}
```

- response
- status code 201

body

```json
{
  "status": "註冊成功",
  "code": true,
  "result": {
    "name": "店名",
    "address": "地址"
  }
}
```

- status code 400  

body

```json
    {  
      "status": "註冊失敗",  
      "code": false,  
      "result": "error message"  
    }  
```

- status code 500  

body

```json
    {  
      "status": "註冊失敗",  
      "code": false,  
      "result": "error message"  
    }  
```

- status code 403  

body

```json
    {  
      "status": "token錯誤",  
      "code": false,  
      "result": "請重新登入"  
    }  
```

## /store/delete 刪除商家

- 以 access_token 和密碼請求，刪除帳號的店家身分及其下商品
- method: DELETE
- request

header

```json
    {  
    "token" : "accessToken",
    "Content-Type" : "application/x-www-form-urlencoded"
    }  
```

- response
- status code 200

body

```json
{
  "status": "商家身分已成功刪除",
  "code": true,
  "result": "成功刪除商家及其商品"
}
```

- status code 400  

body

```json
    {  
      "status": "刪除失敗",  
      "code": false,  
      "result": "error message"  
    }  
```

- status code 500  

body

```json
    {  
      "status": "商家身分刪除失敗",  
      "code": false,  
      "result": "error message"  
    }  
```

- status code 403  

body

```json
    {  
      "status": "token錯誤",  
      "code": false,  
      "result": "請重新登入"  
    }  
```

## /store/product/add 新增商品

- 以商家的 access_token 和商品資料請求，建立商品
- method: POST
- request

header

```json
    {  
    "token" : "storeAccessToken",  
    "Content-Type" : "application/x-www-form-urlencoded"  
    }  
```

body

```json
{
  "name": "火腿蛋餅",
  "price": "25",
  "describe": "有火腿",
  "type": "蛋餅"
}
```

- response
- status code 201  

body

```json
{
  "status": "新增成功",
  "code": true,
  "result": {
    "name": "火腿蛋餅",
    "price": "25",
    "describe": "有火腿",
    "type": "蛋餅"
  }
}
```

- status code 400  

body

```json
    {  
      "status": "新增失敗",  
      "code": false,  
      "result": "error message"  
    }  
```

- status code 500  

body

```json
    {  
      "status": "新增失敗",  
      "code": false,  
      "result": "error message"  
    }  
```

- status code 403  

body

```json
    {  
      "status": "token錯誤",  
      "code": false,  
      "result": "請重新登入"  
    }  
```

## /store/product/remove 刪除商品

- 以商家的 access_token 和商品id請求，刪除商品
- method: DELETE
- request

header

```json
    {  
    "token" : "storeAccessToken",  
    "Content-Type" : "application/x-www-form-urlencoded"  
    }  
```

body

```json
{
  "product": "6218bc479bd8bbdaa3036906"
}
```

- response
- status code 201  

body

```json
{
  "status": "成功刪除商品",
  "code": true,
  "result": "6218bc479bd8bbdaa3036906"
}
```

- status code 400  

body

```json
    {  
      "status": "新增失敗",  
      "code": false,  
      "result": "error message"  
    }  
```

- status code 500  

body

```json
    {  
      "status": "新增失敗",  
      "code": false,  
      "result": "error message"  
    }  
```

- status code 403  

body

```json
    {  
      "status": "token錯誤",  
      "code": false,  
      "result": "請重新登入"  
    }  
```

## 各項輸入允許格式2 (regex)

name:

```dart
/^.{1,30}$/
```

password:

```java
/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/
```

describe:

```java
/^.{0,30}$/
```

address:

```java
/^.{1,200}$/
```

price:

```java
/^[1-9]\d*$/
```

type:

```java
/^.{0,10}$/
```
