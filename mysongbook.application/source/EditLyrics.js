enyo.kind({
  name: "EditLyrics",
  kind: enyo.VFlexBox,
  add: "v",
  parts: [1],
  published: {
    lyrics: {},
    element: undefined
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
          {name: "editpart1", kind: "Input", flex: 1, hint: $L("part")},
          {name: "addPartsButton", kind: "IconButton", icon: "images/add.png", 
            onclick: "addPart"},
        ]},
        {name: "edittext1", className: "preview"},
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
    this.$.lyric.destroyControls();
    var button = [];
    for (i in this.lyrics) { // verses
      var cap = $L(this.lyrics[i].elname.charAt(0)) + " " 
        + this.lyrics[i].elname.substring(1, this.lyrics[i].elname.length);
      if (this.lyrics[i].language) {
        cap = cap + ' (' + this.lyrics[i].language + ')'
      }
      this.$.lyric.createComponent(
        {name: i, kind: "RowGroup", style: "position: relative;",
        caption: cap, owner: this, components: [
          {name: "eB"+i, kind: "IconButton", icon: "images/edit.png",
            onclick: "openEdit", owner: this, className: "editbutton"},
        ]}
      );
      for (j in this.lyrics[i].lines) {  // lines
        if (this.lyrics[i].lines[j].part) {
          this.$[i].createComponent(
            {style: "color: #9E0508", owner: this, content: this.lyrics[i].lines[j].part}
          );
        }
        this.$[i].createComponent(
          {name: i+"text"+j, kind: "RichText", owner: this, 
          value: this.lyrics[i].lines[j].text, onkeypress: "handleKeyPress"}
        );
      }
      button.push(this.lyrics[i].elname); 
    }
    button = Helper.removeDoubles(button);
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
    this.lyrics[this.add+z] = {
      elname: this.add+z, 
      language: null, 
      lines:[{"part":"","text":""}]
      };
    this.setLyrics(this.lyrics);
  },
  
  saveModifications: function() {
    for (i in this.lyrics) {
      for (j in this.lyrics[i].lines) {
        var l = JSON.stringify(this.$[i+"text"+j].getText().replace(/\n/g,'<br>'));
        l = l.substring(1,l.length-1).replace(/\\/g, '');
        this.lyrics[i].lines[j].text = l;
      }
    }
    this.owner.setLyrics(this.lyrics);
  },
  
  // ### Edit Dialog ###
  openEdit: function(inSender) {
    this.saveModifications();
    this.$.editDialog.openAtCenter();
    var i = inSender.name.replace("eB", "");
    this.setElement(this.lyrics[i]);
    this.el = i;
    this.$.editDialog.setCaption($L("Edit") + " " + $L(i.charAt(0)) + " " + i.substring(1, i.length));
  },
  
  elementChanged: function() {
    this.parts = [1];
    for (i in this.element) {
      if (i === "lines") {
        this.$.parts.destroyControls();
        for (j=0; j < this.element[i].length; j++) {
          if (j>0) { this.addPart("init");}
          this.$["editpart"+(j+1)].setValue(this.element[i][j].part);
          this.$["edittext"+(j+1)].setContent(this.element[i][j].text);
        }
      } else {
        this.$[i].setValue(this.element[i]);
      }
    }
  },
  
  addPart: function(i) {
    var num = this.parts.slice(-1)[0]+1;
    this.$.parts.createComponents(
      [{name: "box" + num, kind: "HFlexBox", components: [
        {name: "editpart" + num, kind: "Input", flex: 1, hint: $L("part")},
        {name: "delPB" + num, kind: "IconButton", icon: "images/remove.png",
          className: "enyo-button-negative", onclick: "delPart"},
      ]},
      {name: "edittext" + num, className: "preview"}], {owner: this}
    );
    if (i !== "init") { // if add button used 
      this.element.lines.push({"part": "", "text": ""});
    }
    this.parts.push(num);
    this.$.parts.render();
  },
  
  delPart: function(inSender) {
    var y = parseInt(inSender.name.replace("delPB", ""));
    for (x in this.parts) {
      if (this.parts[x] === y) {
        this.parts.splice(x,1);
        this.$["box"+y].destroy();
        this.$["edittext"+y].destroy();
        this.$.parts.render();
      }
    }
  },
  
  deleteElement: function() {
    delete this.lyrics[this.el];
    this.setLyrics(this.lyrics);
    this.$.editDialog.close();
  },
  
  getData: function() {
    var data = {
      elname: this.$.elname.getValue(),
      language: this.$.language.getValue(),
      lines: []
    };
    for (i in this.parts) {
      data.lines.push({part: this.$["editpart"+this.parts[i]].getValue(),
        text: this.element.lines[this.parts[i]-1].text});
    }
    return data;
  },
  
  closeEdit: function() {
    var el = this.getData();
    var id = el.elname;
    if (el.language) {
      id = id + "_" + el.language;
    }
    this.setLyrics(Helper.insertSame(this.lyrics, id, el, this.el));
    this.$.editDialog.close();
  },
});
