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
const comments = commentTable.querySelectorAll('.comment:not(.sub)'); // 모든 댓글

comments.forEach(comment => {
        const reply = comment.querySelector('.reply'); // 답글 달기
        const replyCancel = comment.querySelector('.reply-cancel'); // 답글 취소
        const replyForm = comment.querySelector('.reply-form'); // 답글 form

        // 답글 달기 click 함수
        reply.onclick = function (e) {
            e.preventDefault();

            if (document.head.querySelector('[name="user-status"]').getAttribute('content') === 'false') {
                alert('로그인 후에 이용 가능합니다. 로그인 후 이용 해주세요.');
                return false;
            }

            if (document.head.querySelector('[name="info-status"]') != null) {
                if (document.head.querySelector('[name="info-status"]').getAttribute('content') === 'false') {
                    e.preventDefault();
                    alert('마이페이지에서 개인정보를 모두 입력해 주세요.');
                    return false;
                }
            }


            comment.classList.add('replying');
        }

        // 답글 취소 click 함수
        replyCancel.onclick = function (e) {
            e.preventDefault();
            comment.classList.remove('replying');
        }

        // 답글 form submit 함수
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

        const modify = comment.querySelector('.modify'); // 댓글 수정
        const modifyCancel = comment.querySelector('.modify-cancel'); // 댓글 수정 취소
        const modifyForm = comment.querySelector('.modify-form'); // 댓글 수정 form

        modifyForm.querySelector('textarea').value = comment.querySelector('.content').innerText;

        if (modify) {
            // 댓글 수정 click 함수
            modify.onclick = function (e) {
                e.preventDefault();
                comment.classList.add('modifying');
            }

            // 댓글 수정 취소 click 함수
            modifyCancel.onclick = function (e) {
                e.preventDefault();
                comment.classList.remove('modifying');
            }

            // 댓글 수정 form submit 함수
            modifyForm.onsubmit = function (e) {
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

        const Delete = comment.querySelector('.delete'); // 댓글 삭제

        if (Delete) {
            // 댓글 삭제 click 함수
            Delete.onclick = function (e) {
                e.preventDefault();

                if (confirm('정말로 댓글을 삭제 할까요? 댓글을 삭제 할 시 답글도 함께 삭제 됩니다.')) {
                    axios.delete("/article/comment?id=" + comment.dataset.id)
                        .then(res => {
                            if (res.data === 'SUCCESS') {
                                location.reload();
                            }
                        })
                        .catch(err => {
                            alert('알 수 없는 이유로 댓글을 삭제하지 못하였습니다. 잠시 후 다시 시도해 주세요.');
                        })
                } else {
                    return false;
                }
            }
        }

        const voteUp = comment.querySelector('.vote-up'); // 댓글 좋아요
        const voteDown = comment.querySelector('.vote-down'); // 댓글 싫어요
        if (comment.querySelector('.is-like') != null) {
            const isLike = comment.querySelector('.is-like').value;

            if (isLike === 'true') {
                voteUp.classList.add('selected');
            }

            if (isLike === 'false') {
                voteDown.classList.add('selected');
            }
        }

        // 댓글 좋아요 click 함수
        voteUp.onclick = function (e) {
            if (!voteUp.classList.contains('selected') && !voteDown.classList.contains('selected')) {
                e.preventDefault();

                if (document.head.querySelector('[name="user-status"]').getAttribute('content') === 'false') {
                    alert('로그인 후에 이용 가능합니다. 로그인 후 이용 해주세요.');
                    return false;
                }

                if (document.head.querySelector('[name="info-status"]') != null) {
                    if (document.head.querySelector('[name="info-status"]').getAttribute('content') === 'false') {
                        e.preventDefault();
                        alert('마이페이지에서 개인정보를 모두 입력해 주세요.');
                        return false;
                    }
                }

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

            if (voteDown.classList.contains('selected')) {
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

            if (voteUp.classList.contains('selected')) {
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

        // 댓글 싫어요 click 함수
        voteDown.onclick = function (e) {
            if (!voteUp.classList.contains('selected') && !voteDown.classList.contains('selected')) {

                if (document.head.querySelector('[name="user-status"]').getAttribute('content') === 'false') {
                    alert('로그인 후에 이용 가능합니다. 로그인 후 이용 해주세요.');
                    return false;
                }

                if (document.head.querySelector('[name="info-status"]') != null) {
                    if (document.head.querySelector('[name="info-status"]').getAttribute('content') === 'false') {
                        e.preventDefault();
                        alert('마이페이지에서 개인정보를 모두 입력해 주세요.');
                        return false;
                    }
                }

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

            if (voteUp.classList.contains('selected')) {
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

            if (voteDown.classList.contains('selected')) {
                e.preventDefault();

                const value = voteDown.querySelector('.value');

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
    }
)


const subComments = commentTable.querySelectorAll('.comment.sub'); // 모든 답글(대댓글)

subComments.forEach(subComment => {
        const modify = subComment.querySelector('.modify'); // 답글 수정
        const modifyCancel = subComment.querySelector('.modify-cancel'); // 답글 수정 취소
        const subCommentModifyForm = subComment.querySelector('.sub-comment-modify-form'); // 답글 수정 form

        subCommentModifyForm.querySelector('textarea').value = subComment.querySelector('.content').innerText;

        if (modify) {
            // 답글 수정 click 함수
            modify.onclick = function (e) {
                e.preventDefault();
                subComment.classList.add('modifying');
            }

            // 답글 수정 취소 click 함수
            modifyCancel.onclick = function (e) {
                e.preventDefault();
                subComment.classList.remove('modifying');
            }

            // 답글 수정 form submit 함수
            subCommentModifyForm.onsubmit = function (e) {
                e.preventDefault();

                if (subCommentModifyForm['content'].value === '') {
                    alert('댓글을 입력해 주세요.');
                    return false;
                }

                if (!new RegExp(subCommentModifyForm['content'].dataset.regex).test(subCommentModifyForm['content'].value.trim())) {
                    alert('1000자 이내로 입력해 주세요.');
                    return false;
                }

                if (subCommentModifyForm.querySelector('textarea').value === subComment.querySelector('.content').innerText) {
                    alert('기존 댓글과 동일합니다.');
                    return false;
                }

                const formData = new FormData();

                formData.append("content", subCommentModifyForm['content'].value.trim());
                formData.append("id", subComment.dataset.id);

                axios.patch('/article/subComment', formData)
                    .then(res => {
                        location.reload();
                    })
                    .catch(err => {
                        alert('알 수 없는 이유로 답글을 수정하지 못하였습니다. 잠시 후 다시 시도해 주세요.');
                    })
            }
        }

        const Delete = subComment.querySelector('.delete'); // 답글 삭제

        if (Delete) {
            // 답글 삭제 click 함수
            Delete.onclick = function (e) {
                e.preventDefault();

                if (confirm('정말로 답글을 삭제 할까요?')) {
                    axios.delete("/article/subComment?id=" + subComment.dataset.id)
                        .then(res => {
                            if (res.data === 'SUCCESS') {
                                location.reload();
                            }
                        })
                        .catch(err => {
                            alert('알 수 없는 이유로 답글을 삭제하지 못하였습니다. 잠시 후 다시 시도해 주세요.');
                        })
                } else {
                    return false;
                }
            }
        }

        const voteUp = subComment.querySelector('.vote-up'); // 답글 좋아요
        const voteDown = subComment.querySelector('.vote-down'); // 답글 싫어요
        if (subComment.querySelector('.is-like') != null) {
            const isLike = subComment.querySelector('.is-like').value;

            if (isLike === 'true') {
                voteUp.classList.add('selected');
            }

            if (isLike === 'false') {
                voteDown.classList.add('selected');
            }
        }

        voteUp.onclick = function (e) {
            if (!voteUp.classList.contains('selected') && !voteDown.classList.contains('selected')) {
                e.preventDefault();

                if (document.head.querySelector('[name="user-status"]').getAttribute('content') === 'false') {
                    alert('로그인 후에 이용 가능합니다. 로그인 후 이용 해주세요.');
                    return false;
                }

                if (document.head.querySelector('[name="info-status"]') != null) {
                    if (document.head.querySelector('[name="info-status"]').getAttribute('content') === 'false') {
                        e.preventDefault();
                        alert('마이페이지에서 개인정보를 모두 입력해 주세요.');
                        return false;
                    }
                }

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

            if (voteDown.classList.contains('selected')) {
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

            if (voteUp.classList.contains('selected')) {
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
            if (!voteUp.classList.contains('selected') && !voteDown.classList.contains('selected')) {
                e.preventDefault();

                if (document.head.querySelector('[name="user-status"]').getAttribute('content') === 'false') {
                    alert('로그인 후에 이용 가능합니다. 로그인 후 이용 해주세요.');
                    return false;
                }

                if (document.head.querySelector('[name="info-status"]') != null) {
                    if (document.head.querySelector('[name="info-status"]').getAttribute('content') === 'false') {
                        e.preventDefault();
                        alert('마이페이지에서 개인정보를 모두 입력해 주세요.');
                        return false;
                    }
                }

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

            if (voteUp.classList.contains('selected')) {
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

            if (voteDown.classList.contains('selected')) {
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
    }
)

// 댓글 form submit 함수
if (commentForm) {
    commentForm.onsubmit = function (e) {
        e.preventDefault();

        if (document.head.querySelector('[name="user-status"]').getAttribute('content') === 'false') {
            alert('로그인 후에 이용 가능합니다. 로그인 후 이용 해주세요.');
            return false;
        }

        if (document.head.querySelector('[name="info-status"]') !== null) {
            if (document.head.querySelector('[name="info-status"]').getAttribute('content') === 'false') {
                e.preventDefault();
                alert('마이페이지에서 개인정보를 모두 입력해 주세요.');
                return false;
            }
        }


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
}