class AverageCaculator {
    constructor () {
        this._dataArray = [];
    }

    add (item) {
        this._dataArray.push(item);
    }

    _defaultMapper (item) {
        return item;
    }

    caculate (mapper) {
        mapper = mapper || this._defaultMapper;

        let total = this._dataArray.map(mapper).reduce((total, value) => {
            return total + value;
        }, 0);

        let count = this._dataArray.length;

        return total / count;
    }
}

module.exports = AverageCaculator;
