const writeBtn = document.getElementById('writeBtn');

writeBtn.addEventListener('click', function(e) {
    if (document.head.querySelector('[name="user-status"]').getAttribute('content') === 'false') {
        e.preventDefault();
        alert('로그인 후에 이용 가능합니다. 로그인 후 이용 해주세요.');
        return false;
    }

    if(document.querySelector('[name="info-status"]').getAttribute('content') === 'false') {
        e.preventDefault();
        alert('마이페이지에서 개인정보를 모두 입력해 주세요.');
        return false;
    }
})