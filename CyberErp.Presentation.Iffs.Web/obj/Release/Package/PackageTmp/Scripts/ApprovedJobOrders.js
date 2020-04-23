Ext.ns('Ext.erp.iffs.ux.approvedJobOrders');


/**
* @desc      Approved Job Orders registration form host window
* @author    Dawit Kiros
* @copyright (c) 2017, Cybersoft
* @date      November 01, 2017
* @namespace Ext.erp.iffs.ux.approvedJobOrders
* @class     Ext.erp.iffs.ux.approvedJobOrders.Window
* @extends   Ext.Window
*/

Ext.erp.iffs.ux.approvedJobOrders.Window = function (config) {
    Ext.erp.iffs.ux.approvedJobOrders.Window.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        width: 500,
        autoHeight: true,
        closeAction: 'close',
        modal: true,
        resizable: false,
        buttonAlign: 'right',
        bodyStyle: 'padding:5px;',
        listeners: {
            show: function () {
                
            },
            scope: this
        }
    }, config));
};
Ext.extend(Ext.erp.iffs.ux.approvedJobOrders.Window, Ext.Window, {
    initComponent: function () {
        this.grid = new Ext.erp.iffs.ux.approvedJobOrders.Grid();
        this.items = [this.grid];
        this.buttons = [ {
            text: 'Close',
            iconCls: 'icon-exit',
            handler: this.onClose,
            scope: this
        }];

        Ext.erp.iffs.ux.approvedJobOrders.Window.superclass.initComponent.call(this, arguments);
    },

    onClose: function () {
        this.close();
    }
});
Ext.reg('approvedJobOrders-window', Ext.erp.iffs.ux.approvedJobOrders.Window);

