if (document.head.querySelector('[name="article-status"]').getAttribute('content') === 'false') {
    alert('존재하지 않는 게시글입니다.');
    window.history.back();
}

const articleTable = document.getElementById('articleTable'); // 게시글 상세 table
const commentForm = document.getElementById('commentForm'); // 댓글 form


const deleteBtn = document.getElementById('deleteBtn');
if (deleteBtn) {
    // 게시글 삭제 버튼 클릭 함수
    deleteBtn.onclick = function (e) {
        e.preventDefault();

        if (confirm('정말로 게시글을 삭제할까요? 게시글에 작성된 댓글이 함께 삭제되며 이는 되돌릴 수 없습니다.')) {
            axios.delete("/article/read?id=" + articleTable.dataset.id)
                .then(res => {
                    if (res.data === 'SUCCESS') {
                        alert('게시글이 삭제 되었습니다');
                        location.href = '/board/list?code=' + articleTable.dataset.code;
                    }
                })
                .catch(err => {
                    alert('알 수 없는 이유로 게시글을 삭제하지 못하였습니다. 잠시 후 다시 시도해 주세요.');
                })
        }
    }
}

const commentTable = document.getElementById('commentTable'); // 댓글 table

const comment = {};

// 전달 받은 commentIndex 댓글 좋아요 상태를 수정할 수 있는 함수.
comment.alterLike = function (commentIndex, status) {
    // status
    //    - true : 좋아요
    //    - false : 싫어요
    //    - null/undefined : 중립
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append('commentIndex', commentIndex);
    if (typeof status === 'boolean') {
        formData.append('status', status);
    }
    xhr.onreadystatechange = function () {
        if (xhr.readyState !== XMLHttpRequest.DONE) {
            return;
        }
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
                    content: '알 수 없는 이유로 요청을 처리하지 못하였습니다.<br><br>잠시 후 다시 시도해 주세요.',
                    buttons: [dialog.createButton('확인', dialog.hide)]
                });
                break;
            case 'success':
                const commentEl = commentTable.querySelector(`.comment[data-index="${commentIndex}"]`);
                const upVoteEl = commentEl.querySelector('.vote-up');
                const downVoteEl = commentEl.querySelector('.vote-down');
                upVoteEl.querySelector('.value').innerText = responseObject['likeCount'];
                downVoteEl.querySelector('.value').innerText = responseObject['dislikeCount'];
                switch (responseObject['likeStatus']) {
                    case 0:
                        upVoteEl.classList.remove('selected');
                        downVoteEl.classList.remove('selected');
                        break;
                    case 1:
                        upVoteEl.classList.add('selected');
                        downVoteEl.classList.remove('selected');
                        break;
                    case -1:
                        upVoteEl.classList.remove('selected');
                        downVoteEl.classList.add('selected');
                        break;
                }
                break;
            default:
                dialog.show({
                    title: '오류',
                    content: '서버가 예상치 못한 응답을 반환하였습니다.<br><br>잠시 후 다시 시도해 주세요.',
                    buttons: [dialog.createButton('확인', dialog.hide)]
                });
        }
    }
    xhr.open('PUT', './comment');
    xhr.send(formData);
}

