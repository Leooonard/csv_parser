class HitThresholdCountCaculator {
    constructor (threshold) {
        this._threshold = threshold;
        this._dataArray = [];
    }

    add (item) {
        this._dataArray.push(item);
    }

    _defaultMapper (item) {
        return item;
    }

    caculate (hitFunc, mapper) {
        mapper = mapper || this._defaultMapper;

        return this._dataArray.map(mapper).reduce((hitCount, value) => {
            if (typeof hitFunc === 'function' && hitFunc(value, this._threshold)) {
                return hitCount + 1;
            } else {
                return hitCount;
            }
        }, 0);
    }
}

module.exports = HitThresholdCountCaculator;
