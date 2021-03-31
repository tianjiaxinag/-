// 用户获取信息模块
const express = require("express");
const router = express.Router();

// 引入数据库模板
const conn = require("../util/mysql-apq.js");
// post 复合文件参数保存到req.body中
router.use(express.urlencoded());

// 头像上传   引入multer包
const multer = require("multer");
// 精细化去设置，如何去保存文件
const storage = multer.diskStorage({
  // 保存在哪里
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  // 保存时，文件名叫什么
  filename: function (req, file, cb) {
    // console.log('file', file)
    // 目标： 新名字是时间戳+后缀名
    const filenameArr = file.originalname.split(".");
    // filenameArr.length-1是找到最后一个元素的下标
    const fileName = Date.now() + "." + filenameArr[filenameArr.length - 1];
    cb(null, fileName); //
  },
});
// cosnt upload = multer({ storage })
const upload = multer({ storage });

// 获取用户基本信息接口
router.get("/userinfo", (req, res) => {
  const { username } = req.query;
  // 拼接sql
  const sqlStr = `select * from users where username="${username}" `;
  //    执行sql
  conn.query(sqlStr, (err, result) => {
    if (err) {
      res.json({ message: "获取失败", status: 1 });
      return;
    }
    // console.log(result);
    res.json({ message: "获取成功", status: 0, data: result[0] });
  });
});
// 更新用户基本信息
router.post("/userinfo", (req, res) => {
  // 1,获取参数
  // console.log(req.body);
  const { id, nickname, email, userPic } = req.body;
  let sqlStrSelect = [];
  if (nickname) {
    sqlStrSelect.push(`nickname="${nickname}"`);
  }
  if (email) {
    sqlStrSelect.push(`email="${email}"`);
  }
  if (userPic) {
    sqlStrSelect.push(`userPic="${userPic}"`);
  }
  const sqlStr1 = sqlStrSelect.join();
  // 拼接 sql
  // const sqlStr = `update users set nickname="${nickname}",email=${email},userPic="${userPic}" where id=${id}`
  const sqlStr = `update users set ${sqlStr1} where id=${id}`;
  // 使用 sql
  conn.query(sqlStr, (err, result) => {
    if (err) {
      console.log(err);
      res.json({ message: "修改失败", status: 1 });
      return;
    }
    res.json({ message: "修改成功", status: 0 });
  });
});
// 上传头像
router.post("/uploadFile", upload.single("file_data"), (req, res) => {
  // 如果文件上传成功
  console.log("本次上传的文件是", req.file);

  if (req.file === "") {
    res.json({
      status: 201,
      message: "上传的文件不能为空",
    });
  }
  res.json({
    status: 200,
    message: "http://127.0.0.1:3000/uploads/" + req.file.filename,
  });
});
// 修改密码
router.post("/updatepwd", (req, res) => {
  console.log(req.body);
  const { oldPwd, newPwd, id } = req.body;
  // 先查询到原本的密码,跟现在的密码做比较    判断原密码不能和旧密码重复
  // 拼接查询sql
  const sql = `select password from users where id=${id}`;
  conn.query(sql, (err, result) => {
    if (err) {
      res.json({ message: "服务器出错", status: 500 });
      return;
    }
    console.log(result[0].password);
    if (oldPwd != result[0].password) {
      res.json({ message: "原密码输入错误", status: 1 });
      return;
    } else if (newPwd === result[0].password) {
      res.json({ message: "旧密码不能和新密码相同", status: 1 });
      return;
    }
    const sqlStr = `update users set password="${newPwd}" where id=${id}`;
    conn.query(sqlStr, (err, result) => {
      if (err) {
        res.json({ message: "修改失败", status: 1 });
        return;
      }
      res.json({ message: "修改成功", status: 0 });
      console.log(result);
    });
  });
//   res.json("ok");
});
// 导出
module.exports = router;
