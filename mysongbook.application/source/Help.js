enyo.kind({
  name: "Help",
  kind: "HtmlContent",
  className: "lyric",
  components: [
    {kind: "VFlexBox", components: [
      {kind: "HtmlContent", content: "&nbsp;<br>"},
      {kind: "HtmlContent", content: "<h1>" + $L("Welcome to MySongBook") + "</h1>"},
      {kind: "HtmlContent", content: $L("MySongBook is an App to display Songs in ") +  
        "<img src='images/openlyrics.png' style='display:inline;margin:-5px 0;'>" 
        + "<a href='http://openlyrics.info/'> OpenLyrics XML Standard</a>" +
        $L(" from the internal storage of your device.") + "<br>" + 
        $L(" You can create custom lists of songs to display.") + "<br><br>",
        onLinkClick: "linkClicked"},
      {kind: "HtmlContent", content: "<h2>" + $L("Icon Guide") + "</h2>"},
      
      {kind: "HtmlContent", content: "<h3>" + $L("Main View") + "</h3>"},
      {kind: "HFlexBox", components: [
        {kind: "Image", src: "images/minus-help.png"},
        {kind: "Image", src: "images/plus-help.png"},
        {kind: "HtmlContent", content: $L("Transposer")}
      ]},
      {kind: "HFlexBox", components: [
        {kind: "Image", src: "images/lock-open-help.png"},
        {kind: "HtmlContent", content: $L("prevents the screen from dimming or turning off")}
      ]},
      {kind: "HFlexBox", components: [
        {kind: "Image", src: "images/font-help.png"},
        {kind: "HtmlContent", content: $L("change fontsize and linespacing") + "<br><br>"}
      ]},
      {kind: "HFlexBox", components: [
        {kind: "Image", src: "images/back-help.png"},
        {kind: "HtmlContent", content: $L("scrolls lyrics back depending on verseorder")}
      ]},
      {kind: "HFlexBox", components: [
        {kind: "Image", src: "images/forth-help.png"},
        {kind: "HtmlContent", content: $L("scrolls lyrics forth depending on verseorder")}
      ]},
      {kind: "HFlexBox", components: [
        {kind: "Image", src: "images/play-help.png"},
        {kind: "HtmlContent", content: $L("start autoscroll")}
      ]},
      {kind: "HFlexBox", components: [
        {kind: "Image", src: "images/pause-help.png"},
        {kind: "HtmlContent", content: $L("pause autoscroll")}
      ]},
      {kind: "HFlexBox", components: [
        {kind: "Image", src: "images/edit-help.png"},
        {kind: "HtmlContent", content: $L("edit current song")}
      ]},
      {kind: "HFlexBox", components: [
        {kind: "Image", src: "images/info-help.png"},
        {kind: "HtmlContent", content: $L("shows songinfo") + "<br><br>"}
      ]},
      
      {kind: "HtmlContent", content: "<h3>" + $L("List Pane") + "</h3>"},
      {kind: "HFlexBox", components: [
        {kind: "Image", src: "images/search-help.png"},
        {kind: "HtmlContent", content: $L("opens and closes searchwindow")}
      ]},
      {kind: "HFlexBox", components: [
        {kind: "Image", src: "images/title-help.png"},
        {kind: "HtmlContent", content: $L("searches in titles")}
      ]},
      {kind: "HFlexBox", components: [
        {kind: "Image", src: "images/author-help.png"},
        {kind: "HtmlContent", content: $L("searches in authors")}
      ]},
      {kind: "HFlexBox", components: [
        {kind: "Image", src: "images/lyrics-help.png"},
        {kind: "HtmlContent", content: $L("searches in lyrics") + "<br><br>"}
      ]},
      
      {kind: "HFlexBox", components: [
        {kind: "Image", src: "images/open-help.png"},
        {kind: "HtmlContent", content: $L("opens listpicker")}
      ]},
      {kind: "HFlexBox", components: [
        {kind: "Image", src: "images/library-help.png"},
        {kind: "HtmlContent", content: $L("toogles library")}
      ]},
      {kind: "HFlexBox", components: [
        {kind: "Image", src: "images/list-help.png"},
        {kind: "HtmlContent", content: $L("toogles custom list")}
      ]},
      {kind: "HFlexBox", components: [
        {kind: "Image", src: "images/add-help.png"},
        {kind: "HtmlContent", content: $L("adds a new custom List") + "<br><br>"}
      ]},
      
      {kind: "HtmlContent", content: "<h2>" + $L("Gesture Guide") + "</h2>"},
      {kind: "HtmlContent", content: "<h3>" + $L("Main View") + "</h3>"},
      {kind: "HtmlContent", content: 
        '<ul> \
          <li>' + $L("Swipe to the right to open next song in list") + '</li> \
          <li>' + $L("Swipe to the left to open previous song in list") + '</li> \
          <li>' + $L("Doubletab maximizes mainview") + '</li> \
        </ul>'},
      {kind: "HtmlContent", content: "<br>"},
      
      {kind: "HtmlContent", content: "<h3>" + $L("List Pane") + "</h3>"},
      {kind: "HtmlContent", content: 
        '<ul> \
          <li>' + $L("Swipe an librarylist item to add it to the current custom list") + '</li> \
          <li>' + $L("Swipe an custom list item to remove it from this list") + '</li> \
          <li>' + $L("Swipe a list to remove it") + '</li> \
        </ul>'},
      {kind: "HtmlContent", content: "<br>"},
      {kind: "HtmlContent", content: "<h2><a href='http://dl.dropbox.com/u/1429945/MySongBook%20Documentation/index.html'>"
        + "Online Documentation</a></h2>", onLinkClick: "linkClicked"},
      {kind: "HtmlContent", content: "<br>"},
      {kind: "HtmlContent", content: "<h2>" + $L("Contact") + "</h2>"},
      {kind: "HtmlContent", content: 
        '<ul> \
        <li><a href="mailto:reischuck.micha@googlemail.com">Micha Reischuck</a></li> \
        <li><a href="https://twitter.com/michote_">@michote_</a></li> \
        <li><a href="http://forums.webosnation.com/webos-homebrew-apps/318615-mysongbook.html">\
        webOS Nation forum thread</a></li> \
        </ul>', onLinkClick: "linkClicked"},
      {kind: "HtmlContent", content: "<br>"},
      {kind: "HtmlContent", content: "<h2>" + $L("Open Source") + "</h2>"},
      {kind: "HtmlContent", content: 'MySongBook is available under the terms \
        of the <a href="http://opensource.org/licenses/mit-license.php">MIT license</a>.',
        onLinkClick: "linkClicked"},
      {kind: "HtmlContent", content: "<br>"},
      {kind: "HtmlContent", content: "<h2>" + $L("Changelog") + "</h2>"},
      {kind: "HtmlContent", content: "<b>Version "+ enyo.fetchAppInfo().version + "</b>"},
      {kind: "HtmlContent", content: 
        '<ul> \
          <li>Create and Edit Song out of beta</li> \
          <li>Added support fot multiple languages</li> \
          <li>Rewrote preferences backend</li> \
          <li>Toggle show Buttons</li> \
          <li>Translations updated</li> \
        </ul>'},
      {kind: "HtmlContent", content: "<b>Version 0.2.2</b>"},
      {kind: "HtmlContent", content: 
        '<ul> \
          <li>Autoscroll out of beta</li> \
          <li>Now displays multiple lines and parts</li> \
          <li>Songelement Headline removed</li> \
          <li>Translation(de) updated</li> \
          <li>Labels for editing properties</li> \
          <li>Bugfixing in editing and parsing</li> \
        </ul>'},
      {kind: "HtmlContent", content: "<b>Version 0.2.0</b>"},
      {kind: "HtmlContent", content: 
        '<ul> \
          <li>Added: Doubletab maximizes mainview</li> \
          <li>Added: Create new Songs (Betatesting!)</li> \
          <li>Bugfixing in editing</li> \
          <li>Some cleanup</li> \
        </ul>'},
      //~ {kind: "HtmlContent", content: "<b>Version 0.1.8</b>"},
      //~ {kind: "HtmlContent", content: 
        //~ '<ul> \
          //~ <li>Added XML-Editing for Betatesting</li> \
        //~ </ul>'},
      //~ {kind: "HtmlContent", content: "<b>Version 0.1.6</b>"},
      //~ {kind: "HtmlContent", content: 
        //~ '<ul> \
          //~ <li>Fixed Bugs with lists not added and/or saved</li> \
        //~ </ul>'},
      //~ {kind: "HtmlContent", content: "<b>Version 0.1.4</b>"},
      //~ {kind: "HtmlContent", content: 
        //~ '<ul> \
          //~ <li>Added spanish translation thanks to ajguns</li> \
          //~ <li>New scrollbar</li> \
          //~ <li>Some small bugfixes</li> \
          //~ <li>More stuff working in dev preview</li> \
        //~ </ul>'},
      //~ {kind: "HtmlContent", content: "<b>Version 0.1.2</b>"},
      //~ {kind: "HtmlContent", content: 
        //~ '<ul><li>Bugfixes<ul><li>Sort Library fixed</li>\
        //~ <li>Read Files Dialog fixed</li>\
        //~ <li>some small other fixes</li>\
        //~ </ul></li>\
        //~ <li> Display amount of Songs in List</li>\
        //~ <li> Development Preview (Editing)</li>\
        //~ </ul>'},
      //~ {kind: "HtmlContent", content: "<b>Version 0.1.0</b>"},
      //~ {kind: "HtmlContent", content: 
        //~ '<ul> \
          //~ <li>Initial Release</li> \
        //~ </ul>'},
      {kind: "HtmlContent", content: "<br>"},
      {kind: "HtmlContent", content: "<h2>" + $L("Special Thanks") + "</h2>"},
      {kind: "HtmlContent", content: 
        '<ul> \
          <li>johncc @webosnation for the Autoscroll feature</li> \
          <li>ajguns @webosnation for the spanish translation</li> \
          <li>@svzi for giving me an understanding of enyo ;)</li> \
          <li>phoque @developer.palm.com for sharing his "Simple FileIO Service"</li> \
        </ul>', onLinkClick: "linkClicked"},
      {kind: "HtmlContent", content: "<br>"},
    ]}
  ],
  
  // Handle links
  linkClicked: function (inSender, inUrl) {
    this.owner.owner.linkClicked(inSender, inUrl);
  }
});
