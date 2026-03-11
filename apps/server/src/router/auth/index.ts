import Router from '@koa/router';

import checkAuth from './check';

const authRouter = new Router();

authRouter.post('/check', checkAuth);

export default authRouter;
