const options = {
    //openapi: "Disable" , // Enable/Disable OpenAPI. By default is null
    //language: "en-US", // Change response language. By default is 'en-US'
    //disableLogs: false , // Enable/Disable logs. By default is false
    //autoHeaders: true, // Enable/Disable automatic headers capture. By default is true
    //autoQuery: true, // Enable/Disable automatic query capture. By default is true
    //autoBody: true // Enable/Disable automatic body capture. By default is true
}
const swaggerAutogen = require('swagger-autogen')(options);

const doc = {
    tags: [
        // by default: empty Array
        {
            name: 'member',
            description: '使用者'
        },
        {
            name: 'store',
            description: '商家後台管理'
        },
        {
            name: 'business',
            description: '商家營業模式'
        },
        {
            name: 'group',
            description: '群組'
        }
    ],
    definitions: {
        redirect_url: { 'redirect_url': 'https://accounts.google.com/o/oauth2/v2/auth?scope=email%20profile&redirect_uri=http://localhost:3000/member/google/callback&response_type=code&client_id=1047494292997-3ph1u638fcq835lnt2dgfmntj8.apps.googleusercontent.com' },
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhbGdvcml0aG0iOiJIUzI1NiIsImV4cCI6MTY1MDEyMTc1MCwiZGF0YSI6IjYyNWFkMDE2NzI0MGNhMzgzOWZlYmQwNSIsImlhdCI6MTY1MDExOTk1MH0.zK_jiJATx4W1INvg1yJsWnn_cnXjD2oc38DaRVTTx8k",
        order: {
            "order": "[{\"_id\":\"62e34a28167d90df4ef71efc\",\"name\":\"超大漢堡\",\"price\":159,\"type\":\"漢堡\",\"discount\":null,\"note\":\"\",\"options\":\"[{\\\"title\\\":\\\"肉種\\\",\\\"option\\\":\\\"牛肉\\\"},{\\\"title\\\":\\\"加料\\\",\\\"option\\\":[\\\"雙層肉\\\"]}]\",\"count\":1}]",
            "total": 144,
            "store": "8y3un9ka",
            "store_info": {
                "name": "友朋小吃",
                "address": "台灣台北市中山區民權東路三段榮星花園"
            },
            "discount": "[\"滿100元，現省15元\"]",
            "tableware": true
        },
        orderStr: "[{\"_id\":\"62e34a28167d90df4ef71efc\",\"name\":\"超大漢堡\",\"price\":169,\"type\":\"漢堡\",\"discount\":null,\"note\":\"\",\"options\":\"[{\\\"title\\\":\\\"肉種\\\",\\\"option\\\":\\\"牛肉\\\"},{\\\"title\\\":\\\"加料\\\",\\\"option\\\":[\\\"雙層肉\\\",\\\"2倍起司\\\"]}]\"}]",
        discountStr: "[\"滿100元，現省15元\"]",
        discount: '[{"method":"exceedPriceDiscount","goal":100,"discount":15}]',
        options: '[{ "title": "肉種", "multiple": false, "requires": true, "option": [{ "name": "牛肉", "cost": "0" }, { "name": "雞肉", "cost": "0" }, { "name": "豬肉", "cost": "0" }, { "name": "魚肉", "cost": "0" }] }, { "title": "加料", "multiple": true, "requires": false, "option": [{ "name": "雙層肉", "cost": "20" }, { "name": "2倍起司", "cost": "10" }] }]'
    }
}

const outputFile = './api-docs.json'
const endpointsFiles = ['./app.js']

swaggerAutogen(outputFile, endpointsFiles, doc);