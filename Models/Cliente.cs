using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CasaFerndandez.Models;

public class Cliente
{
    [Key]
    public int ClienteId { get; set; }
    public string? Nombre { get; set; }  
    public string? Apellido { get; set; }  

}
