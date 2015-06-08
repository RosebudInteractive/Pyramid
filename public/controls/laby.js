if (typeof define !== 'function') {
    var define = require('amdefine')(module);
    var UccelloClass = require(UCCELLO_CONFIG.uccelloPath + '/system/uccello-class');
}

define(
    [UCCELLO_CONFIG.uccelloPath+'controls/aControl'],
    function(AControl) {
        var Laby = AControl.extend({

            className: "Laby",
            classGuid: UCCELLO_CONFIG.classGuids.Laby,
            metaCols: [
                { "cname": "Walls", "ctype": "Wall" },
                { "cname": "Items", "ctype": "Item" }
            ],
            metaFields: [
                {fname:"SizeX",ftype:"integer"},
                {fname:"SizeY",ftype:"integer"}
            ],

            /**
             * Инициализация объекта
             * @param cm ссылка на контрол менеджер
             * @param params
             */
            init: function(cm, params) {
                UccelloClass.super.apply(this, [cm, params]);
            },

            /**
             * Рендер контрола
             * @param viewset
             * @param options
             */
            irender: function(viewset, options) {

                // проверяем позиции объектов
                var items = this.getCol('Items');
                if (items) {
                    var modified = false;
                    for (var i = 0, len = items.count(); i < len; i++) {
                        var item = items.get(i);
                        if (item.isFldModified("X") || item.isFldModified("Y")) {
                            modified = true;
                            viewset.renderItem.apply(this, [this.getControlMgr().get(item.getGuid())]);
                        }
                    }
                    if (modified)
                        return;
                }

                // рендерим DOM
                viewset.render.apply(this, [options]);
            },

            processDelta: function() {
                var items = this.getCol('Items');
                if (items) {
                    var modified = false;
                    for (var i = 0, len = items.count(); i < len; i++) {
                        var item = items.get(i);
                        if (item.isFldModified("X") || item.isFldModified("Y"))
                            modified = true;
                    }
                    if (modified)
                        this._isRendered(false);
                }
                this._isProcessed(true);
            },

            // Properties
            sizeX: function(value) {
                return this._genericSetter("SizeX", value);
            },
            sizeY: function(value) {
                return this._genericSetter("SizeY", value);
            }
        });
        return Laby;
    }
);