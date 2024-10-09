$(document).ready(function () {
    // Variável global "resposta" que armazena
    // a resposta JSON da consulta do CEP
    // digitado pelo usuário.
    let resposta = '';
    
    
    
    //Adiciona o patterner ao campo Cep
    $("input[name=cep]").mask("00000-000");
    $("input[name=numero]").mask("#");
    
    
    $("form").on('submit', function (event) {
        //Interompe o evento
        event.stopPropagation();
        
        event.prevetDefault();
    });
    
    $("input[name=tel]").mask("(00) 00000-0000")
    $("input[name=tel]").on("keyup",function(){
        let tel= $("input[name=tel]").val();
        tel = tel.replace(/[\D]/g, '');
        if(tel.length <11 ){
            maskara = "(00) 0000-00000"
        }
        else{
            maskara = "(00) 00000-0000"
        }
        $("input[name=tel").mask(maskara)
        
    });
    
    
    $("input[name=cep]").on("keyup", function (event) {
        let cep = $("input[name=cep]").val();
        cep = cep.replace("-", "");
        if (cep.length == 8) {
            $("input[name=cep]").removeClass("is-invalid");
            
            $.ajax("https://viacep.com.br/ws/" + cep + "/json")
            .done(function (data) {
                resposta = JSON.parse(data);
                if (resposta.erro) {
                    $("input[name=cep]").addClass("is-invalid");
                    return; // sai da função
                }
                // só preenche os campos após receber
                // a resposta sem erros
                $("input[name=rua]").val(resposta.logradouro);
                if(resposta.logradouro !== ""){
                    $("input[name=rua]").prop("disabled", true);
                }
                $("input[name=complemento").val(resposta.complemento);
                if(resposta.complemento !== ""){
                    $("input[name=coplemento]").prop("disabled", true);
                }
                $("input[name=bairro]").val(resposta.bairro);
                if(resposta.bairro !== ""){
                    $("input[name=bairro]").prop("disabled", true);
                }
                $("select[name=estado]").val(resposta.uf);
                $("select[name=estado]").trigger("change");
                
            });
        }
    });
    
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
                
                // Popula o campo "Cidade" com a cidade que o CEP digitado
                // pelo usuário pertence.
                $("select[name=cidade]").val(resposta.localidade);
                
            });
            
        } else {
            $('#cidade').empty(); // Limpa o select de cidades caso não haja estado selecionado
            $('#cidade').append(`<option value="">Primeiro selecione o estado</option>`);
        }
    });
});
