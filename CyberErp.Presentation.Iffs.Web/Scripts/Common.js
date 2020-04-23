Ext.ns('Ext.erp.iffs.ux.common');
/**
* @desc      Item selection window
* @author    Meftuh Mohammed
* @copyright (c) 2017, Cybersoft
* @date      Dec 16, 2017
* @namespace Ext.erp.iffs.ux.common
* @class     Ext.erp.iffs.ux.common.ServiceSelectionWindow
* @extends   Ext.Window
*/
Ext.erp.iffs.ux.common.ServiceSelectionWindow = function (config) {
    Ext.erp.iffs.ux.common.ServiceSelectionWindow.superclass.constructor.call(this, Ext.apply({
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
Ext.extend(Ext.erp.iffs.ux.common.ServiceSelectionWindow, Ext.Window, {
    initComponent: function () {
        this.grid = new Ext.erp.iffs.ux.common.ServiceSelectionGrid({
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
        Ext.erp.iffs.ux.common.ServiceSelectionWindow.superclass.initComponent.call(this, arguments);
    },
    onSelect: function () {
        var selectionGrid = this.grid;
        if (!selectionGrid.getSelectionModel().hasSelection())
            return;
        var selectedItems = selectionGrid.getSelectionModel().getSelections();
        var gridDatastore = this.targetGrid.getStore();
        var item = gridDatastore.recordType;      
     
        for (var i = 0; i < selectedItems.length; i++) {
            //check existence of item 
            var index =-1;
            gridDatastore.each(function (item) {
                if (item.data['ServiceId'] == selectedItems[i].get('Id')) {
                    index = 1;
                }
            });
            if (index == -1) { //if item does not exist in the already selected Service items list
                var p = new item({
                    ServiceId: selectedItems[i].get('Id'),
                     Name: selectedItems[i].get('Name'),
                    Code: selectedItems[i].get('Code'),
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
Ext.reg('Common-serviceSelectionWindow', Ext.erp.iffs.ux.common.ServiceSelectionWindow);
/**
* @desc      Item Selection grid
* @author    Meftuh Mohammed
* @copyright (c) 2017, Cybersoft
* @date      Dec 15, 2017
* @namespace Ext.erp.iffs.ux.common
* @class     Ext.erp.iffs.ux.common.ServiceSelectionGrid
* @extends   Ext.grid.GridPanel
*/
var selModel = new Ext.grid.CheckboxSelectionModel();

Ext.erp.iffs.ux.common.ServiceSelectionGrid = function (config) {
    Ext.erp.iffs.ux.common.ServiceSelectionGrid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: Iffs.GetPagedService,
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
        id: 'Common-serviceSelectionGrid',
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
Ext.extend(Ext.erp.iffs.ux.common.ServiceSelectionGrid, Ext.grid.GridPanel, {
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
                        var grid = Ext.getCmp('Common-serviceSelectionGrid');
                        grid.store.baseParams['param'] = Ext.encode({ searchText: field.getValue() });
                        grid.store.load({ params: { start: 0, limit: grid.pageSize } });
                    }
                },
                Keyup: function (field, e) {
                    if (field.getValue() == '') {

                        var grid = Ext.getCmp('Common-serviceSelectionGrid');
                        grid.store.baseParams['param'] = Ext.encode({ searchText: field.getValue() });
                        grid.store.load({ params: { start: 0, limit: grid.pageSize } });
                    }
                }
            }
        }
        ];
        this.bbar = new Ext.PagingToolbar({
            id: 'Common-itemSelectionPaging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.erp.iffs.ux.common.ServiceSelectionGrid.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {
        this.getSelectionModel().clearSelections();
        this.getStore().load({
            params: { start: 0, limit: this.pageSize }
        });
        Ext.erp.iffs.ux.common.ServiceSelectionGrid.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('Common-serviceSelectionGrid', Ext.erp.iffs.ux.common.ServiceSelectionGrid);

/**
* @desc      Item selection window
* @author    Meftuh Mohammed
* @copyright (c) 2017, Cybersoft
* @date      Dec 16, 2017
* @namespace Ext.erp.iffs.ux.common
* @class     Ext.erp.iffs.ux.common.CustomerSelectionWindow
* @extends   Ext.Window
*/
Ext.erp.iffs.ux.common.CustomerSelectionWindow = function (config) {
    Ext.erp.iffs.ux.common.CustomerSelectionWindow.superclass.constructor.call(this, Ext.apply({
        layout: 'form',
        width: 650,
        autoHeight: true,
        closeAction: 'close',
        modal: true,
        saveMode: 'add',
        resizable: false,
        buttonAlign: 'right',
        bodyStyle: 'padding:5px;'
    }, config));
}
Ext.extend(Ext.erp.iffs.ux.common.CustomerSelectionWindow, Ext.Window, {
    initComponent: function () {
        this.grid = new Ext.erp.iffs.ux.common.CustomerSelectionGrid({
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
        Ext.erp.iffs.ux.common.CustomerSelectionWindow.superclass.initComponent.call(this, arguments);
    },
    onSelect: function () {
        var selectionGrid = this.grid;
        if (!selectionGrid.getSelectionModel().hasSelection())
            return;
        var customerId = this.grid.getSelectionModel().getSelected().get('Id');
        var customer = this.grid.getSelectionModel().getSelected().get('Name');
        var customerGroup = this.grid.getSelectionModel().getSelected().get('CustomerGroup');
        var customerGroupId = this.grid.getSelectionModel().getSelected().get('CustomerGroupId');
        var form = this.parentForm;
        form.findField('CustomerId').setValue(customerId);
        form.findField('Customer').setValue(customer);
        form.findField('CustomerId').setValue(customerId);
        //form.findField('CustomerGroup').setValue(customerGroup);
        //form.findField('CustomerGroupId').setValue(customerGroupId);
    },
    onClose: function () {
        this.close();
    }
});
Ext.reg('Common-customerSelectionWindow', Ext.erp.iffs.ux.common.CustomerSelectionWindow);
/**
* @desc      Item Selection grid
* @author    Meftuh Mohammed
* @copyright (c) 2017, Cybersoft
* @date      Dec 15, 2017
* @namespace Ext.erp.iffs.ux.common
* @class     Ext.erp.iffs.ux.common.CustomerSelectionGrid
* @extends   Ext.grid.GridPanel
*/

Ext.erp.iffs.ux.common.CustomerSelectionGrid = function (config) {
    Ext.erp.iffs.ux.common.CustomerSelectionGrid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: Iffs.GetPagedCustomers,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|param',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Code',
                direction: 'ASC'
            },

            fields: ['Id', 'Name', 'CustomerGroup', 'CustomerGroupId', 'Code'],
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
        id: 'Common-customerSelectionGrid',
        pageSize: 10,
        height: 280,
        stripeRows: true,
        columnLines: true,
        border: false,
        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        }),
        columns: [ new Ext.grid.RowNumberer(),
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
        }, {
            dataIndex: 'CustomerGroupId',
            header: 'CustomerGroup',
            sortable: true,
            width: 120,
            hidden: true,
            menuDisabled: true
        }, {
            dataIndex: 'CustomerGroup',
            header: 'Customer Group',
            sortable: true,
            width: 120,
            menuDisabled: true
        }
        ]
    }, config));
};
Ext.extend(Ext.erp.iffs.ux.common.CustomerSelectionGrid, Ext.grid.GridPanel, {
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
                        var grid = Ext.getCmp('Common-customerSelectionGrid');;
                        grid.store.baseParams['param'] = Ext.encode({ searchText: field.getValue() });
                        grid.store.load({ params: { start: 0, limit: grid.pageSize } });
                    }
                },
                Keyup: function (field, e) {
                    if (field.getValue() == '') {

                        var grid = Ext.getCmp('Common-customerSelectionGrid');
                        grid.store.baseParams['param'] = Ext.encode({ searchText: field.getValue() });
                        grid.store.load({ params: { start: 0, limit: grid.pageSize } });
                    }
                }
            }
        }
        ];
        this.bbar = new Ext.PagingToolbar({
            id: 'Common-CustomerSelectionPaging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.erp.iffs.ux.common.CustomerSelectionGrid.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {
        this.getSelectionModel().clearSelections();
        this.getStore().load({
            params: { start: 0, limit: this.pageSize }
        });
        Ext.erp.iffs.ux.common.CustomerSelectionGrid.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('Common-customerSelectionGrid', Ext.erp.iffs.ux.common.CustomerSelectionGrid);
/**
* @desc      Item selection window
* @author    Meftuh Mohammed
* @copyright (c) 2017, Cybersoft
* @date      Dec 16, 2017
* @namespace Ext.erp.iffs.ux.common
* @class     Ext.erp.iffs.ux.common.TermAndConditionSelectionWindow
* @extends   Ext.Window
*/
Ext.erp.iffs.ux.common.TermAndConditionSelectionWindow = function (config) {
    Ext.erp.iffs.ux.common.TermAndConditionSelectionWindow.superclass.constructor.call(this, Ext.apply({
        layout: 'form',
        width:650,
        autoHeight: true,
        closeAction: 'close',
        modal: true,
        saveMode: 'add',
        resizable: false,
        buttonAlign: 'right',
        bodyStyle: 'padding:5px;'
    }, config));
}
Ext.extend(Ext.erp.iffs.ux.common.TermAndConditionSelectionWindow, Ext.Window, {
    initComponent: function () {
        this.grid = new Ext.erp.iffs.ux.common.TermAndConditionSelectionGrid({
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
        Ext.erp.iffs.ux.common.TermAndConditionSelectionWindow.superclass.initComponent.call(this, arguments);
    },
    onSelect: function () {
        var selectionGrid = this.grid;
        if (!selectionGrid.getSelectionModel().hasSelection())
            return;
        var termAndConditionId = this.grid.getSelectionModel().getSelected().get('Id');
        var title = this.grid.getSelectionModel().getSelected().get('Title');
        var description = this.grid.getSelectionModel().getSelected().get('Description');
        var form = this.parentForm;
        var termandCondtion = form.findField(this.field).getValue();
        if (typeof termandCondtion != 'undefined' && termandCondtion != '')
            termandCondtion = termandCondtion + '\n' + description;
        else
            termandCondtion = description;
        form.findField(this.field).setValue(termandCondtion);
    },
    onClose: function () {
        this.close();
    }
});
Ext.reg('Common-termAndConditionSelectionWindow', Ext.erp.iffs.ux.common.TermAndConditionSelectionWindow);
/**
* @desc      Item Selection grid
* @author    Meftuh Mohammed
* @copyright (c) 2017, Cybersoft
* @date      Dec 15, 2017
* @namespace Ext.erp.iffs.ux.common
* @class     Ext.erp.iffs.ux.common.TermAndConditionSelectionGrid
* @extends   Ext.grid.GridPanel
*/

Ext.erp.iffs.ux.common.TermAndConditionSelectionGrid = function (config) {
    Ext.erp.iffs.ux.common.TermAndConditionSelectionGrid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: Iffs.GetPagedTermsAndConditionsTemplate,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|param',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Code',
                direction: 'ASC'
            },

            fields: ['Id', 'Title', 'Description'],
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
        id: 'Common-termAndConditionSelectionGrid',
        pageSize: 10,
        height: 280,
        stripeRows: true,
        columnLines: true,
        border: false,
        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        }),
        columns: [ new Ext.grid.RowNumberer(),
        {
            dataIndex: 'Id',
            header: 'Id',
            sortable: true,
            hidden: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'Title',
            header: 'Title',
            sortable: true,
            width: 250,
            menuDisabled: true
        }]
    }, config));
};
Ext.extend(Ext.erp.iffs.ux.common.TermAndConditionSelectionGrid, Ext.grid.GridPanel, {
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
                        var grid = Ext.getCmp('Common-TermAndConditionSelectionGrid');
                        grid.store.baseParams['param'] = Ext.encode({ searchText: field.getValue() });
                        grid.store.load({ params: { start: 0, limit: grid.pageSize } });
                    }
                },
                Keyup: function (field, e) {
                    if (field.getValue() == '') {

                        var grid = Ext.getCmp('Common-TermAndConditionSelectionGrid');
                        grid.store.baseParams['param'] = Ext.encode({ searchText: field.getValue() });
                        grid.store.load({ params: { start: 0, limit: grid.pageSize } });
                    }
                }
            }
        }
        ];
        this.bbar = new Ext.PagingToolbar({
            id: 'Common-itemSelectionPaging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.erp.iffs.ux.common.TermAndConditionSelectionGrid.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {
        this.getSelectionModel().clearSelections();
        this.getStore().load({
            params: { start: 0, limit: this.pageSize }
        });
        Ext.erp.iffs.ux.common.TermAndConditionSelectionGrid.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('Common-termAndConditionSelectionGrid', Ext.erp.iffs.ux.common.TermAndConditionSelectionGrid);


Ext.ns('Ext.erp.iffs.ux.common');

/**
* @desc      Common registration form
* @author    Wondwosen Desalegn
* @copyright (c) 2017, Cybersoft
* @date      November 01, 2017
* @namespace Ext.erp.iffs.ux.common
* @class     Ext.erp.iffs.ux.common.Form
* @extends   Ext.form.FormPanel
*/
Ext.erp.iffs.ux.common.ServiceItemForm = function (config) {
    Ext.erp.iffs.ux.common.ServiceItemForm.superclass.constructor.call(this, Ext.apply({
        //api: {
        //    load: QuotationTemplate.Get,
        //    submit: QuotationTemplate.Save
        //},
        paramOrder: ['id'],
        defaults: {
            anchor: '95%',
            labelStyle: 'text-align:right;',
            msgTarget: 'side'
        },
        id: 'common-form',
        padding: 5,
        labelWidth: 120,
        autoHeight: true,
        border: true,
        //baseCls: 'x-plain',
        items: [{
            layout: 'column',
            border: false,
            items: [{
                columnWidth: .5,
                defaults: {
                    anchor: '90%', labelStyle: 'text-align:right;', msgTarget: 'side'
                },
                layout: 'form',
                border: false,
                items: [
                {
                    hiddenName: 'CommodityTypeId',
                    xtype: 'combo',
                    fieldLabel: 'Commodity Type',
                    triggerAction: 'all',
                    mode: 'remote',
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
                        api: { read: Iffs.GetCommodityType },
                        listeners: {
                            load: function () {
                            },
                        }
                    }),
                    valueField: 'Id',
                    displayField: 'Name',
                    listeners: {
                    }
                },
                {
                    name: 'Commodity',
                    xtype: 'textarea',
                    fieldLabel: 'Commodity',
                    readOnly: true, allowBlank: false
                },
                ]
            }, {
                columnWidth: .5,
                defaults: {
                    anchor: '90%', labelStyle: 'text-align:right;', msgTarget: 'side'
                },
                layout: 'form',
                border: false,
                items: [
                     {
                         hiddenName: 'ContainerTypeId',
                         xtype: 'combo',
                         fieldLabel: 'Container Type',
                         triggerAction: 'all',
                         mode: 'remote',
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
                             api: { read: Iffs.GetContainerType },
                             listeners: {
                                 load: function () {
                                 },
                             }
                         }),
                         valueField: 'Id',
                         displayField: 'Name',
                         listeners: {
                         }
                     }, {
                         name: 'Destination',
                         xtype: 'textfield',
                         fieldLabel: 'Destination',
                         readOnly: true, allowBlank: false
                     }, {
                         name: 'Weight',
                         xtype: 'textfield',
                         fieldLabel: 'Weight',
                         readOnly: true, allowBlank: false
                     },
                    {
                        hiddenName: 'POEId',
                        xtype: 'combo',
                        fieldLabel: 'POE',
                        triggerAction: 'all',
                        mode: 'remote',
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
                            api: { read: Iffs.GetPOE },
                            listeners: {
                                load: function () {
                                },
                            }
                        }),
                        valueField: 'Id',
                        displayField: 'Name',
                        listeners: {
                        }
                    },

                ]
            }]
        }]
    }, config));
};
Ext.extend(Ext.erp.iffs.ux.common.ServiceItemForm, Ext.form.FormPanel);
Ext.reg('common-ServiceItemForm', Ext.erp.iffs.ux.common.ServiceItemForm);


