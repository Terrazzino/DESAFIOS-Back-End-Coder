const express = require('express');
const {Server:HttpServer} = require('http');
const {Server:IOServer} = require('socket.io');

const app = express();
const {engine} = require('express-handlebars')
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer)

app.use(express.static('views'))
app.use(express.urlencoded({extended:true}))
app.engine('handlebars',engine({defaultLayout: false}));
app.set('views','./views');
app.set('view engine','handlebars');

const productos = [];
const mensajes = [];

app.post('/',(req,res)=>{
    productos.push(req.body)
    console.log(productos)
    res.redirect('/')
})
app.get('/',(req,res)=>{
    res.render('form',{root:__dirname})
})
app.get('/productos',(req,res)=>{
    res.render('table',{productos})
})

io.on('connection',socket=>{
    console.log("Un cliente se a conectado");

    socket.emit('products',productos);
    socket.on('new-products',data=>{
        productos.push(data);
        io.sockets.emit('products',productos)
    })

    socket.emit('chat',mensajes);
    socket.on('new-message',data=>{
        mensajes.push(data);
        io.sockets.emit('chat',mensajes)
    })
})

const PORT = 8080;
const server = httpServer.listen(PORT,()=>{
    console.log(`El servidor HTTP con Web Socket esta escuchando el puerto ${server.address().port}`)
})
server.on("Error",err=>{console.log(`Error en el servidor: ${err}`)})