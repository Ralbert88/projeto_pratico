$(document).ready(function() {
    listarCargo();
    $('#salvar').click(salvar);
});

function listarCargo(){
    $.get('http://localhost:5010/Cargo/Listar')
        .done(function(resposta) { 
            for(i = 0; i < resposta.length; i++) {
                $('#cargo').append($('<option></option>').val(resposta[i].id).html(resposta[i].nome));
            }
        })
        .fail(function(erro, mensagem, excecao) { 
            alert(mensagem + ': ' + excecao);
        });
}

function salvar(){
    var nome = $('#nome').val();
    var salario = $('#salario').val();
    var idCargo = $('#cargo').val();
    var id;
    var metodo;
    var url;

    if($('#salvar').html() == 'Editar'){
        id = $('#id').val();
        metodo = 'PUT';
        url = 'http://localhost:5010/Colaborador/Alterar';
    }
    else{
        id = 0;
        metodo = 'POST'
        url = 'http://localhost:5010/Colaborador/Cadastrar';
    }

    var colaborador = {
        id: parseInt(id),
        nome: nome,
        salario: parseFloat(salario),
        idCargo: parseInt(idCargo)
    };

   $.ajax({
        type: metodo,
        url: url,
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(colaborador),
        success: function(resposta) { 
            listarGrid();
            $('#id').val(0);
            $('#nome').val('');
            $('#salario').val('');
            $('#cargo').val(0);
            $('#salvar').html('Salvar');

            alert(resposta);
        },
        error: function(erro, mensagem, excecao) { 
            alert(mensagem + ': ' + excecao);
        }
    });
}