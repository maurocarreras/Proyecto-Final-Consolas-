

    document.addEventListener("DOMContentLoaded", () => {
        fetchData()
    })
    
    const fetchData = async () => {
        try {
            const res = await fetch('consolas.json')
            const data = await res.json()
            // console.log(data)
            pintarProductos(data)
            detectarBotones(data)
        } catch (error) {
            console.log(error)
        }
    }

    


    const player = document.getElementById('mario')
    const contenedorrkg = document.querySelector(".ranking");
    const contendorProductos = document.querySelector('#contenedor-productos')
    let micarrito = JSON.parse(localStorage.getItem("carrito")) || [];

    //------CARDS--------

    const pintarProductos = (data) => {
        const template = document.querySelector('#template-productos').content
        const fragment = document.createDocumentFragment()
        // console.log(template)
        data.forEach(producto => {
            // console.log(producto)
            template.querySelector('img').setAttribute("src",producto.img)
            
            template.querySelector('h5').textContent = producto.nombre
            template.querySelector('p').textContent = producto.precio
            template.querySelector('button').dataset.id = producto.id
            const clone = template.cloneNode(true)
            fragment.appendChild(clone)
        })
        contendorProductos.appendChild(fragment)
        alertabienvenida()
    }

    // let micarrito = JSON.parse(localStorage.getItem("carrito")) || [];



    //-------------CARRITO--------------


    let carrito = {}

const detectarBotones = (data) => {
    const botones = document.querySelectorAll('.card button')

    botones.forEach(btn => {
        btn.addEventListener('click', () => {
            // console.log(btn.dataset.id)
            const producto = data.find(item => item.id === parseInt(btn.dataset.id))
            producto.cantidad = 1
            if (carrito.hasOwnProperty(producto.id)) {
                producto.cantidad = carrito[producto.id].cantidad + 1
            }
            carrito[producto.id] = { ...producto }
            // console.log('carrito', carrito)
            pintarCarrito()
            alertaagregar()
        })
    })
}

const items = document.querySelector('#items')

const pintarCarrito = () => {

    //pendiente innerHTML
    items.innerHTML = ''

    const template = document.querySelector('#template-carrito').content
    const fragment = document.createDocumentFragment()

    Object.values(carrito).forEach(producto => {
        // console.log('producto', producto)
        template.querySelector('th').textContent = producto.id
        template.querySelectorAll('td')[0].textContent = producto.nombre
        template.querySelectorAll('td')[1].textContent = producto.cantidad
        template.querySelector('span').textContent = producto.precio * producto.cantidad

        //botones
        template.querySelector('.btn-info').dataset.id = producto.id
        template.querySelector('.btn-danger').dataset.id = producto.id

        const clone = template.cloneNode(true)
        fragment.appendChild(clone)
    })

    items.appendChild(fragment)
    localStorage.setItem("carrito",JSON.stringify(carrito))
    pintarFooter()
    accionBotones()
    

}

const footer = document.querySelector('#footer-carrito')
const pintarFooter = () => {

    footer.innerHTML = ''

    if (Object.keys(carrito).length === 0) {
        footer.innerHTML = `
        <th scope="row" colspan="5">Carrito vacío </th>
        `
        return
    }

    const template = document.querySelector('#template-footer').content
    const fragment = document.createDocumentFragment()

    // sumar cantidad y sumar totales
    const nCantidad = Object.values(carrito).reduce((acc, { cantidad }) => acc + cantidad, 0)
    const nPrecio = Object.values(carrito).reduce((acc, {cantidad, precio}) => acc + cantidad * precio ,0)
    // console.log(nPrecio)

    template.querySelectorAll('td')[0].textContent = nCantidad
    template.querySelector('span').textContent = nPrecio

    const clone = template.cloneNode(true)
    fragment.appendChild(clone)

    footer.appendChild(fragment)


    const boton = document.querySelector('#vaciar-carrito')
    boton.addEventListener('click', () => {
        carrito = {}
        pintarCarrito()
    })

}

