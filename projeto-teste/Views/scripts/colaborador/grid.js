$(document).ready(function() {
    listarGrid();
    $('#filtrar').click(filtrar);
});

function listarGrid(){
    $.get('http://localhost:5010/Colaborador/Listar')
        .done(function(resposta) { 
            carregarGrid(resposta);
        })
        .fail(function(erro, mensagem, excecao) { 
            alert(mensagem + ': ' + excecao);
        });
}

function filtrar(){
    var valorInicial = $('#valorInicial').val();
    var valorFinal = $('#valorFinal').val();

    var erro = false;

    if (valorInicial == '' || valorFinal == '') {
        alert('Preencha os campos!');
        erro = true;
    }

    if (valorInicial >= valorFinal) {
        alert('O valor inicial deve ser menor que o final!');
        erro = true;
    }

    if (!erro) {
        $.get('http://localhost:5010/Colaborador/ListarPorFaixa?valorInicial='+valorInicial+'&valorFinal='+valorFinal)
        .done(function(resposta) { 
            carregarGrid(resposta);
        })
        .fail(function(erro, mensagem, excecao) { 
            alert(mensagem + ': ' + excecao);
        });
    }
}

function excluir(id) {
    $.ajax({
        type: 'DELETE',
        url: 'http://localhost:5010/Colaborador/Excluir',
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(id),
        success: function(resposta) { 
            listarGrid();
            alert(resposta);
        },
        error: function(erro, mensagem, excecao) { 
            alert(mensagem + ': ' + excecao);
        }
    });
}

function visualizar(id) {
    $.get('http://localhost:5010/Colaborador/Visualizar?id='+id)
        .done(function(resposta) { 
            let visualizacao = resposta.id;
            visualizacao += '\n';
            visualizacao += resposta.nome;
            visualizacao += '\n';
            visualizacao += resposta.idCargoNavigation.nome;
            visualizacao += '\n';
            visualizacao += formatarSalario(resposta.salario);
            alert(visualizacao);
        })
        .fail(function(erro, mensagem, excecao) { 
            alert(mensagem + ': ' + excecao);
        });
}

function editar(id) { // aqui vamos editar os dados 
    $.get('http://localhost:5010/Colaborador/Visualizar?id='+id)
        .done(function(resposta) { 
            $('#id').val(resposta.id);
            $('#nome').val(resposta.nome);
            $('#salario').val(resposta.salario);
            $('#cargo').val(resposta.idCargo);
            $('#salvar').html('Editar');
        })
        .fail(function(erro, mensagem, excecao) { 
            alert(mensagem + ': ' + excecao);
        });
}


function carregarGrid(resposta){
    $('#grid tr').remove();
    for(i = 0; i < resposta.length; i++) {
        let dados = resposta[i];
        
        $('#grid').append($('<tr></tr>').attr('id', dados.id));
        
        $('#' + dados.id).append($('<td></td>').html(dados.id));
        $('#' + dados.id).append($('<td></td>').html(dados.nome));
        $('#' + dados.id).append($('<td></td>').html(dados.idCargoNavigation.nome));
        $('#' + dados.id).append($('<td></td>').html(formatarSalario(dados.salario)));
        $('#' + dados.id).append($('<td></td>').html('<button type=\"button\" onclick=\"visualizar('+ dados.id +')\">Visualizar</button> <button type=\"button\" onclick=\"editar('+ dados.id +')\">Editar</button> <button type=\"button\" onclick=\"excluir('+ dados.id +')\">Excluir</button>'));
    }
}

function formatarSalario(salario){
    return 'R$ ' + salario.toFixed(2).toString().replace('.', ',');
}