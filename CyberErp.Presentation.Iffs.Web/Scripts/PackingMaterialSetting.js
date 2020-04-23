Ext.ns('Ext.erp.iffs.ux.PackingMaterialSetting');

/**
* @desc      Packing Material Setting grid
* @author    Samson Solomon
* @copyright (c) 2017, Cybersoft
* @date      December 15, 2017
* @namespace Ext.erp.iffs.ux.PackingMaterialSetting
* @class     Ext.erp.iffs.ux.PackingMaterialSetting.Grid
* @extends   Ext.grid.GridPanel
*/
var extMessage = '';
var selModelPackingMaterialSetting = new Ext.grid.CheckboxSelectionModel();
Ext.erp.iffs.ux.PackingMaterialSetting.Grid = function (config) {
    Ext.erp.iffs.ux.PackingMaterialSetting.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: PackingMaterialSetting.GetAll,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Description',
                direction: 'ASC'
            },
            fields: ['Id', 'Name', 'Description', 'Length', 'Width', 'Height', 'SizeCMB', 'MeasurmentUnit', 'MeasurmentUnitRaw', 'MaterialType', 'Remark'],
            remoteSort: true
        }),
        id: 'PackingMaterialSettingDetail-grid',
        pageSize: 20,
        stripeRows: true,
        columnLines: true,
        border: false,
        sm: selModelPackingMaterialSetting,
        viewConfig: {
            autoFill: true
        },
        listeners: {
            containermousedown: function (grid, e) {
                grid.getSelectionModel().deselectRange(0, grid.pageSize);
            },
            rowclick: function (grid, rowIndex, e) {
                var btn = Ext.getCmp('btnPackingMaterialSettingSelect');
                btn.setDisabled(grid.getSelectionModel().getSelections().length <= 0);
            },

        },
        columns: [{
            dataIndex: 'Id',
            header: 'Id',
            hidden: true,
        }, selModelPackingMaterialSetting, new Ext.grid.RowNumberer(), {
            dataIndex: 'Name',
            header: 'Name',
            sortable: true,
            width: 100,
            menuDisabled: true,
            align: 'left',
            editor: new Ext.form.TextField({
                width: 100,
                allowBlank: true,
                allowNegative: false,
                listeners: {
                    focus: function (field) {
                        field.selectText();
                    }
                }
            })
        }, {
            dataIndex: 'Description',
            header: 'Description',
            width: 100, menuDisabled: true,
            align: 'left', 
            editor: new Ext.form.TextField({
                width: 100,
                allowBlank: true,
                allowNegative: false,
                listeners: {
                    focus: function (field) {
                        field.selectText();
                    }
                }
            })
        }, {
            dataIndex: 'Length',
            header: 'Length',
            width: 60, menuDisabled: true,
            align: 'right', xtype: 'numbercolumn',
            format: '0,0.00000',
            editor: new Ext.form.TextField({
                width: 100,
                allowBlank: true,
                allowNegative: false,
                listeners: {
                    focus: function (field) {
                        field.selectText();
                    }
                }
            })
        }, {
            dataIndex: 'Width',
            header: 'Width',
            width: 60, menuDisabled: true,
            align: 'right', xtype: 'numbercolumn',
            format: '0,0.00000',
            editor: new Ext.form.TextField({
                width: 100,
                allowBlank: true,
                allowNegative: false,
                listeners: {
                    focus: function (field) {
                        field.selectText();
                    }
                }
            })
        }, {
            dataIndex: 'Height',
            header: 'Height',
            width: 60, menuDisabled: true,
            align: 'right', xtype: 'numbercolumn',
            format: '0,0.00000',
            editor: new Ext.form.TextField({
                width: 100,
                allowBlank: true,
                allowNegative: false,
                listeners: {
                    focus: function (field) {
                        field.selectText();
                    }
                }
            })
        }, {
            dataIndex: 'SizeCMB',
            header: 'Size(CMB)',
            width: 100, menuDisabled: true,
            align: 'right', xtype: 'numbercolumn',
            format: '0,0.00000',
            editor: new Ext.form.TextField({
                width: 100,
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
            hidden: true,
        }, {
            dataIndex: 'MeasurmentUnit',
            header: 'Measurment Unit',
            width: 100, menuDisabled: true,
            forceSelection: true,
            xtype: 'combocolumn',
            editor: new Ext.form.ComboBox({
                id: 'cmbMeasurmentUnit',
                triggerAction: 'all',
                minChars: 2,
                mode: 'remote',
                allowBlank: false,
                store: new Ext.data.DirectStore({
                    reader: new Ext.data.JsonReader({
                        successProperty: 'success',
                        idProperty: 'Id',
                        root: 'data',
                        fields: ['Id', 'Name']
                    }),
                    autoLoad: true,
                    api: { read: PackingMaterialConsumption.GetMeasurementUnits }
                }),
                valueField: 'Id',
                displayField: 'Name',
                pageSize: 10
            })
        }, {
            dataIndex: 'Remark',
            header: 'Remark',
            width: 100,
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
Ext.extend(Ext.erp.iffs.ux.PackingMaterialSetting.Grid, Ext.grid.EditorGridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({ searchText: '' }) };
        this.bbar = new Ext.PagingToolbar({
            id: 'PackingMaterialSetting-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });

        this.tbar = [{
            xtype: 'button',
            text: 'Insert',
            id: 'btnPackingMaterialSettingInsert',
            iconCls: 'icon-add',
            handler: this.onInsertRow,
            scope: this,
            disabled: Ext.getCmp('cmbType') == undefined || Ext.getCmp('cmbType').getValue() <= 0
        }, {
            xtype: 'tbseparator',
        }, {
            xtype: 'button',
            text: 'Remove',
            iconCls: 'icon-delete',
            scope: this,
            handler: this.onDeleteRow
        }, {
            xtype: 'textfield',
            id: 'txtPackingMaterialSetting',
            emptyText: 'Type search text here',
            submitEmptyText: false,
            enableKeyEvents: true,
            style: {
                borderRadius: '25px',
                padding: '0 10px',
                width: '300px'
            },
            listeners: {
                specialkey: function (field, e) {
                    if (e.getKey() == e.ENTER) {
                        var grid = Ext.getCmp('PackingMaterialSetting-grid');
                        var type = Ext.getCmp('cmbType').getValue();
                        grid.LoadGrid(type, field.getValue());
                    }
                },
                keyup: function (field, e) {
                    if (field.getValue() == '') {
                        var grid = Ext.getCmp('PackingMaterialSetting-grid');
                        var type = Ext.getCmp('cmbType').getValue();
                        grid.LoadGrid(type, field.getValue());
                    }
                }
            }
        }, {
            xtype: 'tbfill'
        }, 'Material Type: ', {
            id: 'cmbType',
            xtype: 'combo',
            triggerAction: 'all',
            mode: 'local',
            forceSelection: true,
            emptyText: '---Select---',
            allowBlank: false,
            typeAhead: false,
            store: new Ext.data.ArrayStore({
                fields: ['Id', 'Name'],
                data: [[1, 'Standard'], [2, 'Crate and Box']]
            }),
            valueField: 'Id',
            displayField: 'Name',
            listeners: {
                select: function (cmb, idx) {
                    Ext.getCmp('btnPackingMaterialSettingInsert').enable();
                    var search = Ext.getCmp('txtPackingMaterialSetting').getValue();
                    Ext.getCmp('PackingMaterialSetting-grid').LoadGrid(idx.data.Id, search);
                }
            }

        }],
        Ext.erp.iffs.ux.PackingMaterialSetting.Grid.superclass.initComponent.apply(this, arguments);
    },
    LoadGrid: function (id, searchText) {
        var grid = this; //Ext.getCmp('PackingMaterialSetting-grid');
        if (id == "")
            return;
        grid.getStore().baseParams = { record: Ext.encode({ MaterialType: id, SearchText: searchText }) };
        grid.getStore().load({
            params: {
                start: 0,
                limit: grid.pageSize
            }
        });

    },
    SaveDetail: function () {
        var grid = this;//Ext.getCmp('PackingMaterialSetting-grid');
        var Type = Ext.getCmp('cmbType').getValue();

        var gridStore = grid.getStore();
        var modifiedRecs = gridStore.getModifiedRecords()

        var totalCount = modifiedRecs.length;
        var QuantityError = '';

        var recs = [];

        Ext.each(modifiedRecs, function (item) {
            if (item.data.Name != "" && item.data.MeasurmentUnit != "") {
                recs.push(item.data);
            }
        });

        if (QuantityError != '') {
            Ext.MessageBox.show({
                title: 'Packing Material Setting  ',
                msg: extMessage + ', Since ' + QuantityError + ', So the Packing Material Setting detail has been jumped!',
                buttons: Ext.Msg.OK,
            });
            return;
        }

        PackingMaterialSetting.SaveDetail(Type, recs, function (rest, resp) {
            Ext.MessageBox.show({
                title: rest.success ? 'Packing Material Setting' : 'Error',
                msg: rest.data,
                buttons: Ext.Msg.OK,
                icon: rest.success ? Ext.MessageBox.INFO : Ext.MessageBox.ERROR,
            });
            if (rest.success) {
                Ext.getCmp('cmbMeasurmentUnit').doQuery('', true);
                Ext.getCmp('PackingMaterialSetting-paging').doRefresh();
            }

        });
    },
    onInsertRow: function () {
        var grid = this;
        var store = grid.getStore();
        var requestDetail = store.recordType;
        var p = new requestDetail({
            Id: 0,
            SizeCMB: '',
            Name: '',
            MeasurmentUnit: '', MeasurmentUnitRaw: '',
            Description: '',
            MaterialType: 0,
            Length: '', Width: '', Height: '',
            Remark: '',
        });
        //var count = store.getCount();
        grid.stopEditing();

        store.insert(0, p);
        //if (count > 0) {
        //    grid.startEditing(count, 2);
        //}

    },
    onDeleteRow: function () {
        var grid = this;
        if (!grid.getSelectionModel().hasSelection()) return;
        var selected = grid.getSelectionModel().getSelections();
        var recs = [];
        Ext.each(selected, function (item) {
            recs.push(item.data);
        });
        Ext.MessageBox.show({
            title: 'Delete',
            msg: 'Are you sure you want to delete the selected record',
            buttons: {
                ok: 'Yes',
                no: 'No'
            },
            icon: Ext.MessageBox.QUESTION,
            fn: function (btn) {
                if (btn == 'ok') {
                    PackingMaterialSetting.Delete(recs, function (result, response) {
                        Ext.MessageBox.show({
                            title: result.success ? 'Success' : 'Error',
                            msg: result.data,
                            buttons: Ext.Msg.OK,
                            icon: result.success ? Ext.MessageBox.INFO : Ext.MessageBox.ERROR,
                        });
                        grid.store.remove(selected);
                        Ext.getCmp('PackingMaterialSetting-paging').doRefresh();
                    }, this);
                }
            }
        });


    }
});
Ext.reg('PackingMaterialSetting-grid', Ext.erp.iffs.ux.PackingMaterialSetting.Grid);

/**
* @desc      Packing Material Setting window
* @author    Henock Melisse
* @copyright (c) 2017, Cybersoft
* @date      December 15, 2017
* @namespace Ext.erp.iffsux.PackingMaterialSetting
* @class     Ext.erp.iffsux.PackingMaterialSetting.Window
* @extends   Ext.Window
*/
Ext.erp.iffs.ux.PackingMaterialSetting.Window = function (config) {
    Ext.erp.iffs.ux.PackingMaterialSetting.Window.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        width: 870,
        height: 450,
        title: 'Packing Material List Setting',
        closeAction: 'close',
        resizable: false,
        buttonAlign: 'right',
        bodyStyle: 'padding:5px;',
        listeners: {
            show: function () {
                if (this.Id > 0) {
                    Ext.getCmp('PackingMaterialSetting-window').actionType = "Edit";
                    var form = Ext.getCmp('PackingMaterialSetting-form');
                    form.load({
                        params: { id: this.Id },
                        success: function (act, res) {
                            Ext.getCmp('PackingMaterialSettingDetail-grid').loadDetail(res.result.data.Id);
                        }
                    });
                }
            },

        }
    }, config));
}
Ext.extend(Ext.erp.iffs.ux.PackingMaterialSetting.Window, Ext.Window, {
    initComponent: function () {
        this.bbar = [{
            xtype: 'button',
            text: 'Select',
            id: 'btnPackingMaterialSettingSelect',
            iconCls: 'icon-add',
            handler: this.onSelect,
            scope: this,
            disabled: Ext.getCmp('PackingMaterialSetting-grid') == undefined || Ext.getCmp('PackingMaterialSetting-grid').getSelectionModel().length <= 0
        }, {
            xtype: 'tbfill'
        }, {
            text: 'Save',
            iconCls: 'icon-save',
            handler: this.onSave,

        }, {
            xtype: 'tbseparator'
        }, {
            text: 'Close',
            iconCls: 'icon-exit',
            handler: this.onClose,
            scope: this,
        }];
        this.items = [{
            xtype: 'PackingMaterialSetting-grid',
            id: 'PackingMaterialSetting-grid'
        }];
        Ext.erp.iffs.ux.PackingMaterialSetting.Window.superclass.initComponent.call(this, arguments);
    },
    onSelect: function () {
        var gridFrom = Ext.getCmp('PackingMaterialSetting-grid');
        var gridTo = this.CallerGrid;
        var selected = gridFrom.getSelectionModel().getSelections();

        var store = gridTo.getStore();
        var Records = [];

        Ext.each(selected, function (item) {
            var index = store.indexOfId(item.id);
            if (index < 0) {
                item.data.MaterialId = item.data.Id;
                item.data.Id = 0;
                Records.push(item);
            }
        });
        var storeCount = store.getCount();
        if (Records.length > 0)
            store.insert(0, Records);

        store.commitChanges();

    },
    onSave: function () {
        Ext.getCmp('PackingMaterialSetting-grid').SaveDetail();
    },
    onClose: function () {

        if (typeof this.NotificationId != 'undefined') {
            window.PackingMaterialSetting.ChangeViewStatus(this.NotificationId, function (result) {
                if (result.success) {
                    Ext.getCmp('PackingMaterialSetting-paging').doRefresh();
                } else {
                    Ext.MessageBox.show({
                        title: 'Error',
                        msg: action.result.data,
                        buttons: Ext.Msg.OK,
                        icon: Ext.MessageBox.ERROR,

                    });
                }
            });
        }
        this.close();
    }
});
Ext.reg('PackingMaterialSetting-window', Ext.erp.iffs.ux.PackingMaterialSetting.Window);