// allComments : 모든 댓글
// targetComment : 타겟 댓글
// 댓글 추가 함수
comment.append = function (allComments, targetComment) {
    const commentEl = new DOMParser().parseFromString(`
        <div class="comment ${targetComment['isMine'] === true ? 'mine' : ''}
                            ${typeof targetComment['commentIndex'] === 'number' ? 'sub' : ''}
                            ${typeof targetComment['content'] === 'string' ? '' : 'deleted'}"
                            data-index="${targetComment['index']}" rel="comment">
            <div class="head">
                <span class="nickname">${targetComment['nickname']}</span>
                <span class="written-at" rel="writtenAt">
                      ${targetComment['at']}
                      ${targetComment['isModified'] === true ? '(수정됨)' : ''}
                </span>
                <span class="flex-grow-1"></span>
                ${typeof targetComment['content'] === 'string' && targetComment['isMine'] === true ? '<span class="pointer modify">수정</span>' : ''}
                ${typeof targetComment['content'] === 'string' && targetComment['isMine'] === true ? '<span class="pointer delete">삭제</span>' : ''}
                ${typeof targetComment['content'] === 'string' && targetComment['isMine'] === true ? '<span class="pointer modify-cancel">수정 취소</span>' : ''}
                    </div>
                        <div class="body">
                            <span class="content">${typeof targetComment['content'] === 'string' ? targetComment['content'] : '삭제된 댓글입니다.'}</span>
                            ${typeof targetComment['content'] === 'string' ? `
                            <form id="modifyForm" class="modify-form">
                                <textarea name="content" maxlength="1000" placeholder="댓글을 입력해 주세요."  class="common-field"></textarea>
                                <button class="common-btn modify-comment-btn">댓글 수정</button>
                            </form>` : ''}
                        </div>
                        ${typeof targetComment['content'] === 'string' ? `
                        <div class="foot">
                            <span class="vote vote-up ${targetComment['likeStatus'] === 1 ? 'selected' : ''}">
                                <img alt="👍" class="icon" src="/images/comment/vote.up.png">
                                <span class="value">${targetComment['likeCount']}</span>
                            </span>
                            <span class="vote ${targetComment['likeStatus'] === -1 ? 'selected' : ''}" rel="vote" data-vote="down">
                                <img alt="👎" class="icon" src="/images/comment/vote.down.png">
                                <span class="value">${targetComment['dislikeCount']}</span>
                            </span> 
                            <span class="flex-grow-1"></span>
                            <p class="pointer reply">답글 달기</p>
                            <p class="pointer reply-cancel">답글 달기 취소</p>
                        </div>
                        <form id="replyForm" class="reply-form">
                            <label class="label">
                                <textarea name="content" maxlength="1000" placeholder="답글을 입력해 주세요." data-regex="${commentForm['content'].getAttribute('data-regex')}" class="common-input"></textarea>
                            </label>
                            <button class="common-btn">답글 달기</button>
                        </form>` : ''}
                    </div>`, 'text/html').querySelector('[rel="comment"]');

    const replyForm = commentEl.getElementById('modifyForm');
    if (replyForm) {
        // 답글 달기 눌렀을 때
        commentEl.querySelector('.reply').addEventListener('click', function () {
            const userStatus = document.head.querySelector('meta[name="_user-status"]').getAttribute('content');
            if (userStatus !== 'true') {
                dialog.show({
                    title: '경고',
                    content: '로그인 후 이용할 수 있습니다.',
                    buttons: [dialog.createButton('확인', dialog.hide)]
                });
                return false;
            }
            commentEl.classList.add('replying');
            replyForm['content'].focus();
        })

        // 답글 달기 취소 눌렀을 때
        commentEl.querySelector('.reply-cancel').addEventListener('click', function () {
            commentEl.classList.remove('replying');
        })

        // 대댓글 창은 댓글마다 있기 때문에 for문 안에 onsubmit을 함께 구현해주어야 함.
        replyForm.onsubmit = function (e) {
            e.preventDefault();
            if (replyForm['content'].value === '') {
                alert('답글을 입력해 주세요.');
                return false;
            }
            if (!new RegExp(replyForm['content'].dataset.regex).test(replyForm['content'].value)) {
                alert('올바른 답글을 입력해 주세요.');
                return false;
            }

            const formData = new FormData();
            formData.append('articleIndex', targetComment['articleIndex'] + '');
            formData.append('commentIndex', targetComment['index'] + ''); // 어느 댓글의 대댓글인가에 대한 인덱스
            formData.append('content', replyForm['content'].value);

            axios.post('/article/comment', formData)
                .then(res => {
                    comment.load();
                })
                .catch(err => {
                    alert('알 수 없는 이유로 답글을 작성하지 못하였습니다. 잠시 후 다시 시도해 주세요.');
                })
        }
    }

    const voteUp = commentEl.querySelector('.vote-up');
    const voteDown = commentEl.querySelector('.vote-down');
    if (voteUp && voteDown) {
        // voteUp 눌렀을 때
        voteUp.addEventListener('click', function () {
            const userStatus = document.head.querySelector('meta[name="user-status"]').getAttribute('content');
            if (userStatus !== 'true') {
                alert('로그인 후 이용할 수 있습니다.');
                return false;
            }
            if (voteUp.classList.contains('selected')) { // 이미 voteUp가 눌러져 있을 때
                comment.alterLike(targetComment['index'], null);
            } else {
                comment.alterLike(targetComment['index'], true);
            }
        })

        // voteDown 눌렀을 때
        voteDown.addEventListener('click', function () {
            const userStatus = document.head.querySelector('meta[name="_user-status"]').getAttribute('content');
            if (userStatus !== 'true') {
                alert('로그인 후 이용할 수 있습니다.');
                return false;
            }
            if (voteDown.classList.contains('selected')) { // 이미 voteDown가 눌러져 있을 때
                comment.alterLike(targetComment['index'], null);
            } else {
                comment.alterLike(targetComment['index'], false);
            }
        })
    }
    const deleteEl = commentEl.querySelector('.delete');
    if (deleteEl) {
        deleteEl.addEventListener('click', function () {
            if (confirm('정말로 댓글을 삭제 하시겠습니까?')) {
                const formData = new FormData();
                formData.append('index', targetComment['index'])

                axios.delete('/article/comment')
                    .then(res => {
                        comment.load();
                    })
                    .catch(err => {
                        alert('알 수 없는 이유로 답글을 작성하지 못하였습니다. 잠시 후 다시 시도해 주세요.');
                    })
            }
        })
    }

    const modifyEl = commentEl.querySelector('.modify');
    const modifyCancelEl = commentEl.querySelector('.modify-cancel');
    if (modifyEl && modifyCancelEl) {
        const modifyForm = commentEl.getElementById('modifyForm');
        modifyEl.onclick = function () {
            commentEl.classList.add('modifying');
            modifyForm['content'].value = commentEl.querySelector('[rel="content"]').innerText;
            modifyForm['content'].focus();
        }
        modifyCancelEl.onclick = function () {
            commentEl.classList.remove('modifying');
        }

        modifyForm.onsubmit = function (e) {
            e.preventDefault();
            if (modifyForm['content'].value === '') {
                dialog.show({
                    title: '경고',
                    content: '댓글을 입력해 주세요.',
                    buttons: [
                        dialog.createButton('확인', function () {
                            dialog.hide();
                            modifyForm['content'].focus();
                            modifyForm['content'].select();
                        })]
                });
                return false;
            }
            if (!modifyForm['content'].testRegex()) {
                dialog.show({
                    title: '경고',
                    content: '올바른 댓글을 입력해 주세요.',
                    buttons: [
                        dialog.createButton('확인', function () {
                            dialog.hide();
                            modifyForm['content'].focus();
                            modifyForm['content'].select();
                        })]
                });
                return false;
            }
            const xhr = new XMLHttpRequest();
            const formData = new FormData();
            formData.append('index', targetComment['index']);
            formData.append('content', modifyForm['content'].value);
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
                    case `failure`:
                        dialog.show({
                            title: '오류',
                            content: '알 수 없는 이유로 댓글을 수정하지 못하였습니다.<br><br>잠시 후 다시 시도해 주세요.',
                            buttons: [dialog.createButton('확인', dialog.hide)]
                        });
                        break;
                    case 'success':
                        commentEl.querySelector('[rel="content"]').innerText = modifyForm['content'].value;
                        commentEl.classList.remove('modifying');
                        break;
                    default:
                        dialog.show({
                            title: '오류',
                            content: '서버가 예상치 못한 응답을 반환하였습니다.<br><br>잠시 후 다시 시도해 주세요.',
                            buttons: [dialog.createButton('확인', dialog.hide)]
                        });
                }
            }
            xhr.open('PATCH', './comment');
            xhr.send(formData);
            loading.show();
        }
    }

    const tbody = commentTable.querySelector(':scope > tbody')
