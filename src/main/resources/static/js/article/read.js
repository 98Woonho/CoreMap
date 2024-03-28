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
            axios.delete(`/article/read?id=${articleTable.dataset.id}`)
                .then(res => {
                    if (res.data === 'SUCCESS') {
                        alert('게시글이 삭제 되었습니다');
                        location.href = `/board/list?code=${articleTable.dataset.code}`;
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

// 전달 받은 commentId 댓글 좋아요 상태를 수정할 수 있는 함수.
comment.alterLike = function (commentId, status) {
    // status
    //    - true : 좋아요
    //    - false : 싫어요
    //    - null/undefined : 중립
    const formData = new FormData();
    formData.append('commentId', commentId);
    if (typeof status === 'boolean') {
        formData.append('status', status);
    }

    axios.put('/article/commentLike', formData)
        .then(res => {
            const commentEl = commentTable.querySelector(`.comment[data-index="${commentId}"]`);
            const upVoteEl = commentEl.querySelector('.vote-up');
            const downVoteEl = commentEl.querySelector('.vote-down');
            upVoteEl.querySelector('.value').innerText = res.data.likeCount;
            downVoteEl.querySelector('.value').innerText = res.data.dislikeCount;
            switch (res.data.likeStatus) {
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
        })
        .catch(err => {
            alert('알 수 없는 이유로 요청을 처리하지 못하였습니다. 잠시 후 다시 시도해 주세요.');
        })
}

// allComments : 모든 댓글
// targetComment : 타겟 댓글
// 댓글 추가 함수
comment.append = function (allComments, targetComment) {
    const commentEl = new DOMParser().parseFromString(`
        <div class="comment ${targetComment['isMine'] === true ? 'mine' : ''}
                            ${typeof targetComment['commentId'] === 'number' ? 'sub' : ''}
                            ${typeof targetComment['content'] === 'string' ? '' : 'deleted'}"
                            data-index="${targetComment['id']}">
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
                            <p class="content">${typeof targetComment['content'] === 'string' ? targetComment['content'] : '삭제된 댓글입니다.'}</p>
                            ${typeof targetComment['content'] === 'string' ? `
                            <form class="modify-form">
                                <textarea name="content" maxlength="1000" placeholder="댓글을 입력해 주세요."  class="common-input"></textarea>
                                <button class="common-btn modify-comment-btn">댓글 수정</button>
                            </form>` : ''}
                        </div>
                        ${typeof targetComment['content'] === 'string' ? `
                        <div class="foot">
                            <span class="vote vote-up ${targetComment['likeStatus'] === 1 ? 'selected' : ''}">
                                <img alt="👍" class="icon" src="/images/comment/vote.up.png">
                                <span class="value">${targetComment['likeCount']}</span>
                            </span>
                            <span class="vote vote-down ${targetComment['likeStatus'] === -1 ? 'selected' : ''}">
                                <img alt="👎" class="icon" src="/images/comment/vote.down.png">
                                <span class="value">${targetComment['dislikeCount']}</span>
                            </span> 
                            <span class="flex-grow-1"></span>
                            <p class="pointer reply">답글 달기</p>
                            <p class="pointer reply-cancel">답글 달기 취소</p>
                        </div>
                        <form class="reply-form">
                            <label class="label">
                                <textarea name="content" maxlength="1000" placeholder="답글을 입력해 주세요." data-regex="${commentForm['content'].getAttribute('data-regex')}" class="common-input"></textarea>
                            </label>
                            <button class="common-btn">답글 달기</button>
                        </form>` : ''}
                    </div>`, 'text/html').querySelector('.comment');

    const replyForm = commentEl.querySelector('.reply-form');
    if (replyForm) {
        // 답글 달기 눌렀을 때
        commentEl.querySelector('.reply').addEventListener('click', function () {
            const userStatus = document.head.querySelector('meta[name="user-status"]').getAttribute('content');
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
            formData.append('articleId', targetComment['articleId']);
            formData.append('commentId', targetComment['id']); // 어느 댓글의 대댓글인가에 대한 인덱스
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
                comment.alterLike(targetComment['id'], null);
            } else {
                comment.alterLike(targetComment['id'], true);
            }
        })

        // voteDown 눌렀을 때
        voteDown.addEventListener('click', function () {
            const userStatus = document.head.querySelector('meta[name="user-status"]').getAttribute('content');
            if (userStatus !== 'true') {
                alert('로그인 후 이용할 수 있습니다.');
                return false;
            }
            if (voteDown.classList.contains('selected')) { // 이미 voteDown가 눌러져 있을 때
                comment.alterLike(targetComment['id'], null);
            } else {
                comment.alterLike(targetComment['id'], false);
            }
        })
    }
    const deleteEl = commentEl.querySelector('.delete');
    if (deleteEl) {
        // 댓글 삭제 버튼 눌렀을 때
        deleteEl.addEventListener('click', function () {
            if (confirm('정말로 댓글을 삭제 하시겠습니까?')) {

                axios.delete(`/article/comment?id=${targetComment['id']}`)
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
        const modifyForm = commentEl.querySelector('.modify-form');
        // 댓글 수정 버튼 눌렀을 때
        modifyEl.addEventListener('click', function () {
            commentEl.classList.add('modifying');
            modifyForm['content'].value = commentEl.querySelector('.content').innerText;
            modifyForm['content'].focus();
        })
        // 댓글 수정 취소 버튼 눌렀을 때
        modifyCancelEl.addEventListener('click', function () {
            commentEl.classList.remove('modifying');
        })

        modifyForm.onsubmit = function (e) {
            e.preventDefault();
            if (modifyForm['content'].value === '') {
                alert('댓글을 입력해 주세요.');
                return false;
            }
            if (!new RegExp(modifyForm['content'].dataset.regex).test(modifyForm['content'].value)) {
                alert('올바른 댓글을 입력해 주세요.');
                return false;
            }

            const formData = new FormData();
            formData.append('id', targetComment['id']);
            formData.append('content', modifyForm['content'].value);

            axios.patch('/article/comment', formData)
                .then(res => {
                    commentEl.querySelector('.content').innerText = modifyForm['content'].value;
                    commentEl.classList.remove('modifying');
                })
                .catch(err => {
                    alert('알 수 없는 이유로 댓글을 수정하지 못하였습니다. 잠시 후 다시 시도해 주세요.');
                })

        }
    }

    const tbody = commentTable.querySelector('tbody')
    // 댓글 불러오기를 했을 때 초기화 후 comments에서 댓글을 가져오기 위해서(안 그럼 같은 댓글이 밑에 추가로 계속 생김)
    const tr = document.createElement('tr');
    const td = document.createElement('td');
    td.append(commentEl);
    tr.append(td);
    tbody.append(tr);

    const subComments = allComments.filter(x => x['commentId'] === targetComment['id']); // 현재 댓글의 대댓글 배열
    if (subComments.length > 0) {
        for (const subComment of subComments) {
            comment.append(allComments, subComment);
        }
    }
}

// 댓글 불러오기
// comment.load() 함수 생성
comment.load = function () {
    axios.get(`/article/comment?articleId=${commentForm['articleId'].value}`)
        .then(res => {
            const comments = res.data;
            for (const commentObject of comments.filter(x => typeof x['commentId'] !== 'number')) { // 대댓글이 아닌 것만!
                comment.append(comments, commentObject);
            }
            commentForm.querySelector('.count').innerText = comments.length;
        })
        .catch(err => {
            alert('알 수 없는 이유로 댓글을 불러오지 못하였습니다.');
        })

    commentForm.querySelector('.count').innerText = '0';
    // 댓글 불러오기를 했을 때, 이미 있는 댓글은 안 불러오고 remove
    commentTable.querySelector('tbody').innerHTML = '';
    commentTable.classList.remove('error');
}

if (commentForm) {
    commentForm.onsubmit = function (e) {
        e.preventDefault();
        const userStatus = document.head.querySelector('meta[name="user-status"]').getAttribute('content');
        if (userStatus !== 'true') {
            alert('로그인 후 이용할 수 있습니다.');
            return false;
        }
        if (commentForm['content'].value === '') {
            alert('댓글을 입력해 주세요.');
            return false;
        }
        if (!new RegExp(commentForm['content'].dataset.regex).test(commentForm['content'].value)) {
            alert('올바른 댓글을 입력해 주세요.');
            return false;
        }

        const formData = new FormData();
        formData.append('articleId', commentForm['articleId'].value);
        formData.append('content', commentForm['content'].value);

        axios.post('/article/comment', formData)
            .then(res => {
                commentForm['content'].value = '';
                commentForm['content'].focus();
                comment.load();
            })
            .catch(err => {
                alert('알 수 없는 이유로 댓글을 작성하지 못하였습니다. 잠시 후 다시 시도해 주세요.');
            })
    }
}

// 페이지 들어갈 때 댓글 바로 보이게
comment.load();