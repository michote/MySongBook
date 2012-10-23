// #################
//
// Copyright (c) 2012 Micha Reischuck
//
// MySongBook is available under the terms of the MIT license. 
// The full text of the MIT license can be found in the LICENSE file included in this package.
//
// #################


enyo.kind({
  name: "SongView",
  kind: enyo.SlidingView,
  layoutKind: enyo.VFlexLayout,
  finished: false,
  defaultSongSecs: 200, // seconds for song
  songSecs: this.defaultSongSecs, 
  intervalSong: 0,
  running: false,
  lyricsCurrRow: 0,
  halfHt: 0,
  rowsTraversed: 0,
  cursorRow: 0,
  textIndex: 0,
  scroll: 0,
  transpose: 0,
  order: [],  
  fullscreen: false,
  events: {
    "onEdit": ""
  },
  published: {
      path: "",
      data: {},
      first: true,
      // Prefs
      sort: false,
      show: "copyright",
      showChords: true,
      showComments: true,
      showHeadline: false,
      testing: false
  },
  components: [
    {kind: "ApplicationEvents", onKeydown: "handleKeyPress"},
    {name: "getXml", kind: "WebService", onSuccess: "gotXml", 
      onFailure: "gotXmlFailure"},
    {name: "bg", layoutKind: enyo.VFlexLayout, flex: 1, className: "bg", 
      components: [ 
      {name: "headerToolbar", kind: "Toolbar", components: [
        {name: "title", kind: "HtmlContent", className: "song title", 
          content: $L("Help"), flex: 1},
        {name: "transposergr", kind: "ToolButtonGroup", components: [
            {name: "transminus", icon: "images/minus.png", onclick: 
              "transMinus", disabled: true},
            {name: "transposer", kind: "Picker", showing: false,
              className: "enyo-grouped-toolbutton enyo-middle",
              onChange: "transPick", disabled: true},
            {name: "transplus", icon: "images/plus.png", onclick: 
              "transPlus", disabled: true}
        ]},
        {name: "lockButton", kind: "IconButton", toggling: true,
          icon: "images/lock-open.png", onclick: "toggleLock"},
        {name: "fontButton", kind: "IconButton",
          icon: "images/font.png", onclick: "showFontDialog"}
      ]},
      {name: "viewIncScrollBar", layoutKind: enyo.HFlexLayout, flex: 1, 
        components: [
        {name: "cursorScrollBar", kind: "cursorScrollBar", onclick: 
          "resetCursorTiming", className: "cursor"},
        {name: "viewScroller", kind: "enyoextras.ScrollBarsScroller", flex: 1,
          components: [
            {name: "lyric", components: [{name: "help", kind: "Help"}], 
              ondragfinish: "songDragFinish", ondblclick: "onDoubleClick"}
          ]},
        ]
      },
      {name: "footerToolbar", kind: "Toolbar", pack : "center" , components: [
        {kind: "HFlexBox", pack: "start", flex: 1, components : [
          {kind:"GrabButton"},
          {name: "copy", kind: "HtmlContent", className: "copy title", 
            content: "&copy; michote", flex: 1},
        ]},
        {name: "backButton", kind: "IconButton", disabled: true,
          icon: "images/back.png", onclick : "textBack", width: "75px"},
        {name: "forthButton", kind: "IconButton", disabled: true, 
          icon: "images/forth.png", onclick : "textForth", width: "75px"},
        {kind: "HFlexBox", pack: "start", flex: 1, components : [
          {name: "playButton", kind: "IconButton", toggling: true, showing: false, // still in Developement
            icon: "images/play.png", onclick: "togglePlay"},
          {kind: "Spacer"},
          {name: "editButton", kind: "IconButton", showing: false, // still in Developement
            icon: "images/edit.png", onclick: "doEdit", disabled: true},
          {name: "infoButton", kind: "IconButton", disabled: true,
            icon: "images/info.png", onclick: "showInfo"}
        ]}
      ]},
    ]},
    {name: "infoDialog", kind: "InfoDialog"}
  ],
  
  create: function() {
    this.inherited(arguments);
    // hide Stuff on Phone
    if (Helper.smScr()) {
      this.$.backButton.hide();
      this.$.forthButton.hide();
      this.$.spacer.hide();
      this.$.transposergr.hide();
      this.$.editButton.hide();
    };
    if (!window.PalmSystem) {
      this.$.lockButton.hide();
    };
  },
  
  // get xml lyricdata
  pathChanged: function() {
    if (this.testing) {
      this.$.editButton.show();
      this.$.playButton.show();
    } else {
      this.$.editButton.hide();
      this.$.playButton.hide();
    }
    this.initCursor();
    this.$.getXml.setUrl(this.path);
    this.$.getXml.call();
  },
  
  gotXml: function(inSender, inResponse) {
    this.xml = ParseXml.parse_dom(inResponse);
    this.renderLyrics(this.xml);
  },
    
  renderLyrics: function(xml) {
    var transposition = ParseXml.get_metadata(xml, "transposition");
    if (transposition && this.first) {
      this.transpose = parseInt(transposition);
      this.first = false;
    } else if (this.first) {
      this.transpose = 0;
      this.first = false;
    } else {
      this.first = false;
    }
    this.data = ParseXml.parse(xml, this.showChords, this.showComments, this.transpose);
    //~ this.myDebug(this.data);
    if (this.data.titles !== undefined) {
      this.metaDataSet();
      this.order = (this.data.verseOrder);
      this.textIndex = 0; // reset index
      this.scroll = 0;    // reset scroller
      this.$.help.hide();
      this.$.lyric.destroyComponents();
      this.lyricDataSet();
      // Buttons
      this.enableTransposer(this.data.key, this.data.haschords, this.transpose);
      this.$.infoButton.setDisabled(false);
      this.$.editButton.setDisabled(false);
      this.$.backButton.setDisabled(true); 
      if (this.data.verseOrder && (this.textIndex === (this.data.verseOrder.length-1))) {
        this.$.forthButton.setDisabled(true);
      } else {
        this.$.forthButton.setDisabled(false);
      }
      //~ enyo.log(Transposer.transpose("D", this.transpose));
    } ;
  },
  
  gotXmlFailure: function(inSender, inResponse, inRequest) {
    enyo.log("Parse XML Failure");
    this.owner.showError("reading:" + "</br>" + inRequest.url);
  },

  // ### Autoscroll ###
  togglePlay: function() { 
    if (this.$.playButton.getIcon() == "images/play.png") { 
      // play
      if (this.lyricsCurrRow !== 0) {
        // paused
        this.running = true;
      } else { 
        // begining to play
        this.initForTextPlay();
        this.running = true;
        var perRowMSecs = 1000*this.songSecs/this.rowsTraversed;
        this.intervalSong = window.setInterval(enyo.bind(this, "showLyrics"), perRowMSecs);
        if (window.PalmSystem) {
          enyo.windows.setWindowProperties(enyo.windows.getActiveWindow(), {'blockScreenTimeout': true});
        };
        //        this.$.cursorScrollBar.setBpmTimer(120);
      };
      this.$.playButton.setIcon("images/pause.png");
      this.$.playButton.setDepressed(false);
      this.$.forthButton.setDisabled(true);
      this.$.backButton.setDisabled(true);
    } else { 
      //pause
      this.$.playButton.setIcon("images/play.png");
      this.$.playButton.setDepressed(false);
      this.running = false;
      if (this.finished) {
        this.initCursor();
      };
    };
  },
  
  movingLyrics: function() {
    if ((this.lyricsCurrRow > this.halfHt) && (this.lyricsCurrRow < (this.rowsTraversed - this.halfHt))) {
      return true;
    } else {
      return false;
    };
  },

  resetCursorTiming: function() {
    // adjust the position of the cursor
    var yAdj = event.offsetY - this.cursorRow;  
    var lyricsPrevRow = this.lyricsCurrRow;  // save for later
    this.lyricsCurrRow = this.lyricsCurrRow + yAdj;
    if (this.lyricsCurrRow < this.halfHt) {
      this.cursorRow = this.lyricsCurrRow;
    } else if (this.lyricsCurrRow > (this.rowsTraversed - this.halfHt)) {
      this.cursorRow = 2 * this.halfHt - (this.rowsTraversed - this.lyricsCurrRow);
      this.$.viewScroller.setScrollTop(this.lyricsCurrRow - this.cursorRow);
    } else {
      this.cursorRow = this.halfHt;
    };
    this.$.cursorScrollBar.setY(this.cursorRow);
    // now adjust the speed of the cursor.
    this.songSecs = this.songSecs * lyricsPrevRow / this.lyricsCurrRow;
    window.clearInterval(this.intervalSong);
    var perRowMSecs = 1000*this.songSecs/this.rowsTraversed;
    this.intervalSong = window.setInterval(enyo.bind(this, "showLyrics"), perRowMSecs);
    if (this.data.titles) { var theTitles = ParseXml.titlesToString(this.data.titles); }
    var minsFull = this.songSecs/60;
    var mins = Math.floor(minsFull);
    var secs = Math.floor((minsFull - mins) * 60);
    var ssecs = (secs < 10 ? "0" : "") + secs; 
    this.$.title.setContent(theTitles + " - " + mins + ":" + ssecs);
  },
  
  showLyrics: function() {
    if (this.running) {
      if (this.movingLyrics()) {
        this.$.viewScroller.setScrollTop(this.lyricsCurrRow - this.cursorRow);
      } else {
        this.cursorRow = this.cursorRow + 1;
        this.$.cursorScrollBar.setY(this.cursorRow);
      };
      this.lyricsCurrRow = this.lyricsCurrRow + 1;
      if (this.lyricsCurrRow > this.rowsTraversed) {
        window.clearInterval(this.intervalSong);
        this.$.cursorScrollBar.cursorOff();
        this.finished = true;
        this.running = false;
      };
    };
  },

  initCursor: function() {
    this.cursorRow = 0;
    this.lyricsCurrRow = 0;
    this.$.viewScroller.setScrollTop(this.lyricsCurrRow);
    this.$.cursorScrollBar.setY(this.cursorRow);    
    this.$.cursorScrollBar.clearCursor();
    window.clearInterval(this.intervalSong);
    this.$.playButton.setIcon("images/play.png");
    this.finished = false;
    this.$.cursorScrollBar.hide();
    this.$.lyric.removeClass("lyricwc");
    if (window.PalmSystem && (this.$.lockButton.getIcon() == "images/lock-open.png")) {
      enyo.windows.setWindowProperties(enyo.windows.getActiveWindow(), {'blockScreenTimeout': false});
    };
    if (this.data.duration) {
      this.songSecs = this.data.duration;
    } else {
      this.songSecs = this.defaultSongSecs;
    };
    if (this.data.titles) { 
      var theTitles = ParseXml.titlesToString(this.data.titles); 
      this.$.title.setContent(theTitles);
    };
  },
  
  initForTextPlay: function() {
    var ctrls = this.$.lyric.getControls();
    this.rowsTraversed = this.$.lyric.node.clientHeight;
    for (i = 0; i < ctrls.length; i++) {
      if (ctrls[i].name == "scrollspacer") {
        this.rowsTraversed = this.rowsTraversed - this.$.lyric.node.lastChild.clientHeight + 20;
      };
    };
    this.halfHt = this.$.viewScroller.node.clientHeight / 2;
    this.$.viewScroller.scrollTo(this.lyricsCurrRow, 0);
    this.$.cursorScrollBar.color = this.$.cursorScrollBar.onColor
    this.$.cursorScrollBar.node.height = this.$.viewScroller.node.clientHeight;
    this.$.lyric.setClassName("lyricwc");
    this.$.cursorScrollBar.show();
  },
 
 
  // ### Scrolling Button/Keypress ###
  scrollHelper: function() {
    var x = this.$.lyric.$[this.order[this.textIndex]].hasNode()
    var ePos = enyo.dom.calcNodeOffset(x).top - 74; // element offset - Toolbar and margin
    this.scroll = this.$.viewScroller.$.scroll.y;   // scroll position
    this.$.viewScroller.scrollTo((ePos - this.scroll),0);
  },
  
  textForth: function() {
    this.textIndex += 1;
    if (this.textIndex === 1) {
      this.$.backButton.setDisabled(false);
    } else if (this.textIndex === (this.data.verseOrder.length-1)) {
      this.$.forthButton.setDisabled(true);
    };
    this.scrollHelper();
  },
  
  textBack: function() {
    this.textIndex -= 1;
    if (this.textIndex === 0) {
      this.$.backButton.setDisabled(true);
    } else if (this.textIndex === (this.data.verseOrder.length-2)) {
      this.$.forthButton.setDisabled(false);
    };
    this.scrollHelper();
  },
  
  handleKeyPress: function(inSender, inEvent) {
    k = inEvent.keyCode
    //~ enyo.log(k);
    if ((k===33 || k===38 || k===37 || k===32) && this.textIndex > 0) { // PageUp
      this.textBack();
    } else if ((k===34 || k===40 || k===39 || k===13)
      && this.textIndex < this.data.verseOrder.length-1) { // PageDown
      this.textForth();
    };
  },
  
  // Swipe left and right
  songDragFinish: function(inSender, event) {
    var o = this.owner
    if (+event.dx > 120) {
      if (o.currentIndex >= 0 && 
        o.currentIndex < o[o.currentList].content.length-1) {
        enyo.log("dragged to the right");
        o.setCurrentIndex(o.currentIndex+1);
      };
    };
    if (+event.dx < -120) {
      if (o.currentIndex > 0) {
        enyo.log("dragged to the left");
        o.setCurrentIndex(o.currentIndex-1);
      };
    };
  },
  
  // Maximize view on doubleclick
  onDoubleClick: function() {
    this.fullscreen = !this.fullscreen;
    if (this.fullscreen === true) {
      this.$.headerToolbar.hide(); 
      this.$.footerToolbar.hide();
      this.owner.$.songSlidingPane.selectViewByName('songViewPane'); 
    } else {
      this.$.headerToolbar.show(); 
      this.$.footerToolbar.show();
      this.owner.$.songSlidingPane.selectViewByName('songListPane'); 
    };
    if (window.PalmSystem) {
      enyo.setFullScreen(this.fullscreen);
    }
  }, 
  
  
  // ### set Data ###
  metaDataSet: function() {
    var d = this.data
    //~ format and set title
    if (d.titles) {
      var t = ParseXml.titlesToString(d.titles);
      this.$.title.setContent(t);
    };
    
    //~ format and set copyright
    if (d.released) { // add release year
      var y = d.released + ": ";
    } else {
      var y = ""
    }
    if (d[this.show]) {
      if (this.show === "authors") {
        this.$.copy.setContent(y + ParseXml.authorsToString(d.authors).join(", "));
      } else {
        this.$.copy.setContent("&copy; " + y + d[this.show]);
      };
    } else {
      this.$.copy.setContent("&copy; " + y + $L("no" + this.show));
    };
  },
  
  lyricDataSet: function() {
    var d = this.data
    //~ format and set lyrics
    if (d.lyrics) {
      var lyrics = "";
      if (d.lyrics === "nolyrics") {
        lyrics = $L(d.lyrics); 
      } else if (d.lyrics === "wrongversion") {
        lyrics = $L(d.lyrics);
      } else { 
        var formL = {};
        if (this.sort) { //~ display lyrics like verseOrder
          formL = Helper.orderLyrics(d.lyrics, this.order);
          this.order = Helper.handleDoubles(this.order);
        } else { //~ disply lyrics without verseOrder
          formL = d.lyrics
        };
        for (var i in formL) {
          if (this.showHeadline) {
            var t = "<h1>" + $L(formL[i][0].charAt(0)) + " " 
              + formL[i][0].substring(1, formL[i][0].length) + "</h1>";
          } else {
            var t = "<div class='element'>" + $L(formL[i][0].charAt(0)).charAt(0)
              + formL[i][0].substring(1, formL[i][0].length) + ":</div>";
          };
          this.$.lyric.createComponent({
            name: i,
            kind: "HtmlContent",
            className: "lyric",
            content: t + formL[i][1]
          });
        };
      };
      this.$.lyric.render();
      var x = this.$.lyric.node.lastChild.clientHeight;
      var h = window.innerHeight-138-x;
      if (h > 0) {
        this.$.lyric.createComponent({
          name: "scrollspacer",
          style: "height:" + h + "px;width:100%;",
        });
      };
    };
    this.$.lyric.render();
  },
  
  // ### Button ###
  showHelp: function() { 
    this.$.lyric.destroyComponents();
    this.owner.setCurrentIndex(undefined);
    this.$.title.setContent($L("Help"));
    this.$.copy.setContent("&copy; michote");
    this.$.infoButton.setDisabled(true);
    this.$.editButton.setDisabled(true);
    this.$.backButton.setDisabled(true);
    this.$.forthButton.setDisabled(true);
    this.$.help.show();
  },
  
  showInfo: function() {
    this.$.infoDialog.openAtCenter();
    this.$.infoDialog.destroy();
    this.$.infoDialog.infoset(this.data);
    this.$.infoDialog.render();
  },
  
  toggleLock: function() {
    if (this.$.lockButton.getIcon() == "images/lock-open.png") {
      this.$.lockButton.setIcon("images/lock.png");
      if (window.PalmSystem) {
        enyo.windows.setWindowProperties(enyo.windows.getActiveWindow(), {"blockScreenTimeout" : true});
      }
    } else {
      this.$.lockButton.setIcon("images/lock-open.png");
      if (window.PalmSystem) {
        enyo.windows.setWindowProperties(enyo.windows.getActiveWindow(), {"blockScreenTimeout" : false});
      }
    };
  },
  
  showFontDialog: function() {
    this.owner.$.fontDialog.openAtCenter()
  },
  
  // ### Transposer ###
  enableTransposer: function(key, chords, transp) {
    if (key && chords) {
      this.$.transposer.show();
      this.$.transminus.setDisabled(false);
      this.$.transplus.setDisabled(false);
      var dur = ["Ab", "A", "Bb", "B", "C", "C#", "Db", "D", "D#", "Eb", "E", 
        "F", "F#", "Gb", "G", "G#"];
      var moll = ["Abm", "Am", "Bbm", "Bm", "Cm", "C#m", "Dbm", "Dm", "D#m", 
        "Ebm", "Em", "Fm", "F#m", "Gbm", "Gm", "G#m"];
      if (key.charAt(key.length-1) === "m") {
        this.$.transposer.setItems(moll);
      } else {
        this.$.transposer.setItems(dur);
      };
      if (transp) {
        this.$.transposer.setValue(Transposer.transpose(key, transp));
      } else {
        this.$.transposer.setValue(key);
      };
      this.$.transposer.setDisabled(false);
    } else if (!key && chords) {
      this.$.transminus.setDisabled(false);
      this.$.transplus.setDisabled(false);
      this.$.transposer.setDisabled(true);
      this.$.transposer.hide();
    } else {
      this.$.transminus.setDisabled(true);
      this.$.transposer.setDisabled(true);
      this.$.transplus.setDisabled(true);
      this.$.transposer.hide();
    };
  },
  
  setTrans: function(value) {
    if (value > 11) {
      value -= 12;
    } else if (value < -11) {
      value += 12;
    };
    this.transpose = value;
    this.renderLyrics(this.xml);    
  },
  
  transPlus: function() {
    this.setTrans(this.transpose += 1);
  },
  
  transMinus: function() {
    this.setTrans(this.transpose -= 1);
  },
  
  transPick: function() {
    this.setTrans(Transposer.getDelta(this.data.key, this.$.transposer.getValue()));
  },
  
  // Debugging
  myDebug: function (data) {
    // Ausgabe:
    enyo.log(data.titles);
    enyo.log(data.authors);
    enyo.log(data.copyright);
    //~ enyo.log(data.lyrics);
  }
});
