"use strict";

exports.__esModule = true;
exports.Loader = Loader;

var _spy = require("./spy");

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Suspense(_ref) {
  var source = _ref.source,
      params = _ref.params,
      children = _ref.children;

  var result = _spy.cachePublisher.load({
    key: source.getName(params),
    getValue: function getValue() {
      return source.getValue(params);
    }
  });
  return children(result);
}

function Loader(_ref2) {
  var children = _ref2.children,
      fallback = _ref2.fallback,
      wait = _ref2.wait,
      source = _ref2.source,
      params = _ref2.params;

  var cacheProps = { source: source, params: params, children: children };
  return _react2.default.createElement(
    _react2.default.Timeout,
    { ms: wait },
    function (didTimeout) {
      return didTimeout ? fallback : _react2.default.createElement(Suspense, cacheProps);
    }
  );
}