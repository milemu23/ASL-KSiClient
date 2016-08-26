"use strict";

// One context
for (var i = 0; i < 10; ++i) {
	setTimeout(function () {
		console.log("using var", i);
	}, 1000);
}

// Let creates a new context
for (let j = 0; j < 10; ++j) {
	setTimeout(function () {
		console.log("using let", j);
	}, 1000);
}

var iterate = function (k) {
	setTimeout(function () {
		console.log("using var but with a wrapping function", k);
	}, 1000)
};

for (var k = 0; k < 10; ++k) {
	iterate(k);
}
