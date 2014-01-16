var http = require('http');
var fs = require('fs');

var settings = {
	inputJson: (typeof process.argv[2] !== 'undefined') ? process.argv[2] : './data.json',
	outputCSV: (typeof process.argv[3] !== 'undefined') ? process.argv[3] : 'data.csv'
}

getData();

function getData() {
	if (settings.inputJson.substring(0, 4) == "http") {
		http.get(settings.inputJson, function(res) {

			var body = '';

			res.on('data', function(chunk) {
				body += chunk;
			});

			res.on('end', function() {
				var data = JSON.parse(body)
				makeData(data);
			});

		}).on('error', function(e) {
			console.log("Got error: ", e);
		});

	} else {
		var data = require(settings.inputJson);
		makeData(data);
	}
}


function makeData(inputData) {

	console.log("Data loaded...");

	var writeStream = fs.createWriteStream(settings.outputCSV);

	var results = inputData.results;

	var result = results[0]['v'];
	var years = results[0]['t'];


	var tableArray = [];

	for (var i = 0; i < result.length; i++) {
		var countryTableArray = [];
		var country = result[i];
		var countryData = country['m'][0];
		var countryCode = country['eid'];
		countryTableArray.push(countryCode);
		for (var j = 0; j < countryData.length; j++) {
			var dataPoint = (countryData[j]) ? countryData[j] : " ";
			countryTableArray.push(dataPoint);
		};
		tableArray.push(countryTableArray);
	};

	var csv = "";

	csv = ' ' + ',' + years.join() + '\n';

	for (var i = 0; i < tableArray.length; i++) {
		csv += tableArray[i].join() + '\n';
	};

	console.log("Done!")
	console.log("Saved as " + settings.outputCSV)


	writeStream.write(csv);

	writeStream.close();

}