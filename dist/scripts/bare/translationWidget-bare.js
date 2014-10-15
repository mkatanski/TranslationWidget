// Generated by CoffeeScript 1.7.1
jQuery(function($) {
  var EditorBase, EditorWindow, FileEditor, LanguageTabs, Plugin, TextEditor, TranslationWidget,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Plugin = (function() {
    var defaultOptions;

    defaultOptions = {
      debug: false,
      messageScope: 'warning'
    };

    function Plugin(element, options, instanceName) {
      this.element = element;
      this.options = $.extend({}, defaultOptions, options);
      this.instanceName = instanceName;
      this.defaults = defaultOptions;
    }

    Plugin.prototype.log = function(msg, type) {
      var msgColor, prefix, show, titleColor;
      if (type == null) {
        type = 'info';
      }
      if (this.options.debug === true) {
        prefix = '';
        show = true;
        if (this.options.messageScope === 'error' && type === 'info') {
          show = false;
        }
        if (this.options.messageScope === 'error' && type === 'warning') {
          show = false;
        }
        if (this.options.messageScope === 'warning' && type === 'info') {
          show = false;
        }
        if (type === 'debug') {
          show = true;
        }
        if (type === 'info') {
          titleColor = 'background: white; color: grey';
          msgColor = 'background: white; color: green';
        }
        if (type === 'error') {
          titleColor = 'background: red; color: white';
          msgColor = 'background: white; color: red';
          prefix = '(Error!)';
        }
        if (type === 'warning') {
          titleColor = 'background: white; color: orange';
          msgColor = 'background: white; color: orange';
          prefix = '(Warning)';
        }
        if (show) {
          console.log("%c " + this.instanceName + ": " + prefix + " %c " + msg, titleColor, msgColor);
        }
      }
    };

    Plugin.prototype.getPluginByInstanceName = function(domElement, instName, numeric, callback) {
      if (numeric == null) {
        numeric = -1;
      }
      if (numeric > -1) {
        return $.data(domElement, instName);
      } else {
        return $.data(domElement, instName);
      }
    };

    Plugin.prototype.runForEachInstance = function(selector, callback) {
      var i, iName;
      i = 0;
      iName = this.pluginName;
      $(selector).each(function() {
        i = i + 1;
        if ($.data(this, iName + '_' + i) != null) {
          return callback($.data(this, iName + '_' + i));
        } else if ($.data(this, iName + '_#' + $(this).attr('id')) != null) {
          return callback($.data(this, iName + '_#' + $(this).attr('id')));
        }
      });
    };

    return Plugin;

  })();

  EditorBase = (function() {
    EditorBase.Type = 'editor';

    EditorBase.mode = 'new';

    EditorBase.editorHtml = "<div id=\"" + EditorBase.langCode + "\" class=\"editor toRemove\" >\n  <textarea class=\"m-wrap new-word\" placeholder=\"Text to translate\" rows=\"1\"></textarea>\n</div>";

    function EditorBase(base, parent, langCode) {
      this.base = base;
      this.parent = parent;
      this.langCode = langCode;
      this.parent.find('.editor').hide();
      if (this.parent.find('#' + this.langCode).length === 1) {
        this.mode = 'edit';
        this._currentElement = this.parent.find('#' + this.langCode);
        this._currentElement.show();
        this.base.log("[" + this.langCode + "] " + this.Type + " ready for edit");
      } else {
        this._currentElement = $(this.editorHtml);
        this._currentElement.appendTo(this.parent);
        this.base.log("New " + this.Type + " [" + this.langCode + "] created");
      }
      return;
    }

    EditorBase.prototype.save = function() {
      this._currentElement.removeClass('toRemove');
      if (!this.base.languageTabs.buttonExists(this.langCode)) {
        this.base.languageTabs.addButton(this.langCode);
      }
      this.base.log("" + this.Type + " [" + this.langCode + "] saved");
      this.base.languageTabs.highlight(this.langCode);
    };

    EditorBase.prototype.discard = function() {
      if (this._currentElement.hasClass('toRemove')) {
        this._currentElement.remove();
        this.base.log("" + this.Type + " [" + this.langCode + "] removed");
      }
    };

    EditorBase.prototype.remove = function() {
      this._currentElement.remove();
      this.base.log("" + this.Type + " [" + this.langCode + "] removed manually");
    };

    EditorBase.prototype.getElement = function() {
      return this._currentElement;
    };

    return EditorBase;

  })();

  TextEditor = (function(_super) {
    __extends(TextEditor, _super);

    function TextEditor(base, parent, langCode, initialValue) {
      var name;
      if (initialValue == null) {
        initialValue = '';
      }
      this.Type = 'TextEditor';
      name = base.options.inputNamePrefix + base.instanceName + ("[" + langCode + "]");
      this.editorHtml = "<div id=\"" + langCode + "\" class=\"editor toRemove\" >\n  <textarea name=\"" + name + "\" class=\"m-wrap new-word\" placeholder=\"Text to translate\" rows=\"1\"></textarea>\n</div>";
      TextEditor.__super__.constructor.call(this, base, parent, langCode);
      if (initialValue !== '') {
        this._currentElement.find('.new-word').val(initialValue);
      }
      if (this.mode === 'edit') {
        this._currentElement.data('current', this._currentElement.find('.new-word').val());
        this.parent.find('.apply').text('Update');
      } else {
        this.parent.find('.apply').text('Apply');
      }
      return;
    }

    TextEditor.prototype.save = function() {
      this._currentElement.removeData('current');
      TextEditor.__super__.save.call(this);
    };

    TextEditor.prototype.discard = function() {
      TextEditor.__super__.discard.call(this);
      if (!this._currentElement.hasClass('toRemove')) {
        if (this._currentElement.data('current')) {
          this._currentElement.find('.new-word').val(this._currentElement.data('current'));
          this.base.log("Changes in TextEditor [" + this.langCode + "] discarded");
        }
      }
    };

    return TextEditor;

  })(EditorBase);

  FileEditor = (function(_super) {
    __extends(FileEditor, _super);

    function FileEditor(base, parent, langCode, value) {
      var name;
      if (value == null) {
        value = '';
      }
      this.Type = 'FileEditor';
      name = base.instanceName + ("[" + langCode + "]");
      this.editorHtml = "<div id=\"" + langCode + "\" class=\"editor toRemove\" >\n  <input name=\"" + name + "\" type=\"file\" />\n  <div class=\"infoText\">" + value + "</div>\n</div>";
      FileEditor.__super__.constructor.call(this, base, parent, langCode);
      this.parent.find('.apply').text('Save');
      if (this.mode === 'edit') {
        this.parent.find('.apply').hide();
        this._currentElement.css('height', '50px');
      } else {
        this.parent.find('.apply').show();
        this._currentElement.css('height', 'auto');
      }
      this._currentElement.find('input[type=file]').on('change.' + this.base.pluginName, (function(_this) {
        return function(e) {
          return _this.base.languageTabs.highlight(_this.langCode);
        };
      })(this));
      return;
    }

    return FileEditor;

  })(EditorBase);

  EditorWindow = (function() {
    function EditorWindow(base) {
      var applyBtn;
      this.base = base;
      this._render();
      this.base.log('Editor Window rendered');
      this.status = 'closed';
      applyBtn = this._currentElement.find('.apply');
      applyBtn.on('click.' + this.base.pluginName, (function(_this) {
        return function(e) {
          e.preventDefault();
          _this.currentEditor.save();
          _this.setOptionAsTranslated(_this.translation);
          applyBtn.text('Update');
        };
      })(this));
      return;
    }

    EditorWindow.prototype.show = function(translation) {
      if (translation == null) {
        translation = 'new';
      }
      if (this.status === 'open') {
        if (translation === this.translation) {
          this.hide();
          return;
        }
      }
      this.translation = translation;
      this.base.closeAllEditors();
      this._createLangList();
      this._setEditorFor(this.translation);
      $(this.base.baseElement).find('.input-prepend').addClass('show');
      this.status = 'open';
      this.base.log("Show editor window (translation: " + this.translation + ")");
    };

    EditorWindow.prototype._setEditorFor = function(lang, initialValue) {
      var editors;
      if (initialValue == null) {
        initialValue = '';
      }
      editors = this._currentElement.find('.editors');
      if (lang === 'new') {
        editors.hide();
      } else {
        if (this.base._inputType === 'text') {
          this.currentEditor = new TextEditor(this.base, editors, lang, initialValue);
        } else {
          this.currentEditor = new FileEditor(this.base, editors, lang);
        }
        editors.show();
      }
    };

    EditorWindow.prototype._createLangList = function() {
      var label;
      this.langList = $('<select />', {
        "class": "select-language",
        "tabindex": 1
      });
      label = this.base.options.customSelectLabel;
      this.langList.append("<option value=\"new\">" + label + "</option>");
      $.each(this.base.languages, (function(_this) {
        return function(key, value) {
          var option;
          option = $("<option value=\"" + key + "\">" + value + "</option>");
          if (_this.base.languageTabs.buttonExists(key)) {
            option.addClass('translated');
          }
          return _this.langList.append(option);
        };
      })(this));
      this.langList.find("option[value=\"" + this.translation + "\"]").attr('selected', 'selected');
      this.langList.on('change.' + this.base.pluginName, (function(_this) {
        return function() {
          _this.translation = _this.langList.val();
          if (_this.currentEditor != null) {
            _this.currentEditor.discard();
          }
          return _this._setEditorFor(_this.langList.val());
        };
      })(this));
      this._currentElement.find('.translation-content').prepend(this.langList);
      this.base.log('List of languages created');
    };

    EditorWindow.prototype.setOptionAsTranslated = function(langCode) {
      this.langlist = this._currentElement.find('select');
      this.langlist.find("option[value=\"" + langCode + "\"]").addClass('translated');
    };

    EditorWindow.prototype.removeLang = function(langCode) {
      this._setEditorFor(langCode);
      this.currentEditor.remove();
    };

    EditorWindow.prototype.addLang = function(langCode, translation) {
      if (this.base.languages[langCode] != null) {
        this._setEditorFor(langCode, translation);
        return this.currentEditor.save();
      } else {
        return this.base.log("There is no " + langCode + " language", 'warning');
      }
    };

    EditorWindow.prototype.hide = function() {
      if (this.status === 'open') {
        this.base.log('Hide editor window');
        $(this.base.baseElement).find('.input-prepend').removeClass('show');
        this.langList.remove();
        if (this.currentEditor != null) {
          this.currentEditor.discard();
        }
        this.status = 'closed';
      }
    };

    EditorWindow.prototype._render = function() {
      var ewHTML;
      ewHTML = '<div class="translation-options">\n  <div class="translation-content">\n    <div class="current-language">\n      <div class="editors">\n        <a href="#" class="btn blue apply">Apply</a>\n      </div>\n      <span class="hide-border"></span>\n    </div>\n  </div>\n</div>';
      $(ewHTML).insertAfter(this.base.baseElement.find('.lang-translation'));
      this._currentElement = this.base.baseElement.find('.translation-options');
    };

    return EditorWindow;

  })();

  LanguageTabs = (function() {
    function LanguageTabs(base) {
      this.base = base;
      this.buttons = [];
      this.base.log('Language tabs created');
      this._render();
      this.baseInputWidth = parseInt(this.base.baseElement.find('.lang-translation').width());
      this.tglBtnWidth = parseInt(this.base.baseElement.find('.open-translation').width());
      this.tglBtnMarginRight = parseInt(this.base.baseElement.find('.open-translation').css('marginRight'));
      return;
    }

    LanguageTabs.prototype._render = function() {
      var ltHTML;
      ltHTML = '<div class="language-tabs"></div>';
      $(ltHTML).insertAfter(this.base.baseElement.find('.translation-options'));
      this._currentElement = this.base.baseElement.find('.language-tabs');
      return this.base.log('Language tabs rendered');
    };

    LanguageTabs.prototype.addButton = function(langCode) {
      var removeIcon, span;
      if (this.buttonExists(langCode)) {
        this.base.log("Cannot add [" + langCode + "]! Button exists.", 'error');
        return;
      }
      span = $("<span id=\"" + langCode + "\" class=\"chosen-language\"/>").text(langCode);
      removeIcon = $('<a href="#" class="remove icon icon-remove" />');
      removeIcon.appendTo(span);
      removeIcon.on('click.' + this.base.pluginName, (function(_this) {
        return function(e) {
          e.preventDefault();
          e.stopPropagation();
          return _this.base.showConfirmBox(function() {
            _this.removeLanguage(langCode);
          });
        };
      })(this));
      span.on('click.' + this.base.pluginName, (function(_this) {
        return function() {
          _this.base.log("LangBtn [" + langCode + "] clicked");
          return _this.base.edWindow.show(langCode);
        };
      })(this));
      span.appendTo(this._currentElement);
      this.base.log("Button added: " + langCode);
      this._updateInputWidth();
      this.base._checkTranslationExistence();
    };

    LanguageTabs.prototype.removeLanguage = function(langCode) {
      this.base.edWindow.removeLang(langCode);
      this.base.edWindow.hide();
      this._currentElement.find('#' + langCode).fadeOut((function(_this) {
        return function() {
          _this._currentElement.find('#' + langCode).remove();
          _this.base.log("Button [" + langCode + "] removed");
          _this._updateInputWidth();
          _this.base._checkTranslationExistence();
        };
      })(this));
    };

    LanguageTabs.prototype.buttonExists = function(langCode) {
      if (this._currentElement.find('#' + langCode).length === 1) {
        return true;
      } else {
        return false;
      }
    };

    LanguageTabs.prototype.getAllLanguages = function() {
      var langBtns, list;
      list = new Array();
      langBtns = this._currentElement.find('.chosen-language');
      langBtns.each(function() {
        return list.push($(this).attr('id'));
      });
      return list;
    };

    LanguageTabs.prototype.highlight = function(langCode) {
      var button;
      button = this._currentElement.find('#' + langCode);
      if (button.hasClass('highlight')) {
        button.replaceWith(button.clone(true));
      } else {
        button.addClass('highlight');
      }
    };

    LanguageTabs.prototype._updateInputWidth = function() {
      var btnMargins, btnPadding, btnWidth, btns, btnsTotalWidth, margin;
      margin = 8;
      btns = this._currentElement.children('span');
      btnMargins = parseInt(btns.css('marginLeft')) + parseInt(btns.css('marginRight'));
      btnPadding = parseInt(btns.css('paddingLeft')) + parseInt(btns.css('paddingRight'));
      btnWidth = parseInt(btns.width()) + btnPadding + btnMargins;
      btnsTotalWidth = (btnWidth * btns.length) + this.tglBtnWidth + this.tglBtnMarginRight + margin;
      if (btnsTotalWidth > this.baseInputWidth) {
        this.base.baseElement.find('.lang-translation').width(btnsTotalWidth + margin);
      } else {
        this.base.baseElement.find('.lang-translation').width(this.baseInputWidth);
      }
    };

    return LanguageTabs;

  })();

  TranslationWidget = (function(_super) {
    var defLanguages, defaultOptions;

    __extends(TranslationWidget, _super);

    defaultOptions = {
      dataSource: 'json',
      useDefaultLanguages: true,
      inputNamePrefix: '',
      customSelectLabel: 'Please Select',
      confirmBox: {
        yesText: 'Yes, delete',
        noText: 'No, go away!',
        infoMessage: 'Are you sure ?',
        hText: 'Confirm your request',
        outerClick: false,
        useKeys: true
      }
    };

    defLanguages = {
      "PL": "Polish",
      "EN": "English",
      "FR": "French",
      "ES": "Spanish",
      "DE": "German"
    };

    function TranslationWidget(element, options, instanceName, pluginName, languages) {
      var elementName;
      this.pluginName = pluginName;
      options = $.extend({}, defaultOptions, options);
      if (options.useDefaultLanguages) {
        this.languages = $.extend(true, {}, defLanguages, languages);
      } else {
        this.languages = languages;
      }
      instanceName = $(element).parents(".control-group").find("label").text().replace(" ", "_");
      instanceName = instanceName;
      TranslationWidget.__super__.constructor.call(this, element, options, instanceName, languages);
      this._currentElement = $(element);
      elementName = this._currentElement.prop("tagName").toLowerCase();
      if (elementName !== 'input') {
        this.log('Element should be HTML <input />', 'error');
        return;
      } else {
        this._constructSkeleton();
      }
      return;
    }

    TranslationWidget.prototype.init = function() {
      this.baseElement = this._currentElement.parents('.control-group');
      this._inputType = this._currentElement.attr('type').toLowerCase();
      if (this._inputType === 'file') {
        this.log('Input type is file');
        this._currentElement.attr('type', 'text').addClass('replacement');
      }
      this._createToggleBtn();
      this.edWindow = new EditorWindow(this);
      this.languageTabs = new LanguageTabs(this);
      this.tglBtn.on('click.' + this.pluginName, (function(_this) {
        return function() {
          _this.log('toggleBtn clicked!');
          return _this.edWindow.show();
        };
      })(this));
      $('body').off('click.' + this.pluginName);
      $('body').on('click.' + this.pluginName, (function(_this) {
        return function() {
          return _this.closeAllEditors();
        };
      })(this));
      $(this.baseElement).on('click.' + this.pluginName, function(e) {
        e.stopPropagation();
      });
      this._fillData();
    };

    TranslationWidget.prototype.clearData = function(showConfirmation) {
      var langCode, list, _i, _len;
      if (showConfirmation == null) {
        showConfirmation = true;
      }
      list = this.languageTabs.getAllLanguages();
      if (showConfirmation) {
        this.showConfirmBox((function(_this) {
          return function() {
            var langCode, _i, _len;
            for (_i = 0, _len = list.length; _i < _len; _i++) {
              langCode = list[_i];
              _this.languageTabs.removeLanguage(langCode);
            }
          };
        })(this));
      } else {
        for (_i = 0, _len = list.length; _i < _len; _i++) {
          langCode = list[_i];
          this.languageTabs.removeLanguage(langCode);
        }
      }
    };

    TranslationWidget.prototype._constructSkeleton = function() {
      var wrapBox;
      wrapBox = $('<div />', {
        'class': 'input-prepend form-translation'
      });
      this._currentElement.wrap(wrapBox);
    };

    TranslationWidget.prototype._createToggleBtn = function() {
      var tgHTML;
      tgHTML = '<span class="add-on open-translation">\n  <i class="icon icon-options"></i>\n</span>';
      $(tgHTML).insertBefore(this.baseElement.find('.lang-translation'));
      return this.tglBtn = this.baseElement.find('.open-translation');
    };

    TranslationWidget.prototype._fillData = function() {
      var dataObject;
      dataObject = null;
      if ($.isFunction(this.options.dataSource)) {
        this.log('dataSource is a function');
        this._processDataForEach(this.options.dataSource(this.instanceName));
      } else if (typeof this.options.dataSource === 'object') {
        this.log('dataSource is an object');
        this._processDataForEach(this.options.dataSource);
      } else {
        this.log('No data source', 'warning');
      }
    };

    TranslationWidget.prototype._processDataForEach = function(dataObject) {
      return this.runForEachInstance('input.lang-translation', function(instance) {
        var curTransObj, langCode, translation;
        curTransObj = dataObject[instance.instanceName];
        for (langCode in curTransObj) {
          translation = curTransObj[langCode];
          instance.edWindow.addLang(langCode, translation);
        }
      });
    };

    TranslationWidget.prototype.closeAllEditors = function() {
      this.log('Closing all editor windows');
      $('body').find('.control-group').removeClass('show');
      this.runForEachInstance('input.lang-translation', function(instance) {
        return instance.edWindow.hide();
      });
    };

    TranslationWidget.prototype.showConfirmBox = function(callback) {
      var containerHTML, msgBox;
      containerHTML = "<div id=\"confirmOverlay\">\n  <div id=\"confirmBox\">\n    <h1>" + this.options.confirmBox.hText + "</h1>\n    <p>" + this.options.confirmBox.infoMessage + "</p>\n    <div id=\"confirmButtons\" style=\"color: black\">\n      <a class=\"button yes\" id=\"removeYes\" href=\"#\">\n        " + this.options.confirmBox.yesText + "\n      </a>\n      <a class=\"button no\" id=\"removeNo\" href=\"#\">\n        " + this.options.confirmBox.noText + "\n      </a>\n    </div>\n  </div>\n</div>";
      msgBox = $(containerHTML);
      msgBox.find('#removeYes').on('click.' + this.pluginName, (function(_this) {
        return function(e) {
          e.preventDefault();
          callback();
          msgBox.remove();
        };
      })(this));
      msgBox.find('#removeNo').on('click.' + this.pluginName, (function(_this) {
        return function(e) {
          e.preventDefault();
          msgBox.remove();
        };
      })(this));
      msgBox.hide().appendTo('body').fadeIn();
    };

    TranslationWidget.prototype._checkTranslationExistence = function() {
      if (this.languageTabs.getAllLanguages().length > 0) {
        this._currentElement.val('filled');
      } else {
        this._currentElement.val('');
      }
    };

    return TranslationWidget;

  })(Plugin);

  (function($, window, document, undefined_) {
    var pluginName;
    pluginName = "translationWidget";
    $.fn[pluginName] = function(options, languages) {
      var count, instanceCount;
      count = 0;
      instanceCount = this.length;
      this.each(function() {
        var instanceName, newInstance;
        count = count + 1;
        if (instanceCount === 1) {
          count = '#' + $(this).attr('id');
        }
        instanceName = pluginName + '_' + count;
        newInstance = new TranslationWidget(this, options, instanceName, pluginName, languages);
        if (!$.data(this, instanceName)) {
          $.data(this, instanceName, newInstance);
          return newInstance.init();
        }
      });
    };
  })(jQuery, window, document);

});
