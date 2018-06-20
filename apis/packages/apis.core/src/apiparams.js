
const apiParams = {
    pageSizeMin: 10,
    pageSizeMax: 100,

    mongo:{
        user: process.env.MONGOUSER,
        pass: process.env.MONGOPASS,
        host:'localhost',
        port:'27017',
        database:'db'
    }
};

export default apiParams;
