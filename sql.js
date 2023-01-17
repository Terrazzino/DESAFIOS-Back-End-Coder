const knexLib = require('knex');
class ClientSql{
    constructor(config,nameTable){
        this.knex=knexLib(config);
        this.nameTable=nameTable
    }

    //PRODUCTOS
    
    crearTablaProductos(){
        return this.knex.schema
        .dropTableIfExists(`${this.nameTable}`)
        .createTable(`${this.nameTable}`,table=>{
            table.increments('id').primary();
            table.string('nombre',80).notNullable();
            table.float('precio');
            table.string('imagen',100).notNullable()
        })
    }
    insertarArticulos(articulos){
        return this.knex(`${this.nameTable}`).insert(articulos);
    }

    listarArticulos(){
        return this.knex(`${this.nameTable}`).select('*')
    }

    borrarArticulosPorId(id){
        return this.knex.from(`${this.nameTable}`).where('id',id).del()
    }

    actualizarStockPorId(stock,id){
        return this.knex.from(`${this.nameTable}`).where('id',id).update({stock: stock})
    }

    //MENSAJES

    crearTablaMensajes(){
        return this.knex.schema.dropTableIfExists(`${this.nameTable}`)
        .createTable(`${this.nameTable}`,table=>{
            table.increments('id').primary();
            table.string('author',15).notNullable();
            table.string('message',10).notNullable();
        })

    }
    insertarMensajes(articulos){
        return this.knex(`${this.nameTable}`).insert(articulos);
    }

    listarMensajes(){
        return this.knex(`${this.nameTable}`).select('*')
    }

    borrarMensajesPorId(id){
        return this.knex.from(`${this.nameTable}`).where('id',id).del()
    }
    
    close(){
        this.knex.destroy();
    }

}

module.exports={
    ClientSql
}