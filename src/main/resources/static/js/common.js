const loading = document.getElementById('loading');

if (loading) {
    loading.hide = function() {
        loading.classList.remove('visible');
    }
    loading.show = function() {
        loading.classList.add('visible');
    }
}