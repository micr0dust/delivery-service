module.exports = class CheckCustomer {

    //判斷name格式
    checkName(name) {
        const filt = /^.{1,30}$/;
        const result = filt.test(name);
        return result;
    }

    //判斷address格式
    checkAddress(address) {
        const filt = /^.{1,200}$/;
        const result = filt.test(address);
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