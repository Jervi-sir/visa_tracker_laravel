import axios from 'axios';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

export const useLaravelEcho = () => {
  const laravelEcho = new Echo({
    broadcaster: 'reverb',
    host: import.meta.env.VITE_REVERB_HOST,//'localhost',
    client: new Pusher(import.meta.env.VITE_REVERB_APP_KEY, {
      cluster: 'mt1', // not used but required...
      wsHost: import.meta.env.VITE_REVERB_HOST, //'localhost',
      wsPort: import.meta.env.VITE_REVERB_PORT ?? 80,
      wssPort: 443,
      forceTLS: false,
      enabledTransports: ["ws", "wss"],
      authorizer: (channel, options) => {
        return {
            authorize: (socketId, callback: any) => {
                axios.post('/broadcasting/auth', {
                    socket_id: socketId,
                    channel_name: channel.name
                })
                .then(response => {
                    callback(false, response.data);
                })
                .catch(error => {
                    callback(true, error.response);
                });
            }
        };
    },
  }),


  });

  return laravelEcho;
}