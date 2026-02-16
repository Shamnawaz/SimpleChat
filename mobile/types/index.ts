export interface IMessageSender {
  _id: string;
  name: string;
  email: string;
  avatar: string;
}

export interface IMessage {
  _id: string;
  chat: string;
  sender: IMessageSender | string;
  text: string;
  createdAt: string;
  updatedAt: string;
}

export interface IChatLastMessage {
  _id: string;
  text: string;
  sender: string;
  createdAt: string;
}

export interface IChat {
  _id: string;
  participant: IMessageSender;
  lastMessage: IChatLastMessage | null;
  lastMessageAt: string;
  createdAt: string;
}