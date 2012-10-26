enyo.kind({
  name: "EditMeta",
  kind: enyo.VFlexBox,
  single: ["released", "copyright", "publisher", "key", "tempo", 
    "transposition", "verseOrder", "duration"],
  add: "title",
  titleCount: 1,
  authorCount: 1,
  songbookCount: 1,
  published: {
    metadata: {},
    button: []
  },
  components: [
    {name: "addBar", kind: "Toolbar", className: "searchbar",
      components: [
      {kind: "HtmlContent", className: "copy title", content: $L("add new")},
      {name: "adder", kind: "ListSelector", value: "title", onChange:"toggleAdd",
        className: "enyo-picker-button custom-picker", items: [
        {caption: $L("title"), value: "title"},
        {caption: $L("author"), value: "author"},
        {caption: $L("songbook"), value: "songbook"}
      ]},
      {name: "addButton", kind: "IconButton", icon: "images/add.png", 
        onclick: "addNew"},
    ]},
    {kind: "Scroller", flex: 1, components: [
      {kind:"VFlexBox", className:"box-center", components:[
        {name: "titlebox", kind: "RowGroup", caption: $L("title"), components:[
          {name: "titlehflex1", kind:"HFlexBox", flex: 1, 
            style: "padding:0; margin:-10px;", components:[
            {name: "title1", flex: 1, kind: "Input", hint: $L("title")},
            {name: "titlelang1", kind: "Input", width: "12%", hint: ""}
          ]}
        ]},
        {name: "authorbox", kind: "RowGroup", caption: $L("author"), components:[
          {name: "authorhflex1", kind:"HFlexBox", flex: 1, 
            style: "padding:0; margin:-10px;", components:[
            {name: "author1", flex: 1, kind: "Input", hint: $L("author"), 
              components: [
              {name:"authorSwitch1", kind: "ListSelector", value: null, 
                style: "padding:0; margin:-10px 0;",
                onChange:"onchange_author", items: [
                {caption: $L(""), value: null},
                {caption: $L("words"), value:"words"},
                {caption: $L("music"), value:"music"},
                {caption: $L("translation"), value:"translation"},
              ]}
            ]},
            {name: "authorlang1", kind: "Input", width: "10%", hint: "",
              showing: false}
          ]},
        ]},
        {kind: "RowGroup", caption: $L("copyright"), components:[
          {kind:"HFlexBox", flex: 1, style: "padding:0; margin:-10px;", components:[
            {content: $L("release date") + ":", style: "padding:5px;", width: "12%", 
              className: "editlabel"},
            {name: "released", kind: "Input", width: "20%", hint: $L("release date")},
            {content: $L("copyright holder") + ":", style: "padding:5px;", width: "12%", 
              className: "editlabel"},
            {name: "copyright", flex: 1, kind: "Input", hint: $L("copyright holder")}
          ]},
          {kind:"HFlexBox", flex: 1, style: "padding:0; margin:-10px;", components:[
            {content: $L("pulisher") + ":", style: "padding: 10px 5px;", width: "15%", 
              className: "editlabel"},
            {name: "publisher", kind: "Input", hint: $L("pulisher"), flex: 1}
          ]},
        ]},
        {name: "songbookbox", kind: "RowGroup", caption: $L("infos"), components:[
          {kind:"HFlexBox", flex: 1, style: "padding:0; margin:-10px;", components:[
            {content: $L("key") + ":", style: "padding:10px 5px;", width: "10%", 
              className: "editlabel"},
            {name: "key", kind: "Input", flex: 1, hint: $L("key")},
            {content: $L("transposition") + ":", style: "padding:10px 5px;", width: "20%", 
              className: "editlabel"},
            {name: "transposition", kind: "Input", flex: 1, hint: $L("transposition")},
          ]},
          {kind:"HFlexBox", flex: 1, style: "padding:0; margin:-10px;", components:[
            {content: $L("tempo") + ":", style: "padding:10px 5px;", width: "10%", 
              className: "editlabel"},
            {name: "tempo", kind: "Input", flex: 1, hint: $L("tempo")},
            {content: $L("duration") + ":", style: "padding:10px 5px;", width: "20%", 
              className: "editlabel"},
            {name: "duration", kind: "Input", flex: 1, hint: $L("duration")},
          ]},
          {kind:"HFlexBox", flex: 1, style: "padding:0; margin:-10px;", 
            components:[
            {content: $L("verseorder") + ":", style: "padding: 10px 5px;", width: "15%", 
              className: "editlabel"},
            {name: "verseOrder", flex: 1, kind: "Input", hint: $L("verseorder")},
            {name: "versehflex", kind:"HFlexBox", style: "padding:0; margin:0px;"},
          ]},
          {name: "songbookhflex1", kind:"HFlexBox", flex: 1, style: 
            "padding:0; margin:-10px;", components:[
            {content: $L("songbook") + ":", style: "padding:10px 5px;", width: "15%", 
              className: "editlabel"},
            {name: "songbook1", flex: 1, kind: "Input", hint: $L("songbook")}, 
            {content: $L("no.") + ":", style: "padding:10px 5px;", width: "5%", 
              className: "editlabel"},
            {name: "no1", kind: "Input", width: "15%", hint: $L("number")}
          ]},
        ]}
      ]}
    ]},
  ],
  
  create: function() {
    this.inherited(arguments);
  },
  
  // Adding new fields
  toggleAdd: function() {
    this.add = this.$.adder.getValue();
  },
  
  addNew: function() {
    this["add" + this.add.charAt(0).toUpperCase() 
      + this.add.slice(1)]();
  },
  
  addTitle: function() {
    this.titleCount += 1;
    this.$.titlebox.createComponent(
      {name: "titlehflex" + this.titleCount, kind:"HFlexBox", flex: 1, 
        style: "padding:0; margin:-10px;", owner: this, components:[
        {name: "title" + this.titleCount, flex: 1, kind: "Input", 
          hint: "title", owner: this},
        {name: "titlelang" + this.titleCount, kind: "Input", width: "12%",
          hint: "", owner: this}
      ]}
    );
    this.$.titlebox.render();
  },
  
  addAuthor: function() {
    this.authorCount += 1;
    this.$.authorbox.createComponent(
      {name: "authorhflex" + this.authorCount, kind:"HFlexBox", flex: 1,
        style: "padding:0; margin:-10px;", owner: this,  components:[
        {name: "author" + this.authorCount, owner: this, flex: 1, 
          kind: "Input", hint: "author", components: [
          {name:"authorSwitch" + this.authorCount, owner: this, 
            kind: "ListSelector", style: "padding:0; margin:-10px 0;", 
            value: null, onChange: "onchange_author", items: [
            {caption: $L(""), value: null},
            {caption: $L("words"), value:"words"},
            {caption: $L("music"), value:"music"},
            {caption: $L("translation"), value:"translation"},
          ]}
        ]},
        {name: "authorlang"+this.authorCount, kind: "Input", width: "10%", hint: "",
          showing: false, owner: this}
      ]}
    );
    this.$.authorbox.render();
  },
  
  onchange_author: function(inSender, inValue) {
    var num = inSender.name.charAt(inSender.name.length-1)
    if (inValue === "translation") {
      this.$["authorlang"+num].show();
    } else {
      this.$["authorlang"+num].hide();
    };
    this.$["authorlang"+num].render();
  },
  
  addSongbook: function() {
    this.songbookCount += 1;
    this.$.songbookbox.createComponent(
      {name: "songbookhflex" + this.songbookCount, kind: "HFlexBox", flex: 1,
        style: "padding:0; margin:-10px;", owner: this, components: [
        {content: $L("songbook") + ":", style: "padding:10px 5px;",
          width: "15%", className: "editlabel"},
        {name: "songbook" + this.songbookCount, flex: 1, kind: "Input",
          hint: "songbook", owner: this},
        {content: $L("no.") + ":", style: "padding:10px 5px;", width: "5%",
          className: "editlabel"},
        {name: "no" + this.songbookCount, kind: "Input", width: "15%", 
          hint: $L("number"), owner: this}
      ]}
    );
    this.$.songbookbox.render();
  },
  
  // Add existing data to UI
  metadataChanged: function() {
    this.clear();
    for (i in this.single) {
      if (this.metadata[this.single[i]]) {
        this.$[this.single[i]].setValue(this.metadata[this.single[i]]);
      } else {
        this.$[this.single[i]].setValue("");
      };
    };
    // Titles
    var l = this.metadata.titles.length + 1;
    for (i=1; i < l; i++) {
      if (i>1) { this.addTitle() };
      this.$["title" + i].setValue(this.metadata.titles[i-1].title);
      if (this.metadata.titles[i-1].lang) {
        this.$["titlelang" + i].setValue(this.metadata.titles[i-1].lang);
      } else {
        this.$["titlelang" + i].setValue("");
      };
    };
    // Authors
    if (this.metadata.authors) {
      l = this.metadata.authors.length + 1;
      for (i=1; i < l; i++) {
        if (i>1) { this.addAuthor() };
        this.$["author" + i].setValue(this.metadata.authors[i-1].author);
        if (this.metadata.authors[i-1].type) {
          this.$["authorSwitch" + i].setValue(this.metadata.authors[i-1].type);
          if (this.metadata.authors[i-1].type === "translation") {
            this.onchange_author({name: "x"+i}, "translation");
            this.$["authorlang" + i].setValue(this.metadata.authors[i-1].lang);
          };
        };
      };
    };
    // Songbooks
    if (this.metadata.songbooks) {
      l = this.metadata.songbooks.length + 1;
      for (i=1; i < l; i++) {
        if (i>1) { this.addSongbook() };
          this.$["songbook" + i].setValue(this.metadata.songbooks[i-1].book);
          if (this.metadata.songbooks[i-1].no) {
            this.$["no" + i].setValue(this.metadata.songbooks[i-1].no);
          } else {
            this.$["no" + i].setValue("");
          };
      };
    };
  },
  
  buttonChanged: function() {
    this.$.versehflex.destroyControls();
    for (i in this.button) {
      //~ enyo.log(this.button[i]);
      this.$.versehflex.createComponent(
        {name: this.button[i], kind: "Button", caption: this.button[i], 
          owner: this, height: "22px", onclick: "verseButton"}
      );
    };
    this.$.versehflex.render();
  },
  
  verseButton: function(inSender) {
    var index = this.$.verseOrder.getSelection().start;
    var text = this.$.verseOrder.getValue();
    // calculate whitespaces
    var x = text.charAt(index-1)
    if (index===0 || x===' ') {
      var a = '';
    } else {
      var a = ' ';
    };
    var y = text.charAt(index)
    if (y===' ' || index===text.length) {
      var b = '';
    } else {
      var b = ' ';
    };    
    this.$.verseOrder.setValue(text.substring(0, index) + a + inSender.name + b
      + text.substring(index, text.length));

  },
  
  // Remove extra fields
  clear: function() { // remove added stuff
    for (j=2; j < this.titleCount+1; j++) {
      this.$["titlehflex"+j].destroy();
    };
    this.titleCount = 1;
    for (j=2; j < this.authorCount+1; j++) {
      this.$["authorhflex"+j].destroy();
    };
    this.authorCount = 1;
    this.$.author1.setValue("");
    this.$.authorSwitch1.setValue(null);
    for (j=2; j < this.songbookCount+1; j++) {
      this.$["songbookhflex"+j].destroy();
    };
    this.songbookCount = 1;
    this.$.songbook1.setValue("");
    this.$.no1.setValue("");
  },
  
  // get all data from UI
  getAllFields: function() {
    for (i in this.single) {
      if (this.$[this.single[i]].getValue()) {
        this.metadata[this.single[i]] = 
        this.$[this.single[i]].getValue();
      };
    };
    
    // Titles
    var titles = [];
    for (i=1; i < this.titleCount+1; i++) {
      if (this.$["title" + i].getValue()) {
        if (this.$["titlelang" + i].getValue()) {
          titles.push({"title": this.$["title" + i].getValue(), 
            "lang": this.$["titlelang" + i].getValue()});
        } else {
          titles.push({"title": this.$["title" + i].getValue(), 
            "lang": null});
        };
      };
    };
    this.metadata.titles = titles;
    
    // Authors
    var names = [];
    for (i=1; i < this.authorCount+1; i++) {
      if (this.$["author" + i].getValue()) {
        var t = this.$["authorSwitch" + i].getValue();
        if (t === "translation") {
          names.push({"type":t, "author": this.$["author" + i].getValue(), 
            "lang": this.$["authorlang" + i].getValue()});
        } else {
          names.push({"type":t, "author": this.$["author" + i].getValue()});
        };
      };
    };
    this.metadata.authors = names;
    
    // Songbooks
    var books = [];
    for (i=1; i < this.songbookCount+1; i++) {
      if (this.$["songbook" + i].getValue()) {
        if (this.$["no" + i].getValue()) {
          books.push({"book": this.$["songbook" + i].getValue(),
          "no": this.$["no" + i].getValue()});
        } else {
          books.push({"book": this.$["songbook" + i].getValue(),
          "no": null});
        };
      };
    };
    this.metadata.songbooks = books;
    
    return true;
  },
  
  saveModifications: function() {
    this.getAllFields();
    this.owner.setMetadata(this.metadata);
  }
  
});
