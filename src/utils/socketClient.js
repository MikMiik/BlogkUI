import PusherJS from "pusher-js";

const socketClient = new PusherJS("app1", {
  wsHost: "api.blogk.online",
  wsPort: 6001,
  cluster: "ap1",
  forceTLS: false,
  encrypted: true,
  disableStats: true,
  enabledTransports: ["ws", "wss"],
});

export default socketClient;
