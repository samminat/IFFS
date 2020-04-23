Ext.ns('Ext.erp.iffs.ux.serviceRequestFileUploader');
/**
* @desc      ServiceRequestFileUploader registration form
* @author    Dawit Kiros
* @copyright (c) 2017, Cybersoft
* @date      December 15, 2017
* @namespace Ext.erp.iffs.ux.serviceRequestFileUploader
* @class     Ext.erp.iffs.ux.serviceRequestFileUploader.Form
* @extends   Ext.form.FormPanel
*/
Ext.erp.iffs.ux.serviceRequestFileUploader.Form = function (config) {
    Ext.erp.iffs.ux.serviceRequestFileUploader.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            load: ServiceRequest.Get,
            submit: ServiceRequest.Upload
        },
        paramOrder: ['id'],
        defaults: {
            anchor: '95%',
            labelStyle: 'text-align:right;',
            msgTarget: 'side'
        },
        id: 'serviceRequestFileUploader-form',
        padding: 5,
        fileUpload: true,
        labelWidth: 100,
        autoHeight: true,
        border: false,
        baseCls: 'x-plain',
        items: [{
            name: 'Id',
            xtype: 'hidden'
        },{
            name: 'RequestId',
            xtype: 'hidden'
        }, {
            name: 'DocumentUrl',
            xtype: 'fileuploadfield',
            id: 'form-file',
            emptyText: 'Select File',
            fieldLabel: 'Upload File',
            labelWidth: 50,
            //anchor: '35%',
            buttonText: '',
            buttonCfg: {
                iconCls: 'icon-upload'
            }
        }]
    }, config));
}
Ext.extend(Ext.erp.iffs.ux.serviceRequestFileUploader.Form, Ext.form.FormPanel);
Ext.reg('serviceRequestFileUploader-form', Ext.erp.iffs.ux.serviceRequestFileUploader.Form);

/**
* @desc      ServiceRequestFileUploader registration form host window
* @author    Dawit Kiros
* @copyright (c) 2017, Cybersoft
* @date      December 15, 2017
* @namespace Ext.erp.iffsux.serviceRequestFileUploader
* @class     Ext.erp.iffsux.serviceRequestFileUploader.Window
* @extends   Ext.Window
*/
Ext.erp.iffs.ux.serviceRequestFileUploader.Window = function (config) {
    Ext.erp.iffs.ux.serviceRequestFileUploader.Window.superclass.constructor.call(this, Ext.apply({
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
                this.form.getForm().findField('RequestId').setValue(this.RequestId);
                
               
                var gridDocs = Ext.getCmp('serviceRequestFileUploader-grid');
                gridDocs.getStore().load({
                    params: {

                        start: 0,
                        limit: 100,
                        sort: '',
                        dir: '',
                        RequestId: this.RequestId
                    }
                });
                
            },
            scope: this
        }
    }, config));
}
Ext.extend(Ext.erp.iffs.ux.serviceRequestFileUploader.Window, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.erp.iffs.ux.serviceRequestFileUploader.Form();
        this.gridDetail = new Ext.erp.iffs.ux.serviceRequestFileUploader.Grid();
        this.items = [this.form, this.gridDetail];

        this.bbar = [{
            xtype: 'tbfill'
        }, {
            text: 'Save',
            iconCls: 'icon-save',
            handler: this.onSave,
            scope: this
        }, {
            xtype: 'tbseparator'
        }, {
            text: 'Close',
            iconCls: 'icon-exit',
            handler: this.onClose,
            scope: this
        }];
        this.tools = [{
            id: 'refresh',
            qtip: 'Reset',
            handler: function () {
                this.form.getForm().reset();
            },
            scope: this
        }];
        Ext.erp.iffs.ux.serviceRequestFileUploader.Window.superclass.initComponent.call(this, arguments);
    },
    onSave: function () {
        var form = Ext.getCmp('serviceRequestFileUploader-form').getForm();
        var docUrl = form.findField('form-file').getValue();
        var id = form.findField('Id').getValue();

        form.submit({
            params: { record: Ext.encode({  docUrl: docUrl }) },
            waitMsg: 'Please wait...',
            success: function (form, action) {
                Ext.MessageBox.show({
                    title: 'Success',
                    msg: action.result.data,
                    buttons: Ext.Msg.OK,
                    icon: Ext.MessageBox.INFO,
                    scope: this
                });
                var form = Ext.getCmp('serviceRequestFileUploader-form').getForm();
                
                var id = form.findField('RequestId').getValue();
                var grid = Ext.getCmp('serviceRequestFileUploader-grid');
                var store = grid.getStore();
                store.load({ params: { start: 0, limit: 20, RequestId: id } });
            },
            failure: function (form, action) {
                Ext.MessageBox.show({
                    title: 'Error',
                    msg: action.result.data,
                    buttons: Ext.Msg.OK,
                    icon: Ext.MessageBox.ERROR,
                    scope: this
                });
            }
        });
    },
    onClose: function () {
        this.close();
    }
});
Ext.reg('serviceRequestFileUploader-window', Ext.erp.iffs.ux.serviceRequestFileUploader.Window);

/**
* @desc      ServiceRequestFileUploader grid
* @author    Dawit Kiros
* @copyright (c) 2017, Cybersoft
* @date      December 15, 2017
* @namespace Ext.erp.iffs.ux.serviceRequestFileUploader
* @class     Ext.erp.iffs.ux.serviceRequestFileUploader.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.erp.iffs.ux.serviceRequestFileUploader.Grid = function (config) {
    Ext.erp.iffs.ux.serviceRequestFileUploader.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: ServiceRequest.GetAllDocsByRequest,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|RequestId',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'OperationType',
                direction: 'ASC'
            },
            fields: ['Id','RequestId', 'DocumentUrl'],
            remoteSort: true
        }),
        id: 'serviceRequestFileUploader-grid',
        pageSize: 20,
        height:200,
        stripeRows: true,
        columnLines: true,
        border: false,
        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        }),
        viewConfig: {
            forceFit: true,
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
            dataIndex: 'RequestId',
            header: 'RequestId',
            sortable: true,
            hidden: true,
            width: 100,
            menuDisabled: true
        }, new Ext.grid.RowNumberer(),
        {
            dataIndex: 'DocumentUrl',
            header: 'Document',
            sortable: true,
            width: 80,
            renderer: function (myValue, myDontKnow, myRecord) {
                var FolderName = myRecord.get('RequestId');
                return '<a href="Upload/ServiceRequestDocs/' + FolderName + '/' + myValue + '" target="_blank">' + myValue + '</a>';
            },
            menuDisabled: true
        }]
    }, config));
}
Ext.extend(Ext.erp.iffs.ux.serviceRequestFileUploader.Grid, Ext.grid.GridPanel, {
    initComponent: function () {

        this.bbar = new Ext.PagingToolbar({
            id: 'serviceRequestFileUploader-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        this.bbar.refresh.hide();
        Ext.erp.iffs.ux.serviceRequestFileUploader.Grid.superclass.initComponent.apply(this, arguments);
    }
});
Ext.reg('serviceRequestFileUploader-grid', Ext.erp.iffs.ux.serviceRequestFileUploader.Grid);
