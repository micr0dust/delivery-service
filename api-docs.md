# REST API

## Version: 1.0.0

### /member/register

#### POST
##### Summary

註冊

##### Description

以姓名、郵箱、密碼註冊帳號，並返回時效為一小時的 token

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| name | formData | 使用者名稱 | Yes | string |
| email | formData | 電子信箱 | Yes | string |
| password | formData | 密碼 | Yes | string |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | 註冊成功 | object |
| 400 | 因格式錯誤導致的註冊失敗 | object |
| 429 | Too Many Requests |  |
| 500 | 因伺服器錯誤導致的註冊失敗 | object |

### /member/login

#### POST
##### Summary

登入

##### Description

以郵箱、密碼登入帳號，並返回時效為一小時的 token

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| email | formData | 電子信箱 | Yes | string |
| password | formData | 密碼 | Yes | string |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | 登入成功 | object |
| 400 | 登入失敗 | object |
| 429 | Too Many Requests |  |

### /member/update

#### PUT
##### Summary

更新使用者資料

##### Description

以使用者 token 請求，成功將更新使用者資料，資料未填寫將不更新

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| token | header | member access token | Yes | [token](#token) |
| name | formData | 使用者名稱 | No | string |
| email | formData | 電子信箱 | No | string |
| phone | formData | 行動手機號碼 | No | string |
| gender | formData | 性別 | No | object |
| birthday | formData | 生日 | No | string |
| password | formData | 密碼 | No | string |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | 更改成功 | object |
| 403 | token錯誤 | object |
| 429 | Too Many Requests |  |
| 500 | 更改失敗 | object |

##### Security

| Security Schema | Scopes |
| --- | --- |
| bearerAuth | |

### /member/delete

#### DELETE
##### Summary

刪除帳號

##### Description

以 token 和密碼請求，刪除帳號。如有店家身分或商品將一併刪除

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| token | header | member access token | Yes | [token](#token) |
| password | formData | 密碼 | Yes | string |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | 帳號已成功刪除 | object |
| 400 | 因無法驗證身份而刪除失敗 | object |
| 403 | token錯誤 | object |
| 429 | Too Many Requests |  |
| 500 | 因伺服器問題導致帳號無法刪除 | object |

##### Security

| Security Schema | Scopes |
| --- | --- |
| bearerAuth | |

### /member/email/send

#### PUT
##### Summary

請求驗證 email 發送

##### Description

以使用者 token 請求，成功將發送驗證碼 email

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| token | header | member access token | Yes | [token](#token) |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | 成功發送驗證碼 | object |
| 403 | token錯誤 | object |
| 429 | Too Many Requests |  |
| 500 | 無法發送驗證碼 | object |

##### Security

| Security Schema | Scopes |
| --- | --- |
| bearerAuth | |

### /member/email/verify

#### PUT
##### Summary

驗證 email

##### Description

以使用者 token 和 verityCode 請求，返回 email 是否驗證成功

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| token | header | member access token | Yes | [token](#token) |
| verityCode | formData | 驗證碼 | Yes | string |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | 驗證成功 | object |
| 401 | 驗證碼錯誤 | object |
| 403 | token錯誤 | object |
| 429 | Too Many Requests |  |

##### Security

| Security Schema | Scopes |
| --- | --- |
| bearerAuth | |

### /member/user/info

#### GET
##### Summary

獲取使用者資料

##### Description

以使用者 token 請求，返回使用者資料

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| token | header | member access token | Yes | [token](#token) |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | 成功獲取使用者資料 | object |
| 400 | 無法獲取使用者資料 | object |
| 403 | token錯誤 | object |
| 429 | Too Many Requests |  |

##### Security

| Security Schema | Scopes |
| --- | --- |
| bearerAuth | |

### /member/user/token

#### GET
##### Summary

請求新令牌 (token)

##### Description

以使用者 refresh_token 請求，返回一個新的 token

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| refresh_token | header | member refresh_token | Yes | [token](#token) |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | 成功獲取新token | object |
| 400 | 無法獲取token | object |
| 403 | token錯誤 | object |
| 429 | Too Many Requests |  |

##### Security

| Security Schema | Scopes |
| --- | --- |
| bearerAuth | |

### /member/user/order

#### POST
##### Summary

訂單寄出

##### Description

以使用者 token 和 Json 陣列形式的資料請求，在資料庫中新增一個訂單。

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| body | body |  | Yes | [order](#order) |
| token | header | member access token | Yes | [token](#token) |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | 點餐成功 | object |
| 403 | token錯誤 | object |
| 429 | Too Many Requests |  |
| 500 | 點餐失敗 | object |

##### Security

| Security Schema | Scopes |
| --- | --- |
| bearerAuth | |

### /member/store

#### GET
##### Summary

獲取商家列表

##### Description

以使用者 token 請求，返回商家列表

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| token | header | member access token | Yes | [token](#token) |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | 成功獲取商家列表 | object |
| 403 | token錯誤 | object |
| 429 | Too Many Requests |  |
| 500 | 無法獲取商家列表 | object |

##### Security

| Security Schema | Scopes |
| --- | --- |
| bearerAuth | |

### /member/store/product

#### GET
##### Summary

獲取特定商家所有商品

##### Description

以使用者 token 請求，返回商家列表

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| token | header | access token | Yes | [token](#token) |
| id | header | store id | Yes | string |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | 成功獲取商品資料 | object |
| 403 | token錯誤 | object |
| 429 | Too Many Requests |  |
| 500 | 無法獲取商品資料 | object |

##### Security

| Security Schema | Scopes |
| --- | --- |
| bearerAuth | |

### /store/get

#### GET
##### Summary

獲取商家資訊

##### Description

以 token 請求，返回商家名稱、地址等相關資訊

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| token | header | member access token | Yes | [token](#token) |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | 成功獲取店家資料 | object |
| 403 | token錯誤 | object |
| 429 | Too Many Requests |  |
| 500 | 無法獲取店家資料 | object |

##### Security

| Security Schema | Scopes |
| --- | --- |
| bearerAuth | |

### /store/login

#### POST
##### Summary

商家開啟營業模式

##### Description

以 token 請求，返回營業模式專屬的一組 token 和 refresh_token

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| token | header | member access token | Yes | [token](#token) |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | 成功 | object |
| 403 | token錯誤 | object |
| 429 | Too Many Requests |  |
| 500 | 切換失敗 | object |

##### Security

| Security Schema | Scopes |
| --- | --- |
| bearerAuth | |

### /store/business/token

#### GET
##### Summary

商家獲取 token

##### Description

以商家營業模式的 refresh_token 請求，返回此商家營業模式的 token

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| refresh_token | header | store refresh token | Yes | [token](#token) |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | 成功獲取新token | object |
| 403 | token錯誤 | object |
| 429 | Too Many Requests |  |
| 500 | 無法獲取token | object |

##### Security

| Security Schema | Scopes |
| --- | --- |
| bearerAuth | |

### /store/establish

#### POST
##### Summary

建立商家

##### Description

以店名和地址為帳號建立商家

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| token | header | member access token | Yes | [token](#token) |
| name | formData | 商店名稱 | Yes | string |
| address | formData | 地址 | Yes | string |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | 註冊成功 | object |
| 400 | 因格式資料錯誤導致註冊失敗 | object |
| 403 | token錯誤 | object |
| 429 | Too Many Requests |  |
| 500 | 因伺服器錯誤導致註冊失敗 | object |

##### Security

| Security Schema | Scopes |
| --- | --- |
| bearerAuth | |

### /store/delete

#### DELETE
##### Summary

刪除商家

##### Description

以 token 和密碼請求，刪除帳號的店家身分及其下商品

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| token | header | member access token | Yes | [token](#token) |
| password | formData | 密碼 | Yes | string |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | 商家身分已成功刪除 | object |
| 400 | 因找不到該帳號所有之店家而導致刪除失敗 | object |
| 403 | token錯誤 | object |
| 429 | Too Many Requests |  |
| 500 | 因伺服器錯誤而導致刪除失敗 | object |

##### Security

| Security Schema | Scopes |
| --- | --- |
| bearerAuth | |

### /store/product/add

#### POST
##### Summary

新增商品

##### Description

以 token 和商品資料請求，建立商品

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| token | header | member access token | Yes | [token](#token) |
| name | formData | 商品名稱 | Yes | string |
| price | formData | 價格 | Yes | number |
| describe | formData | 簡介 | No | string |
| type | formData | 類別 | No | string |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | 新增成功 | object |
| 400 | 因格式資料錯誤導致新增失敗 | object |
| 403 | token錯誤 | object |
| 429 | Too Many Requests |  |
| 500 | 因伺服器錯誤導致新增失敗 | object |

##### Security

| Security Schema | Scopes |
| --- | --- |
| bearerAuth | |

### /store/product/remove

#### DELETE
##### Summary

刪除商品

##### Description

以 token 和商品id請求，刪除商品

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| token | header | member access token | Yes | [token](#token) |
| product | formData | 商品ID | Yes | string |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | 成功刪除商品 | object |
| 403 | token錯誤 | object |
| 429 | Too Many Requests |  |
| 500 | 刪除商品失敗 | object |

##### Security

| Security Schema | Scopes |
| --- | --- |
| bearerAuth | |

### /store/business/order/get

#### GET
##### Summary

商家獲取訂單

##### Description

以商家營業模式的 token 請求，返回此商家所有的訂單

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| token | header | store access token | Yes | [token](#token) |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | 成功獲取訂單 | object |
| 403 | token錯誤 | object |
| 429 | Too Many Requests |  |
| 500 | 無法獲取訂單 | object |

##### Security

| Security Schema | Scopes |
| --- | --- |
| bearerAuth | |

### Models

#### code

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| code | boolean |  |  |

**Example**
<pre>true</pre>

#### id

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| id | string |  |  |

**Example**
<pre>6211e1afb27988329badd497</pre>

#### token

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| token | string |  |  |

**Example**
<pre>eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhbGdvcml0aG0iOiJIUzI1NiIsImV4cCI6MTY1MDEyMTc1MCwiZGF0YSI6IjYyNWFkMDE2NzI0MGNhMzgzOWZlYmQwNSIsImlhdCI6MTY1MDExOTk1MH0.zK_jiJATx4W1INvg1yJsWnn_cnXjD2oc38DaRVTTx8k</pre>

#### order

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| order | array |  |  |
