const modifyForm = document.getElementById('modifyForm');

const modifyBtn = modifyForm.querySelector('.modify-btn');
const inputs = modifyForm.querySelectorAll('input');

inputs.forEach(input => {
    input.addEventListener('input', function() {
        modifyBtn.removeAttribute('disabled');
    })
})

modifyForm['nickname'].addEventListener('input', function() {
    modifyForm['confirmDuplication'].removeAttribute('disabled');
})

const nicknameWarning = modifyForm.querySelector('.nickname-warning');

modifyForm['nickname'].addEventListener('blur', function () {
    if (modifyForm['nickname'].value === '') {
        nicknameWarning.innerText = "닉네임을 입력해 주세요.";
        nicknameWarning.style.color = '#ED5353';
    } else if (!new RegExp(modifyForm['nickname'].dataset.regex).test(modifyForm['nickname'].value)) {
        nicknameWarning.innerText = "10자 이내 또는 올바른 닉네임을 입력해 주세요.";
        nicknameWarning.style.color = '#ED5353';
    }

    if (new RegExp(modifyForm['nickname'].dataset.regex).test(modifyForm['nickname'].value)) {
        nicknameWarning.innerText = "";
    }
})

modifyForm['confirmDuplication'].onclick = function (e) {
    e.preventDefault();

    const nickname = modifyForm['nickname'];

    if (nickname.value === '') {
        alert('닉네임을 입력해 주세요.');
        return false;
    }

    if (nickname.value === modifyForm['currentNickname'].value) {
        alert('기존 닉네임과 동일합니다.');
        return false;
    }

    if (!new RegExp(nickname.dataset.regex).test(nickname.value)) {
        alert('10자 이내 또는 올바른 닉네임을 입력해 주세요.');
        return false;
    }

    axios.get("/user/confirmDuplication?nickname=" + nickname.value)
        .then(res => {
            if (res.data === 'FAILURE_DUPLICATED_NICKNAME') {
                alert("이미 존재하는 닉네임 입니다. 다른 닉네임을 입력해 주세요.");
            } else if (res.data === 'SUCCESS') {
                alert("사용 가능한 닉네임 입니다.");
                nickname.classList.add("confirmed");
            }
        })
        .catch(err => {
            console.log(err);
        })
}

modifyForm.onsubmit = function(e) {
    e.preventDefault();

    if (modifyForm['nickname'].value === "") {
        alert('닉네임을 입력해 주세요.');
        modifyForm['nickname'].focus();
        return false;
    }

    if (!modifyForm['nickname'].classList.contains('confirmed')) {
        alert('닉네임 중복확인을 진행해 주세요.');
        return false;
    }

    const formData = new FormData();
    formData.append('nickname', modifyForm['nickname'].value);

    axios.patch('/user/modify', formData)
        .then(res => {
            if (res.data === 'SUCCESS') {
                alert('개인정보 수정이 완료 되었습니다.');
                location.reload();
            }
        })
        .catch(err => {
            alert('알 수 없는 이유로 개인정보 수정에 실패 하였습니다. 잠시 후 다시 시도해 주세요.');
        })
}