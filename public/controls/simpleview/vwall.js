define(
    ['/public/uccello/uses/template.js', 'text!./templates/wall.html'],
    function(template, tpl) {
        var vWall = {};
        vWall._templates = template.parseTemplate(tpl);
        vWall.render = function(options) {
            var item = $('#' + this.getLid());
            var that = this;
            if (item.length == 0) {
                item = $(vWall._templates['wall']).attr('id', this.getLid());
                var parent = this.getParent()? '#ch_' + this.getLid(): options.rootContainer;
                $(parent).append(item);
            }
        }
        return vWall;
    }
);