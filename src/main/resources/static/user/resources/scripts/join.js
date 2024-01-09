const mainForm = document.getElementById('mainForm');
const addressFind = document.getElementById('addressFind');

mainForm['joinAddressFind'].onclick = function () {
    new daum.Postcode({
        width: '100%',
        height: '100%',
        oncomplete: function (data) {
            mainForm['joinAddressPostal'].value = data['zonecode'];
            mainForm['joinAddressPrimary'].value = data['address'];
            addressFind.classList.remove('visible');
            mainForm['joinAddressSecondary'].focus();
            mainForm['joinAddressSecondary'].select();
        }
    }).embed(addressFind.querySelector(':scope > .modal'))
    addressFind.classList.add('visible');
}

addressFind.querySelector('[rel="close"]').onclick = function () {
    addressFind.classList.remove('visible');
}


mainForm['joinEmailSend'].onclick = function () {
    if (mainForm['joinUsername'].value === '') {
        alert('이메일을 입력해 주세요.');
        return;
    }
    if (!new RegExp(mainForm['joinUsername'].dataset.regex).test(mainForm['joinUsername'].value)) {
        alert('올바른 이메일을 입력해주세요.');
        return;
    }
    loading.show();
    axios.post('/user/sendMail', null, {params: {'email': mainForm['joinUsername'].value}})
        .then(res => {
            loading.hide();
            if (res.data['result'] === 'success') {
                mainForm['joinEmailSalt'].value = res.data['salt'];
                mainForm['joinUsername'].setAttribute('disabled', ''); // name="infoEmail"인 태그에 disabled 속성 추가. ''은 속성값인데 disabled는 속성값이 없으므로 공백.
                mainForm['joinEmailSend'].setAttribute('disabled', ''); // name="infoEmailSend"인 태그에 disabled 속성 추가. ''은 속성값인데 disabled는 속성값이 없으므로 공백.
                mainForm['joinEmailCode'].removeAttribute('disabled'); // name="infoEmailCode"인 태그에 disabled 속성 제거
                mainForm['joinEmailVerify'].removeAttribute('disabled'); // name="infoEmailVerify"인 태그에 disabled 속성 제거
                alert('입력하신 이메일로 인증번호가 포함된 메일을 전송하였습니다. 해당 인증번호는 5분간만 유효하니 유의해 주세요.');
            } else {
                alert('알 수 없는 이유로 인증번호를 전송하지 못하였습니다. 잠시 후 다시 시도해 주세요.');
            }
        })
        .catch(err => {
            alert('요청을 전송하는 도중에 오류가 발생하였습니다. 잠시 후 다시 시도해 주세요.');
        });
}

mainForm['joinEmailVerify'].onclick = function () {
    if (mainForm['joinEmailCode'] === '') {
        alert('인증번호를 입력해 주세요.');
        return;
    }
    if (!new RegExp(mainForm['joinEmailCode'].dataset.regex).test((mainForm['joinEmailCode'].value))) {
        alert('올바른 인증번호를 입력해 주세요.');
        return;
    }

    const params = {
        params: {
            'email': mainForm['joinUsername'].value,
            'code': mainForm['joinEmailCode'].value,
            'salt': mainForm['joinEmailSalt'].value
        }
    };

    axios.patch('/user/sendMail', null, params)
        .then(res => {
            console.log(res);
            if (res.data['result'] === 'success') {
                alert('인증번호가 정상적으로 확인 되었습니다.');
                mainForm['joinEmailCode'].setAttribute('disabled', '');
                mainForm['joinEmailVerify'].setAttribute('disabled', '');
            } else if (res.data['result'] === 'failure_expired') {
                alert('인증번호를 5분 내에 입력하지 않아 만료 되었습니다. 아래 확인 버튼을 눌러 이메일 인증을 재진행해 주세요.');
                mainForm['joinEmailSalt'].value = '';
                mainForm['joinEmail'].removeAttribute('disabled');
                mainForm['joinEmail'].focus();
                mainForm['joinEmail'].select();
                mainForm['joinEmailSend'].removeAttribute('disabled');
                mainForm['joinEmailCode'].value = '';
                mainForm['joinEmailCode'].setAttribute('disabled', '');
                mainForm['joinEmailVerify'].setAttribute('disabled', '');
            } else if (res.data['result'] === 'failure_invalid_code') {
                alert('이메일 인증번호가 올바르지 않습니다. 입력하신 인증번호를 다시 확인해 주세요.');
                mainForm['joinEmailCode'].focus();
                mainForm['joinEmailCode'].select();
            } else {
                alert('알 수 없는 이유로 인증번호를 확인하지 못하였습니다. 잠시 후 다시 시도해 주세요.');
            }
        })
        .catch(err => {
            alert('서버가 예상치 못한 응답을 반환하였습니다. 잠시 후 다시 시도해 주세요.');
        });
}