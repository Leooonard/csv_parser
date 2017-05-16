class GroupCaculator {
    constructor (groupFunc, createMemberFunc, addMemberFunc) {
        this._groupFunc = groupFunc;
        this._createMemberFunc = createMemberFunc;
        this._addMemberFunc = addMemberFunc;

        this._data = {};
    }

    add (data) {
        let key = this._groupFunc(data);
        if (this._data[key] !== undefined) {
            this._addMemberFunc(this._data[key], data);
        } else {
            this._data[key] = this._createMemberFunc(data);
        }
    }

    caculate () {
        return Object.keys(this._data).map(key => this._data[key]);
    }
}

module.exports = GroupCaculator;
