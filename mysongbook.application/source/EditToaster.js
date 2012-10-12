enyo.kind({
  name:"Edit",
  kind: enyo.Toaster,
  flyInFrom: "top",
  width: Helper.toasterWidth(),
  style: "height:100%;",
  published: {
    element: "",
    xml: "",
    metadata: {},
    lyrics: {}
  },
  components: [
    {name: "getXml", kind: "WebService", onSuccess: "gotXml", 
      onFailure: "gotXmlFailure"},
    {className: "enyo-sliding-view-shadow"},
    {kind: enyo.VFlexBox, flex: 1, className: "enyo-bg", style: "height: 100%;",
      components: [ 
      {name: "headerToolbar", kind: "Toolbar", pack: "center", components: [
        {kind: "HtmlContent", flex: 1, className: "song title",
          content: $L("Edit")},
        {kind: "RadioToolButtonGroup", components: [
          {name: "meta", icon: "images/title.png", onclick: "toggleMeta"},
          {name: "lyrics", icon: "images/lyrics.png", onclick: "toggleLyrics"}
        ]},
        {name: "title", kind: "HtmlContent", flex: 1, className: "song title",
          content: $L("Title"), style: "text-align: right; padding-right: 8px;"}
      ]},
      {name: "editPane", kind: "Pane", flex: 1, transitionKind: enyo.transitions.Simple, 
        components: [
        {name: "metaPane", kind: "EditMeta"},
        {name: "lyricsPane", kind: "EditLyrics"},
      ]},
      {name: "footerToolbar", kind: "Toolbar", pack : "center", components: [
        {kind: "Button", className: "enyo-button-negative",
          caption: $L("Cancel"), width: "15%", onclick: "closeThis"},
        {kind: "Button", className: "enyo-button-affirmative", 
          caption: $L("Save"), width: "15%", onclick: "saveClicked"}
      ]}
    ]},
    {className: "enyo-sliding-view-shadow-right"},
    {kind: "ModalDialog", name: "displayDialog", caption: $L("New Song"),
      width: "90%", height: "85%", components :[ 
      {name: "viewScroller", kind: enyo.Scroller, flex: 1, height: 
        Helper.dialogHeight(), components: [ 
          {name: "newText", kind: "RichText", richContent: false, value: ""}
      ]},
      {kind: "HFlexBox", pack: "center", style: "bottom: 0;", components : [
        {kind : "Button", flex: 0, caption : $L("Close"), width: "150px", onclick : "cancelClicked"}
      ]}
    ]}
  ],
    
  
  create: function() {
    this.inherited(arguments);
  },
  
  toggleMeta: function() {
    this.$.editPane.selectViewByName("metaPane");
    this.$.lyricsPane.saveModifications();
  },
  
  toggleLyrics: function() {
    this.$.editPane.selectViewByName("lyricsPane");
    this.$.metaPane.saveModifications();
  },
  
  elementChanged: function() {
    this.$.title.setContent(this.element.title);
    this.$.getXml.setUrl(this.element.path);
    this.$.getXml.call();
  },
  
  gotXml: function(inSender, inResponse) {
    this.xml = ParseXml.parse_dom(inResponse);
    this.$.lyricsPane.setLyrics(ParseXml.editLyrics(this.xml));
    this.$.metaPane.setMetadata(ParseXml.allMetadata(this.xml));
  },
  
  gotXmlFailure: function(inSender, inResponse, inRequest) {
    enyo.log("Parse XML Failure");
    this.owner.showError("reading:" + "</br>" + inRequest.url);
  },
  
  saveClicked: function(s) {
    this.$.metaPane.saveModifications();
    this.$.lyricsPane.saveModifications();
    // everything should be saved here
    //~ enyo.log(this.metadata);
    //~ enyo.log(this.lyrics);
    this.$.displayDialog.openAtCenter();
    //~ this.$.newText.setValue(JSON.stringify(this.metadata) + "<br>" + JSON.stringify(this.lyrics));
    //~ this.$.newText.setValue(WriteXml.write(xml, this.metadata, this.lyrics));
    this.$.newText.setValue(WriteXml.edit(this.xml, this.metadata, this.lyrics));
    
    //~ this.close();
  },
  
  cancelClicked: function() {
    this.$.displayDialog.close();
  },
  
  closeThis: function() {
    this.close();
  }
  
});
