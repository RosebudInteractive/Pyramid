if (typeof define !== 'function') {
    var define = require('amdefine')(module);
    var UccelloClass = require(UCCELLO_CONFIG.uccelloPath + '/system/uccello-class');
}

define(
    [UCCELLO_CONFIG.uccelloPath+'controls/aControl'],
    function(AControl) {
        var Wall = AControl.extend({

            className: "Wall",
            classGuid: UCCELLO_CONFIG.classGuids.Wall,
            metaFields: [
                {fname:"X",ftype:"integer"},
                {fname:"Y",ftype:"integer"},
                {fname:"WallType",ftype:"string"},
                {fname:"Length",ftype:"integer"}
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
            wallType: function(value) {
                return this._genericSetter("WallType", value);
            },
            length: function(value) {
                return this._genericSetter("Length", value);
            }
        });
        return Wall;
    }
);