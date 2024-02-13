const articleTable = document.getElementById('articleTable');

// 게시글 삭제
{ // 해당 스코프 안에 선언된 변수는 해당 스코프에서만 사용이 가능함. 외부에서 사용하면 오류 남
    const deleteEl = articleTable.querySelector('.delete-btn');
    if (deleteEl) {
        const deleteFunc = function () {
            const xhr = new XMLHttpRequest();
            const formData = new FormData();
            // articleTable에서 th:data-index="${article.getIndex()}를 해주었기 때문에 사용 가능
            formData.append('id', articleTable.dataset.id);
            xhr.onreadystatechange = function () {
                if (xhr.readyState !== XMLHttpRequest.DONE) {
                    return;
                }
                loading.hide();
                if (xhr.status < 200 || xhr.status >= 300) {
                    dialog.show({
                        title: '오류',
                        content: '요청을 전송하는 도중 예상치 못한 오류가 발생하였습니다.<br><br>잠시 후 다시 시도해 주세요.',
                        buttons: [dialog.createButton('확인', dialog.hide)]
                    });
                    return;
                }
                const responseObject = JSON.parse(xhr.responseText);
                switch (responseObject['result']) {
                    case 'failure':
                        dialog.show({
                            title: '오류',
                            content: '알 수 없는 이유로 게시글을 삭제하지 못하였습니다.<br><br>잠시 후 다시 시도해 주세요.',
                            buttons: [dialog.createButton('확인', dialog.hide)]
                        });
                        break;
                    case 'success':
                        // articleTable에서 th:data-board-code="${board.getCode()}를 해주었기 때문에 사용 가능
                        location.href = `../board/list?code=${articleTable.dataset.boardCode}`;
                        break;
                    default:
                        dialog.show({
                            title: '오류',
                            content: '서버가 예상치 못한 응답을 반환하였습니다.<br><br>잠시 후 다시 시도해 주세요.',
                            buttons: [dialog.createButton('확인', dialog.hide)]
                        });
                }
            }
            xhr.open('DELETE', './read');
            xhr.send(formData);
            loading.show();
        }
        deleteEl.onclick = function () {
            dialog.show({
                title: '게시글 삭제',
                content: '정말로 게시글을 삭제할까요?<br><br>게시글에 작성된 댓글이 함께 삭제되며 이는 되돌릴 수 없습니다.',
                buttons: [
                    dialog.createButton('취소', dialog.hide),
                    dialog.createButton('삭제', function () {
                        dialog.hide();
                        deleteFunc();
                    })
                ]
            })
        }
    }
}