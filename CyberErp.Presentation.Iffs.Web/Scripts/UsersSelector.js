Ext.ns('Ext.erp.iffs.ux.usersSelector');
var selModel = new Ext.grid.CheckboxSelectionModel();

/**
* @desc      Approved Job Orders registration form host window
* @author    Dawit Kiros
* @copyright (c) 2017, Cybersoft
* @date      November 01, 2017
* @namespace Ext.erp.iffs.ux.usersSelector
* @class     Ext.erp.iffs.ux.usersSelector.Window
* @extends   Ext.Window
*/
Ext.erp.iffs.ux.usersSelector.Window = function (config) {
    Ext.erp.iffs.ux.usersSelector.Window.superclass.constructor.call(this, Ext.apply({
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
Ext.extend(Ext.erp.iffs.ux.usersSelector.Window, Ext.Window, {
    initComponent: function () {
        this.grid = new Ext.erp.iffs.ux.usersSelector.Grid();
        this.items = [this.grid];
        this.buttons = [{
            text: 'Select',
            iconCls: 'icon-select',
            handler: this.onSelect,
            scope: this
        },{
            text: 'Close',
            iconCls: 'icon-exit',
            handler: this.onClose,
            scope: this
        }];

        Ext.erp.iffs.ux.usersSelector.Window.superclass.initComponent.call(this, arguments);
    },
    onSelect: function () {
        var grid;

        
        grid = Ext.getCmp('userOperationType-grid');
               
        

        var selectionGrid = Ext.getCmp('usersSelector-grid');
        if (!selectionGrid.getSelectionModel().hasSelection()) return;
        var selectedUsers = selectionGrid.getSelectionModel().getSelections();
        var store = grid.getStore();
        var user = store.recordType;


        var defaultCostCenterId;
       
        

        var empRecords = [];
        var gridStore = grid.getStore();

        grid.getStore().each(function (model) {
            empRecords.push(model.data);
        });
        var countEmpsAdded = 0;
        for (var i = 0; i < selectedUsers.length; i++) {


            var p = new user({
                Id: selectedUsers[i].get('Id'),
                UserName: selectedUsers[i].get('UserName'),
                FirstName: selectedUsers[i].get('FirstName'),
                LastName: selectedUsers[i].get('LastName'),
                Role: selectedUsers[i].get('Role'),
            });

            var count = store.getCount();

            // this piece of code will stop from loading similar or selected employees onto the destination grid
            try {

                var recordIndex = gridStore.findBy(
                function (record, id) {
                    if (record.get('Id') == p.data.Id) {
                        return true;
                    }
                    return false;
                });

                if (recordIndex != -1) {
                }
                else {
                    store.insert(count, p);
                }
            }
            catch (e) {
                var exc = e.Message;
                continue;
            }
            countEmpsAdded++;
        }
    },
    onClose: function () {
        this.close();
    }
});
Ext.reg('usersSelector-window', Ext.erp.iffs.ux.usersSelector.Window);

/**
* @desc      Approved Job Orders grid
* @author    Dawit Kiros
* @copyright (c) 2017, Cybersoft
* @date      November 01, 2017
* @namespace Ext.erp.iffs.ux.usersSelector
* @class     Ext.erp.iffs.ux.usersSelector.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.erp.iffs.ux.usersSelector.Grid = function (config) {
    Ext.erp.iffs.ux.usersSelector.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: Iffs.GetUsers,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Id',
                direction: 'ASC'
            },
            fields: ['Id', 'UserName', 'FirstName', 'LastName', 'Role'],
            remoteSort: true
        }),
        id: 'usersSelector-grid',
        loadMask: true,
        pageSize: 30,
        height: 300,
        stripeRows: true,
        border: false,
        viewConfig: {
            forceFit: true,
            
        },
        sm: selModel,
        listeners: {

            rowdblclick: function() {
            }
        },
        columns: [selModel,{
            dataIndex: 'Id',
            header: 'Id',
            sortable: true,
            hidden: true,
            width: 100,
            menuDisabled: true
        }, new Ext.grid.RowNumberer(), {
            dataIndex: 'UserName',
            header: 'User Name',
            sortable: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'FirstName',
            header: 'First Name',
            sortable: true,
            width: 200,
            menuDisabled: true
        }, {
            dataIndex: 'LastName',
            header: 'Last Name',
            sortable: true,
            width: 150,
            menuDisabled: true
        }, {
            dataIndex: 'Role',
            header: 'Role',
            sortable: true,
            width: 150,
            menuDisabled: true
        }]
    }, config));
};
Ext.extend(Ext.erp.iffs.ux.usersSelector.Grid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({ searchText: '' }) };
        this.bbar = new Ext.PagingToolbar({
            id: 'usersSelector-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.erp.iffs.ux.usersSelector.Grid.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {
        this.getStore().load({
            params: {
                start: 0,
                limit: this.pageSize
            }
        });
        Ext.erp.iffs.ux.usersSelector.Grid.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('usersSelector-grid', Ext.erp.iffs.ux.usersSelector.Grid);

/**
* @desc      Approved Job Orders Item panel
* @author    Dawit Kiros
* @copyright (c) 2017, Cybersoft
* @date      November 01, 2017
* @namespace Ext.erp.iffs.ux.usersSelector
* @class     Ext.erp.iffs.ux.usersSelector.Panel
* @extends   Ext.Panel
*/
Ext.erp.iffs.ux.usersSelector.Panel = function (config) {
    Ext.erp.iffs.ux.usersSelector.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        border: false
    }, config));
};
Ext.extend(Ext.erp.iffs.ux.usersSelector.Panel, Ext.Panel, {
    initComponent: function () {
        var grid = new Ext.erp.iffs.ux.usersSelector.Grid();
        this.items = [grid];

        Ext.erp.iffs.ux.usersSelector.Panel.superclass.initComponent.apply(this, arguments);
    }
});
Ext.reg('usersSelector-panel', Ext.erp.iffs.ux.usersSelector.Panel);