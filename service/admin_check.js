module.exports = class CheckAdmin {
    //判斷 role 格式
    checkRole(role) {
        const filt = /^(user|store|admin|dev)$/;
        const result = filt.test(role);
        return result;
    }
}