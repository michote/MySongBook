enyo.kind({
  name: "EditLyrics",
  kind: enyo.VFlexBox,
  published: {
    lyrics: {},
    add: "v"
    },
  components: [
    {name: "addBar", kind: "Toolbar", className: "searchbar",
      components: [
      {kind: "HtmlContent", className: "copy title", content: $L("add new")},
      {name: "adder", kind: "ListSelector", value: "v", onChange:"toggleAdd", hideArrow: false,
        className: "enyo-picker-button custom-picker", items: [
        {caption: $L("verse"), value: "v"},
        {caption: $L("chorus"), value: "c"},
        {caption: $L("bridge"), value: "b"},
        {caption: $L("pre-chorus"), value: "p"},
        {caption: $L("ending"), value: "e"},
      ]},
      {name: "addButton", kind: "IconButton", icon: "images/add.png", 
        onclick: "addNew"},
    ]},
    {kind: "Scroller", flex: 1, components: [
      {name: "lyric", kind:"VFlexBox", className:"box-center"}
    ]},
  ],
  
  create: function() {
    this.inherited(arguments);
  },
  
  lyricsChanged: function() {
    this.$.lyric.destroyComponents();
    for (i in this.lyrics) {
      this.$.lyric.createComponent({
        name: i,
        kind: "RowGroup",
        caption: $L(i.charAt(0)) + " " + i.substring(1, i.length),
        components: [{name: i+"text", kind: "RichText", value: this.lyrics[i]}]
      });
    };
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
      };
    };
    if (!e.length) {
      var z = "";
    } else if (e.slice(-1)[0].length === 1) {
      var z = 1;
    } else {
      var z = parseInt(e.slice(-1)[0].substring(1, e.slice(-1)[0].length))+1;
    }
    enyo.log(this.add + z);
    this.lyrics[this.add + z] = "";
    this.setLyrics(this.lyrics);
  },
  
  saveModifications: function() {
    for (i in this.lyrics) {
      this.lyrics[i] = this.$.lyric.$[i+"text"].getValue();
      enyo.log(this.$.lyric.$[i+"text"].getValue());
    };
    this.owner.setLyrics(this.lyrics);
  }
  
  //~ : function() {
    //~ 
  //~ }
});
