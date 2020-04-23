Ext.ns('Ext.erp.iffs.ux.jobOrderDocument');
/**
* @desc      DocumentUpload form
* @author    Wondwosen Desalegn
* @namespace Ext.erp.iffs.ux.jobOrderDocument
* @class     Ext.erp.iffs.ux.jobOrderDocument.Form
* @extends   Ext.form.FormPanel
*/
Ext.erp.iffs.ux.jobOrderDocument.Form = function (config) {
    Ext.erp.iffs.ux.jobOrderDocument.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            load: JobOrderDocument.Get,
            submit: JobOrderDocument.Upload
        },
        paramOrder: ['id'],
        defaults: {
            anchor: '95%',
            msgTarget: 'side'
        },
        id: 'jobOrderDocument-form',
        labelWidth: 70,
        autoHeight: true,
        fileUpload: true,
        frame: true,
        border: false,
        padding: 5,
        baseCls: 'x-plain',
        items: [{
            name: 'Id',
            xtype: 'hidden'
        }, {
            name: 'JobOrderHeaderId',
            xtype: 'hidden'
        }, {
            hiddenName: 'DocumentTypeId',
            xtype: 'combo',
            fieldLabel: 'Doc. Type',
            triggerAction: 'all',
            mode: 'remote',
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
                api: { read: Iffs.GetRemainingDocType }
            }),
            valueField: 'Id',
            displayField: 'Name'
        }, {
            xtype: 'fileuploadfield',
            fieldLabel: 'File',
            emptyText: 'Select document',
            name: 'File[]',
            buttonText: 'Browse...',
            multiple: true,
            iconCls: 'icon-browse',
            listeners: {
                'fileselected': function (field, value) {
                    
                }
            }
        }, {
            xtype: 'fieldset',
            title: 'Number of Docs',
            collapsible: false,
            autoHeight: true,
            defaults: { width: 50 },
            items: [{
                name: 'NoOfPagesOriginal',
                xtype: 'numberfield',
                fieldLabel: 'Original',
                anchor: '95%',
                allowBlank: false
            }, {
                name: 'Copy',
                xtype: 'numberfield',
                fieldLabel: 'Copy',
                anchor: '95%',
                allowBlank: false
            }]
        }, {
            xtype: 'fieldset',
            title: 'Number of Attached Docs',
            collapsible: false,
            autoHeight: true,
            defaults: { width: 210 },
            items: [{
                name: 'NoOfAttachedPagesOriginal',
                xtype: 'numberfield',
                fieldLabel: 'Original',
                anchor: '95%',
                allowBlank: false
            }, {
                name: 'NoOfAttachedPagesCopy',
                xtype: 'numberfield',
                fieldLabel: 'Copy',
                anchor: '95%',
                allowBlank: false
            }]
        }, {
            name: 'Remark',
            xtype: 'textarea',
            fieldLabel: 'Remark',
            allowBlank: false
        }]
    }, config));
}
Ext.extend(Ext.erp.iffs.ux.jobOrderDocument.Form, Ext.form.FormPanel);
Ext.reg('jobOrderDocument-form', Ext.erp.iffs.ux.jobOrderDocument.Form);

