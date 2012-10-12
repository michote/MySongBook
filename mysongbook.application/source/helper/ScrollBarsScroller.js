/*Copyright © 2011, Doron Rosenebrg
 All rights reserved.

 Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

 Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
 Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
 Neither the name of the Google Inc. nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.

 THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

enyo.kind({
    name : "enyoextras.ScrollBarsScroller",
    kind : enyo.Scroller,

    events: {
        onEndReached: ""
    },

    published : {
        scrollbarColor : "black",
        alwaysShowScrollbars : false,
        maxOpacity : 0.7
    },

    initComponents : function() {
        this.createChrome([{
            kind : "enyoextras.ScrollBarsScrollerBar",
            name : "scrollbars",
            scrollbarColor : this.scrollbarColor,
            alwaysShowScrollbars : this.alwaysShowScrollbars,
            maxOpacity : this.maxOpacity,
            onEnd: "onEnd"
        }]);
        this.inherited(arguments);
    },
    scroll : function(inSender) {
        this.inherited(arguments);
        this.$.scrollbars.scrollUpdate(this);
    },
    scrollStart : function() {
        this.inherited(arguments);
        this.$.scrollbars.scrollStart(this);
    },
    scrollStop : function() {
        this.inherited(arguments);
        this.$.scrollbars.scrollStop(this);
    },
    onEnd : function() {
        // this.log();
        this.doEndReached();
    }
});

enyo.kind({
    name : "enyoextras.ScrollBarsScrollerBar",
    kind : enyo.Control,

    events: {
        onEnd: ""
    },

    published : {
        scrollbarColor : "black",
        alwaysShowScrollbars : false,
        maxOpacity : 1
    },

    started : false,
    duration : "1200ms",

    components : [],

    initComponents : function() {
        var style = "width: 8px; border-radius: 5px; position: absolute; top: 0px; right: 2px; opacity: 0; z-index: 100; -webkit-transition-property: opacity; background-color:" + this.scrollbarColor;
        this.createChrome([{
            name : "scrollBars",
            showing : true,
            style : style
        }]);
        this.inherited(arguments);

        // build the binding
        this._transitionEndBinding = enyo.bind(this, this._transitionEnd);
    },
    scrollUpdate : function(inScroller) {
        if(inScroller.vertical) {
            var bs = inScroller.getBoundaries();

            // lets calculate the height of the entire content
            var scrollee = inScroller.scrollee.hasNode();
            var cheight = scrollee.offsetHeight + scrollee.offsetTop;

            // lets calculate the visible height
            var height = inScroller.hasNode().offsetHeight;

            // calculate the scrollbar height, first calculate the percentage of
            // visible height compared to content height.
            var hperc = Math.floor((height / (cheight)) * 100) / 100;
            // 20 is min height for scrollbar
            var sheight = Math.max(Math.floor(height * hperc), 20);

            // 10 is for bottom/top padding (5px each)
            this.$.scrollBars.hasNode().style.height = sheight - 10 + "px";

            // now calculate the scrollbar position
            var perc = inScroller.scrollTop / (bs.bottom);
            if (perc ==1) {
                // this.log("perc: " + perc);
                this.doEnd();
            }
            // this.log("perc: " + perc);

            // take scrollbar height into consideration
            var h = ((height - sheight) * perc);

            // 5 is for top padding
            this.$.scrollBars.hasNode().style.top = h + 5 + "px";
        }
    },
    scrollStart : function(inScroller) {
        // don't show first time as this is the initial render or there is no overflow
        if((this.started || this.alwaysShowScrollbars) && this._hasOverflow(inScroller)) {
            this.$.scrollBars.hasNode().style.webkitTransitionDuration = "";
            this.$.scrollBars.hasNode().style.webkitTransitionDelay = "";
            if( this.$.scrollBars.getShowing( ) == false ) {
                this.$.scrollBars.show(); 
            }
            // this.$.scrollBars.setShowing(true);
            this.$.scrollBars.hasNode().style.opacity = this.maxOpacity;
        } else {
            this.started = true;
        }
    },
    scrollStop : function(inScroller) {
        if(!this.alwaysShowScrollbars) {
            // listen for end event
            this.$.scrollBars.hasNode().addEventListener("webkitTransitionEnd", this._transitionEndBinding, false);
            this.$.scrollBars.hasNode().style.webkitTransitionDuration = this.duration;
            this.$.scrollBars.hasNode().style.opacity = 0;
        }
    },
    _transitionEnd : function(inEvent) {
        this.$.scrollBars.hasNode().removeEventListener("webkitTransitionEnd", this._transitionEndBinding, false);
        if( this.$.scrollBars.getShowing( ) == true ) {
            this.$.scrollBars.hide(); 
        }
        // this.$.scrollBars.setShowing(false);
    },
    scrollBarColorChanged : function() {
        if(this.$.scrollBars.hasNode()) {
            this.$.scrollBars.hasNode().style.backgroundColor = this.scrollbarColor;
        }
    },
    alwaysShowScrollbarsChanged : function() {
        if(this.alwaysShowScrollbars) {
            if( this.$.scrollBars.getShowing( ) == false ) {
                this.$.scrollBars.show(); 
            }
            // this.$.scrollBars.setShowing(true);
            this.$.scrollBars.hasNode().style.opacity = this.maxOpacity;
        } else {
            if( this.$.scrollBars.getShowing( ) == true ) {
                this.$.scrollBars.hide(); 
            }
            // this.$.scrollBars.setShowing(false);
            this.$.scrollBars.hasNode().style.opacity = 0;
        }
    },
    _hasOverflow : function(inScroller) {
        var bs = inScroller.getBoundaries();

        var scrollee = inScroller.scrollee.hasNode();

        // this.log("overflow: " + (scrollee.offsetHeight > inScroller.hasNode().offsetHeight));
        
        return (scrollee.offsetHeight > inScroller.hasNode().offsetHeight);
    }
});
