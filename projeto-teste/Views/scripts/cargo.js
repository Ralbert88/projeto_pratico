$(document).ready(function() { 
  listarGrid();
  $('#salvar').click(salvar);

});

//funcao listar , sempre porta 5010, e http
function listarGrid() {
  $.get('http://localhost:5010/Cargo/Listar')
         .done(function(resposta){
        $('#grid tr').remove();
        carregarGrid(resposta);
      })
    .fail(function(erro, mensagem, excecao) {
      alert(mensagem + ': ' + excecao);
    });
}
//funcao de visualizar
function visualizar(id){
  $.ajax({
    type: 'GET',
    url: 'http://localhost:5010/Cargo/Visualizar?id='+id,
    contentType: "application/json; charset=utf-8",
    success: function(resposta){
      let visualizacao = resposta.id;
      visualizacao += '\n';
      visualizacao += resposta.nome;
      visualizacao += '\n';
      visualizacao += formatarSalario(resposta.salarioMinimo);
      visualizacao += '\n';
      visualizacao += formatarSalario(resposta.salarioMaximo);
      visualizacao += '\n';
      

      alert(visualizacao);
    },
    error: function(erro, mensagem, excecao){
      alert(mensagem + ': ' + excecao);
    }
  });
 
}

function formatarSalario(salario) {
  return 'R$ ' + salario.toFixed(2).toString().replace('.', ',');
}
function excluir(id){
  $.ajax({
    type: 'DELETE',
    url: 'http://localhost:5010/Cargo/Excluir',
    contentType: "application/json; charset=utf-8",
    data: JSON.stringify(id),
      success: function(resposta){
        listarGrid();
        alert(resposta);
      },
      error: function(erro, mensagem, excecao) {
        alert(mensagem + ': ' + excecao);
      }
      
    });
  }
  
  function editar(id) { // aqui vamos editar os dados 
    $.get('http://localhost:5010/Cargo/Visualizar?id='+id)
        .done(function(resposta) { 
            $('#id').val(resposta.id);
            $('#nome').val(resposta.nome);
            $('#tipo').val(resposta.tipo);
            $('#salarioMinimo').val(resposta.salarioMinimo);
            $('#salarioMaximo').val(resposta.salarioMaximo);
            $('#salvar').html('Editar');
        })
        .fail(function(erro, mensagem, excecao) { 
            alert(mensagem + ': ' + excecao);
        });
}

  function salvar(){
    var nome = $('#nome').val();
    var tipo = $('#tipo').val();
    var salario = $('#salarioMinimo').val();
    var salario2 = $('#salarioMaximo').val();
    var id;
    var metodo;
    var url;

    if($('#salvar').html() == 'Editar'){
        id = $('#id').val();
        metodo = 'PUT';
        url = 'http://localhost:5010/Cargo/Editar';
    }
    else{
        id = 0;
        metodo = 'POST'
        url = 'http://localhost:5010/Cargo/Cadastrar';
    }

    var cargo = {
        id: parseInt(id),
        nome: nome,
        tipo: tipo,
        salarioMinimo: parseFloat(salario),
        salarioMaximo: parseFloat(salario2),
        
    };

   $.ajax({
        type: metodo,
        url: url,
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(cargo),
        success: function(resposta) { 
            listarGrid();
            $('#id').val(0);
            $('#nome').val('');
            $('#tipo').val('');
            $('#salarioMinimo').val('');
            $('#salarioMaximo').val('');
            $('#salvar').html('Salvar');

            alert(resposta);
        },
        error: function(erro, mensagem, excecao) { 
            alert(mensagem + ': ' + excecao);
        }
    });
}

function carregarGrid(resposta){
  $('#grid tr').remove();
      for(i = 0; i < resposta.length; i++){
        let dados = resposta[i];
        $('#grid').append($('<tr></tr>').attr('id', dados.id));
        $('#' + dados.id).append($('<td></td>').html(dados.id));
        $('#' + dados.id).append($('<td></td>').html(dados.nome));
        $('#' + dados.id).append($('<td></td>').html(dados.tipo));
        $('#' + dados.id).append($('<td></td>').html(formatarSalario(dados.salarioMinimo)));
        $('#' + dados.id).append($('<td></td>').html(formatarSalario(dados.salarioMaximo)));
        $('#' + dados.id).append($('<td></td>').html('<button type=\"button\" onclick=\"visualizar('+ dados.id +')\">Visualizar</button> <button type=\"button\" onclick=\"editar('+ dados.id +')\">Editar</button> <button type=\"button\" onclick=\"excluir('+ dados.id +')\">Excluir</button>'));
      }
}