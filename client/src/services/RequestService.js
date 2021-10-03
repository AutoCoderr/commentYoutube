
export default class RequestService {
    static formatUrlEncoded(body) {
        return Object.keys(body).map(key =>
            encodeURIComponent(key)+"="+encodeURIComponent(body[key])
        ).join("&")
    }

    static formatFormData(body) {
        return Object.keys(body).reduce((formData,key) => {
            formData.append(key,body[key]);
            return formData;
        }, new FormData())
    }
}

