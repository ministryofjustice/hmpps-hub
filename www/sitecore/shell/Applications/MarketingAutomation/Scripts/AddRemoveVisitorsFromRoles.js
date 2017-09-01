var $j = $.noConflict();
(function($) {
    $.widget("ui.rolesselector", {
        options: {
            addListId: 'addList',
            removeListId: 'removeList',
            allOptionsId: 'allOptions',

            addedStorage: 'Added',
            removedStorage: 'Removed',
            source: [],
            addedSource: [],
            removedSource: [],
            domains: [],

            searchId: 'search',
            domainsListId: 'domains',

            addToAddedBtnId: 'AddRoleToAdded',
            removeFromAddedBtnId: 'RemoveRoleFromAdded',
            addToRemoveBtnId: 'AddRoleToRemove',
            removeFromRemovedBtnId: 'RemoveRoleFromRemove'
        },

        _create: function() {
            this._allOptions = $('#' + this.options.allOptionsId);
            this._addList = $('#' + this.options.addListId);
            this._removeList = $('#' + this.options.removeListId);

            this._addStorage = $('#' + this.options.addedStorage);
            this._removeStorage = $('#' + this.options.removedStorage);

            this._search = $('#' + this.options.searchId);
            this._domains = $('#' + this.options.domainsListId);
            if ($.browser.msie) {
                this._domains.width('100%');
            }

            this.populate(this._allOptions, this.options.source);
            this.populate(this._addList, this.options.addedSource);
            this.populate(this._removeList, this.options.removedSource);
            this.populate(this._domains, this.options.domains);

            var me = this;
            //setup up events
            // on domain change
            this._domains.change(function() {
                me.filter(me);
            });

            //on search text changed
            this._search.keyup(function() {
                me.filter(me);
            });

            $('#' + this.options.addToAddedBtnId).click(function() {
                me.addRole(me, me._addList);
                me.filter(me);
            });

            $('#' + this.options.removeFromAddedBtnId).click(function() {
                me.removeRole(me, me._addList);
                me.filter(me);
            });

            $('#' + this.options.addToRemoveBtnId).click(function() {
                me.addRole(me, me._removeList);
                me.filter(me);
            });

            $('#' + this.options.removeFromRemovedBtnId).click(function() {
                me.removeRole(me, me._removeList);
                me.filter(me);
            });
        },

        saveSelectedRoles: function(widget) {
            var str = '';
            var addroles = widget._addList.find('option');
            for (var i = 0; i < addroles.size(); i++) {
                str = str + '|' + $(addroles[i]).val();
            }

            widget._addStorage.val(str);
            str = '';
            var removeRoles = widget._removeList.find('option');
            for (var j = 0; j < removeRoles.size(); j++) {
                str = str + '|' + $(removeRoles[j]).val();
            }

            widget._removeStorage.val(str);
        },
        
        removeRole: function(widget, from) {
            var w = from.parent().width();
            var h = from.parent().height();
            var sel = from.find(':selected');
            if (sel.size()==0) return;
            widget.options.source.push(sel.text());
            widget.options.source.sort();
            sel.remove();
            widget.selectFirst(from);
            widget.fixIeWidthHeight(w, h, from);
            widget.saveSelectedRoles(widget);
        },

        addRole: function(widget, to) {
            var w = to.parent().width();
            var h = to.parent().height();
            var sel = widget._allOptions.find(':selected');
            if (sel.size()==0) return;
            to.append(widget.createOption(sel.text()));
            var index = widget.options.source.indexOf(sel.text());
            widget.options.source.splice(index, 1);
            widget.fixIeWidthHeight(w, h, to);
            widget.selectFirst(to);
            widget.saveSelectedRoles(widget);
        },

        filter: function(widget) {
            var w = widget._allOptions.parent().width();
            var h = widget._allOptions.parent().height();
            var text = widget._search.val();
            var domain = widget._domains.val().toLowerCase();

            widget._allOptions.empty();
            for (var i = 0; i < widget.options.source.length; i++) {
                
                var v = widget.options.source[i];
                var val = v.toLowerCase();
                if (val.indexOf(text.toLowerCase()) >= 0 && (domain == 'all' || val.indexOf(domain) == 0)) {
                    widget._allOptions.append(widget.createOption(v));
                }
            }

            widget.selectFirst(widget._allOptions);
            widget.fixIeWidthHeight(w, h, widget._allOptions);
        },

        populate: function(list, arr) {
            list.empty();
            for (var i = 0; i < arr.length; i++) {
                list.append(this.createOption(arr[i]));
            }
            this.selectFirst(list);
        },

        createOption: function(val) {
            return $('<option>', { 'title': val }).val(val).text(val);
        },
        
        // hack for ie quirks mode
        fixIeWidthHeight: function(w, h, element) {
            if ($.browser.msie) {
                element.width(w);
                element.width('100%');
                element.height(h);
                element.height('100%');
            }
        },

        selectFirst: function(list) {
            if (list.find(':selected').size() > 0) return;
            list.find(':first').attr("selected", "selected");
        }
    });

})(jQuery);






