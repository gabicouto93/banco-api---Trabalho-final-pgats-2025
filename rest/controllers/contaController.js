const contaService = require('../../src/services/contaService');

async function getContas(req, res, next) {
    try {
        const result = await contaService.getContas();
        res.json(result);
    } catch (error) {
        next(error);
    }
}

async function getConta(req, res, next) {
    const { id } = req.params;
    try {
        const result = await contaService.getContaById(id);
        if (!result) {
            return res.status(404).json({ erro: 'Conta não encontrada' });
        }
        res.json(result);
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getContas,
    getConta
};
