enyo.kind({
  name: "FontDialog",
  kind: "ModalDialog",
  layoutKind:"VFlexLayout",
  caption: $L("Font Settings"),
  scrim: true,
  onBack: "cancelClicked",
  components: [ 
    {kind: "RowGroup", components: [
      {kind: "LabeledContainer", label: $L("Font size:"), components: [
        {name: "fontSizeSelector", kind: "ListSelector", value: "100%",
          onChange: "changed", items: [
            {caption: $L("small"), value: "80%"},
            {caption: $L("normal"), value: "100%"},
            {caption: $L("large"), value: "120%"},
            {caption: $L("very large"), value: "140%"},
        ]},
      ]},
    ]},
    {kind: "RowGroup", components: [
      {kind: "LabeledContainer", label: $L("Line spacing:"), components: [
        {name: "lineSpacingSelector", kind: "ListSelector", value: "140%",
          onChange: "changed", items: [
            {caption: $L("small"), value: "110%"},
            {caption: $L("normal"), value: "140%"},
            {caption: $L("large"), value: "160%"},
            {caption: $L("very large"), value: "180%"},
        ]},
      ]},
    ]},
    {kind: "HFlexBox", pack: "center", components : [
      {kind: "Button", className: "enyo-button-negative", flex: 1, 
        caption: $L("Cancel"), onclick: "cancelClicked"},
      {kind: "Button", className: "enyo-button-affirmative", flex: 1, 
        caption: $L("Save"), onclick: "saveClicked"}
    ]}
  ],
  
  rendered: function() {
    if (this.owner.css) {
      this.$.fontSizeSelector.setValue(this.owner.css.size);
      this.$.lineSpacingSelector.setValue(this.owner.css.space);
    }
  },
  
  changed: function() {
    this.css = {"size": this.$.fontSizeSelector.getValue(), 
      "space": this.$.lineSpacingSelector.getValue()};
    this.owner.setFont(this.css);
  },
  
  cancelClicked: function() {
    this.owner.setFont(this.owner.css);
    this.rendered();
    this.close();
  },
  
  saveClicked: function(s) {
    this.owner.setCss(this.css);
    this.owner.setFont(this.css);
    this.owner.saveCss(this.css);
    this.close();
  }
});
