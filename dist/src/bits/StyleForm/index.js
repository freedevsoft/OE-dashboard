"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _antd = require("antd");

var _OZRadioGroup = _interopRequireDefault(require("../OZRadioGroup"));

var _ColorPicker = _interopRequireDefault(require("../ColorPicker"));

var _utils = require("../utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var GroupStyle = function GroupStyle(_ref) {
  var data = _ref.data,
      _ref$form = _ref.form,
      getFieldDecorator = _ref$form.getFieldDecorator,
      getFieldValue = _ref$form.getFieldValue,
      setFieldsValue = _ref$form.setFieldsValue,
      field = _ref.field;

  var changeHandler = function changeHandler(field, value) {
    var key = field;
    setFieldsValue(_defineProperty({}, key, value));
  };

  getFieldDecorator("".concat(field, ".bg_image"), {
    initialValue: (0, _utils.getDepthValue)(data, 'bg_image')
  });
  getFieldDecorator("".concat(field, ".bg_type"), {
    initialValue: (0, _utils.getDepthValue)(data, 'bg_type')
  });
  getFieldDecorator("".concat(field, ".bg_color"), {
    initialValue: (0, _utils.getDepthValue)(data, 'bg_color', 'black')
  });
  getFieldDecorator("".concat(field, ".fg_color"), {
    initialValue: (0, _utils.getDepthValue)(data, 'fg_color', 'white')
  });
  getFieldDecorator("".concat(field, ".divider_type"), {
    initialValue: (0, _utils.getDepthValue)(data, 'divider_type')
  });
  getFieldDecorator("".concat(field, ".divider_image"), {
    initialValue: (0, _utils.getDepthValue)(data, 'divider_image')
  });
  getFieldDecorator("".concat(field, ".divider_color"), {
    initialValue: (0, _utils.getDepthValue)(data, 'divider_color', 'red')
  });
  return _react.default.createElement(_react.default.Fragment, null, _react.default.createElement(_OZRadioGroup.default, _extends({
    label: "Background",
    field: "".concat(field, ".bg_type"),
    initialValue: (0, _utils.getDepthValue)(data, 'bg_type'),
    getFieldDecorator: getFieldDecorator,
    combines: [{
      label: 'Image',
      value: 'image'
    }, {
      label: 'Color',
      value: 'color'
    }]
  }, _utils.inlineStyle, {
    required: false
  })), getFieldValue("".concat(field, ".bg_type")) === 'color' && _react.default.createElement(_antd.Form.Item, _extends({
    label: "Background Color"
  }, _utils.inlineStyle), _react.default.createElement(_ColorPicker.default, {
    color: getFieldValue("".concat(field, ".bg_color")),
    onValueChange: changeHandler,
    field: "".concat(field, ".bg_color")
  })), _react.default.createElement(_antd.Form.Item, _extends({
    label: "Foreground Color"
  }, _utils.inlineStyle), _react.default.createElement(_ColorPicker.default, {
    color: getFieldValue("".concat(field, ".fg_color")),
    onValueChange: changeHandler,
    field: "".concat(field, ".fg_color")
  })), _react.default.createElement(_OZRadioGroup.default, _extends({
    label: "Divider",
    field: "".concat(field, ".divider_type"),
    initialValue: (0, _utils.getDepthValue)(data, 'divider_type'),
    getFieldDecorator: getFieldDecorator,
    combines: [{
      label: 'Image',
      value: 'image'
    }, {
      label: 'Color',
      value: 'color'
    }]
  }, _utils.inlineStyle, {
    required: false
  })), getFieldValue("".concat(field, ".divider_type")) === 'color' && _react.default.createElement(_antd.Form.Item, _extends({
    label: "Divider Color"
  }, _utils.inlineStyle), _react.default.createElement(_ColorPicker.default, {
    color: getFieldValue("".concat(field, ".divider_color")),
    onValueChange: changeHandler,
    field: "".concat(field, ".divider_color")
  })));
};

var _default = GroupStyle;
exports.default = _default;

//# sourceMappingURL=index.js.map