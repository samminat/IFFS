
Ext.ns('Ext.erp.iffs.ux.users');
Ext.ns('Ext.erp.iffs.ux.operationType');
Ext.ns('Ext.erp.iffs.ux.userOperationType');


var selModelUserOperationType = new Ext.grid.CheckboxSelectionModel();

/**
* @desc      Requested licenses Grid
* @author    Dawit Kiros
* @copyright (c) 2017, Cybersoft
* @date      December 23, 2017
* @namespace Ext.erp.iffs.ux.operationType
* @class     Ext.erp.iffs.ux.operationType.Grid
* @extends   Ext.form.FormPanel
*/



Ext.erp.iffs.ux.operationType.Grid = function (config) {
    Ext.erp.iffs.ux.operationType.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: Lookup.GetAll,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: { field: 'Id', direction: 'ASC' },
            fields: ['Id', 'Code', 'Name'],
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
        id: 'operationType-grid',
       
        ddGroup: 'userOperationType-grid',
        pageSize: 20,
        stripeRows: true,
        enableDragDrop: true,
        columnLines: true,
        border: false,
        margins: '00 0 0 0',
        // sm: selModel_OperationType,
        sm: new Ext.grid.RowSelectionModel({
                singleSelect: false
            }),
        viewConfig: {
            forceFit: true,
            autoFill: true
        },

        listeners: {
            rowClick: function () {
                if (!this.getSelectionModel().hasSelection()) return;
                var id = this.getSelectionModel().getSelected().get('Id');
                var gridOperationTypes = Ext.getCmp('userOperationType-grid');
               
                //Check if there is any unsaved data before reloading the grid 

                gridOperationTypes.getStore().load({
                    params: {
                        start: 0,
                        limit: 20,
                        sort: '',
                        dir: '',
                        OperationId: id
                    }
                });
                //}

            }
        },
        columns: [
            new Ext.erp.ux.grid.PagingRowNumberer(),
          
           {
               dataIndex: 'Id',
               header: 'Id',
               sortable: true,
               hidden: true,
               width: 100,
               menuDisabled: true
           }, {
               dataIndex: 'Code',
               header: 'Code',
               sortable: true,
               menuDisabled: true
           }, {
               dataIndex: 'Name',
               header: 'Name',
               sortable: true,
               menuDisabled: true
           }]
    }, config));
};
Ext.extend(Ext.erp.iffs.ux.operationType.Grid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({ CustomerId: this.lrCustId }) };
        this.tbar = ['->', {
            xtype: 'displayfield',
            style: 'font-weight: bold',
            value: 'Operation Types'
        },
         '->', {
             xtype: 'hidden',
             text: 'Move',
             iconCls: 'icon-FillRightHS',
             handler: function () {
                 //                 new Ext.erp.iffs.ux.licenseStatus.Window().show();
             }
         }];
        this.bbar = new Ext.PagingToolbar({
            id: 'operationType-paging',
            store: this.store,
            displayInfo: false,
            pageSize: this.pageSize
        });
        Ext.erp.iffs.ux.operationType.Grid.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {
        var firstGridDropTargetEl = Ext.getCmp('operationType-grid').getView().scroller.dom;
        var firstGridDropTarget = new Ext.dd.DropTarget(firstGridDropTargetEl, {
            ddGroup: 'operationType-grid',
            notifyDrop: function (ddSource, e, data) {
                var firstGrid = Ext.getCmp('users-grid');
                if (!firstGrid.getSelectionModel().hasSelection()) {
                    Ext.MessageBox.show({
                        title: 'Select Employee',
                        msg: 'You must select an employee to proceed with the mapping.',
                        buttons: Ext.Msg.OK,
                        icon: Ext.MessageBox.INFO,
                        scope: this
                    });
                    return;
                }
                var records = ddSource.dragData.selections;
                Ext.each(records, ddSource.grid.store.remove, ddSource.grid.store);
                Ext.getCmp('operationType-grid').store.add(records);
                return true;
            }
        });
        this.store.baseParams['record'] = Ext.encode({ tableName: 'iffsLupOperationType' });
        this.getStore().load({
            params: { start: 0, limit: this.pageSize }
        });
        Ext.erp.iffs.ux.operationType.Grid.superclass.afterRender.apply(this, arguments);
    }
    
});

