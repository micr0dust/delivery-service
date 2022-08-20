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
            "tableware": true,
            "orders": [{
                "id": "62e34a28167d90df4ef71efc",
                "count": 1,
                "note": "",
                "options": "[{\"title\":\"肉種\",\"option\":\"牛肉\"},{\"title\":\"加料\",\"option\":[\"雙層肉\",\"2倍起司\"]}]"
            }]
        },
        orderStr: "[{\"_id\":\"62e34a28167d90df4ef71efc\",\"name\":\"超大漢堡\",\"price\":169,\"type\":\"漢堡\",\"discount\":null,\"note\":\"\",\"options\":\"[{\\\"title\\\":\\\"肉種\\\",\\\"option\\\":\\\"牛肉\\\"},{\\\"title\\\":\\\"加料\\\",\\\"option\\\":[\\\"雙層肉\\\",\\\"2倍起司\\\"]}]\"}]",
        discountStr: "[\"滿100元，現省15元\"]",
        discount: '[{"method":"exceedPriceDiscount","goal":100,"discount":15}]',
        options: '[{"_id":"62e34a28167d90df4ef71efc","name":"超大漢堡","price":169,"type":"漢堡","discount":null,"note":"","options":"[{\"title\":\"肉種\",\"option\":\"牛肉\"},{\"title\":\"加料\",\"option\":[\"雙層肉\",\"2倍起司\"]}]","count":1}]'
    }
}

const outputFile = './api-docs.json'
const endpointsFiles = ['./app.js']

swaggerAutogen(outputFile, endpointsFiles, doc);