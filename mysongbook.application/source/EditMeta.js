enyo.kind({
  name: "EditMeta",
  kind: enyo.VFlexBox,
  published: {
    metadata: {},
    add: "title"
    },
  components: [
    {name: "addBar", kind: "Toolbar", className: "searchbar",
      components: [
      {kind: "HtmlContent", className: "copy title", content: $L("add new")},
      {kind: "ListSelector", value: "title", onChange:"toggleAdd", hideArrow: false,
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
        {kind: "RowGroup", caption: $L("Title"), components:[
          {name: "title", kind: "RichText", hint: "title", value: ""}
        ]},
        {kind: "RowGroup", caption: $L("Author"), components:[
          {kind: "Item", tapHighlight: false, layoutKind: "HFlexLayout", 
            components: [
            {name: "author", flex: 1, kind: "RichText", hint: "author", value: "", 
            components: [
              {name:"toolbarSwitch", kind: "ListSelector", value: "all",
                onChange:"onchange_toolbarSwitch", hideArrow: false, items: [
                {caption: $L("all"), value:"all"},
                {caption: $L("music"), value:"music"},
                {caption: $L("translation"), value:"translation"},
              ]}
            ]}
          ]},
        ]},
        {kind: "RowGroup", caption: $L("copyright"), components:[
          {kind:"HFlexBox", flex: 1, style: "padding:0; margin:-10px;", components:[
            {name: "released", kind: "RichText", width: "20%", hint: "releasedate", value: ""},
            {name: "copyright", flex: 1, kind: "RichText", hint: "copyright holder", value: ""}
          ]},
          {name: "publisher", kind: "RichText", hint: "pulisher", value: ""}
        ]},
        {kind: "RowGroup", caption: $L("infos"), components:[
          {kind:"HFlexBox", flex: 1, style: "padding:0; margin:-10px;", components:[
            {name: "key", kind: "RichText", width: "33%", hint: "key", value: ""},
            {name: "tempo", kind: "RichText", width: "34%", hint: "tempo", value: ""},
            {name: "transposition", kind: "RichText", width: "33%", hint: "transposition", value: ""},
          ]},
          {name: "verseorder", flex: 1, kind: "RichText", hint: "verseorder", value: ""}, // Add buttons here
          {name: "songbook1", flex: 1, kind: "RichText", hint: "songbook", value: ""}, 
        ]}
      ]}
    ]},
  ],
  
  create: function() {
    this.inherited(arguments);
  },
  
  toggleAdd: function() {
    this.add = this.$.adder.getValue();
  },
  
  addNew: function() {
    
  },
  
  saveModifications: function() {
    for (i in this.metadata) {
      //~ this.metadata[i] = this.$.metadata.$[i].getValue();
      enyo.log(this.$.metadata.$[i].getValue());
    };
    this.owner.setMetadata(this.metadata);
  }
  
});
