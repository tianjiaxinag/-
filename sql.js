// 三句话写一个服务器
const express = require('express')


const server = express();

// 跨域
const cors = require('cors');
server.use(cors());

// 验证token
const jwt = require('express-jwt');
app.use(jwt().unless());
// jwt() 用于解析token，并将 token 中保存的数据 赋值给 req.user
// unless() 约定某个接口不需要身份认证
server.use(jwt({
  secret: 'gz61', // 生成token时的 钥匙，必须统一
  algorithms: ['HS256'] // 必填，加密算法，无需了解
}).unless({
  path: ['/api/login','/api/register', /^\/uploads\/.*/] // 除了这两个接口，其他都需要认证
})
)
// 路由中间件
const userRouter = require('./router/user-router.js');
const accountRouter =require('./router/accout_router.js');
const cateRouter = require('./router/cate_router.js');

server.use('/api',userRouter);
server.use('/my',accountRouter);
server.use('/my',cateRouter);





server.listen(3030,()=>{console.log('端口跑起来了')})