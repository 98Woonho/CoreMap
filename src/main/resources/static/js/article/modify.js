if (document.head.querySelector('meta[name="_allowed-status"]').getAttribute('content') === 'false') {
    alert('게시글을 수정할 권한이 없습니다');
    if (history.length > 1) {
        history.back();
    } else {
        window.close();
    }
}

const modifyForm = document.getElementById('modifyForm'); // 게시글 수정 form

// ckeditor
ClassicEditor.create(modifyForm['content'], {
        // 게시글에 이미지를 띄우기 위해 Markdown 기능 비활성화
        removePlugins: ['Markdown'],
        // 이미지 업로드
        simpleUpload: {
            uploadUrl: './image' //   /article/image
        }
    })
    .then(function (editor) {
        modifyForm.editor = editor;
    })
    .catch(function (error) {
        console.log(error)
    });

const items = modifyForm.querySelectorAll('.item'); // 모든 첨부파일

items.forEach(item => {
    const deleteBtn = item.querySelector('.delete-btn'); // 첨부파일 삭제 버튼
    deleteBtn.onclick = function() {
        item.remove();
    }
})

modifyForm['fileAdd'].onclick = function(e) {
    e.preventDefault();

    modifyForm['file'].click();
}

modifyForm['file'].onchange = function () {
    const file = modifyForm['file'].files[0];
    if (!file) {
        return false;
    }

    const fileList = document.getElementById('fileList');
    const item = new DOMParser().parseFromString(`
            <li class="item">
                <span title="${file['name']}">${file['name']}</span>
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
    modifyForm['file'].value = '';
}


modifyForm.onsubmit = function(e) {
    e.preventDefault();

    if (modifyForm['title'].value === '') {
        alert('제목을 입력해 주세요.');
        return false;
    }

    if (modifyForm['content'].value === '') {
        alert('내용을 입력해 주세요.');
        return false;
    }

    const formData = new FormData();

    const images = modifyForm.querySelectorAll('.image');
    images.forEach(image => {
        const img = image.querySelector('img');
        const imgString = img.outerHTML;

        const match = imgString.match(/\/article\/image\?id=(\d+)/);
        const imgId = match ? match[1] : null;

        formData.append('imgId', parseInt(imgId));
    })

    const fileList = document.getElementById('fileList');
    const fileItems = fileList.querySelectorAll('.item');

    for (const fileItem of fileItems) {
        formData.append('fileId', parseInt(fileItem.dataset.id));
    }
    formData.append('indexInBoard', modifyForm['indexInBoard'].value)
    formData.append('title', modifyForm['title'].value);
    formData.append('content', modifyForm.editor.getData());
    formData.append('boardCode', modifyForm['code'].value);
    formData.append('id', modifyForm['id'].value);
    axios.post('/article/modify', formData)
        .then(res => {
            alert('게시글 수정이 완료 되었습니다.');
            location.href = '/article/read?index=' + modifyForm['indexInBoard'].value + "&code=" + modifyForm['code'].value;
        })
        .catch(err => {
            alert('알 수 없는 이유로 게시글 수정에 실패하였습니다. 잠시 후 다시 시도해 주세요.');
        })
}
