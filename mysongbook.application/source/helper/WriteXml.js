// #################
//
// Copyright (c) 2012 Micha Reischuck
//
// MySongBook is available under the terms of the MIT license. 
// The full text of the MIT license can be found in the LICENSE file included in this package.
//
// #################


function WriteXml() {}

  WriteXml.date = function() {
    var date = new Date();
    var dateFmt = new enyo.g11n.DateFmt({
      locale: enyo.g11n.currentLocale(),
      date: "yyyy-MM-dd",
      time: "HH:mm:ss"
    });
    
    return dateFmt.format(date).replace(' ', 'T');
  };
  
  WriteXml.edit = function(xml, metadata, lyrics) {
    var xw = new XMLWriter( 'UTF-8', '1.0' );
    xw.indentChar = ' ';  //indent with spaces
    xw.indentation = 2;   //add 2 spaces per level

    xw.writeStartDocument( );
    xw.writeStartElement('song');
    xw.writeAttributeString('xmlns', 'http://openlyrics.info/namespace/2009/song');
    xw.writeAttributeString('version','0.8');
    xw.writeAttributeString('createdIn', metadata.created);
    xw.writeAttributeString('modifiedIn', enyo.fetchAppInfo().title+' '+enyo.fetchAppInfo().version);
    xw.writeAttributeString('modifiedDate', WriteXml.date());
    
    // Properties
    xw.writeStartElement('properties');
      // Titles
      xw.writeStartElement('titles');
        for (i in metadata.titles) {
          xw.writeStartElement('title');
          if (metadata.titles[i].lang) {
            xw.writeAttributeString('lang', metadata.titles[i].lang);
          }
          xw.writeString(metadata.titles[i].title);
          xw.writeEndElement();
        }
      xw.writeEndElement();

      // Authors
      if (metadata.authors[0]) { xw.writeStartElement('authors');}
      for (i in metadata.authors) {
        xw.writeStartElement('author');
        if (metadata.authors[i].type) {
          xw.writeAttributeString('type', metadata.authors[i].type);
        }
        if (metadata.authors[i].lang) {
          xw.writeAttributeString('lang', metadata.authors[i].lang);
        }
        xw.writeString(metadata.authors[i].author);
        xw.writeEndElement();
      }
      if (metadata.authors[0]) { xw.writeEndElement();}
  
      // All single string properties
      var single = ['copyright', 'ccliNo', 'released', 'transposition',
        'tempo', 'key', 'variant', 'publisher', 'version', 'keywords',
        'verseOrder', 'duration'];
      for (i in single) {
        if (metadata[single[i]]) {
          xw.writeElementString(single[i], metadata[single[i]]);
        }
      }
      
      // Songbooks
      if (metadata.songbooks[0]) { xw.writeStartElement('songbooks');}
      for (i in metadata.songbooks) {
        xw.writeStartElement('songbook');
        xw.writeAttributeString('name', metadata.songbooks[i].book);
        if (metadata.songbooks[i].no) {
          xw.writeAttributeString('entry', metadata.songbooks[i].no);
        }
        xw.writeEndElement();
      }
      if (metadata.songbooks[0]) { xw.writeEndElement();}
      
      // Themes
      if (metadata.themes[0]) { xw.writeStartElement('themes');}
      for (i in metadata.themes) {
        xw.writeStartElement('theme');
        if (metadata.themes[i].lang) {
          xw.writeAttributeString('lang', metadata.themes[i].lang);
        }
        xw.writeString(metadata.themes[i].theme);
        xw.writeEndElement();
      }
      if (metadata.themes[0]) { xw.writeEndElement();}
      
      // Comments
      if (metadata.comments[0]) { xw.writeStartElement('comments');}
      for (i in metadata.comments) {
        xw.writeElementString('comment', metadata.comments[i]);
      }
      if (metadata.comments[0]) { xw.writeEndElement();}
      
    xw.writeEndElement();
    
    xw.writeStartElement('lyrics');
    for (i in lyrics) {
      xw.writeStartElement('verse');
      xw.writeAttributeString('name', lyrics[i].elname);
      if (lyrics[i].language) {
        xw.writeAttributeString('lang', lyrics[i].language);
      }
      for (j in lyrics[i].lines) {
        var l = lyrics[i].lines[j];
        xw.writeStartElement('lines');
        if (l.part) {
          xw.writeAttributeString('part', l.part);
        }
        // Create xml from inputstring
        var text = l.text.replace(/\[/g,"$[").replace(/\]/g,"]$");
        text = text.replace(/<br>/g,"$<br>$").replace(/<comment>/g,"$<comment>");
        text = text.replace(/<\/comment>/g,"</comment>$").replace(/&nbsp;/g," ");
        text = text.split('$'); // replacing unwanted characters and split
        var newText = "";
        for (k in text) {
          if (text[k].search(/^\[.+\]$/) > -1) { // chords '[X]'
            newText += '<chord name="'+text[k].replace(/\[/g,"").replace(/\]/g,"")+'"/>'
          } else if (text[k].search(/<br>/) > -1) { // linebreaks
            newText += '<br/>$'
          } else if (text[k].search(/^\*.+\*$/) > -1) { // comments
            newText += '<comment>' + text[k].replace(/\*/g,"") + '</comment>';
          } else if (text[k]) { // text
            newText += text[k]
          }
        }
        for (m in newText.split('$')) {
          xw.writeString(newText.split('$')[m]);
        }
        xw.writeEndElement();
      }
      xw.writeEndElement();
    }        
    xw.writeEndElement();
    
    xw.writeEndDocument();
    return xw.flush();
  };
  
  WriteXml.create = function(title) {
    var xw = new XMLWriter( 'UTF-8', '1.0' );
    xw.indentChar = ' ';  //indent with spaces
    xw.indentation = 2;   //add 2 spaces per level

    xw.writeStartDocument( );
    xw.writeStartElement('song');
    xw.writeAttributeString('xmlns', 'http://openlyrics.info/namespace/2009/song');
    xw.writeAttributeString('version','0.8');
    xw.writeAttributeString('createdIn', enyo.fetchAppInfo().title+' '+enyo.fetchAppInfo().version);
    xw.writeAttributeString('modifiedIn', enyo.fetchAppInfo().title+' '+enyo.fetchAppInfo().version);
    xw.writeAttributeString('modifiedDate', WriteXml.date());
      
      xw.writeStartElement('properties');
        xw.writeStartElement('titles');
          xw.writeElementString('title', title);
        xw.writeEndElement();
      xw.writeEndElement();
      
      xw.writeStartElement('lyrics');
        xw.writeStartElement('verse');
        xw.writeAttributeString('name','v1');
          xw.writeElementString('lines', '');
        xw.writeEndElement();
      xw.writeEndElement();
        
    xw.writeEndElement();
    xw.writeEndDocument();
    return xw.flush();
  };
