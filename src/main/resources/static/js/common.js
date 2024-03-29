const loading = document.getElementById('loading');

// 커스텀 로딩 화면
if (loading) {
    loading.hide = function() {
        loading.classList.remove('visible');
    }
    loading.show = function() {
        loading.classList.add('visible');
    }
}



const dialog = document.getElementById('dialog');

// 커스텀 버튼
if (dialog) {
    dialog.createButton = function(text, onclick) {
        return {
            text: text,
            onclick: onclick
        };
    }

    dialog.hide = function() {
        dialog.classList.remove('visible');
    }

    dialog.show = function(params) {
        const modal = dialog.querySelector('.modal');
        const buttonContainer = modal.querySelector('.button-container');
        modal.querySelector('.title').innerText = params['title'];
        modal.querySelector('.content').innerHTML = params['content'];
        buttonContainer.innerHTML = '';
        if (params['buttons'] && params['buttons'].length > 0) {
            for (const button of params['buttons']) {
                const buttonElement = document.createElement('div');
                buttonElement.classList.add('button');
                buttonElement.innerText = button['text'];
                buttonElement.onclick = button['onclick'];
                buttonContainer.append(buttonElement);
            }
        }
        dialog.classList.add('visible');
    }
}