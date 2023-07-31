import { useMutation, useQuery, useSubscription } from '@apollo/client';
import {MESSAGE_ADDED_SUBSCRIPTION, addMessageMutation, messageAddedSubscription,messageAddedSubscription1, messagesQuery ,testingSub} from './queries';

export function useAddMessage() {
  const [mutate] = useMutation(addMessageMutation);

  const addMessage = async (text) => {
    const { data: { message } } = await mutate({
      variables: { text },
    });
    return message;
  };

  return { addMessage };
}

export function useMessages() {
  const { data } = useQuery(messagesQuery);
  console.log("this is init method where we subscribe");

  // useSubscription(messageAddedSubscription1, {
  //   onData: ({ client, data }) => {
  //     const newMessage = data.data.message;
  //     console.log("new message in subscribption 1", newMessage);
  //     client.cache.updateQuery({ query: messagesQuery }, ({ messages }) => {
  //       return { messages: [...messages, newMessage] };
  //     });
  //   },
  // });
  // useSubscription(testingSub,{ 
  //   variables: { channels: ['first', 'second'] }
  //    }, {
  //     onSubscriptionData: ({ client, data }) => {
  //     const newMessage = data.data.message;
  //     console.log("new message chal gaya", newMessage);
  //     // client.cache.updateQuery({ query: messagesQuery }, ({ messages }) => {
  //     //   return { messages: [...messages, newMessage] };
  //     // });
  //   },
  // });

  const { data1 } = useSubscription(MESSAGE_ADDED_SUBSCRIPTION, {
    variables: { channels: ['first', 'second'] }, // Pass the list of channels here
  });
  console.log("subscription data");
  console.log(data1);
  // const { data } = useSubscription(testingSub, {
  //   variables: { channels: ['first', 'second'] }, // Pass the list of channels here
  // });
  return {
    messages: data?.messages ?? [],
  };
}