/**
* @desc      Item selection window
* @author    Meftuh Mohammed
* @copyright (c) 2017, Cybersoft
* @date      Dec 16, 2017
* @namespace Ext.erp.iffs.ux.common
* @class     Ext.erp.iffs.ux.common.ServiceItemSelectionWindow
* @extends   Ext.Window
*/
Ext.erp.iffs.ux.common.ServiceItemSelectionWindow = function (config) {
    Ext.erp.iffs.ux.common.ServiceItemSelectionWindow.superclass.constructor.call(this, Ext.apply({
        layout: 'form',
        width: 750,
        autoHeight: true,
        closeAction: 'close',
        modal: true,
        saveMode: 'add',
        resizable: false,
        buttonAlign: 'right',
        bodyStyle: 'padding:5px;'
    }, config));
}
Ext.extend(Ext.erp.iffs.ux.common.ServiceItemSelectionWindow, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.erp.iffs.ux.common.ServiceItemForm();
        this.grid = new Ext.erp.iffs.ux.common.ServiceItemSelectionGrid({
            customerGroupId: this.customerGroupId,
            serviceRequestId: this.serviceRequestId

        });
        this.items = [this.grid];
        Ext.getCmp('OperationTypeId-Common').store.baseParams = { serviceRequestId: this.serviceRequestId };

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
        Ext.erp.iffs.ux.common.ServiceItemSelectionWindow.superclass.initComponent.call(this, arguments);
    },
    onSelect: function () {
        var selectionGrid = this.grid;
        if (!selectionGrid.getSelectionModel().hasSelection())
            return;
        var selectedItems = selectionGrid.getSelectionModel().getSelections();
        var gridDatastore = this.targetGrid.getStore();
        var item = gridDatastore.recordType;
       
        var serviceRequestDetailId = Ext.getCmp('Common-serviceItemSelectionGrid').serviceRequestDetailId;
        var operationType = Ext.getCmp('Common-serviceItemSelectionGrid').operationType;

        
        for (var i = 0; i < selectedItems.length; i++) {
            //check existence of item 
            var index = -1;
            gridDatastore.each(function (item) {
                if (item.get['ServiceId'] == selectedItems[i].get('ServiceId')) {
                    index = 1;
                }
            });
             if (index == -1) { //if item does not exist in the already selected CommonItem items list
                var p = new item({
                    OperationTypeId: selectedItems[i].get('OperationTypeId'),
                    OperationType: operationType,
                    CurrencyId: selectedItems[i].get('CurrencyId'),
                    Currency: selectedItems[i].get('Currency'),
                    ServiceUnitTypeId: selectedItems[i].get('ServiceUnitTypeId'),
                    ServiceUnitType: selectedItems[i].get('ServiceUnitType'),
                    UnitPrice: selectedItems[i].get('Rate'),
                    ServiceId: selectedItems[i].get('ServiceId'),
                    Service: selectedItems[i].get('Service'),
                    CustomerGroup: selectedItems[i].get('CustomerGroup'),
                    ServiceDescription: selectedItems[i].get('ServiceDescription'),
                    ComparingSign: selectedItems[i].get('ComparingSign'),
                    Quantity: selectedItems[i].get('Description'),
                    Remark: '',
                    ServiceRequestDetailId: serviceRequestDetailId

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
Ext.reg('Common-serviceItemSelectionWindow', Ext.erp.iffs.ux.common.ServiceItemSelectionWindow);
/**
* @desc      Item Selection grid
* @author    Meftuh Mohammed
* @copyright (c) 2017, Cybersoft
* @date      Dec 15, 2017
* @namespace Ext.erp.iffs.ux.common
* @class     Ext.erp.iffs.ux.common.ServiceItemSelectionGrid
* @extends   Ext.grid.GridPanel
*/
var selModel = new Ext.grid.CheckboxSelectionModel();

Ext.erp.iffs.ux.common.ServiceItemSelectionGrid = function (config) {
    Ext.erp.iffs.ux.common.ServiceItemSelectionGrid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: Iffs.GetAllServiceTemplateWithRate,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|param',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Service',
                direction: 'ASC'
            },
            fields: ['Id', 'OperationTypeId', 'ServiceDescription', 'ComparingSign','Description', 'ServiceId', 'OperationType', 'Service', 'CurrencyId', 'Currency', 'ServiceUnitTypeId', 'ServiceUnitType', 'Rate'],
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
        id: 'Common-serviceItemSelectionGrid',
        pageSize: 10,
        height: 280,
        stripeRows: true,
        columnLines: true,
        border: false,
        sm: selModel,
        serviceRequestDetailId: '',
        operationType: '',
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
          dataIndex: 'OperationType',
          header: 'OperationType',
            sortable: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'Service',
            header: 'Service',
            sortable: true,
            width: 150,
            menuDisabled: true
        }, {
            dataIndex: 'ServiceUnitType',
            header: 'Unit Type',
            sortable: true,
            width: 80,
            menuDisabled: true
        }, {
            dataIndex: 'Currency',
            header: 'Currency',
            sortable: true,
            width: 80,
            menuDisabled: true
        }, {
            dataIndex: 'ComparingSign',
            header: 'Qty Sign',
            sortable: true,
            width: 80,
            menuDisabled: true
        }, {
            dataIndex: 'Description',
            header: 'Description',
            sortable: true,
            width: 80,
            menuDisabled: true
        }, {
            dataIndex: 'Rate',
            header: 'Rate',
            sortable: true,
            width: 120,
            menuDisabled: true
        }]
    }, config));
};
Ext.extend(Ext.erp.iffs.ux.common.ServiceItemSelectionGrid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.tbar = [
        {
            hiddenName: 'OperationTypeId',
            id:'OperationTypeId-Common',
            xtype: 'combo',
            fieldLabel: 'Operation Type',
            triggerAction: 'all',
            mode: 'remote',
            anchor: '90%',
            editable: true,
            forceSelection: true,
            emptyText: '---Select---',
            allowBlank: true,
            store: new Ext.data.DirectStore({
                reader: new Ext.data.JsonReader({
                    successProperty: 'success',
                    //idProperty: 'ServiceRequestDetailId',
                    root: 'data',
                    fields: ['Id', 'Name', 'ServiceRequestDetailId', 'CommodityTypeId', 'ContainerType']
                }),
                autoLoad: true,
                paramOrder: ['serviceRequestId'],
                api: { read: Iffs.GetServiceRequestOpeation },
                listeners: {
                    load: function () {
                    },
                   
                }
            }),
            valueField: 'Id',
            displayField: 'Name',
            listeners: {
                select: function (comb,rec) {
                    var grid = Ext.getCmp('Common-serviceItemSelectionGrid');
                    var operationTypeId = Ext.getCmp('OperationTypeId-Common').getValue();
                    var containerType = rec.get('ContainerType');
                    grid.serviceRequestDetailId = rec.data['ServiceRequestDetailId'];
                    grid.operationType = rec.data['Name'];

                    Ext.getCmp('txtServiceItemSelectionGridSearch').reset();

                    grid.store.baseParams['param'] = Ext.encode({ searchText: "", operationTypeId: operationTypeId, containerType: containerType });
                    grid.store.load({ params: { start: 0, limit: grid.pageSize } });
                }
            }
        },
          '->',
        {
            xtype: 'tbfill'
        }, {
            xtype: 'textfield',
            id: 'txtServiceItemSelectionGridSearch',
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
                        var grid = Ext.getCmp('Common-serviceItemSelectionGrid');
                        var operationTypeId = Ext.getCmp('OperationTypeId-Common').getValue();
                        grid.store.baseParams['param'] = Ext.encode({ searchText: field.getValue(), operationTypeId: operationTypeId, customerGroupId: grid.customerGroupId });
                        grid.store.load({ params: { start: 0, limit: grid.pageSize } });

                    }
                },
                Keyup: function (field, e) {
                    if (field.getValue() == '') {
                        var grid = Ext.getCmp('Common-serviceItemSelectionGrid');
                        var operationTypeId = Ext.getCmp('OperationTypeId-Common').getValue();
                        grid.store.baseParams['param'] = Ext.encode({ searchText: field.getValue(), operationTypeId: operationTypeId, customerGroupId: grid.customerGroupId });
                        grid.store.load({ params: { start: 0, limit: grid.pageSize } });

                    }
                }
            }
        }
        ];
        this.bbar = new Ext.PagingToolbar({
            id: 'Common-itemSelectionPaging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.erp.iffs.ux.common.ServiceItemSelectionGrid.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {

        this.getSelectionModel().clearSelections();
        //this.getStore().load({
        //    params: { start: 0, limit: this.pageSize }
        //});
        Ext.erp.iffs.ux.common.ServiceItemSelectionGrid.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('Common-serviceItemSelectionGrid', Ext.erp.iffs.ux.common.ServiceItemSelectionGrid);

/**
* @desc      Commodity InfoGrid grid
* @author    Meftuh Mohammed
* @copyright (c) 2017, Cybersoft
* @date      Dec 15, 2017
* @namespace Ext.erp.iffs.ux.common
* @class     Ext.erp.iffs.ux.common.CommodityInfoGrid
* @extends   Ext.grid.GridPanel
*/
var selModel = new Ext.grid.CheckboxSelectionModel();

Ext.erp.iffs.ux.common.CommodityInfoGrid = function (config) {
    Ext.erp.iffs.ux.common.CommodityInfoGrid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: Iffs.GetServiceRequestDetail,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|param',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Code',
                direction: 'ASC'
            },

            fields: ['Id', 'OperationType', 'CommodityType', 'Volume', 'Pcs', 'ContainerType', 'POE', 'POD', 'POL'],
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
        id: 'Common-commodityInfoGrid',
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
            dataIndex: 'OperationType',
            header: 'Operation Type',
            sortable: true,
            width: 100,
            menuDisabled: true
        }
        , {
            dataIndex: 'CommodityType',
            header: 'Commodity Type',
            sortable: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'Volume',
            header: 'Volume',
            sortable: true,
            width: 80,
            menuDisabled: true
        }, {
            dataIndex: 'Pcs',
            header: 'Pcs',
            sortable: true,
            width: 80,
            menuDisabled: true
        }, {
            dataIndex: 'ContainerType',
            header: 'Container Type',
            sortable: true,
            width: 120,
            menuDisabled: true
        }, {
            dataIndex: 'POE',
            header: 'POE',
            sortable: true,
            width: 80,
            menuDisabled: true
        }, {
            dataIndex: 'POD',
            header: 'POD',
            sortable: true,
            width: 80,
            menuDisabled: true
        },
        {
            dataIndex: 'POL',
            header: 'POL',
            sortable: true,
            width: 80,
            menuDisabled: true
        }
        ]
    }, config));
};
Ext.extend(Ext.erp.iffs.ux.common.CommodityInfoGrid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.store.baseParams = { param: Ext.encode({ searchText: '', serviceRequestId: this.serviceRequestId }) };

        this.tbar = [
       '->',
      {
          xtype: 'tbfill'
      }, {
          xtype: 'textfield',
          emptyText: 'Type Search text here and press                                             "Enter"',
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
                      var grid = Ext.getCmp('Common-commodityInfoGrid');
                      grid.store.baseParams['param'] = Ext.encode({ searchText: field.getValue(), serviceRequestId: this.serviceRequestId });
                      grid.store.load({ params: { start: 0, limit: grid.pageSize } });
                  }
              },
              Keyup: function (field, e) {
                  if (field.getValue() == '') {

                      var grid = Ext.getCmp('Common-commodityInfoGrid');
                      grid.store.baseParams['param'] = Ext.encode({ searchText: field.getValue(), serviceRequestId: this.serviceRequestId });
                      grid.store.load({ params: { start: 0, limit: grid.pageSize } });
                  }
              }
          }
      }
        ];
        this.bbar = new Ext.PagingToolbar({
            id: 'Common-itemSelectionPaging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.erp.iffs.ux.common.CommodityInfoGrid.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {
        this.getSelectionModel().clearSelections();
        this.getStore().load({
            params: { start: 0, limit: this.pageSize }
        });
        Ext.erp.iffs.ux.common.CommodityInfoGrid.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('Common-commodityInfoGrid', Ext.erp.iffs.ux.common.CommodityInfoGrid);


/**
* @desc      Item selection window
* @author    Meftuh Mohammed
* @copyright (c) 2017, Cybersoft
* @date      Dec 16, 2017
* @namespace Ext.erp.iffs.ux.common
* @class     Ext.erp.iffs.ux.common.CommodityInfoSelectionWindow
* @extends   Ext.Window
*/
Ext.erp.iffs.ux.common.CommodityInfoSelectionWindow = function (config) {
    Ext.erp.iffs.ux.common.CommodityInfoSelectionWindow.superclass.constructor.call(this, Ext.apply({
        layout: 'form',
        width: 750,
        autoHeight: true,
        closeAction: 'close',
        modal: true,
        saveMode: 'add',
        resizable: false,
        buttonAlign: 'right',
        bodyStyle: 'padding:5px;'
    }, config));
}
Ext.extend(Ext.erp.iffs.ux.common.CommodityInfoSelectionWindow, Ext.Window, {
    initComponent: function () {
        this.grid = new Ext.erp.iffs.ux.common.CommodityInfoGrid({
            serviceRequestId: this.serviceRequestId
        });
        this.items = [this.grid];
        this.bbar = [{
            xtype: 'tbfill'
        }, {
            text: 'Close',
            iconCls: 'icon-exit',
            handler: this.onClose,
            scope: this
        }];
        Ext.erp.iffs.ux.common.CommodityInfoSelectionWindow.superclass.initComponent.call(this, arguments);
    },
    onClose: function () {
        this.close();
    }
});
Ext.reg('Common-commodityInfoSelectionWindow', Ext.erp.iffs.ux.common.CommodityInfoSelectionWindow);
