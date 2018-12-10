const firebase = require('firebase');
require('firebase/firestore');

export class Firebase {
    constructor(){
        // Initialize Firebase
        this._config = {
            apiKey: "AIzaSyAOyMIEnbiYI0l2Z6OevWN-9LOqcpF47EY",
            authDomain: "whatsapp-clone-18be2.firebaseapp.com",
            databaseURL: "https://whatsapp-clone-18be2.firebaseio.com",
            projectId: "whatsapp-clone-18be2",
            storageBucket: "whatsapp-clone-18be2.appspot.com",
            messagingSenderId: "637702230139"
        };
        this.init();
    }

    init(){
        if(!this._initialized){
            firebase.initializeApp(this._config);
            firebase.firestore().settings({
                timestampsInSnapshots: true
            });

            this._initialized = true;
        }
    }

    static db(){
        return firebase.firestore();
    }

    static hd(){
        return firebase.storage();
    }

    initAuth(){
        return new Promise((resolve, reject) => {
            let provider = new firebase.auth.GoogleAuthProvider();
            firebase.auth().signInWithPopup(provider).then(result => {
                let token = result.credential.accessToken;
                let user = result.user;
                resolve({
                    user, 
                    token
                });
            }).catch(err => {
                reject(err);
            });
        });
    }
}