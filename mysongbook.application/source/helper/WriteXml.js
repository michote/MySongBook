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
      newt=xml.createElement("title");
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
      newa=xml.createElement("author");
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
    
    
    
    // Songbooks
    n = xml.getElementsByTagName("songbook");
    for (i = 0; i < n.length; i++) {
      n[i].parentNode.removeChild(n[i])
    };
    n = xml.getElementsByTagName("songbooks")[0]
    for (i in metadata.songbooks) {
      news=xml.createElement("songbook");
      news.setAttribute("name", metadata.songbooks[i].book);
      if (metadata.songbooks[i].no) {
        news.setAttribute("entry", metadata.songbooks[i].no);
      };
      n.appendChild(news);
    };
    
    
    serializer = new XMLSerializer();
    return serializer.serializeToString(xml);
  };

  WriteXml.create = function (xml) {
    //~ var xml = document.createElement("song");
    //~ tmp.appendChild(l[i].getElementsByTagName("lines")[0]);
    //~ data[id] = tmp.innerHTML;
  };



