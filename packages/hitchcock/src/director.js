import React from "react";
import styled from "@emotion/styled";
import { cachePublisher as cache, WAITING, RUNNING, PAUSED, DONE } from "./spy";
import { createSubscription } from "create-subscription/cjs/create-subscription.production.min.js";
import Draggable from "react-draggable";
import ReactDOM from "react-dom";

const Subscription = createSubscription({
  getCurrentValue(source) {
    return source.getCurrentValue();
  },
  subscribe(source, callback) {
    const onChange = () => callback(source.getCurrentValue());
    source.subscribe(onChange);
    return function unsubscribe() {
      source.unsubscribe(onChange);
    };
  }
});

const clickable = {
  // cursor: "pointer",
  transition: "transform 70ms",
  ":hover": {
    transform: "scale(1.005)"
  },
  ":active": {
    transform: "scale(0.99)"
  }
};

const Row = styled.li({
  margin: "8px 8px",
  ...clickable,
  fontSize: "15px",
  fontFamily: `"Courier New", Monaco, sans-serif`,
  "& *:first-of-type": {
    height: 18,
    paddingBottom: 2,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    overflow: "hidden",
    whiteSpace: "nowrap"
  }
});

const ProgressBar = styled.div(({ completion }) => ({
  borderBottom: "solid 1px #222",
  width: `${completion}%`
}));

const buttons = {
  [WAITING]: <span />,
  [RUNNING]: <span>&#10074;&#10074;</span>,
  [PAUSED]: <span>&#9658;</span>,
  [DONE]: <span>&#10006;</span>
};

const Record = ({ record }) => (
  <Subscription source={record}>
    {({ status, completion }) => (
      <Row
        onClick={() => {
          switch (status) {
            case WAITING:
              return null;
            case RUNNING:
              return record.pause();
            case PAUSED:
              return record.start();
            case DONE:
              return record.clear();
          }
        }}
      >
        <div>
          <span title={record.key}>{record.key}</span>
          {buttons[status]}
        </div>
        <ProgressBar completion={completion} />
      </Row>
    )}
  </Subscription>
);

const List = styled.ul(({ scrollable }) => ({
  padding: 0,
  margin: 0,
  listStyleType: "none"
  // overflowY: "auto",
  // height: `${scrollable ? 94 : "auto"}`
}));

const EmptyList = styled.div({
  fontSize: "15px",
  margin: "8px 8px",
  fontFamily: `"Courier New", Monaco, sans-serif`
});

const RecordList = ({ records, scrollable }) =>
  !records.length ? (
    <EmptyList>(empty)</EmptyList>
  ) : (
    <List scrollable={scrollable}>
      {records.map(record => (
        <Record key={record.key} record={record} />
      ))}
    </List>
  );

const DirectorPanel = styled.div({
  position: "fixed",
  top: 10,
  right: 10,
  width: 250,
  zIndex: 99999,
  userSelect: "none",
  background: "rgba(230, 230, 230, 0.6)",
  color: "#222",
  fontFamily: `Helvetica Neue, Helvetica, Arial, "Lucida Grande", sans-serif`
});

const Header = styled.div({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-end",
  height: 20,
  lineHeight: "20px",
  verticalAlign: "bottom",
  margin: "20px 8px 8px 8px",
  "& *:first-of-type": {
    fontSize: "18px",
    fontWeight: "500"
  },
  "& *:last-child": {
    textTransform: "uppercase",
    fontSize: "12px",
    ...clickable
  }
});

const Slider = styled.div({
  margin: "8px 8px 0px 8px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center"
});

const Director = ({ cache }) => (
  <Subscription source={cache}>
    {({ pendingRecords, settledRecords, delay, startPaused }) => (
      <Draggable>
        <DirectorPanel>
          <Slider onChange={e => cache.setDelay(e.target.value)}>
            Delay:
            {[0, 1, 2, 4].map(d => (
              <label key={d}>
                <input
                  type="radio"
                  name="delay"
                  value={d}
                  defaultChecked={delay === d}
                />
                {d}s
              </label>
            ))}
          </Slider>
          <Header>
            <span>Pending</span>
            <label>
              Start paused
              <input
                type="checkbox"
                checked={startPaused}
                onChange={() => cache.toggleStartPaused()}
              />
            </label>
          </Header>
          <RecordList records={pendingRecords} />
          <Header>
            <span>Cached</span>
            <span onClick={() => cache.clearAll()}>Clear all</span>
          </Header>
          <RecordList records={settledRecords} scrollable />
        </DirectorPanel>
      </Draggable>
    )}
  </Subscription>
);

function showDirector() {
  const directorId = "hitchcock-director";
  if (!document.getElementById(directorId)) {
    const $director = document.createElement("div");
    $director.id = directorId;
    document.body.appendChild($director);
    ReactDOM.render(<Director cache={cache} />, $director);
  }
}

export default class extends React.PureComponent {
  constructor(props) {
    super(props);
    showDirector();
  }
  render() {
    return this.props.children;
  }
}
