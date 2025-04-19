import * as z from "zod";
import {loginSchema} from "@/utils/validations/auth.ts";

export type LoginReq = z.infer<typeof loginSchema>;
export type LoginRes = {
    accessToken: string;
    user: {
        id: string;
        email: string;
        name: string;
    };
}