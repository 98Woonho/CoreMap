const articleTable = document.getElementById('articleTable');
const commentForm = document.getElementById('commentForm');

// 게시글 삭제
const deleteBtn = articleTable.querySelector('.delete-btn');

if (deleteBtn) {
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
}

const commentTable = document.getElementById('commentTable');
const comments = commentTable.querySelectorAll('.comment:not(.sub)');
const currentNickname = document.querySelector('.current-nickname');

comments.forEach(comment => {
    const reply = comment.querySelector('.reply');
    const replyCancel = comment.querySelector('.reply-cancel');
    reply.onclick = function (e) {
        e.preventDefault();
        comment.classList.add('replying');
    }

    replyCancel.onclick = function (e) {
        e.preventDefault();
        comment.classList.remove('replying');
    }

    const modify = comment.querySelector('.modify');
    const modifyCancel = comment.querySelector('.modify-cancel');
    const modifyForm = comment.querySelector('.modify-form');

    modifyForm.querySelector('textarea').value = comment.querySelector('.content').innerText;

    if(modify) {
        if (currentNickname.value !== comment.querySelector('.nickname').innerText) {
            modify.style.display = 'none';
        }

        modify.onclick = function(e) {
            e.preventDefault();
            comment.classList.add('modifying');
        }

        modifyCancel.onclick = function(e) {
            e.preventDefault();
            comment.classList.remove('modifying');
        }

        modifyForm.onsubmit = function(e) {
            e.preventDefault();

            if (modifyForm['content'].value === '') {
                alert('댓글을 입력해 주세요.');
                return false;
            }

            if (!new RegExp(modifyForm['content'].dataset.regex).test(modifyForm['content'].value.trim())) {
                alert('1000자 이내로 입력해 주세요.');
                return false;
            }

            if (modifyForm.querySelector('textarea').value === comment.querySelector('.content').innerText) {
                alert('기존 댓글과 동일합니다.');
                return false;
            }

            const formData = new FormData();

            formData.append("content", modifyForm['content'].value.trim());
            formData.append("id", comment.dataset.id);

            axios.patch('/article/comment', formData)
                .then(res => {
                    location.reload();
                })
                .catch(err => {
                    alert('알 수 없는 이유로 댓글을 수정하지 못하였습니다. 잠시 후 다시 시도해 주세요.');
                })
        }
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

        if (!new RegExp(replyForm['content'].dataset.regex).test(replyForm['content'].value.trim())) {
            alert('1000자 이내로 입력해 주세요.');
            return false;
        }

        const formData = new FormData();

        formData.append("content", replyForm['content'].value.trim());
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
    if(comment.querySelector('.is-like') != null) {
        const isLike = comment.querySelector('.is-like').value;

        if(isLike === 'true') {
            voteUp.classList.add('selected');
        }

        if(isLike === 'false') {
            voteDown.classList.add('selected');
        }
    }

    voteUp.onclick = function (e) {
        if(!voteUp.classList.contains('selected') && !voteDown.classList.contains('selected')) {
            e.preventDefault();
            const value = voteUp.querySelector('.value');

            const formData = new FormData();

            formData.append('commentId', comment.dataset.id);
            formData.append('isLike', 'true');

            axios.post('/article/commentLike', formData)
                .then(res => {
                    voteUp.classList.add('selected');
                    value.innerText = parseInt(value.innerText, 10) + 1;
                })
                .catch(err => {
                    alert('알 수 없는 이유로 요청을 처리하지 못하였습니다. 잠시 후 다시 시도해 주세요.');
                })
        }

        if(voteDown.classList.contains('selected')) {
            const upValue = voteUp.querySelector('.value');
            const downValue = voteDown.querySelector('.value');

            e.preventDefault();

            const formData = new FormData();

            formData.append('commentId', comment.dataset.id);
            formData.append('isLike', 'true');

            axios.patch('/article/commentLike', formData)
                .then(res => {
                    voteDown.classList.remove('selected');
                    voteUp.classList.add('selected');
                    upValue.innerText = parseInt(upValue.innerText, 10) + 1;
                    downValue.innerText = parseInt(downValue.innerText, 10) - 1;
                })
                .catch(err => {
                    alert('알 수 없는 이유로 요청을 처리하지 못하였습니다. 잠시 후 다시 시도해 주세요.');
                })
        }

        if(voteUp.classList.contains('selected')) {
            e.preventDefault();

            const value = voteUp.querySelector('.value');

            axios.delete(`/article/commentLike?commentId=${comment.dataset.id}`)
                .then(res => {
                    voteUp.classList.remove('selected');
                    value.innerText = parseInt(value.innerText, 10) - 1;
                })
                .catch(err => {
                    alert('알 수 없는 이유로 요청을 처리하지 못하였습니다. 잠시 후 다시 시도해 주세요.');
                })
        }
    }

    voteDown.onclick = function (e) {
        if(!voteUp.classList.contains('selected') && !voteDown.classList.contains('selected')) {
            e.preventDefault();
            const value = voteDown.querySelector('.value');

            const formData = new FormData();

            formData.append('commentId', comment.dataset.id);
            formData.append('isLike', 'false');

            axios.post('/article/commentLike', formData)
                .then(res => {
                    voteDown.classList.add('selected');
                    value.innerText = parseInt(value.innerText, 10) + 1;
                })
                .catch(err => {
                    alert('알 수 없는 이유로 요청을 처리하지 못하였습니다. 잠시 후 다시 시도해 주세요.');
                })
        }

        if(voteUp.classList.contains('selected')) {
            e.preventDefault();

            const upValue = voteUp.querySelector('.value');
            const downValue = voteDown.querySelector('.value');

            const formData = new FormData();

            formData.append('commentId', comment.dataset.id);
            formData.append('isLike', 'false');

            axios.patch('/article/commentLike', formData)
                .then(res => {
                    voteUp.classList.remove('selected');
                    voteDown.classList.add('selected');
                    upValue.innerText = parseInt(upValue.innerText, 10) - 1;
                    downValue.innerText = parseInt(downValue.innerText, 10) + 1;
                })
                .catch(err => {
                    alert('알 수 없는 이유로 요청을 처리하지 못하였습니다. 잠시 후 다시 시도해 주세요.');
                })
        }

        if(voteDown.classList.contains('selected')) {
            const value = voteDown.querySelector('.value');

            e.preventDefault();

            axios.delete(`/article/commentLike?commentId=${comment.dataset.id}`)
                .then(res => {
                    voteDown.classList.remove('selected');
                    value.innerText = parseInt(value.innerText, 10) - 1;
                })
                .catch(err => {
                    alert('알 수 없는 이유로 요청을 처리하지 못하였습니다. 잠시 후 다시 시도해 주세요.');
                })
        }
    }
})



const subComments = commentTable.querySelectorAll('.comment.sub');

subComments.forEach(subComment => {
    const modify = subComment.querySelector('.modify');
    const modifyCancel = subComment.querySelector('.modify-cancel');
    const subCommentModifyForm = subComment.querySelector('.sub-comment-modify-form');

    subCommentModifyForm.querySelector('textarea').value = subComment.querySelector('.content').innerText;

    if(modify) {
        if (currentNickname.value !== subComment.querySelector('.nickname').innerText) {
            modify.style.display = 'none';
        }

        modify.onclick = function(e) {
            e.preventDefault();
            subComment.classList.add('modifying');
        }

        modifyCancel.onclick = function(e) {
            e.preventDefault();
            subComment.classList.remove('modifying');
        }
    }

    const deleteComment = subComment.querySelector('.delete');
    if (currentNickname.value !== subComment.querySelector('.nickname').innerText && currentNickname.value !== subComment.querySelector('.nickname').innerText) {
        deleteComment.style.display = 'none';
    }

    const voteUp = subComment.querySelector('.vote-up');
    const voteDown = subComment.querySelector('.vote-down');
    if(subComment.querySelector('.is-like') != null) {
        const isLike = subComment.querySelector('.is-like').value;

        if(isLike === 'true') {
            voteUp.classList.add('selected');
        }

        if(isLike === 'false') {
            voteDown.classList.add('selected');
        }
    }

    voteUp.onclick = function (e) {
        if(!voteUp.classList.contains('selected') && !voteDown.classList.contains('selected')) {
            e.preventDefault();
            const value = voteUp.querySelector('.value');

            const formData = new FormData();

            formData.append('subCommentId', subComment.dataset.id);
            formData.append('isLike', 'true');

            axios.post('/article/subCommentLike', formData)
                .then(res => {
                    voteUp.classList.add('selected');
                    value.innerText = parseInt(value.innerText, 10) + 1;
                })
                .catch(err => {
                    alert('알 수 없는 이유로 요청을 처리하지 못하였습니다. 잠시 후 다시 시도해 주세요.');
                })
        }

        if(voteDown.classList.contains('selected')) {
            e.preventDefault();
            const upValue = voteUp.querySelector('.value');
            const downValue = voteDown.querySelector('.value');

            const formData = new FormData();

            formData.append('subCommentId', subComment.dataset.id);
            formData.append('isLike', 'true');

            axios.patch('/article/subCommentLike', formData)
                .then(res => {
                    voteDown.classList.remove('selected');
                    voteUp.classList.add('selected');
                    upValue.innerText = parseInt(upValue.innerText, 10) + 1;
                    downValue.innerText = parseInt(downValue.innerText, 10) - 1;
                })
                .catch(err => {
                    alert('알 수 없는 이유로 요청을 처리하지 못하였습니다. 잠시 후 다시 시도해 주세요.');
                })
        }

        if(voteUp.classList.contains('selected')) {
            e.preventDefault();

            const value = voteUp.querySelector('.value');

            axios.delete(`/article/subCommentLike?subCommentId=${subComment.dataset.id}`)
                .then(res => {
                    voteUp.classList.remove('selected');
                    value.innerText = parseInt(value.innerText, 10) - 1;
                })
                .catch(err => {
                    alert('알 수 없는 이유로 요청을 처리하지 못하였습니다. 잠시 후 다시 시도해 주세요.');
                })
        }
    }

    voteDown.onclick = function (e) {
        if(!voteUp.classList.contains('selected') && !voteDown.classList.contains('selected')) {
            e.preventDefault();
            const value = voteDown.querySelector('.value');

            const formData = new FormData();

            formData.append('subCommentId', subComment.dataset.id);
            formData.append('isLike', 'false');

            axios.post('/article/subCommentLike', formData)
                .then(res => {
                    voteDown.classList.add('selected');
                    value.innerText = parseInt(value.innerText, 10) + 1;
                })
                .catch(err => {
                    alert('알 수 없는 이유로 요청을 처리하지 못하였습니다. 잠시 후 다시 시도해 주세요.');
                })
        }

        if(voteUp.classList.contains('selected')) {
            e.preventDefault();

            const upValue = voteUp.querySelector('.value');
            const downValue = voteDown.querySelector('.value');

            const formData = new FormData();

            formData.append('subCommentId', subComment.dataset.id);
            formData.append('isLike', 'false');

            axios.patch('/article/subCommentLike', formData)
                .then(res => {
                    voteUp.classList.remove('selected');
                    voteDown.classList.add('selected');
                    upValue.innerText = parseInt(upValue.innerText, 10) - 1;
                    downValue.innerText = parseInt(downValue.innerText, 10) + 1;
                })
                .catch(err => {
                    alert('알 수 없는 이유로 요청을 처리하지 못하였습니다. 잠시 후 다시 시도해 주세요.');
                })
        }

        if(voteDown.classList.contains('selected')) {
            e.preventDefault();

            const value = voteDown.querySelector('.value');


            axios.delete(`/article/subCommentLike?subCommentId=${subComment.dataset.id}`)
                .then(res => {
                    voteDown.classList.remove('selected');
                    value.innerText = parseInt(value.innerText, 10) - 1;
                })
                .catch(err => {
                    alert('알 수 없는 이유로 요청을 처리하지 못하였습니다. 잠시 후 다시 시도해 주세요.');
                })
        }
    }
})



commentForm.onsubmit = function (e) {
    e.preventDefault();

    if (commentForm['content'].value === '') {
        alert('댓글을 입력해 주세요.');
        return false;
    }


    if (!new RegExp(commentForm['content'].dataset.regex).test(commentForm['content'].value.trim())) {
        alert('1000자 이내로 입력해 주세요.');
        return false;
    }

    const formData = new FormData();

    formData.append("articleId", articleTable.dataset.id);
    formData.append("content", commentForm['content'].value.trim());

    axios.post('/article/comment', formData)
        .then(res => {
            location.reload();
        })
        .catch(err => {
            alert('알 수 없는 이유로 댓글을 작성하지 못하였습니다. 잠시 후 다시 시도해 주세요.');
        })
}

