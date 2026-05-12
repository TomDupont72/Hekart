export type AppSession = {
  user: {
    id: string;
    email: string;
    name: string;
    isAdmin: boolean;
  };
  createdAt: Date;
  expiresAt?: Date;
};
