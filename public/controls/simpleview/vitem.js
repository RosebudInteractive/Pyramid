define(
    ['/public/uccello/uses/template.js', 'text!./templates/item.html'],
    function(template, tpl) {
        var vItem = {};
        vItem._templates = template.parseTemplate(tpl);
        vItem.render = function(options) {
            var item = $('#' + this.getLid());
            var that = this;
            if (item.length == 0) {
                item = $(vItem._templates['item']).attr('id', this.getLid());
                var parent = this.getParent()? '#ch_' + this.getLid(): options.rootContainer;
                $(parent).append(item);
            }
        }
        return vItem;
    }
);