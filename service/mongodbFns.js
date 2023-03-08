async function delay(ms) {
    return await new Promise(resolve => setTimeout(resolve, ms));
}
module.exports = {
    findToArray: async (collection, filter)=> {
        return await collection.find(filter).toArray();
    },
    deleteAll: async (collection, filter)=> {
        return await collection.deleteMany(filter);
    }
}