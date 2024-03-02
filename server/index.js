const express = require('express');
const app = express();
const { Lose, Collection, User, Admin, Advice, Banner } = require('./db');
const multer = require('multer');
const { v4 } = require('uuid');
const axios = require('axios');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname));

app.all("*", (req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", '*');
    res.setHeader("Access-Control-Allow-Headers", '*');

    next();
})

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./file")
    },
    filename: (req, file, cb) => {
        let type = file.originalname.replace(/.+\./, ".");
        console.log(type);
        cb(null, `${v4()}${type}`)
    }
})

const upload = multer({ storage });

// 实现物品的发布功能
app.post("/publish", async (req, res) => {
    // 1. 获取前端传过来的数据, 
    // 2. 将数据存入Lose数据表里
    try {
        const { type, classify1, classify2, name, date, region, phone, desc, imgList, time, openid } = req.body;
        await Lose.create({
            type, classify1, classify2, name, date, region, phone, desc, imgList, time, openid
        });
        res.send("success");
    } catch (error) {
        console.log(error);
        res.send("error");
    }
})

// 上传图片
app.post("/uploadImg", upload.array("file", 6), (req, res) => {
    // let i;
    // for(i=0;i<req.files.length;i++){
    //     req.files[i].path=req.files[i].path.replace(/\\/,'/');
    // }
    res.send(req.files);
})

// 获取首页的数据
app.get("/getLose", async (req, res) => {
    const { type } = req.query;
    const result = await Lose.find({
        type,
    }).sort({ time: -1 });
    res.send(result);
})

// 收藏物品
app.post("/toCollection", async (req, res) => {
    try {
        const { id, openid } = req.body;
        await Collection.create({ 
            id, openid
        })
        res.send("success");
    } catch (error) {
        console.log(error);
        res.send("error");
    }

})

// 实现登录操作
app.get("/login", async (req, res) => {
    const { code } = req.query;
    try {

        const { data: { openid } } = await axios.get(`https://api.weixin.qq.com/sns/jscode2session?appid=wx7c35fbee23f4debd&secret=7dbf1f1a8d477578c62cb47ec9165397&js_code=${code}&grant_type=authorization_code`);
        console.log(openid);

        res.send(openid);
    } catch (error) {
        console.log(error);
        res.send("error");
    }
})

// 查询当前物品有没有被当前这个人收藏过
app.post("/checkCollection", async (req, res) => {
    const { id, openid } = req.body;
    const result = await Collection.find({
        id,
        openid
    });
    res.send(result);
})

// 取消收藏
app.post("/cancelCollection", async (req, res) => {
    try {
        const { id, openid } = req.body;
        await Collection.findOneAndRemove({
            id,
            openid
        });
        res.send("success");
    } catch (error) {
        console.log(error);
        res.send("error");
    }
})

// 获取收藏夹的数据
app.post("/getCollection", async (req, res) => {
    const { openid, type } = req.body;
    const result = await Collection.find({
        openid
    }).populate('id');
    const _result = result.filter(item => item.id ? item.id.type === type : false);
    res.send(_result);
})


// 获取我的发布的数据
app.get("/getMyPublish", async (req, res) => {
    const { openid, type } = req.query;
    const result = await Lose.find({
        openid,
        type
    });
    res.send(result);
})

// 通过二级分类查数据
app.post("/getClassifyTwo", async (req, res) => {
    const { type, classify2 } = req.body;
    const result = await Lose.find({
        type,
        classify2
    });
    res.send(result);
})

// 模糊查询物品名字
app.get("/searchLose", async (req, res) => {
    const { name, type } = req.query;
    const _name = new RegExp(name, 'i');
    let result = null;
    if (type) {
        result = await Lose.find({
            name: _name,
            type
        });
    } else {
        result = await Lose.find({
            name: _name,
        });
    }

    res.send(result);
})


// 注册
app.post('/register', async (req, res) => {
    const { openid, username, password, date } = req.body;
    const result = await User.findOne({
        username
    });

    if (result) {
        res.send("Registered");
    } else {
        await User.create({
            openid,
            username,
            password,
            date
        });
        res.send("success");
    }
})

