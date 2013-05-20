enyo.kind({
  kind: "ModalDialog",
  name: "InfoDialog",
  caption: $L("Song Info"),
  scrim: true,
  onBack: "cancelClicked",
  components: [ 
    {name: "viewScroller", kind: "Scroller", flex: 1, height: 
      Helper.dialogHeight(), components: [ 
      {name: "copyboxdiv", kind: "Divider", caption: $L("Copyright"),
        showing: false},
      {name: "copybox", kind: "VFlexBox"},
      {name: "authorboxdiv", kind: "Divider", caption: $L("Author(s)"),
        showing: false},
      {name: "authorbox", kind: "VFlexBox"},
      {name: "songboxdiv", kind: "Divider", caption: $L("Song"),
        showing: false},
      {name: "songbox", kind: "VFlexBox"},
      {name: "commentboxdiv", kind: "Divider", caption: $L("Comments"),
        showing: false},
      {name: "commentbox", kind: "VFlexBox"}
    ]},
    {kind: "HFlexBox", pack: "center", components: [
      {kind : "Button", flex: 0, caption : $L("Close"), width: "150px", onclick : "cancelClicked"}
    ]}
  ],
  
  // ADD: Themes?
  
  destroy: function() {
    this.$.copybox.destroyComponents();
    this.$.authorbox.destroyComponents();
    this.$.songbox.destroyComponents();
    this.$.commentbox.destroyComponents();
    this.$.copyboxdiv.hide();
    this.$.authorboxdiv.hide();
    this.$.songboxdiv.hide();
    this.$.commentboxdiv.hide();
  },

  addDiv: function(box, cap, extra) {
    if (cap) {
      this.$[box + "div"].show();
      b = this.$[box];
      b.createComponent({
        className: "about",
        content: extra + $L(cap)
      });
    }
  },

  infoset: function(data) {
    if (data.released) {
      this.addDiv("copybox", data.released + ":", "&copy; ");
    }
    this.addDiv("copybox", data.copyright, "");
    if (data.publisher !== data.copyright) {
      this.addDiv("copybox", data.publisher, "");
    }
    var authors = ParseXml.authorsToString(data.authors);
    for(i = 0; i < authors.length; i++) {
      this.addDiv("authorbox", authors[i], "");
    };
    for(j = 0; j < data.songbooks.length; j++) {
      if (data.songbooks[j].no) {
        this.addDiv("songbox", data.songbooks[j].book + ': ' + 
          data.songbooks[j].no, "");
      } else {
        this.addDiv("songbox", data.songbooks[j].book, "");
      }
    }
    this.addDiv("songbox", data.key, $L("key: "));
    if (!isNaN(data.tempo)) {
      this.addDiv("songbox", data.tempo, $L("tempo") + " (bpm): ");
    } else {
      this.addDiv("songbox", data.tempo, $L("tempo") + ": ");
    }
    this.addDiv("songbox", data.duration, $L("duration") + ": ");
    this.addDiv("songbox", data.ccli, "CCLI: ");
    for (k = 0, l = data.comments.length; k < l; k++) {
      this.addDiv("commentbox", data.comments[k], "");
    }
  },
  
  cancelClicked: function(sender) {
    this.close();
  }
});
