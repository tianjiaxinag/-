// 登录注册接口
const express = require("express");
// const multer = require('multer')
const router = express.Router();
// 引入生成token包
const jwt = require("jsonwebtoken");

// 引入数据库模板
const conn = require("../util/mysql-apq.js");
// post 复合文件参数保存到req.body中
router.use(express.urlencoded());

// 用户注册接口
router.post("/reguser", (req, res) => {
  console.log(req.body);
  // res.json('ok')
  // 1,获取参数
  const { username, password } = req.body;
  // 拼接一个查询sql
  const sqlStrSelect = `select * from users where username="${username}"`;
  // 先查询数据库里面是否有这个用户名
  conn.query(sqlStrSelect, (err, result) => {
    if (err) {
      res.json({ msg: "用户名重复请重新注册", code: 300 });
      return;
    }
    //   如果有的话 终止函数
    if (result.length > 0) {
      res.json({ message: "用户名重复请重新注册", status: 300 });
      return;
    }
    // 2,拼接sql
    const sqlStr = `insert into users(username,password) values("${username}","${password}")`;
    // 3,使用sql
    conn.query(sqlStr, (err, result) => {
      // 4,根据需求写代码
      if (err) {
        res.json({ message: "注册失败", status: 201 });
        return;
      }
      res.json({ message: "注册成功", status: 200 });
    });
  });
});

// 用户登录接口
router.post("/login", (req, res) => {
  // 获取数据
  const { username, password } = req.body;
  // 拼接sql
  const sqlStr = `select * from users where username="${username}" and password="${password}"`;
  // 执行sql
  conn.query(sqlStr, (err, result) => {
    console.log(err);
    if (err) {
      res.json({ msg: "服务器错误", code: 500 });
      return;
    }
    if (result.length <= 0) {
      res.json({ message: "用户名或者密码错误", status: 1 });
      return;
    } else {
      // 生成token
      let token = jwt.sign(
        { name: username },
        "gz61", // 加密的密码，要与express-jwt中的验证密码
        { expiresIn: 2 * 60 * 60 } // 过期时间，单位是秒
      );
      token = "Bearer " + token;
      res.json({ message: "登录成功", status: 0, token: token });
    }
  });
});

// 导出
module.exports = router;
