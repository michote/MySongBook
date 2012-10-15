enyo.kind({
  name: "ListDialog",
  kind: enyo.ModalDialog,
  layoutKind:"VFlexLayout",
  caption : $L("Manage Lists"),
  events: {
    onSelect: "",
    onListRm: ""
  },
  components :[ 
    // ListDialog
    {name: "customListList",kind: "VirtualList", flex: 1, height: Helper.dialogHeight(), onSetupRow: "getCustomLists", 
      onclick: "doSelect", components: [
        {name: "listListItem", kind: enyo.SwipeableItem, onConfirm: "doListRm",
            confirmCaption: $L("Delete"), cancelCaption: $L("Cancel "), 
            layout: enyo.HFlexBox, components: [
          {name: "listListTitle", className: "songlisttitle", content: ""},
      ]}
    ]},
    {kind: "HFlexBox", pack: "center", components : [
      {name: "addButton", kind: "IconButton", icon: "images/add.png", 
        onclick: "addList"},
      {kind: "Spacer"},
      {kind: "Button", className: "enyo-button-negative", flex: 1, 
        caption: $L("Cancel"), onclick: "cancelClicked"},
    ]},
    
    // newListDialog
    {name: "newListDialog", kind: enyo.ModalDialog, layoutKind: "VFlexLayout",
      caption: $L("New List"), components :[
        {name: "errorContent", kind: "HtmlContent", 
          style: "color: #9E0508; margin: 0 10px", content: ""},
        {kind: "RowGroup", caption: $L("Listname"), components: [
          {name: "listName", kind: "Input", hint: $L("Enter listname"), flex: 1}
        ]},
        {kind: "HFlexBox", pack: "center", components : [
          {kind: "Button", className: "enyo-button-negative", flex: 1, 
            caption: $L("Cancel"), onclick: "cancelClicked2"},
          {kind: "Button", className: "enyo-button-affirmative", flex: 1, 
            caption: $L("Save"), onclick: "saveClicked"}
        ]}
      ]
    }
  ],
  
  // populate list
  getCustomLists: function(inSender, inIndex) {
    if (this.owner.savedLists) {
      var r = this.owner.savedLists[inIndex];
    };
    if (r) {
      this.$.listListTitle.setContent(r.title);
      return true;
    }
  },
  
  addList: function() {
    this.$.newListDialog.openAtCenter();
    this.$.listName.forceFocus();
  },
  
  cancelClicked: function() {
    this.owner.$.scrim.hide();
    this.close();
  },
  
  // newListDialog
  clearDialog: function() {
    this.$.listName.setValue("");
    this.$.errorContent.setContent("");
    this.$.newListDialog.close();
  },
  
  cancelClicked2: function() {
    this.clearDialog();
  },
  
  saveClicked: function(s) {
    if (this.$.listName.getValue() !== "") { 
      for (i in this.owner.savedLists) {
        if (this.owner.savedLists[i].title === this.$.listName.getValue()) {
          enyo.log(this.$.listName.getValue());
          this.$.errorContent.setContent($L("Name already exist"));
          return
        };
      };
      this.owner.savedLists.push({"title": this.$.listName.getValue(),
        "content": []});
      if (!this.owner.customList) {
        this.owner.customList = {"title": this.$.listName.getValue(),
          "content": []};
      };
      this.$.customListList.refresh();
      this.$.listName.setValue("");
      this.clearDialog();
    } else {
      this.$.errorContent.setContent($L("Name is empty"));
      return
    };
  }
  
});