const accionBotones = () => {
    const botonesAgregar = document.querySelectorAll('#items .btn-info')
    const botonesEliminar = document.querySelectorAll('#items .btn-danger')

    // console.log(botonesAgregar)

    botonesAgregar.forEach(btn => {
        btn.addEventListener('click', () => {
            // console.log(btn.dataset.id)
            const producto = carrito[btn.dataset.id]
            producto.cantidad ++
            carrito[btn.dataset.id] = { ...producto }
            pintarCarrito()
            alertasumar()
        })
    })

    botonesEliminar.forEach(btn => {
        btn.addEventListener('click', () => {
            // console.log('eliminando...')
            const producto = carrito[btn.dataset.id]
            producto.cantidad--
            if (producto.cantidad === 0) {
                delete carrito[btn.dataset.id]
            } else {
                carrito[btn.dataset.id] = { ...producto }
            }
            pintarCarrito()

            alertaborrar()
        })
    })
}








const contactos = [];
const botonValidarContacto = document.getElementById("agregarContacto")

    function preventDefault(evt) {
        evt.preventDefault();
    }


    // ----------ALERTAS---------

function alertaagregar(){
    Swal.fire(" consola añadida al carrito")
}

function alertaborrar(){
    Swal.fire("producto eliminado del carrito")
}

function alertasumar(){
    Swal.fire("sumaste una consola mas al carrito")
}

function alertabienvenida(){
    Swal.fire("Bienvenidos a mi sitio GAMERS ")
}

function alertacomprafinalizada(){
    Swal.fire("tu compra se realizo correctamente te llegara un  mail con todo detallado,  gracias por elegirnos ")
}

function comprafinalizada(event){
    event.preventDefault();
    const boton = document.querySelector('#vaciar')
    boton.addEventListener('click', () => {
        carrito = {}
        pintarCarrito()
        alertacomprafinalizada()
    })

}


const pedirconsolas=()=>{
    return new Promise((resolve, reject) => {
        setTimeout(()=>{
            resolve(consolas)
        },2500)
    })
}


async function API () {
    // const URL = "./data.json";
    const res = await fetch('./data.json')
    // const response = await fetch(URL);
    const data = await res.json();
    console.log(data)
    ranking(data)
}

API();


function ranking(array){
    array.forEach(element=>{
        contenedorrkg.innerHTML +=`<div class = "tarjetastop">
        <h4 class ="rkgnombre">${element.nombre}</h4>
        <p class="rkgplataforma">${element.plataforma}</p>
        <img  class="card-img "src= " ../img/${element.img} " alt="">
            
        </div>`
    })
}



//------ANIMACION MARIO---------

const powerup = {
    audio: new Audio('http://themushroomkingdom.net/sounds/wav/smb/smb_powerup.wav'),
    play: function() { 
      this.audio.currentTime = 0;
      this.audio.play() 
    }
  }
  
  // Actualizamos la ubicación del personaje
  function updateElement(element, incx, incy) {
    var x = Number(element.getAttribute('data-x')) + incx
    var y = Number(element.getAttribute('data-y')) + incy
    
    /*
    // Ejemplo básico de límite de regiones
    if ((x < 0) || (x > 600)) 
      return
    */
    
    element.style.transform = 'translate('+ x +'px, '+ y +'px)'
    
    if (element.classList.contains('mirror'))
      element.style.transform += ' scaleX(-1)'
      
    if (element.classList.contains('big'))
      element.style.transform += ' scale(2)'
    
    // Update HTML
    element.setAttribute('data-x', x)
    element.setAttribute('data-y', y)
  }
  
  // Cuando el usuario pulsa una tecla
  window.addEventListener('keydown', function(e) {
    // console.log(e)
    
    var speed = 10;
    //var speed = (e.ctrlKey ? 20 : 10)
    
    // Cursor hacia la derecha
    if (e.keyCode == 39) {
      player.classList.add('caminar')
      player.classList.remove('mirror')
      updateElement(player, +speed, 0)
    }
    // Cursor hacia la izquierda
    else if (e.keyCode == 37) {
      player.classList.add('caminar')
      player.classList.add('mirror')
      updateElement(player, -speed, 0)
    }
    
    if (e.keyCode == 85) {
      player.classList.toggle('big')
      //new Audio('http://themushroomkingdom.net/sounds/wav/smb/smb_powerup.wav').play()
      powerup.play(); // fix network lag sound    
      updateElement(player, 0, 0)
    }
    
  })
  
  // Cuando el usuario suelta una tecla
  window.addEventListener('keyup', function(e) {
    // Eliminamos la clase caminar para detener la animación
    // y que se detenga en el primer fotograma, como cuando no
    // realiza animación.
    player.classList.remove('caminar')
  })
  
  // Inicialización
  updateElement(player, 0, 0)