Ext.ns('Ext.erp.iffs.ux.PackingMaterialSurvey');

/**
* @desc      Packing Material Setting grid
* @author    Samson Solomon
* @copyright (c) 2017, Cybersoft
* @date      December 15, 2017
* @namespace Ext.erp.iffs.ux.PackingMaterialSurvey
* @class     Ext.erp.iffs.ux.PackingMaterialSurvey.Grid
* @extends   Ext.grid.GridPanel
*/
var extMessage = '';
Ext.erp.iffs.ux.PackingMaterialSurvey.Grid = function (config) {
    Ext.erp.iffs.ux.PackingMaterialSurvey.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: PackingSurvey.GetAllMaterials,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Description',
                direction: 'ASC'
            },
            fields: ['MaterialId', 'Id', 'Name', 'Description', 'Length', 'Width', 'Height', 'SizeCMB', 'MeasurmentUnit', 'MeasurmentUnitRaw', 'MaterialType', 'Quantity', 'Remark'],
            remoteSort: true
        }),
        pageSize: 20,
        stripeRows: true,
        columnLines: true,
        border: false,
        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        }),
        viewConfig: {
            autoFill: true
        },
        listeners: {
            containermousedown: function (grid, e) {
                grid.getSelectionModel().deselectRange(0, grid.pageSize);
            },
            scope: this
        },
        columns: [{
            dataIndex: 'Id',
            hidden: true,
        }, {
            dataIndex: 'MaterialId',
            hidden: true,
        }, new Ext.grid.RowNumberer(), {
            dataIndex: 'Name',
            header: 'Name',
            sortable: true,
            width: 120,
            menuDisabled: true
        }, {
            dataIndex: 'Description',
            header: 'Description',
            width: 120,
            menuDisabled: true
        }, {
            dataIndex: 'Length',
            header: 'Length',
            width: 60, menuDisabled: true,
            align: 'right', xtype: 'numbercolumn',
            format: '0,0.00000'
        }, {
            dataIndex: 'Width',
            header: 'Width',
            width: 60, menuDisabled: true,
            align: 'right', xtype: 'numbercolumn',
            format: '0,0.00000'
        }, {
            dataIndex: 'Height',
            header: 'Height',
            width: 60, menuDisabled: true,
            align: 'right', xtype: 'numbercolumn',
            format: '0,0.00000'
        }, {
            dataIndex: 'SizeCMB',
            header: 'Size(CMB)',
            width: 60, align: 'right',
            menuDisabled: true,
            xtype: 'numbercolumn',
            format: '0,0.00000'
        }, {
            dataIndex: 'MeasurmentUnit',
            header: 'Measurment Unit',
            hidden: true,
        }, {
            dataIndex: 'Quantity',
            header: 'Quantity',
            sortable: true,
            width: 100,
            menuDisabled: true,
            align: 'right',
            editor: new Ext.form.NumberField({
                allowBlank: true,
                allowNegative: false,
                listeners: {
                    focus: function (field) {
                        field.selectText();
                    }
                }
            })
        }, {
            dataIndex: 'MeasurmentUnitRaw',
            header: 'Measurment Unit',
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'Remark',
            header: 'Remark',
            width: 150,
            menuDisabled: true,
            align: 'left',
            editor: new Ext.form.TextField({
                allowBlank: true,
                allowNegative: false,
                listeners: {
                    focus: function (field) {
                        field.selectText();
                    }
                }
            })
        }]
    }, config));
}
Ext.extend(Ext.erp.iffs.ux.PackingMaterialSurvey.Grid, Ext.grid.EditorGridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({ searchText: '' }) };
        this.bbar = new Ext.PagingToolbar({
            id: 'PackingMaterialSurvey-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        this.tbar = [{
            xtype: 'button',
            text: 'Pick Items',
            iconCls: 'icon-add',
            handler: this.onPickItems
        }, {
            xtype: 'tbseparator',
        }, {
            xtype: 'button',
            text: 'Remove',
            iconCls: 'icon-delete',
            handler: this.deleteRow,
            scope: this
        }],
        Ext.erp.iffs.ux.PackingMaterialSurvey.Grid.superclass.initComponent.apply(this, arguments);
    },
    loadDetail: function (headerId, materialType) {
        var Store = this.getStore();

        Store.baseParams = { record: Ext.encode({ HeaderId: headerId, MaterialType: materialType }) };
        Store.load({
            params: { start: 0, limit: this.pageSize }
        });
    },
    onPickItems: function () {
        var grid = Ext.getCmp('PackingMaterialSurvey-grid');
        new Ext.erp.iffs.ux.PackingMaterialSetting.Window({ CallerGrid: grid }).show();
    },
    SaveDetail: function (headerId) {
        var grid = this;
        var gridDatastore = grid.getStore();
        var totalCount = gridDatastore.getCount();
        var QuantityError = '';
        var recs = [];

        gridDatastore.each(function (item) {
            if (item.data.Quantity == null || item.data.Quantity == "") {
                QuantityError += item.data.Name + ', ';
            } else
                recs.push(item.data);
        });
       
        PackingSurvey.SaveMaterial(headerId, recs, function (rest, resp) {
            if (rest.success) {
                Ext.MessageBox.show({
                    title: 'Packing Material Estimation',
                    msg: QuantityError != '' ? rest.data + ', But The Following Items \"' + QuantityError.trim() + '\" Cannot be added since Quantity is zero' : rest.data,
                    buttons: Ext.Msg.OK,
                    scope: this
                });
                Ext.getCmp('PackingMaterialSurvey-paging').doRefresh();
            }
        });
    },
    deleteRow: function () {
        var grid = Ext.getCmp('PackingMaterialSurveyDetail-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        var record = grid.getSelectionModel().getSelections();
        for (var i = 0; i < record.length; i++) {
            grid.store.remove(record);
            if (typeof record[i].id === 'number') {
                var id = record[i].id;
                Ext.MessageBox.show({
                    title: 'Delete',
                    msg: 'Are you sure you want to delete the selected record',
                    buttons: {
                        ok: 'Yes',
                        no: 'No'
                    },
                    icon: Ext.MessageBox.QUESTION,
                    scope: this,
                    fn: function (btn) {
                        if (btn == 'ok') {
                            PackingMaterialSurvey.DeleteDetial(id, function (result, response) {
                                Ext.MessageBox.show({
                                    title: result.success ? 'Success' : 'Error',
                                    msg: result.data,
                                    buttons: Ext.Msg.OK,
                                    icon: result.success ? Ext.MessageBox.INFO : Ext.MessageBox.ERROR,
                                    scope: this
                                });
                            }, this);
                        }
                    }
                });
            }
        }
    }
});
Ext.reg('PackingMaterialSurvey-grid', Ext.erp.iffs.ux.PackingMaterialSurvey.Grid);