/**
* @desc      DocumentUpload form host window
* @author    Wondwosen Desalegn
* @namespace Ext.erp.iffs.ux.jobOrderDocument
* @class     Ext.erp.iffs.ux.jobOrderDocument.Window
* @extends   Ext.Window
*/
Ext.erp.iffs.ux.jobOrderDocument.Window = function (config) {
    Ext.erp.iffs.ux.jobOrderDocument.Window.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        width: 470,
        autoHeight: true,
        closeAction: 'close',
        modal: true,
        resizable: false,
        buttonAlign: 'right',
        bodyStyle: 'padding:2px;',
        listeners: {
            show: function () {
                var form = Ext.getCmp('jobOrderDocument-form').getForm();
                form.findField('Id').setValue(this.jobOrderDocumentId);
                if (this.jobOrderDocumentId > 0) {
                    this.form.load({
                        params: { id: this.jobOrderDocumentId },
                        success: function (form, action) {
                        },
                        failure: function (form, action) {
                            Ext.Msg.alert("Load failed", action.result.errorMessage);
                        }
                    });
                }
            },
            scope: this
        }
    }, config));
}
Ext.extend(Ext.erp.iffs.ux.jobOrderDocument.Window, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.erp.iffs.ux.jobOrderDocument.Form();
        this.items = [this.form];
        this.bbar = ['->', {
            text: 'Save',
            iconCls: 'icon-save',
            handler: this.onUpload,
            scope: this
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
        Ext.erp.iffs.ux.jobOrderDocument.Window.superclass.initComponent.call(this, arguments);
    },
    onUpload: function () {
        var form = this.form.getForm();
        var jobOrderGrid = Ext.getCmp('jobOrderDocument-jobOrderGrid');

        if (jobOrderGrid.getSelectionModel().hasSelection()) {
            var jobOrderId = jobOrderGrid.getSelectionModel().getSelected().get('Id'); ;
            form.findField('JobOrderHeaderId').setValue(jobOrderId);
            if (!form.isValid()) return;
            form.submit({
                waitMsg: 'Uploading your document...',
                success: function () {
                    form.reset();
                    Ext.getCmp('jobOrderDocument-paging').doRefresh();
                },
                failure: function (form, action) {
                    Ext.MessageBox.show({
                        title: 'Errors',
                        msg: action.result.data,
                        buttons: Ext.Msg.OK,
                        icon: Ext.MessageBox.ERROR,
                        scope: this
                    });
                }
            });
        } else {
            Ext.MessageBox.show({
                title: 'Errors',
                msg: "Job Order should be selected to upload Document",
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.ERROR,
                scope: this
            });
        }
    },
    onClose: function () {
        this.close();
    }
});
Ext.reg('jobOrderDocument-window', Ext.erp.iffs.ux.jobOrderDocument.Window);

