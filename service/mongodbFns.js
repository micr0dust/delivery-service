module.exports = {
    findToArray: async (collection, filter)=> {
        return await collection.find(filter).toArray();
    }
}