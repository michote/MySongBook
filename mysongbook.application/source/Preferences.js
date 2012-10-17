enyo.kind({
  name: "Preferences",
  kind: enyo.Toaster,
  flyInFrom: "top",
  width: Helper.toasterWidth(),
  autoClose: false,
  dismissWithClick: false,
  scrim: true,
  style: "height:100%;",
  events: {
    onSave: "",
    onCancel: ""
  },
  published: {
    sortLyric: true,
    showinToolbar: "copyright",
    showChords: true,
    showComments: true,
    showHeadline: false,
    testing: false
  },
  components: [ 
    {className: "enyo-sliding-view-shadow"},
    {kind: enyo.VFlexBox, flex: 1, className: "enyo-bg", style: "height: 100%;",
      components: [
        {name: "headerToolbar", kind: "Toolbar", pack : "center", components: [
          {kind: "Image", src: "images/icon48.png", className: "prefsimage"}, 
          {name: "title", kind: "HtmlContent", className: "song title",
            content: $L("Preferences")}
        ]},
        {kind: "Scroller", flex: 1, components: [
          {kind:"VFlexBox", className:"box-center", components:[
            //~ {kind: "RowGroup", caption: $L("General Settings"), components:[
              //~ {kind: "LabeledContainer", caption: $L("Something"),
                //~ components: [
                  //~ {kind: "ToggleButton", name: "", state: false,
                    //~ onChange: "toggle", onLabel: $L(""), offLabel: $L(""),
                    //~ components:[{className: "toggle-button-knob"}]}
              //~ ]}
            //~ ]},
            {kind: "RowGroup", caption: $L("Display Settings"), components:[
              {kind: "LabeledContainer", caption: $L("Sort Lyric"),
                components: [
                  {kind: "ToggleButton", name: "sortLyrics", state: false,
                    onChange: "toggleSortLyrics", onLabel: $L("yes"), offLabel: $L("no"),
                    components:[{className: "toggle-button-knob"}]}
              ]},
              {kind: "Item", tapHighlight: false, layoutKind: "HFlexLayout", 
                components: [
                {flex:1, content:$L("Show in bottom toolbar:")},
                {name:"toolbarSwitch", kind: "ListSelector", value: "copyright", 
                  onChange:"onchange_toolbarSwitch", hideArrow: false, items: [
                  {caption: $L("copyright"), value:"copyright"},
                  {caption: $L("author"), value:"authors"},
                  {caption: $L("publisher"), value:"publisher"},
                ]}
              ]},
              {kind: "LabeledContainer", caption: $L("Show Chords"),
                components: [
                  {kind: "ToggleButton", name: "toggleChords", state: true,
                    onChange: "toggleShowChords", onLabel: $L("yes"), offLabel: $L("no"),
                    components:[{className: "toggle-button-knob"}]}
              ]},
              {kind: "LabeledContainer", caption: $L("Show Comments"),
                components: [
                  {kind: "ToggleButton", name: "toggleComments", state: true,
                    onChange: "toggleShowComments", onLabel: $L("yes"), offLabel: $L("no"),
                    components:[{className: "toggle-button-knob"}]}
              ]},
              {kind: "LabeledContainer", caption: $L("Show elementname (e.g. Verse 1) as Headline"),
                components: [
                  {kind: "ToggleButton", name: "toggleHeadline", state: false,
                    onChange: "toggleShowHeadline", onLabel: $L("yes"), offLabel: $L("no"),
                    components:[{className: "toggle-button-knob"}]}
              ]}
            ]},
            {kind: "RowGroup", caption: $L("Developement Settings"), components:[
              {kind: "HFlexBox", components: [
                  {kind: "HtmlContent", flex: 1, content: "Enable features in \
                    development.<br><span style='color:red;'>This comes without \
                    any warranty and may destroy yout data!</span>"},
                  {kind: "ToggleButton", name: "testingToggle", state: false,
                    onChange: "toggleTesting", onLabel: $L("yes"), offLabel: $L("no"),
                    components:[{className: "toggle-button-knob"}]}
              ]}
            ]},
          ]}
        ]},
        {name: "footerToolbar", kind: "Toolbar", pack : "center", components: [
          {name: "backButton", kind: "Button", className: "enyo-button-dark", 
            caption: $L("Done"), width: "200px", onclick : "savePrefs"},
        ]},
      ]},
    {className: "enyo-sliding-view-shadow-right"}
  ],
  
  create: function() {
    this.inherited(arguments);
  },
    
  rendered: function() {
    this.$.sortLyrics.setState(this.sortLyric);
    this.$.toolbarSwitch.setValue(this.showinToolbar);
    this.$.toggleChords.setState(this.showChords);
    this.$.toggleComments.setState(this.showComments);
    this.$.toggleHeadline.setState(this.showHeadline);
    this.$.testingToggle.setState(this.testing);
  },
  
  savePrefs: function(inSender, inEvent) {
    this.owner.$.setPreferencesCall.call({
      "sortLyric": this.sortLyric,
      "showinToolbar": this.showinToolbar,
      "showChords": this.showChords,
      "showComments": this.showComments,
      "showHeadline": this.showHeadline,
      "testing": this.testing
    });
    this.doSave(this.sortLyric, this.showinToolbar, this.showChords, 
      this.showComments, this.showHeadline, this.testing);
  },
  
  cancelClick: function() {
    this.close();
  },
  
  // toggle and change Events
  toggleSortLyrics: function() {
    //~ enyo.log("SortLyric toggled", this.$.sortLyrics.getState());
    this.sortLyric = this.$.sortLyrics.getState();
  },
  
  onchange_toolbarSwitch: function () {
    //~ enyo.log("ToolbarSwitch toggled", this.$.toolbarSwitch.getValue());
    this.showinToolbar = this.$.toolbarSwitch.getValue();
  },
  
  toggleShowChords: function () {
    //~ enyo.log("ShowChords toggled", this.$.toggleChords.getState());
    this.showChords = this.$.toggleChords.getState();
  },
  
  toggleShowComments: function () {
    //~ enyo.log("Show Comments toggled", this.$.toggleComments.getState());
    this.showComments = this.$.toggleComments.getState();
  },
  
  toggleTesting: function () {
    //~ enyo.log("Testing toggled", this.$.testingToggle.getState());
    this.testing = this.$.testingToggle.getState();
  },
  
  toggleShowHeadline: function () {
    //~ enyo.log("Headline toggled", this.$.toggleHeadline.getState());
    this.showHeadline = this.$.toggleHeadline.getState();
  }
  
});
