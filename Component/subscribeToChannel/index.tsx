import Pusher from 'pusher-js/react-native';

// Initialize Pusher only once
const pusher = new Pusher('f62be600d1058c22c4e5', {
  cluster: 'ap2',
  // encrypted: true, // Ensure encrypted is set to true for secure connections
});

const subscribeToChannel = ({channelName, eventName, callback}:any) => {
  const channel = pusher.subscribe(channelName);
  channel.bind(eventName, callback);
  
  return () => {
    channel.unbind_all();
    pusher.unsubscribe(channelName);
  };
};

export default subscribeToChannel;
