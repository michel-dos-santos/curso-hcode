export class CameraController {
    constructor(elementVideo){
        this._elementVideo = elementVideo;
        navigator.mediaDevices.getUserMedia({
            video: true
        }).then(stream => {
            this._stream = stream;
            this._elementVideo.src = URL.createObjectURL(stream);
            this._elementVideo.play();
        }).catch(err => {
            console.error(err);
        });
    }

    stop(){
        this._stream.getTracks().forEach(track => {
            track.stop();
        });
    }

    takePicture(mimeType = 'iamge/jpeg'){
        let canvas = document.createElement('canvas');
        canvas.setAttribute('height', this._elementVideo.videoHeight);
        canvas.setAttribute('width', this._elementVideo.videoWidth);
        let context = canvas.getContext('2d');
        context.drawImage(this._elementVideo, 0, 0, canvas.width, canvas.height);
        return canvas.toDataURL(mimeType);
    }
}