Ext.ns('Ext.erp.iffs.ux.PackingList');

/**
* @desc      PackingListTemplate grid
* @author    Henock Melisse
* @copyright (c) 2017, Cybersoft
* @date      December 15, 2017
* @namespace Ext.erp.iffs.ux.PackingList
* @class     Ext.erp.iffs.ux.PackingList.Grid
* @extends   Ext.grid.GridPanel
*/
var extMessage = '';
Ext.erp.iffs.ux.PackingList.Grid = function (config) {
    Ext.erp.iffs.ux.PackingList.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: Packing.GetPackingList,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Description',
                direction: 'ASC'
            },
            fields: ['Id', 'HeaderId', 'OperationId','Description', 'CartonNumber', 'CrateNumber', 'Weight', 'Value', 'LabelId'],
            remoteSort: true
        }),
        pageSize: 30,
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
            header: 'Id',
            sortable: true,
            hidden: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'HeaderId',
            header: 'HeaderId',
            sortable: true,
            hidden: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'OperationId',
            header: 'OperationId',
            sortable: true,
            hidden: true,
            width: 100,
            menuDisabled: true
        }, new Ext.grid.RowNumberer(), {
            dataIndex: 'Description',
            header: 'Description',
            sortable: true,
            width: 100,
            menuDisabled: true,
            align: 'left',
            allowBlank: false,
            editor: new Ext.form.TextField({
                allowBlank: true,
                allowNegative: false,
                listeners: {
                    focus: function (field) {
                        field.selectText();
                    }
                }
            })
        }, {
            dataIndex: 'CartonNumber',
            header: 'Carton No.',
            sortable: true,
            width: 100,
            menuDisabled: true,
            align: 'left',
            allowBlank: false,
            editor: new Ext.form.TextField({
                allowBlank: true,
                allowNegative: false,
                listeners: {
                    focus: function (field) {
                        field.selectText();
                    }
                }
            })
        }, {
            dataIndex: 'CrateNumber',
            header: 'Crate No.',
            sortable: true,
            width: 100,
            menuDisabled: true,
            align: 'left',
            allowBlank: false,
            editor: new Ext.form.TextField({
                allowBlank: true,
                allowNegative: false,
                listeners: {
                    focus: function (field) {
                        field.selectText();
                    }
                }
            })
        }, {
            dataIndex: 'Weight',
            header: 'Weight',
            sortable: true,
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
        }, {
            dataIndex: 'Value',
            header: 'Value',
            sortable: true,
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
        }, {
            dataIndex: 'LabelId',
            header: 'Label',
            sortable: true,
            width: 100,
            menuDisabled: true,
            forceSelection: true,
            xtype: 'combocolumn',
            allowBlank: false,
            editor: new Ext.form.ComboBox({
                typeAhead: false,
                triggerAction: 'all',
                mode: 'local',
                store: new Ext.data.DirectStore({
                    reader: new Ext.data.JsonReader({
                        successProperty: 'success',
                        idProperty: 'Id',
                        root: 'data',
                        fields: ['Id', 'Name']
                    }),
                    autoLoad: true,
                    api: { read: Packing.GetLabels }
                }),
                valueField: 'Id',
                displayField: 'Name'
            })
        }]
    }, config));
}
Ext.extend(Ext.erp.iffs.ux.PackingList.Grid, Ext.grid.EditorGridPanel, {
    initComponent: function () {
        this.tbar = [{
            xtype: 'button',
            text: 'Insert',
            id: 'insertRows',
            iconCls: 'icon-add',
            handler: this.addRow
        }, {
            xtype: 'button',
            text: 'Remove',
            id: 'deleteRows',
            iconCls: 'icon-delete',
            handler: this.deleteRow
        }, {
            xtype: 'tbfill'
        }, {
            xtype: 'button',
            text: 'Save',
            iconCls: 'icon-save',
            handler: this.savePackingList
        }];
        this.store.baseParams = { record: Ext.encode({ searchText: '' }) };
        this.bbar = new Ext.PagingToolbar({
            id: 'PackingList-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.erp.iffs.ux.PackingList.Grid.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {
        //this.getStore().load({
        //    params: { start: 0, limit: this.pageSize }
        //});
        this.addRow();
        Ext.erp.iffs.ux.PackingList.Grid.superclass.afterRender.apply(this, arguments);
    },
    addRow: function () {
        var grid = Ext.getCmp('PackingList-grid');
        var store = grid.getStore();
        var requestDetail = store.recordType;
        var p = new requestDetail({
            Id: 0,
            OperationId: 0,
            HeaderId: 0,
            Description: '',
            CartonNumber: '',
            CrateNumber: '',
            Weight: 0,
            Value: 0,
            LabelId: ''
        });
        var count = store.getCount();
        grid.stopEditing();

        store.insert(count, p);
        if (count > 0) {
            grid.startEditing(count, 2);
        }
    },
    deleteRow: function () {

        var grid = Ext.getCmp('PackingList-grid');
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
                            Packing.DeletePackingList(id, function (result, response) {
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
    },
    savePackingList: function () {
        var grid = Ext.getCmp('PackingList-grid');
        var packingGrid = Ext.getCmp('Packing-grid');
        if (!packingGrid.getSelectionModel().hasSelection()) return;
        var headerId = packingGrid.getSelectionModel().getSelected().get('Id');
        var OperationId = packingGrid.getSelectionModel().getSelected().get('OperationId');
        var gridDatastore = grid.getStore();
        var totalCount = gridDatastore.getCount();
        var QuantityError = '';

        var PackingList = [];

        gridDatastore.each(function (item) {
            if (item.data['Description'] == null || item.data['Description'] == "" ||
                item.data['CartonNumber'] == null || item.data['CartonNumber'] == "" ||
                item.data['CrateNumber'] == null || item.data['CrateNumber'] == "" ||
                item.data['Weight'] == null || item.data['Weight'] == "" ||
                item.data['Value'] == null || item.data['Value'] == "" ||
                item.data['LabelId'] == null || item.data['LabelId'] == "") {
                QuantityError = 'All the fields must be filled!';
            }
            PackingList.push(item.data);
        });


        if (totalCount == 0) {
            Ext.MessageBox.show({
                title: 'Packing List Details ',
                msg: " Packing List Detail is empty !",
                buttons: Ext.Msg.OK,
                scope: this
            });
            return;
        }
        if (QuantityError != '') {
            Ext.MessageBox.show({
                title: 'PackingList ',
                msg: ' the Packing List has been jumped!',
                buttons: Ext.Msg.OK,
                scope: this
            });
            return;
        }

        Packing.SavePackingList(headerId, OperationId, PackingList, function (rest, resp) {
            if (rest.success) {
                Ext.MessageBox.show({
                    title: 'Packing List ',
                    msg: rest.data,
                    buttons: Ext.Msg.OK,
                    scope: this
                });
                Ext.getCmp('PackingList-paging').doRefresh();
            }
        });
    },
    loadDetail: function (HeaderId) {
        var DetailStore = this.getStore();

        DetailStore.baseParams = { record: Ext.encode({ HeaderId: HeaderId }) };
        DetailStore.load({
            params: { start: 0, limit: this.pageSize }
        });
    }
});
Ext.reg('PackingList-grid', Ext.erp.iffs.ux.PackingList.Grid);
