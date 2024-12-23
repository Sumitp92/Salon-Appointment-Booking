const Service = require('../model/service');

const getAllServices = async (req, res) => {
    try {
        const services = await Service.findAll();
        res.json(services);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve services' });
    }
};

const addService = async (req, res) => {
    try {
        const { name, description, duration, price, availability } = req.body;
        if (!name || !description || !duration || !price || !availability) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        const service = await Service.create({ name, description, duration, price, availability });
        res.status(201).json(service);
    } catch (error) {
        res.status(500).json({ error: 'Failed to add service' });
    }
};

const updateService = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, duration, price, availability } = req.body;
        const service = await Service.findByPk(id);
        if (!service) {
            return res.status(404).json({ error: 'Service not found' });
        }
        await service.update({ name, description, duration, price, availability });
        res.json(service);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update service' });
    }
};

const deleteService = async (req, res) => {
    try {
        const { id } = req.params;
        const service = await Service.findByPk(id);
        if (!service) {
            return res.status(404).json({ error: 'Service not found' });
        }
        await service.destroy();
        res.json({ message: 'Service deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete service' });
    }
};

const updateAvailability = async (req, res) => {
    try {
        const { id } = req.params;
        const { availability } = req.body;
        const service = await Service.findByPk(id);
        if (!service) {
            return res.status(404).json({ error: 'Service not found' });
        }
        await service.update({ availability });
        res.json(service);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update availability' });
    }
};

module.exports = { getAllServices, addService, updateService, deleteService, updateAvailability };
