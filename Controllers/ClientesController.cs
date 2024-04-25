using Microsoft.AspNetCore.Mvc;
using CasaFerndandez.Models;
using CasaFerndandez.Data;
using System.Linq;

namespace CasaFerndandez.Controllers
{
    public class ClientesController : Controller
    {
        private readonly ApplicationDbContext _context;

        public ClientesController(ApplicationDbContext context)
        {
            _context = context;
        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public JsonResult ListadoClientes(int? id)
        {
            var clientes = _context.Clientes.ToList();

            if (id != null)
            {
                clientes = clientes.Where(c => c.ClienteId == id).ToList();
            }

            return Json(clientes);
        }

        [HttpPost]
        public JsonResult GuardarCliente(int clienteId, string nombre, string apellido)
        {
            string resultado = "";

            if (!string.IsNullOrEmpty(nombre) && !string.IsNullOrEmpty(apellido))
            {
                if (clienteId == 0)
                {
                    var nuevoCliente = new Cliente
                    {
                        Nombre = nombre,
                        Apellido = apellido
                    };

                    _context.Clientes.Add(nuevoCliente);
                    _context.SaveChanges();
                }
                else
                {
                    var clienteEditar = _context.Clientes.FirstOrDefault(c => c.ClienteId == clienteId);
                    if (clienteEditar != null)
                    {
                        clienteEditar.Nombre = nombre;
                        clienteEditar.Apellido = apellido;
                        _context.SaveChanges();
                    }
                    else
                    {
                        resultado = "El cliente a editar no fue encontrado.";
                    }
                }
            }
            else
            {
                resultado = "El nombre y apellido del cliente son requeridos.";
            }

            return Json(resultado);
        }

        [HttpPost]
        public JsonResult EliminarCliente(int clienteId)
        {
            var clienteEliminar = _context.Clientes.FirstOrDefault(c => c.ClienteId == clienteId);
            if (clienteEliminar != null)
            {
                _context.Clientes.Remove(clienteEliminar);
                _context.SaveChanges();
            }

            return Json(true);
        }
    }
}
