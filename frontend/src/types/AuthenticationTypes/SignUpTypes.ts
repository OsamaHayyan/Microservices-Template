import * as z from "zod";
import {signUpSchema} from "@/utils/validations/auth.ts";

export type SignUpReq = z.infer<typeof signUpSchema>;
export type SignUpRes = string;