define(
    ['/public/uccello/uses/template.js', 'text!./templates/laby.html'],
    function(template, tpl) {
        var vLaby = {};
        vLaby._templates = template.parseTemplate(tpl);
        vLaby.render = function(options) {
            var item = $('#' + this.getLid());
            var that = this;

            // перемещение последнего объекта
            var items = this.getCol('Items');

            if (!this.lastItem)
                this.lastItem = items.count()>0 ?this.getControlMgr().get(items.get(items.count()-1).getGuid()):null;

            if (item.length == 0) {
                item = $(vLaby._templates['laby']).attr('id', this.getLid());
                var parent = this.getParent()? '#ch_' + this.getLid(): options.rootContainer;
                $(parent).append(item);
                $(document).keydown(function(e) {
                    if (!that.lastItem) return;
                    var x = that.lastItem.x(), y=that.lastItem.y();
                    var deltaValue = false, deltaMethod = null;
                    if (e.which>36 && e.which<41) {
                        switch(e.which) {
                            case 37: // left
                                if (x>0 && !matrixLaby[x][y].checkV){deltaValue=x-1;deltaMethod='x';}
                                break;
                            case 38: // up
                                if (y>0 && !matrixLaby[x][y].checkH){deltaValue=y-1;deltaMethod='y';}
                                break;
                            case 39: // right
                                if (x<sizeX-1 &&!matrixLaby[x+1][y].checkV){deltaValue=x+1;deltaMethod='x';}
                                break;
                            case 40: // down
                                if (y<sizeY-1 && !matrixLaby[x][y+1].checkH){deltaValue=y+1;deltaMethod='y';}
                                break;
                            default: return; // exit this handler for other keys
                        }
                        e.preventDefault(); // prevent the default action (scroll / move caret)

                        // если есть что обновить
                        if (deltaMethod) {
                            that.getControlMgr().userEventHandler(that, function(){
                                that.lastItem[deltaMethod](deltaValue);
                                vLaby.renderItem.apply(that, [that.lastItem]);
                            });
                        }

                    }
                });
            } else {
                item.empty();
            }

            // создаем матрицу лабиринта
            var matrixLaby = [];
            var sizeX = this.sizeX(), sizeY = this.sizeY();
            for(var i=0; i<sizeX; i++) {
                matrixLaby[i] = [];
                for(var j=0; j<sizeY; j++) {
                    matrixLaby[i][j] = {checkH:false, checkV:false, itemTypes:[]};
                }
            }

            var walls = this.getCol('Walls');
            for(var i=0; i<walls.count();i++) {
                var wall = this.getControlMgr().get(walls.get(i).getGuid());
                var x=wall.x(), y=wall.y(), len=wall.length(), wallType=wall.wallType();
                if (wallType == 'H') {
                    for(var k=x; k<x+len; k++)
                        matrixLaby[k][y].checkH = true;
                } else {
                    for(var k=y; k<y+len; k++)
                        matrixLaby[x][k].checkV = true;
                }
            }
            var items = this.getCol('Items');
            for(var i=0; i<items.count();i++) {
                var lid = items.get(i).getLid();
                var guid = items.get(i).getGuid();
                var itemOne = this.getControlMgr().get(guid);
                var x=itemOne.x(), y=itemOne.y(), itemType=itemOne.itemType();
                matrixLaby[x][y].itemTypes.push({type:itemType, lid:lid});
            }

            //this.matrixLaby = matrixLaby;

            // отрисовка ячеек
            for(var i=0; i<sizeY; i++) {
                var row = $(vLaby._templates['row']);
                for(var j=0; j<sizeX; j++) {
                    var cell = $(vLaby._templates['cell']);
                    if (matrixLaby[j][i].checkH) cell.addClass('h');
                    if (matrixLaby[j][i].checkV) cell.addClass('v');
                    for (var k=0; k<matrixLaby[j][i].itemTypes.length; k++) {
                        cell.append($(vLaby._templates['item']).html(matrixLaby[j][i].itemTypes[k].type).attr('id', 'item'+matrixLaby[j][i].itemTypes[k].lid));
                    }
                    row.append(cell);
                }
                item.append(row);
            }
        }

        vLaby.renderItem = function(item){
            var labyItem = $('#' + this.getLid());
            labyItem.find('#item'+item.getLid()).remove();
            labyItem.find('.row:eq('+item.y()+')')
                .find('.cell:eq('+item.x()+')')
                .append($(vLaby._templates['item'])
                    .html(item.itemType())
                    .attr('id', 'item'+item.getLid()));
        }

        vLaby.renderPaper = function(options) {
            var item = $('#' + this.getLid());
            var that = this;
            var cellSize = 50;
            var sizeX = this.sizeX(), sizeY = this.sizeY();

            if (item.length == 0) {
                item = $(vLaby._templates['laby-canvas']).attr('id', this.getLid());
                item.width(sizeX*cellSize);
                item.height(sizeY*cellSize);
                var parent = this.getParent()? '#ch_' + this.getLid(): options.rootContainer;
                $(parent).append(item);

                var canvas = document.getElementById(this.getLid());
                paper.setup(canvas);
                var childs = this.getCol('Walls');
                for(var i=0; i<childs.count();i++) {
                    var child = this.getControlMgr().get(childs.get(i).getGuid());
                    var x=child.x(), y=child.y(), len=child.length(), wallType=child.wallType();
                    var path = new paper.Path();
                    path.strokeColor = 'black';
                    var start = new paper.Point(x*cellSize, y*cellSize);
                    path.moveTo(start);
                    if (wallType == 'H')
                        path.lineTo(start.add([ (len)*cellSize, 0 ]));
                    else
                        path.lineTo(start.add([ 0, (len)*cellSize ]));
                    paper.view.draw();
                }
            }
        }
        return vLaby;
    }
);