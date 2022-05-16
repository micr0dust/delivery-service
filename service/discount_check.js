module.exports = class CheckDiscount {
    exceedPriceDiscount(order, method) {
        let sum = sum(order);
        if (sum >= method.goal) return (method.discount >= 1) ? method.discount : sum * (1 - method.discount);
        return 0;
    }

    exceedCountDiscount(order, method) {
        let sum = sum(order);
        if (order.length >= method.goal) return (method.discount >= 1) ? method.discount : sum * (1 - method.discount);
        return 0;
    }

    sum(order) {
        let sum = 0;
        for (let i = 0; i < order.length; i++)
            sum += order[i].price;
        return sum;
    }
}