/**
* @desc      Approved Job Orders grid
* @author    Dawit Kiros
* @copyright (c) 2017, Cybersoft
* @date      November 01, 2017
* @namespace Ext.erp.iffs.ux.approvedJobOrders
* @class     Ext.erp.iffs.ux.approvedJobOrders.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.erp.iffs.ux.approvedJobOrders.Grid = function (config) {
    Ext.erp.iffs.ux.approvedJobOrders.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: JobOrder.GetAllApprovedJOs,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Id',
                direction: 'ASC'
            },
            fields: ['Id', 'JobOrderNo', 'ReceivingClient', 'Date','IsViewed'],
            remoteSort: true
        }),
        id: 'approvedJobOrders-grid',
        loadMask: true,
        pageSize: 30,
        height: 300,
        stripeRows: true,
        border: false,
        viewConfig: {
            forceFit: true,
            getRowClass: function (record) {
                return record.get('IsViewed') == false ? 'unviewed-row' : 'viewed-row';
            }
        },
        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        }), listeners: {

            rowdblclick: function () {
                if (!this.getSelectionModel().hasSelection()) return;
                var id = this.getSelectionModel().getSelected().get('Id');

                if (id != null) {


                    new Ext.erp.iffs.ux.approvedJobOrdersViewer.Window({
                        operationTypeId: id,
                        title: 'View Job Order'
                    }).show();

                }

            }
        },
        columns: [{
            dataIndex: 'Id',
            header: 'Id',
            sortable: true,
            hidden: true,
            width: 100,
            menuDisabled: true
        }, new Ext.grid.RowNumberer(), {
            dataIndex: 'JobOrderNo',
            header: 'Job Order No',
            sortable: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'ReceivingClient',
            header: 'Receiving Client',
            sortable: true,
            width: 200,
            menuDisabled: true
        }, {
            dataIndex: 'Date',
            header: 'Date',
            sortable: true,
            width: 150,
            menuDisabled: true
        }, {
            dataIndex: 'IsViewed',
            header: 'IsViewed',
            sortable: true,
            hidden:true,
            width: 150,
            menuDisabled: true
        }]
    }, config));
};
Ext.extend(Ext.erp.iffs.ux.approvedJobOrders.Grid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({ searchText: '' }) };
        this.bbar = new Ext.PagingToolbar({
            id: 'approvedJobOrders-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.erp.iffs.ux.approvedJobOrders.Grid.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {
        this.getStore().load({
            params: {
                start: 0,
                limit: this.pageSize
            }
        });
        Ext.erp.iffs.ux.approvedJobOrders.Grid.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('approvedJobOrders-grid', Ext.erp.iffs.ux.approvedJobOrders.Grid);

/**
* @desc      Approved Job Orders Item panel
* @author    Dawit Kiros
* @copyright (c) 2017, Cybersoft
* @date      November 01, 2017
* @namespace Ext.erp.iffs.ux.approvedJobOrders
* @class     Ext.erp.iffs.ux.approvedJobOrders.Panel
* @extends   Ext.Panel
*/
Ext.erp.iffs.ux.approvedJobOrders.Panel = function (config) {
    Ext.erp.iffs.ux.approvedJobOrders.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        border: false,
        tbar: {
            xtype: 'toolbar',
            items: [{
                xtype: 'button',
                text: 'Add',
                iconCls: 'icon-add',
                handler: this.onAddClick
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Edit',
                iconCls: 'icon-edit',
               
                handler: this.onEditClick
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Delete',
                iconCls: 'icon-delete',
                
                handler: this.onDeleteClick
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
                            var grid = Ext.getCmp('approvedJobOrders-grid');
                            grid.store.baseParams['record'] = Ext.encode({ searchText: field.getValue() });
                            grid.store.load({ params: { start: 0, limit: grid.pageSize } });
                        }
                    },
                    keyup: function (field, e) {
                        if (field.getValue() == '') {
                            var grid = Ext.getCmp('approvedJobOrders-grid');
                            grid.store.baseParams['record'] = Ext.encode({ searchText: field.getValue() });
                            grid.store.load({ params: { start: 0, limit: grid.pageSize } });
                        }
                    }
                }
            }]
        }
    }, config));
};
Ext.extend(Ext.erp.iffs.ux.approvedJobOrders.Panel, Ext.Panel, {
    initComponent: function () {
        var grid = new Ext.erp.iffs.ux.approvedJobOrders.Grid();
        this.items = [grid];

        Ext.erp.iffs.ux.approvedJobOrders.Panel.superclass.initComponent.apply(this, arguments);
    },
    onAddClick: function () {
        new Ext.erp.iffs.ux.approvedJobOrders.Window({
            customerId: 0,
            title: 'Add Customer'
        }).show();
    },
    onEditClick: function () {
        var grid = Ext.getCmp('approvedJobOrders-grid');
        if (!grid.getSelectionModel().hasSelection()) {
            Ext.MessageBox.show({
                title: 'Select',
                msg: 'You must select a record to edit.',
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.INFO,
                scope: this
            });
            return;
        }
        var id = grid.getSelectionModel().getSelected().get('Id');
        new Ext.erp.iffs.ux.approvedJobOrders.Window({
            customerId: id,
            title: 'Edit Customer'
        }).show();
    },
    onDeleteClick: function () {
        var grid = Ext.getCmp('approvedJobOrders-grid');
        if (!grid.getSelectionModel().hasSelection()) {
            Ext.MessageBox.show({
                title: 'Select',
                msg: 'You must select a record to delete.',
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.INFO,
                scope: this
            });
            return;
        }
        Ext.MessageBox.show({
            title: 'Delete',
            msg: 'Are you sure you want to delete the selected record',
            buttons: {
                ok: 'Yes',
                no: 'No'
            },
            icon: Ext.MessageBox.QUESTION,
            scope: this,
            animEl: 'Delete',
            fn: function (btn) {
                if (btn == 'ok') {
                    var id = grid.getSelectionModel().getSelected().get('Id');
                    Customer.Delete(id, function (result, response) {
                        Ext.getCmp('approvedJobOrders-paging').doRefresh();
                    }, this);
                }
            }
        });
    }
});
Ext.reg('approvedJobOrders-panel', Ext.erp.iffs.ux.approvedJobOrders.Panel);