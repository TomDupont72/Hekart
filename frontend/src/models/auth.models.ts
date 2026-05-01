export type AppSession = {
  user: {
    id: string;
    email: string;
    name: string;
  };
  createdAt: Date;
  expiresAt?: Date;
};
