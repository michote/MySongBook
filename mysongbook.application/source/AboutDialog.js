enyo.kind({
  name: "AboutDialog",
  kind: "ModalDialog",
  layoutKind:"VFlexLayout",
  caption : $L("About"),
  scrim: true,
  onBack: "closeClicked",
  components :[ 
    {kind: "VFlexBox", pack: "start", components : [
      {className: "about", content: "<b>MySongBook &ndash; v. "
       + enyo.fetchAppInfo().version + "</b>", style: "color: #9E0508;"},
      {className: "about", content: "&copy; 2012 " + 
        "<a href='mailto:reischuck.micha@googlemail.com'>Micha Reischuck</a><br>"
        + 'License: <a href="http://opensource.org/licenses/mit-license.php">MIT</a>',
        onLinkClick: "linkClicked"},
    ]},
    {kind: "HFlexBox", pack: "center", components: [
      {kind: "Image", src: "images/icon128.png"},
    ]},
    {kind: "HFlexBox", pack: "center", components: [
      {kind: "Button", flex: 0, caption : $L("Close"), width: "150px", 
        onclick: "closeClicked"}
    ]}
  ],
  
  linkClicked: function (inSender, inUrl) {
    if (window.PalmSystem) {
      this.owner.$.AppManService.call({target: inUrl});
    } else {
      window.open(inUrl, '_blank');
      window.focus();
    }
  },
  
  closeClicked: function(sender) {
    this.close();
  }
});
