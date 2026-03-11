import { Middleware } from '@koa/router';
import dotenv from 'dotenv';

import { ResponseModel } from '../../utils/responseModel';
import { signJwt } from '../../middleware/jwt';

dotenv.config();

const checkAuth: Middleware = async (ctx) => {
  const resModel = new ResponseModel();
  ctx.body = resModel.getResult();

  const { apiKey } = ctx.request.body as {
    apiKey: string;
  };

  if (!apiKey) {
    resModel.setError(
      ResponseModel.CODE.CHECK_PARAMS_ERROR,
      'apiKey is required'
    );
    return;
  }

  if (process.env.PASS_API_KEY !== apiKey) {
    resModel.setError(ResponseModel.CODE.VALIDATE_ERROR, 'apiKey is invalid');
    return;
  }

  const jwtToken = signJwt({ valid: true });

  ctx.set('x-user', jwtToken);
  ctx.set('Access-Control-Expose-Headers', 'x-user');
};

export default checkAuth;
