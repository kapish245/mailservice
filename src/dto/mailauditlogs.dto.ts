export interface Mailauditlogs {
  id: number;
  sent: number;
  recieved: number;
  open: number;
  email: string;
  userId: number;
  serviceId: string;
}
