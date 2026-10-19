// Configuración de PM2 para correr el backend en producción.
// Uso (desde la carpeta backend, después de `npm run build`):
//   pm2 start ecosystem.config.cjs
//   pm2 status | pm2 logs clinica-turnos-api | pm2 restart clinica-turnos-api | pm2 stop clinica-turnos-api
module.exports = {
  apps: [
    {
      name: 'clinica-turnos-api',
      script: 'dist/main.js',
      // El .env se lee desde esta carpeta (backend/)
      cwd: __dirname,
      instances: 1,
      exec_mode: 'fork',
      // Si el proceso se cae, PM2 lo levanta de nuevo
      autorestart: true,
      watch: false,
      max_memory_restart: '300M',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
