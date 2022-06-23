const express = require('express')
const sqlite3 = require('sqlite3')
const cors = require('cors')
const { json } = require('express')
const app = express()

app.use(express.json())
app.use(cors())
//Establecemos los prámetros de conexión
const db = new sqlite3.Database('./tareas.db', (err) => {
    if (err) {
        console.error("Erro opening database " + err.message);
    } else {
        db.run('CREATE TABLE articulos( \
            id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,\
            tarea NVARCHAR(20)  NOT NULL,\
            prioridad NVARCHAR(20)  NOT NULL\
        )', (err) => {
            if (err) {
                console.log("Table already exists.");
            }
            // let insert = 'INSERT INTO articulos (tarea, prioridad) VALUES (?,?)';
            // db.run(insert, ["Sacar al perro", "High"]);
            // db.run(insert, ["Enviar prueba2", "Low"]);
            // db.run(insert, ["Llamar a mamá", "Medium"]);
        });
    }
});
app.get('/', function(req,res){
    res.send('Ruta INICIO')
})
//Mostrar todos los artículos
app.get("/articulos/ordenados", (req, res, next) => {
    db.all("SELECT * FROM articulos order by prioridad asc", [], (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.status(200).json(rows);
      });
});
app.get("/articulos", (req, res, next) => {
    db.all("SELECT * FROM articulos", [], (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.status(200).json(rows);
      });
});
// //Mostrar un SOLO artículo
app.get("/articulos/:id", (req, res, next) => {
    var params = [req.params.id]
    db.get(`SELECT * FROM articulos where id = ?`, [req.params.id], (err, row) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.status(200).json(row);
      });
});
//Crear un artículo
app.post("/articulos/", (req, res, next) => {
    var reqBody = req.body;
    console.log(reqBody.descripcion)
    console.log(reqBody.precio)
    db.run(`INSERT INTO articulos (tarea, prioridad) VALUES (?,?)`,
        [reqBody.descripcion, reqBody.precio],
        function (err, result) {
            if (err) {
                res.status(400).json({ "error": err.message })
                return;
            }
            res.status(201).json({
                "id": this.lastID
            })
        });
});
//Editar articulo
app.put('/articulos/:id', (req, res)=>{
    db.run(`UPDATE articulos set tarea = ?, prioridad = ? WHERE id = ?`,
        [req.body.descripcion, req.body.precio, req.params.id],
        function (err, result) {
            if (err) {
                res.status(400).json({ "error": res.message })
                return;
            }
            res.status(200).json({ updatedID: this.changes });
        });
        console.log('decripcion:'+req.body.descripcion+'  precio:'+req.body.precio+'  id:'+req.params.id)
});
//Eliminar articulo
app.delete('/articulos/:id', (req,res)=>{
    db.run(`DELETE FROM articulos WHERE id = ?`,
        req.params.id ,
        function (err, result) {
            if (err) {
                res.status(400).json({ "error": res.message })
                return;
            }
            res.status(200).json({ deletedID: this.changes })
        });
});


const puerto = process.env.PUERTO || 8000
app.listen(puerto, function(){
    console.log("Servidor Ok en puerto:"+puerto)
})