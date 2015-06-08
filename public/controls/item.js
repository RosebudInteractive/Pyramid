if (typeof define !== 'function') {
    var define = require('amdefine')(module);
    var UccelloClass = require(UCCELLO_CONFIG.uccelloPath + '/system/uccello-class');
}

define(
    [UCCELLO_CONFIG.uccelloPath+'controls/aControl'],
    function(AControl) {
        var Item = AControl.extend({

            className: "Item",
            classGuid: UCCELLO_CONFIG.classGuids.Item,
            metaFields: [
                {fname:"X",ftype:"integer"},
                {fname:"Y",ftype:"integer"},
                {fname:"ItemType",ftype:"string"}
            ],

            /**
             * Инициализация объекта
             * @param cm ссылка на контрол менеджер
             * @param params
             */
            init: function(cm, params) {
                UccelloClass.super.apply(this, [cm, params]);
            },

            // Properties
            x: function(value) {
                return this._genericSetter("X", value);
            },
            y: function(value) {
                return this._genericSetter("Y", value);
            },
            itemType: function(value) {
                return this._genericSetter("ItemType", value);
            }
        });
        return Item;
    }
);