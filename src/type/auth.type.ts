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

export interface UserAddress {
  full: string;
  provinceName: string;
  wardName: string;
  provinceCode: string;
  wardCode: string;
}

export interface User {
  id: string;
  fullName: string;
  username: string;
  phoneNumber: string;
  role: string;
  avatarUrl: string;
  address: any;
  commune: string | null;
  province: string | null;
  produce: string;
}
export interface UserLocation {
  commune: string;
  province: string;
}
