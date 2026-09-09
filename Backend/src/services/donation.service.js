const prisma = require('../config/database');

const createDonation = async (donorId, data, proofUrl) => {
  const campaign = await prisma.campaign.findUnique({ where: { id: Number(data.campaignId) } });
  if (!campaign) throw new Error('Campaign tidak ditemukan');
  if (campaign.status !== 'ACTIVE') throw new Error('Campaign tidak aktif atau sudah ditutup');

  return prisma.donation.create({
    data: {
      campaign_id: Number(data.campaignId),
      donor_id: donorId,
      amount: data.amount,
      message: data.message,
      is_anonymous: data.isAnonymous === 'true' || data.isAnonymous === true,
      proof_url: proofUrl,
      status: 'PENDING'
    }
  });
};

const getMyDonations = async (donorId) => {
  return prisma.donation.findMany({
    where: { donor_id: donorId },
    orderBy: { donated_at: 'desc' },
    include: {
      campaign: { select: { id: true, title: true, slug: true, image_url: true } }
    }
  });
};

const getDonationById = async (id, donorId) => {
  const donation = await prisma.donation.findUnique({
    where: { id: Number(id) },
    include: { campaign: true }
  });

  if (!donation || donation.donor_id !== donorId) {
    throw new Error('Donasi tidak ditemukan atau bukan milik anda');
  }

  return donation;
};

const getCampaignDonations = async (campaignId) => {
  const donations = await prisma.donation.findMany({
    where: { campaign_id: Number(campaignId), status: 'VERIFIED' },
    orderBy: { donated_at: 'desc' },
    include: {
      donor: { select: { name: true } }
    }
  });

  return donations.map(d => ({
    id: d.id,
    amount: d.amount,
    message: d.message,
    donated_at: d.donated_at,
    donor_name: d.is_anonymous ? 'Hamba Allah' : d.donor.name
  }));
};

const verifyDonation = async (id, status) => {
  if (!['VERIFIED', 'REJECTED'].includes(status)) {
    throw new Error('Status tidak valid');
  }

  return prisma.$transaction(async (tx) => {
    const donation = await tx.donation.findUnique({ where: { id: Number(id) } });
    if (!donation) throw new Error('Donasi tidak ditemukan');
    if (donation.status !== 'PENDING') throw new Error('Donasi sudah diverifikasi atau ditolak');

    const updatedDonation = await tx.donation.update({
      where: { id: Number(id) },
      data: { status, verified_at: new Date() }
    });

    if (status === 'VERIFIED') {
      await tx.campaign.update({
        where: { id: donation.campaign_id },
        data: {
          collected_amount: { increment: donation.amount }
        }
      });
      
      const campaign = await tx.campaign.findUnique({ where: { id: donation.campaign_id } });
      if (campaign.collected_amount >= campaign.target_amount) {
        await tx.campaign.update({
          where: { id: campaign.id },
          data: { status: 'COMPLETED' }
        });
      }
    }

    return updatedDonation;
  });
};

module.exports = { createDonation, getMyDonations, getDonationById, getCampaignDonations, verifyDonation };
