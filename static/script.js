var url = "http://127.0.0.1:5001/cars"
var editMode = false

window.onload = getCars()

document.getElementById('formAdd').onsubmit = (e) => {
e.preventDefault()
postCar()
}

// Tratando o Selector do cadastro de carros
const selector = document.querySelector('#ano');

for(i = 2000;i < 2024; i++){
    let options = document.createElement('option');
    options.innerText = i;
    options.value = i
    selector.appendChild(options);
}

// Novas opcoes (EDITAR E REMOVER) ao hover no card
function showMoreOptions() {
    let options = document.getElementsByClassName('options')[0]
    options.style.display = "block"
}

function hideOptions() {
    let options = document.getElementsByClassName('options')[0]
    options.style.display = "none"
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
                //document.getElementById('contacts').innerHTML += `<p>Nome: ${contact['name']}  Phone: ${contact['phone']}  <button onclick='showUpdateFields(${contact['id']})'>Editar </button><button onclick='deleteContact(${contact['id']})'>Deletar </button></p>`
                document.getElementById('cars').innerHTML += `<div class="car" id="car-card" onmouseenter="showMoreOptions()" onmouseleave="hideOptions()">
                                                                <div class="options">
                                                                    <button class="edit" id="updateCarEdit" onclick='showUpdateFields(${car['id']})'><img src="static/assets/edit.svg"></button>                        
                                                                    <button class="remove" onclick='deleteCar(${car['id']})'><img src="static/assets/remove.svg"></button>                        
                                                                </div>
                                                                <div class="diaria">
                                                                    <p>Valor da diária</p>
                                                                    <p id="money-per-day">R$ ${car['valor']}</p>
                                                                </div>
                                                                <img id="peugeot" src="/static/assets/Peugeot-amarelo.png" alt="car">
                                                                <div class="about-car">
                                                                    <div class="disponibility">
                                                                        <p>${car['status']}</p>
                                                                    </div>
                                                                    <h3>${car['modelo']}</h3>
                                                                    <p><span>Marca:</span> ${car['marca']}</p>
                                                                    <p><span>Ano:</span> ${car['ano']}</p>
                                                                    <p><span>Observações:</span> ${car['observacao']}</p>
                                                                    <button>Reservar</button>
                                                                </div>
                                                            </div>`
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

function showPostFields(){
    // Liberar pop up ao clicar em cadastrar veiculo
    let buttonAdd = document.getElementById("cadastrar-veiculo")
    console.log(buttonAdd)

    let popAdd = document.getElementById("pop-add")
    console.log(popAdd)
    popAdd.style.display = "block";

    // Fechar pop up apos confirmar
    let ConfirmAdd = document.getElementById('form-add-confirm')
    ConfirmAdd.onclick = () => {
        popAdd.style.display = "none";
    }

    // Fechar no botao do close
    let closeAdd = document.getElementById('close')
    closeAdd.onclick = () => {
        popAdd.style.display = "none";
    }
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

        let allowEdit = document.getElementById('updateCarEdit')
        allowEdit.onclick = () => {
            popEdit.style.display = "flex"
        }
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