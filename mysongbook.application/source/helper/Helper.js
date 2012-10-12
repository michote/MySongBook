
function Helper() {}

  // small Screen on Phone
  Helper.smScr = function() { 
      return window.innerWidth < 500; 
  };
  
  Helper.dialogHeight = function() {
    if (window.innerHeight < 400) {
      return "230px";
    } else {
      return "350px";
    };
  };
  
  Helper.toasterWidth = function() {
    if (window.innerWidth < 500) {
      return "100%";
    } else {
      return "90%";
    };
    
  };

  // Create songlist with dublicates
  Helper.handleDoubles = function(arr) {
    var i,
      trigger=1,
      len=arr.length,
      out=[],
      obj={};

    for (i=0;i<len;i++) {
      if (obj[arr[i]]) {
        obj[(arr[i]+trigger)]=i;
        trigger += 1;
      } else {
        obj[arr[i]]=i;
      };
    };

    for (i in obj) {
      out.push(i);
    };
    return out;
  };

  // create Lyrics fron verseOrder
  Helper.orderLyrics = function(lyrics, order) {
    var newLyrics = {};
    var order2 = this.handleDoubles(order);
    //~ enyo.log("lyrics: " + lyrics);
    //~ enyo.log("order: " + order);
    //~ enyo.log("order2: " + order2);
    for (i = 0; i < order.length; i++) {
      if (lyrics[order[i]] !== undefined) {
        newLyrics[order2[i]] = [order[i],lyrics[order[i]][1]];
      };
    };
    return newLyrics;
  };
  
  // Search
  Helper.filter = function(filter, term, xml) {
    if (filter === "titles") {return this.searchTitles(term, xml)};
    if (filter === "authors") {return this.searchAuthors(term, xml)};
    if (filter === "lyrics") {return this.searchLyrics(term, xml)};
  };
  
  Helper.isIn = function(term, item) {
    var n = item.indexOf(term);
    //~ enyo.log("found:", term, "?", (n >= 0))
    return n >= 0;
  };
  
  Helper.searchTitles = function(term, xml) {
    var t = ParseXml.get_titles(xml)
    var tit = [];
    for (j in t) {
      tit.push(t[j].title.toLowerCase());
    };
    if (this.isIn(term, tit.join())) {
      return true;
    };
    return false;
  };
  
  Helper.searchAuthors = function(term, xml) {
    var a = ParseXml.authorsToString(ParseXml.get_authors(xml));
    var aut = [];
    for (j in a) {
      aut.push(a[j].toLowerCase());
    };
    if (this.isIn(term, aut.join())) {
      return true;
    };
    return false;
  };
  
  Helper.searchLyrics = function(term, xml) {
    var l = ParseXml.get_lyrics(xml, [""], false, true, 0).lyrics;
    var lyr = [];
    for (j in l) {
      lyr.push(enyo.string.removeHtml(l[j][1].replace(/&nbsp;/g, " ")));
    };
    if (this.isIn(term, lyr.join().toLowerCase())) {
      return true;
    };
    return false;
  };
  
