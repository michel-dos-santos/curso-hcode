import { Format } from './../util/Format';
import { CameraController } from './CameraController';
import { MicrophoneController } from './MicrophoneController';
import { DocumentPreviewController } from './DocumentPreviewController';
import { Firebase } from "./../util/Firebase";

export class WhatsAppController {
    constructor(){
        this._firebase = new Firebase();
        this.initAuth();
        this.elementsPrototype();
        this.loadElements();
        this.initEvents();
    }

    initAuth(){
        this._firebase.initAuth().then((response) => {
            this.elements.appContent.css({
                display: 'flex'
            });
        }).catch(err => {
            console.log(err);
        });
    }

    initEvents(){
        this.elements.myPhoto.on('click', e => {
            this.closeAllLeftPanel();
            this.elements.panelEditProfile.show();
            setTimeout(() => {
                this.elements.panelEditProfile.addClass('open');
            }, 300);
        });

        this.elements.btnNewContact.on('click', e => {
            this.closeAllLeftPanel();
            this.elements.panelAddContact.show();
            setTimeout(() => {
                this.elements.panelAddContact.addClass('open');
            }, 300);
        });

        this.elements.btnClosePanelEditProfile.on('click', e => {
            this.elements.panelEditProfile.removeClass('open');
        });

        this.elements.btnClosePanelAddContact.on('click', e => {
            this.elements.panelAddContact.removeClass('open');
        });

        this.elements.photoContainerEditProfile.on('click', e => {
            this.elements.inputProfilePhoto.click();
        });

        this.elements.inputNamePanelEditProfile.on('keypress', e => {
            if(e.key === 'Enter'){
                e.preventDefault();
                this.elements.btnSavePanelEditProfile.click();
            }
        });

        this.elements.btnSavePanelEditProfile.on('click', e => {
            console.log(this.elements.inputNamePanelEditProfile.innerHTML);
        });

        this.elements.formPanelAddContact.on('submit', e => {
            e.preventDefault();
            this.elements.formPanelAddContact.getForm();

        });

        this.elements.contactsMessagesList.querySelectorAll('.contact-item').forEach(item => {
            item.on('click', e => {
                this.elements.home.hide();
                this.elements.main.css({
                    display: 'flex'
                });
            });
        });

        this.elements.btnAttach.on('click', e => {
            e.stopPropagation();
            this.elements.menuAttach.addClass('open');
            document.addEventListener('click', this.closeMenuAttach.bind(this));
        });

        this.elements.btnAttachPhoto.on('click', e => {
            this.elements.inputPhoto.click();
        });

        this.elements.btnAttachCamera.on('click', e => {
            this.closeAllMainPanel();
            this.elements.panelCamera.addClass('open');
            this.elements.panelCamera.css({
                'height':'calc(100% - 120px)'
            });
            this._camera = new CameraController(this.elements.videoCamera);
        });

        this.elements.btnAttachDocument.on('click', e => {
            this.closeAllMainPanel();
            this.elements.panelDocumentPreview.addClass('open');
            this.elements.panelDocumentPreview.css({
                'height':'calc(100% - 120px)'
            });
            this.elements.inputDocument.click();
        });

        this.elements.inputDocument.on('change', e => {
            if(this.elements.inputDocument.files.length){
                this.elements.panelDocumentPreview.css({
                    'height':'1%'
                });

                let file = this.elements.inputDocument.files[0];
                this._documentPreviewController = new DocumentPreviewController(file);
                this._documentPreviewController.getPreviewData().then((result) => {
                    this.elements.imgPanelDocumentPreview.src = result.src;
                    this.elements.infoPanelDocumentPreview.innerHTML = result.info;
                    this.elements.imagePanelDocumentPreview.show();
                    this.elements.filePanelDocumentPreview.hide();

                    this.elements.panelDocumentPreview.css({    
                        'height':'calc(100% - 120px)'
                    });
                }).catch((err) => {
                    this.elements.panelDocumentPreview.css({
                        'height':'calc(100% - 120px)'
                    });

                    switch (file.type) {
                        case 'application/vnd.ms-excel':
                        case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
                            this.elements.iconPanelDocumentPreview.className = 'jcxhw icon-doc-xls';
                            break;
                        case 'application/vnd.ms-powerpoint':
                        case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
                            this.elements.iconPanelDocumentPreview.className = 'jcxhw icon-doc-ppt';
                            break;
                        case 'application/msword':
                        case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
                            this.elements.iconPanelDocumentPreview.className = 'jcxhw icon-doc-doc';
                            break;
                        default:
                            this.elements.iconPanelDocumentPreview.className = 'jcxhw icon-doc-generic';
                            break;
                    }
                    this.elements.filePanelDocumentPreview.show();
                    this.elements.imagePanelDocumentPreview.hide();
                    this.elements.filenamePanelDocumentPreview.innerHTML = file.name;
                });
            }
        });

        this.elements.btnAttachContact.on('click', e => {
            this.elements.modalContacts.show();
        });

        this.elements.inputPhoto.on('change', e => {
            [...this.elements.inputPhoto.files].forEach(file => {
                console.log(file);
            });
        });

        this.elements.btnClosePanelCamera.on('click', e => {
            this.closeAllMainPanel();
            this.elements.panelMessagesContainer.show();
            this._camera.stop();
        });

        this.elements.btnTakePicture.on('click', e => {
            let dataURL = this._camera.takePicture();
            this.elements.pictureCamera.src = dataURL;
            this.elements.pictureCamera.show();
            this.elements.videoCamera.hide();
            this.elements.btnReshootPanelCamera.show();
            this.elements.containerTakePicture.hide();
            this.elements.containerSendPicture.show();
        });

        this.elements.btnReshootPanelCamera.on('click', e => {
            this.elements.pictureCamera.hide();
            this.elements.videoCamera.show();
            this.elements.btnReshootPanelCamera.hide();
            this.elements.containerTakePicture.show();
            this.elements.containerSendPicture.hide();
        });

        this.elements.btnSendPicture.on('click', e => {
        });

        this.elements.btnClosePanelDocumentPreview.on('click', e => {
            this.closeAllMainPanel();
            this.elements.panelMessagesContainer.show();
        });

        this.elements.btnSendDocument.on('click', e => {
            console.log('send a document');
        });

        this.elements.btnCloseModalContacts.on('click', e => {
            this.elements.modalContacts.hide();
        });

        this.elements.btnSendMicrophone.on('click', e => {
            this.elements.recordMicrophone.show();
            this.elements.btnSendMicrophone.hide();
            this._microphoneController = new MicrophoneController();

            this._microphoneController.on('ready', audio => {
                console.log('ready event');
                this._microphoneController.startRecorder();
            });
            this._microphoneController.on('recordtimer', timer => {
                this.elements.recordMicrophoneTimer.innerHTML = Format.toTime(timer);
            });
        });

        this.elements.btnCancelMicrophone.on('click', e => {
            this.closedRecordMicrophone();
            this._microphoneController.stopRecord();

        });

        this.elements.btnFinishMicrophone.on('click', e => {
            this.closedRecordMicrophone();
            this._microphoneController.stopRecord();
        });

        this.elements.inputText.on('keypress', e => {
            if(e.key === 'Enter' && e.ctrlKey){
                e.preventDefault();
                this.elements.btnSend.click();
            }    
        });

        this.elements.inputText.on('keyup', e => {
            if(this.elements.inputText.innerHTML.length){
                this.elements.inputPlaceholder.hide();
                this.elements.btnSendMicrophone.hide();
                this.elements.btnSend.show();
            }else{
                this.elements.inputPlaceholder.show();
                this.elements.btnSendMicrophone.show();
                this.elements.btnSend.hide();
            }
        });

        this.elements.btnSend.on('click', e => {
            console.log(this.elements.inputText.innerHTML);
        });

        this.elements.btnEmojis.on('click', e => {
            this.elements.panelEmojis.toggleClass('open');
        });

        this.elements.panelEmojis.querySelectorAll('.emojik').forEach(emoji => {
            emoji.on('click', e => {
                let img = this.elements.imgEmojiDefault.cloneNode();
                img.style.cssText = emoji.style.cssText;
                img.dataset.unicode = emoji.dataset.unicode;
                img.alt = emoji.dataset.unicode;
                emoji.classList.forEach(name => {
                    img.classList.add(name);
                });
                let cursor = window.getSelection();

                if(!cursor.focusNode || !cursor.focusNode.id == 'input-text'){
                    this.elements.inputText.focus();  
                    cursor = window.getSelection();
                }

                let range = cursor.getRangeAt(0);
                range.deleteContents();

                let frag = document.createDocumentFragment();
                frag.appendChild(img);
                range.insertNode(frag);
                range.setStartAfter(img);

                this.elements.inputText.dispatchEvent(new Event('keyup'));
            });
        });
    }
    
