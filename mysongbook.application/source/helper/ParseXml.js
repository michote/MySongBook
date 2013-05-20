// #################
//
// Copyright (c) 2012-2013 Micha Reischuck
//
// MySongBook is available under the terms of the MIT license. 
// The full text of the MIT license can be found in the LICENSE file included in this package.
//
// #################


function ParseXml () {}

  // DOM Parser
  ParseXml.parse_dom = function(xml) {
      var parser = new DOMParser();
      return parser.parseFromString(xml, "text/xml");
  };

  //  Helpers for parse
  // general one tag metadata (copyright, verseOrder, ...)
  ParseXml.get_metadata = function (xml, name) {
    var names = undefined;
    var n = xml.getElementsByTagName(name);
    if (n[0]) {
      for (i = 0, len = n.length; i < len; i++) {
        names = n[i].firstChild.nodeValue;
      }
    }
    return names;
  };
  
  // Titles
  ParseXml.get_titles = function(xml) {
    var names = [];
    var n = xml.getElementsByTagName("title");
    if (n[0]) {
      for (i = 0, len1 = n.length; i < len1; i++) {
        names.push({"title": n[i].firstChild.nodeValue, 
            "lang": n[i].getAttribute("lang")});
      }
      return names;
    } else {
      return false;
    }
  };
  
  ParseXml.titlesToString = function(a, lang) {
    var titles = [];
    if (lang) {
      for(i = 0, len2 = a.length; i < len2; i++) {
        if (a[i].lang === lang) {
          titles.push(a[i].title);
        } else if (!a[i].lang) {
          titles.push(a[i].title);
        }
      }
    } else {
      for(i = 0, len3 = a.length; i < len3; i++) {
        titles.push(a[i].title);
      }
    }
    //~ enyo.log(titles);
    return titles.join(" &ndash; ");
  };
  
  // Authors
  ParseXml.get_authors = function (xml) {
    var names = [];
    var n = xml.getElementsByTagName("author");
    if (n[0]) {
      for (i = 0, len3 = n.length; i < len3; i++) {
        var t = n[i].getAttribute("type")
        if (t === "translation") {
          names.push({"type":t, "author": n[i].firstChild.nodeValue, 
            "lang": n[i].getAttribute("lang")});
        } else {
          names.push({"type":t, "author": n[i].firstChild.nodeValue});
        }
      }
    }
    return names;
  };
  
  ParseXml.authorsToString = function(a) {
    var names = [];
    for (i = 0, len4 = a.length; i < len4; i++) {
      var t = a[i].type
      if (t === "music" || t === "words") {
        names.push($L(t+":") + a[i].author);
      } else if (t === "translation") {
        names.push($L(t) + " (" + a[i].lang + "): " + a[i].author);
      } else {
        names.push(a[i].author);
      }
    }
    //~ enyo.log(names);
    return names;
  };
  
  // Songbooks
  ParseXml.get_songbooks = function(xml) {
    var names = [];
    var n = xml.getElementsByTagName("songbook");
    if (n[0] !== undefined) {
      for (i = 0, len5 = n.length; i < len5; i++) {
        names.push({"book": n[i].getAttribute("name"),
          "no": n[i].getAttribute("entry")});
      }
    }
    return names;
  };
  
  // Themes
  ParseXml.get_themes = function(xml) {
    var names = [];
    var n = xml.getElementsByTagName("theme");
    if (n[0] !== undefined) {
      for (i = 0, len6 = n.length; i < len6; i++) {
        names.push({"theme": n[i].firstChild.nodeValue,
          "lang": n[i].getAttribute("lang")});
      }
    }
    return names;
  };
  
  // Comments
  ParseXml.get_comments = function(xml) {
    var names = [];
    var m = xml.getElementsByTagName("comments")[0];
    if (m !== undefined) { var n = m.getElementsByTagName("comment");}
    if (n !== undefined) {
      for (i = 0, len7 = n.length; i < len7; i++) {
        names.push(n[i].firstChild.nodeValue);
      }
    }
    return names;
    
  };
  
  // format Chord  
  ParseXml.formatChordDiv = function(chord) {
    chord.substring(1) ? chord = chord.charAt(0) + '<small>' + chord.substring(1).replace(/([0-9]+)/g, '<sup>$1</sup>') + '</small>' : chord = chord.charAt(0);
    return chord;
  };
  
  ParseXml.formatChord = function(chord, transp) {
    if (transp) { // Transposer
      if (chord.indexOf("/") >= 0) { // Handle Chords with "/" e.g. "E/D"
        chord = chord.split("/");
        return ParseXml.formatChordDiv(Transposer.transpose(chord[0], transp)) + "/" + ParseXml.formatChordDiv(Transposer.transpose(chord[1], transp));
      } else {
        return ParseXml.formatChordDiv(Transposer.transpose(chord, transp));
      }
    } else {
      if (chord.indexOf("/") >= 0) { // Handle Chords with "/" e.g. "E/D"
        chord = chord.split("/");
        return ParseXml.formatChordDiv(chord[0]) + "/" + ParseXml.formatChordDiv(chord[1]);
      } else {
        return ParseXml.formatChordDiv(chord);
      }
    }
  };
  
  function toArray(nl) {
    for(var a=[], l=nl.length; l--; a[l]=nl[l]);
    return a;
} 
  
  // Parse a single <lines> tag
  ParseXml.parselines = function(line, haschords, showChords, showComments, transp) {
    var lines = "<div class='text'>";
    var trigger = true; // for line starting without chord
    var commenttrigger = false; // remove br after comment
    var musicOnly = false;   // first character |
    var moPrefix = '';
    for (var lineArray=[], l=line.length; l--; lineArray[l]=line[l]);  // NodeList -> Array
    var j = 0;
    while (j < lineArray.length) {  // length is modified within the block
      // handle lyrics with chords
      if (haschords && showChords) { 
        if (lineArray[j].nodeValue === null) { // node is htmltag
          //~ enyo.log(j, lineArray[j].tagName);
          if (lineArray[j].tagName === "chord") {
            trigger = false;
            var chord = lineArray[j].getAttribute("name")
            lines = lines + "<div class='" + moPrefix + "chordbox'><div class='" + moPrefix + "chord'>"+ ParseXml.formatChord(chord, transp) + "&nbsp;" + "</div>";
            if (lineArray[j+1] && (lineArray[j+1].nodeValue === null || // catch chord at line end
              lineArray[j+1].nodeValue.replace(/^[\s\xA0]+/, "") === "")) { 
              lines += "<div class='txt'> </div></div>";
            } else if (!lineArray[j+1] && !trigger) { // also catch chord at line end
              lines += "<div class='txt'> </div></div>";
            }
          } else if (lineArray[j].tagName === "br") {
            trigger = true;
            lines += "<div style='clear:both;'></div>"; 
          } else if (lineArray[j].tagName === "comment") {
            if (showComments) {
              lines += "<i>" + lineArray[j].firstChild.nodeValue + "</i>"
            } else {
              lines += "<span style='line-height: 0;'></span>"
            }
          }
        } else {
          //~ enyo.log(j, lineArray[j].nodeValue);
          var x = lineArray[j].nodeValue.replace(/^[\s\xA0]+/, " ");
          if (x !== " ") { // don't add empty divs
            if (trigger || lineArray[j].nodeType === "mo") { // for line starting without chord or music only
              x = x.replace(/^[\s\xA0]+/, "").replace(/[\s\xA0]+$/, "&nbsp;"); // keep only ending whitespace on beginning of line
              barPrefix = x[0] === '|' ? '' : moPrefix;
              lines = lines + "<div class='" + barPrefix + "chordbox'><div class='chord'>&nbsp;</div>";
            }
            if (musicOnly  && x !== ".") {  
              // add elements to lineArray to add chordboxes for non-chord dot positions. 
              var remStr = x;
              x = remStr[0];
              var i = 1;
              while (i < remStr.length) {
                lineArray.splice(j+i,0, {"nodeValue": remStr[i], "nodeType": "mo"});
                i++;
              }
            }
            x = x.replace(/^[\s\xA0]+/, "&nbsp;").replace(/[\s\xA0]+$/, "&nbsp;"); // keep leeding and ending whitespaces
            lines += "<div class='txt'>" + x + "</div></div>";  // add txt div and close chordbox div
            if (x[0] === "|" && j == 0) {
              musicOnly = true;
              moPrefix = "mo";
            }
          }
        }
      // handle lyrics with chords but don't show chords 
      } else if (haschords && !showChords) { 
        if (lineArray[j].nodeValue === null) { // node is htmltag
          if (lineArray[j].tagName === "chord") {
          } else if(lineArray[j].tagName === "br") {
            if (commenttrigger) {
              commenttrigger = false;
            } else {
              lines += "<br>";
            }
          } else if (lineArray[j].tagName === "comment") {
            if (showComments) {
              lines += "<i>" + lineArray[j].firstChild.nodeValue + "</i>"
            } else {
              commenttrigger = true;
            }
          }
        } else {
          var x = lineArray[j].nodeValue.replace(/^[\s\xA0]+/, "").replace(/[\s\xA0]+$/, "&nbsp;"); //strip nodevalue
          if (x !== '') { // don't add empty divs
            lines += x;
          }
        }
      // handle lyrics without chords
      } else { 
        if (lineArray[j].nodeValue === null) { 
          if (lineArray[j].tagName === "br") {
            if (commenttrigger) {
              commenttrigger = false;
            } else {
              lines += "<br>";
            }
          } else if (lineArray[j].tagName === "comment") {
            if (showComments) {
              lines += "<i>" + lineArray[j].firstChild.nodeValue + "</i>"
            } else {
              commenttrigger = true;
            }
          }
        } else {
          lines += lineArray[j].nodeValue; 
        }
      }
      j++;
    }
    lines += "</div><div style='clear:both;'></div>";
    
    return lines
  };
  
  // ###Lyrics, Chords, Verseorder ###
  ParseXml.get_lyrics = function(xml, vo, showChords, showComments, transp) {
    var data = {}
    var l = xml.getElementsByTagName("verse");
    data.lyrics = {};
    if (l[0] != undefined) {
      // check verseorder, set bit if not to create one 
      var crOrder = false;
      if (!vo) {
        crOrder = true;
        data.verseOrder = [];
      } else { 
        data.verseOrder = false;
      } 
      for (i = 0, len9 = l.length; i < len9; i++) { // [verses]
      
        // check for chords
        if (l[i].getElementsByTagName("chord").length > 0) {
          data.haschords = true;
        }
        
        // get versename and lyrics as html-string
        var line = [];
        for (k=0, len10 = l[i].childElementCount; k < len10; k++) {
          line = line.concat(l[i].getElementsByTagName("lines")[k]);
        }
        var lines = "";
        for (m=0, len11 = line.length; m < len11; m++) {
          if (line[m].getAttribute("part") !== null) {
            lines += "<font color='#9E0508'><i>" + line[m].getAttribute("part")
              + "</i></font><br>";
          }
          lines += ParseXml.parselines(line[m].childNodes, data.haschords, 
            showChords, showComments, transp);
        }  
        
        // add lyrics[id] = [name, lyrics
        var id;
        if (l[i].getAttribute("lang")) { // Languages
          id = l[i].getAttribute("name") + "_" + l[i].getAttribute("lang");
        } else {
          id = l[i].getAttribute("name");
        }
        data.lyrics[id] = [l[i].getAttribute("name"), lines];
        
        // create verseOrder
        if (crOrder) {
          data.verseOrder.push(l[i].getAttribute("name"));
        }
      }
    } else {
      data.lyrics = "nolyrics";
    }
    
    return data;  
  };

  // Parse OpenLyric 0.8
  ParseXml.parse = function(xml, showChords, showComments, transp) {
    var data = {};
    
    // Version Check
    if (xml.getElementsByTagName("song")[0].getAttribute("version") != 0.8) {
      data.lyrics = "wrongversion";  
      enyo.log($L("wrongversion"));
      return data;  
    }
    
    // Data: titles[], authors[music, words], copyright, publisher, verseOrder 
    data.titles = this.get_titles(xml);
    data.authors = this.get_authors(xml);
    data.copyright = this.get_metadata(xml, "copyright");
    data.released = this.get_metadata(xml, "released");
    data.publisher = this.get_metadata(xml, "publisher");
    data.duration = this.get_metadata(xml, "duration");
    if (this.get_metadata(xml, "verseOrder")) {
      data.verseOrder = this.get_metadata(xml, "verseOrder").split(" ");
    }
    data.key = this.get_metadata(xml, "key");
    data.tempo = this.get_metadata(xml, "tempo");
    data.ccli = this.get_metadata(xml, "ccliNo");
    //~ data.transposition = this.get_metadata(xml, "transposition"); 
    data.songbooks = this.get_songbooks(xml);
    //~ data.themes = this.get_themes(xml);
    data.comments = this.get_comments(xml);
    
    //~ enyo.log(this.get_lyrics(xml, data.verseOrder, showChords, showComments));
    var l = this.get_lyrics(xml, data.verseOrder, showChords, showComments,
      transp);
    //~ enyo.log(l);
    if (l.verseOrder) {
      data.verseOrder = l.verseOrder;
    }
    data.haschords = l.haschords;
    data.lyrics = l.lyrics;
    
    // Languages
    data.haslang = [];
    for (i in data.lyrics) {
      if (i.split("_")[1]) {
        data.haslang.push(i.split("_")[1]);
      }
    }
    data.haslang = Helper.removeDoubles(data.haslang);
    
    return data;  
  };


