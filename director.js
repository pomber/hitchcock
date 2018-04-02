"use strict";

exports.__esModule = true;
exports.Director = undefined;

var _buttons;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.showDirector = showDirector;

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactDom = require("react-dom");

var _reactDom2 = _interopRequireDefault(_reactDom);

var _glamorous = require("glamorous");

var _glamorous2 = _interopRequireDefault(_glamorous);

var _spy = require("./spy");

var _createSubscription = require("create-subscription");

var _createSubscription2 = _interopRequireDefault(_createSubscription);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Subscription = _createSubscription2.default.createSubscription({
  getCurrentValue: function getCurrentValue(source) {
    return source.getCurrentValue();
  },
  subscribe: function subscribe(source, callback) {
    var onChange = function onChange() {
      return callback(source.getCurrentValue());
    };
    source.subscribe(onChange);
    return function unsubscribe() {
      source.unsubscribe(onChange);
    };
  }
});

var clickable = {
  // cursor: "pointer",
  transition: "transform 70ms",
  ":hover": {
    transform: "scale(1.005)"
  },
  ":active": {
    transform: "scale(0.99)"
  }
};

var Row = _glamorous2.default.li(_extends({
  margin: "8px 8px"
}, clickable, {
  fontSize: "15px",
  fontFamily: "\"Courier New\", Monaco, sans-serif",
  "& *:first-child": {
    height: 18,
    paddingBottom: 2,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    overflow: "hidden",
    whiteSpace: "nowrap"
  }
}));

var ProgressBar = _glamorous2.default.div(function (_ref) {
  var completion = _ref.completion;
  return {
    borderBottom: "solid 1px #aaa",
    width: completion + "%"
  };
});

var buttons = (_buttons = {}, _buttons[_spy.WAITING] = _react2.default.createElement("span", null), _buttons[_spy.RUNNING] = _react2.default.createElement(
  "span",
  null,
  "\u275A\u275A"
), _buttons[_spy.PAUSED] = _react2.default.createElement(
  "span",
  null,
  "\u25BA"
), _buttons[_spy.DONE] = _react2.default.createElement(
  "span",
  null,
  "\u2716"
), _buttons);

var Record = function Record(_ref2) {
  var record = _ref2.record;
  return _react2.default.createElement(
    Subscription,
    { source: record },
    function (_ref3) {
      var status = _ref3.status,
          completion = _ref3.completion;
      return _react2.default.createElement(
        Row,
        {
          onClick: function onClick() {
            switch (status) {
              case _spy.WAITING:
                return null;
              case _spy.RUNNING:
                return record.pause();
              case _spy.PAUSED:
                return record.start();
              case _spy.DONE:
                return record.clear();
            }
          }
        },
        _react2.default.createElement(
          "div",
          null,
          _react2.default.createElement(
            "span",
            null,
            record.key
          ),
          buttons[status]
        ),
        _react2.default.createElement(ProgressBar, { completion: completion })
      );
    }
  );
};

var List = _glamorous2.default.ul(function (_ref4) {
  var scrollable = _ref4.scrollable;
  return {
    padding: 0,
    margin: 0,
    listStyleType: "none"
    // overflowY: "auto",
    // height: `${scrollable ? 94 : "auto"}`
  };
});

var EmptyList = _glamorous2.default.div({
  fontSize: "15px",
  margin: "8px 8px",
  fontFamily: "\"Courier New\", Monaco, sans-serif"
});

var RecordList = function RecordList(_ref5) {
  var records = _ref5.records,
      scrollable = _ref5.scrollable;
  return !records.length ? _react2.default.createElement(
    EmptyList,
    null,
    "(empty)"
  ) : _react2.default.createElement(
    List,
    { scrollable: scrollable },
    records.map(function (record) {
      return _react2.default.createElement(Record, { key: record.key, record: record });
    })
  );
};

var DirectorPanel = _glamorous2.default.div({
  position: "fixed",
  top: 10,
  right: 10,
  width: 250,
  userSelect: "none",
  background: "rgba(100, 100, 100, 0.1)",
  fontFamily: "Helvetica Neue, Helvetica, Arial, \"Lucida Grande\", sans-serif"
});

var Header = _glamorous2.default.div({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-end",
  height: 20,
  lineHeight: "20px",
  verticalAlign: "bottom",
  margin: "20px 8px 8px 8px",
  "& *:first-child": {
    fontSize: "18px",
    fontWeight: "500"
  },
  "& *:last-child": _extends({
    textTransform: "uppercase",
    fontSize: "12px"
  }, clickable)
});

var Slider = _glamorous2.default.div({
  margin: "8px 8px 0px 8px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center"
});

var Director = exports.Director = function Director(_ref6) {
  var cache = _ref6.cache;
  return _react2.default.createElement(
    Subscription,
    { source: cache },
    function (_ref7) {
      var pendingRecords = _ref7.pendingRecords,
          settledRecords = _ref7.settledRecords,
          delay = _ref7.delay,
          startPaused = _ref7.startPaused;
      return _react2.default.createElement(
        DirectorPanel,
        null,
        _react2.default.createElement(
          Slider,
          { onChange: function onChange(e) {
              return cache.setDelay(e.target.value);
            } },
          "Delay:",
          [0, 1, 2, 4].map(function (d) {
            return _react2.default.createElement(
              "label",
              { key: d },
              _react2.default.createElement("input", {
                type: "radio",
                name: "delay",
                value: d,
                defaultChecked: delay === d
              }),
              d,
              "s"
            );
          })
        ),
        _react2.default.createElement(
          Header,
          null,
          _react2.default.createElement(
            "span",
            null,
            "Pending"
          ),
          _react2.default.createElement(
            "label",
            null,
            "Start paused",
            _react2.default.createElement("input", {
              type: "checkbox",
              checked: startPaused,
              onChange: function onChange() {
                return cache.toggleStartPaused();
              }
            })
          )
        ),
        _react2.default.createElement(RecordList, { records: pendingRecords }),
        _react2.default.createElement(
          Header,
          null,
          _react2.default.createElement(
            "span",
            null,
            "Cached"
          ),
          _react2.default.createElement(
            "span",
            { onClick: function onClick() {
                return cache.clearAll();
              } },
            "Clear all"
          )
        ),
        _react2.default.createElement(RecordList, { records: settledRecords, scrollable: true })
      );
    }
  );
};

function showDirector() {
  var $director = document.createElement("div");
  document.body.appendChild($director);
  _reactDom2.default.render(_react2.default.createElement(Director, { cache: _spy.cachePublisher }), $director);
}