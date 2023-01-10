const express = require('express');
const app = express();
const {Router}= express;
const router = Router();
const {engine} = require('express-handlebars');
const fs = require('fs');

const routerProductos = express.Router();
const routerCarrito = express.Router();
routerProductos.use(express.json());
routerCarrito.use(express.json());
routerProductos.use(express.urlencoded({extended:true}));
routerCarrito.use(express.urlencoded({extended:true}));

app.engine('handlebars',engine({defaultLayout: false}));
app.set('views','./views');
app.set('view engine','handlebars');

app.use('/productos',routerProductos);
app.use('/carrito',routerCarrito);

const administrador = false;
let ID = 4;
let carritoID=0;

const productos =  [
    {id:0,timestamp:new Date().toLocaleString(),nombre:"Golden",descripcion:"Cerveza Rubia",codigo:"32843hfnbxidfn",precio:400,stock:1000,foto:"https://firebasestorage.googleapis.com/v0/b/react-cerveceria.appspot.com/o/golden.png?alt=media&token=a1880e55-fed9-4af9-aebf-1993ec2d1668"},
    {id:1,timestamp:new Date().toLocaleString(),nombre:"Scottish",descripcion:"Cerveza Roja",codigo:"fgsfsret765437",precio:600,stock:1000,foto:"https://firebasestorage.googleapis.com/v0/b/react-cerveceria.appspot.com/o/scottish.png?alt=media&token=4b0d397a-d898-428d-bb31-fcdc68c685be"},
    {id:2,timestamp:new Date().toLocaleString(),nombre:"Porter",descripcion:"Cerveza Negra",codigo:"56gfdrh45643",precio:700,stock:1000,foto:"https://firebasestorage.googleapis.com/v0/b/react-cerveceria.appspot.com/o/porter.png?alt=media&token=b644fe44-c4e1-4f01-9f55-2d34647ad4be"},
    {id:3,timestamp:new Date().toLocaleString(),nombre:"Ipa",descripcion:"Cerveza Cobriza",codigo:"56gert76uhur34",precio:800,stock:1000,foto:"https://firebasestorage.googleapis.com/v0/b/react-cerveceria.appspot.com/o/ipa.png?alt=media&token=0420c621-2d30-493a-acd1-c294bc867073"}
];
let carrito=[];

fs.writeFileSync('./productos.txt',JSON.stringify(productos,null,2))
let fsProd = fs.readFileSync('./productos.txt','utf-8')
fs.writeFileSync('./carrito.txt',JSON.stringify(carrito,null,2))

//PRODUCTOS

routerProductos.get('/',(req,res)=>{ 
    // res.json(productos) 
    res.render('productos',{prod:productos})
});

routerProductos.get('/:id',(req,res)=>{
    let ide = parseInt(req.params.id);
    let prodID = productos.find(prod=>prod.id===ide)
    // res.json(prodID)
    res.render('productos',{prod:{prodID}})
});

routerProductos.post('/',(req,res)=>{
    let producto = req.body
    productos.push({
        nombre:producto.nombre,
        id: ID,
        timestamp:new Date().toLocaleString(),
        código:producto.codigo,
        descripción:producto.descripcion,
        precio:producto.precio,
        foto:producto.foto,
        stock:producto.stock,
    })
    ID++
    fs.appendFileSync('./productos.txt',JSON.stringify(productos,null,2))
    // res.json(productos);
    res.render('productos',{prod:productos});
});

routerProductos.put('/:id',(req,res)=>{
    let ide = parseInt(req.params.id);
    let newProducto = req.body;

    let prodId = productos.find(prod=>prod.id===ide);
    let indexProd = productos.indexOf(prodId)
    productos.splice(indexProd,1,{
        nombre:newProducto.nombre,
        id: ID,
        timestamp:new Date().toLocaleString(),
        código:newProducto.codigo,
        descripción:newProducto.descripcion,
        precio:newProducto.precio,
        foto:newProducto.foto,
        stock:newProducto.stock,
    })
    ID++
    fs.appendFileSync('./productos.txt',JSON.stringify(productos,null,2));
    // res.json(productos);
    res.render('productos',{prod:productos});
});

routerProductos.delete('/:id',(req,res)=>{
    let ide = parseInt(req.params.id);

    let prodId = productos.find(prod=>prod.id===ide);
    let indexProd = productos.indexOf(prodId);
    productos.splice(indexProd,1);
    fs.appendFileSync('./productos.txt',JSON.stringify(productos,null,2));
    // res.json(productos);
    res.render('productos',{prod:productos});
});



//CARRITO
routerCarrito.get('/',(req,res)=>{
    // res.json(carrito);
    res.render('carrito',{carr:carrito});
})
routerCarrito.post('/',(req,res)=>{
    carrito.push({
        id:carritoID,
        timestamp:new Date().toLocaleString(),
        productos:`${JSON.stringify(productos)}`
    })
    fs.appendFileSync('./carrito.txt',JSON.stringify(carrito,null,2))
    carritoID++;
    // res.json(carrito);
    res.render('carrito',{carr:carrito});

});
routerCarrito.delete('/:id',(req,res)=>{
    let ide = parseInt(req.params.id);

    let carrId = carrito.find(carr=>carr.id===ide);
    let posCarr = carrito.indexOf(carrId);

    carrito.splice(posCarr,1);
    res.json(carrito)
    // res.render('carrito',carrito)
});



routerCarrito.get('/:id/productos',(req,res)=>{
    let ide = parseInt(req.params.id);

    let prod = carrito.find(carr=>carr.id===ide);
    res.json(prod.productos)
});

routerCarrito.post('/:id/productos',(req,res)=>{

    let ide = parseInt(req.params.id);
    let newProduct = req.body;

    let prod = carrito.find(carr=>carr.id===ide);
    let indexProd = carrito.indexOf(prod);
    carrito[indexProd].productos.push({
        nombre:newProduct.nombre,
        id: ID,
        timestamp:new Date(),
        codigo:newProduct.codigo,
        descripcion:newProduct.descripcion,
        precio:newProduct.precio,
        foto:newProduct.foto,
        stock:newProduct.stock,
    })
    ID++;
    // res.render('carrito',carrito)
    res.json(carrito)
});

routerCarrito.delete('/:id/productos/:id_prod',(req,res)=>{
    let ide = parseInt(req.params.id);
    let ideProd = parseInt(req.params.id_prod);

    let carritoID = carrito.find(carr=>carr.id===ide);
    let posProdCarrito = carrito.indexOf(carritoID);

    let prodID = carrito[posProdCarrito].productos.find(prod=>prod.id===ideProd);
    let posProd = carrito[posProdCarrito].productos.indexOf(prodID);
    carrito[posProdCarrito].productos.splice(posProd,1)
    
    res.json(carrito[posProdCarrito].productos)
    // res.render('carrito',carrito)
});

const PORT = 8080;
const server = app.listen(PORT,()=>{
    console.log(`El servidor HTTP esta conectado al puerto ${server.address().port}`)
})
server.on('error',err=>{console.log(`Error en el servidor: ${err}`)})