const bodyParser = require("body-parser")
const express=require("express")
 const ejs=require("ejs") 
 const mongoose=require("mongoose")
const app=express()
const _=require("lodash")
app.set("view engine","ejs")

app.use(bodyParser.urlencoded({extended:true}))

app.use(express.static("public"))

mongoose.connect("mongodb://localhost:27017/wikiDB")

const articleSchema={
    title:String,
    content:String
}
const Article=mongoose.model("Article",articleSchema)
app.route("/articles")
.get((req,res)=>{
    Article.find((err,foundArticles)=>{
        if(!err){
    res.send(foundArticles)}
    else{
        res.send(err)
    }

    })
})
.post((req,res)=>{
       const newArticle=new Article({
        title:req.body.title,
        content:req.body.content
       })

       newArticle.save((err)=>{  //function inside save method just check out the documentation 
        if (!err){
        res.send("seccess")}
        else{
            res.send(err)
        }
       })  
})
.delete((req,res)=>{
    Article.deleteMany((err)=>{
        if (err){
            res.send(err)
        }else{
            res.send("seccessfully deleted all articles")
        }

    })
})

app.route("/articles/:articleTitle")
.get((req,res)=>{
    // req.params.articleTitle
    Article.findOne({title:req.params.articleTitle},(err,foundArticle)=>{
        if(foundArticle){
           res.send(foundArticle)
        }else{
             res.send("No Articles matches what are you looking for ")
        }
    })
})
.put((req,res)=>{
   Article.replaceOne({title:req.params.articleTitle},
    {title:req.body.title,content:req.body.content} ,
    (err)=>{
        if(!err){
            res.send("Seccessufly updated articales")
        }else{
            res.send(err)
        }
    })
})

.patch((req,res)=>{
    Article.updateOne({title:req.params.articleTitle},
        req.body,
        (err)=>{
            if (!err){
                res.send("Seccussfly updated")
            }
        })
})
.delete((req,res)=>{
    Article.deleteOne({title:req.params.articleTitle},
    (err)=>{
        if(!err){
            res.send("Seccessfully Deleted")
        }else{
            res.send(err)
        }
    })
})


app.listen(3000,()=>{
    console.log("Server started on port 3000")
})
