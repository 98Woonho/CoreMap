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


    axios.post('/user/sendMail', null, {params: {'email' : mainForm['joinUsername'].value}} )
        .then(res => {
            console.log(res);
            if (res.data['result'] === 'success') {
                mainForm['joinEmailSalt'].value = res.data['salt'];
                mainForm['joinUsername'].setAttribute('disabled', ''); // name="infoEmail"인 태그에 disabled 속성 추가. ''은 속성값인데 disabled는 속성값이 없으므로 공백.
                mainForm['joinEmailSend'].setAttribute('disabled', ''); // name="infoEmailSend"인 태그에 disabled 속성 추가. ''은 속성값인데 disabled는 속성값이 없으므로 공백.
                mainForm['joinEmailCode'].removeAttribute('disabled'); // name="infoEmailCode"인 태그에 disabled 속성 제거
                mainForm['joinEmailVerify'].removeAttribute('disabled'); // name="infoEmailVerify"인 태그에 disabled 속성 제거
                alert('입력하신 이메일로 인증번호가 포함된 메일을 전송하였습니다.<br><br>해당 인증번호는 <b>5분간만 유효</b>하니 유의해 주세요.');
            } else {
                alert('알 수 없는 이유로 인증번호를 전송하지 못하였습니다.<br><br>잠시 후 다시 시도해 주세요.');
            }
        })
        .catch(err => {
            alert('요청을 전송하는 도중에 오류가 발생하였습니다.<br><br>잠시 후 다시 시도해 주세요.');
        });
}