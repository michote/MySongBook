// #################
//
// Copyright (c) 2012 Micha Reischuck
//
// MySongBook is available under the terms of the MIT license. 
// The full text of the MIT license can be found in the LICENSE file included in this package.
//
// #################


enyo.kind({
  name: "SongList",
  kind: enyo.SlidingView,
  layoutKind: enyo.VFlexLayout,
  searchF: "titles",
  searchCount: {"a": [], "b": []},
  xmlList: [], 
  events: {
    "onShowPrefs": "",
    "onSearchList": "",
    "onListTap": "",
    "onAddList": "",
    "onRmList": ""
  },
  components: [
    {name: "getXml", kind: "WebService", onSuccess: "gotXml", 
      onFailure: "gotXmlFailure"},
    // header Toolbar
    {name: "headerToolbar", kind: "Toolbar", components: [
      {name: "prefsButton", kind: "IconButton",
         icon: "images/prefs.png", onclick: "doShowPrefs"},
      {name: "title", kind: "HtmlContent", className: "song title", 
        content: $L("Song List"), flex: 1},
      {name: "searchSpinner", kind: enyo.Spinner},
      {name: "searchButton", kind: "IconButton", toggling: true,
         icon: "images/search.png", onclick: "extendSearch"}
    ]},
    
    // Search
    {name: "searchBar", kind: "Toolbar", className: "searchbar", showing: false,
      components: [
      {name: "searchBox", kind: enyo.SearchInput, hint: $L("search for ..."), 
        autoCapitalize: "lowercase", value: "", oninput: "startSearch", 
        onCancel: "clearSearch", keypressInputDelay: 500, flex:1}
    ]},
    {name: "searchBar2", kind: "Toolbar", className: "searchbar", showing: false, 
      components: [
      {kind: "RadioToolButtonGroup", components: [
        {name: "titles", icon: "images/title.png", onclick: "searchFilter"},
        {name: "authors", icon: "images/author.png", onclick: "searchFilter"},
        {name: "lyrics", icon: "images/lyrics.png", onclick: "searchFilter"}
      ]}
    ]},
    
    // ### Lists ###
    {name: "listPane", kind: "Pane", flex: 1, transitionKind: enyo.transitions.Simple, 
    components: [
      // Library
      {name: "libraryList", kind: "VirtualList", style: "width: 100%; height: 100%;",
        flex: 1, onSetupRow: "getLibrary", onclick: "doListTap", 
          components: [
          {name: "libraryListItem", kind: enyo.SwipeableItem, onConfirm: "doAddList",
            confirmCaption: $L("Add to list"), cancelCaption: $L("Cancel "), 
            layout: enyo.HFlexBox, components: [
            {name: "libraryListTitle", className: "songlisttitle", content: ""},
        ]}
      ]},
      // Custom List
      {name: "customList", kind: "VirtualList", style: "width: 100%; height: 100%;",
        flex: 1, onSetupRow: "getCustomList", onclick: "doListTap", 
          components: [
          {name: "customListItem", kind: enyo.SwipeableItem, onConfirm: "doRmList",
            confirmCaption: $L("Delete"), cancelCaption: $L("Cancel "), 
            layout: enyo.HFlexBox, components: [
            {name: "customListTitle", className: "songlisttitle", content: ""},
        ]}
      ]},
      // Search List
      {name: "searchList", kind: "VirtualList", style: "width: 100%; height: 100%;",
        flex: 1, onSetupRow: "getSearchList", onclick: "doListTap", 
          components: [
          {name: "searchListItem", kind: enyo.SwipeableItem, onConfirm: "doSearchList",
            confirmCaption: $L("Add to list"), cancelCaption: $L("Cancel "),
            layout: enyo.HFlexBox, components: [
            {name: "searchListTitle", className: "songlisttitle", content: ""},
        ]}
      ]},
    ]},
      
    // footer Toolbar
    {name: "footerToolbar", kind: "Toolbar", pack: "start", components: [
      {name: "openButton", kind: "IconButton", icon: "images/open.png", 
        onclick: "openList"},
      {kind: "Spacer", flex: 0, style: "width: 20px"},
      {name: "listToggle", kind: "RadioToolButtonGroup", components: [
        {name: "libraryButton", icon: "images/library.png", onclick: "toggleLibrary"},
        {name: "listButton", icon: "images/list.png", onclick: "toggleList"}
      ]}
    ]},
    // Errors
    {name: "errorDialog", kind: enyo.ModalDialog, layoutKind: "VFlexLayout",
      caption: $L("No List"), components :[
        {name: "errorContent", kind: "HtmlContent", style:"margin: 10px;",
          content: $L("Please define a List")},
        {kind: "Button", caption: $L("Manage Lists"), onclick: "noListClicked"}
    ]}
  ],
  
  create: function( ) {
    this.inherited(arguments);
    if (window.PalmSystem) {
      this.$.prefsButton.hide();
    };
  },
  
  // populate library list
  getLibrary: function(inSender, inIndex) {
    var r = this.owner.libraryList.content[inIndex];
    if (r) {
      // Set select color
      var isRowSelected = (inIndex === this.owner.currentIndex);
      this.$.libraryListItem.addRemoveClass("item-selected", isRowSelected);
      this.$.libraryListItem.addRemoveClass("item-not-selected", !isRowSelected);
      // Set title
      this.$.libraryListTitle.setContent(r.title);
      return true;
    }
  },
    
  // populate custom list
  getCustomList: function(inSender, inIndex) {
    if (this.owner.customList) {
      var r = this.owner.customList.content[inIndex];
    };
    if (r) {
      // Set select color
      var isRowSelected = (inIndex === this.owner.currentIndex);
      this.$.customListItem.addRemoveClass("item-selected", isRowSelected);
      this.$.customListItem.addRemoveClass("item-not-selected", !isRowSelected);
      // Set title
      this.$.customListTitle.setContent(r.title);
      return true;
    }
  },
    
  // populate search list
  getSearchList: function(inSender, inIndex) {
    if (this.owner.searchList) {
      var r = this.owner.searchList.content[inIndex];
    };
    if (r) {
      // Set select color
      var isRowSelected = (inIndex === this.owner.currentIndex);
      this.$.searchListItem.addRemoveClass("item-selected", isRowSelected);
      this.$.searchListItem.addRemoveClass("item-not-selected", !isRowSelected);
      // Set title
      this.$.searchListTitle.setContent(r.title);
      return true;
    }
  },
  
  // ### Search ### 
  extendSearch: function() {
    this.$.searchBar.setShowing(!this.$.searchBar.getShowing());
    this.$.searchBar2.setShowing(!this.$.searchBar2.getShowing());
    if (this.$.searchBar.getShowing()) {
      this.$.searchBox.setDisabled(true);
      this.oldList = this.owner.currentList
      this.onSearch();
    } else {
      this.clearSearch();
    }
  },
  
  clearSearch: function() {
    if (this.oldList === "customList") {
      this.$.listToggle.setValue(1);
      this.toggleList();
    } else {
      this.$.listToggle.setValue(0);
      this.toggleLibrary()
    };
    this.$.searchBox.setValue("");
    this.$.searchSpinner.hide();
  },
  
  searchFilter: function(inSender, inEvent) {
    this.searchF = inSender.name;
    this.$.searchBox.forceFocus();
    this.startSearch();
  },
  
  onSearch: function() {
    this.xmlList = [];
    var list = this.owner[this.owner.currentList];
    this.$.searchSpinner.show();
    for (i in list.content) {
      this.$.getXml.setUrl(list.content[i].path);
      this.searchCount.a.push(i); 
      this.$.getXml.call();
    } 
    if (list.content.length === 0) {
      this.$.searchSpinner.hide();
    }
  },
  
  gotXml: function(inSender, inResponse, inRequest) {
    var xml = ParseXml.parse_dom(inResponse);
    var a = {"path": inRequest.url, "title": ParseXml.get_titles(xml)[0].title,
      "xml": xml};
    this.xmlList.push(a);
    // unlock search input
    this.searchCount.b.push(1);
    if (this.searchCount.b.length === this.searchCount.a.length) {
      this.$.searchBox.setDisabled(false);
      this.$.searchBox.forceFocus();
      this.$.searchSpinner.hide();
    };
  },
  
  gotXmlFailure: function(inSender, inResponse, inRequest) {
    enyo.error("Parse Search XML Failure");
    this.searchCount.b.push(1);
    if (this.searchCount.b.length === this.searchCount.a.length) {
      this.$.searchBox.setDisabled(false);
      this.$.searchBox.forceFocus();
      this.$.searchSpinner.hide();
    };
  },
  
  startSearch: function () {
    this.owner.searchList.content = [];
    if (this.$.searchBox.getValue() !== "") {
      term = this.$.searchBox.getValue().toLowerCase()
      this.$.searchSpinner.show();
      for (i in this.xmlList) {
        x = this.xmlList[i]
        w = Helper.filter(this.searchF, term, this.xmlList[i].xml);
        if (w) {
          this.owner.searchList.content.push({"path": x.path, "title": x.title});
        };
      };
      this.$.listPane.selectViewByName("searchList")
      this.owner.currentList = "searchList";
      if (this.oldList === "customList") {
        this.$.searchListItem.setConfirmCaption($L("Delete"));
      } else {
        this.$.searchListItem.setConfirmCaption($L("Add to list"));
      };
      this.$.searchList.refresh();
      this.$.searchSpinner.hide();
      //~ enyo.log(this.owner.searchList);
    } else {
      this.clearSearch();
    };
  },
  
  // ### custom Lists ###
  toggleLibrary: function() {
    this.owner.currentList = "libraryList";
    if (this.$.searchBar.getShowing() && this.oldList) { // toggle while search open
      this.oldList = "libraryList";
      this.$.searchBox.setValue("");
      this.onSearch();
    };
    this.$.title.setContent($L("Song List") + " (" + 
      this.owner.libraryList.content.length + ")");
    this.owner.setCurrentIndex(undefined);
    this.$.listPane.selectViewByName("libraryList");
  },
  
  toggleList: function() {
    if (this.owner.customList) {
      this.owner.currentList = "customList";
      if (this.$.searchBar.getShowing() && this.oldList) { // toggle while search open
        this.oldList = "customList";
        this.$.searchBox.setValue("");
        this.onSearch();
      };
      this.$.title.setContent(this.owner.customList.title+ " (" + 
      this.owner.customList.content.length + ")");
      this.owner.setCurrentIndex(undefined);
      this.$.listPane.selectViewByName("customList");
      
    } else {
      this.noList()
    };
  },
  
  openList: function() {
    this.owner.$.listDialog.openAtCenter();
  },
  
  noList: function() {
    this.$.errorDialog.openAtCenter();
  },
  
  noListClicked: function() {
    this.$.errorDialog.close();
    this.owner.$.listDialog.openAtCenter();
  }
});
