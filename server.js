const express=require('express');
const app=express();

app.get('/',(req,res)=>res.send('APT Running'));

//Init middle ware

app.use(express.json({extended:false}));

//Define Routes
app.use('/auth',require('./routes/auth'));
app.use('/profile',require('./routes/profile'));
app.use('/user',require('./routes/user'));



const PORT=process.env.PORT||5000;
app.listen(PORT,()=>console.log(`server started on port ${PORT}`));

//DB connetect
const mongoose=require('mongoose');
const config=require('config');
const db=config.get('mongoURI');

const connctDB=async()=>{

    try{
      await  mongoose.connect(db);

      console.log('MongoDB ocnncected...')
    }
    catch(err){

        console.log(err.message);

        process.exit(1);
        
    }
}


connctDB();