Ext.reg('operationType-grid', Ext.erp.iffs.ux.operationType.Grid);


/**
* @desc      User Operation Type Mapping grid
* @author    Dawit Kiros
* @copyright (c) 2017, Cybersoft
* @date      December 23, 2017
* @namespace Ext.erp.iffs.ux.users
* @class     Ext.erp.iffs.ux.users.Grid
* @extends   Ext.form.FormPanel
*/





Ext.erp.iffs.ux.userOperationType.Grid = function (config) {
    Ext.erp.iffs.ux.userOperationType.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: window.UserOperationTypeMapping.GetAllByOperation,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record|OperationId',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: { field: 'Id', direction: 'ASC' },
            fields: ['Id', 'UserName', 'FirstName', 'LastName'],
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
        id: 'userOperationType-grid',
        //ddGroup: 'operationType-grid',
        pageSize: 20,
        stripeRows: true,
        enableDragDrop: true,
        columnLines: true,
        border: false,
        sm: selModelUserOperationType,
        viewConfig: {
            forceFit: true,
            autoFill: true
        },
        columns: [
            new Ext.erp.ux.grid.PagingRowNumberer(),
           selModelUserOperationType,
           {
               dataIndex: 'Id',
               header: 'Id',
               sortable: true,
               hidden: true,
               width: 100,
               menuDisabled: true
           }, {
               dataIndex: 'UserName',
               header: 'User Name',
               sortable: true,
               menuDisabled: true
           }, {
               dataIndex: 'FirstName',
               header: 'First Name',
               sortable: true,
               menuDisabled: true
           }, {
               dataIndex: 'LastName',
               header: 'Last Name',
               sortable: true,
               menuDisabled: true
           }]
    }, config));
};
Ext.extend(Ext.erp.iffs.ux.userOperationType.Grid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({ CustomerId: this.lrCntrActlId }) };
        this.tbar = [{
            xtype: 'button',
            text: 'Add Users',
            id: 'btnAddUsers',
            iconCls: 'icon-add',
            handler: this.onAddClick
        }, {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            text: 'Save Mapping',
            id: 'btnSaveMapping',
            iconCls: 'icon-save',
            handler: this.onSaveMappingClick
        }, {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            text: 'Drop',
            id: 'btnDropMapping',
            iconCls: 'icon-delete',
            handler: this.onDropClick
        }, '->', {
            xtype: 'displayfield',
            style: 'font-weight: bold',
            //width: 300,
            value: 'User Specific Operation Types'
        }
        ];

        this.bbar = new Ext.PagingToolbar({
            id: 'userOperationType-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.erp.iffs.ux.userOperationType.Grid.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {
      
        Ext.erp.iffs.ux.userOperationType.Grid.superclass.afterRender.apply(this, arguments);
    },
    onAddClick: function () {
        new Ext.erp.iffs.ux.usersSelector.Window({
            title: 'Select Users'
        }).show();
    },
    onSaveMappingClick: function () {
        var gridHeader = Ext.getCmp('operationType-grid');
            var gridDetail = Ext.getCmp('userOperationType-grid');
            var Id = gridHeader.getSelectionModel().getSelected().get('Id');
            var rec = '';

            if (!gridHeader.getSelectionModel().hasSelection()) {
                Ext.MessageBox.show({
                    title: 'Select User',
                    msg: 'Please select an operation type to proceed.',
                    buttons: Ext.Msg.OK,
                    icon: Ext.MessageBox.ERROR,
                    scope: this
                });
                return;
            }
      

            var selectedEmps = gridDetail.getStore(); 
       

            selectedEmps.each(function (item) {
          
        
                rec = rec + item.data['Id'] + ';';

            
            });


        
            UserOperationTypeMapping.SaveMapping(rec, Id, function (result, response) {
                if (result.success) {
                    Ext.MessageBox.alert('User Operation Type Mapping', 'Attachment has been completed successfully.');
                }
            });

    },
    onDropClick: function () {
        var grid = Ext.getCmp('userOperationType-grid');
        var usersGrid = Ext.getCmp('operationType-grid');
        if (!grid.getSelectionModel().hasSelection()) {
            Ext.MessageBox.show({
                title: 'Select',
                msg: 'You must select an Employee to delete.',
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.INFO,
                scope: this
            });
            return;
        }
        Ext.MessageBox.show({
            title: 'Delete',
            msg: 'Are you sure you want to remove the selected user/s?',
            buttons: {
                ok: 'Yes',
                no: 'No'
            },
            icon: Ext.MessageBox.QUESTION,
            scope: this,
            animEl: 'Delete',
            fn: function (btn) {
                if (btn == 'ok') {
                    Ext.MessageBox.show({
                        title: 'Warning',
                        msg: 'Deleting this user could make other related data invalid. Press Ok to delete, Press Cancel to abort.',
                        buttons: {
                            ok: 'Ok',
                            cancel: 'Cancel'
                        },
                        icon: Ext.MessageBox.WARNING,
                        scope: this,
                        fn: function (btn) {
                            if (btn == 'ok') {
                                var selectionGrid = Ext.getCmp('userOperationType-grid');
                                var emps = '';
                                if (!selectionGrid.getSelectionModel().hasSelection()) return;
                                var selectedEmployees = selectionGrid.getSelectionModel().getSelections();
                                for (var i = 0; i < selectedEmployees.length; i++) {
                                    emps = emps + ':' + selectedEmployees[i].get('Id');
                                }
                                var EmpId = grid.getSelectionModel().getSelected().get('Id');
                                var PItemId = usersGrid.getSelectionModel().getSelected().get('Id');
                                Ext.Ajax.timeout = 6000000;
                                window.UserOperationTypeMapping.DeleteMapping(emps, PItemId, function (result, response) {

                                    var grid = Ext.getCmp('operationType-grid');
                                    var id = grid.getSelectionModel().getSelected().get('Id');
                                    var gridOperationTypes = Ext.getCmp('userOperationType-grid');

                                    //Check if there is any unsaved data before reloading the grid 

                                    gridOperationTypes.getStore().load({
                                        params: {
                                            start: 0,
                                            limit: 20,
                                            sort: '',
                                            dir: '',
                                            OperationId: id
                                        }
                                    });

                                    Ext.MessageBox.show({
                                        title: 'Removed',
                                        msg: 'Successfully Removed',
                                        buttons: Ext.Msg.OK,
                                        icon: Ext.MessageBox.INFO,
                                        scope: this
                                    });

                                }, this);
                            }
                        }
                    });
                }
            }
        });
    }
});
Ext.reg('userOperationType-grid', Ext.erp.iffs.ux.userOperationType.Grid);