// 登录
app.post("/toLogin", async (req, res) => {
    const { username, password } = req.body;
    const result = await User.findOne({
        username
    });
    if (result) {
        if (result.password === password) {
            res.send("success");
        } else {
            res.send("pwdError")
        }
    } else {
        res.send("error");
    }
})

// 小程序端删除寻物或寻主数据
app.post("/deleteLose", async (req, res) => {
    const { _id } = req.body;
    try {
        await Lose.findByIdAndRemove(_id);
        await Collection.deleteMany({
            id: _id
        })
        res.send("success");
    } catch (error) {
        res.send("error");
    }
})

// 小程序端修改寻物或寻主数据
app.post("/updateLose", async (req, res) => {
    const { type, classify1, classify2, name, date, region, phone, desc, imgList, time, openid, id } = req.body;
    try {
        await Lose.findByIdAndUpdate(id, {
            type, classify1, classify2, name, date, region, phone, desc, imgList, time, openid,
        })
        res.send("success");
    } catch (error) {
        res.send("error");
    }
})

// 查询物品详情数据
app.post("/getDetail", async (req, res) => {
    const { _id } = req.body;
    try {
        const result = await Lose.findById(_id);
        res.send(result);
    } catch (error) {
        res.send("error");
    }
})

// 管理员登录
app.post("/admin/login", async (req, res) => {
    const { username, password } = req.body;
    const result = await Admin.findOne({
        username
    })

    if (result && result.password === password) {
        // 登录成功
        res.send(result);
    } else {
        res.send("error");
    }
})

// 寻主/寻物数据
app.post("/admin/getLose", async (req, res) => {
    const { type, page, size } = req.body;
    try {
        const result = await Lose.find({
            type
        }).skip((page - 1) * size).limit(size);
        const total = await Lose.find({
            type
        }).countDocuments();
        res.send({
            result,
            total
        })
    } catch (error) {
        res.send("error");
    }

})

// 删除寻物/寻主数据
app.post("/admin/delete", async (req, res) => {
    const { _id } = req.body;
    try {
        await Lose.findByIdAndRemove(_id);
        res.send("success");
    } catch (error) {
        res.send("error");
    }
})

// 用户数据
app.post("/admin/getUser", async (req, res) => {
    const { page, size, search } = req.body;
    try {
        if (search) {
            const username = new RegExp(search, 'i');
            const result = await User.find({
                username
            })
                .skip((page - 1) * size).limit(size);
            const total = await User.find().countDocuments();

            res.send({
                result,
                total
            })
        } else {
            const result = await User.find()
                .skip((page - 1) * size).limit(size);
            const total = await User.find().countDocuments();

            res.send({
                result,
                total
            })
        }
    } catch (error) {
        res.send("error");
    }
})

// 删除用户信息
app.post("/admin/deleteUser", async (req, res) => {
    const { _id } = req.body;
    try {
        await User.findByIdAndRemove(_id);
        res.send("success");
    } catch (error) {
        res.send("error");
    }
})

// 管理员信息
app.post("/admin/getAdmin", async (req, res) => {
    const { page, size, search } = req.body;
    try {
        if (search) {
            const username = new RegExp(search, 'i');
            const result = await Admin.find({
                username
            })
                .skip((page - 1) * size).limit(size);
            const total = await Admin.find().countDocuments();

            res.send({
                result,
                total
            })
        } else {
            const result = await Admin.find()
                .skip((page - 1) * size).limit(size);
            const total = await Admin.find().countDocuments();

            res.send({
                result,
                total
            })
        }
    } catch (error) {
        res.send("error");
    }
})

// 删除管理员信息
app.post("/admin/deleteAdmin", async (req, res) => {
    const { _id, username } = req.body;
    try {
        const { role } = await Admin.findOne({
            username
        });
        if (role === 1) {
            res.send("noPower");
        } else {
            await Admin.findByIdAndRemove(_id);
            res.send("success");
        }
    } catch (error) {
        res.send("error");
    }
})

