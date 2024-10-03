
$(document).ready(function () {
    //Adiciona o patterner ao campo Cep
    $("input[name=cep]").mask("00000-000");
    $("input[name=numero]").mask("#");
    
    $("form").on('submit', function (event) {
        //Interompe o evento
        event.stopPropagation();
        
        event.prevetDefault();
    });
    $("input[name=cep]").on("keyup", function (event) {
        let cep = $("input[name=cep]").val();
        cep = cep.replace("-", "");
        if (cep.length == 8) {
            $("input[name=cep]").removeClass("is-invalid");
            
            $.ajax("https://viacep.com.br/ws/" + cep + "/json")
            .done(function (data) {
                let resposta = JSON.parse(data);
                if (resposta.erro) {
                    $("input[name=cep]").addClass("is-invalid");
                    return; // sai da função
                }
                // só preenche os campos após receber
                // a resposta sem erros
                $("input[name=rua]").val(resposta.logradouro);
                $("input[name=complemento").val(resposta.complemento);
                $("input[name=bairro]").val(resposta.bairro);
                $("select[name=estado]").val(resposta.uf);
                $("input[name=cidade]").val(resposta.localidade);
            });
        }
    });
    
});

$(document).ready(function() {
    const urlEstados = 'https://servicodados.ibge.gov.br/api/v1/localidades/estados';
    
    // Carregar os estados na inicialização
    $.getJSON(urlEstados, function(data) {
        data.sort(function(a, b) {
            return a.nome.localeCompare(b.nome);
        });
        
        data.forEach(function(estado) {
            $('#estado').append(`<option value="${estado.sigla}">${estado.nome}-${estado.sigla}</option>`);
        });
    });
    
    // Carregar cidades com base no estado selecionado
    $('#estado').on('change', function() {
        let estadoId = $(this).val(); // Pega o ID do estado selecionado
        
        if (estadoId) {
            const urlCidades = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estadoId}/municipios`;
            
            $.getJSON(urlCidades, function(data) {
                $('#cidade').empty(); // Limpa o select de cidades
                $('#cidade').append(`<option value="">Selecione a cidade</option>`); // Adiciona a opção padrão
                
                data.sort(function(a, b) {
                    return a.nome.localeCompare(b.nome);
                });
                
                data.forEach(function(cidade) {
                    $('#cidade').append(`<option value="${cidade.nome}">${cidade.nome}</option>`);
                });
            });
        } else {
            $('#cidade').empty(); // Limpa o select de cidades caso não haja estado selecionado
            $('#cidade').append(`<option value="">Primeiro selecione o estado</option>`);
        }
    });
});
