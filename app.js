
var expressSanitizer=require("express-sanitizer");
var express=require("express");
var mongoose=require("mongoose");
var app = express();
var bodyParser=require("body-parser");
var methodoverride = require("method-override");
app.use(methodoverride("_method"));

mongoose.connect("mongodb://localhost/restrout",{useMongoClient:true});
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());
var blogSchema = new mongoose.Schema({

    title:String,
    image:String,
    body:String,
    created:{type:Date, default: Date.now}
    
});

 var Blog=mongoose.model("Blog",blogSchema);
// Blog.create({
//     title:"TestBlog",
//     image:"https://animalso.com/wp-content/uploads/2016/10/pomsky_8.jpg",
//     body:"Hello This Is  A Test Blog Page!!!"
// });

app.get("/blogs",function(req,res){
  
  Blog.find({},function(error,blogs){
      if(error){
          console.log("******Error******");
      }
      else{
          res.render("index.ejs",{blogs:blogs});
      }
  });
    
});
app.get("/",function(req,res){
    res.redirect("/blogs");
});
app.get("/blogs/new",function(req,res){
   
   res.render("new.ejs");
    
});
app.post("/blogs",function(req,res){
   
   console.log(req.body);
   console.log("====================");
   console.log(req.body);
   Blog.create(req.body.blog,function(error,newblog){
       if(error){
           res.render("/blogs/new");
       }
       else
       {
           res.redirect("/blogs");
       }
   });
});
app.get("/blogs/:id",function(req,res){
   Blog.findById(req.params.id,function(error,foundblog){
       if(error){
           console.log("Error");
       }
       else{
           res.render("show.ejs",{blog: foundblog});
       }
       
   });
});

app.get("/blogs/:id/edit",function(req,res){
     Blog.findById(req.params.id,function(error,blog){
       if(error){
           console.log("Error");
       }
       else{
           res.render("edit.ejs",{blog : blog});
       }
           
          
});
});
app.put("/blogs/:id",function(req,res){
    req.body.blog.body=req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(error,blog){
        if(error){
            res.redirect("/blogs");
        }
        else{
            res.redirect("/blogs/"+req.params.id);
        }
    });
});
app.delete("/blogs/:id",function(req,res){
    Blog.findByIdAndRemove(req.params.id,function(error,blog){
        if(error){
            res.redirect("/blogs");
        }
        else{
            res.redirect("/blogs");
        }
    });
});
app.listen(process.env.PORT,process.env.IP,function(){
    console.log("Server Started...!!!");
});