import { z } from "zod";
import { PRODUCE_VALUES } from "../constants/enums/produce.enum";

const phoneRegex = /^(0|\+84)[0-9]{9}$/;
const usernameRegex = /^[a-zA-Z0-9À-ỹ\s]{2,30}$/;
const emailRegex =
  /^[a-zA-Z0-9][a-zA-Z0-9._%+-]*[a-zA-Z0-9]@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)[^\s]{6,}$/;

export const signupSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .regex(
        usernameRegex,
        "Tên người dùng chỉ được chứa chữ cái, số và khoảng trắng, từ 2-30 ký tự",
      ),

    username: z.string().trim().regex(emailRegex, "Email không hợp lệ"),

    phoneNumber: z
      .string()
      .trim()
      .regex(phoneRegex, "Số điện thoại không hợp lệ"),

    password: z
      .string()
      .regex(
        passwordRegex,
        "Mật khẩu phải có ít nhất 6 ký tự, bao gồm chữ cái và số, không chứa khoảng trắng",
      ),
    confirmPassword: z
      .string()
      .regex(
        passwordRegex,
        "Mật khẩu phải có ít nhất 6 ký tự, bao gồm chữ cái và số, không chứa khoảng trắng",
      ),
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
  username: z.string().trim().regex(emailRegex, "Email không hợp lệ"),

  password: z.string().trim().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});

export type LoginSchema = z.infer<typeof loginSchema>;
