const termsBtns = document.querySelectorAll('.terms-btn');
const termsContents = document.querySelectorAll('.terms-content');

termsBtns.forEach(termsBtn => {
    termsBtn.addEventListener('click', function() {
        termsContents.forEach(termsContent => {
            if(termsBtn.dataset.value === termsContent.dataset.value) {
                if(termsContent.classList.contains('visible')) {
                    termsContent.classList.remove('visible');
                } else {
                    termsContent.classList.add('visible');
                }
            }
        })
    });
})