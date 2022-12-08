const express = require('express');
const app = express();
app.use(express.static('public'));
const {Router} = express;
const router = Router();

const routerProductos = express.Router();
routerProductos.use(express.json());
routerProductos.use(express.urlencoded({extended:true}))

app.use('/api/productos',routerProductos)

let productos = [];
let idProducto = 1

routerProductos.get('/',(req,res)=>{
    if(!productos[0]){
        res.json({error:"No hay productos"})
    }else{
        res.json(productos) 
    }
})

routerProductos.get('/:id',(req,res)=>{
    let {id} = req.params;
    let idParse = parseInt(id);
    let productId = productos.find(el=>el.id==idParse)
    if(productId){
        res.json(productId)
    }else{
        res.json({error:"No hay productos"})
    }
})

routerProductos.post('/',(req,res)=>{
    if(!productos[0]){
        req.body.id=1
        productos.push(req.body);
        res.json({productos})
    }else{
        idProducto+=1
        req.body.id=idProducto
        productos.push(req.body);
        res.json({productos})
    }

})
routerProductos.put('/:id',(req,res)=>{
    let {id} = req.params;
    let idParse = parseInt(id);
    let newProd = req.body;
    let productId = productos.find(el=>el.id===idParse);
    if(productId){
        let index = productos.indexOf(productId);
        productos.splice(index,1,newProd);
        newProd.id=idParse;
        res.json(productos)
    }else{
        res.json({error:"No hay productos"})
    }
})
routerProductos.delete('/:id',(req,res)=>{
    let {id} = req.params;
    let idParse = parseInt(id);
    let productId = productos.find(el=>el.id===idParse);
    if(productId){
        let index = productos.indexOf(productId);
        productos.splice(index,1);
        res.json(productos)
    }else{
        res.json({error:"No hay productos"})
    }
    })


const PORT = 8080;
const server = app.listen(PORT,()=>{
    console.log(`El servidor HTTP esta leyendo el puerto: ${server.address().port}`)
})
server.on("Error",error=>console.log(`Error en el servidor: ${error}`))