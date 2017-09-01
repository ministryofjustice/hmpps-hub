var $j = $.noConflict();
(function($) {
    $.widget("ui.profilemapper", {
        options: {
            source: [],
            overwrite: true,
            data: [],
            addFieldClass: '.addProperty',
            addFieldText:'Add',
            placeholderClass: '.placeholder',
            profiles: [],
            storageId: '#Storage',
            error: 'error, no data provided',
            errorHolderSelector: '.ErrorMessage',
            checkbox: '#OverwriteProfile'
        },

        _create: function() {
            this._placeholder = $(this.options.placeholderClass);
            this._storage = $(this.options.storageId);
            this._error = $(this.options.errorHolderSelector);
            this._error.hide();
            this.initialize();
        },

        initialize: function() {
        var addBtn =$(this.options.addFieldClass);
            if (this.options.profiles.length == 0) {
                addBtn.hide();
                this._error.text(this.options.error);
                this._error.show();
                $(this.options.checkbox).parent().hide();
            }
            
            var me = this;
            addBtn.val(this.options.addFieldText);
            addBtn.click(function() {
                me.createMapping(null);
            });

            for (var i = 0; i < this.options.data.length; i++) {
                this.createMapping(this.options.data[i]);
            }
        },

        createMapping: function(data) {
            var me = this;
            var res = $('#textTemplate').tmpl(this.options);
            res.find('.del').click(function() {
                $(this).parent().remove();
                me.update();
            });
            
            var input = res.find('input');
            input.keyup(function() {
                me.update();
            });
            
            var select = res.find('select');
            select.change(function() {
                me.update();
            });
            
            res.appendTo(this._placeholder);

            if (data) {
                select.find("[data-id='"+ data.Profile +"']").find("[*:contains('" + data.FieldName + "')").attr("selected", "selected");
                input.val(data.Value);
            }

            me.update();
        },

        update: function() {
            var str = '';
            this._placeholder.find('li').each(function() {
                var selected = $(this).find('option:selected');
                str = str + "{FieldName:'" + selected.text()
                    + "',Value:'" + $(this).find('input').val()
                        + "',Profile:'" + selected.parent().attr('data-id')
                            + "'},";
            });

            this._storage.val(str);
        }
    });
})(jQuery);