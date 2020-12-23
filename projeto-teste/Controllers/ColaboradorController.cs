using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using projeto_teste.Models;

namespace projeto_teste.Controllers
{
    [Route("[controller]/[action]")]
    [ApiController]
    public class ColaboradorController : ControllerBase
    {
        private BDContexto contexto;
        
        public ColaboradorController(BDContexto bdContexto)
        {
            contexto = bdContexto;
        }
        
        [HttpGet]
        public double CalcularValorPago(double horaExtra, double valorHora)
        {
            return horaExtra * valorHora;
        }

        [HttpGet]
        public List<Colaborador> Listar()
        {
            return contexto.Colaborador.Include(c => c.IdCargoNavigation).OrderBy(c => c.Nome)
            .Select(c => new Colaborador 
            { 
                Id = c.Id,
                Nome = c.Nome,
                Salario = c.Salario,
                IdCargoNavigation = new Cargo 
                { 
                    Nome = c.IdCargoNavigation.Nome 
                } 
            }).ToList();
        }

        [HttpGet]
        public List<Colaborador> ListarPorFaixa(double valorInicial, double valorFinal)
        {
            return contexto.Colaborador.Where(c => c.Salario >= valorInicial && c.Salario <= valorFinal)
            .Select(c => new Colaborador 
            { 
                Id = c.Id,
                Nome = c.Nome,
                Salario = c.Salario,
                IdCargoNavigation = new Cargo 
                { 
                    Nome = c.IdCargoNavigation.Nome 
                } 
            }).ToList();
        }

        [HttpDelete]
        public string Excluir([FromBody]int id)
        {
            Colaborador dados = contexto.Colaborador.FirstOrDefault(p => p.Id == id);

            if (dados == null)
            {
                return "Não foi encontrado Colaborador para o ID informado!";
            }
            else
            {
                contexto.Remove(dados);
                contexto.SaveChanges();
            
                return "Colaborador excluído com sucesso!";
            }
        }

        [HttpPost]
        public string Cadastrar([FromBody]Colaborador dados)
        {
            contexto.Add(dados);
            contexto.SaveChanges();
            
            return "Colaborador cadastrado com sucesso!";
        }

        // editar
    [HttpPut]
        public string Alterar([FromBody]Colaborador dados)
        {
            contexto.Update(dados);
            contexto.SaveChanges();
            
            return "Colaborador editado com sucesso!";
        }
        // editar

        [HttpGet]
        public Colaborador Visualizar(int id)
        {
            return contexto.Colaborador.Include(p => p.IdCargoNavigation)
            .Select(c => new Colaborador 
            { 
                Id = c.Id,
                Nome = c.Nome,
                Salario = c.Salario,
                IdCargo = c.IdCargo,
                IdCargoNavigation = new Cargo 
                { 
                    Nome = c.IdCargoNavigation.Nome 
                } 
            }).FirstOrDefault(p => p.Id == id);
        }
    }
}