/**
* @desc      Packing Material Setting panel
* @author    Samson Solomon
* @copyright (c) 2017, Cybersoft
* @date      December 15, 2017
* @namespace Ext.erp.iffs.ux.PackingMaterialSetting
* @class     Ext.erp.iffs.ux.PackingMaterialSetting.Panel
* @extends   Ext.Panel
*/
Ext.erp.iffs.ux.PackingMaterialSetting.Panel = function (config) {
    Ext.erp.iffs.ux.PackingMaterialSetting.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        border: false,
        tbar: {
            xtype: 'toolbar',
            items: [{
                text: 'Save',
                iconCls: 'icon-save',
                handler: this.onSave,
                disabled: !Ext.erp.iffs.ux.Reception.getPermission('Packing Material Request', 'CanAdd'),

            }, {
                xtype: 'button',
                text: 'Delete',
                iconCls: 'icon-delete',
                disabled: !Ext.erp.iffs.ux.Reception.getPermission('Packing Material Request', 'CanDelete'),
                handler: this.onDeleteClick
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Check',
                iconCls: 'icon-select',
                disabled: !Ext.erp.iffs.ux.Reception.getPermission('Packing Material Request', 'CanCertify'),
                handler: this.onCheck
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Approve',
                iconCls: 'icon-accept',
                disabled: !Ext.erp.iffs.ux.Reception.getPermission('Packing Material Request', 'CanApprove'),
                handler: this.onApprove
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Preview',
                iconCls: 'icon-preview',
                handler: this.onPreview
            }, {
                xtype: 'tbfill'
            }, {
                xtype: 'textfield',
                emptyText: 'Type search text here',
                submitEmptyText: false,
                enableKeyEvents: true,
                style: {
                    borderRadius: '25px',
                    padding: '0 10px',
                    width: '300px'
                },
                listeners: {
                    specialkey: function (field, e) {
                        if (e.getKey() == e.ENTER) {
                            var grid = Ext.getCmp('PackingMaterialSetting-grid');
                            grid.store.baseParams['record'] = Ext.encode({ searchText: field.getValue() });
                            grid.store.load({ params: { start: 0, limit: grid.pageSize } });
                        }
                    },
                    keyup: function (field, e) {
                        if (field.getValue() == '') {
                            var grid = Ext.getCmp('PackingMaterialSetting-grid');
                            grid.store.baseParams['record'] = Ext.encode({ searchText: field.getValue() });
                            grid.store.load({ params: { start: 0, limit: grid.pageSize } });
                        }
                    }
                }
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: '',
                iconCls: 'icon-excel',
                handler: function () {
                    var searchText = Ext.getCmp('PackingMaterialSetting.searchText').getValue();
                    window.open('PackingMaterialSetting/ExportToExcel?st=' + searchText, '', '');
                }
            }]
        }
    }, config));
}
Ext.extend(Ext.erp.iffs.ux.PackingMaterialSetting.Panel, Ext.Panel, {
    initComponent: function () {
        this.items = [{
            layout: 'border',
            border: false,
            items: [{
                region: 'center',
                border: false,
                layout: 'fit',
                layout: 'fit',
                margins: '0 3 0 0',
                title: 'Packing Material List Setting',
                items: [{
                    xtype: 'PackingMaterialSetting-grid',
                    id: 'PackingMaterialSetting-grid'
                }]
            }]
        }];
        Ext.erp.iffs.ux.PackingMaterialSetting.Panel.superclass.initComponent.apply(this, arguments);
    },
    onSave: function () {
        Ext.getCmp('PackingMaterialSettingDetail-grid').SaveDetail(action.result.HeaderId);
    },
    onDeleteClick: function () {
        var grid = Ext.getCmp('PackingMaterialSetting-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        Ext.MessageBox.show({
            title: 'Delete',
            msg: 'Are you sure you want to delete the selected PackingMaterialSetting',
            buttons: {
                ok: 'Yes',
                no: 'No'
            },
            icon: Ext.MessageBox.QUESTION,

            fn: function (btn) {
                if (btn == 'ok') {
                    var id = grid.getSelectionModel().getSelected().get('Id');
                    PackingMaterialSetting.Delete(id, function (result, response) {
                        // Ext.getCmp('PackingMaterialSetting-paging').doRefresh();
                        Ext.getCmp('PackingMaterialSetting-grid').getStore().reload();
                        Ext.MessageBox.show({
                            title: result.success ? 'Success' : 'Error',
                            msg: result.data,
                            buttons: Ext.Msg.OK,
                            icon: result.success ? Ext.MessageBox.INFO : Ext.MessageBox.ERROR,

                        });
                    }, this);
                }
            }
        });
    }
});
Ext.reg('PackingMaterialSetting-panel', Ext.erp.iffs.ux.PackingMaterialSetting.Panel);



