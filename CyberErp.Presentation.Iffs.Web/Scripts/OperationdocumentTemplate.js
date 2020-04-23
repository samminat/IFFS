Ext.ns('Ext.erp.iffs.ux.operationDocumentTemplate');

/**
* @desc      OperationDocumentTemplate grid
* @author    Meftuh Mohammed
* @copyright (c) 2017, Cybersoft
* @date      November 01, 2017
* @namespace Ext.erp.iffs.ux.operationDocumentTemplate
* @class     Ext.erp.iffs.ux.operationDocumentTemplate.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.erp.iffs.ux.operationDocumentTemplate.Grid = function (config) {
    Ext.erp.iffs.ux.operationDocumentTemplate.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: OperationDocumentTemplate.GetAll,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|param',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Name',
                direction: 'ASC'
            },
            fields: ['Id', 'DocumentTypeId', 'DocumentType'],
            remoteSort: true
        }),
        id: 'operationDocumentTemplate-grid',
        loadMask: true,
        pageSize: 30,
        stripeRows: true,
        border: false,
        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        }),
        columns: [{
            dataIndex: 'Id',
            header: 'Id',
            sortable: true,
            hidden: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'DocumentTypeId',
            header: 'DocumentTypeId',
            sortable: true,
            hidden: true,
            width: 100,
            menuDisabled: true
        }, new Ext.grid.RowNumberer(), {
            dataIndex: 'DocumentType',
            header: 'DocumentType',
            sortable: true,
            width: 350,
            menuDisabled: true
        }]
    }, config));
};
Ext.extend(Ext.erp.iffs.ux.operationDocumentTemplate.Grid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.store.baseParams = { param: Ext.encode({ searchText: '',operationTypeId:0 }) };
        this.bbar = new Ext.PagingToolbar({
            id: 'operationDocumentTemplate-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.erp.iffs.ux.operationDocumentTemplate.Grid.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {
        this.getStore().load({
            params: {
                start: 0,
                limit: this.pageSize
            }
        });
        Ext.erp.iffs.ux.operationDocumentTemplate.Grid.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('operationDocumentTemplate-grid', Ext.erp.iffs.ux.operationDocumentTemplate.Grid);


/**
* @desc      Item selection window
* @author    Meftuh Mohammed
* @copyright (c) 2017, Cybersoft
* @date      Dec 16, 2017
* @namespace Ext.erp.iffs.ux.operationDocumentTemplate
* @class     Ext.erp.iffs.ux.operationDocumentTemplate.DocumentTypeSelectionWindow
* @extends   Ext.Window
*/
Ext.erp.iffs.ux.operationDocumentTemplate.DocumentTypeSelectionWindow = function (config) {
    Ext.erp.iffs.ux.operationDocumentTemplate.DocumentTypeSelectionWindow.superclass.constructor.call(this, Ext.apply({
        layout: 'form',
        width: 450,
        autoHeight: true,
        closeAction: 'close',
        modal: true,
        saveMode: 'add',
        resizable: false,
        buttonAlign: 'right',
        bodyStyle: 'padding:5px;'
    }, config));
}
Ext.extend(Ext.erp.iffs.ux.operationDocumentTemplate.DocumentTypeSelectionWindow, Ext.Window, {
    initComponent: function () {
        this.grid = new Ext.erp.iffs.ux.operationDocumentTemplate.DocumentTypeSelectionGrid({
        });
        this.items = [this.grid];
        this.bbar = [{
            xtype: 'tbfill'
        }, {
            text: 'Select',
            iconCls: 'icon-accept',
            scope: this,
            handler: this.onSelect
        }, {
            xtype: 'tbseparator'
        }, {
            text: 'Close',
            iconCls: 'icon-exit',
            handler: this.onClose,
            scope: this
        }];
        Ext.erp.iffs.ux.operationDocumentTemplate.DocumentTypeSelectionWindow.superclass.initComponent.call(this, arguments);
    },
    onSelect: function () {
        var selectionGrid = this.grid;
        if (!selectionGrid.getSelectionModel().hasSelection())
            return;
        var selectedItems = selectionGrid.getSelectionModel().getSelections();
        var gridDatastore = this.targetGrid.getStore();
        var item = gridDatastore.recordType;
        for (var i = 0; i < selectedItems.length; i++) {
            var index = -1;
            gridDatastore.each(function (item) {
                if (item.data['DocumentTypeId'] == selectedItems[i].get('Id')) {
                    index = 1;
                }
            });
            if (index == -1) {
                var p = new item({
                    DocumentTypeId: selectedItems[i].get('Id'),
                    DocumentType: selectedItems[i].get('Name'),
                });
                var count = gridDatastore.getCount();
                gridDatastore.insert(count, p);

            }
        }

    },
    onClose: function () {
        this.close();
    }
});
Ext.reg('operationDocumentTemplate-documentTypeSelectionWindow', Ext.erp.iffs.ux.operationDocumentTemplate.DocumentTypeSelectionWindow);
/**
* @desc      Document Type Selection grid
* @author    Meftuh Mohammed
* @copyright (c) 2017, Cybersoft
* @date      Dec 15, 2017
* @namespace Ext.erp.iffs.ux.operationDocumentTemplate
* @class     Ext.erp.iffs.ux.operationDocumentTemplate.DocumentTypeSelectionGrid
* @extends   Ext.grid.GridPanel
*/
var selModel = new Ext.grid.CheckboxSelectionModel();

