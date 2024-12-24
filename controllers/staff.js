const Staff = require('../model/staff');
const Service = require('../model/service');
const StaffService = require('../model/staffService');  

const getAllStaffWithServices = async (req, res) => {
    try {
        const staff = await Staff.findAll({
            include: {
                model: Service,
                through: { attributes: [] } 
            }
        });

        res.json(staff);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch staff with services' });
    }
};

const getAllStaff = async (req, res) => {
    try {
        const staff = await Staff.findAll();
        res.json(staff);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve staff' });
    }
};

const addStaff = async (req, res) => {
    try {
        const { name, specialization, availability } = req.body;
        if (!name || !specialization || !availability) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        const staff = await Staff.create({ name, specialization, availability });
        res.status(201).json(staff);
    } catch (error) {
        res.status(500).json({ error: 'Failed to add staff' });
    }
};

const assignService = async (req, res) => {
    try {
        const { staffId, serviceId } = req.body;
        if (!staffId || !serviceId) {
            return res.status(400).json({ error: 'Staff ID and Service ID are required' });
        }

        const staff = await Staff.findByPk(staffId);
        const service = await Service.findByPk(serviceId);
        if (!staff || !service) {
            return res.status(404).json({ error: 'Staff or Service not found' });
        }

        const staffService = await StaffService.create({ staffId, serviceId });
        res.status(201).json(staffService);
    } catch (error) {
        console.error('Error assigning service:', error);
        res.status(500).json({ error: 'Failed to assign service' });
    }
};

module.exports = { addStaff, assignService, getAllStaff, getAllStaffWithServices };
