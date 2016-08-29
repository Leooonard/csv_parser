'use strict';

let parse = require('csv-parser');
let fs = require('fs');

const CSV_FILE_PATH = 'data.csv';

let loggedData = {};
let filteredLogDataCount = 0;

fs.createReadStream(CSV_FILE_PATH, {
	encoding: 'utf-8'
})
.pipe(parse())
.on('data', function (row) {
	addLogData(row);
 })
.on('end', function () {
	console.log('end');
	filter();
	// query(1000);
	average();
	console.log('there ara ' + (Object.keys(loggedData).length + filteredLogDataCount) + ' log data in all');
	console.log('and filtered ' + filteredLogDataCount + ' invalid log data');
});

function addLogData (row) {
	try {
		let value = row.value;
		value = JSON.parse(value);
		let stepName = value.timespan.stepName;
		let time = value.timespan.time;
		let token = value.timespan.token;
		if (isLogExist(token)) {
			let log = getLog(token);
			log.setStep(stepName, time);
		} else {
			let log = new Log(token);
			log.setStep(stepName, time);
			setLog(token, log);
		}
	} catch (e) {

	}
}

function isLogExist (token) {
	if (loggedData[token] !== undefined) {
		return true;
	} else {
		return false;
	}
}

function getLog (token) {
	return loggedData[token];
}

function setLog(token, log) {
	loggedData[token] = log;
}

class Log {
	constructor (token) {
		this._token = token;
		this._stepTimeMap = {};
	}

	setStep (stepName, happenTime) {
		const AFTER_RENDER = 'after render'
		const INIT_DATA = 'init_data';

		if (stepName === AFTER_RENDER || stepName === INIT_DATA) {
			if (this._stepTimeMap[stepName] === undefined || this._stepTimeMap[stepName] > parseInt(happenTime)) {
				this._stepTimeMap[stepName] = parseInt(happenTime);
			}
		} else {
			this._stepTimeMap[stepName] = parseInt(happenTime);
		}
	}

	check () {
		if ((this._stepTimeMap['init_data'] === undefined) || this._stepTimeMap['before onload'] === undefined || this._stepTimeMap['after render'] === undefined) {
			filteredLogDataCount++;
			return false;
		}

		if (this._stepTimeMap['before onload'] > this._stepTimeMap['init_data'] || this._stepTimeMap['init_data'] > this._stepTimeMap['after render']) {
			filteredLogDataCount++;
			return false;
		}

		return true;
	}

	caculateTimespan () {
		let timespan1 = this._stepTimeMap['init_data'] - this._stepTimeMap['before onload'];
		let timespan2 = this._stepTimeMap['after render'] - this._stepTimeMap['init_data'];
		let totalTimespan = this._stepTimeMap['after render'] - this._stepTimeMap['before onload'];

		return {
			beforeInit: timespan1, initToRender: timespan2, beforeRender: totalTimespan
		};
	}
}

function filter () {
	Object.keys(loggedData).forEach(function (key) {
		let log = loggedData[key];
		if (!log.check()) {
			delete loggedData[key];
		}
	});
}

function query (threshold) {
	let counter = 0;

	Object.keys(loggedData).forEach(function (key) {
		let log = loggedData[key];
		let timespanObj = log.caculateTimespan();

		if (Object.keys(timespanObj).map(function (key) {
			return timespanObj[key];
		}).some(function (timespan) {
			return timespan > threshold;
		})) {
			console.log(timespanObj);
			console.log('=======================');
			counter++;
		}
	});

	console.log('there ara ' + counter + ' logs out of threshold ' + threshold + 'ms');
}

function average () {
	let beforeInitAverage = 0;
	let initToRenderAverage = 0;
	let beforeRenderAverage = 0;
	let totalCount = 0;

	Object.keys(loggedData).forEach(function (key) {
		let log = loggedData[key];
		let timespanObj = log.caculateTimespan();
		beforeInitAverage += timespanObj.beforeInit;
		initToRenderAverage += timespanObj.initToRender;
		beforeRenderAverage += timespanObj.beforeRender;
		totalCount++;
	});

	console.log(beforeRenderAverage);

	console.log('before init average: ' + beforeInitAverage / totalCount + 'ms');
	console.log('init to render average: ' + initToRenderAverage / totalCount + 'ms');
	console.log('before render average: ' + beforeRenderAverage / totalCount + 'ms');
}