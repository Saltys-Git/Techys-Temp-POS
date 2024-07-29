export function WebSocketPrinter(options) {
  const defaults = {
    url: "ws://localhost:8080/printer",
    onConnect: function () {},
    onDisconnect: function () {},
    onUpdate: function () {},
  };

  const settings = Object.assign({}, defaults, options);
  let websocket;
  let connected = false;

  const onMessage = function (evt) {
    settings.onUpdate(evt.data);
  };

  const onConnect = function () {
    connected = true;
    settings.onConnect();
  };

  const onDisconnect = function () {
    connected = false;
    settings.onDisconnect();
    reconnect();
  };

  const connect = function () {
    websocket = new WebSocket(settings.url);
    websocket.onopen = onConnect;
    websocket.onclose = onDisconnect;
    websocket.onmessage = onMessage;
  };

  const reconnect = function () {
    connect();
  };

  this.submit = function (data) {
    if (Array.isArray(data)) {
      data.forEach(function (element) {
        websocket.send(JSON.stringify(element));
      });
    } else {
      websocket.send(JSON.stringify(data));
    }
  };

  this.isConnected = function () {
    return connected;
  };

  connect();
}
