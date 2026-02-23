import { z } from "zod";
import { PRODUCE_VALUES } from "../constants/enums/produce.enum";

const phoneRegex = /^(0|\+84)[0-9]{9}$/;
const usernameRegex = /^[\p{L}\p{N}._]{2,30}$/u;

export const signupSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(2, "Họ và tên phải có ít nhất 2 ký tự")
      .max(50, "Họ và tên không được quá 50 ký tự"),

    username: z.string().trim().email("Email không hợp lệ"),

    phoneNumber: z
      .string()
      .trim()
      .regex(phoneRegex, "Số điện thoại không hợp lệ"),

    password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
    confirmPassword: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
    produce: z.enum(PRODUCE_VALUES).optional().refine(Boolean, {
      message: "Vui lòng chọn loại hình sản xuất",
    }),
    agree: z.boolean().refine((val) => val === true, {
      message: "Bạn phải đồng ý với Điều khoản dịch vụ",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Mật khẩu xác nhận không khớp",
  });

export type SignupSchema = z.infer<typeof signupSchema>;

export const loginSchema = z.object({
  username: z
    .string()
    .trim()
    .email("Vui lòng nhập tên đăng nhập bằng email đã đăng ký"),

  password: z.string().trim().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});

export type LoginSchema = z.infer<typeof loginSchema>;
