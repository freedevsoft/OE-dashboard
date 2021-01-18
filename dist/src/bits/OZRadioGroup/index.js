"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _antd = require("antd");

var _propTypes = _interopRequireDefault(require("prop-types"));

var _utils = require("../utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var OZRadioGroup = function OZRadioGroup(_ref) {
  var label = _ref.label,
      extra = _ref.extra,
      initialValue = _ref.initialValue,
      field = _ref.field,
      getFieldDecorator = _ref.getFieldDecorator,
      required = _ref.required,
      combines = _ref.combines,
      labelCol = _ref.labelCol,
      wrapperCol = _ref.wrapperCol,
      style = _ref.style;
  return _react.default.createElement(_antd.Form.Item, {
    label: label,
    extra: extra,
    labelCol: labelCol,
    wrapperCol: wrapperCol,
    style: style
  }, getFieldDecorator(field, {
    initialValue: (0, _utils.getDepthValue)(initialValue),
    rules: [{
      required: required,
      message: 'This field is required'
    }]
  })(_react.default.createElement(_antd.Radio.Group, null, combines.map(function (item) {
    return _react.default.createElement(_antd.Radio, {
      value: item.value,
      key: item.value
    }, item.label);
  }))));
};

OZRadioGroup.propTypes = {
  extra: _propTypes.default.string,
  label: _propTypes.default.string,
  required: _propTypes.default.bool,
  initialValue: _propTypes.default.string,
  combines: _propTypes.default.array,
  labelCol: _propTypes.default.object,
  wrapperCol: _propTypes.default.object,
  style: _propTypes.default.object
};
OZRadioGroup.defaultProps = {
  extra: '',
  label: '',
  required: true,
  initialValue: undefined,
  combines: [],
  labelCol: {
    md: {
      span: 6
    },
    sm: {
      span: 12
    }
  },
  wrapperCol: {
    md: {
      span: 18
    },
    sm: {
      span: 12
    }
  },
  style: {}
};
var _default = OZRadioGroup;
exports.default = _default;

//# sourceMappingURL=index.js.map