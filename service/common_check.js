module.exports = {
    //判斷hexStringId格式
    checkHexStringId: (id)=> {
        const filt = /^[a-fA-F0-9]{24}$/;
        return filt.test(id);
    },
    //必須輸入正確 ID 格式 /^[a-fA-F0-9]{24}$/
    checkStr: (str, RegExp)=> {
        const filt = RegExp;
        return filt.test(str);
    },
    checkNum: (str)=> {
        const filt = /^[1-9]\d*$/;
        return filt.test(str);
    }
}