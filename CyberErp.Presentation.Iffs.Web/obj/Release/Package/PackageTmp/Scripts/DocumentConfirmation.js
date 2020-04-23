Ext.ns('Ext.erp.iffs.ux.documentConfirmation');
/**
* @desc      Document Confirmation registration form
* @author    Wondwosen Desalegn
* @copyright (c) 2017, Cybersoft
* @date      November 01, 2017
* @namespace Ext.erp.iffs.ux.documentConfirmation
* @class     Ext.erp.iffs.ux.documentConfirmation.Form
* @extends   Ext.form.FormPanel
*/
Ext.erp.iffs.ux.documentConfirmation.Form = function (config) {
    Ext.erp.iffs.ux.documentConfirmation.Form.superclass.constructor.call(this, Ext.apply({
        paramOrder: ['id'],
        defaults: {
            anchor: '95%',
            labelStyle: 'text-align:right;',
            msgTarget: 'side'
        },
        id: 'documentConfirmation-form',
        padding: 5,
        labelWidth: 80,
        autoHeight: true,
        border: false,
        baseCls: 'x-plain',
        items: [{
            name: 'Id',
            xtype: 'hidden'
        }, {
            xtype: 'radiogroup',
            fieldLabel: '',
            items: [
                { boxLabel: 'Confirm', name: 'Type', inputValue: 'Confirm', checked: true },
                { boxLabel: 'Reject', name: 'Type', inputValue: 'Reject' }
            ],
            listeners: {
                change: function( field, checked ) {
                    var form = Ext.getCmp('documentConfirmation-form').getForm();
                    if (checked.boxLabel == 'Reject') {
                        form.findField('Comment').show();
                    } else {
                        form.findField('Comment').hide();
                    }
                    
                }
            }
        }, {
            name: 'Comment',
            xtype: 'textarea',
            fieldLabel: 'Comment',
            height: 100,
            hidden: true,
            allowBlank: true
        }]
    }, config));
};
Ext.extend(Ext.erp.iffs.ux.documentConfirmation.Form, Ext.form.FormPanel);
Ext.reg('documentConfirmation-form', Ext.erp.iffs.ux.documentConfirmation.Form);

/**
* @desc      Document Confirmation registration form host window
* @author    Wondwosen Desalegn
* @copyright (c) 2017, Cybersoft
* @date      November 01, 2017
* @namespace Ext.erp.iffs.ux.documentConfirmation
* @class     Ext.erp.iffs.ux.documentConfirmation.Window
* @extends   Ext.Window
*/
Ext.erp.iffs.ux.documentConfirmation.Window = function (config) {
    Ext.erp.iffs.ux.documentConfirmation.Window.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        width: 500,
        autoHeight: true,
        closeAction: 'close',
        modal: true,
        resizable: false,
        buttonAlign: 'right',
        bodyStyle: 'padding:5px;'
    }, config));
};
Ext.extend(Ext.erp.iffs.ux.documentConfirmation.Window, Ext.Window, {
    initComponent: function () {
        var win = this;
        this.form = new Ext.erp.iffs.ux.documentConfirmation.Form({
            api: win.api
        });
        this.items = [this.form];
        this.buttons = [{
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
        Ext.erp.iffs.ux.documentConfirmation.Window.superclass.initComponent.call(this, arguments);
    },
    onSave: function () {
        this.form.getForm().findField('Id').setValue(this.id);
        if (!this.form.getForm().isValid()) return;
        var win = this;
        this.form.getForm().submit({
            waitMsg: 'Please wait...',
            success: function (form, action) {
                win.close();
                win.cmpPaging.doRefresh();
            },
            failure: function (form, action) {
                win.close();
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
Ext.reg('documentConfirmation-window', Ext.erp.iffs.ux.documentConfirmation.Window);