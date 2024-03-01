const privacyPolicyBtns = document.querySelectorAll('.privacy-policy-btn');
const privacyPolicyContents = document.querySelectorAll('.privacy-policy-content');

privacyPolicyBtns.forEach(privacyPolicyBtn => {
    privacyPolicyBtn.addEventListener('click', function() {
        privacyPolicyContents.forEach(privacyPolicyContent => {
            if(privacyPolicyBtn.dataset.value === privacyPolicyContent.dataset.value) {
                if(privacyPolicyContent.classList.contains('visible')) {
                    privacyPolicyContent.classList.remove('visible');
                } else {
                    privacyPolicyContent.classList.add('visible');
                }
            }
        })
    });
})