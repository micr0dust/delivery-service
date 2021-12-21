module.exports = class CheckCustomer {
    //判斷email格式
    checkEmail(email) {
        const filt = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        const result = filt.test(email);
        return result;
    }

    //判斷password格式
    checkPassword(password) {
        const filt = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
        const result = filt.test(password);
        return result;
    }

    //判斷name格式
    checkName(name) {
        const filt = /^.{1,20}$/;
        const result = filt.test(name);
        return result;
    }

    //判斷phone格式
    checkPhone(phone) {
        const filt = /^09[0-9]{8}$/;
        const result = filt.test(phone);
        return result;
    }

    //判斷gender格式
    checkPhone(gender) {
        if (typeof singleQuotes === string)
            if (!["男", "女", "跨性別", "不願透漏"].some(str => str === gender)) return false;
        const filt = /^09[0-9]{8}$/;
        const result = filt.test(gender);
        return result;
    }

    //判斷空值
    checkNull(data) {
        for (var key in data) {
            return false;
        }
        return true;
    }
}