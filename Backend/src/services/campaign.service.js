const prisma = require('../config/database');

const createCampaign = async (campaignerId, data, imageUrl) => {
  const slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now();
  
  return prisma.campaign.create({
    data: {
      campaigner_id: campaignerId,
      category_id: Number(data.categoryId),
      title: data.title,
      slug,
      description: data.description,
      target_amount: data.targetAmount,
      end_date: new Date(data.endDate),
      image_url: imageUrl,
      status: 'PENDING'
    }
  });
};

const getAllCampaigns = async (filters, pagination) => {
  const { search, category, status, sort } = filters;
  const { page, limit } = pagination;
  const skip = (page - 1) * limit;

  const where = {};
  if (status) where.status = status;
  else where.status = 'ACTIVE';

  if (category) {
    const cat = await prisma.category.findUnique({ where: { name: category } });
    if (cat) where.category_id = cat.id;
  }

  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } }
    ];
  }

  let orderBy = { created_at: 'desc' };
  if (sort === 'oldest') orderBy = { created_at: 'asc' };
  if (sort === 'highest_target') orderBy = { target_amount: 'desc' };
  if (sort === 'lowest_target') orderBy = { target_amount: 'asc' };

  const [data, totalItems] = await Promise.all([
    prisma.campaign.findMany({
      where,
      skip,
      take: limit,
      orderBy,
      include: {
        category: { select: { id: true, name: true } },
        campaigner: { select: { id: true, name: true } }
      }
    }),
    prisma.campaign.count({ where })
  ]);

  return {
    data,
    pagination: {
      page,
      limit,
      totalItems,
      totalPages: Math.ceil(totalItems / limit)
    }
  };
};

const getCampaignById = async (id) => {
  return prisma.campaign.findUnique({
    where: { id: Number(id) },
    include: {
      category: { select: { id: true, name: true } },
      campaigner: { select: { id: true, name: true } },
      updates: { orderBy: { created_at: 'desc' } },
      documents: true
    }
  });
};

const getMyCampaigns = async (campaignerId) => {
  return prisma.campaign.findMany({
    where: { campaigner_id: campaignerId },
    orderBy: { created_at: 'desc' },
    include: { category: true }
  });
};

const updateCampaign = async (id, campaignerId, data, imageUrl) => {
  const campaign = await prisma.campaign.findUnique({ where: { id: Number(id) } });
  if (!campaign || campaign.campaigner_id !== campaignerId) {
    throw new Error('Campaign tidak ditemukan atau bukan milik anda');
  }

  const updateData = {
    title: data.title || campaign.title,
    description: data.description || campaign.description,
    target_amount: data.targetAmount || campaign.target_amount,
    end_date: data.endDate ? new Date(data.endDate) : campaign.end_date,
    category_id: data.categoryId ? Number(data.categoryId) : campaign.category_id,
  };

  if (imageUrl) updateData.image_url = imageUrl;

  return prisma.campaign.update({
    where: { id: Number(id) },
    data: updateData
  });
};

const deleteCampaign = async (id, campaignerId) => {
  const campaign = await prisma.campaign.findUnique({ where: { id: Number(id) } });
  if (!campaign || campaign.campaigner_id !== campaignerId) {
    throw new Error('Campaign tidak ditemukan atau bukan milik anda');
  }
  
  if (campaign.collected_amount > 0) {
    throw new Error('Campaign yang sudah memiliki donasi tidak dapat dihapus');
  }

  return prisma.campaign.delete({ where: { id: Number(id) } });
};

const closeCampaign = async (id, campaignerId) => {
  const campaign = await prisma.campaign.findUnique({ where: { id: Number(id) } });
  if (!campaign || campaign.campaigner_id !== campaignerId) {
    throw new Error('Campaign tidak ditemukan atau bukan milik anda');
  }

  return prisma.campaign.update({
    where: { id: Number(id) },
    data: { status: 'CLOSED' }
  });
};

const verifyCampaign = async (id, status, rejectionReason = null) => {
  if (!['APPROVED', 'REJECTED'].includes(status)) {
    throw new Error('Status verifikasi tidak valid');
  }

  const updateData = { status: status === 'APPROVED' ? 'ACTIVE' : 'REJECTED' };
  if (status === 'REJECTED' && rejectionReason) {
    updateData.rejection_reason = rejectionReason;
  }
  if (status === 'APPROVED') {
    updateData.start_date = new Date();
  }

  return prisma.campaign.update({
    where: { id: Number(id) },
    data: updateData
  });
};

module.exports = {
  createCampaign,
  getAllCampaigns,
  getCampaignById,
  getMyCampaigns,
  updateCampaign,
  deleteCampaign,
  closeCampaign,
  verifyCampaign
};
