// #################
//
// Copyright (c) 2012 John Carragher
//
// function convLyrics() generates OpenLyrics XML formated song files from a text block which is formated
// according to some fairly casual rules and is released under the terms of the MIT license detailed
// in the accompanying LICENSE file. 
//
// ################

  var lyricLines = new Array();
  var destLyrics = "";
  var lyricsStartLine = 0;
  var ChordPro = false;
  var chordProLyrics = false;
  var verseName;
  var verseNum;
  var verse;
  var chorus;
  var prechorus;
  var bridge;
  var ending;
  var chIdx;
  var chName;
  var insIdx;
  var lang;
  var openLyricsChords = "Ab Ab+ Ab4 Ab7 Ab11 Absus Absus4 Abdim Abmaj Abmaj7 Abm Abm7 A A+ A4 A6 A7 A7+ A9 A11 A13 A7sus4 A9sus Asus Asus2 Asus4 Adim Amaj Amaj7 Am A/D A/F# A/G# Am#7 Am6 Am7 Am7sus4 Am9 Am/G Amadd9 Am(add9) A# A#+ A#4 A#7 A#sus A#sus4 A#maj A#maj7 A#dim A#m A#m7 Bb Bb+ Bb4 Bb6 Bb7 Bb9 Bb11 Bbsus Bbsus4 Bbmaj Bbmaj7 Bbdim Bbm Bbm7 Bbm9 B B+ B4 B7 B7+ B7#9 B7(#9) B9 B11 B13 Bsus Bsus4 Bmaj Bmaj7 Bdim Bm B/F# BaddE B(addE) BaddE/F# Bm6 Bm7 Bmmaj7 Bm(maj7) Bmsus9 Bm(sus9) Bm7b5 C C+ C4 C6 C7 C9 C9(11) C11 Csus Csus2 Csus4 Csus9 Cmaj Cmaj7 Cm Cdim C/B Cadd2/B CaddD C(addD) Cadd9 C(add9) Cm7 Cm11 C# C#+ C#4 C#7 C#7(b5) C#sus C#sus4 C#maj C#maj7 C#dim C#m C#add9 C#(add9) C#m7 Db Db+ Db7 Dbsus Dbsus4 Dbmaj Dbmaj7 Dbdim Dbm Dbm7 D D+ D4 D6 D7 D7#9 D7(#9) D9 D11 Dsus Dsus2 Dsus4 D7sus2 D7sus4 Dmaj Dmaj7 Ddim Dm D/A D/B D/C D/C# D/E D/G D5/E Dadd9 D(add9) D9add6 D9(add6) Dm7 Dm#5 Dm(#5) Dm#7 Dm(#7) Dm/A Dm/B Dm/C Dm/C# Dm9 D# D#+ D#4 D#7 D#sus D#sus4 D#maj D#maj7 D#dim D#m D#m7 Eb Eb+ Eb4 Eb7 Ebsus Ebsus4 Ebmaj Ebmaj7 Ebdim Ebadd9 Eb(add9) Ebm Ebm7 E E+ E5 E6 E7 E7#9 E7(#9) E7b9 E7(b9) E7(11) E9 E11 Esus Esus4 Emaj Emaj7 Edim Em Em6 Em7 Em/B Em/D Em7/D Emsus4 Em(sus4) Emadd9 Em(add9) F F+ F4 F6 F7 F9 F11 Fsus Fsus4 Fmaj Fmaj7 Fdim Fm F/A F/C F/D F/G F7/A Fmaj7/A Fmaj7/C Fmaj7(#5) Fadd9 F(add9) FaddG FaddG Fm6 Fm7 Fmmaj7 F# F#+ F#7 F#9 F#11 F#sus F#sus4 F#maj F#maj7 F#dim F#m F#/E F#4 F#m6 F#m7 Gb Gb+ Gb7 Gb9 Gbsus Gbsus4 Gbmaj Gbmaj7 Gbdim Gbm Gbm7 G G+ G4 G6 G7 G7+ G7b9 G7(b9) G7#9 G7(#9) G9 G9(11) G11 Gsus Gsus4 G6sus4 G6(sus4) G7sus4 G7(sus4) Gmaj Gmaj7 Gmaj7sus4 Gmaj9 Gm Gdim Gadd9 G(add9) G/A G/B G/D G/F# Gm6 Gm7 Gm/Bb G# G#+ G#4 G#7 G#sus G#sus4 G#maj G#maj7 G#dim G#m G#m6 G#m7 G#m9maj7 G#m9(maj7)";

  //  
  function convLyrics (srceLyrics) {
    var fullSong = false;
    var lyrics = [];
    destLyrics = "";
    verseName = "v";
    verseNum = 1;
    verse = 1;
    chorus = 1;
    prechorus = 1;
    bridge = 1;
    ending = 1;
    lang = "";
    lyricLines = srceLyrics.split(/\r?\n|\r/);
    for (i=lyricsStartLine; i<lyricLines.length; i++) {
      lyricLines[i] = lyricLines[i].replace(/\s+$/, '');  // strip trailing spaces from all lines
    }
    if (lyricLines[1] == "" || lyricLines[0][0] == "{") {  // first line is title
      fullSong = true;
      doProperties(srceLyrics);
    }
    var chordsFound = false;
    var opensong = false;

    destLyrics = destLyrics + "  <lyrics>\n";
    while (lyricLines[lyricLines.length-1] === "") {
      lyricLines.pop();																		// remove blank lines at end
    }
    // lyrics lines loop
    for (i=lyricsStartLine; i<lyricLines.length; i++) {
      if (!isVerseLine(lyricLines[i])) {  // blank or [x
        lang = langInLine(lyricLines[i]);
        if (lyricLines[i] === "") {
          verseNum = verse;
          verseName = "v";
        } else {
          if (lyricLines[i].length > 1) {
            switch (lyricLines[i][1]) {
              case "v": case "V":
                verseNum = verse;
                verseName = "v";
                break;
              case "c": case "C":
                verseNum = chorus;
                verseName = "c";
                break;
              case "b": case "B":
                verseNum = bridge;
                verseName = "b";
                break;
              case "e": case "E":
                verseNum = ending;
                verseName = "e";
                break;
              case "p":  case "P":
                verseNum = prechorus;
                verseName = "p";
                break;
              default:
                lang = "";
            }
          }
        }
        if (i !== lyricsStartLine){  // if NOT first lyrics line close verse
          destLyrics = destLyrics + "      <\/lines>\n    <\/verse>\n";
        }
        openVerse(lang);
      } else { //is verseline
        if (i == lyricsStartLine) {
          openVerse("");
        }
        if (!chordsFound) {
          chordsFound = checkChordsFound(lyricLines[i]);
          if ((lyricLines[i][0] == ".") && chordsFound) {
            lyricLines[i] = lyricLines[i].substring(1, lyricLines[i].length-1);
            opensong = true;
          }
        } else { // embed chords from last line in this line
          chIdx = 0;
          chName = "";
          insIdx = 0;
          while (chIdx < lyricLines[i-1].length) {
            if (lyricLines[i-1][chIdx] != " ") { // found chord
              chName = "";
              while ((lyricLines[i-1][chIdx] != " ") && (chIdx < lyricLines[i-1].length)) {
                chName = chName + lyricLines[i-1][chIdx];
                chIdx++
              }
              var t1 = lyricLines[i].substring(0, insIdx);   
              var t2 = lyricLines[i].substring(insIdx, lyricLines[i].length);
              var chStr = "<chord name=\"" + chName + "\"\/>";
              lyricLines[i] = t1 + chStr + t2;
              insIdx = insIdx + chStr.length + chName.length;
            }
            chIdx++;
            insIdx++
          }
        chordsFound = false;
        opensong = false;
        }
        // add lyrics line
        if (!chordsFound) {
          lyricLines[i] = expandChordPro(lyricLines[i]);  // expand any ChordPro  [chord] strings
          destLyrics = destLyrics + "        " + lyricLines[i];
          if ((i == lyricLines.length - 1) || (lyricLines[i+1] == "") || !isVerseLine(lyricLines[i+1])) { 
            // last line, next line blank or next line inter-verse line 
            destLyrics = destLyrics + "\n";
          } else {
            destLyrics = destLyrics + "<br\/>\n";
          }
        }
      }
    }
    destLyrics = destLyrics + "      <\/lines>\n    <\/verse>\n  <\/lyrics>\n";
    if (fullSong) {
      destLyrics = destLyrics + "<\/song>";
    }
    return destLyrics;
  }

  function langInLine (theLine) {
    var langIdx = theLine.indexOf("lang=");
    var lang = "";
    if (langIdx !== -1) {
      langIdx = langIdx + 5;
      while (langIdx < theLine.length && theLine[langIdx] !== " ") {
        lang = lang + theLine[langIdx];
        langIdx++
      }
    }
  return lang;
  }
  
  function abbrevDirectives() {
    for (i=0; i<lyricLines.length; i++) {
      if (lyricLines[i][0] === "{") {
        var endFound = lyricLines[i].indexOf("}");
        if (endFound != -1) {
          lyricLines[i] = lyricLines[i].slice(0,endFound+1);
          while (lyricLines[i][endFound-1] === " ") {
            lyricLines[i] = lyricLines[i].slice(endFound-1,endFound-1);
            endFound--; 
          }
          ChordPro = true;
          var colonPos = lyricLines[i].indexOf(":");
          if (colonPos == -1) {
            var spacePos = lyricLines[i].indexOf(" ");
            if (spacePos !== -1) {
              lyricLines[i] = lyricLines[i].replace(" ", ": ");
            } else {
              lyricLines[i] = lyricLines[i].replace("}", ":}");
            }
          colonPos = lyricLines[i].indexOf(":");
          }
          var currDir = lyricLines[i].slice(1, colonPos);
          var newDir = currDir;
          
          switch (currDir) {
            case "title" :
              newDir = "t";
              break;
            case "subtitle" :
              newDir = "t";
              break;
            case "comment" :
              newDir = "c";
              break;
            case "start_of_chorus" :
              newDir = "soc";
              break;
            case "start_of_bridge" :
              newDir = "sob";
              break;
            case "end_of_bridge" :
              newDir = "eob";
              break;
            case "start_of_tab" :
              newDir = "sot";
              break;
            case "end_of_tab" :
              newDir = "eot";
              break;
            default:
          }
        lyricLines[i] = lyricLines[i].replace(currDir, newDir);  
        }
      }
    }
  }

  function removePrevLine (i) {  // not 2nd line
    if (i>2 && chordProLyrics) {  
      if (lyricLines[i-1] === "") {
        lyricLines.splice(i-1,1);
        i--;
      }
    }
  }

  function convChordPro () {
    // directive line start and end with {}.  Everything else is music = lyrics with [chords]
    abbrevDirectives();
    chordProLyrics = false;
    var i = 0;
    while (i<lyricLines.length) {
      var colonPos = lyricLines[i].indexOf(":");
      if (colonPos !== -1) {
        var cmd = lyricLines[i].slice(0, lyricLines[i].indexOf(":")+1);
        if (lyricLines[i][0]==="{")  {   //  {xx..x:
          switch (cmd) {
            case "{t:" :
              if (i === 0) {
                lyricLines[i] = lyricLines[i].replace(cmd, ""); // first line assumed to be title
              } else {
                lyricLines[i] = lyricLines[i].replace(cmd, "title ");
              }
              lyricLines[i] = lyricLines[i].replace("}", "");
              if (lyricLines[i+1] === "") {
                lyricLines.splice(i+1,0,"");
              }
            break;
            case "{c:" :
              lyricLines[i] = lyricLines[i].replace(cmd, "comment ");
              lyricLines[i] = lyricLines[i].replace("}", "");
            break;
            case "{sob:" :
              lyricLines[i] = lyricLines[i].replace(cmd, "[b]");
              lyricLines[i].replace("}", "");
              removePrevLine(i);
              chordProLyrics = true;
              break;
            case "{soc:" :
              lyricLines[i] = lyricLines[i].replace(cmd, "[c]");
              lyricLines[i].replace("}", "");
              removePrevLine(i);
              chordProLyrics = true;
              break;
            case "{sot:" :   
              lyricLines[i] = lyricLines[i].replace(cmd, "[v]");
              lyricLines[i] = lyricLines[i].replace("}", "");
              removePrevLine(i);
              chordProLyrics = true;
              break;
            default:  
              lyricLines[i] = "";
          }
        }
      }
      i++;
    }
  }

  function doProperties() {
    convChordPro();
    lyricsStartLine = 0;
    var i = 0;
    while (i<lyricLines.length-1 ) {
      if (lyricLines[i] == "" && lyricLines[i+1] == "") {
        lyricLines.splice(i,1);
      }
      i++;
    }
    destLyrics = destLyrics + "<song xmlns=\"http:\/\/openlyrics.info\/namespace\/2009\/song\"\n";
    destLyrics = destLyrics + "  version=\"0.8\"\n";
    destLyrics = destLyrics + "  createdIn=\""+ enyo.fetchAppInfo().title+' '+enyo.fetchAppInfo().version +"\"\n";
    destLyrics = destLyrics + "  modifiedIn=\"\"\n"
    destLyrics = destLyrics + "  modifiedDate=\"";
    var currentdate = new Date();
    destLyrics = destLyrics + currentdate.toISOString() + "\">\n";  
    destLyrics = destLyrics + "  <properties>\n";
    var propName = "";
    var propParam = "";
    while (lyricLines[lyricsStartLine+1] == "") {  //line then space == property
      if (lyricsStartLine ==0) {  // is special case, parameter name implied
        propName = "title"
        propParam = lyricLines[lyricsStartLine];
      }
      else {
        propName = lyricLines[lyricsStartLine].slice(0,lyricLines[lyricsStartLine].indexOf(" "));
        propParam = lyricLines[lyricsStartLine].slice(lyricLines[lyricsStartLine].indexOf(" ")+1,lyricLines[lyricsStartLine].length);
      }
      switch (propName) {
          case "author": case "title" : case "theme" :
            lang = langInLine(lyricLines[lyricsStartLine]);
            if (lang !== "") {
              propParam = propParam.replace(" lang=" + lang,"");
            }
            var firstOfMulti = false;
            if (destLyrics.indexOf("<\/" + propName + ">") == -1) {
              firstOfMulti = true;
              destLyrics = destLyrics + "    <" + propName + "s>\n";
            }
            if (firstOfMulti) {
              destLyrics = destLyrics + "      <" + propName; 
              if (lang !== "") {
                destLyrics = destLyrics + " lang=\"" + lang + "\"";
              }
              destLyrics = destLyrics + ">" + propParam + "<\/" + propName + ">\n"; 
            }
            else {
              var s1 = "    <\/" + propName + "s>";
              var s3 = "      <" + propName;
              if (lang !== "") {
                s3 = s3 + " lang=\"" + lang + "\"";
              }
              s3 = s3 + ">" + propParam + "<\/" + propName + ">\n    <\/" + propName + "s>\n";
              var x=destLyrics.indexOf(s1);
              var s2 = destLyrics.substring(0, x);
              var s4 = destLyrics.substring(x + s1.length + 1, destLyrics.length);
              destLyrics = s2 + s3 + s4;
            }
            if (firstOfMulti) {
              destLyrics = destLyrics + "    <\/" + propName + "s>\n";
              firstOfMulti = false;
            }
            break;
        case "tempo":
          var validChars = "0123456789.";
          var isNumber=true;
          var ch;
          for (i = 0; i < propParam.length && isNumber == true; i++) { 
              ch = propParam.charAt(i); 
              if (validChars.indexOf(ch) == -1) {
                isNumber = false;
              }
            }
          var typ = "";
          if (isNumber) {
            typ = "bpm"
          }
          else {
            typ = "text"
          }
          destLyrics = destLyrics + "    <tempo type=\"" + typ + "\">" + propParam + "<\/tempo>\n"; 
          break;
        default:
          destLyrics = destLyrics + "    <" + propName + ">" + propParam + "<\/" + propName + ">\n"; 
      }
      lyricsStartLine = lyricsStartLine + 2;
    }
    destLyrics = destLyrics + "  <\/properties>\n";
  }

  function isOpenLyricsChord (theCh) {
    return openLyricsChords.indexOf(theCh) != -1;
  }

  function checkChordsFound (theStr) {
    if (theStr == "") {
      return false;
    } else {
      var thisLine = theStr;
      thisLine = thisLine.replace(/  +/g, " ");   // replace all "  " with " "
      thisLine = thisLine.replace(/^\s+|\s+$/g, '');  // replace leading and trailing " "
      var words = thisLine.split(" ");
      var chordCount = 0;
      for (j=0; j<words.length; j++) {
        if (isOpenLyricsChord(words[j])) {
          chordCount++;
          } else {  // slash chords are valid
          if (words[j].indexOf("/") != -1) {
            var chordNotes = words[j].split("/");
            if (chordNotes.length == 2) {
              if ((isOpenLyricsChord(chordNotes[0]) != -1) && (isOpenLyricsChord(chordNotes[1]))) {
                chordCount++;
              }
            }
          }
        }
      }
    return ((chordCount/words.length) >= 0.5); //  50% valid chords, is chord line
    }	
  }

  function isVerseLine ( theLine ) {
    // longer than 5 chars and no "lang=", or contains chords
    return ((theLine.length > 5 && theLine.indexOf("lang=") === -1) || checkChordsFound(theLine));
  }

  function openVerse (theLang) {
    destLyrics = destLyrics + "    <verse name=\"" + verseName + verseNum + "\"";
    if (theLang !== "") {
      destLyrics = destLyrics + "  lang=\"" + theLang + "\"";
    }
    destLyrics = destLyrics + ">\n      <lines>\n";
    switch (verseName) {
      case "v":
        verse++;
        break;
      case "c":
        chorus++;
        break; 
      case "b":
        bridge++;
        break;
      case "e":
        ending++;
        break;
      case "p":
        prechorus++;
        break;
      default:
    }
  }

  function expandChordPro (srceLine) {
    var destLine = "";
    var i = 0;
    while (i<srceLine.length) {
      if (srceLine[i] === "[") {
        i++;
        destLine = destLine + '<chord name="'; 
        while (srceLine[i] !== "]" && i<srceLine.length) {
          destLine = destLine + srceLine[i];
          i++;
        }
        destLine = destLine + '"/>'; 
      }  else {
        destLine = destLine + srceLine[i];
      }
      i++
    }
  return destLine;
  }

