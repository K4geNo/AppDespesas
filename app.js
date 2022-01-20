class Despesa {
    constructor(ano, mes, dia, tipo, descricao, valor) {
        this.ano = ano
        this.mes = mes
        this.dia = dia
        this.tipo = tipo
        this.descricao = descricao
        this.valor = valor
    }

    validarDados() {
        for(let i in this) {
            if(this[i] == undefined || this[i] == '' || this[i] == null) {
                return false
            }
        }
        return true
    }
}

class Bd {
    constructor() {
        let id = localStorage.getItem('id')

        if(id === null) {
            localStorage.setItem('id', 0)
        }
    }

    getProximoId() {
        let proximoId = localStorage.getItem('id')
        return parseInt(proximoId) + 1
    }

    gravar(despes4) {
        let id = this.getProximoId()

        localStorage.setItem(id, JSON.stringify(despes4))

        localStorage.setItem('id', id)
    }

    recuperarTodosRegistros() {
        // Array de despesas
        let despesas = Array()

        let id = localStorage.getItem('id')


        //recuperar todas as despesas cadastradas em LocalStorage
        for(let i = 1; i <= id; i++) {
            //Recuperar Despesa
            let despesa = JSON.parse(localStorage.getItem(i))
            
            //Verificar se existe a possibilidade de haver índices que foram pulados/removidos
            if(despesa === null) {
                continue
            }
            despesa.id = i
            despesas.push(despesa)
        }
        return despesas
    }
    pesquisar(despesa) {
        let despesasFilter = Array()
        despesasFilter = this.recuperarTodosRegistros()

        //ano
        if(despesa.ano != '') {
            console.log('Ano')
            despesasFilter = despesasFilter.filter(p => p.ano == despesa.ano)
        }
        //mes
        if(despesa.mes != '') {
            console.log('mes')
            despesasFilter = despesasFilter.filter(p => p.mes == despesa.mes)
        }

        //dia
        if(despesa.dia != '') {
            console.log('Dia')
            despesasFilter = despesasFilter.filter(p => p.dia == despesa.dia)
        }

        //tipo
        if(despesa.tipo != '') {
            console.log('Tipo')
            despesasFilter = despesasFilter.filter(p => p.tipo == despesa.tipo)
        }

        //descricao
        if(despesa.descricao != '') {
            console.log('descrição')
            despesasFilter = despesasFilter.filter(p => p.descricao == despesa.descricao)
        }

        //valor
        if(despesa.valor != '') {
            console.log('valor')
            despesasFilter = despesasFilter.filter(p => p.valor == despesa.valor)
        }

        return despesasFilter
    }
    remover(id) {
        localStorage.removeItem(id)
    }
}

let bd = new Bd()

function cadastrarDespesa() {

    let ano = document.getElementById("ano")
    let mes = document.getElementById("mes")
    let dia = document.getElementById("dia")
    let tipo = document.getElementById("tipo")
    let descricao = document.getElementById("descricao")
    let valor = document.getElementById("valor")

    let despesa = new Despesa(
        ano.value,
        mes.value,
        dia.value,
        tipo.value,
        descricao.value,
        valor.value
    )

    if(despesa.validarDados()) {
        bd.gravar(despesa);

        //Resetar campos
        ano.value = ''
        mes.value = ''
        dia.value = ''
        tipo.value = ''
        descricao.value = ''
        valor.value = ''
    }
}

function carregaListaDespesa(despesas = Array(), filtro = false) {

    if(despesas.length == 0 && filtro == false) {
        despesas = bd.recuperarTodosRegistros()
    }

    
    //Selecionando o elemento tbody da tabela
    let listaDespesas = document.getElementById("listaDespesas")
    listaDespesas.innerHTML = ''

    //Percorrer o array despesas, listando cada despesa de forma dinamica
    despesas.forEach(function(p) {
        //Criando tr
        let linha = listaDespesas.insertRow()

        linha.insertCell(0).innerHTML = `${p.dia}/${p.mes}/${p.ano}` 
        //Ajustar tipo
        switch(p.tipo) {
            case '1': p.tipo = 'Alimentação'
                break
            case '2': p.tipo = 'Educação'
                break
            case '3': p.tipo = 'Lazer'
                break
            case '4': p.tipo = 'Saúde'
                break
            case '5': p.tipo = 'Transporte'
                break
        }
        linha.insertCell(1).innerHTML = p.tipo
        linha.insertCell(2).innerHTML = p.descricao
        linha.insertCell(3).innerHTML = p.valor

        //Criar o botão de exclusão
        let btn = document.createElement("button")
        btn.className = 'btn btn-danger'
        btn.innerHTML = '<i class="bi bi-x"></i>'
        btn.id = `id_despesa_${p.id}`
        btn.onclick = function () {
            //Remover a despesa
            let id = this.id.replace('id_despesa_', '')
            bd.remover(id)
            window.location.reload()
        }
        linha.insertCell(4).appendChild(btn)

        console.log(p)
    })
}

function pesquisarDespesa() {
    let ano = document.getElementById('ano').value
    let mes = document.getElementById('mes').value
    let dia = document.getElementById('dia').value
    let tipo = document.getElementById('tipo').value
    let descricao = document.getElementById('descricao').value
    let valor = document.getElementById('valor').value

    let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor)

    let despesas = bd.pesquisar(despesa)

    carregaListaDespesa(despesas, true)
}