// Parse for editing
  ParseXml.allMetadata = function(xml) {
    var data = {};
    data.created = xml.getElementsByTagName("song")[0].getAttribute("createdIn");
    data.titles = this.get_titles(xml);
    data.authors = this.get_authors(xml);
    var single = ['copyright', 'ccliNo', 'released', 'transposition', 'tempo',
      'key', 'variant', 'publisher', 'version', 'keywords', 'verseOrder', 
      'duration'];
    for (i in single) {
      data[single[i]] = this.get_metadata(xml, single[i]);
    }
    data.songbooks = this.get_songbooks(xml);
    data.themes = this.get_themes(xml);
    data.comments = this.get_comments(xml);
    
    return data;  
  };
  
  ParseXml.editLyrics = function(xml) {
    var data = {};
    var l = xml.getElementsByTagName("verse");
    for (i = 0, len12 = l.length; i < len12; i++) {
      var id = l[i].getAttribute("name");
      var lang = l[i].getAttribute("lang");
      var tdata = {};
      tdata["elname"] = id;
      tdata["language"] = lang;
      var line = [];
      tdata["lines"] = [];
      for (k=0; k<l[i].childElementCount; k++) {
        line = line.concat(l[i].getElementsByTagName("lines")[k]);
      }
      var s = new XMLSerializer();
      for (m=0, len13 = line.length;  m < len13; m++) { // separate lines in verse
        var t = s.serializeToString(line[m]);
        t = t.replace('<lines xmlns="http://openlyrics.info/namespace/2009/song"', '');
        var gtIdx = t.indexOf('>');
        var pIdx = t.indexOf('part');
         var pt = "";
        if (pIdx !== -1 && pIdx < gtIdx) {
          pt = t.slice(pIdx, gtIdx).split('"')[1];
          t = t.replace(t.slice(0, gtIdx+1), '');
        } else {
          t = t.slice(gtIdx+1);
        }
        t = t.replace('</lines>', '');
        // remove line braeks and leading spaces
        var tt = [] 
        for (f in t.split('\n')) {
          tt.push(t.split('\n')[f].replace(/^[\s\xA0]+/, ''));
        }
        t = tt.join('');
        // chords and comments
        t = t.replace(/<chord name="/g, '[').replace(/"\/>/g, ']');
        t = t.replace(/<comment>/g, '*').replace(/<\/comment>/g, '*');
        tdata.lines.push({part: pt, text: t});
      }
      if (lang) {  
        data[id + '_' + lang] = tdata;
      } else {
        data[id] = tdata;
      }
    }
    return data;  
  };
