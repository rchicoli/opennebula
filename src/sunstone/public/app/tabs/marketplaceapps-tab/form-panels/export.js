/* -------------------------------------------------------------------------- */
/* Copyright 2002-2015, OpenNebula Project, OpenNebula Systems                */
/*                                                                            */
/* Licensed under the Apache License, Version 2.0 (the "License"); you may    */
/* not use this file except in compliance with the License. You may obtain    */
/* a copy of the License at                                                   */
/*                                                                            */
/* http://www.apache.org/licenses/LICENSE-2.0                                 */
/*                                                                            */
/* Unless required by applicable law or agreed to in writing, software        */
/* distributed under the License is distributed on an "AS IS" BASIS,          */
/* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.   */
/* See the License for the specific language governing permissions and        */
/* limitations under the License.                                             */
/* -------------------------------------------------------------------------- */

define(function(require) {
  /*
    DEPENDENCIES
   */

  var BaseFormPanel = require('utils/form-panels/form-panel');
  var Sunstone = require('sunstone');
  var Locale = require('utils/locale');
  var Notifier = require('utils/notifier');
  var Tips = require('utils/tips');
  var DataStoresTable = require('tabs/datastores-tab/datatable');
  var DataStore = require('opennebula/datastore');
  var Config = require('sunstone-config');
  var WizardFields = require('utils/wizard-fields');

  /*
    TEMPLATES
   */

  var TemplateWizardHTML = require('hbs!./export/wizard');

  /*
    CONSTANTS
   */

  var FORM_PANEL_ID = require('./export/formPanelId');
  var TAB_ID = require('../tabId');

  /*
    CONSTRUCTOR
   */

  function FormPanel() {
    this.formPanelId = FORM_PANEL_ID;
    this.tabId = TAB_ID;
    this.actions = {
      'export': {
        'title': Locale.tr("Export App To OpenNebula"),
        'buttonText': Locale.tr("Export"),
        'resetButton': true
      }
    };

    this.datastoresTable = new DataStoresTable(
      FORM_PANEL_ID + 'datastoresTable', {
        'select': true,
        'selectOptions': {
          'filter_fn': function(ds) { return ds.TYPE == DataStore.TYPES.IMAGE_DS; } // Show system DS only
        }
      });

    BaseFormPanel.call(this);
  }

  FormPanel.FORM_PANEL_ID = FORM_PANEL_ID;
  FormPanel.prototype = Object.create(BaseFormPanel.prototype);
  FormPanel.prototype.constructor = FormPanel;
  FormPanel.prototype.htmlWizard = _htmlWizard;
  FormPanel.prototype.submitWizard = _submitWizard;
  FormPanel.prototype.onShow = _onShow;
  FormPanel.prototype.setup = _setup;

  return FormPanel;

  /*
    FUNCTION DEFINITIONS
   */

  function _htmlWizard() {
    return TemplateWizardHTML({
      'formPanelId': this.formPanelId,
      'datastoresTableHTML': this.datastoresTable.dataTableHTML
    });
  }

  function _onShow(context) {
    this.datastoresTable.resetResourceTableSelect();

    $("#NAME", context).focus();

    return false;
  }

  // Set up the create datastore context
  function _setup(context) {
    Tips.setup(context);

    this.datastoresTable.initialize();
    this.datastoresTable.idInput().attr('required', '');
  }


  function _submitWizard(context) {
    var marketPlaceAppObj = {
      "name" : $("#NAME", context).val(),
      "dsid" : this.datastoresTable.idInput().val()
    };

    Sunstone.runAction("MarketPlaceApp.export", Sunstone.getDataTable(TAB_ID).elements(), marketPlaceAppObj);
    return false;
  }
});
