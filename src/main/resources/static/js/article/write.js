const writeForm = document.getElementById('writeForm');

ClassicEditor.create(writeForm['content'], {
    removePlugins: ['Markdown'],
    language: "ko",
    simpleUpload: {
        uploadUrl: '/article/image'
    },
})
    .then(function (editor) {
        writeForm.editor = editor;
    })
    .catch(function (error) {
        console.log(error)
    });