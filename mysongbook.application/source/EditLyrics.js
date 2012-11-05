enyo.kind({
  name: "EditLyrics",
  kind: enyo.VFlexBox,
  add: "v",
  parts: [1],
  published: {
    lyrics: {},
    element: {
        elname: "v1",
        language: "en",
        lines: [{part: "men", text: "some text here"}, {part: "women", text: "we will only display the first line here"}]
      }
  },
  components: [
    {name: "addBar", kind: "Toolbar", className: "searchbar",
      components: [
      {kind: "HtmlContent", className: "copy title", content: $L("add new")},
      {name: "adder", kind: "ListSelector", value: "v", onChange:"toggleAdd",
        className: "enyo-picker-button custom-picker", items: [
        {caption: $L("v"), value: "v"},
        {caption: $L("c"), value: "c"},
        {caption: $L("b"), value: "b"},
        {caption: $L("p"), value: "p"},
        {caption: $L("e"), value: "e"},
      ]},
      {name: "addButton", kind: "IconButton", icon: "images/add.png", 
        onclick: "addNew"}
    ]},
    {kind: "Scroller", flex: 1, components: [
      {name: "lyric", kind:"VFlexBox", className: "box-center"}
    ]},
    // Edit Dialog
    {name: "editDialog", kind: "ModalDialog", layoutKind: "VFlexLayout",
      caption: $L("Edit"), scrim: true, components :[
      {name: "viewScroller", kind: "Scroller", flex: 1, height: 
        Helper.dialogHeight(), style: "margin: 10px;", components: [ 
        {kind: "HFlexBox", components: [
          {content: $L("name") + ": ", style: "padding:10px 5px;", width: "100px", 
            className: "editlabel"},
            {name: "elname", kind: "Input", flex: 1, hint: $L("name")}
        ]},
        {kind: "HFlexBox", components: [
          {content: $L("language") + ": ", style: "padding:10px 5px;", width: "100px", 
            className: "editlabel"},
            {name: "language", kind: "Input", flex: 1, hint: $L("language")}          
        ]},
        {kind: "Divider", caption: $L("parts")},
        {kind: "HFlexBox", components: [
          {name: "part1", kind: "Input", flex: 1, hint: $L("part")},
          {name: "addPartsButton", kind: "IconButton", icon: "images/add.png", 
            onclick: "addPart"},
        ]},
        {name: "text1", className: "preview"},
        {name: "parts", kind: "VFlexBox"},
        {kind: "Divider", caption: ""},
        {kind: "HFlexBox", pack: "end", components: [
        {kind: "Button", className: "enyo-button-negative", 
          caption: $L("Delete Element"), onclick: "deleteElement"},
          
        ]}
      ]},
      {kind: "HFlexBox", pack: "center", components: [
        {kind: "Button", caption: $L("Close"), width: "150px",
          onclick: "closeEdit"}
      ]}
    ]}
  ],
  
  create: function() {
    this.inherited(arguments);
  },
  
  lyricsChanged: function() {
    this.$.lyric.destroyComponents();
    var button = [];
    for (i in this.lyrics) {
      this.$.lyric.createComponent(
        {name: i, kind: "RowGroup",
        caption: $L(i.charAt(0)) + " " + i.substring(1, i.length),
        components: [{name: i+"text", kind: "RichText", owner: this, 
          value: this.lyrics[i], onkeypress: "handleKeyPress", components: [
          {name: "eB"+i, kind: "IconButton", icon: "images/edit.png",
            onclick: "openEdit", owner: this}
          ]}
        ]}
      );
      button.push(i);
    }
    this.owner.$.metaPane.setButton(button);
    this.$.lyric.render();
  },
  
  toggleAdd: function() {
    this.add = this.$.adder.getValue();
  },
  
  addNew: function() {
    this.saveModifications();
    var e = [];
    for (i in this.lyrics) {
      if (this.add === i.charAt(0)) {
        e.push(i)
      }
    }
    if (!e.length) {
      var z = "";
    } else if (e.slice(-1)[0].length === 1) {
      var z = 1;
    } else {
      var z = parseInt(e.slice(-1)[0].substring(1, e.slice(-1)[0].length))+1;
    }
    //~ enyo.log(this.add + z);
    this.lyrics[this.add + z] = "";
    this.setLyrics(this.lyrics);
  },
  
  openEdit: function(inSender) {
    enyo.log(inSender.name.replace("eB", ""));
    this.$.editDialog.openAtCenter();
    var i = inSender.name.replace("eB", "");
    this.$.editDialog.setCaption($L("Edit") + " " + $L(i.charAt(0)) + " " + i.substring(1, i.length));
    this.setElement(this.element);
  },
  
  // Edit Dialog
  addPart: function() {
    enyo.log(this.parts);
    var num = this.parts.slice(-1)[0]+1;
    enyo.log("add part " + num);
    this.$.parts.createComponents(
      [{name: "box" + num, kind: "HFlexBox", components: [
        {name: "part" + num, kind: "Input", flex: 1, hint: $L("part")},
        {name: "delPB" + num, kind: "IconButton", icon: "images/remove.png",
          className: "enyo-button-negative", onclick: "delPart"},
      ]},
      {name: "text" + num, className: "preview"}], {owner: this}
    );
    this.$.parts.render();
  },
  
  delPart: function(inSender) {
    enyo.log(inSender.name.replace("delPB", ""));
  },
  
  elementChanged: function() {
    this.parts = [1];
    for (i in this.element) {
      if (i === "lines") {
        this.$.parts.destroyControls();
        for (j=0; j < this.element[i].length; j++) {
          if (j>0) { this.addPart();}
          this.$["part"+(j+1)].setValue(this.element[i][j].part);
          this.$["text"+(j+1)].setContent(this.element[i][j].text);
        }
      } else {
        this.$[i].setValue(this.element[i]);
      }
    }
  },
  
  deleteElement: function() {
    enyo.log("delete " + this.element.elname);
    this.$.editDialog.close();
  },
  
  getData: function() {
    var data = {
      elname: this.$.elname.getValue(),
      language: this.$.language.getValue(),
      lines: []
    };
    for (i = 1; i < this.parts+1; i++) {
      data.lines.push({part: this.$["part"+i].getValue(), text: this.$["text"+i].getContent()});
    }
    enyo.log(data);
  },
  
  closeEdit: function() {
    this.getData();
    this.$.editDialog.close();
  },

  // Add '<br>' instead of creating a new div  
  handleKeyPress: function(inSender, inEvent) {
    if (inEvent.keyCode===13 && !inEvent.shiftKey) {
      inEvent.preventDefault();
      inSender.insertAtCursor("<br/>");
    }
  },
  
  saveModifications: function() {
    for (i in this.lyrics) {
      this.lyrics[i] = this.$[i+"text"].getValue();
      //~ enyo.log(this.$[i+"text"].getValue());
    }
    this.owner.setLyrics(this.lyrics);
  }
});
