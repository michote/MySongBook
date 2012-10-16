// #################
//
// Copyright (c) 2012 Micha Reischuck
//
// MySongBook is available under the terms of the MIT license. 
// The full text of the MIT license can be found in the LICENSE file included in this package.
//
// #################


function WriteXml () {}

  // DOM Parser
  WriteXml.edit = function (xml, metadata, lyrics) {
    
    // write edit information
    var edited = xml.getElementsByTagName("song")[0]
    edited.setAttribute("modifiedIn","MySongBook "+enyo.fetchAppInfo().version);
    var date = new Date();
    var dateFmt = new enyo.g11n.DateFmt({
      locale: enyo.g11n.currentLocale(),
      date: "yyyy-MM-dd",
      time: "hh:mm:ss"
    });
    edited.setAttribute("modifiedDate", dateFmt.format(date).replace(' ', 'T'));
    
    // write properties
    var m = xml.getElementsByTagName("properties")[0];
    
    // Titles
    var n = xml.getElementsByTagName("titles")[0];
    var fc = n.firstChild; // remove old childs
    while (fc) {
        n.removeChild(fc);
        fc = n.firstChild;
    };
    for (i in metadata.titles) {
      var newt=xml.createElement("title");
      newt.appendChild(xml.createTextNode(metadata.titles[i].title));
      if (metadata.titles[i].lang) {
        newt.setAttribute("lang", metadata.titles[i].lang);
      };
      n.appendChild(newt);
    };
    
    // Authors
    n = xml.getElementsByTagName("authors")[0];
    if (n) {
      fc = n.firstChild; // remove old childs
      while (fc) {
        n.removeChild(fc);
        fc = n.firstChild;
      };
    } else {
      var newas=xml.createElement("authors");
      m.appendChild(newas);
      n = newas;
    }
    for (i in metadata.authors) {
      var newa=xml.createElement("author");
      newa.appendChild(xml.createTextNode(metadata.authors[i].author));
      if (metadata.authors[i].type) {
        newa.setAttribute("type", metadata.authors[i].type);
      };
      if (metadata.authors[i].lang) {
        newa.setAttribute("lang", metadata.authors[i].lang);
      };
      n.appendChild(newa);
    };
    
    // All single string properties
    var single = ["released", "copyright", "publisher", "key", "tempo", 
      "transposition", "verseOrder"];
    for (i in single) {
      if (metadata[single[i]]) {
        n = xml.getElementsByTagName(single[i])[0];
        //~ enyo.log(n);
        if (n) {
          n.childNodes[0].nodeValue=metadata[single[i]];
        } else {
          var newm=xml.createElement(single[i]);
          newm.appendChild(xml.createTextNode(metadata[single[i]]));
          m.appendChild(newm);
        }
      };
    };
    
    // Songbooks
    n = xml.getElementsByTagName("songbooks")[0];
    if (n) {
      fc = n.firstChild; // remove old childs
      while (fc) {
        n.removeChild(fc);
        fc = n.firstChild;
      };
    } else {
      var newss=xml.createElement("songbooks");
      m.appendChild(newss);
      n = newss;
    }
    n = xml.getElementsByTagName("songbooks")[0];
    for (i in metadata.songbooks) {
      var news=xml.createElement("songbook");
      news.setAttribute("name", metadata.songbooks[i].book);
      if (metadata.songbooks[i].no) {
        news.setAttribute("entry", metadata.songbooks[i].no);
      };
      n.appendChild(news);
    };
    
    // Lyric
    //~ enyo.log(lyrics);
    n = xml.getElementsByTagName("verse");
    var repl = {};
    for (i in lyrics) { // getting nodes by attr 
      for (j = 0; j < n.length; j++) {
        if (i === n[j].getAttribute("name")) {
          repl[i]=n[j];
          break;
        };
      };
    };
    m = xml.getElementsByTagName("lyrics")[0];
    for (i in lyrics) {
      // Create xml from inputstring
      var text = lyrics[i].replace(/\[/g,"#[").replace(/\]/g,"]#");
      text = text.replace(/<br>/g,"#<br>#").replace(/<comment>/g,"#<comment>");
      text = text.replace(/<\/comment>/g,"</comment>#").split('#');
      var newl = xml.createElement("lines");
      for (j in text) {
        var newe = "";
        if (text[j].search(/^\[.+\]$/) > -1) { // chords '[X]'
          newe = xml.createElement("chord");
          newe.setAttribute("name", text[j].replace(/\[/g,"").replace(/\]/g,""));
          newl.appendChild(newe);
        } else if (text[j].search(/<br>/) > -1) { // linebreaks
          newe = xml.createElement("br");
          newl.appendChild(newe);
        } else if (text[j].search(/^\*.+\*$/) > -1) { // comments
          newe = xml.createElement("comment");
          var c = text[j].replace(/\*/g,"");
          newe.appendChild(xml.createTextNode(c));
          newl.appendChild(newe);
        } else if (text[j]) { // text
          newe = xml.createTextNode(text[j]);
          newl.appendChild(newe);
        };
      };
      enyo.log(newl);
      
      // Add lyrics to element or create new one
      if (repl[i]) {
        n = repl[i].getElementsByTagName("lines")[0];
        repl[i].removeChild(n);
        repl[i].appendChild(newl);
      } else {
        var newv=xml.createElement("verse");
        newv.setAttribute("name", i);
        var newll=xml.createElement("lines");
        newv.appendChild(newl);
        m.appendChild(newv);
      };
    };
  
    serializer = new XMLSerializer();
    return serializer.serializeToString(xml);
  };

  WriteXml.create = function (name) {
    //~ var xml = document.createElement("song");
  };



