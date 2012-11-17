enyo.kind({
  name: "Preferences",
  kind: "Toaster",
  flyInFrom: "top",
  width: Helper.toasterWidth(),
  autoClose: false,
  dismissWithClick: false,
  scrim: true,
  style: "height:100%;",
  published: {
    showPrefs: {
      sortLyrics: true,
      showinToolbar: "copyright",
      showChords: true,
      showComments: false,
      showName: true,
      showTransposer: true,
      showPrint: false,
      showScroll: true,
      showAuto: true,
      scrollToNext: true
    },
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
                    onChange: "toggle", onLabel: $L("yes"), offLabel: $L("no"),
                    components:[{className: "toggle-button-knob"}]}
              ]},
              {kind: "Item", tapHighlight: false, layoutKind: "HFlexLayout", 
                components: [
                {flex: 1, content:$L("Show in bottom toolbar:")},
                {name: "showinToolbar", kind: "ListSelector", value: "copyright", 
                  onChange:"toggle", hideArrow: false, items: [
                  {caption: $L("copyright"), value:"copyright"},
                  {caption: $L("author"), value:"authors"},
                  {caption: $L("publisher"), value:"publisher"},
                ]}
              ]},
              {kind: "LabeledContainer", caption: $L("Show Chords"),
                components: [
                  {kind: "ToggleButton", name: "showChords", state: true,
                    onChange: "toggle", onLabel: $L("yes"), offLabel: $L("no"),
                    components:[{className: "toggle-button-knob"}]}
              ]},
              {kind: "LabeledContainer", caption: $L("Show Comments"),
                components: [
                  {kind: "ToggleButton", name: "showComments", state: false,
                    onChange: "toggle", onLabel: $L("yes"), offLabel: $L("no"),
                    components:[{className: "toggle-button-knob"}]}
              ]},
              {kind: "LabeledContainer", caption: $L("Show elementname (e.g. V1:)"),
                components: [
                  {kind: "ToggleButton", name: "showName", state: true,
                    onChange: "toggle", onLabel: $L("yes"), offLabel: $L("no"),
                    components:[{className: "toggle-button-knob"}]}
              ]}
            ]},
            {kind: "RowGroup", caption: $L("Button Settings"), components:[
              {kind: "LabeledContainer", caption: $L("Show Transposer"),
                components: [
                  {kind: "ToggleButton", name: "showTransposer", state: true,
                    onChange: "toggle", onLabel: $L("yes"), offLabel: $L("no"),
                    components:[{className: "toggle-button-knob"}]}
              ]},
              {kind: "LabeledContainer", caption: $L("Show Scrollbuttons"),
                components: [
                  {kind: "ToggleButton", name: "showScroll", state: true,
                    onChange: "toggle", onLabel: $L("yes"), offLabel: $L("no"),
                    components:[{className: "toggle-button-knob"}]}
              ]},
              {kind: "LabeledContainer", caption: $L("Show Autoscrollbutton"),
                components: [
                  {kind: "ToggleButton", name: "showAuto", state: true,
                    onChange: "toggle", onLabel: $L("yes"), offLabel: $L("no"),
                    components:[{className: "toggle-button-knob"}]}
              ]},
              {kind: "LabeledContainer", caption: $L("Autoscroll end to next page (on button press)"),
                components: [
                  {kind: "ToggleButton", name: "scrollToNext", state: true,
                    onChange: "toggle", onLabel: $L("yes"), offLabel: $L("no"),
                    components:[{className: "toggle-button-knob"}]}
              ]},
              {kind: "LabeledContainer", caption: $L("Show Printbutton"),
                components: [
                  {kind: "ToggleButton", name: "showPrint", state: true,
                    onChange: "toggle", onLabel: $L("yes"), offLabel: $L("no"),
                    components:[{className: "toggle-button-knob"}]}
              ]}
            ]}//~ ,
            //~ {kind: "RowGroup", caption: $L("Developement Settings"), components:[
              //~ {kind: "HFlexBox", components: [
                  //~ {kind: "HtmlContent", flex: 1, content: "Enable \"features in \
                    //~ development\".<br><span style='color:red;'>This comes without \
                    //~ any warranty and may destroy yout data!</span>"},
                  //~ {kind: "ToggleButton", name: "testingToggle", state: false,
                    //~ onChange: "toggleTesting", onLabel: $L("yes"), offLabel: $L("no"),
                    //~ components:[{className: "toggle-button-knob"}]}
              //~ ]}
            //~ ]},
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
    this.getPrefs();
    //~ this.owner.$.songViewPane.setTesting(this.testing);
    this.owner.$.songViewPane.setShowPrefs(this.showPrefs);
  },
  
  getPrefs: function() {
    if (Helper.getItem("showPrefs")) {
      this.showPrefs = Helper.getItem("showPrefs");
      //~ enyo.log("got", "showPrefs", Helper.getItem("showPrefs"));
    }
    //~ if (Helper.getItem("testing")) {
      //~ this.testing = Helper.getItem("testing");
      //~ // enyo.log("got", "testing", Helper.getItem("testing"));
    //~ }
  },
  
  rendered: function() {
    this.getPrefs();
    for (i in this.showPrefs) {
      enyo.log("set: ", i, this.showPrefs[i]);
      if (i === "showinToolbar") {
        this.$[i].setValue(this.showPrefs[i]);
      } else {
        this.$[i].setState(this.showPrefs[i]);
      }
    }
    //~ this.$.testingToggle.setState(this.testing);
  },
  
  savePrefs: function() {
    //~ Helper.setItem("testing", this.testing);
    Helper.setItem("showPrefs", this.showPrefs);
    //~ this.owner.$.songViewPane.setTesting(this.testing);
    this.owner.$.songViewPane.setShowPrefs(this.showPrefs);
    this.close();
  },
  
  cancelClick: function() {
    this.close();
  },

  //~ toggleTesting: function () {
    //~ this.testing = this.$.testingToggle.getState();
  //~ },

  toggle: function (inSender, inEvent) {
    this.showPrefs[inSender.name] = inEvent;
  }
});