// 新增管理员
app.post("/admin/addAdmin", async (req, res) => {
    const { username, password, role, nickname, _id } = req.body;

    try {
        if (_id) {
            // 编辑
            await Admin.findByIdAndUpdate(_id, {
                username,
                password,
                role,
                nickname,
            })
        } else {
            // 新增
            await Admin.create({
                username,
                password,
                role,
                nickname,
                create_time: new Date().getTime()
            })
        }
        res.send("success");
    } catch (error) {
        res.send("error");
    }
})

// 查询当前管理员权限
app.post("/admin/getPower", async (req, res) => {
    const { username } = req.body;

    try {
        const { role } = await Admin.findOne({
            username
        });
        if (role === 0) {
            res.send(true);
        } else {
            res.send(false);
        }
    } catch (error) {
        res.send("error");
    }
})

// 提交评论
app.post("/addComment", async (req, res) => {
    const { avatarUrl, nickName, content, time, _id } = req.body;
    try {
        let result = await Lose.findById(_id);
        let { commentList } = result;
        commentList.push({
            avatarUrl,
            nickName,
            content,
            time,
        })
        await Lose.findByIdAndUpdate(_id, {
            commentList
        })
        result["commentList"] = commentList;
        res.send({
            status: "success",
            data: result
        });
    } catch (error) {
        res.send({
            status: "error",
            data: error
        });
    }
})

// 认领
app.post('/toClaim', async (req, res) => {
    try {
        const { desc, img_url, openid, _id } = req.body;
        await Lose.findByIdAndUpdate(_id, {
            claimInfo: {
                desc,
                img_url,
                openid
            },
            state: 1
        });
        
        res.send("success");
    } catch (error) {
        console.log(error);
        res.send("error");
    }
})

// 审核认领操作
app.post('/admin/reviewClaim', async (req, res) => {
    try {
        const { _id, state } = req.body;
        await Lose.findByIdAndUpdate(_id, {
            state
        });
        res.send("success");
    } catch (error) {
        console.log(error);
        res.send("error");
    }
})

// 新增意见反馈
app.post("/addAdvice", async (req, res) => {
  try {
    const { phone, advice_content, openid } = req.body;
    await Advice.create({
      phone,
      advice_content,
      openid,
      create_time: new Date().getTime(),
    });
    res.send("success");
  } catch (error) {
    console.log(error);
    res.send("error");
  }
});

// 查询意见反馈表
app.post("/admin/getAdviceList", async (req, res) => {
  const { page, size } = req.body;
  try {
    const result = await Advice.find()
      .skip((page - 1) * size)
      .limit(size);
    const total = await Advice.find().countDocuments();

    res.send({
      result,
      total,
    });
  } catch (error) {
    res.send("error");
  }
});

// 删除意见反馈
app.post("/admin/deleteAdvice", async (req, res) => {
  const { _id } = req.body;
  try {
    await Advice.findByIdAndRemove(_id);
    res.send("success");
  } catch (error) {
    res.send("error");
  }
});

// 查询轮播图列表
app.post('/getBannerList', async (req, res) => {
  try {
    const result = await Banner.find().sort({ index: 1 });

    res.send({
      result,
    });
  } catch (error) {
    console.log(error);
    res.send('error');
  }
});

// 新增轮播图
app.post('/admin/addBanner', async (req, res) => {
  try {
    const { image_url, index, title, desc } = req.body;

    await Banner.create({
      image_url,
      index,
      title,
      desc,
      create_time: new Date().getTime(),
    });

    res.send('success');
  } catch (error) {
    console.log(error);
    res.send('error');
  }
});

// 删除轮播图
app.post('/admin/deleteBanner', async (req, res) => {
  try {
    const { _id } = req.body;
    await Banner.findByIdAndRemove(_id);

    res.send('success');
  } catch (error) {
    console.log(error);
    res.send('error');
  }
});

// 修改轮播图
app.post('/admin/updateBanner', async (req, res) => {
  try {
    const { index, title, desc, image_url, _id } = req.body;

    await Banner.findByIdAndUpdate(_id, {
      index,
      title,
      desc,
      image_url,
      update_time: new Date().getTime()
    });

    res.send('success');
  } catch (error) {
    console.log(error);
    res.send('error');
  }
});


app.listen(3001, () => {
    console.log('server running!');
})