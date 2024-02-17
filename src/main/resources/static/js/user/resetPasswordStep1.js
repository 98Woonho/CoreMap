const resetPasswordStep1Form = document.getElementById('resetPasswordStep1Form');

const emailWarning = resetPasswordStep1Form.querySelector('.email-warning');

resetPasswordStep1Form['email'].addEventListener('blur', function () {
    if (resetPasswordStep1Form['email'].value === '') {
        emailWarning.innerText = "이메일을 입력해 주세요.";
        emailWarning.style.color = '#ED5353';
    } else if (!new RegExp(resetPasswordStep1Form['email'].dataset.regex).test(resetPasswordStep1Form['email'].value)) {
        emailWarning.innerText = "올바른 이메일을 입력해 주세요.";
        emailWarning.style.color = '#ED5353';
    }

    if (new RegExp(resetPasswordStep1Form['email'].dataset.regex).test(resetPasswordStep1Form['email'].value)) {
        emailWarning.innerText = "";
    }
})

resetPasswordStep1Form['emailSend'].onclick = function (e) {
    e.preventDefault();

    if (resetPasswordStep1Form['email'].value === '') {
        alert('이메일을 입력해 주세요.');
        return;
    }
    if (!new RegExp(resetPasswordStep1Form['email'].dataset.regex).test(resetPasswordStep1Form['email'].value)) {
        alert('올바른 이메일을 입력해주세요.');
        return;
    }
    loading.show();

    const formData = new FormData();
    formData.append('email', resetPasswordStep1Form['email'].value);
    formData.append('resetPassword', true);
    axios.post('/user/sendMail', formData)
        .then(res => {
            loading.hide();
            if (res.data.result === 'SUCCESS') {
                resetPasswordStep1Form['emailSalt'].value = res.data.salt;
                resetPasswordStep1Form['email'].setAttribute('disabled', ''); // name="infoEmail"인 태그에 disabled 속성 추가. ''은 속성값인데 disabled는 속성값이 없으므로 공백.
                resetPasswordStep1Form['emailSend'].setAttribute('disabled', ''); // name="infoEmailSend"인 태그에 disabled 속성 추가. ''은 속성값인데 disabled는 속성값이 없으므로 공백.
                resetPasswordStep1Form['emailCode'].removeAttribute('disabled'); // name="infoEmailCode"인 태그에 disabled 속성 제거
                resetPasswordStep1Form['emailVerify'].removeAttribute('disabled'); // name="infoEmailVerify"인 태그에 disabled 속성 제거
                alert('입력하신 이메일로 인증번호가 포함된 메일을 전송하였습니다. 해당 인증번호는 5분간만 유효하니 유의해 주세요.');
            }
        })
        .catch(err => {
            loading.hide();
            alert('알 수 없는 이유로 인증번호를 전송하지 못하였습니다. 잠시 후 다시 시도해 주세요.');
        });
}


resetPasswordStep1Form['emailVerify'].onclick = function () {
    if (resetPasswordStep1Form['emailCode'] === '') {
        alert('인증번호를 입력해 주세요.');
        return;
    }
    if (!new RegExp(resetPasswordStep1Form['emailCode'].dataset.regex).test((resetPasswordStep1Form['emailCode'].value))) {
        alert('올바른 인증번호를 입력해 주세요.');
        return;
    }

    const formData = new FormData();
    formData.append('email', resetPasswordStep1Form['email'].value);
    formData.append('code', resetPasswordStep1Form['emailCode'].value);
    formData.append('salt', resetPasswordStep1Form['emailSalt'].value);

    axios.patch('/user/sendMail', formData)
        .then(res => {
            if (res.data === 'SUCCESS') {
                alert('인증번호가 정상적으로 확인 되었습니다.');
                resetPasswordStep1Form['emailCode'].setAttribute('disabled', '');
                resetPasswordStep1Form['emailVerify'].setAttribute('disabled', '');
            } else if (res.data === 'FAILURE_EXPIRED') {
                alert('인증번호를 5분 내에 입력하지 않아 만료 되었습니다. 아래 확인 버튼을 눌러 이메일 인증을 재진행해 주세요.');
                resetPasswordStep1Form['emailSalt'].value = '';
                resetPasswordStep1Form['email'].removeAttribute('disabled');
                resetPasswordStep1Form['email'].focus();
                resetPasswordStep1Form['email'].select();
                resetPasswordStep1Form['emailSend'].removeAttribute('disabled');
                resetPasswordStep1Form['emailCode'].value = '';
                resetPasswordStep1Form['emailCode'].setAttribute('disabled', '');
                resetPasswordStep1Form['emailVerify'].setAttribute('disabled', '');
            } else if (res.data === 'FAILURE_INVALID_CODE') {
                alert('이메일 인증번호가 올바르지 않습니다. 입력하신 인증번호를 다시 확인해 주세요.');
                resetPasswordStep1Form['emailCode'].focus();
                resetPasswordStep1Form['emailCode'].select();
            }
        })
        .catch(err => {
            alert('알 수 없는 이유로 인증번호를 확인하지 못하였습니다. 잠시 후 다시 시도해 주세요.');
        });
}

resetPasswordStep1Form.onsubmit = function(e) {
    e.preventDefault()
    if (resetPasswordStep1Form['email'].value === "") {
        alert("이메일을 입력해 주세요.");
        resetPasswordStep1Form['email'].focus();
        return false;
    }

    if (!new RegExp(resetPasswordStep1Form['email'].dataset.regex).test(resetPasswordStep1Form['email'].value)) {
        alert('올바른 이메일을 입력해 주세요.');
        resetPasswordStep1Form['email'].focus();
        return false;
    }

    if (resetPasswordStep1Form['emailCode'].value === "") {
        alert("인증번호를 입력해 주세요.");
        resetPasswordStep1Form['emailCode'].focus();
        return false;
    }

    if (!new RegExp(resetPasswordStep1Form['emailCode'].dataset.regex).test(resetPasswordStep1Form['emailCode'].value)) {
        alert('올바른 인증번호를 입력해 주세요.');
        resetPasswordStep1Form['emailCode'].focus();
        return false;
    }

    if (!resetPasswordStep1Form['email'].hasAttribute('disabled') || !resetPasswordStep1Form['emailCode'].hasAttribute('disabled')) {
        alert('인증번호 확인 버튼을 통해 인증번호를 확인해 주세요.');
        return false;
    }

    const formData = new FormData();
    formData.append('username', resetPasswordStep1Form['email'].value);

    axios.post('/user/resetPasswordStep1', formData)
        .then(res => {
            if(res.data === 'FAILURE_EMPTY_USERNAME') {
                alert('존재하지 않는 이메일입니다.');
                location.reload();
            } else {
                location.href = `/user/resetPasswordStep2?username=${resetPasswordStep1Form['email'].value}`
            }
        })
        .catch(err => {
            alert('알 수 없는 이유로 요청을 처리하지 못하였습니다. 잠시 후 다시 시도해 주세요.');
        })
}