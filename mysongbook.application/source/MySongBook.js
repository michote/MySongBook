// #################
//
// Copyright (c) 2012-13 Micha Reischuck
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
  textSrce: "",
  published: {
    libraryList: {"content": []},
    savedLists: {"data": [], "modified": null},
    customList: undefined,
    searchList: {"content": []},
    css: undefined,
    currentList: "libraryList",
    currentIndex: undefined
  },
  components: [
    // Services
    {kind: "ApplicationEvents", onBack: "goBack"},
    {name: "AppManService", kind: "PalmService", service: "palm://com.palm.applicationManager/", 
      method: "open"},
    {name: "readDir", kind: "PalmService", service: "palm://com.michote.mysongbook.service/",
      method: "readdir", onSuccess: "readDirSuccess", onFailure: "readDirFail"},
    {name: "writeFile", kind: "PalmService", service: "palm://com.michote.mysongbook.service/",
      method: "writefile", onSuccess: "writeFileSuccess", onFailure: "writeFileFail"},
    {name: "writeList", kind: "PalmService", service: "palm://com.michote.mysongbook.service/",
      method: "writefile", onSuccess: "writeListSuccess", onFailure: "writeFileFail"},
    {name: "getTxt", kind: "WebService", onSuccess: "gotTxt", onFailure: "gotTxtFailure"},
    {name: "getTitle", kind: "WebService", onSuccess: "gotTitle", onFailure: "gotTitleFailure"},
    {name: "getLists", kind: "WebService", onSuccess: "gotLists", onFailure: "gotListsFailure"},
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
    {name: "readFilesDialog", kind: "ModalDialog", layoutKind: "VFlexLayout",
      caption: $L("Reading Files"), components :[
        {name: "fileProgress", kind: "ProgressBar"}
    ]},
    {name: "errorDialog", kind: "ModalDialog", layoutKind: "VFlexLayout",
      caption: $L("Error!"), scrim: true, components :[
        {name: "errorContent", kind: "HtmlContent", style:"margin: 10px 0;",
          content:""},
        {kind: "Button", caption: $L("Close"), onclick: "closeClicked"}
    ]},
    {name: "firstUseDialog", kind: "ModalDialog", layoutKind: "VFlexLayout",
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
    {name: "preferences", kind: "Preferences", onBack: "goBack"},
    {name: "newSongDialog", kind: "ModalDialog", layoutKind: "VFlexLayout",
      caption: $L("New song"), scrim: true, components: [
        {name: "songErrorContent", kind: "HtmlContent", 
          style: "color: #9E0508; margin: 0 10px", content: ""},
        {kind: "RowGroup", caption: $L("Songname"), components: [
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
      {caption: $L("Create new song"), onclick: "openCreateSong"},
      {caption: $L("Refresh Library"), onclick: "readDirCall"},
      {caption: $L("About"), onclick: "showAbout"},
      {caption: $L("Help"), onclick: "showHelp"}
    ]}
  ],

  create: function() {
    this.inherited(arguments);
    this.$.readDir.call({"path": this.dirPath});
    this.getPreferences();
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
    this.dirPath = inResponse.path; // needed for mock-service-testing;
    if (inResponse.files.length === 0) {
      this.$.firstUseDialog.openAtCenter();
      this.$.readFilesDialog.close();
    } else {
      this.$.fileProgress.setMaximum(inResponse.files.length+1);
      this.$.fileProgress.setPosition(1);
      for (i = 0; i < inResponse.files.length; i++) {
        if (inResponse.files[i].split('.').pop() === 'xml') { // only parse xml-files
          this.pathCount.a.push(i); 
          this.$.fileProgress.setPosition(i+2); 
          this.$.getTitle.setUrl(inResponse.path + inResponse.files[i]);
          this.$.getTitle.call();
        } else if (inResponse.files[i] === 'lists.json') {
          this.$.getLists.setUrl(inResponse.path + 'lists.json');
          this.$.getLists.call();
        }
      }
    }
  },
  
  readDirFail: function(inSender, inResponse) {
    enyo.error("read Dir Failure");
    this.showError($L("reading:") + "<br> " + "/media/internal/MySongBook"); 
  },
  
  gotTxt: function (inSender, inResponse) {
    this.textSrce = inResponse;
  },
  
  gotTxtFailure: function(inSender, inResponse, inRequest) {
    this.textSrce = "";
  },
  
  // get Title from XML  
  gotTitle: function(inSender, inResponse, inRequest) {
    var xml = ParseXml.parse_dom(inResponse);
    if (ParseXml.get_titles(xml)) { // check for valid title before adding to library
      var a = {"path": inRequest.url, "title": ParseXml.get_titles(xml)[0].title};
      this.libraryList.content.push(a);
    }
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
          }
        }
        this.newSong = false;
        this.$.songListPane.$.libraryList.updateRow();
        this.editSong();
      }
    }
  },
  
  gotTitleFailure: function(inSender, inResponse, inRequest) {
    enyo.error("Parse Title Failure");
    this.errorList.push(inRequest.url.replace(this.dirPath,""));
    this.pathCount.b.push(1);
    if (this.pathCount.b.length === this.pathCount.a.length) {
      this.sortAndRefresh();
      this.showError($L("reading:") + "<br>" + this.errorList.join(" <br>"));
    }
  },
  
  // get savedLists from file
  gotLists: function(inSender, inResponse, inRequest) {
    enyo.log(inResponse.data);
    this.savedLists = inResponse;
    this.customList = (this.savedLists.data[this.customList] ? this.customList : undefined); // if lists was deleted, don't try to open it
    enyo.log(this.customList);
  },
  
  gotListsFailure: function(inSender, inResponse, inRequest) {
    enyo.error("Parse Lists Failure");
  },
   
  // Sort Library alphabetically
  sortByTitle: function (a,b) {
    if (a.title < b.title) {
      return -1;
    }
    if (a.title > b.title) {
      return 1;
    }
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
    }
  },
  
  // List Tab  
  setIndex: function(inSender, inEvent) {
    this.setCurrentIndex(inEvent.rowIndex);
    //~ enyo.log("index changed");
  },
  
  openSong: function(index) {
    enyo.log(this.currentList);
    if (this.currentList === "customList") {
      this.$.songViewPane.setPath(this.dirPath + this.savedLists.data[this.customList].content[index].file);
    } else {
      this.$.songViewPane.setPath(this[this.currentList].content[index].path);
    }
    this.$.songViewPane.setFirst(true);
    this.$.songListPane.$[this.currentList].refresh(); // mark selcted row
    this.$.songViewPane.$.viewScroller.scrollIntoView(0, 0);
    !Helper.smScr() || this.$.songSlidingPane.selectViewByName('songViewPane');
  },
  
  currentIndexChanged: function() {
    if (this.currentIndex >= 0) {
      this.openSong(this.currentIndex);
    } else {
      this.$.songListPane.$[this.currentList].refresh();
    }
  },
  
  // Adjust Font
  setFont: function(css) {
    if (css) {
      this.$.songViewPane.$.lyric.applyStyle("font-size", css.size);
      this.$.songViewPane.$.lyric.applyStyle("line-height", css.space);
    }
  },
  
  // ### Custom Lists ###
  searchSwipe: function(inSender, inEvent) {
    var base = this.$.songListPane.oldList;
    if (base === "libraryList") {
      this.addToList(null, inEvent);
    } else {
      for (t in this.savedLists.data[this.customList].content) {
        if (this.savedLists.data[this.customList].content[t].path === this.searchList.content[inEvent].path) {
          this.savedLists.data[this.customList].content.splice(t, 1);
          this.searchList.content.splice(inEvent, 1);
          this.saveLists();
          this.$.songListPane.$.searchList.refresh();
        }
      }
    }
  },
  
  addToList: function(inSender, inEvent) {
    if (this.savedLists.data[this.customList]) {
      this.savedLists.data[this.customList].content.push({"file": this.libraryList.content[inEvent].path.split("/").slice(-1)[0], "title": this.libraryList.content[inEvent].title});
      this.saveLists();
    } else {
      this.$.songListPane.noList();
    }
  },
  
  removeFromList: function(inSender, inEvent) {
    this.savedLists.data[this.customList].content.splice(inEvent, 1);
    this.$.songListPane.$.customList.refresh();
    this.$.songListPane.$.title.setContent(this.savedLists.data[this.customList].title+ " (" + 
      this.savedLists.data[this.customList].content.length + ")");
    this.saveLists();
  },
  
  // Select and Remove Lists
  selectCustomList: function(inSender, inEvent) {
    this.customList = inEvent.rowIndex;
    Helper.setItem("customList", inEvent.rowIndex);
    this.$.listDialog.close();
    this.$.songListPane.$.listToggle.setValue(1);
    this.$.songListPane.toggleList();
  },
  
  rmCustomList: function(inSender, inEvent) {
    this.customList = undefined; // no List selected
    Helper.setItem("customList", undefined);
    this.$.songListPane.$.listToggle.setValue(0);
    this.$.songListPane.toggleLibrary();
    this.savedLists.data.splice(inEvent, 1);
    this.$.listDialog.$.customListList.refresh();
    this.saveLists();
  },
  
  // App-Menu
  openAppMenuHandler: function() {
    this.$.appMenu.open();
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
  showPreferences: function () {
    this.$.preferences.openAtCenter();
  },
  
  getPreferences: function () {
    if (Helper.getItem("css")) {
      this.setCss(Helper.getItem("css"));
      this.setFont(Helper.getItem("css"));
    }
    this.customList = Helper.getItem("customList");
  },
  
  saveLists: function () {
    this.$.writeFile.call({"path": this.dirPath + 'lists.json', "content": JSON.stringify(this.savedLists, null, 2)});
  },
  
  saveCss: function(inCss) {
    Helper.setItem("css", inCss);
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
    enyo.windows.addBannerMessage($L("Song saved"), "{}");
  },
  
  writeFileSuccess: function(inSender, inResponse) {
    enyo.windows.addBannerMessage($L("Lists saved"), "{}");
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
    }
  },
  
  createSong: function() {
    var songt = this.$.songName.getValue();
    var path = songt.replace(/\s+/g, "_") + ".xml";   //' ' -> '_'
    var e = false;
    for (i in this.libraryList.content) {
      var p = this.libraryList.content[i].path.split('/')
      if (path===p[p.length-1]) {
        this.$.songErrorContent.setContent($L("Name already exist"));
        e = true;
      }
    }
    if (!e) {  // songt.xml does not exits.
      path = this.dirPath + path;  // path and xml filename
      // is there a .txt file to use
      var txtPath = songt + ".txt";   // allow spaces in txt file names 
      this.$.getTxt.setUrl(this.dirPath + txtPath);
      this.$.getTxt.call();  // file content to this.textSrce
      enyo.job("readTimeOut", enyo.bind(this, "createSongCont", path, songt), 1000); // wait up to 1 sec for text file.
    }
  },
  
  createSongCont: function(path, songt) {
    if (this.textSrce !== "") {
      this.writeXml(path, convLyrics(this.textSrce));  // write txt file contents
    } else {  
      this.writeXml(path, WriteXml.create(songt));  // write file skeleton
    }
    this.$.newSongDialog.close();
    this.newSong = {"path": path};
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
    }
  }
});
