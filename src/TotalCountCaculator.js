class TotalCountCaculator {
    constructor () {
        this._count = 0;
    }

    add () {
        this._count++;
    }

    caculate () {
        return this._count;
    }
}

module.exports = TotalCountCaculator;
