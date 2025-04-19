import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import * as bcrypt from 'bcryptjs';
import { Types } from 'mongoose';

@Schema()
export class User {
    _id: Types.ObjectId;

    @Prop({required: true, unique: true})
    email: string;

    @Prop({required: true})
    name: string;

    @Prop({required: true})
    password: string;

    @Prop({type: String, default: null})
    refreshToken: string;

    comparePassword: (password: string) => Promise<boolean>;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

UserSchema.methods.comparePassword = async function (password: string) {
    return await bcrypt.compare(password, this.password);
};