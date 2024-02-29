const resetPasswordStep2Form = document.getElementById('resetPasswordStep2Form'); // 비밀번호 재설정 step2 form

const passwordWarning = resetPasswordStep2Form.querySelector('.password-warning'); // 비밀번호 경고 문구
const passwordCheckWarning = resetPasswordStep2Form.querySelector('.password-check-warning'); // 비밀번호 재입력 경고 문구

resetPasswordStep2Form['password'].addEventListener('input', function () {
    if (!new RegExp(resetPasswordStep2Form['password'].dataset.regex).test(resetPasswordStep2Form['password'].value)) {
        passwordWarning.innerText = "영문, 숫자, 특수문자를 포함한 8~15자를 입력해 주세요.";
        passwordWarning.style.color = '#ED5353';
    } else {
        passwordWarning.innerText = "사용가능한 비밀번호 입니다.";
        passwordWarning.style.color = '#3ED43D';
    }

    if (resetPasswordStep2Form['passwordCheck'].value !== '') {
        if (resetPasswordStep2Form['password'].value !== (resetPasswordStep2Form['passwordCheck'].value)) {
            passwordCheckWarning.innerText = "비밀번호가 일치하지 않습니다.";
            passwordCheckWarning.style.color = '#ED5353';
        } else {
            passwordCheckWarning.innerText = "비밀번호가 일치합니다.";
            passwordCheckWarning.style.color = '#3ED43D';
        }
    }
})

resetPasswordStep2Form['passwordCheck'].addEventListener('input', function () {
    if (resetPasswordStep2Form['passwordCheck'].value !== '') {
        if (resetPasswordStep2Form['password'].value !== resetPasswordStep2Form['passwordCheck'].value) {
            passwordCheckWarning.innerText = "비밀번호가 일치하지 않습니다.";
            passwordCheckWarning.style.color = '#ED5353';
        } else {
            passwordCheckWarning.innerText = "비밀번호가 일치합니다.";
            passwordCheckWarning.style.color = '#3ED43D';
        }
    }
})

// 비밀번호 재설정 step2 submit 함수
resetPasswordStep2Form.onsubmit = function(e) {
    e.preventDefault();

    if (resetPasswordStep2Form['password'].value === "") {
        alert('비밀번호를 입력해 주세요.');
        resetPasswordStep2Form['password'].focus();
        return false;
    }

    if (!new RegExp(resetPasswordStep2Form['password'].dataset.regex).test(resetPasswordStep2Form['password'].value)) {
        alert('영문,숫자,특수문자가 1개 이상 포함된 8자리 이상 15자리 이하의 비밀번호를 입력해 주세요.');
        resetPasswordStep2Form['password'].focus();
        return false;
    }

    if (resetPasswordStep2Form['passwordCheck'].value === "") {
        alert('비밀번호를 다시 한 번 입력해 주세요.');
        resetPasswordStep2Form['passwordCheck'].focus();
        return false;
    }

    if (resetPasswordStep2Form['password'].value !== resetPasswordStep2Form['passwordCheck'].value) {
        alert('비밀번호가 일치하지 않습니다. 다시 한 번 확인해 주세요.');
        resetPasswordStep2Form['passwordCheck'].focus();
        return false;
    }

    const formData = new FormData();
    formData.append("username", resetPasswordStep2Form['username'].value);
    formData.append("password", resetPasswordStep2Form['password'].value);

    axios.post('/user/resetPasswordStep2', formData)
        .then(res => {
            if(res.data === "FAILURE_SAME_PASSWORD") {
                alert('기존 비밀번호와 동일합니다. 다른 비밀번호를 입력해 주세요.');
                return false;
            } else if(res.data === "SUCCESS") {
                alert('비밀번호 재설정이 완료 되었습니다. 로그인 페이지로 이동합니다.');
                location.href = '/user/login';
            }
        })
        .catch(err => {
            alert('알 수 없는 이유로 비밀번호 재설정에 실패 하였습니다. 잠시 후 다시 시도해 주세요.');
        })
}