/**
* @desc      Job Order grid
* @author    Wondwosen Desalegn
* @namespace Ext.erp.iffs.ux.jobOrderDocument
* @class     Ext.erp.iffs.ux.jobOrderDocument.JobOrderGrid
* @extends   Ext.grid.GridPanel
*/
Ext.erp.iffs.ux.jobOrderDocument.JobOrderGrid = function (config) {
    Ext.erp.iffs.ux.jobOrderDocument.JobOrderGrid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: JobOrder.GetAll,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'JobOrderNo',
                direction: 'ASC'
            },
            fields: ['Id', 'JobOrderNo', 'Date', 'ReceivingClient', 'IsChecked', 'IsApproved'],
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
        id: 'jobOrderDocument-jobOrderGrid',
        pageSize: 15,
        stripeRows: true,
        columnLines: true,
        border: false,
        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        }),
        viewConfig: {

        },
        listeners: {
            rowClick: function (grid, rowIndex, e) {
                var jobOrderDocumentGrid = Ext.getCmp('jobOrderDocument-grid');
                var jobOrderDocumentStore = jobOrderDocumentGrid.getStore();
                var jobOrderId = 0;
                if (this.getSelectionModel().hasSelection()) {
                    jobOrderId = this.getSelectionModel().getSelected().get('Id');
                }
                jobOrderDocumentStore.baseParams = { record: Ext.encode({ jobOrderId: jobOrderId }) };
                jobOrderDocumentStore.load({ params: { start: 0, limit: 100} });
                Ext.getCmp('jobOrderDocument-jobOrderLabel').setValue('Job Order No: ' + this.getSelectionModel().getSelected().get('JobOrderNo'));
            },
            containermousedown: function (grid) {

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
            dataIndex: 'JobOrderNo',
            header: 'Job Order No',
            sortable: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'Date',
            header: 'Date',
            sortable: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'ReceivingClient',
            header: 'Receiving Client',
            sortable: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'IsChecked',
            header: 'Checked?',
            sortable: true,
            width: 100,
            menuDisabled: true,
            align: 'center',
            renderer: function (value, metaData, record, rowIndex, colIndex, store) {
                if (value)
                    return '<img src="Content/images/app/select.png" />';
                else
                    return '<img src="Content/images/app/cross.png" />';
            }
        }, {
            dataIndex: 'IsApproved',
            header: 'Approved?',
            sortable: true,
            width: 100,
            menuDisabled: true,
            align: 'center',
            renderer: function (value, metaData, record, rowIndex, colIndex, store) {
                if (value)
                    return '<img src="Content/images/app/select.png" />';
                else
                    return '<img src="Content/images/app/cross.png" />';
            }
        }]
    }, config));
}
Ext.extend(Ext.erp.iffs.ux.jobOrderDocument.JobOrderGrid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({ searchText: '' }) };

        this.tbar = ['->', {
            xtype: 'textfield',
            emptyText: 'Type search text here',
            submitEmptyText: false,
            enableKeyEvents: true,
            style: {
                borderRadius: '25px',
                padding: '0 10px',
                width: '350px'
            },
            listeners: {
                specialkey: function (field, e) {
                    if (e.getKey() == e.ENTER) {
                        var grid = Ext.getCmp('jobOrderDocument-jobOrderGrid');
                        grid.store.baseParams['record'] = Ext.encode({ searchText: field.getValue() });
                        grid.store.load({ params: { start: 0, limit: grid.pageSize} });
                    }
                },
                keyup: function (field, e) {
                    if (field.getValue() == '') {
                        var grid = Ext.getCmp('jobOrderDocument-jobOrderGrid');
                        grid.store.baseParams['record'] = Ext.encode({ searchText: field.getValue() });
                        grid.store.load({ params: { start: 0, limit: grid.pageSize} });
                    }
                }
            }
        }];
        this.bbar = new Ext.PagingToolbar({
            id: 'jobOrderDocument-jobOrderPaging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.erp.iffs.ux.jobOrderDocument.JobOrderGrid.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {
        this.getStore().load({ params: { start: 0, limit: this.pageSize} });
        Ext.erp.iffs.ux.jobOrderDocument.JobOrderGrid.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('jobOrderDocument-jobOrderGrid', Ext.erp.iffs.ux.jobOrderDocument.JobOrderGrid);

/**
* @desc      Job Document grid
* @author    Wondwosen Desalegn
* @namespace Ext.erp.iffs.ux.jobOrderDocument
* @class     Ext.erp.iffs.ux.jobOrderDocument.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.erp.iffs.ux.jobOrderDocument.Grid = function (config) {
    Ext.erp.iffs.ux.jobOrderDocument.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: JobOrderDocument.GetAll,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Id',
                direction: 'ASC'
            },
            fields: ['Id', 'JobOrderHeaderId', 'DocumentType', 'FileName', 'NoOfPagesOriginal', 'NoOfPagesCopy', 'NoOfAttachedPagesOriginal', 'NoOfAttachedPagesCopy', 'Remark'],
            remoteSort: true,
            listeners: {
                beforeLoad: function () {
                    Ext.getCmp('jobOrderDocument-grid').body.mask('Loading...', 'x-mask-loading');
                },
                load: function () {
                    Ext.getCmp('jobOrderDocument-grid').body.unmask();
                },
                loadException: function () {
                    Ext.getCmp('jobOrderDocument-grid').body.unmask();
                },
                scope: this
            }
        }),
        id: 'jobOrderDocument-grid',
        pageSize: 10,
        stripeRows: true,
        columnLines: true,
        border: true,
        clicksToEdit: 1,
        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        }),
        columns: [{
            dataIndex: 'Id',
            header: 'Id',
            sortable: false,
            hidden: true,
            width: 100,
            menuDisabled: true
        }, new Ext.grid.RowNumberer(), {
            dataIndex: 'DocumentType',
            header: 'Document Type',
            sortable: false,
            width: 150,
            menuDisabled: true
        }, {
            dataIndex: 'FileName',
            header: 'File Name',
            sortable: false,
            width: 150,
            menuDisabled: true
        }, {
            dataIndex: 'NoOfPagesOriginal',
            header: 'No of Docs(Original)',
            sortable: false,
            width: 80,
            menuDisabled: true
        }, {
            dataIndex: 'NoOfPagesCopy',
            header: 'No of Docs(Copy)',
            sortable: false,
            width: 80,
            menuDisabled: true
        }, {
            dataIndex: 'NoOfAttachedPagesOriginal',
            header: 'No of Attached Docs(Original)',
            sortable: false,
            width: 80,
            menuDisabled: true
        }, {
            dataIndex: 'NoOfAttachedPagesCopy',
            header: 'No of Attached Docs(Copy)',
            sortable: false,
            width: 80,
            menuDisabled: true
        }, {
            dataIndex: 'Remark',
            header: 'Remark',
            sortable: false,
            width: 300,
            menuDisabled: true
        }]
    }, config));
};
Ext.extend(Ext.erp.iffs.ux.jobOrderDocument.Grid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({ jobOrderId: 0 }) };
        this.tbar = [{
            xtype: 'button',
            text: 'Add',
            iconCls: 'icon-add',
            disabled: !Ext.erp.iffs.ux.Reception.getPermission('Job Order Document', 'CanAdd'),
            handler: function () {
                var jobOrderGrid = Ext.getCmp('jobOrderDocument-jobOrderGrid');
                if (!jobOrderGrid.getSelectionModel().hasSelection()) {
                    Ext.MessageBox.show({
                        title: 'Select',
                        msg: 'You must select Job Order.',
                        buttons: Ext.Msg.OK,
                        icon: Ext.MessageBox.INFO,
                        scope: this
                    });
                    return;
                }

                new Ext.erp.iffs.ux.jobOrderDocument.Window({
                    jobOrderDocumentId: 0,
                    title: 'Add Job Document'
                }).show();
            }
        }, {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            text: 'Delete',
            iconCls: 'icon-delete',
            disabled: !Ext.erp.iffs.ux.Reception.getPermission('Job Order Document', 'CanDelete'),
            handler: function () {
                var grid = Ext.getCmp('jobOrderDocument-grid');
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
                    msg: 'Are you sure you want to remove the selected record?',
                    buttons: {
                        ok: 'Yes',
                        no: 'No'
                    },
                    icon: Ext.MessageBox.QUESTION,
                    scope: this,
                    fn: function (btn) {
                        if (btn == 'ok') {
                            var id = grid.getSelectionModel().getSelected().get('Id');
                            JobOrderDocument.Delete(id, function (result) {
                                Ext.getCmp('jobOrderDocument-paging').doRefresh();
                                if (!result.success) {
                                    Ext.MessageBox.show({
                                        title: 'Error',
                                        msg: result.data,
                                        buttons: Ext.Msg.OK,
                                        icon: Ext.MessageBox.ERROR,
                                        scope: this
                                    });
                                }
                            }, this);
                        }
                    }
                });
            }
        }, {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            text: 'Download',
            iconCls: 'icon-select',
            handler: function () {
                var grid = Ext.getCmp('jobOrderDocument-grid');
                if (!grid.getSelectionModel().hasSelection()) {
                    Ext.MessageBox.show({
                        title: 'Select',
                        msg: 'You must select a document to download.',
                        buttons: Ext.Msg.OK,
                        icon: Ext.MessageBox.INFO,
                        scope: this
                    });
                    return;
                }
                var fileName = grid.getSelectionModel().getSelected().get('FileName');
                window.open('/Upload/JobOrderDocument/' + fileName, '', '');
            }
        }, '->', {
            xtype: 'displayfield',
            id: 'jobOrderDocument-jobOrderLabel',
            style: 'font-weight: bold',
            value: 'Job Order No:'
        }];
        this.bbar = new Ext.PagingToolbar({
            id: 'jobOrderDocument-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.erp.iffs.ux.jobOrderDocument.Grid.superclass.initComponent.apply(this, arguments);
    }
});
Ext.reg('jobOrderDocument-grid', Ext.erp.iffs.ux.jobOrderDocument.Grid);

/**
* @desc      Job Document panel
* @author    Wondwosen Desalegn
* @namespace Ext.erp.iffs.ux.jobOrderDocument
* @class     Ext.erp.iffs.ux.jobOrderDocument.Panel
* @extends   Ext.Panel
*/
Ext.erp.iffs.ux.jobOrderDocument.Panel = function (config) {
    Ext.erp.iffs.ux.jobOrderDocument.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        border: false
    }, config));
}
Ext.extend(Ext.erp.iffs.ux.jobOrderDocument.Panel, Ext.Panel, {
    initComponent: function () {
        this.jobOrderGrid = new Ext.erp.iffs.ux.jobOrderDocument.JobOrderGrid();
        this.jobOrderDocumentGrid = new Ext.erp.iffs.ux.jobOrderDocument.Grid();
        this.items = [{
            layout: 'border',
            border: false,
            items: [{
                region: 'west',
                border: true,
                collapsible: true,
                split: true,
                width: 500,
                minSize: 200,
                layout: 'fit',
                margins: '0 3 0 0',
                items: [this.jobOrderGrid]
            }, {
                region: 'center',
                border: false,
                layout: 'fit',
                items: [this.jobOrderDocumentGrid]
            }]
        }];
        Ext.erp.iffs.ux.jobOrderDocument.Panel.superclass.initComponent.apply(this, arguments);
    }
});
Ext.reg('jobOrderDocument-panel', Ext.erp.iffs.ux.jobOrderDocument.Panel);