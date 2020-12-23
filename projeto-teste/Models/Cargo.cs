using System;
using System.Collections.Generic;

namespace projeto_teste.Models
{
    public partial class Cargo
    {
        public Cargo()
        {
            Colaborador = new HashSet<Colaborador>();
        }

        public int Id { get; set; }
        public string Nome { get; set; }
        public string Tipo { get; set; }
        public float SalarioMinimo { get; set; }
        public float SalarioMaximo { get; set; }
        public bool Excluido {get; set; }

        public virtual ICollection<Colaborador> Colaborador { get; set; }
    }
}
