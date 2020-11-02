const isloggedin = (type)=>{
  return function(req,res,next){  
    if(!req.cookies.token)
      {
          next()
      }
      else{
        //res.redirect('/' + type + '/home')
        res.redirect('/home')
      }
  }  
}


module.exports= isloggedin