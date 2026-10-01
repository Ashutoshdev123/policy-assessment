const pidusage = require('pidusage');

function monitorCPU() {
  setInterval(() => {
    pidusage(process.pid, (err, stats) => {
      if (err) {
        console.error('CPU Monitor Error:', err);
        return;
      }

      console.log(`Current CPU Usage: ${stats.cpu.toFixed(2)}%`);

      if (stats.cpu > 70) {
        console.warn(`⚠️ CPU Usage: (${stats.cpu.toFixed(2)}%)`);        
        //console.warn(`⚠️ CPU Usage exceeded 70% (${stats.cpu.toFixed(2)}%). Restarting server...`);
        //process.exit(1); // Process restart trigger karega (PM2/Nodemon handle kar lega)
      }
    });
  }, 5000); // Har 5 second me check karega
}

module.exports = monitorCPU;