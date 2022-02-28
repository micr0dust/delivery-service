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
    checkGender(gender) {
        const filt = /^(男|女|跨性別|不願透漏)$/;
        const result = filt.test(gender);
        return result;
    }

    //判斷birthday格式
    checkBirthday(birthday) {
        const filt = /^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/;
        const result = filt.test(birthday);
        return result;
    }

    //判斷describe格式
    checkDescribe(describe) {
        const filt = /^.{0,30}$/;
        const result = filt.test(describe);
        return result;
    }

    //判斷hexStringId格式
    checkHexStringId(id) {
        const filt = /^[a-fA-F0-9]{24}$/;
        const result = filt.test(id);
        return result;
    }

    //判斷count格式
    checkCount(count) {
        const filt = /^[1-9][0-9]?$|^100$/;
        const result = filt.test(count);
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