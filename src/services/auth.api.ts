import { AUTH_API } from "../constants/api";
import { LoginDto, SignupDto } from "../type/auth.type";
import apiClient from "./apiClient";
import { saveSession } from "./storage";

export async function signup(data: SignupDto): Promise<any> {
  const res = await apiClient.post(AUTH_API.SIGNUP, data);
  return res.data;
}

type LoginResponse = {
  accessToken: string;
  refreshToken?: string;
  tokenType: string;
  expiresIn: number;
};

export async function login(data: LoginDto): Promise<LoginResponse> {
  const res = await apiClient.post<LoginResponse>(AUTH_API.LOGIN, data);
  const { accessToken, refreshToken, expiresIn } = res.data;

  await saveSession(accessToken, expiresIn);
  return res.data;
}
