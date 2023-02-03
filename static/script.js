var url = "http://127.0.0.1:5001/cars"
var editMode = false

window.onload = getCars()

document.getElementById('formAdd').onsubmit = (e) => {
e.preventDefault()
postCar()
}

// Função para remover o form de edição, caso ele exista, do dom.
function removeEditFields() { 
    editMode = false // Desative o modo edição
    let popEdit = document.getElementById('popEdit')
    popEdit ? document.body.removeChild(popEdit) : null
}

// Requisição GET para recuperar todos os contatos
function getCars(){
    fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(response => response.json())
    .then(json => {
        console.log("json", json)
        document.getElementById('cars').innerHTML = ""
        if (json.cars) {
            json.cars.forEach(car => {
                document.getElementById('cars').innerHTML += `<p>Modelo: ${car['modelo']}  Marca: ${car['marca']}  Ano: ${car['ano']}  Observacao: ${car['observacao']}  Valor: ${car['valor']}  Status: ${car['status']}  <button onclick='showUpdateFields(${car['id']})'>Editar </button><button onclick='deleteCar(${car['id']})'>Deletar </button></p>`
            });
        } else {
            document.getElementById('cars').innerHTML = "Não há nenhum carro na lista!"
        }
        
    })
    .catch(error => console.error(error))
    removeEditFields()
}

// Requisição POST para adicionar um contato na lista no servidor
function postCar(){
    const modelo = document.getElementById('modelo');
    const marca = document.getElementById('marca');
    const ano = document.getElementById('ano');
    const observacao = document.getElementById('observacao');
    const valor = document.getElementById('valor');
    const status = document.getElementById('status');

    const data = {"modelo":modelo.value,"marca":marca.value,"ano":ano.value,"observacao":observacao.value,"valor":valor.value,"status":status.value}

    // Usando o framework axios
    // axios.post(url,{'name':name.value,"phone":phone.value})
    // .then(response => {
    //     console.log(response)
    // })
    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(json => {
        console.log("Carro adicionado: ", json)
        getCars()
    })
    .catch(error => console.error(error));
    modelo.value = ""
    marca.value = ""
    ano.value = ""
    observacao.value = ""
    valor.value = ""
    status.value = ""
}

// Função chamada ao clicar no botão para editar um contato, cria e exibe os campos para editar o contato.
function showUpdateFields(id){
    if(!editMode) { // Se ele não estiver em modo de edição
        editMode = true // Ative o modo edição
        
        let popEdit = document.createElement('div')
        popEdit.setAttribute('id', 'popEdit')

        let container = document.createElement('div')
        container.setAttribute('id', 'containerPop')

        let title = document.createElement('p')
        title.setAttribute('id', 'title')
        title.innerText = "Atualize seu carro"

        let inputModelo = document.createElement('input')
        inputModelo.type = "text";
        inputModelo.setAttribute('name', 'updateModelo')
        inputModelo.setAttribute('id', 'updateModelo')
        inputModelo.setAttribute('placeholder', 'Insira o novo modelo')
        
        let inputMarca = document.createElement('input')
        inputMarca.type = "text";
        inputMarca.setAttribute('name', 'updateMarca')
        inputMarca.setAttribute('id', 'updateMarca')
        inputMarca.setAttribute('placeholder', 'Insira a nova marca')
        
        let inputAno = document.createElement('input')
        inputAno.type = "text";
        inputAno.setAttribute('name', 'updateAno')
        inputAno.setAttribute('id', 'updateAno')
        inputAno.setAttribute('placeholder', 'Insira o novo ano')
        
        let inputObservacao = document.createElement('input')
        inputObservacao.type = "text";
        inputObservacao.setAttribute('name', 'updateObservacao')
        inputObservacao.setAttribute('id', 'updateObservacao')
        inputObservacao.setAttribute('placeholder', 'Insira a nova observacao')
        
        let inputValor = document.createElement('input')
        inputValor.type = "text";
        inputValor.setAttribute('name', 'updateValor')
        inputValor.setAttribute('id', 'updateValor')
        inputValor.setAttribute('placeholder', 'Insira o novo valor')
        
        let inputStatus = document.createElement('input')
        inputStatus.type = "text";
        inputStatus.setAttribute('name', 'updateStatus')
        inputStatus.setAttribute('id', 'updateStatus')
        inputStatus.setAttribute('placeholder', 'Insira o novo status')

        let confirmEditButton = document.createElement("button") 
        confirmEditButton.setAttribute("id", "confirmEditButton")
        confirmEditButton.innerText = "Confirmar"

        let formEdit = document.createElement('form')
        formEdit.setAttribute('id', 'formEdit')
        formEdit.append(title, inputModelo, inputMarca, inputAno, inputObservacao, inputValor, inputStatus, confirmEditButton)
        formEdit.onsubmit = (e) => {
            e.preventDefault();
            updateCar(id,inputModelo.value,inputMarca.value,inputAno.value,inputObservacao.value,inputValor.value,inputStatus.value);
        }

        container.append(formEdit)
        popEdit.append(container)
        
        document.body.appendChild(popEdit); 
    }
}

// Função chamada após clicar no botão "Confirmar" ao editar um contato.
// Requisição PUT para atualizar o contato em questão (que está salvo na lista no servidor) com os campos alterados pelo usuário
function updateCar(id, modelo, marca, ano, observacao, valor, status) {
    let urlUpdate = url + `/${parseInt(id)}`
    const data = {"modelo":modelo,"marca":marca,"ano":ano,"observacao":observacao,"valor":valor,"status":status}
    fetch(urlUpdate, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(json => {
        console.log("Carro editado: ", json)
        getCars()
    })
    .catch(error => console.error(error));

}

// Requisição DELETE para remover o contato da lista de contatos presente no servidor.
function deleteCar(id){
    let urlDelete = url + `/${parseInt(id)}`
    fetch(urlDelete, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(response => response.json())
    .then(json => {
        console.log(json)
        getCars()
    })
    .catch(error => console.error(error));
}