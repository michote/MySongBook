var ReadDirAssistant = function() {
}

ReadDirAssistant.prototype.run = function(future) {
	var fs = IMPORTS.require("fs");
	
	var path = this.controller.args.path;
	
	/* Verify / Create the backup directory */
	var dir_exists = false;
	var dir_contents = fs.readdirSync('/media/internal');
	if (dir_contents && dir_contents.length > 0) {
		for (var dir_i in dir_contents) {
			if (dir_contents[dir_i] == "MySongBook") {
				dir_exists = true;
			};
		};
	};
	if (!dir_exists) {
		fs.mkdirSync('/media/internal/MySongBook', 777);
	};
	
	fs.readdir(path, function(err, files) { future.result = { path: path, files: files }; });
}
