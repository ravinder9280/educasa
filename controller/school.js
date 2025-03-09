import Prisma from '../db/db.config.js';

export const addSchoolController = async (req, res) => {
    try {
        const { name, address, latitude, longitude } = req.body;

        if (!name || !address || !latitude || !longitude) {
            return res.json({ message: 'Please provide all the fields', success: false });
        }
        if (isNaN(parseFloat(latitude)) || isNaN(parseFloat(longitude))) {
            return res.json({ message: 'Please provide valid latitude and longitude', success: false });
        }

        const school = await Prisma.school.findFirst({
            where: { name: name },
            select: { id: true },
        });

        if (school) {
            return res.json({ message: 'School already exists with this name', success: false });
        }

        const newSchool = await Prisma.school.create({
            data: {
                name: name,
                address: address,
                latitude: parseFloat(latitude),
                longitude: parseFloat(longitude),
            }
        });
        console.log(newSchool);
        return res.json({ newSchool, message: 'School added successfully', success: true });

    } catch (error) {
        console.log(error);
        return res.json({ message: 'Something went wrong', success: false });
    }
};

export const listSchoolsControllers = async (req, res) => {
    try {
        const { latitude, longitude } = req.query;

        const userLatitude = parseFloat(latitude);
        const userLongitude = parseFloat(longitude);

        const schools = await Prisma.school.findMany({
            select: {
                name: true,
                address: true,
                latitude: true,
                longitude: true
            }
        });

        const calculateDistance = (lat1, lon1, lat2, lon2) => {
            const toRadians = (degrees) => degrees * (Math.PI / 180);
            const R = 6371; 
            const dLat = toRadians(lat2 - lat1);
            const dLon = toRadians(lon2 - lon1);
            const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                      Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
                      Math.sin(dLon / 2) * Math.sin(dLon / 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            return R * c; 
        };

        const sortedSchools = schools.map(school => ({
            ...school,
            distance: calculateDistance(userLatitude, userLongitude, school.latitude, school.longitude)
        })).sort((a, b) => a.distance - b.distance);

        return res.json({ schools: sortedSchools });
    } catch (error) {
        console.log(error);
        return res.json({ message: 'Something went wrong', success: false });
    }
};
