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
  events: {
    "onEdit": ""
  },
  published: {
      path: "",
      data: {},
      order: [],
      textIndex: 0,
      scroll: 0,
      transpose: 0,
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
            {name: "transminus", icon: "images/minus.png", onclick: "transMinus", disabled: true},
            {name: "transposer", kind: "Picker", showing: false,
              className: "enyo-grouped-toolbutton enyo-middle",
              onChange: "transPick", disabled: true},
            {name: "transplus", icon: "images/plus.png", onclick: "transPlus", disabled: true}
        ]},
        {name: "lockButton", kind: "IconButton", toggling: true,
          icon: "images/lock-open.png", onclick: "toggleLock"},
        {name: "fontButton", kind: "IconButton",
          icon: "images/font.png", onclick: "showFontDialog"}
      ]},
      {name: "viewScroller", kind: "enyoextras.ScrollBarsScroller", flex: 1, components: [
          {name: "lyric", components: [{name: "help", kind: "Help"}], 
            ondragfinish: "songDragFinish"}
        ]
      },
      {name: "footerToolbar", kind: "Toolbar", pack : "center" , components: [
        {kind:"GrabButton"},
        {name: "copy", kind: "HtmlContent", className: "copy title", 
          content: "&copy; michote", flex: 1},
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
    this.$.getXml.setUrl(this.path);
    this.$.getXml.call();
  },
  
  gotXml: function(inSender, inResponse) {
    var xml = ParseXml.parse_dom(inResponse)
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
      // John's code
      this.duration = 200;  // seconds for song
      this.intervalSong;
      this.running = false;
      this.lyricsCurrRow = 0;
      // End John's code
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
      };
      
      //~ enyo.log(Transposer.transpose("D", this.transpose));
    } ;
  },
  
  gotXmlFailure: function(inSender, inResponse, inRequest) {
    enyo.log("Parse XML Failure");
    this.owner.showError("reading:" + "</br>" + inRequest.url);
  },
 
  // John's code
  togglePlay: function() {
    if (this.$.playButton.getIcon() == "images/play.png") {
      this.$.playButton.setIcon("images/pause.png");
      this.$.forthButton.setDisabled(true);
      this.$.backButton.setDisabled(true);
      this.textPlay();
    } else {
      this.$.playButton.setIcon("images/play.png");
      this.$.forthButton.setDisabled(false);
      this.$.backButton.setDisabled(false);
    };
  },
  
  showLyrics: function() {
    if (this.running) {
      this.lyricsCurrRow = this.lyricsCurrRow + 1;
      var x = this.$.lyric.$[this.order[0]].hasNode()
      this.$.viewScroller.scrollTo(this.lyricsCurrRow + 74 ,0);
      if (this.lyricsCurrRow > 600) {
        window.clearInterval(this.intervalSong);
        this.running = false;
      }
    }
  },

  textPlay: function() {
    this.running = true;
    this.intervalSong = window.setInterval(this.showLyrics.bind(this), 150)  //  ms per pixel row
  },
  // End John's code
 
  // Back and Forth Button
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
  
  // set Data
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
    this.owner.$.scrim.show();
    this.$.infoDialog.openAtCenter();
    this.$.infoDialog.destroy();
    this.$.infoDialog.infoset(this.data);
    this.$.infoDialog.render();
  },
  
  toggleLock: function() {
    if (this.$.lockButton.getIcon() == "images/lock-open.png") {
      this.$.lockButton.setIcon("images/lock.png");
      enyo.windows.setWindowProperties(enyo.windows.getActiveWindow(), {"blockScreenTimeout" : true});
    } else {
      this.$.lockButton.setIcon("images/lock-open.png");
      enyo.windows.setWindowProperties(enyo.windows.getActiveWindow(), {"blockScreenTimeout" : false});
    };
  },
  
  showFontDialog: function() {
    this.owner.$.scrim.show();
    this.owner.$.fontDialog.openAtCenter()
  },
  
  // Transposer
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

    //~ enyo.log("transpose:", this.transpose);
    this.pathChanged();    
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
