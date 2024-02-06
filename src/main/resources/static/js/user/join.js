const mainForm = document.getElementById('mainForm');
const addressFind = document.getElementById('addressFind');

mainForm['addressFind'].onclick = function () {
    new daum.Postcode({
        width: '100%',
        height: '100%',
        oncomplete: function (data) {
            mainForm['addressPostal'].value = data['zonecode'];
            mainForm['addressPrimary'].value = data['address'];
            addressFind.classList.remove('visible');
            mainForm['addressSecondary'].focus();
            mainForm['addressSecondary'].select();
        }
    }).embed(addressFind.querySelector(':scope > .modal'))
    addressFind.classList.add('visible');
}

addressFind.querySelector('[rel="close"]').onclick = function () {
    addressFind.classList.remove('visible');
}


mainForm['emailSend'].onclick = function () {
    if (mainForm['email'].value === '') {
        alert('이메일을 입력해 주세요.');
        return;
    }
    if (!new RegExp(mainForm['email'].dataset.regex).test(mainForm['email'].value)) {
        alert('올바른 이메일을 입력해주세요.');
        return;
    }
    loading.show();

    const formData = new FormData();
    formData.append('email', mainForm['email'].value);
    axios.post('/user/sendMail', formData)
        .then(res => {
            loading.hide();
            if (res.data.result === 'SUCCESS') {
                mainForm['emailSalt'].value = res.data.salt;
                mainForm['email'].setAttribute('disabled', ''); // name="infoEmail"인 태그에 disabled 속성 추가. ''은 속성값인데 disabled는 속성값이 없으므로 공백.
                mainForm['emailSend'].setAttribute('disabled', ''); // name="infoEmailSend"인 태그에 disabled 속성 추가. ''은 속성값인데 disabled는 속성값이 없으므로 공백.
                mainForm['emailCode'].removeAttribute('disabled'); // name="infoEmailCode"인 태그에 disabled 속성 제거
                mainForm['emailVerify'].removeAttribute('disabled'); // name="infoEmailVerify"인 태그에 disabled 속성 제거
                alert('입력하신 이메일로 인증번호가 포함된 메일을 전송하였습니다. 해당 인증번호는 5분간만 유효하니 유의해 주세요.');
            } else if(res.data.result === 'FAILURE_DUPLICATE_EMAIL') {
                alert('해당 이메일은 이미 사용 중입니다. 잠시 후 다시 시도해 주세요.');
            } else {
                alert('알 수 없는 이유로 인증번호를 전송하지 못하였습니다. 잠시 후 다시 시도해 주세요.');
            }
        })
        .catch(err => {
            alert('요청을 전송하는 도중에 오류가 발생하였습니다. 잠시 후 다시 시도해 주세요.');
        });
}

mainForm['emailVerify'].onclick = function () {
    if (mainForm['emailCode'] === '') {
        alert('인증번호를 입력해 주세요.');
        return;
    }
    if (!new RegExp(mainForm['emailCode'].dataset.regex).test((mainForm['emailCode'].value))) {
        alert('올바른 인증번호를 입력해 주세요.');
        return;
    }

    const formData = new FormData();
    formData.append('email', mainForm['email'].value);
    formData.append('code', mainForm['emailCode'].value);
    formData.append('salt', mainForm['emailSalt'].value);

    axios.patch('/user/sendMail', formData)
        .then(res => {
            console.log(res);
            if (res.data === 'SUCCESS') {
                alert('인증번호가 정상적으로 확인 되었습니다.');
                mainForm['emailCode'].setAttribute('disabled', '');
                mainForm['emailVerify'].setAttribute('disabled', '');
            } else if (res.data === 'FAILURE_EXPIRED') {
                alert('인증번호를 5분 내에 입력하지 않아 만료 되었습니다. 아래 확인 버튼을 눌러 이메일 인증을 재진행해 주세요.');
                mainForm['emailSalt'].value = '';
                mainForm['email'].removeAttribute('disabled');
                mainForm['email'].focus();
                mainForm['email'].select();
                mainForm['emailSend'].removeAttribute('disabled');
                mainForm['emailCode'].value = '';
                mainForm['emailCode'].setAttribute('disabled', '');
                mainForm['emailVerify'].setAttribute('disabled', '');
            } else if (res.data === 'FAILURE_INVALID_CODE') {
                alert('이메일 인증번호가 올바르지 않습니다. 입력하신 인증번호를 다시 확인해 주세요.');
                mainForm['emailCode'].focus();
                mainForm['emailCode'].select();
            } else {
                alert('알 수 없는 이유로 인증번호를 확인하지 못하였습니다. 잠시 후 다시 시도해 주세요.');
            }
        })
        .catch(err => {
            alert('서버가 예상치 못한 응답을 반환하였습니다. 잠시 후 다시 시도해 주세요.');
        });
}

mainForm.onsubmit = function(e) {
    e.preventDefault();

    // if(mainForm['email'].value === "") {
    //     alert("이메일을 입력해 주세요.");
    //     return;
    // }
    //
    // if (!new RegExp(mainForm['email'].dataset.regex).test(mainForm['email'].value)) {
    //     alert('올바른 이메일을 입력해 주세요.');
    //     return;
    // }
    //
    // if (mainForm['emailCode'].value === "") {
    //     alert("인증번호를 입력해 주세요.");
    //     return;
    // }
    //
    // if (!new RegExp(mainForm['emailCode'].dataset.regex).test(mainForm['emailCode'].value)) {
    //     alert('올바른 인증코드를 입력해 주세요.');
    //     return;
    // }
    //
    // if (!mainForm['email'].hasAttribute('disabled') || !mainForm['emailCode'].hasAttribute('disabled')) {
    //     console.log("hi");
    //     alert('인증번호 확인 버튼을 통해 인증번호를 확인해 주세요.');
    //     return;
    // }

    if (mainForm['password'].value === "") {
        alert('비밀번호를 입력해 주세요.');
        return;
    }

    if (!new RegExp(mainForm['password'].dataset.regex).test(mainForm['password'].value)) {
        alert('영문,숫자,특수문자가 1개 이상 포함된 8자리 이상 15자리 이하의 비밀번호를 입력해 주세요.');
        return;
    }

    if (mainForm['passwordCheck'].value === "") {
        alert('비밀번호를 다시 한 번 입력해 주세요.');
        return;
    }

    if (mainForm['password'].value !== mainForm['passwordCheck'].value) {
        alert('비밀번호가 일치하지 않습니다. 다시 한 번 확인해 주세요.');
        return;
    }

    if (mainForm['nickname'].value === "") {
        alert('닉네임을 입력해 주세요.');
        return;
    }

    if (!new RegExp(mainForm['nickname'].dataset.regex).test(mainForm['nickname'].value)) {
        alert('올바른 닉네임을 입력해 주세요.');
        return;
    }

    if (mainForm['name'].value === "") {
        alert('이름을 입력해 주세요.');
        return;
    }

    if (!new RegExp(mainForm['name'].dataset.regex).test(mainForm['name'].value)) {
        alert('올바른 이름을 입력해 주세요.');
        return;
    }

    
}