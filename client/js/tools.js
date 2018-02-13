function $createRequest(url, method, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
    if (Store.state.token) xhr.setRequestHeader("x-access-token", Store.state.token);
    xhr.onload = function() {
        if (xhr.status === 200) {
            callback(null, JSON.parse(xhr.responseText));
        } else {
            if (xhr.status === 401) Store.commit("setloggedout");
            callback(xhr.status);
        }
        Store.commit("stopwaiting");
    };
    Store.commit("startwaiting");
    return xhr;
}

function $get(url, callback) {
    $createRequest(url, "GET", callback).send();
}

function $post(url, data, callback) {
    $createRequest(url, "POST", callback).send(JSON.stringify(data));
}
