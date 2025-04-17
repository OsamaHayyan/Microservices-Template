import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';

@Schema()
export class User {
    @Prop({required: true, unique: true})
    email: string;

    @Prop({required: true})
    name: string;

    @Prop({required: true})
    password: string;

    comparePassword: (password: string) => Promise<boolean>;
}

export const UserSchema = SchemaFactory.createForClass(User);