Ext.erp.iffs.ux.operationDocumentTemplate.DocumentTypeSelectionGrid = function (config) {
    Ext.erp.iffs.ux.operationDocumentTemplate.DocumentTypeSelectionGrid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: Iffs.GetDocumentType,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|param',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Code',
                direction: 'ASC'
            },

            fields: ['Id', 'Name', 'Code'],
            remoteSort: true,
            listeners: {
                beforeLoad: function () {
                    this.body.mask('Loading...', 'x-mask-loading');
                },
                load: function () {
                    this.body.unmask();
                },
                loadException: function () {
                    this.body.unmask();
                },
                scope: this
            }
        }),
        id: 'operationDocumentTemplate-documentTypeSelectionGrid',
        pageSize: 10,
        height: 280,
        stripeRows: true,
        columnLines: true,
        border: false,
        sm: selModel,
        columns: [

        selModel, new Ext.grid.RowNumberer(),
        {
            dataIndex: 'Id',
            header: 'Id',
            sortable: true,
            hidden: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'Name',
            header: 'Name',
            sortable: true,
            width: 250,
            menuDisabled: true
        }
        , {
            dataIndex: 'Code',
            header: 'Code',
            sortable: true,
            width: 120,
            menuDisabled: true
        }
        ]
    }, config));
};
Ext.extend(Ext.erp.iffs.ux.operationDocumentTemplate.DocumentTypeSelectionGrid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.store.baseParams = { param: Ext.encode({ searchText: '' }) };
        this.tbar = [
          '->',
        {
            xtype: 'tbfill'
        }, {
            xtype: 'textfield',
            emptyText: 'Type Search text here and press Enter',
            submitEmptyText: false,
            enableKeyEvents: true,
            style: {
                borderRadius: '25px',
                padding: '0 10px',
                width: '200px'
            },
            listeners: {
                specialKey: function (field, e) {
                    if (e.getKey() == e.ENTER) {
                        var grid = Ext.getCmp('operationDocumentTemplate-documentTypeSelectionGrid');
                        grid.store.baseParams['param'] = Ext.encode({ searchText: field.getValue() });
                        grid.store.load({ params: { start: 0, limit: grid.pageSize } });
                    }
                },
                Keyup: function (field, e) {
                    if (field.getValue() == '') {

                        var grid = Ext.getCmp('operationDocumentTemplate-documentTypeSelectionGrid');
                        grid.store.baseParams['param'] = Ext.encode({ searchText: field.getValue() });
                        grid.store.load({ params: { start: 0, limit: grid.pageSize } });
                    }
                }
            }
        }
        ];
        this.bbar = new Ext.PagingToolbar({
            id: 'operationDocumentTemplate-itemSelectionPaging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.erp.iffs.ux.operationDocumentTemplate.DocumentTypeSelectionGrid.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {
        this.getSelectionModel().clearSelections();
        this.getStore().load({
            params: { start: 0, limit: this.pageSize }
        });
        Ext.erp.iffs.ux.operationDocumentTemplate.DocumentTypeSelectionGrid.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('operationDocumentTemplate-documentTypeSelectionGrid', Ext.erp.iffs.ux.operationDocumentTemplate.DocumentTypeSelectionGrid);

/**
* @desc      OperationDocumentTemplate Item panel
* @author    Meftuh Mohammed
* @copyright (c) 2017, Cybersoft
* @date      November 01, 2017
* @namespace Ext.erp.iffs.ux.operationDocumentTemplate
* @class     Ext.erp.iffs.ux.operationDocumentTemplate.Panel
* @extends   Ext.Panel
*/
Ext.erp.iffs.ux.operationDocumentTemplate.Panel = function (config) {
    Ext.erp.iffs.ux.operationDocumentTemplate.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        border: false,
        tbar: {
            xtype: 'toolbar',
            items: ['Operation Type:', {
                hiddenName: 'OperationTypeId',
                xtype: 'combo',
                id: 'operationDocumentTemplate-OperationTypeId',
                fieldLabel: 'Operation Type',
                triggerAction: 'all',
                mode: 'local',
                anchor: '90%',
                editable: true,
                forceSelection: true,
                emptyText: '---Select---',
                allowBlank: true,
                store: new Ext.data.DirectStore({
                    reader: new Ext.data.JsonReader({
                        successProperty: 'success',
                        idProperty: 'Id',
                        root: 'data',
                        fields: ['Id', 'Name']
                    }),
                    autoLoad: true,
                    api: { read: Iffs.GetOperationType },
                }),
                valueField: 'Id',
                displayField: 'Name',
                listeners: {
                    select: function (cmb, rec, idx) {
                        var detailGrid = Ext.getCmp('operationDocumentTemplate-grid');
                        detailGrid.store.baseParams = { param: Ext.encode({ operationTypeId: rec.id, }) };
                        detailGrid.getStore().load({
                            params: {
                                start: 0,
                                limit: 100
                            }
                        });
                    }
                }
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Select',
                iconCls: 'icon-add',
                handler: this.onAddClick
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Remove',
                iconCls: 'icon-delete',
                handler: function () {
                    var grid = Ext.getCmp('operationDocumentTemplate-grid');
                    if (!grid.getSelectionModel().hasSelection()) return;
                    var selectedrecord = grid.getSelectionModel().getSelected();
                    grid.getStore().remove(selectedrecord);
                }
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Save',
                iconCls: 'icon-save',
                disabled: !Ext.erp.iffs.ux.Reception.getPermission('Operation Document Template', 'CanAdd'),
                handler: this.onSave
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
                            var grid = Ext.getCmp('operationDocumentTemplate-grid');
                            var operationTypeId = Ext.getCmp('operationDocumentTemplate-OperationTypeId').getValue();

                            grid.store.baseParams['param'] = Ext.encode({ searchText: field.getValue(), operationTypeId: operationTypeId });
                            grid.store.load({ params: { start: 0, limit: grid.pageSize } });
                        }
                    },
                    keyup: function (field, e) {
                        if (field.getValue() == '') {
                            var grid = Ext.getCmp('operationDocumentTemplate-grid');
                            var operationTypeId = Ext.getCmp('operationDocumentTemplate-OperationTypeId').getValue();

                            grid.store.baseParams['param'] = Ext.encode({ searchText: field.getValue(), operationTypeId: operationTypeId });
                            grid.store.load({ params: { start: 0, limit: grid.pageSize } });
                        }
                    }
                }
            }]
        }
    }, config));
};
Ext.extend(Ext.erp.iffs.ux.operationDocumentTemplate.Panel, Ext.Panel, {
    initComponent: function () {
        var grid = new Ext.erp.iffs.ux.operationDocumentTemplate.Grid();
        this.items = [grid];

        Ext.erp.iffs.ux.operationDocumentTemplate.Panel.superclass.initComponent.apply(this, arguments);
    },
    onAddClick: function () {
        var operationTypeId = Ext.getCmp('operationDocumentTemplate-OperationTypeId').getValue();
        if (!operationTypeId > 0) {
            Ext.MessageBox.show({
                title: 'Save failed',
                msg: "Please select operation type first", buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.ERROR,
                scope: this
            });
            return;
        }
        var grid = Ext.getCmp('operationDocumentTemplate-grid');
        new Ext.erp.iffs.ux.operationDocumentTemplate.DocumentTypeSelectionWindow({
            title: 'Select Document Type',
            targetGrid: grid
        }).show();
    },
    onSave: function () {
        var grid = Ext.getCmp('operationDocumentTemplate-grid');
        var store = grid.getStore();
        var operationTypeId = Ext.getCmp('operationDocumentTemplate-OperationTypeId').getValue();

        if (store.getCount() == 0) {
            var msg = Ext.MessageBox;
            Ext.MessageBox.show({
                title: 'Save failed',
                msg: "Please fill document Type", buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.ERROR,
                scope: this
            });
            return;
        }
        var records = '';
        store.each(function (item) {
            records = records + item.data['DocumentTypeId'] + ';';
        });
        OperationDocumentTemplate.Save(records, operationTypeId, function (result) {
            if (result.success) {
                Ext.MessageBox.show({
                    title: 'Succeess',
                    msg: result.data,
                    buttons: Ext.Msg.OK,
                    scope: this
                });
            } else {
                Ext.MessageBox.show({
                    title: 'Error',
                    msg: result.data,
                    buttons: Ext.Msg.OK,
                    icon: Ext.MessageBox.ERROR,
                    scope: this
                });
            }
        });
    },
});
Ext.reg('operationDocumentTemplate-panel', Ext.erp.iffs.ux.operationDocumentTemplate.Panel);