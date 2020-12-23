using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using projeto_teste.Models;

namespace projeto_teste.Controllers
{
    [Route("[controller]/[action]")]
    [ApiController]
    public class CargoController : ControllerBase
    {
        private BDContexto contexto;
        
        public CargoController(BDContexto bdContexto)
        {
            contexto = bdContexto;
        }
        
        [HttpGet]
        public List<Cargo> Listar()
        {
            return contexto.Cargo.Where( p => p.Excluido == false).OrderBy(p => p.Nome).ToList();
        }
        
        //Listar apenas desenvolvedores.
        [HttpGet]
        public List<Cargo> ListarDev()
        {
            return contexto.Cargo.Where(c => c.Tipo == "D").ToList();
        }
        
        //Retornar nomes.
        [HttpGet]
        public List<string> ListarNome()
        {
            return contexto.Cargo.OrderBy(c => c.Nome).Select(c => c.Nome).ToList();
        }

        //Retornar o maior salário
        [HttpGet]
        public double MaiorSalario()
        {
            return contexto.Cargo.Max(c => c.SalarioMaximo);
        }
        

        //Excluir dados 
       [HttpDelete]
        public string Excluir([FromBody]int id)
        {
            try
             {
                List<Colaborador> colaboradores = contexto.Colaborador.Where (p => p.IdCargo == id).ToList();

                if (colaboradores.Count() == 0) 
                {
                Cargo dados = contexto.Cargo.FirstOrDefault(p => p.Id == id);

            contexto.Remove(dados);
            contexto.SaveChanges();                

            return "Cargo excluido com sucesso!";
            }
            else
            {
                return "Cargo não pode ser excluido, existem colaboradores vinculados a ele!";
            }
             }
            catch (System.Exception ex)
            {
                return ex.Message;
            }
            
        }

        [HttpDelete]
        public string ExcluirLogico([FromBody]int id)
        {
            try
             {
               Cargo dados = contexto.Cargo.FirstOrDefault(p => p.Id == id);
               dados.Excluido = true;
                dados.Excluido = (true);
                contexto.Update(dados);
                contexto.SaveChanges();

                return "Cargo Excluido com sucesso!";

             }
            catch (System.Exception ex)
            {
                return ex.Message;
            }
        }

        [HttpPut]
        public string Editar([FromBody]Cargo dados)
        {
            contexto.Update(dados);
            contexto.SaveChanges();
            
            return "Cargo editado com sucesso!";
        }

        //visualizar dados no alert
        [HttpGet]
        public Cargo Visualizar(int id)
        {
            return contexto.Cargo.Where(p=> p.Id == id)
            .Select(c => new Cargo 
            { 
                Id = c.Id,
                Nome = c.Nome,
                Tipo = c.Tipo,
                SalarioMinimo = c.SalarioMinimo,
                SalarioMaximo = c.SalarioMaximo,
            }).FirstOrDefault();
        }

        //Listar por faixa do salário mínimo
        [HttpGet]
        public List<Cargo> ListarPorFaixaMinimo(double valorInicial, double valorFinal)
        {
            return contexto.Cargo.Where(c => c.SalarioMinimo >= valorInicial && c.SalarioMinimo <= valorFinal).ToList();
        }
        [HttpPost]
        public string Cadastrar ([FromBody]Cargo dados)
         {
            contexto.Add(dados);
            contexto.SaveChanges();

            return "Cargo cadastrado com sucesso!";
        }
    }

             
        }


