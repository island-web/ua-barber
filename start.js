const path = require('path');
const pm2 = require('pm2');

const config = {
    name: 'BarberShopServer',
    script: path.join(__dirname, './main.js'),
    exec_mode: 'fork',
    instances: 1,
    autorestart: true
};

pm2.connect(function(err) {
    if (err) {
        console.error(err);
        process.exit(2);
    }

    pm2.start(config, function(err, apps) {
        pm2.disconnect(); 
        if (err) throw err
    });

});





