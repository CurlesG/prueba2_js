//Definición de variables
const url = 'http://localhost:8000/articulos/'
const contenedor = document.querySelector('tbody')
let resultados = ''

const modalArticulo = new bootstrap.Modal(document.getElementById('modalArticulo'))
const formArticulo = document.querySelector('form')
const descripcion = document.getElementById('descripcion')
const precio = document.getElementById('precio')
const stock = document.getElementById('stock')
var opcion = ''

btnCrear.addEventListener('click', ()=>{
    descripcion.value = ''
    precio.value = ''
    modalArticulo.show()
    opcion = 'crear'
})

//funcion para mostrar los resultados
const mostrar = (articulos) => {
    articulos.forEach(articulo => {
        resultados += `<tr>
                            <td id="id">${articulo.id}</td>
                            <td>${articulo.tarea}</td>
                            <td>${articulo.prioridad}</td>
                            <td class=" text-center"><a class="btnEditar btn btn-primary">Editar</a>
                            <a class="btnBorrar btn btn-danger">Borrar</a>
                            <a id = "completar" onclick = selectedRow() class="btnCompletar btn btn-success">Completar</a></td>
                       </tr>
                    `    
    })
    contenedor.innerHTML = resultados
    
}

//Procedimiento Mostrar
fetch(url)
    .then( response => response.json() )
    .then( data => mostrar(data) )
    .catch( error => console.log(error))

//intentar ordenar
// const sort = document.getElementById('btnSort')
// sort.addEventListener('click', sortt)

// function sortt(){
//     option = 'sort'
//     console.log(option)
//     const resultados =''
//     fetch('http://localhost:8000/articulos/ordenados')
//     .then( response => response.json() )
//     .then( data => mostrar(data) )
//     .catch( error => console.log(error))
// }

const on = (element, event, selector, handler) => {
    //console.log(element)
    //console.log(event)
    //console.log(selector)
    //console.log(handler)
    element.addEventListener(event, e => {
        if(e.target.closest(selector)){
            handler(e)
        }
    })
}

//Procedimiento Borrar
on(document, 'click', '.btnBorrar', e => {
    const fila = e.target.parentNode.parentNode
    const id = fila.firstElementChild.innerHTML
    alertify.confirm("¿Estas seguro de <b>borrar</b> este elemento?",
    function(){
        fetch(url+id, {
            method: 'DELETE'
        })
        .then( res => res.json() )
        .then( ()=> location.reload())
        alertify.success('Elemento borrado')
    },
    function(){
        alertify.error('Operación cancelada')
    }).setHeader('<em> Eliminar recurso </em> ');
})

//Procedimiento Editar
let idForm = 0
on(document, 'click', '.btnEditar', e => {    
    const fila = e.target.parentNode.parentNode
    idForm = fila.children[0].innerHTML
    console.log(idForm)
    const descripcionForm = fila.children[1].innerHTML
    console.log(descripcionForm)
    const precioForm = fila.children[2].innerHTML
    console.log(precioForm)
    //const stockForm = fila.children[3].innerHTML
    descripcion.value =  descripcionForm
    precio.value =  precioForm
    //stock.value =  stockForm
    opcion = 'editar'
    console.log(opcion)
    modalArticulo.show()
     
})

//Procedimiento para Crear y Editar
formArticulo.addEventListener('submit', (e)=>{
    e.preventDefault()
    if(opcion=='crear'){        
        console.log('OPCION CREAR')
        fetch(url, {
            method:'POST',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify({
                descripcion:descripcion.value,
                precio:precio.value
                //stock:stock.value
            })
        })
        .then( response => response.json() )
        .then( data => {
            const nuevoArticulo = []
            nuevoArticulo.push(data)
            mostrar(nuevoArticulo)
        })
    }
    if(opcion=='editar'){    
        console.log('OPCION EDITAR')
        console.log(url+idForm)
        fetch(url+idForm,{
            method: 'PUT',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify({
                descripcion:descripcion.value,
                precio:precio.value
            })
        })
        .then( response => response.json() )
        .then( response => location.reload() )
    }console.log(descripcion.value)
    console.log(precio.value)
    modalArticulo.hide()
})

//funciones para reordenar
function sortTable() {
    var table, rows, switching, i, x, y, shouldSwitch;
    table = document.getElementById("tablaArticulos");
    console.log(table)
    switching = true;
    /*Make a loop that will continue until
    no switching has been done:*/
    while (switching) {
      //start by saying: no switching is done:
      switching = false;
      rows = table.rows;
      /*Loop through all table rows (except the
      first, which contains table headers):*/
      for (i = 1; i < (rows.length - 1); i++) {
        //start by saying there should be no switching:
        shouldSwitch = false;
        /*Get the two elements you want to compare,
        one from current row and one from the next:*/
        x = rows[i].getElementsByTagName("TD")[2];
        y = rows[i + 1].getElementsByTagName("TD")[2];
        console.log(y)
        //check if the two rows should switch place:
        if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
          //if so, mark as a switch and break the loop:
          shouldSwitch = true;
          break;
        }
      }
      if (shouldSwitch) {
        /*If a switch has been marked, make the switch
        and mark that a switch has been done:*/
        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
        switching = true;
      }
    }
  }

  //completado
//   function completed(){
//     var index,
//         table = document.getElementById('tablaArticulos');
//     for(var i = 0; i< table.rows.lenght; i++)
//         table.rows[i].onclick = function()
//         {
//             index = this.rowIndex;
//             this.classList.toggle('selected');
//             console.log(index);
            
//         }
//   }
