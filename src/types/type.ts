export interface UserProfile {
  username: string;
  realname: string;
  email: string;
  phoneNumber: string;
}

export interface Cheque {
  id: string;
  amount: number;
  payerUsername: string;
  payerRealname: string;
  payeeUsername: string;
  payeeRealname: string;
  status: string;
  expiryDate: string;
}