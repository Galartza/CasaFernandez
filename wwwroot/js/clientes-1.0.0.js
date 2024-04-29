// Esta línea asigna la función ListadoClientes() para que se ejecute cuando la ventana se haya cargado completamente.
window.onload = ListadoClientes();

// Define la función ListadoClientes.
function ListadoClientes() {
    // Se inicia una llamada AJAX utilizando jQuery para hacer una solicitud al servidor.
    $.ajax({
        // Especifica la URL a la que se enviará la solicitud AJAX para obtener el listado de clientes.
        url: '/Clientes/ListadoClientes',
        // Define los datos que se enviarán en la solicitud. En este caso, parece estar vacío.
        data: {},
        // Especifica el tipo de solicitud HTTP que se realizará, en este caso, una solicitud POST.
        type: 'POST',
        // Indica el tipo de datos que se espera recibir como respuesta, en este caso, un objeto JSON.
        dataType: 'json',
        // Define una función que se ejecutará si la solicitud AJAX tiene éxito. La respuesta del servidor se pasa como argumento a esta función.
        success: function(clientes) {

            $("#ModalCliente").modal("hide");
            LimpiarModal();
            // Inicia una variable contenidoTabla como una cadena vacía.
            let contenidoTabla = ``;

            // Itera sobre cada elemento del array clientes y ejecuta una función para cada uno.
            $.each(clientes, function(index, cliente) {
                // Construye una cadena HTML para cada cliente y la agrega a la variable contenidoTabla.
                contenidoTabla += `
                <tr>
                    <td>${cliente.nombre}</td>
                    <td>${cliente.apellido}</td>
                    <td class="text-center">
                        <button type="button" class="btn btn-success" onclick="AbrirModalEditar(${cliente.clienteId})">
                            Editar
                        </button>
                    </td>
                    <td class="text-center">
                        <button type="button" class="btn btn-danger" onclick="EliminarRegistro(${cliente.clienteId})">
                            Eliminar
                        </button>
                    </td>
                </tr>`;
            });

            // Actualiza el contenido del elemento HTML con ID tbody-clientes con el contenido generado en contenidoTabla.
            // $("#tbody-clientes").html(contenidoTabla);
            document.getElementById("tbody-clientes").innerHTML = contenidoTabla;

        },
        // Define una función que se ejecutará si la solicitud AJAX falla.
        error: function(xhr, status) {
            console.log('Disculpe, existió un problema al cargar el listado');
        }
    });
}

// Define la función LimpiarModal que se encarga de limpiar los campos del modal.
function LimpiarModal() {
    document.getElementById("clienteID").value = 0;
    document.getElementById("nombreCliente").value = "";
    document.getElementById("apellidoCliente").value = "";
}

// Define la función NuevoRegistro para realizar alguna acción relacionada con la creación de un nuevo cliente.
function NuevoRegistroCliente() {
    // Cambia el título del modal para reflejar que se está creando un nuevo cliente.
    $("#ModalTitulo").text("Nuevo Cliente");
    // // Llama a la función LimpiarModal() para limpiar los campos del modal.
    // LimpiarModal();
    
}


// Define la función AbrirModalEditar para abrir un modal con los detalles de un cliente específico para su edición.
function AbrirModalEditar(clienteId) {
    // Mostrar un mensaje de confirmación antes de abrir el modal para editar el cliente.
    Swal.fire({
        title: "¿Editar cliente?",
        text: "¿Estás seguro de que deseas editar este cliente?",
        icon: "info",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, editar cliente"
    }).then((result) => {
        if (result.isConfirmed) {
            // Realizar una llamada AJAX para obtener los detalles del cliente y abrir el modal para su edición.
            $.ajax({
                // Especificar la URL a la que se enviará la solicitud AJAX.
                url: '/Clientes/ListadoClientes',
                // Definir los datos que se enviarán en la solicitud. En este caso, se envía el ID del cliente a editar.
                data: {
                    id: clienteId // Aquí se pasa el ID del cliente como parte de los datos de la solicitud.
                },
                // Especificar el tipo de solicitud HTTP que se realizará, en este caso, una solicitud POST.
                type: 'POST',
                // Indicar el tipo de datos que se espera recibir como respuesta, en este caso, un objeto JSON.
                dataType: 'json',
                // Definir una función que se ejecutará si la solicitud AJAX tiene éxito. La respuesta del servidor se pasa como argumento a esta función.
                success: function(clientes) {
                    // Obtener el primer cliente del array recibido.
                    let cliente = clientes[0];

                    // Establecer los valores del cliente en los campos correspondientes del modal.
                    document.getElementById("clienteID").value = clienteId;
                    document.getElementById("nombreCliente").value = cliente.nombre;
                    document.getElementById("apellidoCliente").value = cliente.apellido;

                    // Cambiar el título del modal para reflejar que se está editando un cliente.
                    $("#ModalTitulo").text("Editar Cliente");

                    // Mostrar el modal para editar el cliente.
                    $("#ModalCliente").modal("show");
                },
                // Definir una función que se ejecutará si la solicitud AJAX falla.
                error: function(xhr, status) {
                    console.log('Disculpe, existió un problema al consultar el registro para ser modificado.');
                }
            });
        }
    });
}




