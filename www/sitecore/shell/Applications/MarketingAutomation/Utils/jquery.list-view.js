
if (typeof $sc === 'undefined') {
    window.$sc = jQuery.noConflict();
}

(function ($sc) {
    $sc.widget("sc.listview", {
        options: {
            page: 0,
            template : "{{each data}} <li class='group'><span class='ui-icon ui-icon-carat-1-s'></span>${n}</li>{{each i}}<li class='state' id='${id}' {{each a}}${key}='${value}'{{/each}} >${n}</li>{{/each}}{{/each}}"
        },

    _create: function () {
        var self = this;
        this.buildList();
        this.buildLoad();

        this.width = this.element.parent().width() - 20;

        this.element.width(this.width);

        this.handleScroll();

        this.addSearch();

        this.scrollToDefaultElement();

        this.element.find('.ui-state-active').focus();
        
        this.element.delegate('li.state', 'mouseenter', function () { $sc(this).addClass("ui-state-focus"); } )
                    .delegate('li.state', 'mouseleave', function () { $sc(this).removeClass("ui-state-focus"); })                                                            
                    .delegate('li.state', 'click', function(){  
                                $sc(".ui-state-active").removeClass('ui-state-active');
                                $sc(this).addClass("ui-state-active");
                                self.element.trigger('listview:change', [this.id, this.innerHTML, $sc(this).prevAll('.group').get(0).lastChild.nodeValue]);
                    })
                    .delegate('li.state', 'dblclick', function(e){                       
                        $sc(this).trigger('click');
                        scForm.browser.getControl('OK').click();
                    });

        this.element.delegate('li.group', 'mouseenter', function () { $sc(this).addClass("ui-state-focus-group"); } )
                    .delegate('li.group', 'mouseleave', function () { $sc(this).removeClass("ui-state-focus-group"); })                  
                    .delegate('li.group', 'click', function() {
                        var header = $sc(this),
                            display = '';
                        if (header.hasClass('collapsed')){
                            header.removeClass('collapsed');
                            header.find(".ui-icon").addClass('ui-icon-carat-1-s').removeClass('ui-icon-carat-1-n')
                            display = '';
                        }else{
                            header.addClass('collapsed');
                            header.find(".ui-icon").removeClass('ui-icon-carat-1-s').addClass('ui-icon-carat-1-n')
                            display = 'none';
                        }

                        var option = header;
                        do{
                            option = option.next() 
                            if (option.hasClass('group')){
                                break;
                            }

                            option.css('display', display);
                        }
                        while(option.length > 0);
                    })
    },

    
    handleScroll : function(){
        var self = this,    
            options = this.options,
            element = this.element;
        if (element.attr('scrollHeight') <= this.element.height()){
            this.load.hide();
        }else{
            this.load.show();
        }

        element.unbind('scroll').scroll(function(){
            var scrollHolder = $sc(this);
            if (this.scrollHeight - 20 - scrollHolder.scrollTop() <= scrollHolder.height()){
                self.reload(); 
            }
        });
    },

    reload : function(){
        var self = this,
            options = this.options;
        if (!self.activeRequest){
            self.activeRequest = true;
            self.load.show();
            $sc.post(
                self.element.parents('form:first').attr('action'),
                {
                    'lv-page' : options.page, 
                    'lv-search' : self.search.val()
                },

                function(data){
                    self.load.hide();
                    self.activeRequest = false;
                    if (data.length > 0){
                        self.element.find('ul:first').append($sc.tmpl(options.template, {data : data }));
                        options.page += data.length;
                        self.nodata.hide();
                    }else{
                        self.element.unbind('scroll'); 
                        self.load.hide();
                        if (options.page == 0){
                             self.nodata.show();
                        }                        
                    }
                }
            );   
        }             
    },

    buildLoad : function(){
        this.load = $sc("<div class='ui-list-load'><img src='" + this.options.loadingIconPath + "' border='0' /><span>" + this.options.loading + "</span></div>")
        this.element.append(this.load);
        this.options.page = this.options.data.length;
        this.nodata = $sc("<div class='ui-list-nodata'><span>" + this.options.nodata + "</span></div>")
        this.element.append(this.nodata);
        if (this.options.page > 0){
            this.nodata.hide();
        }
    },

    buildList : function(){
        this.element.append($sc.tmpl("<ul>" + this.options.template +"<ul>", this.options))
    },

    addSearch : function(){
        var listview = this,
            self =  this.element,
            options = this.options;

        this.search = $sc("<input type='text'></input>"); 
        self.before(this.search);

        this.search.width(this.width)
              .attr('title', this.options.watemark || 'Search')
              .bind('change keydown', function(e){ 
                 if (e.keyCode == null || e.keyCode == 0 || e.keyCode == '9' || e.keyCode == '13') {
                   var value = $sc(this).val();
                   if (value != listview.searchPattern){
                       listview.searchPattern = value;
                       options.page = 0;

                       self.find('ul:first').empty();

                       listview.handleScroll();
                       listview.reload();  
                   }
                 }
               })
              .watermark();

        var clear = $sc("<span class='ui-search-icon'></span>");
        self.before(clear);

        clear.css('left', (this.width - 20) + 'px');
          
        clear.click(function(){
            if (listview.searchPattern != ''){
                listview.search.val(''); 
                self.find('ul:first').empty();
                options.page = 0;
                listview.reload();  
                listview.handleScroll();
            }
            listview.search.val(''); 
            listview.search.focus()
        });
    },

    scrollToDefaultElement: function() {
        if (this.options.selectedItem != '') {
            var elementToSelect = $sc('#' +this.options.selectedItem).get(0);
            var container = $sc('#Container').get(0);
           
            if (elementToSelect != null && container != null) {

                if (elementToSelect.offsetTop > container.clientHeight) {
                    container.scrollTop = elementToSelect.offsetTop;
                }
            }

            $sc('#' +this.options.selectedItem).addClass('ui-state-active');
        }
    },

    destroy: function () {
       this.element.find("li.state").unbind();
    }
});
})(jQuery);