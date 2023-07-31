import { gql } from '@apollo/client';

export const messagesQuery = gql`
  query MessagesQuery {
    messages {
      id
      user
      text
    }
  }
`;

export const addMessageMutation = gql`
  mutation AddMessageMutation($text: String!) {
    message: addMessage(text: $text) {
      id
      user
      text
    }
  }
`;

export const messageAddedSubscription = gql`
  subscription MessageAddedSubscription {
    message: messageAdded {
      id
      user
      text
    }
  }
`;

export const messageAddedSubscription1 = gql`
  subscription MessageAddedSubscription1 {
    message: messageAdded1 {
      id
      user
      text
    }
  }
`;

export const MESSAGE_ADDED_SUBSCRIPTION = gql`
  subscription MessageAddedSubscription($channels: [String!]!) {
    messageAdded(channels: $channels)
  }
`;
export const testingSub = gql`
  subscription($channels: [String!]!) {
    messageAdded2(channels: $channels)
  }
`;

// export const subscribeToChannel = (channelName) => {
//   const subscriptionQuery = gql`
//     subscription ($channel: String!) {
//       messageAdded(channel: $channel) {
//         id
//         text
//         createdAt
//       }
//     }
//   `;