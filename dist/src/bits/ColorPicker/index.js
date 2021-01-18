"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactColor = require("react-color");

require("./index.scss");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var ColorPicker =
/*#__PURE__*/
function (_React$Component) {
  _inherits(ColorPicker, _React$Component);

  function ColorPicker(props) {
    var _this;

    _classCallCheck(this, ColorPicker);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ColorPicker).call(this, props));

    _defineProperty(_assertThisInitialized(_this), "onTrigger", function () {
      console.log('trigger');

      _this.setState({
        openPicker: !_this.state.openPicker
      });
    });

    _this.state = {
      openPicker: false
    };
    return _this;
  }

  _createClass(ColorPicker, [{
    key: "render",
    value: function render() {
      var _this2 = this;

      var triggerStyle = {
        backgroundColor: this.props.color
      };
      var popover = {
        position: 'absolute',
        zIndex: '2'
      };
      var cover = {
        position: 'fixed',
        top: '0px',
        right: '0px',
        bottom: '0px',
        left: '0px'
      };
      return _react.default.createElement("div", null, _react.default.createElement("div", {
        className: "colorTrigger",
        style: triggerStyle,
        onClick: this.onTrigger
      }), this.state.openPicker ? _react.default.createElement("div", {
        style: popover
      }, _react.default.createElement("div", {
        style: cover,
        onClick: this.onTrigger
      }), _react.default.createElement(_reactColor.SketchPicker, {
        color: this.props.color,
        onChangeComplete: function onChangeComplete(color) {
          return _this2.props.onValueChange(_this2.props.field, color.hex);
        }
      })) : null);
    }
  }]);

  return ColorPicker;
}(_react.default.Component);

ColorPicker.propTypes = {
  color: _propTypes.default.string,
  field: _propTypes.default.string,
  onValueChange: _propTypes.default.func
};
ColorPicker.defaultProps = {
  color: 'black',
  field: 'color',
  onValueChange: function onValueChange() {}
};
var _default = ColorPicker;
exports.default = _default;

//# sourceMappingURL=index.js.map