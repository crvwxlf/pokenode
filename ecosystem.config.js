module.exports = {
  apps : [{
    name: 'pokenode',
    script: 'index.js',
    watch: '.',
    env_production: {
      NODE_ENV: "production"
   },
   env_development: {
      NODE_ENV: "development"
   }
  }]
};
