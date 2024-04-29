using Microsoft.AspNetCore.Mvc;
using CasaFerndandez.Models;
using CasaFerndandez.Data;


namespace CasaFerndandez.Controllers;

public class ClientesController : Controller
{
    private ApplicationDbContext _context;

    public ClientesController(ApplicationDbContext context)
    {
        _context = context;
    }

    // Acción para mostrar la vista principal de clientes.
    public IActionResult Index()
    {
        return View();
    }

    // Acción para obtener el listado de clientes.
    public JsonResult ListadoClientes(int? id)
    {
        // Obtiene todos los clientes de la base de datos.
        var clientes = _context.Clientes.ToList();

        // Si se proporciona un ID, filtra los clientes por ese ID.
        if (id != null)
        {
            clientes = clientes.Where(c => c.ClienteId == id).ToList();
        }

        // Retorna los clientes en formato JSON.
        return Json(clientes);
    }

    // Acción para guardar un cliente.
    public JsonResult GuardarCliente(int clienteId, string nombre, string apellido)
    {
        string resultado = "";

        // Verifica que el nombre y apellido del cliente no estén vacíos.
        if (!string.IsNullOrEmpty(nombre) && !string.IsNullOrEmpty(apellido))
        {
            nombre = nombre.ToUpper();
            apellido = apellido.ToUpper();
            // Si el ID del cliente es 0, significa que se está creando un nuevo cliente.
            if (clienteId == 0)
            {
                var existeCliente = _context.Clientes.Where(c => c.Nombre == nombre && c.Apellido == apellido).Count();
                if (existeCliente == 0)
                {
                    var nuevoCliente = new Cliente
                    {
                        Nombre = nombre,
                        Apellido = apellido
                    };

                    // Agrega el nuevo cliente al contexto y guarda los cambios en la base de datos.
                    _context.Add(nuevoCliente); // Aquí debe ser "nuevoCliente" en lugar de "clienteId"
                    _context.SaveChanges();
                }
                else
                {
                    resultado = "YA EXISTE UN CLIENTE CON ESE NOMBRE";
                }
            }

            else // Si el ID del cliente no es 0, se está editando un cliente existente.
            {
                // Busca el cliente en la base de datos por su ID.
                var clienteEditar = _context.Clientes.Where(c => c.ClienteId == clienteId).FirstOrDefault();
                if (clienteEditar != null) // Si se encuentra el cliente, actualiza sus datos.
                {
                    var existeCliente = _context.Clientes.Where(c => c.Nombre == nombre && c.Apellido == apellido && c.ClienteId != clienteId).Count();
                    if (existeCliente == 0)
                    {
                        clienteEditar.Nombre = nombre;
                        clienteEditar.Apellido = apellido;
                        _context.SaveChanges();
                    }

                }
                else // Si no se encuentra el cliente, establece un mensaje de error.
                {
                    resultado = "El cliente a editar no fue encontrado.";
                }
            }
        }
        else // Si el nombre o apellido del cliente están vacíos, establece un mensaje de error.
        {
            resultado = "El nombre y apellido del cliente son requeridos.";
        }

        // Retorna el resultado en formato JSON.
        return Json(resultado);
    }

    // Acción para eliminar un cliente.
    [HttpPost]
    public JsonResult EliminarCliente(int clienteId)
    {
        // Busca el cliente en la base de datos por su ID.
        var clienteEliminar = _context.Clientes.FirstOrDefault(c => c.ClienteId == clienteId);
        if (clienteEliminar != null) // Si se encuentra el cliente, lo elimina de la base de datos.
        {
            _context.Clientes.Remove(clienteEliminar);
            _context.SaveChanges();
        }

        // Retorna true para indicar que la eliminación fue exitosa.
        return Json(true);
    }
    // Acción para verificar la existencia de un cliente.
    [HttpPost]
    public JsonResult VerificarExistenciaCliente(string nombre, string apellido)
    {
        // Verifica si existe un cliente con el nombre y apellido proporcionados en la base de datos.
        var existeCliente = _context.Clientes.Any(c => c.Nombre.ToUpper() == nombre.ToUpper() && c.Apellido.ToUpper() == apellido.ToUpper());

        // Retorna true si el cliente existe, false si no existe.
        return Json(existeCliente);
    }

}

