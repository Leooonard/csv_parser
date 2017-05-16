class MedianCaculator {
    constructor () {
        this._dataArray = [];
    }

    add (item) {
        this._dataArray.push(item);
    }

    _defaultMapper (item) {
        return item;
    }

    _sort (array, sortFunc) {
        sortFunc = typeof sortFunc === 'function' ? sortFunc : (item1, item2) => {
            return item1 - item2;
        };

        return array.sort(sortFunc);
    }

    caculate (mapper, sorter) {
        mapper = mapper || this._defaultMapper;

        let dataArray = this._dataArray.map(mapper);
        let sortedDataArray = this._sort(dataArray, sorter);

        return sortedDataArray[Math.ceil(sortedDataArray.length / 2)];
    }
}

module.exports = MedianCaculator;
