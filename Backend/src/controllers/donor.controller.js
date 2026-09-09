const prisma = require('../config/database');
const { successResponse, errorResponse } = require('../utils/response');

const getDashboard = async (req, res) => {
  try {
    const donorId = req.user.id;
    const donations = await prisma.donation.findMany({
      where: { donor_id: donorId }
    });

    let totalDonated = 0;
    donations.forEach(d => {
      if (d.status === 'VERIFIED') totalDonated += Number(d.amount);
    });

    const data = {
      donations: {
        total: donations.length,
        verified: donations.filter(d => d.status === 'VERIFIED').length,
        pending: donations.filter(d => d.status === 'PENDING').length
      },
      totalDonated
    };

    return successResponse(res, 'Berhasil mengambil data dashboard donor', data);
  } catch (error) {
    return errorResponse(res, 'Server error', null, 500);
  }
};

module.exports = { getDashboard };
