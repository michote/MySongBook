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
    // Titles
    var n = xml.getElementsByTagName("title");
    for (i = 0; i < n.length; i++) {
      n[i].parentNode.removeChild(n[i])
    };
    n = xml.getElementsByTagName("titles")[0]
    for (i in metadata.titles) {
      var newt=xml.createElement("title");
      newt.appendChild(xml.createTextNode(metadata.titles[i].title));
      if (metadata.titles[i].lang) {
        newt.setAttribute("lang", metadata.titles[i].lang);
      };
      n.appendChild(newt);
    };
    
    // Authors
    n = xml.getElementsByTagName("author");
    for (i = 0; i < n.length; i++) {
      n[i].parentNode.removeChild(n[i])
    };
    n = xml.getElementsByTagName("authors")[0]
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
    var m = xml.getElementsByTagName("properties")[0];
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
    n = xml.getElementsByTagName("songbook");
    for (i = 0; i < n.length; i++) {
      n[i].parentNode.removeChild(n[i])
    };
    n = xml.getElementsByTagName("songbooks")[0]
    for (i in metadata.songbooks) {
      var news=xml.createElement("songbook");
      news.setAttribute("name", metadata.songbooks[i].book);
      if (metadata.songbooks[i].no) {
        news.setAttribute("entry", metadata.songbooks[i].no);
      };
      n.appendChild(news);
    };
    
    // Lyric
    enyo.log(lyrics);
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
      //~ var text = lyrics[i] //.replace(/\[/g, "<chord name=\"").replace(/\]/g, "\"\/>");
      var text = lyrics[i].replace(/\[/g, ",[").replace(/\]/g, "],")
      text = text.replace(/</g, ",<").replace(/>/g, ">,").split(',');
      var newe=xml.createElement("lines");
      for (i in text) {
        if (text[i].search(/^\[.+\]$/) > -1) { // chords '[X]'
          enyo.log(text[i]);
        };
      };
      
      // Add lyrics to element or create new one
      //~ if (repl[i]) {
        //~ n = repl[i].getElementsByTagName("lines")[0];
        //~ n.childNodes[0].nodeValue = text;
      //~ } else {
        //~ var newl=xml.createElement("verse");
        //~ newl.setAttribute("name", i);
        //~ var newll=xml.createElement("lines");
        //~ newll.appendChild(xml.createTextNode(text));
        //~ newl.appendChild(newll);
        //~ m.appendChild(newl);
        //~ 
      //~ };
    };
    //~ enyo.log(lyrics[i].replace(/\[/g, "<chord name=\"").replace(/\]/g, "\"\/>"));
  
    serializer = new XMLSerializer();
    return serializer.serializeToString(xml);
  };

  WriteXml.create = function (xml) {
    //~ var xml = document.createElement("song");
    //~ tmp.appendChild(l[i].getElementsByTagName("lines")[0]);
    //~ data[id] = tmp.innerHTML;
  };