/**
* @desc      Customer registration panel
* @author    Dawit Kiros
* @copyright (c) 2017, Cybersoft
* @date      December 23, 2017
* @namespace Ext.erp.iffs.ux.users
* @class     Ext.erp.iffs.ux.users.Panel
* @extends   Ext.form.FormPanel
*/

Ext.erp.iffs.ux.users.Panel = function (config) {
    Ext.erp.iffs.ux.users.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        border: false
    }, config));
};

Ext.extend(Ext.erp.iffs.ux.users.Panel, Ext.Panel, {
    initComponent: function () {

       
        this.grid_ot = new Ext.erp.iffs.ux.operationType.Grid();
       
        this.grid_uot = new Ext.erp.iffs.ux.userOperationType.Grid();

        this.items = [{
            layout: 'border',
            border: false,
            items: [{
                region: 'west',
                border: true,
                collapsible: true,
                split: true,
                width: 560,
                minSize: 100,
                maxSize: 400,
                layout: 'fit',
                
                items: [this.grid_ot]
            }, {
                region: 'center',
                border: false,
                layout: 'fit',
                margins: '0 0 0 0',
                items: [{
                    layout: 'vbox',
                    layoutConfig: {
                        type: 'hbox',
                        align: 'stretch',
                        pack: 'start'
                    },
                    defaults: {
                        flex: 1
                    },
                    items: [this.grid_uot]
                }]
            }]
        }];
 

    

        Ext.erp.iffs.ux.users.Panel.superclass.initComponent.apply(this, arguments);
    }
});

Ext.reg('userOperationTypeMapping-panel', Ext.erp.iffs.ux.users.Panel);