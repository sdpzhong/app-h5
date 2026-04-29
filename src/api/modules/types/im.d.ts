declare interface OpenImLoginInfo {
  token: string;
  expireTimeSeconds: number;
  userId: string;
  customerUserId: string;
  websocketAddress: string;
  apiAddress: string;
}

declare interface OpenImChatRecordRequest {
  lastMinSeq: number;
  count: number;
  startClientMsgID: string;
  conversationID: string;
}
