const themeToggleButton = document.getElementById('theme-toggle');
const currentTheme = localStorage.getItem('theme') || 'light';

document.documentElement.setAttribute('data-theme', currentTheme);

function updateButton() {
    const theme = document.documentElement.getAttribute('data-theme');

    if (theme === 'light') {
        themeToggleButton.querySelector('.theme-toggle__text').textContent = 'Dark Mode';
        themeToggleButton.querySelector('.theme-toggle__icon').textContent = '🌙';
        themeToggleButton.querySelector('.theme-toggle__icon_2').textContent = '🌙';
    } else {
        themeToggleButton.querySelector('.theme-toggle__text').textContent = 'Light Mode';
        themeToggleButton.querySelector('.theme-toggle__icon').textContent = '🌞';
        themeToggleButton.querySelector('.theme-toggle__icon_2').textContent = '🌞';
    }
}

updateButton();

themeToggleButton.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';

    document.documentElement.setAttribute('data-theme', newTheme);

    localStorage.setItem('theme', newTheme);

    updateButton();
});
