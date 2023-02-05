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
// function showMoreOptions(id) {
//     let options = document.getElementById('options')
//     options.style.opacity = "1"
// }

// function hideOptions(id) {
//     let options = document.getElementById('options')
//     options.style.opacity = "0"
// }


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
            let count = 0
            json.cars.forEach(car => {
                count++
                document.getElementById('cars').innerHTML += `<div class="car" id="car-card">
                                                                <div class="options" id="options">
                                                                    <button class="edit" id="updateCarEdit" onclick='showUpdateFields(${car['id']})'><img src="static/assets/edit.svg"></button>                        
                                                                    <button class="remove" onclick='deleteCar(${car['id']})'><img src="static/assets/remove.svg"></button>                        
                                                                </div>
                                                                <div class="diaria">
                                                                    <p>Valor da diária</p>
                                                                    <p id="money-per-day">R$ ${car['valor']}</p>
                                                                </div>
                                                                <img id="peugeot" src="/static/assets/Peugeot-amarelo.png" alt="car">
                                                                <div class="about-car">
                                                                    <div class="disponibility" id="status-disp${count}">
                                                                        <p class="label" id="label-status">${car['status']}</p>
                                                                    </div>
                                                                    <h3>${car['modelo']}</h3>
                                                                    <p><span>Marca:</span> ${car['marca']}</p>
                                                                    <p><span>Ano:</span> ${car['ano']}</p>
                                                                    <p><span>Observações:</span> ${car['observacao']}</p>
                                                                    <button>Reservar</button>
                                                                </div>
                                                            </div>`


                if(car['status'] === 'DISPONÍVEL'){
                    document.getElementById(`status-disp${count}`).style.backgroundColor = "#99C46B"
                } else if(car['status'] === 'ALUGADO'){
                    document.getElementById(`status-disp${count}`).style.backgroundColor = "rgb(255, 125, 125)"
                } else(
                    document.getElementById(`status-disp${count}`).style.backgroundColor = "rgb(253, 255, 125)"
                )
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

    let popAdd = document.getElementById("pop-add")
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

        popEdit.style.display = "flex"

        let container = document.createElement('div')
        container.setAttribute('id', 'containerPop')

        let title = document.createElement('p')
        title.setAttribute('id', 'title')
        title.innerText = "Atualize seu carro"

        let logoClose = document.createElement('div')
        logoClose.setAttribute('id', 'logo-close')
        let logo = document.createElement('img')
        logo.setAttribute('id', 'logo-edit')
        logo.setAttribute('src', 'static/assets/black-logo.svg')
        let close = document.createElement('img')
        close.setAttribute('id', 'close-edit')
        close.setAttribute('src', 'static/assets/close-icon.svg')
        logoClose.append(logo, close)

        close.onclick = () => {
            popEdit.style.display = "none"
        }

        let inputModelo = document.createElement('input')
        inputModelo.type = "text";
        inputModelo.setAttribute('name', 'updateModelo')
        inputModelo.setAttribute('id', 'updateModelo')
        inputModelo.setAttribute('placeholder', 'Insira o novo modelo')
        
        let selectMarca = document.createElement('select')
        selectMarca.setAttribute('name', 'updateMarca')
        selectMarca.setAttribute('id', 'updateMarca')
        let optMarca = document.createElement('option')
        optMarca.setAttribute('value', 'Peugeot')
        optMarca.innerText = "Peugoet"
        let optMarca2 = document.createElement('option')
        optMarca2.setAttribute('value', 'Fiat')
        optMarca2.innerText = "Fiat"
        let optMarca3 = document.createElement('option')
        optMarca3.setAttribute('value', 'Volkswagen')
        optMarca3.innerText = "Volkswagen"
        selectMarca.append(optMarca, optMarca2, optMarca3)

        let selectAno = document.createElement('select')
        selectAno.setAttribute('name', 'updateAno')
        selectAno.setAttribute('id', 'updateAno')

        for(i = 2000;i < 2024; i++){
            let options = document.createElement('option');
            options.innerText = i;
            options.value = i
            selectAno.appendChild(options);
        }
        
        let inputObservacao = document.createElement('input')
        inputObservacao.type = "text";
        inputObservacao.setAttribute('name', 'updateObservacao')
        inputObservacao.setAttribute('id', 'updateObservacao')
        inputObservacao.setAttribute('placeholder', 'Insira a nova observacao')
        
        let inputValor = document.createElement('input')
        inputValor.type = "number";
        inputValor.setAttribute('name', 'updateValor')
        inputValor.setAttribute('id', 'updateValor')
        inputValor.setAttribute('placeholder', 'Insira o novo valor')
        
        let inputStatus = document.createElement('input')
        inputStatus.type = "text";
        inputStatus.setAttribute('name', 'updateStatus')
        inputStatus.setAttribute('id', 'updateStatus')
        inputStatus.setAttribute('placeholder', 'Insira o novo status')
        
        let selectStatus = document.createElement('select') 
        selectStatus.setAttribute('name', 'updateStatus')
        selectStatus.setAttribute('id', 'updateStatus')
        let status1 = document.createElement('option')
        status1.setAttribute('value', 'DISPONÍVEL')
        status1.innerText = "Disponível"
        let status2 = document.createElement('option')
        status2.setAttribute('value', 'ALUGADO')
        status2.innerText = "Alugado"
        let status3 = document.createElement('option')
        status3.setAttribute('value', 'EM MANUTENÇÃO')
        status3.innerText = "Em manutenção"
        selectStatus.append(status1, status2, status3)

        let confirmEditButton = document.createElement("button") 
        confirmEditButton.setAttribute("id", "confirmEditButton")
        confirmEditButton.innerText = "Confirmar"

        let formEdit = document.createElement('form')
        formEdit.setAttribute('id', 'formEdit')
        formEdit.append(logoClose ,title, inputModelo, selectMarca, selectAno, inputObservacao, inputValor, selectStatus, confirmEditButton)
        formEdit.onsubmit = (e) => {
            e.preventDefault();
            updateCar(id,inputModelo.value,selectMarca.value,selectAno.value,inputObservacao.value,inputValor.value,selectStatus.value);
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