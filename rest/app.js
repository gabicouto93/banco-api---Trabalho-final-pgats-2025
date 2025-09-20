const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./config/swagger');
require('dotenv').config();

const loginRoutes = require('./routes/loginRoutes');
const transferenciaRoutes = require('./routes/transferenciaRoutes');
const contaRoutes = require('./routes/contaRoutes');

const gerenciarErros = require('./middleware/gerenciarErros');


const app = express();

app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/login', loginRoutes);
app.use('/transferencias', transferenciaRoutes);
app.use('/contas', contaRoutes);

app.use(gerenciarErros);

if (require.main === module) {
  app.listen(process.env.PORT || 3000, () => {
    console.log(`Servidor rodando na porta ${process.env.PORT || 3000}`);
  });
}

module.exports = app;