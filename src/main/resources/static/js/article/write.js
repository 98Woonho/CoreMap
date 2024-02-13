const writeForm = document.getElementById('writeForm');

ClassicEditor.create(writeForm['content'], {
    removePlugins: ['Markdown'],
    language: "ko",
    simpleUpload: {
        uploadUrl: '/article/image'
    },
})
    .then(function (editor) {
        writeForm.editor = editor;
    })
    .catch(function (error) {
        console.log(error)
    });

writeForm['fileAdd'].onclick = function(e) {
    e.preventDefault();

    writeForm['file'].click();
}

writeForm['file'].onchange = function () {
    const file = writeForm['file'].files[0];
    if (!file) {
        return;
    }

    const fileList = writeForm.querySelector('.file-list');
    const item = new DOMParser().parseFromString(`
            <li class="item">
                <span class="name" title="${file['name']}">${file['name']}</span>
                <button class="delete-btn">삭제</button>
            </li>`, 'text/html').querySelector('.item');
    const deleteBtn = item.querySelector('.delete-btn');

    const formData = new FormData();
    formData.append('file', file);

    axios.post('/article/file', formData)
        .then(res => {
            item.dataset.id = res.data.id;
        })
        .catch(err => {
            alert("알 수 없는 이유로 파일 첨부에 실패 하였습니다. 잠시 후 다시 시도해 주세요.");
        });

    deleteBtn.onclick = function () {
        item.remove();
    }

    fileList.append(item);
    fileList.scrollLeft = fileList.scrollWidth; // 파일이 추가 되면 스크롤을 오른쪽 끝으로 알아서 당겨줌.
    writeForm['file'].value = '';
}

writeForm.onsubmit = function(e) {
    e.preventDefault();

    if (writeForm['title'].value === '') {
        alert('제목을 입력해 주세요.');
        return;
    }

    if (writeForm['content'].value === '') {
        alert('내용을 입력해 주세요.');
        return;
    }

    const formData = new FormData();

    const images = writeForm.querySelectorAll('.image');
    images.forEach(image => {
        const img = image.querySelector('img');
        const imgString = img.outerHTML;

        const match = imgString.match(/\/article\/image\?id=(\d+)/);
        const imgId = match ? match[1] : null;

        formData.append('imgId', parseInt(imgId));
    })

    const fileList = writeForm.querySelector('.file-list');
    const fileItems = fileList.querySelectorAll('.item');

    for (const fileItem of fileItems) {
        formData.append('fileId', parseInt(fileItem.dataset.id));
    }
    formData.append('title', writeForm['title'].value);
    formData.append('content', writeForm.editor.getData());
    formData.append('boardCode', writeForm['code'].value);

    axios.post('/article/write', formData)
        .then(res => {
            alert('게시글 작성이 완료 되었습니다.');
            location.href = '/article/read?index=' + res.data.index + "&code=" + writeForm['code'].value;
        })
        .catch(err => {
            alert('알 수 없는 이유로 게시글 작성에 실패하였습니다. 잠시 후 다시 시도해 주세요.');
        })
}