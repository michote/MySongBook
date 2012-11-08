// #################
//
// Copyright (c) 2012 Micha Reischuck
//
// MySongBook is available under the terms of the MIT license. 
// The full text of the MIT license can be found in the LICENSE file included in this package.
//
// #################


function ParseXml () {}

  // DOM Parser
  ParseXml.parse_dom = function (xml) {
      var parser = new DOMParser();
      return parser.parseFromString(xml, "text/xml");
  };

  //  Helpers for parse
  // general one tag metadata (copyright, verseOrder, ...)
  ParseXml.get_metadata = function (xml, name) {
    var names = undefined;
    var n = xml.getElementsByTagName(name);
    if (n[0]) {
      for (i = 0; i < n.length; i++) {
        names = n[i].firstChild.nodeValue;
      }
    }
    return names;
  };
  
  // Titles
  ParseXml.get_titles = function (xml) {
    var names = [];
    var n = xml.getElementsByTagName("title");
    if (n[0]) {
      for (i = 0; i < n.length; i++) {
        names.push({"title": n[i].firstChild.nodeValue, 
            "lang": n[i].getAttribute("lang")});
      }
    }
    return names;
  };
  
  ParseXml.titlesToString = function (a, lang) {
    var titles = [];
    if (lang) {
      for(i = 0; i < a.length; i++) {
        if (a[i].lang === lang[0]) {
          titles.push(a[i].title);
        } else if (!a[i].lang) {
          titles.push(a[i].title);
        }
      }
    } else {
      for(i = 0; i < a.length; i++) {
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
      for (i = 0; i < n.length; i++) {
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
  
  ParseXml.authorsToString = function (a) {
    var names = [];
    for (i = 0; i < a.length; i++) {
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
  ParseXml.get_songbooks = function (xml) {
    var names = [];
    var n = xml.getElementsByTagName("songbook");
    if (n[0] != undefined) {
      for (i = 0; i < n.length; i++) {
        names.push({"book": n[i].getAttribute("name"),
          "no": n[i].getAttribute("entry")});
      }
    }
    return names;
  };
  
  // Parse a single <lines> tag
  ParseXml.parselines = function (line, haschords, showChords, showComments, transp) {
    var lines = "<div class='text'>";
    var trigger = true; // for line starting without chord
    var commenttrigger = false; //remove br after comment
    for(j = 0; j < line.length; j++) {
      // handle lyrics with chords 
      if (haschords && showChords) { 
        if (line[j].nodeValue === null) { // node is htmltag
          //~ enyo.log(j, line[j].tagName);
          if (line[j].tagName === "chord") {
            trigger = false;
            lines += "<div class='chordbox'><div class='chord'>"
            if (transp) { // Transposer
              var chord = line[j].getAttribute("name")
              if (chord.indexOf("/") >= 0) { // Handle Chords with "/" e.g. "E/D"
                chord = chord.split("/")
                lines += Transposer.transpose(chord[0], transp) + "/" + 
                  Transposer.transpose(chord[1], transp) + "&nbsp;&nbsp;"
                    + "</div>";
              } else {
                lines += Transposer.transpose(chord, transp) + 
                  "&nbsp;&nbsp;" + "</div>";
              }
            } else {
              lines += line[j].getAttribute("name") + "&nbsp;&nbsp;" + "</div>";
            }
            if (line[j+1] && (line[j+1].nodeValue === null || // catch chord at line end
              line[j+1].nodeValue.replace(/^[\s\xA0]+/, "") === "")) { 
              lines += "<div class='txt'> </div></div>";
            } else if (!line[j+1] && !trigger) { // also catch chord at line end
              lines += "<div class='txt'> </div></div>";
            }
          } else if(line[j].tagName === "br") {
            trigger = true;
            lines += "<div style='clear:both;'></div>"; 
          } else if (line[j].tagName === "comment") {
            if (showComments) {
              lines += "<i>" + line[j].firstChild.nodeValue + "</i>"
            } else {
              lines += "<span style='line-height: 0;'></span>"
            }
          }
        } else {
          //~ enyo.log(j, line[j].nodeValue);
          var x = line[j].nodeValue.replace(/^[\s\xA0]+/, " ");
          if (x !== " ") { // don't add empty divs
            if (trigger) { // for line starting without chord
              trigger = false;
              lines += "<div class='chordbox'><div class='chord'>&nbsp;</div>";
              x = x.replace(/^[\s\xA0]+/, "").replace(/[\s\xA0]+$/, "&nbsp;"); // keep only ending whitespace on beginning of line
            } else {
              x = x.replace(/^[\s\xA0]+/, "&nbsp;").replace(/[\s\xA0]+$/, "&nbsp;"); // keep leeding and ending whitespaces
            }
            lines += "<div class='txt'>" + x + "</div></div>";
          }
        }
      // handle lyrics with chords but don't show chords 
      } else if (haschords && !showChords) { 
        if (line[j].nodeValue === null) { // node is htmltag
          if (line[j].tagName === "chord") {
          } else if(line[j].tagName === "br") {
            if (commenttrigger) {
              commenttrigger = false;
            } else {
              lines += "<br>";
            }
          } else if (line[j].tagName === "comment") {
            if (showComments) {
              lines += "<i>" + line[j].firstChild.nodeValue + "</i>"
            } else {
              commenttrigger = true;
            }
          }
        } else {
          var x = line[j].nodeValue.replace(/^[\s\xA0]+/, "").replace(/[\s\xA0]+$/, "&nbsp;"); //strip nodevalue
          if (x !== '') { // don't add empty divs
            lines += x;
          }
        }
      // handle lyrics without chords
      } else { 
        if (line[j].nodeValue === null) { 
          if (line[j].tagName === "br") {
            if (commenttrigger) {
              commenttrigger = false;
            } else {
              lines += "<br>";
            }
          } else if (line[j].tagName === "comment") {
            if (showComments) {
              lines += "<i>" + line[j].firstChild.nodeValue + "</i>"
            } else {
              commenttrigger = true;
            }
          }
        } else {
          lines += line[j].nodeValue; 
        }
      }
    }
    lines += "</div><div style='clear:both;'></div>"; 
    
    return lines
  };
  
  // ###Lyrics, Chords, Verseorder ###
  ParseXml.get_lyrics = function (xml, vo, showChords, showComments, transp) {
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
      for (i = 0; i < l.length; i++) { // [verses]
      
        // check for chords
        if (l[i].getElementsByTagName("chord").length > 0) {
          data.haschords = true;
        }
        
        // get versename and lyrics as html-string
        var line = [];
        for (k=0; k<l[i].childElementCount; k++) {
          line = line.concat(l[i].getElementsByTagName("lines")[k]);
        }
        var lines = "";
        for (m=0; m < line.length; m++) {
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
  ParseXml.parse = function (xml, showChords, showComments, transp) {
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
  ParseXml.allMetadata = function (xml) {
    var data = {};
    data.titles = this.get_titles(xml);
    data.authors = this.get_authors(xml);
    data.copyright = this.get_metadata(xml, "copyright");
    data.released = this.get_metadata(xml, "released");
    data.publisher = this.get_metadata(xml, "publisher");
    data.duration = this.get_metadata(xml, "duration");
    data.verseOrder = this.get_metadata(xml, "verseOrder");
    data.key = this.get_metadata(xml, "key");
    data.tempo = this.get_metadata(xml, "tempo");
    data.ccli = this.get_metadata(xml, "ccliNo");
    data.transposition = this.get_metadata(xml, "transposition"); 
    data.songbooks = this.get_songbooks(xml);
    
    return data;  
  };
  
  ParseXml.editLyrics = function (xml) {
    var data = {};
    var l = xml.getElementsByTagName("verse");
    for (i = 0; i < l.length; i++) {
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
      for (m=0; m < line.length; m++) {   // separate lines in verse
        var t = s.serializeToString(line[m]);
        t = t.replace('<lines xmlns="http://openlyrics.info/namespace/2009/song"', '');
        // part
        var gtIdx = t.indexOf('>');
        var pIdx = t.indexOf('part');
         var pt = "";
        if (pIdx !== -1 && pIdx < gtIdx) {
          pt = t.slice(pIdx, gtIdx).split('"')[1];
          t = t.replace(t.slice(0, gtIdx+1), '');
        } else {
          t = t.replace('>', '');
        }
        t = t.replace('</lines>', '');
        t = t.replace(/<chord name="/g, '[').replace(/"\/>/g, ']');
        t = t.replace(/<comment>/g, '*').replace(/<\/comment>/g, '*');
        tdata.lines.push({part: pt, text: t});
      }
      if (lang) {  
        data[id + "_" + lang] = tdata;
      } else {
        data[id] = tdata;
      }
    }
    return data;  
  };
