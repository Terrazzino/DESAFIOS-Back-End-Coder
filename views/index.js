const socket = io.connect();
let date = new Date;

const rend = (data)=>{
    const html = data.map((prod)=>{
        return(`
        <tr>
            <td class="col-3 text-start text-light">${prod.nombre}</td>
            <td class="col-3 text-center text-light">${prod.precio}</td>
            <td class="col-3 text-center text-light" ><img style="width:30px; height: auto" src="${prod.imagen}"></td>
        </tr>
        `)
    });
    document.getElementById('productsList').innerHTML=html
}

socket.on('products',data=>{rend(data)})

const agregar = document.getElementById('agregar')

const addProducts = ()=>{
    const producto = {
        nombre:document.getElementById('nombre').value,
        precio:document.getElementById('precio').value,
        imagen:document.getElementById('imagen').value
    }
    socket.emit('new-products',producto);
}
agregar.addEventListener('click',addProducts,false)



const chat = (data)=>{
    if(data.length>0){
    const html = data.map((prod)=>{
        return(`
        <div>
            <b style="color:blue">${prod.author}</b>
            <b style="color:brown">${date.toLocaleString()}</b>:
            <i style="color:green">${prod.message}</i>
        </div>
        `)
    }).join(" ");
    document.getElementById('mensajes').innerHTML=html
    }else{
        const nonHtml =`<b style="color:grey">Bienvenido a nuestro chat. Indique debajo su email y su consulta y el chat dará inicio</b>`
        document.getElementById('mensajes').innerHTML=nonHtml
    }

}

socket.on('chat',data=>{chat(data)})

const enviar = document.getElementById('enviar');

const addMessage = ()=>{
    const mensaje = {
        author:document.getElementById('username').value,
        message:document.getElementById('mensaje').value
    }
    socket.emit('new-message',mensaje);
}
enviar.addEventListener('click',addMessage,false)