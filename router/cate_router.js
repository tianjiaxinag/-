// 文章分类接口
const express = require('express')

const router = express.Router()
// 引入数据库模板
const conn = require('../util/mysql-apq.js')

// 获取文章分类
router.get('/article/cates',(req,res)=>{
    // console.log(1);
    const sqlStr = `select * from categories`
    conn.query(sqlStr,(err,result)=>{
        if(err){
            res.json({
                "status": 1, 
                "message": "获取文章分类列表失败！", 
            })
            return
        }
        res.json({
            "status": 0, 
            "message": "获取文章分类列表成功！", 
            "data":result
        })
    })
    // res.json('ok')
});

//根据id 更新文章分类
router.post('/article/updatecate',(req,res)=>{
    // 获取参数
    const {name,slug,id}=req.body
    // 拼接sql
    const sqlStr = `update categories set name="${name}",slug="${slug}" where id=${id}`
    // 执行sql
    conn.query(sqlStr,(err,result)=>{
        if(err){
            res.json({status:1,message:"服务器错误"});
            return
        }
        if(result.changedRows==0){
            res.json({status:1,message:"修改失败"});
            return
        }
        res.json({status:0,message:"修改成功"});
    })
});

// 新增文章分类
router.post('/article/addcates',(req,res)=>{
    const {name ,slug} = req.body
    // 拼接sql
    const sqlStr = `insert into categories(name,slug) values("${name}","${slug}")`
    // 执行sql
    conn.query(sqlStr,(err,result)=>{
        if(err){
            res.json({status:1,message:"添加失败"});
            return
        }
        res.json({status:0,message:"添加成功"});
    })
})

// 根据id删除文章分类
router.post('/article/deletecate',(req,res)=>{
    const {id} = req.body
    const sqlStr = `delete from categories where id=${id}`
    conn.query(sqlStr,(err,result)=>{
        if(err){
            console.log(err);
            res.json({status:1,message:"删除失败"});
            return
        }
        res.json({status:0,message:"删除成功"});
    })
});

// 根据id获取文章分类
router.get('/article/getCatesById',(req,res)=>{
    const {id} = req.query
    // 拼接sql
    const sqlStr = `select name,slug from categories where id=${id}`
    // 执行sql
    conn.query(sqlStr,(err,result)=>{
        if(err){
            console.log(err);
            res.json({status:1,message:"获取失败"});
            return
        }
        res.json({status:0,message:"获取成功",data:result});
    })

})








// 导出
module.exports = router