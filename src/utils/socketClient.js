import PusherJS from "pusher-js";

const socketClient = new PusherJS("app1", {
  wsHost: "103.20.96.168",
  wsPort: 6001,
  cluster: "ap1",
  forceTLS: false,
  encrypted: true,
  disableStats: true,
  enabledTransports: ["ws", "wss"],
});

// client.subscribe("chat-room").bind("message", (message) => {
//   alert(`${message.sender} says: ${message.content}`);
// });

export default socketClient;
