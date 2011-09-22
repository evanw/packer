#!/usr/bin/env node

var fs = require('fs');
var packer = require('packer');
var args = require('nomnom').opts({
    input_file: {
        abbr: 'i',
		help: 'Input file (default stdin)'
    },
    base62: {
        abbr: 'b',
        flag: true,
		help: 'Base62 encode'
    },
    output_file: {
		abbr: 'o',
		help: 'Output file (default stdout)'
    },
    shrink: {
		abbr: 's',
		help: 'Shrink variables'
	}
}).parseArgs();

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
