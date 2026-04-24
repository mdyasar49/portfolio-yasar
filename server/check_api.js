const http = require('http');

http.get('http://localhost:5001/api/profile', (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        try {
            const json = JSON.parse(data);
            console.log('KEYS:', Object.keys(json.payload || json));
            console.log('MENU_ITEMS:', (json.payload || json).menuItems);
        } catch (e) {
            console.log('FAIL:', data.substring(0, 100));
        }
    });
}).on('error', (err) => {
    console.log('ERROR:', err.message);
});
