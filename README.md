# 外送系統API文件
網站位址：https://hello-cycu-delivery-service.herokuapp.com
## /member/register 註冊
- 以姓名、郵箱、密碼註冊帳號，並返回時效為一小時的token
- method: POST
- request
- - body
    {  
     "name" : "userName",  
	"email" : "userEmail",  
	"password" : "userPassword"  
	}  
- response
- - status code 200  
    {  
  	"status": "註冊成功",  
  	"code": true,  
  	"result": {  
      &emsp; "name": "userName",  
      &emsp; "email": "userEmail"  
  	 &emsp;}  
	}  
- - status code 500  
    {  
  	"status": "註冊失敗",  
  	"code": false,  
  	"result": "error message"  
	}   
 
## /member/login 登入
- 以郵箱、密碼登入帳號，並返回時效為一小時的token
- method: POST
- request
- - body
    {  
	"email" : "userEmail",  
	"password" : "userPassword"  
	}  
- response
- - status code 200  
    {  
  	"status": "登入成功",  
  	"code": true,  
  	"result": "歡迎 user 的登入"  
	}  
- - status code 400  
    {  
  	"status": "登入失敗",  
  	"code": false,  
  	"result": "請輸入正確的帳號或密碼"  
	}  
  
## /member/update 更新使用者資料
- 以使用者token請求，成功將更新使用者資料，資料未填寫將不更新
- method: PUT
- request
- - header  
    {  
	"token" : "userToken",  
	"Content-Type" : "application/x-www-form-urlencoded"  
	}  
- - body  
    {  
	"name" : "userEmail", (unnecessary)  
	"email" : "userEmail", (unnecessary)  
	"phone" : "userEmail", (unnecessary)  
	"password" : "userEmail", (unnecessary)  
	"gender" : "userEmail", (unnecessary)  
	"birthday" : "userEmail" (unnecessary)  
	}  
- response
- - status code 200  
    {  
  	"status": "更改成功",  
  	"code": true,  
  	"result": "資料更改成功"  
	}  
- - status code 500  
    {  
  	"status": "更改失敗",  
  	"code": false,  
  	"result": "error message"  
	}  
- - status code 403  
    {  
  	"status": "token錯誤",  
  	"code": false,  
  	"result": "請重新登入"  
	}  
  
## /member/email/send 請求驗證email發送
- 以使用者token請求，成功將發送驗證碼email
- method: POST
- request
- - header
    {  
	"token" : "userToken",  
	"Content-Type" : "application/x-www-form-urlencoded"  
	}  
- response
- - status code 200  
    {  
  	"status": "成功發送驗證碼",  
  	"code": true  
	}  
- - status code 500  
    {  
     status: "無法發送驗證碼",  
     code: false,  
     result: "error message"  
    }  
- - status code 403  
    {  
  	"status": "token錯誤",  
  	"code": false,  
  	"result": "請重新登入"  
	}  
  
## /member/email/verify 驗證email
- 以使用者token和驗證碼請求，返回email是否驗證成功
- method: POST
- request
- - header  
    {  
	"token" : "userToken",  
	"Content-Type" : "application/x-www-form-urlencoded"  
	}  
- - body  
    {  
	"verityCode" : "userVerityCode" (6 digit)  
	}  
- response
- - status code 200  
    {  
  	"status": "驗證成功",  
  	"code": true,  
  	"result": "驗證成功"  
	}  
- - status code 400  
    {  
  	"status": "驗證失敗",  
  	"code": false,  
  	"result": "驗證碼錯誤"  
	}  
- - status code 403  
    {  
  	"status": "token錯誤",  
  	"code": false,  
  	"result": "請重新登入"  
	}  
  
## /member/user/info 獲取使用者資料
- 以使用者token請求，返回email是否驗證成功
- method: GET
- request
- - header  
    {  
	"token" : "userToken",  
	"Content-Type" : "application/x-www-form-urlencoded"  
	}  
- response
- - status code 200  
    {  
  	"status": "成功獲取使用者資料",  
  	"code": true,  
  	"result": {  
    &emsp;"name": "userName",  
    &emsp;"email": "userEmail",  
    &emsp;"create_date": "2021-12-20 12:53:50",  
    &emsp;"update_date": "2021-12-22 15:23:22",  
    &emsp;"verityCode": true,  
    &emsp;"gender": "男",  
    &emsp;"phone": "0955544555",  
    &emsp;"birthday": "2003-01-01"  
  	&emsp;}  
	}  
- - status code 400  
    {  
    "status": "無法獲取使用者資料",  
    "code": false,  
    "result": "error message"  
    }  
- - status code 403  
    {  
  	"status": "token錯誤",  
  	"code": false,  
  	"result": "請重新登入"  
	}  

## 各項輸入允許格式(regex)
- name: /^.{1,20}$/
- email: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
- password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/
- phone: /^09[0-9]{8}$/
- gender: /^(男|女|跨性別|不願透漏)$/
- birthday: /^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/
