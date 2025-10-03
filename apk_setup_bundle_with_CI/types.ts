
export enum Gender {
  Male = 'Male',
  Female = 'Female',
}

export interface User {
  id: string;
  name: string;
  age: number;
  gender: Gender;
  occupation: string;
  photo: string; // URL or base64 string
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: number;
}

export interface Match {
  id: string;
  users: [User, User];
  messages: Message[];
}
