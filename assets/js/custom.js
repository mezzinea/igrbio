
// Language Selector
document.querySelectorAll('.dropdown-item').forEach(item => {
    item.addEventListener('click', function (e) {
    e.preventDefault();

    const langText = this.textContent.trim();
    const langFlag = this.getAttribute('data-flag');

    // Update button
    document.getElementById('selected-lang').textContent = langText;
    document.getElementById('selected-flag').src = langFlag;
    document.getElementById('selected-flag').alt = langText;
    });
});