/**
* @desc      Packing Material Setting window
* @author    Henock Melisse
* @copyright (c) 2017, Cybersoft
* @date      December 15, 2017
* @namespace Ext.erp.iffsux.PackingMaterialSurvey
* @class     Ext.erp.iffsux.PackingMaterialSurvey.Window
* @extends   Ext.Window
*/
Ext.erp.iffs.ux.PackingMaterialSurvey.Window = function (config) {
    Ext.erp.iffs.ux.PackingMaterialSurvey.Window.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        width: 1200,
        height: 500,
        title: 'Packing Materials Needed',
        closeAction: 'close',
        resizable: false,
        buttonAlign: 'right',
        bodyStyle: 'padding:5px;',

        listeners: {
            show: function () {
                if (this.HeaderId > 0) {
                    Ext.getCmp('PackingMaterialSurvey-grid').loadDetail(this.HeaderId, this.MaterialType);
                }
            },
            scope: this
        }
    }, config));
}
Ext.extend(Ext.erp.iffs.ux.PackingMaterialSurvey.Window, Ext.Window, {
    initComponent: function () {
        this.bbar = [{
            xtype: 'tbfill'
        }, {
            text: 'Save',
            iconCls: 'icon-save',
            handler: this.onSave,
            scope: this
        }, {
            xtype: 'tbseparator'
        }, {
            text: 'Close',
            iconCls: 'icon-exit',
            handler: this.onClose,
            scope: this
        }];
        this.items = [{
            xtype: 'PackingMaterialSurvey-grid',
            id: 'PackingMaterialSurvey-grid'
        }];
        Ext.erp.iffs.ux.PackingMaterialSurvey.Window.superclass.initComponent.call(this, arguments);
    },
    onSave: function () {
        Ext.getCmp('PackingMaterialSurvey-grid').SaveDetail(this.HeaderId);
    },
    onClose: function () {
        if (typeof this.NotificationId != 'undefined') {
            window.PackingMaterialSurvey.ChangeViewStatus(this.NotificationId, function (result) {
                if (result.success) {
                    Ext.getCmp('PackingMaterialSurvey-paging').doRefresh();
                } else {
                    Ext.MessageBox.show({
                        title: 'Error',
                        msg: action.result.data,
                        buttons: Ext.Msg.OK,
                        icon: Ext.MessageBox.ERROR,
                        scope: this
                    });
                }
            });
        }
        this.close();
    }
});
Ext.reg('PackingMaterialSurvey-window', Ext.erp.iffs.ux.PackingMaterialSurvey.Window);

