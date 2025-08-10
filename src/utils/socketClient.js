import PusherJS from "pusher-js";

const socketClient = new PusherJS("app1", {
  wsHost: import.meta.env.VITE_WSHOST,
  wsPort: import.meta.env.VITE_WSPORT,
  cluster: import.meta.env.VITE_CLUSTER,
  forceTLS: import.meta.env.VITE_FORCE_TLS,
  encrypted: import.meta.env.VITE_ENCRYPTED,
  disableStats: import.meta.env.VITE_DISABLE_STATS,
  enabledTransports: import.meta.env.VITE_ENABLED_TRANSPORTS.split(","),
});

export default socketClient;