// 댓글 불러오기를 했을 때 초기화 후 comments에서 댓글을 가져오기 위해서(안 그럼 같은 댓글이 밑에 추가로 계속 생김)
    const tr = document.createElement('tr');
    const td = document.createElement('td');
    td.append(commentEl);
    tr.append(td);
    tbody.append(tr);

    const subComments = allComments.filter(x => x['commentIndex'] === targetComment['index']); // 현재 댓글의 대댓글 배열
    if (subComments.length > 0) {
        for (const subComment of subComments) {
            comment.append(allComments, subComment);
        }
    }
}

// 댓글 불러오기
// comment.load() 함수 생성
comment.load = function () {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState != XMLHttpRequest.DONE) {
            return;
        }
        commentTable.classList.remove('loading');
        if (xhr.status < 200 || xhr.status > 300) {
            commentTable.classList.add('error');
            return;
        }
        const comments = JSON.parse(xhr.responseText);
        for (const commentObject of comments.filter(x => typeof x['commentIndex'] !== 'number')) { // 대댓글이 아닌 것만!
            comment.append(comments, commentObject);
        }
        commentForm.querySelector('[rel="count"]').innerText = comments.length;
    }
    xhr.open('GET', `./comment?articleIndex=${commentForm['articleIndex'].value}`);
    xhr.send();
    commentForm.querySelector('[rel="count"]').innerText = '0';
    // 댓글 불러오기를 했을 때, 이미 있는 댓글은 안 불러오고 remove
    commentTable.querySelector(':scope > tbody').innerHTML = '';
    commentTable.classList.remove('error');
    commentTable.classList.add('loading');
}

