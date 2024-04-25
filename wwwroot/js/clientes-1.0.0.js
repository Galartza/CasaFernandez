window.onload = ListadoClientes();

function ListadoClientes(){
    $.ajax({
        url: '../../Clientes/ListadoClientes',
        data: {},
        type: 'POST',
        dataType: 'json',
        success: function (clientes) {
            let contenidoTabla = ``;

            $.each(clientes, function (index, cliente) {  
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

            $("#tbody-clientes").html(contenidoTabla);
        },
        error: function (xhr, status) {
            console.log('Disculpe, existió un problema al cargar el listado');
        }
    });
}

function LimpiarModal(){
    $("#nombreCliente").val('');
    $("#apellidoCliente").val('');
}

function NuevoRegistro(){
    $("#ModalTitulo").text("Nuevo Cliente");
    LimpiarModal();
}

function AbrirModalEditar(clienteId){
    $.ajax({
        url: '../../Clientes/ListadoClientes',
        data: { id: clienteId },
        type: 'POST',
        dataType: 'json',
        success: function (clientes) {
            let cliente = clientes[0];

            $("#ModalTitulo").text("Editar Cliente");
            $("#nombreCliente").val(cliente.nombre);
            $("#apellidoCliente").val(cliente.apellido);
            $("#ModalCliente").modal("show");
        },
        error: function (xhr, status) {
            console.log('Disculpe, existió un problema al consultar el registro para ser modificado.');
        }
    });
}

function GuardarCliente(){
    var clienteId = $("#clienteId").val();
    var nombreCliente = $("#nombreCliente").val();
    var apellidoCliente = $("#apellidoCliente").val();

    $.ajax({
        url: '../../Clientes/GuardarCliente',
        data: { clienteId: clienteId, nombre: nombreCliente, apellido: apellidoCliente },
        type: 'POST',
        dataType: 'json',
        success: function (response) {
            ListadoClientes();
            $('#ModalCliente').modal('show');
        },
        error: function (xhr, status) {
            console.log('Disculpe, existió un problema al guardar el cliente');
        }
    });
}

function EliminarRegistro(clienteId){
    $.ajax({
        url: '../../Clientes/EliminarCliente',
        data: { clienteId: clienteId },
        type: 'POST',
        dataType: 'json',
        success: function (resultado) {           
            ListadoClientes();
        },
        error: function (xhr, status) {
            console.log('Disculpe, existió un problema al eliminar el registro.');
        }
    });    
}
