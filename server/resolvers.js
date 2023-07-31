import { GraphQLError } from 'graphql';
import { PubSub } from 'graphql-subscriptions';
import { createMessage, getMessages } from './db/messages.js';

import { RedisPubSub } from 'graphql-redis-subscriptions';

import Redis from 'ioredis';

const redis = new Redis(); // Connect to the local Redis server
// const pubSub = new PubSub();

const pubSub = new RedisPubSub({
  publisher: redis,
  subscriber: redis,
});
// const channelsToSubscribe = ['first', 'second', 'third','MESSAGE_ADDED'];

// channelsToSubscribe.forEach((channel) => {
//   redis.subscribe(channel, (err, count) => {
//     if (err) {
//       console.error(`Error subscribing to Redis channel "${channel}":`, err);
//     } else {
//       console.log(`Subscribed to "${channel}" channel.`);
//     }
//   });
// });

// redis.subscribe(channelsToSubscribe, (err, count) => {
//   if (err) {
//     console.error('Error subscribing to Redis channels:', err);
//   } else {
//     console.log(`Subscribed to ${count} channel(s).`);
//   }
// });



// redis.on('message', (channel, message) => {
  
//     console.log('Message received from Redis pub/sub:', message, channel);
//     pubSub.publish("MESSAGE_ADDED", { messageAdded: {
      
//         id: 'JIxevKOe0wNf',
//         user: 'alice',
//         text: `ab new channel${channel}`,
//         createdAt: '2023-07-30T11:31:07.183Z'
      



//     } });
  
// });

// (async () => {

//   // Listener for Redis pub/sub messages
// redis.subscribe("first", (err, count) => {
//   if (err) {
//     console.error('Error subscribing to Redis channel:', err);
//   } else {
//     console.log(`Subscribed to ${count} channel(s).`);
//   }
// });

// })();


export const resolvers = {
  Query: {
    messages: (_root, _args, { user }) => {
      if (!user) throw unauthorizedError();
      return getMessages();
    },
  },

  Mutation: {
    addMessage: async (_root, { text }, { user }) => {
      if (!user) throw unauthorizedError();
      const message = await createMessage(user, text);
      pubSub.publish('MESSAGE_ADDED', { messageAdded: message });
      console.log("publishing in messaged added 1 ", message);
      pubSub.publish('MESSAGE_ADDED1', { messageAdded: "message" });

      return message;
    },
    
  },

  Subscription: {


    messageAdded: {
      subscribe: (_, { channels }) => {
        const topicNames = channels.map((channel) => `messageAdded:${channel}`);
        console.log("topic names ", topicNames);
        return pubSub.asyncIterator('first');
      },
    },
    // messageAdded: {
    //   subscribe: (_root, _args, { user }) => {
    //     console.log("coming in message added..", user);
    //     if (!user) throw unauthorizedError();
    //     return pubSub.asyncIterator('MESSAGE_ADDED');
    //   },
    // },

    // messageAdded1: {
    //   subscribe: (_root, _args, { user }) => {
    //     console.log("coming in message added 1..", user);
    //     if (!user) throw unauthorizedError();
    //     return pubSub.asyncIterator('MESSAGE_ADDED1');
    //   },
    // },

    // messageAdded2: {

    //   subscribe: (_, { channels }) => {
    //     // Return the async iterator with the withFilter function
    //     console.log("before");
    //     return pubSub.asyncIterator('messageAdded2').withFilter(
    //       (payload, variables) => {
    //         console.log("variables", variables);
    //         return variables.channels.includes(payload.channel);
    //       }
    //     );
    //   },
      // subscribe: (_, { channels }) => {
      //   console.log("coming");

      //   return withFilter(
      //     () => pubsub.asyncIterator(channels),
      //     (payload, variables) => {
      //       return variables.channels.includes(payload.channel);
      //     }
      //   )();
      // },

      // subscribe: (_, { channels }) => {
      //   console.log("channes name", channels);
      //   pubSub.subscribe(channels);
      //   return pubSub.asyncIterator(channels);
      // },

      // subscribe: (_, { channels }, { pubsub }) => {
      //   // The `channels` argument contains the list of channels requested by the client
      //   // You can perform any validation or authentication here if needed

      //   // Create a unique identifier for the subscription, so each client receives their own updates
      //   const subscriptionId = // Generate a unique identifier for the client subscription
      //   console.log("coming in subscribe", channels);
      //   // Subscribe to the requested channels using Redis pub/sub

      //  pubsub.subscribe('first', (err, count) => {
      //     console.log("Callback executed for channel:", 'first'); // Add this line
      //     // ... rest of the code ...
      //   });
      //   channels.forEach((channel) => {
      //     console.log('inside for each');
      //     pubsub.subscribe(channel, (err, count) => {
      //       console.log("inside");
      //       if (err) {
      //         console.error(`Error subscribing to Redis channel "${channel}":`, err);
      //       } else {
      //         console.log(`Client ${subscriptionId} subscribed to "${channel}" channel.`);
      //       }
      //     });
      //   });

      //   // Return an async iterator for the client to receive updates
      //   return pubsub.asyncIterator(channels);
      // },
    // },

  },
};

function unauthorizedError() {
  return new GraphQLError('Not authenticated', {
    extensions: { code: 'UNAUTHORIZED' },
  });
}
