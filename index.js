var glob = require("glob");

var wd = process.argv[2];

var escapeCommasAndTabs = function(text) {
  //todo global escape of commans
  //todo global escape of tabs
  //console.log(text);
  return text.toString().replace(/"/g, "'");
};

var loadTitles = function(_file) {
  var entries = [];

  for(var key in _file) {
    if (key == 'balancing') {
      continue;
    }

    if (key.indexOf('ordliste') != -1) {
      //_file[key].split('\n').length;
      entries.push(key + ' count');
      continue;
    }

    if (key.indexOf('nBack') != -1  || key.indexOf('zeroBack') != -1) {
      entries.push(key + '-missed');
      entries.push(key + '-same-correct');
      entries.push(key + '-same-wrong');
      entries.push(key + '-different-correct');
      entries.push(key + '-different-wrong');
      continue;
    }

    entries.push(key);
  }

  return entries;
};

var loadRow = function(titles, _file) {
  var entries = [];

  for(var i in titles) {
    var key = titles[i];

    if (key.indexOf('ordliste') != -1 && key.indexOf('count') != -1) {
      var ordKey = key.substring(0,13).trim();

      entries.push('"' + _file[ordKey].split('\n').length + '"');

      continue;
    }

    if (key.indexOf('nBack') != -1 || key.indexOf('zeroBack') != -1) {
      var nbackKey;

      if (key.indexOf('nBack') != -1) {
        nbackKey = key.substring(0,9).trim();
      } else {
        nbackKey = key.substring(0,11).trim();
      }

      if (key.indexOf('-missed') != -1) {
        entries.push('"' + _file[nbackKey]['missed'] + '"');
      }
      if (key.indexOf('-same-correct') != -1) {
        entries.push('"' + _file[nbackKey]['same']['correct'] + '"');
      }
      if (key.indexOf('-same-wrong') != -1) {
        entries.push('"' + _file[nbackKey]['same']['wrong'] + '"');
      }
      if (key.indexOf('-different-correct') != -1) {
        entries.push('"' + _file[nbackKey]['different']['correct'] + '"');
      }
      if (key.indexOf('-different-wrong') != -1) {
        entries.push('"' + _file[nbackKey]['different']['wrong'] + '"');
      }

      continue;
    }

    entries.push('"' + escapeCommasAndTabs(_file[key])  + '"');
  }

  return entries;
};

var toCSV = function(data) {
  var csv = '';

  for (var i in data) {
    csv = csv + data[i].toString() + '\r\n';
  }

  return csv;
}

var jsonDirFileNames = function(wd, cb) {
  glob(wd + "/*.json", {}, function (er, files) {
    cb(err)
  });
};

var compileCSV = function(cb) {
  glob(wd + "/*.json", {}, function (er, fileNames) {
    var rows = [];
    var titles = loadTitles(require(fileNames[0]));

    rows.push(titles);

    for(var i in fileNames) {
      var _file = require(fileNames[i]);

      var row = loadRow(titles, _file);

      rows.push(row);
    }

    cb(null, toCSV(rows));
  });
}

//todo: get path from commandline
//todo: load all files from that path
//todo: load all files as json

//todo: upload to github

compileCSV(function(err, csv) {
  console.log(csv);
});
