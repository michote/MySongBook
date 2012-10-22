// #################
//
// Copyright (c) 2012 Micha Reischuck
//
// MySongBook is available under the terms of the MIT license. 
// The full text of the MIT license can be found in the LICENSE file included in this package.
//
// #################


enyo.kind({
  name: "MySongBook",
  kind: enyo.VFlexBox,
  pathCount: {"a": [], "b": []},
  errorList: [],
  dirPath: "/media/internal/MySongBook/",
  newSong: false,
  published: {
    libraryList: {"content": []},
    savedLists: [],
    customList: undefined,
    searchList: {"content": []},
    css: {},
    currentList: "libraryList",
    currentIndex: undefined
  },
  components: [
    // Services
    {kind: "ApplicationEvents", onBack: "goBack"},
    {name: "getPreferencesCall", kind: "PalmService", 
      service: "palm://com.palm.systemservice/", method: "getPreferences",
      onSuccess: "getPreferencesSuccess", onFailure: "getPreferencesFailure"},
    {name: "setPreferencesCall", kind: "PalmService",
      service: "palm://com.palm.systemservice/", method: "setPreferences",
      onSuccess: "setPreferencesSuccess", onFailure: "setPreferencesFailure"},
    {name: "AppManService", kind: "PalmService", service: "palm://com.palm.applicationManager/", 
      method: "open"},
    {name: "readDir", kind: "PalmService", service: "palm://com.michote.mysongbook.service/",
      method: "readdir", onSuccess: "readDirSuccess", onFailure: "readDirFail"},
    {name: "writeFile", kind: "PalmService", service: "palm://com.michote.mysongbook.service/",
      method: "writefile", onSuccess: "writeFileSuccess", onFailure: "writeFileFail"},
    {name: "getTitle", kind: "WebService", onSuccess: "gotTitle", 
      onFailure: "gotTitleFailure"},
    // Layout
    {name: "songSlidingPane", kind: "SlidingPane", flex: 1, multiViewMinWidth: 500, 
      onSelect: "paneSelected", components: [
        {name: "songListPane", width: "250px", kind: "SongList", 
          onListTap: "setIndex", onAddList: "addToList",
          onShowPrefs: "openAppMenuHandler", onRmList: "removeFromList",
          onSearchList: "searchSwipe"},
        {name: "songViewPane", flex: 1, kind: "SongView", dragAnywhere: false, 
          onBack: "goBack", onEdit: "editSong", onLinkClick: "linkClicked"}
    ]},
    
    // Dialogs
    {kind: "AboutDialog", onCancel: "closeClicked"},
    {name: "readFilesDialog", kind: enyo.ModalDialog, layoutKind: "VFlexLayout",
      caption: $L("Reading Files"), components :[
        {name: "fileProgress", kind: "ProgressBar"}
    ]},
    {name: "errorDialog", kind: enyo.ModalDialog, layoutKind: "VFlexLayout",
      caption: $L("Error!"), scrim: true, components :[
        {name: "errorContent", kind: "HtmlContent", style:"margin: 10px 0;",
          content:""},
        {kind: "Button", caption: $L("Close"), onclick: "closeClicked"}
    ]},
    {name: "firstUseDialog", kind: enyo.ModalDialog, layoutKind: "VFlexLayout",
      caption: $L("First Use"), scrim: true, components :[
        {name: "content", kind: "HtmlContent", style:"margin: 10px 0;",
          content: $L("No songfiles found!") + $L(" Please add ") +
          "<img src='images/openlyrics.png' style='display:inline;margin:-5px 0;'>"
          + "<a href='http://openlyrics.info/'> OpenLyrics</a>" +
          $L(" files to:") + "</br>/media/internal/MySongBook</br>"
          + $L("An Example Package can be found here: ") + 
          "<img src='images/openlyrics.png' style='display:inline;margin:-5px 0;'>"
          + " " + "<a href='http://openlyrics.info/'>openlyrics.info</a>" +
          $L("unzip it and copy .xml files in /songs to /media/internal/MySongBook"),
          onLinkClick: "linkClicked"},
        {kind: "Button", caption: $L("Close"), onclick: "closeClicked"}
    ]},
    {name: "listDialog", kind: "ListDialog", onSelect: "selectCustomList",
      onListRm: "rmCustomList"},
    {kind: "FontDialog"},
    {name: "preferences", kind: "Preferences", onReceive: "preferencesReceived",
      onSave: "preferencesSaved", onBack: "goBack"},
    {name: "newSongDialog", kind: enyo.ModalDialog, layoutKind: "VFlexLayout",
      caption: $L("New song"), scrim: true, components: [
        {name: "songErrorContent", kind: "HtmlContent", 
          style: "color: #9E0508; margin: 0 10px", content: ""},
        {kind: "RowGroup", caption: $L("Song name"), components: [
          {name: "songName", kind: "Input", hint: $L("Enter songname"), flex: 1,
            onkeypress: "handleKeyPress"}
        ]},
        {kind: "HFlexBox", pack: "center", components : [
          {kind: "Button", className: "enyo-button-negative", flex: 1, 
            caption: $L("Cancel"), onclick: "closeClicked"},
          {kind: "Button", className: "enyo-button-affirmative", flex: 1, 
            caption: $L("Save"), onclick: "createSong"}
        ]}
      ]
    },
    {name: "editToaster", kind: "Edit"},
    // Menu 
    {name: "appMenu", kind: "AppMenu", components: [
      {caption: $L("Preferences"), onclick: "showPreferences"},
      {name: "createNewSong", caption: $L("Create new song"), onclick: "openCreateSong", showing: false},
      {caption: $L("About"), onclick: "showAbout"},
      {caption: $L("Help"), onclick: "showHelp"}
    ]}
  ],

  create: function() {
    this.inherited(arguments);
    this.$.readDir.call({"path": this.dirPath});
    this.$.getPreferencesCall.call(
    {
      "keys": [
        "sortLyric", 
        "showinToolbar",
        "savedLists",
        "customList",
        "css",
        "showChords",
        "showComments",
        "showHeadline",
        "testing"
        ]
    });
  },
  
  readDirCall: function() {
    this.libraryList.content = [];
    this.$.readDir.call({"path": this.dirPath});
    this.$.readFilesDialog.openAtCenter();
    this.$.fileProgress.setMaximum(4);
    this.$.fileProgress.setPosition(1);
  },
  
  rendered: function() {
    this.inherited(arguments);
    this.$.readFilesDialog.openAtCenter();
    this.$.fileProgress.setMaximum(4);
    this.$.fileProgress.setPosition(1);
  },
  
  // Read Directory
  readDirSuccess: function(inSender, inResponse) {
    if (inResponse.files.length === 0) {
      this.$.firstUseDialog.openAtCenter();
      this.$.readFilesDialog.close();
    } else {
      this.$.fileProgress.setMaximum(inResponse.files.length+1);
      this.$.fileProgress.setPosition(1);
      for (i = 0; i < inResponse.files.length; i++) {
        this.pathCount.a.push(i); 
        this.$.fileProgress.setPosition(i+2);
        this.fetchTitles(inResponse.path + inResponse.files[i]);
      };
    };
  },
  
  readDirFail: function(inSender, inResponse) {
    enyo.error("read Dir Failure");
    this.showError($L("reading:") + "<br> " + "/media/internal/MySongBook"); 
  },
  
  // get Title from XML
  fetchTitles: function(path) {
    this.$.getTitle.setUrl(path);
    this.$.getTitle.call();
  },
  
  gotTitle: function(inSender, inResponse, inRequest) {
    var xml = ParseXml.parse_dom(inResponse)
    var a = {"path": inRequest.url, "title": ParseXml.get_titles(xml)[0].title};
    this.libraryList.content.push(a);
    
    // only refresh and sort once
    this.pathCount.b.push(1);
    if (this.pathCount.b.length === this.pathCount.a.length) {
      this.sortAndRefresh();
      if (this.newSong) { // Open new created song 
        this.$.songListPane.toggleLibrary();
        this.$.songListPane.$.listToggle.setValue(0);
        for (i in this.libraryList.content) {
          if (this.libraryList.content[i].path === this.newSong.path) {
            this.setCurrentIndex(i);
          };
        };
        this.newSong = false;
        this.$.songListPane.$.libraryList.updateRow();
        this.editSong();
      };
    };
  },
  
  gotTitleFailure: function(inSender, inResponse, inRequest) {
    enyo.error("Parse Title Failure");
    this.errorList.push(inRequest.url.replace(this.dirPath,""));
    this.pathCount.b.push(1);
    if (this.pathCount.b.length === this.pathCount.a.length) {
      this.sortAndRefresh();
      this.showError($L("reading:") + "<br>" + this.errorList.join(" <br>"));
    };
  },
   
  // Sort Library alphabetically
  sortByTitle: function (a,b) {
    if (a.title < b.title) {
      return -1;
    };
    if (a.title > b.title) {
      return 1;
    };
    return 0;
  },
  
  sortAndRefresh: function() {
    this.libraryList.content.sort(this.sortByTitle);
    this.$.songListPane.$.title.setContent($L("Song List") + " (" + 
      this.libraryList.content.length + ")");
    this.$.songListPane.$.libraryList.refresh();
    this.$.readFilesDialog.close();
    if (this.currentIndex >= 0) {
      this.openSong(this.currentIndex);
    };
  },
  
  // List Tab  
  setIndex: function(inSender, inEvent) {
    this.setCurrentIndex(inEvent.rowIndex);
    //~ enyo.log("index changed");
  },
  
  openSong: function(index) {
    this.$.songViewPane.setPath(this[this.currentList].content[index].path);
    this.$.songViewPane.setFirst(true);
    this.$.songListPane.$[this.currentList].refresh(); // mark selcted row
    this.$.songViewPane.$.viewScroller.scrollIntoView(0, 0);
    !Helper.smScr() || this.$.songSlidingPane.selectViewByName('songViewPane');
  },
  
  currentIndexChanged: function () {
    if (this.currentIndex >= 0) {
      this.openSong(this.currentIndex);
    } else {
      this.$.songListPane.$[this.currentList].refresh();
    };
  },
  
  // Adjust Font
  setFont: function (css) {
    if (css) {
      this.$.songViewPane.$.lyric.applyStyle("font-size", css.size);
      this.$.songViewPane.$.lyric.applyStyle("line-height", css.space);
    };
  },
  
  // ### Custom Lists ###
  searchSwipe: function(inSender, inEvent) {
    var base = this.$.songListPane.oldList;
    if (base === "libraryList") {
      if (this.customList) {
        this.customList.content.push(this.searchList.content[inEvent]);
        this.addLists();
      } else {
        this.$.songListPane.noList();
      };
    } else {
      for (t in this.customList.content) {
        if (this.customList.content[t].path === this.searchList.content[inEvent].path) {
          this.customList.content.splice(t, 1);
          this.searchList.content.splice(inEvent, 1);
          this.addLists();
          this.$.songListPane.$.searchList.refresh();
        };
      };
    };
  },
  
  addLists: function() {
    if (this.customList.content.length > 0) {
      for (i in this.savedLists) {
        if (this.savedLists[i].title === this.customList.title) {
          this.savedLists[i] = this.customList
        };
      };
    };
    this.saveLists(this.savedLists, this.customList);
  },
  
  addToList: function(inSender, inEvent) {
    if (this.customList) {
      this.customList.content.push(this.libraryList.content[inEvent]);
      this.addLists();
    } else {
      this.$.songListPane.noList();
    };
  },
  
  removeFromList: function(inSender, inEvent) {
    this.customList.content.splice(inEvent, 1);
    this.$.songListPane.$.customList.refresh();
    this.addLists();
  },
  
  // Select and Remove Lists
  selectCustomList: function(inSender, inEvent) {
    this.customList = this.savedLists[inEvent.rowIndex];
    this.$.listDialog.close();
    this.$.songListPane.$.listToggle.setValue(1);
    this.$.songListPane.toggleList();
  },
  
  rmCustomList: function(inSender, inEvent) {
    if (this.customList && this.savedLists[inEvent].title === this.customList.title) {
      this.customList = undefined; // no List selcted
      this.$.songListPane.$.listToggle.setValue(0);
      this.$.songListPane.toggleLibrary();
    };
    this.savedLists.splice(inEvent, 1);
    this.$.listDialog.$.customListList.refresh();
    this.addLists();
  },
  
  // App-Menu
  openAppMenuHandler: function() {
    this.$.appMenu.open();
    enyo.log(this.$.songViewPane.testing);
    this.$.createNewSong.setShowing(this.$.songViewPane.testing);
  },
  
  closeAppMenuHandler: function() {
    this.$.appMenu.close();
  },
  
  showAbout: function() {
    this.$.aboutDialog.openAtCenter();
  },
  
  showHelp: function() {
    this.$.songViewPane.showHelp();
    this.$.songViewPane.$.viewScroller.scrollIntoView(0, 0);
    !Helper.smScr() || this.$.songSlidingPane.selectViewByName('songViewPane');
  },
  
  // ### Preferences ###
  showPreferences: function() {
    this.$.preferences.openAtCenter();
  },
  
  getPreferencesSuccess: function(inSender, inResponse) {
    if (inResponse.sortLyric != undefined) {
      this.$.songViewPane.setSort(inResponse.sortLyric);
      this.$.songViewPane.setShow(inResponse.showinToolbar);
      this.$.songViewPane.setShowChords(inResponse.showChords);
      this.$.songViewPane.setShowComments(inResponse.showComments);
      this.$.songViewPane.setShowHeadline(inResponse.showHeadline);
      this.$.preferences.setSortLyric(inResponse.sortLyric);
      this.$.preferences.setShowinToolbar(inResponse.showinToolbar);
      this.$.preferences.setShowChords(inResponse.showChords);
      this.$.preferences.setShowComments(inResponse.showComments);
      this.$.preferences.setShowHeadline(inResponse.showHeadline);
      this.$.songViewPane.setTesting(inResponse.testing);
      this.$.preferences.setTesting(inResponse.testing);
    };
    if (inResponse.css) {
      this.setCss(inResponse.css);
      this.setFont(inResponse.css);
    };
    if (inResponse.savedLists) {
      this.savedLists = inResponse.savedLists;
      this.customList = inResponse.customList;
    };
    enyo.log("got Preferences from Localstorage");
  },
  
  getPreferencesFailure: function(inSender, inResponse) {
    enyo.log("got failure from getPreferences");
  },
  
  setPreferencesSuccess: function(inSender, inResponse) {
    enyo.log("got success from setPreferences");
  },
  
  setPreferencesFailure: function(inSender, inResponse) {
    enyo.log("got failure from setPreferences");
  },
  
  saveLists: function(inSaved, inCustom) {
    this.$.setPreferencesCall.call({
      "savedLists": inSaved,
      "customList": inCustom
    });
  },
  
  saveCss: function(inCss) {
    this.$.setPreferencesCall.call({
      "css": inCss
    });
  },
  
  preferencesSaved: function(inSender, inSort, inShow, inChords, inComments,
    inHead, inTesting) {
    this.$.songViewPane.setSort(inSort);
    this.$.songViewPane.setShow(inShow);
    this.$.songViewPane.setShowChords(inChords);
    this.$.songViewPane.setShowComments(inComments);
    this.$.songViewPane.setShowHeadline(inHead);
    this.$.songViewPane.setTesting(inTesting);
    this.$.createNewSong.setShowing(inTesting);
    this.setCurrentIndex(this.currentIndex);
    this.$.preferences.close();
  },
  
  // ### XML-wirting stuff ###
  
  // Edit Song
  editSong: function () {
    this.$.editToaster.openAtCenter();
    this.$.editToaster.setElement(this[this.currentList].content[this.currentIndex]);
  },
  
  // Writing files
  writeXml: function(path, content) {
    //~ enyo.log(path);
    //~ enyo.log(content);
    this.$.writeFile.call({"path": path, "content": content});
  },
  
  writeFileSuccess: function(inSender, inResponse) {
    this.readDirCall();
    enyo.windows.addBannerMessage("Song saved", "{}");
  },
  
  writeFileFail: function(inSender, inResponse) {
    enyo.error("write File Failure");
    this.showError($L("writing:") + "<br> " + inResponse.path); 
  },

  // Create Song
  openCreateSong: function() {
    this.$.newSongDialog.openAtCenter();
    this.$.songName.setValue("");
    this.$.songErrorContent.setContent("");
    this.$.songName.forceFocus();
  },
  
  handleKeyPress: function(inSender, inEvent) {
    if (inEvent.keyCode===13) {
      this.createSong();
    } else if (inEvent.keyCode===47) {
      inEvent.preventDefault();
    };
  },
  
  createSong: function() {
    var songt = this.$.songName.getValue();
    var path = songt.replace(/\s+/g, "_") + ".xml"; 
    var e = false;
    for (i in this.libraryList.content) {
      var p = this.libraryList.content[i].path.split('/')
      if (path===p[p.length-1]) {
        this.$.songErrorContent.setContent($L("Name already exist"));
        e = true;
      }
    };
    if (!e) {
      path = this.dirPath + path;
      this.writeXml(path, WriteXml.create(songt));
      this.$.newSongDialog.close();
      this.newSong = {"path": path, "title": songt};
    };
  },
  
  // Error Dialog
  showError: function(content) {
    this.$.errorDialog.openAtCenter();
    this.$.errorContent.setContent(content);
  },
  
  closeClicked: function(sender) {
    this.$.errorDialog.close();
    this.$.firstUseDialog.close();
    this.$.newSongDialog.close();
  },
  
  // go Back
  goBack: function(inSender, inEvent) {
    this.$.songSlidingPane.back(inEvent);
    inEvent.stopPropagation();
  },
  
  // Handle links
  linkClicked: function (inSender, inUrl) {
    if (window.PalmSystem) {
      this.$.AppManService.call({target: inUrl});
    } else {
      window.open(inUrl, '_blank');
      window.focus();
    };
  }
});
