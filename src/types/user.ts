export interface IUser {
  id: number;
  email: string;
  name: string | null;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IRegisterForm {
  email: string;
  name: string;
  password: string;
  confirmPassword: string;
}
