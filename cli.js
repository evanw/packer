var fs = require('fs');
var packer = require('packer');
var args = require('nomnom').parseArgs([
	{
		name: 'input_file',
		string: '-i FILE',
		help: 'Input file (default stdin)'
	}, {
		name: 'output_file',
		string: '-o FILE',
		help: 'Output file (default stdout)'
	}, {
		name: 'base62',
		string: '-b',
		help: 'Base62 encode'
	}, {
		name: 'shrink',
		string: '-s',
		help: 'Shrink variables'
	}
]);

var data = '';

function finish() {
	var packed_data = packer.pack(data, args.base62, args.shrink) + '\n';
	if (args.output_file) {
		fs.writeFile(args.output_file, packed_data, function(error) {
			if (error) {
				console.log('could not write to "' + args.output_file + '": ' + error.message);
			}
		});
	} else {
		process.stdout.write(packed_data);
	}
}

if (args.input_file) {
	fs.readFile(args.input_file, function(error, input_data) {
		if (error) {
			console.log('could not read from "' + args.input_file + '": ' + error.message);
		} else {
			data = input_data;
			finish();
		}
	});
} else {
	process.stdin.resume();
	process.stdin.setEncoding('utf8');
	process.stdin.on('data', function (chunk) {
		data += chunk;
	});
	process.stdin.on('end', function () {
		finish();
	});
}