// Define la función GuardarCliente para guardar los datos ingresados en el formulario del modal.
function GuardarCliente() {
    // Obtiene el ID del cliente desde el formulario del modal.
    let clienteId = document.getElementById("clienteID").value;
    // Obtiene el nombre del cliente desde el formulario del modal.
    let nombreCliente = document.getElementById("nombreCliente").value;
    // Obtiene el apellido del cliente desde el formulario del modal.
    let apellidoCliente = document.getElementById("apellidoCliente").value;

    // Realiza una llamada AJAX para verificar si el cliente ya existe.
    $.ajax({
        // Especifica la URL a la que se enviará la solicitud AJAX para verificar si el cliente ya existe.
        url: '/Clientes/VerificarExistenciaCliente',
        // Define los datos que se enviarán en la solicitud. En este caso, se envían el nombre y apellido del cliente.
        data: {
            nombre: nombreCliente,
            apellido: apellidoCliente
        },
        // Especifica el tipo de solicitud HTTP que se realizará, en este caso, una solicitud POST.
        type: 'POST',
        // Indica el tipo de datos que se espera recibir como respuesta, en este caso, un objeto JSON.
        dataType: 'json',
        // Define una función que se ejecutará si la solicitud AJAX tiene éxito. La respuesta del servidor se pasa como argumento a esta función.
        success: function(resultado) {
            // Si el resultado es "true", significa que el cliente ya existe.
            if (resultado) {
                // Muestra un mensaje de error indicando que el cliente ya existe.
                Swal.fire("¡Error!", "El cliente ya existe.", "error");
            } else {
                // Si el cliente no existe, procede a agregarlo.
                agregarCliente(clienteId, nombreCliente, apellidoCliente);
            }
        },
        // Define una función que se ejecutará si la solicitud AJAX falla.
        error: function(xhr, status) {
            console.log('Disculpe, existió un problema al verificar la existencia del cliente');
        }
    });
}

// Función para agregar el cliente si no existe.
function agregarCliente(clienteId, nombreCliente, apellidoCliente) {
    // Mostrar un mensaje de confirmación antes de agregar el cliente.
    Swal.fire({
        title: "¿Desea agregar al cliente?",
        icon: "info",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        cancelButtonText: "Cancelar",
        confirmButtonText: "Sí, agregar"
    }).then((result) => {
        if (result.isConfirmed) {
            // Realiza una llamada AJAX para guardar los datos en el servidor.
            $.ajax({
                url: '/Clientes/GuardarCliente',
                data: {
                    clienteId: clienteId,
                    nombre: nombreCliente,
                    apellido: apellidoCliente
                },
                type: 'POST',
                dataType: 'json',
                success: function(resultado) {
                    // Vuelve a cargar el listado de clientes después de guardar el registro.
                    ListadoClientes();
                    // Muestra un mensaje de éxito después de guardar el cliente.
                    Swal.fire("¡Agregado con éxito!", "Se ha guardado con éxito un nuevo cliente.", "success");
                },
                error: function(xhr, status) {
                    console.log('Disculpe, existió un problema al guardar el cliente');
                }
            });
        }
    });
}



// Define la función EliminarRegistro para eliminar un registro de cliente específico.
function EliminarRegistro(clienteId) {
    // Mostrar un mensaje de confirmación antes de eliminar el registro.
    Swal.fire({
        title: "¿Estás seguro que desea eliminar al cliente?",
        text: "¡No podrás revertir esto!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, eliminarlo"
    }).then((result) => {
        if (result.isConfirmed) {
            // Realiza una llamada AJAX para eliminar el registro del servidor.
            $.ajax({
                // Especifica la URL a la que se enviará la solicitud AJAX.
                url: '../../Clientes/EliminarCliente',
                // Define los datos que se enviarán en la solicitud. En este caso, se envía el ID del cliente a eliminar.
                data: {
                    clienteId: clienteId
                },
                // Especifica el tipo de solicitud HTTP que se realizará, en este caso, una solicitud POST.
                type: 'POST',
                // Indica el tipo de datos que se espera recibir como respuesta, en este caso, un objeto JSON.
                dataType: 'json',
                // Define una función que se ejecutará si la solicitud AJAX tiene éxito. La respuesta del servidor se pasa como argumento a esta función.
                success: function(resultado) {
                    // Vuelve a cargar el listado de clientes después de eliminar el registro.
                    ListadoClientes();
                    // Muestra un mensaje de éxito después de eliminar el registro.
                    Swal.fire("¡Eliminado!", "El cliente ha sido eliminado.", "success");
                },
                // Define una función que se ejecutará si la solicitud AJAX falla.
                error: function(xhr, status) {
                    console.log('Disculpe, existió un problema al eliminar el registro.');
                }
            });
        }
    });
}