    closedRecordMicrophone(){
        this.elements.recordMicrophone.hide();
        this.elements.btnSendMicrophone.show();
    }

    closeAllMainPanel(){
        this.elements.panelMessagesContainer.hide();
        this.elements.panelDocumentPreview.removeClass('open');
        this.elements.panelCamera.removeClass('open');
    }

    closeMenuAttach(){
        document.removeEventListener('click', this.closeMenuAttach);
        this.elements.menuAttach.removeClass('open');
    }

    closeAllLeftPanel(){
        this.elements.panelEditProfile.hide();
        this.elements.panelAddContact.hide();
    }

    elementsPrototype(){
        Element.prototype.hide = function(){
            this.style.display = 'none';
            return this;
        }
        Element.prototype.show = function(){
            this.style.display = 'block';
            return this;
        }
        Element.prototype.toggle = function(){
            this.style.display = (this.style.display === 'none') ? 'block' : 'none';
            return this;
        }
        Element.prototype.on = function(events, fn){
            events.split(' ').forEach(event => {
                this.addEventListener(event, fn);
            });
            return this;
        }
        Element.prototype.css = function(styles){
            for (let name in styles) {
                this.style[name] = styles[name];                               
            }
            return this;
        }
        Element.prototype.addClass = function(name){
            this.classList.add(name);
            return this;
        }
        Element.prototype.removeClass = function(name){
            this.classList.remove(name);
            return this;
        }
        Element.prototype.toggleClass = function(name){
            this.classList.toggle(name);
            return this;
        }
        Element.prototype.hasClass = function(name){
            return this.classList.contains(name);
        }
        HTMLFormElement.prototype.getForm = function(name){
            return new FormData(this);
        }
        HTMLFormElement.prototype.toJSON = function(name){
            let json = {};
            this.getForm().forEach((value, key) => {
                json[key] = value;
            });
            return json;
        }
    }

    loadElements(){
        this.elements = {};
        document.querySelectorAll('[id]').forEach(element => {
            this.elements[Format.getCamelCase(element.id)] = element;
        });
    }
}