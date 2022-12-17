const express = require('express');
const app = express();
const productos = []

app.use(express.urlencoded({extended:true}))
app.set('views','./views');
app.set('view engine','pug');

app.post('/',(req,res)=>{
    productos.push(req.body)
    console.log(productos)
    res.redirect('/')
})
app.get('/',(req,res)=>{
    res.render('form',{productos})
})
app.get('/productos',(req,res)=>{
    res.render('table',{productos})
})

const PORT = 8080;
const server = app.listen(PORT,()=>{
    console.log(`El servidor HTTP esta escuchando el puerto ${server.address().port}`)
})
server.on("Error",err=>{console.log(`Error en el servidor: ${err}`)})