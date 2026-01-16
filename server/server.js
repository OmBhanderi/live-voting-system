const PORT = 5000;

const express = require('express')
const app = express();

app.get('/',(req,res)=>{
    res.json({message:"voting api server"});
})

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

