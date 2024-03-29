module.exports = class CheckStore {

    //判斷_id格式
    check_id(_id) {
        const filt = /^[a-f\d]{24}$/i;
        const result = filt.test(_id);
        return result;
    }

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
        const filt = /^.{0,100}$/;
        const result = filt.test(describe);
        return result;
    }

    //判斷address格式
    checkAddress(address) {
        const filt = /^.{1,200}$/;
        const result = filt.test(address);
        return result;
    }

    isFloat(n) {
        return Number(n) === n && n % 1 !== 0;
    }

    //判斷price格式
    checkPrice(price) {
        const filt = /^[1-9]\d*$/;
        const result = filt.test(price);
        return result;
    }

    //判斷type格式
    checkType(type) {
        const filt = /^.{0,10}$/;
        const result = filt.test(type);
        return result;
    }

    //判斷discount標籤格式
    checkDiscount(discount) {
        let odiscount = JSON.parse(discount);
        for (let i = 0; i < odiscount.length; i++) {
            if (!odiscount[i]['method']) return false;
            if (isNaN(odiscount[i]['goal'])) return false;
            if (isNaN(odiscount[i]['discount'])) return false;
        }
        return true;
    }

    //判斷空值
    checkNull(data) {
        for (var key in data)
            return false;
        return true;
    }

    checkPlace(data) {
        const acceptPlace = ["未設定", "校門口", "力行宿舍", "恩慈良善宿舍"];
        return acceptPlace.find(opt => opt === data);
    }
}