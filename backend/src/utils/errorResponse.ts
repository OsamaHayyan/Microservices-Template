import {HttpException, HttpStatus} from "@nestjs/common";

export const errorResponse = (err: unknown) => {
    if (err instanceof HttpException) {
        throw err;
    }
    throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
    );
}