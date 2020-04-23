Ext.ns('Ext.erp.iffs.ux.quotationTemplate');

/**
* @desc      QuotationTemplate grid
* @author    Meftuh Mohammed
* @copyright (c) 2017, Cybersoft
* @date      November 01, 2017
* @namespace Ext.erp.iffs.ux.quotationTemplate
* @class     Ext.erp.iffs.ux.quotationTemplate.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.erp.iffs.ux.quotationTemplate.Grid = function (config) {
    Ext.erp.iffs.ux.quotationTemplate.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: QuotationTemplate.GetAll,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|param',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Name',
                direction: 'ASC'
            },
            fields: ['Id', 'ServiceId', 'Service', 'Name', 'Code'],
            remoteSort: true
        }),
        id: 'quotationTemplate-grid',
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
            dataIndex: 'ServiceId',
            header: 'ServiceId',
            sortable: true,
            hidden: true,
            width: 100,
            menuDisabled: true
        }, new Ext.grid.RowNumberer(), {
            dataIndex: 'Name',
            header: 'Name',
            sortable: true,
            width: 350,
            menuDisabled: true
        }, {
            dataIndex: 'Code',
            header: 'Code',
            sortable: true,
            width: 160,
            menuDisabled: true
        }]
    }, config));
};
Ext.extend(Ext.erp.iffs.ux.quotationTemplate.Grid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.store.baseParams = { param: Ext.encode({ searchText: '',operationTypeId:0 }) };
        this.bbar = new Ext.PagingToolbar({
            id: 'quotationTemplate-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.erp.iffs.ux.quotationTemplate.Grid.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {
        this.getStore().load({
            params: {
                start: 0,
                limit: this.pageSize
            }
        });
        Ext.erp.iffs.ux.quotationTemplate.Grid.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('quotationTemplate-grid', Ext.erp.iffs.ux.quotationTemplate.Grid);




/**
* @desc      QuotationTemplate Item panel
* @author    Meftuh Mohammed
* @copyright (c) 2017, Cybersoft
* @date      November 01, 2017
* @namespace Ext.erp.iffs.ux.quotationTemplate
* @class     Ext.erp.iffs.ux.quotationTemplate.Panel
* @extends   Ext.Panel
*/
Ext.erp.iffs.ux.quotationTemplate.Panel = function (config) {
    Ext.erp.iffs.ux.quotationTemplate.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        border: false,
        tbar: {
            xtype: 'toolbar',
            items: ['Operation Type:', {
                hiddenName: 'OperationTypeId',
                xtype: 'combo',
                id:'quotationTemplate-OperationTypeId',
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
                        var detailGrid = Ext.getCmp('quotationTemplate-grid');
                        detailGrid.store.baseParams = { param: Ext.encode({ operationTypeId: rec.id,}) };
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
                    var grid = Ext.getCmp('quotationTemplate-grid');
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
                disabled: !Ext.erp.iffs.ux.Reception.getPermission('Quotation Template', 'CanAdd'),
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
                            var grid = Ext.getCmp('quotationTemplate-grid');
                            var operationTypeId = Ext.getCmp('quotationTemplate-OperationTypeId').getValue();
                            grid.store.baseParams['param'] = Ext.encode({ searchText: field.getValue(), operationTypeId: operationTypeId });
                            grid.store.load({ params: { start: 0, limit: grid.pageSize } });
                        }
                    },
                    keyup: function (field, e) {
                        if (field.getValue() == '') {
                            var grid = Ext.getCmp('quotationTemplate-grid');
                            var operationTypeId = Ext.getCmp('quotationTemplate-OperationTypeId').getValue();
                            grid.store.baseParams['param'] = Ext.encode({ searchText: field.getValue(), operationTypeId: operationTypeId });
                            grid.store.load({ params: { start: 0, limit: grid.pageSize } });
                        }
                    }
                }
            }]
        }
    }, config));
};
Ext.extend(Ext.erp.iffs.ux.quotationTemplate.Panel, Ext.Panel, {
    initComponent: function () {
        var grid = new Ext.erp.iffs.ux.quotationTemplate.Grid();
        this.items = [grid];

        Ext.erp.iffs.ux.quotationTemplate.Panel.superclass.initComponent.apply(this, arguments);
    },
    onAddClick: function () {
        var operationTypeId = Ext.getCmp('quotationTemplate-OperationTypeId').getValue();
        if (!operationTypeId > 0) {
            Ext.MessageBox.show({
                title: 'Save failed',
                msg: "Please select operation type first", buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.ERROR,
                scope: this
            });
            return;
        }
        var grid = Ext.getCmp('quotationTemplate-grid');
        new Ext.erp.iffs.ux.common.ServiceSelectionWindow({
            title: 'Select Service',
            targetGrid: grid
        }).show();
    },
    onSave: function () {
        var grid = Ext.getCmp('quotationTemplate-grid');
        var store = grid.getStore();
        var operationTypeId = Ext.getCmp('quotationTemplate-OperationTypeId').getValue();
       
        if (store.getCount() == 0) {
            var msg = Ext.MessageBox;
            Ext.MessageBox.show({
                title: 'Save failed',
                msg: "Please fill services", buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.ERROR,
                scope: this
            });
            return;
        }
        var records = '';
        store.each(function (item) {
            records = records + item.data['ServiceId'] + ';';
        });
        QuotationTemplate.Save(records, operationTypeId, function (result) {
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
Ext.reg('quotationTemplate-panel', Ext.erp.iffs.ux.quotationTemplate.Panel);