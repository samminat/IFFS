Ext.ns('Ext.erp.iffs.ux.termsAndConditionsTemplate');
/**
* @desc      TermsAndConditionsTemplate registration form
* @author    Wondwosen Desalegn
* @copyright (c) 2017, Cybersoft
* @date      November 01, 2017
* @namespace Ext.erp.iffs.ux.termsAndConditionsTemplate
* @class     Ext.erp.iffs.ux.termsAndConditionsTemplate.Form
* @extends   Ext.form.FormPanel
*/
Ext.erp.iffs.ux.termsAndConditionsTemplate.Form = function (config) {
    Ext.erp.iffs.ux.termsAndConditionsTemplate.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            load: TermsAndConditionsTemplate.Get,
            submit: TermsAndConditionsTemplate.Save
        },
        paramOrder: ['id'],
        defaults: {
            anchor: '98%',
            labelStyle: 'text-align:right;',
            msgTarget: 'side'
        },
        id: 'termsAndConditionsTemplate-form',
        //padding: 5,
        labelWidth: 80,
        labelAlign: 'top',
        autoHeight: true,
        border: false,
        bodyStyle: 'background: #dfe8f6; padding: 20px 5px 5px 10px;',
        baseCls: 'x-plain',
        items: [{
            name: 'Id',
            xtype: 'hidden'
        }, {
            name: 'Title',
            xtype: 'textfield',
            fieldLabel: 'Title',
            allowBlank: false
        }, {
            name: 'Description',
            xtype: 'htmleditor',
            fieldLabel: 'Description',
            height: 500,
            enableFont: false
        }],
        tbar: [{
            xtype: 'displayfield',
            style: 'font-weight: bold',
            value: 'Terms and Conditions Template Form'
        }],
        buttons: [{
            text: 'Save',
            iconCls: 'icon-save',
            handler: function () {
                form = Ext.getCmp('termsAndConditionsTemplate-form').getForm();
                if (!form.isValid()) return;
                form.submit({
                    waitMsg: 'Please wait...',
                    success: function () {
                        form.reset();
                        Ext.getCmp('termsAndConditionsTemplate-paging').doRefresh();
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
            scope: this
        }, {
            text: 'Delete',
            iconCls: 'icon-delete',
            handler: function () {
                var grid = Ext.getCmp('termsAndConditionsTemplate-grid');
                form = Ext.getCmp('termsAndConditionsTemplate-form').getForm();
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
                            TermsAndConditionsTemplate.Delete(id, function (result, response) {
                                form.reset();
                                Ext.getCmp('termsAndConditionsTemplate-paging').doRefresh();
                            }, this);
                        }
                    }
                });
            },
            scope: this
        }, {
            text: 'Cancel',
            iconCls: 'icon-exit',
            handler: function () {
                this.getForm().reset();
            },
            scope: this
        }]
    }, config));
};
Ext.extend(Ext.erp.iffs.ux.termsAndConditionsTemplate.Form, Ext.form.FormPanel);
Ext.reg('termsAndConditionsTemplate-form', Ext.erp.iffs.ux.termsAndConditionsTemplate.Form);

/**
* @desc      TermsAndConditionsTemplate grid
* @author    Wondwosen Desalegn
* @copyright (c) 2017, Cybersoft
* @date      November 01, 2017
* @namespace Ext.erp.iffs.ux.termsAndConditionsTemplate
* @class     Ext.erp.iffs.ux.termsAndConditionsTemplate.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.erp.iffs.ux.termsAndConditionsTemplate.Grid = function (config) {
    Ext.erp.iffs.ux.termsAndConditionsTemplate.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: TermsAndConditionsTemplate.GetAll,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|param',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Name',
                direction: 'ASC'
            },
            fields: ['Id', 'Title'],
            remoteSort: true
        }),
        id: 'termsAndConditionsTemplate-grid',
        loadMask: true,
        pageSize: 30,
        stripeRows: true,
        border: false,
        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        }),
        listeners: {
            rowClick: function () {
                if (!this.getSelectionModel().hasSelection()) return;
                var id = this.getSelectionModel().getSelected().get('Id');
                var form = Ext.getCmp('termsAndConditionsTemplate-form');
                if (id > 0) {
                    form.load({
                        params: { id: id },
                        success: function () {
                            
                        }
                    });
                }
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
            dataIndex: 'Title',
            header: 'Title',
            sortable: true,
            width: 300,
            menuDisabled: true
        }]
    }, config));
};
Ext.extend(Ext.erp.iffs.ux.termsAndConditionsTemplate.Grid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.store.baseParams = { param: Ext.encode({ searchText: '' }) };
        this.bbar = new Ext.PagingToolbar({
            id: 'termsAndConditionsTemplate-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.erp.iffs.ux.termsAndConditionsTemplate.Grid.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {
        this.getStore().load({
            params: {
                start: 0,
                limit: this.pageSize
            }
        });
        Ext.erp.iffs.ux.termsAndConditionsTemplate.Grid.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('termsAndConditionsTemplate-grid', Ext.erp.iffs.ux.termsAndConditionsTemplate.Grid);


/**
* @desc      TermsAndConditionsTemplate Item panel
* @author    Wondwosen Desalegn
* @copyright (c) 2017, Cybersoft
* @date      November 01, 2017
* @namespace Ext.erp.iffs.ux.termsAndConditionsTemplate
* @class     Ext.erp.iffs.ux.termsAndConditionsTemplate.Panel
* @extends   Ext.Panel
*/
Ext.erp.iffs.ux.termsAndConditionsTemplate.Panel = function (config) {
    Ext.erp.iffs.ux.termsAndConditionsTemplate.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        border: false,
        tbar: {
            xtype: 'toolbar',
            items: [{
            }]
        }
    }, config));
};
Ext.extend(Ext.erp.iffs.ux.termsAndConditionsTemplate.Panel, Ext.Panel, {
    initComponent: function () {
        this.grid = new Ext.erp.iffs.ux.termsAndConditionsTemplate.Grid();
        this.form = new Ext.erp.iffs.ux.termsAndConditionsTemplate.Form();
     
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
                items: [this.grid]
            }, {
                region: 'center',
                border: true,
                layout: 'fit',
                bodyStyle: 'background: #dfe8f6;',
                items: [this.form]
            }]
        }];

        Ext.erp.iffs.ux.termsAndConditionsTemplate.Panel.superclass.initComponent.apply(this, arguments);
    }
});
Ext.reg('termsAndConditionsTemplate-panel', Ext.erp.iffs.ux.termsAndConditionsTemplate.Panel);