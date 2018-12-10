class UserController{
    constructor(){
        this.formID = document.getElementById("form-user-create");
        this.tableID = document.getElementById("table-users");
        this.numberUsersCount = document.querySelector("#number-users");
        this.numberAdminCount = document.querySelector("#number-users-admin");
        this.btnSubmit = this.formID.querySelector("[type=submit]");
        this.btnEditCancel = document.querySelector("#btn-cancel-form");
        this.lblTitleUserForm = document.querySelector("#box-title-user-form");
        this.photoForm = this.formID.querySelector(".photo");
        this.PHOTO_DEFAULT = "/dist/img/boxed-bg.jpg";

        this.onSubmit();
        this.onEditCancel();
        this.viewStorage();
    }

    onSubmit(){
        this.formID.addEventListener("submit", (event)=>{
            event.preventDefault();
            
            this.btnSubmit.disable = true;

            let values = this.getValues(); 
            if(values){
                this.getPhoto().
                    then(content => {
                        values.photo = content;

                        this.addUpdateLine(values, true); 
                        this.formID.reset();
                        this.btnSubmit.disable = false;
                    }, (e) => {
                        console.error(e); 
                    });
            }
        });
    }

    onEditUser(tr){
        tr.querySelector("#btn-edit-user").addEventListener("click", e=>{
            this.btnEditCancel.style.display = "inline";
            this.lblTitleUserForm.textContent = "Editar Usuário";
            let user = JSON.parse(tr.dataset.user);
            this.formID.dataset.trIndex = tr.sectionRowIndex;
            
            for (const name in user) {
                let field = this.formID.querySelector("[name=" + name.replace("_", "") + "]");
                
                if(field){
                    switch(field.type){ 
                        case 'file' :
                            continue;
                            break;
                        case 'checkbox' :
                            field.checked = user[name];
                            break;
                        case 'radio' :
                            let fieldCheckbox = this.formID.querySelector("[name=" + name.replace("_", "") + "][value=" + user[name] +"]");
                            fieldCheckbox.checked = true;
                            break;
                        default :
                            field.value = user[name]; 
                    }
                }
            }
            
            this.photoForm.style.display = "block";
            this.photoForm.src = user._photo;   
        });
    }

    onDeleteUser(tr){
        tr.querySelector("#btn-delete-user").addEventListener("click", e=>{
            if(confirm("Deseja realmente excluir?")){
                let user = new User();
                user.loadFromJSON(JSON.parse(tr.dataset.user));  
                user.remove().then(data => {
                    tr.remove();
                    this.returnFormNewUser();
                    this.updateCount();
                });
            }
        });
    }

    onEditCancel(){
        this.btnEditCancel.addEventListener("click", event=>{
            this.returnFormNewUser();
        });
    }

    returnFormNewUser(){
        this.btnEditCancel.style.display = "none";
        this.lblTitleUserForm.textContent = "Novo Usuário";
        this.photoForm.style.display = "none";
        this.formID.reset();
    }

    getPhoto(){
        return new Promise((resolve, reject) => {
            let fileReader = new FileReader();
            let elements = [...this.formID.elements].filter(item => {
                if(item.name === 'photo'){
                    return item;
                }
            });
            let file = elements[0].files[0];

            fileReader.onload = () => {
                resolve(fileReader.result);
            }

            fileReader.onerror = (e) => {
                reject(e);
            }

            if(file){
                fileReader.readAsDataURL(file);
            }else {
                resolve(this.PHOTO_DEFAULT);
            }
        });    
    }

    getValues(){
        let user = {};
        let isFormValid = true;

        [...this.formID.elements].forEach((field, index)=>{
            if(['name', 'email', 'password'].indexOf(field.name) > -1 && !field.value){
                field.parentElement.classList.add('has-error');
                isFormValid = false;
            }

            if(field.name == 'gender'){
                if(field.checked){
                    user[field.name] = field.value;
                }
            }else if(field.name == 'admin'){
                user[field.name] = field.checked;
            }else{
                user[field.name] = field.value;
            }
        }); 
        
        if(isFormValid){
            return new User(user.name, user.gender, user.birth, user.country, user.email, user.password, user.photo, user.admin);
        }
    }

    addUpdateLine(dataUser, useBD = false){ 
        let tr = null;
        let isNewUser = this.lblTitleUserForm.textContent === 'Novo Usuário';
        
        if(isNewUser){
            tr = document.createElement('tr');
        }else{
            tr = this.tableID.rows[this.formID.dataset.trIndex];
            let userOld = JSON.parse(tr.dataset.user);
            dataUser.id = userOld._id;
            
            if(userOld._photo && dataUser.photo == this.PHOTO_DEFAULT){
                dataUser.photo = userOld._photo;        
            }
        }
        
        if(useBD){
            dataUser.save().then(user => {
                this.updateView(tr, dataUser, isNewUser);
            });
        }else{
            this.updateView(tr, dataUser, isNewUser);
        }
    }

    updateView(tr, dataUser, isNewUser){
        tr.dataset.user = JSON.stringify(dataUser);
        tr.innerHTML = `
            <td><img src="${dataUser.photo}" alt="User Image" class="img-circle img-sm"></td>
            <td>${dataUser.name}</td>
            <td>${dataUser.email}</td>
            <td>${dataUser.admin ? 'Sim' : 'Não'}</td>
            <td>${dataUser.register.toLocaleDateString('pt-BR', {
                day:"2-digit",
                month:"2-digit",
                year:"numeric",
                hour:'2-digit',
                minute:'2-digit'
            })}</td>
            <td>
                <button type="button" class="btn btn-primary btn-xs btn-flat" id="btn-edit-user">Editar</button>
                <button type="button" class="btn btn-danger btn-xs btn-flat" id="btn-delete-user">Excluir</button>
            </td>`

        this.tableID.appendChild(tr);
        this.onEditUser(tr);
        this.onDeleteUser(tr);
        this.updateCount();
        if(!isNewUser){
            this.returnFormNewUser();
        }
    }

    viewStorage(){
        User.getUsersStorage().then(data => {
            data.users.forEach(dataUser => {
                let user = new User();
                user.loadFromJSON(dataUser); 
                this.addUpdateLine(user);
            });
        });
    }

    updateCount(){
        let numberUsers = 0;
        let numberAdmin = 0;

        [...this.tableID.children].forEach(tr=>{
            numberUsers++;
            let user = JSON.parse(tr.dataset.user);
            if(user._admin){
                numberAdmin++;
            }
        });

        this.numberUsersCount.innerHTML = numberUsers;
        this.numberAdminCount.innerHTML = numberAdmin;
    }
}