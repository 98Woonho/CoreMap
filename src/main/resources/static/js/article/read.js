const articleTable = document.getElementById('articleTable');
const commentForm = document.getElementById('commentForm');

// 게시글 삭제
const deleteBtn = articleTable.querySelector('.delete-btn');

deleteBtn.onclick = function (e) {
    e.preventDefault();

    if (confirm('정말로 게시글을 삭제할까요? 게시글에 작성된 댓글이 함께 삭제되며 이는 되돌릴 수 없습니다.')) {
        axios.delete("/article/delete?id=" + articleTable.dataset.id)
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

const commentTable = document.getElementById('commentTable');
const comments = commentTable.querySelectorAll('.comment:not(.sub)');
const currentNickname = document.querySelector('.current-nickname');

comments.forEach(comment => {
    const reply = comment.querySelector('.reply');
    const replyCancel = comment.querySelector('.replyCancel');
    reply.onclick = function (e) {
        e.preventDefault();
        comment.classList.add('replying');
    }

    replyCancel.onclick = function (e) {
        e.preventDefault();
        comment.classList.remove('replying');
    }

    const modify = comment.querySelector('.modify');
    if (currentNickname.value !== comment.querySelector('.nickname').innerText) {
        modify.style.display = 'none';
    }

    const deleteComment = comment.querySelector('.delete');
    if (currentNickname.value !== comment.querySelector('.nickname').innerText && currentNickname.value !== comment.querySelector('.nickname').innerText) {
        deleteComment.style.display = 'none';
    }

    const replyForm = comment.querySelector('.reply-form');
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

        formData.append("content", replyForm['content'].value);
        formData.append("commentId", comment.dataset.id);

        axios.post('/article/subComment', formData)
            .then(res => {
                location.reload();
            })
            .catch(err => {
                alert('알 수 없는 이유로 답글을 작성하지 못하였습니다. 잠시 후 다시 시도해 주세요.');
            })
    }

    const voteUp = comment.querySelector('.vote-up');
    const voteDown = comment.querySelector('.vote-down');
    voteUp.onclick = function (e) {
        if(!voteDown.classList.contains('selected')) {
            e.preventDefault();

            const formData = new FormData();

            formData.append('commentId', comment.dataset.id);

            axios.post('/article/commentLike', formData)
                .then(res => {

                })
                .catch(err => {
                    alert('알 수 없는 이유로 요청을 처리하지 못하였습니다. 잠시 후 다시 시도해 주세요.');
                })
        }
    }

    voteDown.onclick = function (e) {
        e.preventDefault();

        if (!voteDown.classList.contains('selected')) {
            voteDown.classList.add('selected');
            voteUp.classList.remove('selected');
        } else {
            voteDown.classList.remove('selected');
        }
    }
})


commentForm.onsubmit = function (e) {
    e.preventDefault();

    if (commentForm['content'].value === '') {
        alert('댓글을 입력해 주세요.');
        return false;
    }

    if (!new RegExp(commentForm['content'].dataset.regex).test(commentForm['content'].value)) {
        alert('올바른 댓글을 입력해 주세요.');
        return false;
    }

    const formData = new FormData();

    formData.append("commentId", articleTable.dataset.id);
    formData.append("content", commentForm['content'].value);

    axios.post('/article/comment', formData)
        .then(res => {
            location.reload();
        })
        .catch(err => {
            alert('알 수 없는 이유로 댓글을 작성하지 못하였습니다. 잠시 후 다시 시도해 주세요.');
        })
}