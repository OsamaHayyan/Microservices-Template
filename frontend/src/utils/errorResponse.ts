import IError from '@/interfaces/IError';

const errorResponse = (error: IError) => {
  throw error;
};

export default errorResponse;