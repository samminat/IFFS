Ext.ns('Ext.erp.iffs.ux.reception');

/**
* @desc      Login form
* @author    Wondwosen Desalegn
* @copyright (c) 2010, Cybersoft
* @date      November 01, 2010
* @namespace Ext.erp.iffs.ux.reception
* @class     Ext.erp.iffs.ux.reception.LoginForm
* @extends   Ext.form.FormPanel
*/
Ext.erp.iffs.ux.reception.LoginForm = function (config) {
    Ext.erp.iffs.ux.reception.LoginForm.superclass.constructor.call(this, Ext.apply({
        api: {
            submit: Reception.Login
        },
        id: 'login-form',
        defaults: {
            anchor: '95%',
            labelStyle: 'text-align:right;',
            msgTarget: 'side'
        },
        cls: 'x-small-editor reception-LoginWindow-formPanel',
        id: 'login-form',
        padding: 5,
        labelWidth: 150,
        autoHeight: true,
        border: false,
        baseCls: 'x-plain',
        monitorValid: true
    }, config));
}
Ext.extend(Ext.erp.iffs.ux.reception.LoginForm, Ext.form.FormPanel);
Ext.reg('login-form', Ext.erp.iffs.ux.reception.LoginForm);

/**
* @desc      Login form host window
* @author    Wondwosen Desalegn
* @copyright (c) 2010, Cybersoft
* @date      November 01, 2010
* @namespace Ext.erp.iffs.ux.reception
* @class     Ext.erp.iffs.ux.reception.LoginWindow
* @extends   Ext.Window
*/
Ext.erp.iffs.ux.reception.LoginWindow = function (config) {
    Ext.erp.iffs.ux.reception.LoginWindow.superclass.constructor.call(this, Ext.apply({
        layout: 'form',
        width: 490,
        height : 335,
        modal: true,
        closable: false,
        resizable: false,
        buttonAlign: 'right',
        bodyStyle: 'padding:5px;',
        cls: 'reception-LoginWindow'
    }, config));
}
Ext.extend(Ext.erp.iffs.ux.reception.LoginWindow, Ext.Window, {
    _defaultFocusField: 'Username',
    _softwareLabel: 'CYBER ERP 3.0',
    _editionLabel: 'Enterprise Edition',
    _versionLabel: 'Enterprise Edition V3.0',
    _loginButton: null,
    _exitButton: null,
    _headerPanel: null,
    _formPanel: null,
    _usernameField: null,
    _passwordField: null,
    initComponent: function () {
        var buttonConfig = [];
        this._loginButton = this._createLoginButton();
        if (this.showExit) {
            this._exitButton = this._createExitButton();
            buttonConfig.push(this._exitButton);
        }
        buttonConfig.push(this._loginButton);
        this._usernameField = this._createUsernameField();
        if (this.usernameValue) {
            this._usernameField.setValue(this.usernameValue);
            this._usernameField.setDisabled(true);
            this._defaultFocusField = 'Password';
        }
        this._passwordField = this._createPasswordField();
        this._headerPanel = this._createHeaderPanel();
        this._formPanel = this._createFormPanel(this._usernameField, this._passwordField);
        
        this.items = [{
                xtype  :'box',
                cls    : 'reception-LoginWindow-Logo',
                autoEl : {
                    tag  : 'img',
                    src : 'Content/images/app/logo.png'
            }}, this._headerPanel, this._formPanel, {
                xtype  :'box',
                cls    : 'reception-LoginWindow-versionLabel',
                autoEl : {
                    tag  : 'div',
                    html : this._versionLabel
            }}];
        this.bbar = [{ xtype: 'tbfill' }, this._loginButton];
        this.addEvents('exit', 'beforelogin', 'loginsuccess', 'loginfailure');
        Ext.erp.iffs.ux.reception.LoginWindow.superclass.initComponent.call(this, arguments);
    },
    initEvents: function () {
        this.on('show', function () {
            try {
                if (this.defaultFocusField == 'password') {
                    this._passwordField.focus('', 10);
                } else {
                    this._usernameField.focus('', 10);
                }
            } catch (e) {
                
            }
        }, this);
        Ext.erp.iffs.ux.reception.LoginWindow.superclass.initEvents.call(this, arguments);
    },
    afterRender: function() {
        Ext.erp.iffs.ux.reception.LoginWindow.superclass.afterRender.call(this, arguments);
    },
    _onClientValidation : function(formPanel, isValid)
    {
        if (!isValid) {
            this._loginButton.setDisabled(true);
        } else {
            this._loginButton.setDisabled(false);
        }
    },
    _onLoginSuccess: function (basicForm, action) {
        this.fireEvent('loginsuccess', basicForm, action);
    },
    _onLoginFailure: function (basicForm, action) {
        if (!Ext.erp.iffs.ux.Reception.isClosed()) {
            this._passwordField.setValue('');
            Ext.MessageBox.show({
                title: 'Failure',
                msg: action.result.data,
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.ERROR,
                scope: this
            });
        }
        try {
            this._passwordField.focus('', 10);
        } catch (e) {
        }

        this.fireEvent('loginfailure', basicForm, action);
    },
    _onLoginButtonClick: function (button) {
        this._doSubmit();
    },
    _onExitButtonClick: function (button) {
        this.fireEvent('exit');
    },
    _onSpecialKey: function (textField, eventObject) {
        var keyCode = eventObject.getKey();
        var eO = Ext.EventObject;

        if (keyCode != eO.ENTER && keyCode != eO.RETURN) {
            return;
        }

        if (this._usernameField.getValue().trim() == ""
            || this._passwordField.getValue().trim() == "") {
            return;
        }

        this._doSubmit();
    },
    _doSubmit: function () {
        var username = this.usernameValue || this._usernameField.getValue();

        if (this.fireEvent('beforelogin', this, username, this._passwordField.getValue()) === false) {
            return;
        }

        var params = {
            username: username,
            password: this._passwordField.getValue()
        };

        if (this.lastUserRequest) {
            params.lastUserRequest = this.lastUserRequest;
        }

        this._formPanel.form.submit({
            waitMsg: 'Please wait...',
            params: params,
            success: this._onLoginSuccess,
            failure: this._onLoginFailure,
            scope: this
        });
    },
    _createLoginButton: function () {
        var lbutton = new Ext.Button({
            text: 'Login',
            minWidth: 75,
            disabled: true,
            handler: this._onLoginButtonClick,
            scope: this,
            iconCls: 'icon-accept'
        });
        return lbutton;
    },
    _createExitButton: function () {
        var ebutton = new Ext.Button({
            text: 'Exit',
            minWidth: 75,
            handler: this._onExitButtonClick,
            scope: this
        });
        return ebutton;
    },
    _createUsernameField: function () {
        return new Ext.form.TextField({
            fieldLabel: 'Username',
            name: 'Username',
            preventMark: true,
            allowBlank: false,
            listeners: {
                specialkey: {
                    fn: this._onSpecialKey,
                    scope: this
                }
            }
        });
    },
    _createPasswordField: function () {
        return new Ext.form.TextField({
            inputType: 'password',
            allowBlank: false,
            preventMark: true,
            name: 'Password',
            fieldLabel: 'Password',
            listeners: {
                specialkey: {
                    fn: this._onSpecialKey,
                    scope: this
                }
            }
        });
    },
    _createHeaderPanel: function() {
        return new Ext.Panel ({
            baseCls : 'x-plain',
            html    : 'Access to this location is restricted to authorized users only.<br />Please type your username and password and click Login when you are ready.',
            cls     : 'reception-LoginWindow-Header',
            region  : 'north',
            height  : 60
        });
    },
    _createFormPanel: function (usernameField, passwordField) {
        return new Ext.erp.iffs.ux.reception.LoginForm({
            items: [
                usernameField,
                passwordField
            ],
            listeners: {
                clientvalidation: {
                    fn: this._onClientValidation,
                    scope: this
                }
            }
        });
    },
    showLoginButton: function (show) {
        this._loginButton.setVisible(show);
    },
    showFormPanel: function (show) {
        this._formPanel.setVisible(show);
    },
    setControlsDisabled: function (disable) {
        if (disable) {
            this._formPanel.stopMonitoring();
        } else {
            this._formPanel.startMonitoring();
        }
        this._loginButton.setDisabled(disable);
        if (!this.usernameValue) {
            this._usernameField.setDisabled(disable);
        }
        this._passwordField.setDisabled(disable);
        if (this._exitButton) {
            this._exitButton.setDisabled(disable);
        }
    },
});
Ext.reg('login-window', Ext.erp.iffs.ux.reception.LoginWindow);