import { ProduceType } from "../constants/enums/produce.enum";

export interface LoginDto {
  username: string;
  password: string;
}
export interface SignupDto {
  fullName: string;
  username: string;
  phoneNumber: string;
  password: string;
  produce: ProduceType;
}
