define(
    ['/public/uccello/uses/template.js', 'text!./templates/default.html'],
    function(template, tpl) {
        var vDefault = {};
        vDefault._templates = template.parseTemplate(tpl);
        vDefault.render = function(options) {
            var item = $('#' + this.getLid());
            if (item.length == 0) {
                item = $(vDefault._templates['control']).attr('id', this.getLid());
                var parent = this.getParent()? '#ch_' + this.getLid(): options.rootContainer;
                $(parent).append(item);
            }
            item.html(this.name());
        }
        return vDefault;
    }
);