Ext.ns('Ext.erp.iffs.ux.notifications');


/**
* @desc      Approved Job Orders registration form host window
* @author    Dawit Kiros
* @copyright (c) 2017, Cybersoft
* @date      November 01, 2017
* @namespace Ext.erp.iffs.ux.notifications
* @class     Ext.erp.iffs.ux.notifications.Window
* @extends   Ext.Window
*/
Ext.erp.iffs.ux.notifications.Window = function (config) {
    Ext.erp.iffs.ux.notifications.Window.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        width: 700,
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
Ext.extend(Ext.erp.iffs.ux.notifications.Window, Ext.Window, {
    initComponent: function () {
        this.grid = new Ext.erp.iffs.ux.notifications.Grid();
        this.items = [this.grid];
        this.buttons = [{
            text: 'Close',
            iconCls: 'icon-exit',
            handler: this.onClose,
            scope: this
        }];

        Ext.erp.iffs.ux.notifications.Window.superclass.initComponent.call(this, arguments);
    },

    onClose: function () {
        this.close();
    }
});
Ext.reg('notifications-window', Ext.erp.iffs.ux.notifications.Window);



/**
* @desc      JobOrderTemplate registration form host window
* @author    Henock Melisse
* @copyright (c) 2017, Cybersoft
* @date      December 15, 2017
* @namespace Ext.erp.iffsux.jobOrder
* @class     Ext.erp.iffsux.jobOrder.Window
* @extends   Ext.Window
*/
Ext.erp.iffs.ux.notifications.JobOrderWindow = function (config) {
    Ext.erp.iffs.ux.notifications.JobOrderWindow.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        width: 750,
        closable: false,
        autoHeight: true,
        closeAction: 'close',
        modal: true,
        resizable: false,
        buttonAlign: 'right',
        bodyStyle: 'padding:5px;',
        listeners: {
            show: function () {
                var form = Ext.getCmp('jobOrder-form');

                form.load({
                    params: { id: this.operationTypeId },
                    success: function () {
                        form.disable();
                    }
                });

                var grid = Ext.getCmp('jobOrder-detailGrid');
                var store = grid.getStore();
                store.baseParams = { record: Ext.encode({ operationTypeId: this.operationTypeId, source: 'Edit' }) };
                store.load({ params: { start: 0, limit: grid.pageSize } });
            },
            scope: this
        }
    }, config));
}
Ext.extend(Ext.erp.iffs.ux.notifications.JobOrderWindow, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.erp.iffs.ux.jobOrder.Form();
        this.gridDetail = new Ext.erp.iffs.ux.jobOrder.GridDetail();
        this.items = [this.form, this.gridDetail];

        this.bbar = [{
            xtype: 'tbfill'
        }, {
            text: 'Close',
            iconCls: 'icon-exit',
            handler: this.onClose,
            scope: this
        }];
        Ext.erp.iffs.ux.notifications.JobOrderWindow.superclass.initComponent.call(this, arguments);
    },
    onClose: function () {

        window.Notifications.ChangeViewStatus(this.NotificationId, function (result) {
            if (result.success) {
                Ext.getCmp('notifications-paging').doRefresh();
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


        this.close();
    }
});
Ext.reg('operation-JobOrderWindow', Ext.erp.iffs.ux.notifications.JobOrderWindow);


/**
* @desc      Approved Job Orders grid
* @author    Dawit Kiros
* @copyright (c) 2017, Cybersoft
* @date      November 01, 2017
* @namespace Ext.erp.iffs.ux.notifications
* @class     Ext.erp.iffs.ux.notifications.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.erp.iffs.ux.notifications.Grid = function (config) {
    Ext.erp.iffs.ux.notifications.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: Notifications.GetAllByUser,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|param',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Id',
                direction: 'ASC'
            },
            fields: ['Id', 'ObjectId', 'ActorId', 'PreparedById', 'DocumentNo', 'Operation', 'Message', 'Date', 'IsViewed'],
            remoteSort: true
        }),
        id: 'notifications-grid',
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
            rowdblclick: function (grid, rowIndex, e) {
                this.loadWindow();
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
        }, new Ext.grid.RowNumberer(), {
            dataIndex: 'ObjectId',
            header: 'ObjectId',
            sortable: true,
            hidden: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'ActorId',
            header: 'ActorId',
            sortable: true,
            hidden: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'PreparedById',
            header: 'PreparedById',
            sortable: true,
            //hidden: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'DocumentNo',
            header: 'DocumentNo',
            sortable: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'Operation',
            header: 'Operation',
            sortable: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'Message',
            header: 'Message',
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
            hidden: true,
            width: 150,
            menuDisabled: true
        }]
    }, config));
};
Ext.extend(Ext.erp.iffs.ux.notifications.Grid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.store.baseParams = { param: Ext.encode({ searchText: '' }) };
        this.bbar = new Ext.PagingToolbar({
            id: 'notifications-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.erp.iffs.ux.notifications.Grid.superclass.initComponent.apply(this, arguments);

    },
    loadWindow: function () {
        var grid = Ext.getCmp('notifications-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        var objectId = grid.getSelectionModel().getSelected().get('ObjectId');
        var preparedById = grid.getSelectionModel().getSelected().get('PreparedById');
        var actorId = grid.getSelectionModel().getSelected().get('ActorId');
        var operationType = grid.getSelectionModel().getSelected().get('Operation');
        var notificationId = grid.getSelectionModel().getSelected().get('Id');

        if (operationType === constants.NTF_OPN_JOB_ORDER) {
            if (preparedById === actorId) {
                new Ext.erp.iffs.ux.jobOrder.Window({
                    operationTypeId: objectId,
                    NotificationId: notificationId,
                    title: 'Job Order'
                }).show();
            } else {
                new Ext.erp.iffs.ux.notifications.JobOrderWindow({
                    operationTypeId: objectId,
                    NotificationId: notificationId,
                    title: 'Job Ordertt'
                }).show();
            }

        }
        else if (operationType === constants.NTF_OPN_SURVEYREQUEST) {
            new Ext.erp.iffs.ux.SurveyRequest.Window({
                Id: objectId,
                isRevised: false,
                title: 'Survey Request'
            }).show();
        }
    },
    afterRender: function () {
        this.getStore().load({
            params: {
                start: 0,
                limit: this.pageSize
            }
        });
        Ext.erp.iffs.ux.notifications.Grid.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('notifications-grid', Ext.erp.iffs.ux.notifications.Grid);

/**
* @desc      Approved Job Orders Item panel
* @author    Dawit Kiros
* @copyright (c) 2017, Cybersoft
* @date      November 01, 2017
* @namespace Ext.erp.iffs.ux.notifications
* @class     Ext.erp.iffs.ux.notifications.Panel
* @extends   Ext.Panel
*/
Ext.erp.iffs.ux.notifications.Panel = function (config) {
    Ext.erp.iffs.ux.notifications.Panel.superclass.constructor.call(this, Ext.apply({
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
                            var grid = Ext.getCmp('notifications-grid');
                            grid.store.baseParams['record'] = Ext.encode({ searchText: field.getValue() });
                            grid.store.load({ params: { start: 0, limit: grid.pageSize } });
                        }
                    },
                    keyup: function (field, e) {
                        if (field.getValue() == '') {
                            var grid = Ext.getCmp('notifications-grid');
                            grid.store.baseParams['record'] = Ext.encode({ searchText: field.getValue() });
                            grid.store.load({ params: { start: 0, limit: grid.pageSize } });
                        }
                    }
                }
            }]
        }
    }, config));
};
Ext.extend(Ext.erp.iffs.ux.notifications.Panel, Ext.Panel, {
    initComponent: function () {
        var grid = new Ext.erp.iffs.ux.notifications.Grid();
        this.items = [grid];

        Ext.erp.iffs.ux.notifications.Panel.superclass.initComponent.apply(this, arguments);
    },
    onAddClick: function () {
        new Ext.erp.iffs.ux.notifications.Window({
            customerId: 0,
            title: 'Add Customer'
        }).show();
    }


});
Ext.reg('notifications-panel', Ext.erp.iffs.ux.notifications.Panel);