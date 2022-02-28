module.exports = class CheckCustomer {

    //判斷name格式
    checkName(name) {
        const filt = /^.{1,30}$/;
        const result = filt.test(name);
        return result;
    }

    //判斷password格式
    checkPassword(password) {
        const filt = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
        const result = filt.test(password);
        return result;
    }

    //判斷describe格式
    checkDescribe(describe) {
        const filt = /^.{0,30}$/;
        const result = filt.test(describe);
        return result;
    }

    //判斷address格式
    checkAddress(address) {
        const filt = /^.{1,200}$/;
        const result = filt.test(address);
        return result;
    }

    //判斷price格式
    checkPrice(price) {
        const filt = /^[1-9]\d*$/;
        const result = filt.test(price);
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