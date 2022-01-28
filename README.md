# 外送系統 API 文件
網站位址：https://hello-cycu-delivery-service.herokuapp.com
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
- - status code 200  

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
- - status code 500  

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
- - status code 200  

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
- - status code 400  

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
- - status code 200  

body
```json
	{  
  	"status": "更改成功",  
  	"code": true,  
  	"result": "資料更改成功"  
	}  
```
- - status code 500  

body
```json
	{  
  	"status": "更改失敗",  
  	"code": false,  
  	"result": "error message"  
	} 
```
- - status code 403  

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
- - status code 200  

body
```json
    {  
  	"status": "成功發送驗證碼",  
  	"code": true  
	}  
```
- - status code 500  

body
```json
	{  
     	"status": "無法發送驗證碼",  
     	"code": false,  
     	"result": "error message"  
    	}  
```
- - status code 403  

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
- - status code 200  

body
```json
	{  
  	"status": "驗證成功",  
  	"code": true,  
  	"result": "驗證成功"  
	} 
```
- - status code 401  

body
```json
	{  
	"status": "驗證碼錯誤",
        "code": false,
        "result": "請確認驗證碼" 
	}  
```
- - status code 403  

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
- - status code 200  

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
- - status code 400  

body
```json
	{  
    	"status": "無法獲取使用者資料",  
    	"code": false,  
    	"result": "error message"  
    	}  
```
- - status code 403  

body
```json
	{  
  	"status": "token錯誤",  
  	"code": false,  
  	"result": "請重新登入"  
	}  
```
## /member/user/token 請求新令牌 (token)
- 以使用者 fresh_token 請求，返回一個新的 token
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
- - status code 200  

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
- - status code 403  

body
```json
	{  
  	"status": "token錯誤",  
  	"code": false,  
  	"result": "請重新登入"  
	}  
```
## 各項輸入允許格式 (regex)
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