if (commentForm) {
    commentForm.querySelector('[rel="refresh"]').onclick = comment.load;
    commentForm.onsubmit = function (e) {
        e.preventDefault();
        const userStatus = document.head.querySelector('meta[name="_user-status"]').getAttribute('content');
        if (userStatus !== 'true') {
            dialog.show({
                title: '경고',
                content: '로그인 후 이용할 수 있습니다.',
                buttons: [dialog.createButton('확인', dialog.hide)]
            });
            return false;
        }
        if (commentForm['content'].value === '') {
            dialog.show({
                title: '경고',
                content: '댓글을 입력해 주세요.',
                buttons: [
                    dialog.createButton('확인', function () {
                        dialog.hide();
                        commentForm['content'].focus();
                        commentForm['content'].select();
                    })]
            });
            return false;
        }
        if (!commentForm['content'].testRegex()) {
            dialog.show({
                title: '경고',
                content: '올바른 댓글을 입력해 주세요.',
                buttons: [
                    dialog.createButton('확인', function () {
                        dialog.hide();
                        commentForm['content'].focus();
                        commentForm['content'].select();
                    })]
            });
            return false;
        }
        const xhr = new XMLHttpRequest();
        const formData = new FormData();
        formData.append('articleIndex', commentForm['articleIndex'].value);
        formData.append('content', commentForm['content'].value);
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
                case `failure`:
                    dialog.show({
                        title: '오류',
                        content: '알 수 없는 이유로 댓글을 작성하지 못하였습니다.<br><br>잠시 후 다시 시도해 주세요.',
                        buttons: [dialog.createButton('확인', dialog.hide)]
                    });
                    break;
                case 'success':
                    commentForm['content'].value = '';
                    commentForm['content'].focus();
                    comment.load();
                    break;
                default:
                    dialog.show({
                        title: '오류',
                        content: '서버가 예상치 못한 응답을 반환하였습니다.<br><br>잠시 후 다시 시도해 주세요.',
                        buttons: [dialog.createButton('확인', dialog.hide)]
                    });
            }
        }
        xhr.open('POST', './comment');
        xhr.send(formData);
        loading.show();
    }
}

// 페이지 들어갈 때 댓글 바로 보이게
comment.load();