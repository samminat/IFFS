Ext.ns('Ext.erp.iffs.ux.PackingListSetting');

/**
* @desc      PackingListSettingTemplate grid
* @author    Henock Melisse
* @copyright (c) 2017, Cybersoft
* @date      December 15, 2017
* @namespace Ext.erp.iffs.ux.PackingListSetting
* @class     Ext.erp.iffs.ux.PackingListSetting.Grid
* @extends   Ext.grid.GridPanel
*/
var extMessage = '';
var texFieldEditor = new Ext.form.TextField({
    allowBlank: true,
    allowNegative: false,
    listeners: {
        focus: function (field) {
            field.selectText();
        }
    }
});
Ext.erp.iffs.ux.PackingListSetting.Grid = function (config) {
    Ext.erp.iffs.ux.PackingListSetting.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: PackingList.GetAllSettings,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Description',
                direction: 'ASC'
            },
            fields: ['Id', 'ParentId', 'Name', 'Code'],
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
            beforeLoad: function () {
                var tree = Ext.getCmp('PackingListSetting-tree');

               // var searchText = Ext.getCmp('SeverancePayDetailSearchText');
                this.getStore().baseParams['record'] = Ext.encode({ ParentId: tree.SelectedNode, searchText: '' });
                this.body.mask('Loading...', 'x-mask-loading');
            },
            load: function () { this.body.unmask(); },
            loadException: function () { this.body.unmask(); },
            scope: this
        },
        columns: [{
            dataIndex: 'Id',
            header: 'Id',
            sortable: true,
            hidden: true,
            width: 100,
            menuDisabled: true
        }, new Ext.grid.RowNumberer(), {
            dataIndex: 'Name',
            header: 'Name',
            sortable: true,
            width: 100,
            menuDisabled: true,
            align: 'left',
            allowBlank: false,
            editor: texFieldEditor
        }, {
            dataIndex: 'Code',
            header: 'Code',
            sortable: true,
            width: 100,
            menuDisabled: true,
            align: 'left',
            allowBlank: false,
            editor: texFieldEditor
        }]
    }, config));
}
Ext.extend(Ext.erp.iffs.ux.PackingListSetting.Grid, Ext.grid.EditorGridPanel, {
    initComponent: function () {
        this.tbar = [{
            xtype: 'button',
            text: 'Insert',
            id: 'insertRows',
            iconCls: 'icon-add',
            handler: this.OnAddRow
        }, {
            xtype: 'button',
            text: 'Remove',
            id: 'deleteRows',
            iconCls: 'icon-delete',
            handler: this.OnDeleteRow
        }, {
            xtype: 'tbfill'
        }, {
            xtype: 'button',
            text: 'Save',
            iconCls: 'icon-save',
            handler: this.OnSave
        }];
        this.store.baseParams = { record: Ext.encode({ searchText: '' }) };
        this.bbar = new Ext.PagingToolbar({
            id: 'PackingListSetting-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.erp.iffs.ux.PackingListSetting.Grid.superclass.initComponent.apply(this, arguments);
    },
 
    OnAddRow: function () {
        var grid = Ext.getCmp('PackingListSetting-grid');
        var store = grid.getStore();
        var record = store.recordType;
        var p = new record({
            Id: 0,
            ParentId: null,
            Name: '',
            Code: '',
        });
        var count = store.getCount();
        grid.stopEditing();

        store.insert(count, p);
        if (count > 0) {
            grid.startEditing(count, 2);
        }
    },
    OnDeleteRow: function () {

        var grid = Ext.getCmp('PackingListSetting-grid');
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
                            Packing.DeletePackingListSetting(id, function (result, response) {
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
    OnSave: function () {
        var grid = Ext.getCmp('PackingListSetting-grid');
        var tree = Ext.getCmp('PackingListSetting-tree');
        var count = grid.getStore().getCount();
        if (tree.getSelectionModel().selNode == null)
            return;
        if (count == 0) {
            Ext.MessageBox.show({
                title: 'Packing List Details ',
                msg: " Packing List Detail is empty !",
                buttons: Ext.Msg.OK,
                scope: this
            });
            return;
        }
        var parentId = tree.SelectedNode == "Root" ? 0 : tree.SelectedNode;
        var gridDatastore = grid.getStore();

        var QuantityError = '';

        var recs = [];

        gridDatastore.each(function (item) {
            if (item.data.Name != "" && item.data.Code != "")
                recs.push(item.data);
        });

        PackingList.SaveSetting(parentId, recs, function (rest, resp) {
            if (rest.success) {
                Ext.MessageBox.show({
                    title: 'Packing List ',
                    msg: rest.data,
                    buttons: Ext.Msg.OK,
                    scope: this
                });
                Ext.getCmp('PackingListSetting-paging').doRefresh();
            } else {
                Ext.MessageBox.show({
                    title: 'Packing List ',
                    msg: rest.data,
                    buttons: Ext.Msg.OK,
                    scope: this
                });
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
Ext.reg('PackingListSetting-grid', Ext.erp.iffs.ux.PackingListSetting.Grid);

/**
* @desc      PackingListSetting Tree
* @author    Samson Solomon
* @copyright (c) 2017 - 2018, Cybersoft
* @date      May 11, 2012
* @namespace Ext.erp.iffs.ux.PackingListSetting
* @class     Ext.erp.iffs.ux.PackingListSetting.Tree
* @extends   Ext.Tee.TreePanel
*/
Ext.erp.iffs.ux.PackingListSetting.Tree = function (config) {
    Ext.erp.iffs.ux.PackingListSetting.Tree.superclass.constructor.call(this, Ext.apply({
        id: 'PackingListSetting-tree',
        loader: new Ext.tree.TreeLoader({
            directFn: PackingList.PopulatePackingList,
            scope: this,
            paramsAsHash: true,
            listeners: {
                beforeload: function (treeLoader, node) {
                    node.getOwnerTree().SelectedNode = node.attributes.id == 'root' ? 'Root' : node.attributes.id;
                },
                scope: this
            }
        }),
        border: false,
        rootVisible: true,
        lines: true,
        autoScroll: true,
        stateful: false,
        selectedLocation: '',
        locationType: 'Root',
        useArrows: true,
        root: {
            text: 'Packing List',
            id: 'root'
        },
        listeners: {
            click: function (node, e) {
                e.stopEvent();
                node.select();
                if (node.isExpandable()) {
                    node.reload();
                }
                node.getOwnerTree().SelectedNode = node.attributes.id == 'root' ? 'Root' : node.attributes.id;
                var grid = Ext.getCmp('PackingListSetting-grid');
                grid.store.baseParams['record'] = Ext.encode({ ParentId: node.id, searchText: '' });
                grid.store.load({ params: { start: 0, limit: grid.pageSize } });
            },
            contextmenu: function (node, e) {
                node.select();
                node.getOwnerTree().SelectedNode = node.attributes.id == 'root' ? 'Root' : node.attributes.id;
                var grid = Ext.getCmp('PackingListSetting-grid');
                grid.store.baseParams['record'] = Ext.encode({ ParentId: node.id, searchText: '' });
                grid.store.load({ params: { start: 0, limit: grid.pageSize } });
            },

            expand: function (p) {
                p.syncSize();
            }
        }
    }, config));
}
Ext.extend(Ext.erp.iffs.ux.PackingListSetting.Tree, Ext.tree.TreePanel, {
    initComponent: function () {
        this.tbar = [{
            xtype: 'displayfield',
            id: 'selected-unit',
            style: 'font-weight: bold'
        }, {
            xtype: 'tbfill'
        }, {
            xtype: 'button',
            id: 'expand-all-Location',
            iconCls: 'icon-expand-all',
            tooltip: 'Expand All',
            handler: function () {
                Ext.getCmp('PackingListSetting-tree').expandAll();
            }
        }, {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            id: 'collapse-all-location',
            iconCls: 'icon-collapse-all',
            tooltip: 'Collapse All',
            handler: function () {
                Ext.getCmp('PackingListSetting-tree').collapseAll();
            }
        }];
        Ext.erp.iffs.ux.PackingListSetting.Tree.superclass.initComponent.call(this, arguments);
    }
});
Ext.reg('PackingListSetting-tree', Ext.erp.iffs.ux.PackingListSetting.Tree);



/**
* @desc      PackingListSetting panel
* @author    Samson Solomon
* @copyright (c) 2017 - 2018, Cybersoft
* @date      May 11, 2012
* @version   $Id: PackingListSetting.js, 0.1
* @namespace Ext.erp.iffs.ux.PackingListSetting
* @class     Ext.erp.iffs.ux.PackingListSetting.Panel
* @extends   Ext.Panel
*/
Ext.erp.iffs.ux.PackingListSetting.Panel = function (config) {
    Ext.erp.iffs.ux.PackingListSetting.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        border: false,
    }, config));
}
Ext.extend(Ext.erp.iffs.ux.PackingListSetting.Panel, Ext.Panel, {
    initComponent: function () {
        this.tree = new Ext.erp.iffs.ux.PackingListSetting.Tree();
        this.grid = new Ext.erp.iffs.ux.PackingListSetting.Grid({ id: 'PackingListSetting-grid' });

        this.items = [{
            layout: 'border',
            border: false,
            defaults: {
                collapsible: true,
                split: true,
            },
            items: [{
                region: 'west',
                border: true,
                layout: 'fit',
                margins: '3 0 0 3',
                width: 350,
                minSize: 300,
                maxSize: 500,
                items: [this.tree],
                autoScroll: true
            }, {
                region: 'center',
                border: true,
                collapsible: false,
                split: true,
                layout: 'fit',
                margins: '3 3 0 0',
                items: [this.grid]
            }]
        }];
        Ext.erp.iffs.ux.PackingListSetting.Panel.superclass.initComponent.apply(this, arguments);
    }
});
Ext.reg('PackingListSetting-panel', Ext.erp.iffs.ux.PackingListSetting.Panel);