const loginForm = document.getElementById('login-form');
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    try {
        const response = await fetch('http://localhost:3000/students.csv');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const csvText = await response.text();
        const csvData = parseCSV(csvText);
        
        let found = false;
        for (let i = 0; i < csvData.length; i++) {
            if (csvData[i][0] === username && csvData[i][1] === password) {
                found = true;
                break;
            }
        }

        if (found) {
            window.location.href = 'menu.html';
        } else {
            alert("Wrong username or password!");
        }
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
});

function parseCSV(csvText) {
    const lines = csvText.trim().split(/\r\n|\n/);
    const result = [];
    for (const line of lines) {
        const values = line.split(',');
        result.push(values);
        console.log(values);
    }
    return result;
}
