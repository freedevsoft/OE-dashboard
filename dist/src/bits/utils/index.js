"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDepthValue = exports.inlineStyle = void 0;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var inlineStyle = {
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
  }
};
exports.inlineStyle = inlineStyle;

var getDepthValue = function getDepthValue(data, field) {
  var initialValue = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
  if (!data) return initialValue;

  if (!field || field === '') {
    return data || initialValue;
  }

  var terms = field.split('.');

  var current = _objectSpread({}, data);

  for (var i = 0; i < terms.length; i += 1) {
    if (!current[terms[i]]) return initialValue;
    current = current[terms[i]];
  }

  return current;
};

exports.getDepthValue = getDepthValue;

//# sourceMappingURL=index.js.map