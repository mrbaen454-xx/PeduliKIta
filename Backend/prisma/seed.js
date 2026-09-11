const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function main() {
  console.log('Start comprehensive seeding...');

  // Clean up existing data
  await prisma.donation.deleteMany();
  await prisma.campaignUpdate.deleteMany();
  await prisma.campaignDocument.deleteMany();
  await prisma.campaign.deleteMany();
  await prisma.user.deleteMany();
  await prisma.category.deleteMany();

  console.log('Cleared existing data.');

  // 1. Categories
  const categoriesData = [
    { name: 'Bantuan Medis & Kesehatan', description: 'Perawatan medis, pendampingan berobat, & alat kesehatan' },
    { name: 'Tanggap Bencana Alam', description: 'Dapur umum darurat, perbaikan selter, & obat-obatan' },
    { name: 'Pendidikan & Fasilitas', description: 'Renovasi sekolah rusak, beasiswa anak, & buku/alat tulis' },
    { name: 'Panti Asuhan & Lansia Dhuafa', description: 'Kebutuhan pokok harian, panti asuhan, & sembako' },
    { name: 'Infrastruktur Air Bersih', description: 'Pengeboran sumur air bersih & pipa desa rawan kering' },
    { name: 'Pemberdayaan Ekonomi', description: 'Modal usaha mikro, gerobak berdagang, & pelatihan UMKM' },
  ];
  
  const createdCategories = [];
  for (const cat of categoriesData) {
    const created = await prisma.category.create({ data: cat });
    createdCategories.push(created);
  }
  
  const [catMedis, catBencana, catPendidikan, catLansia, catInfrastruktur, catPemberdayaan] = createdCategories;
  console.log('Created Categories.');

  // 2. Users (Multiple roles for exhaustive testing)
  const passwordHash = await bcrypt.hash('password123', 10);

  // Admin
  const admin = await prisma.user.create({
    data: { name: 'Super Admin', email: 'admin@pedulikita.com', password: passwordHash, role: 'ADMIN', status: 'ACTIVE', phone: '081234567890' }
  });

  // Campaigners
  const campaigner1 = await prisma.user.create({
    data: { name: 'Relawan Siaga Bencana Jawa Tengah', email: 'yayasan@pedulikita.com', password: passwordHash, role: 'CAMPAIGNER', status: 'ACTIVE', phone: '081234567891' }
  });
  
  const campaigner2 = await prisma.user.create({
    data: { name: 'Yayasan Generasi Pelosok', email: 'relawan@pedulikita.com', password: passwordHash, role: 'CAMPAIGNER', status: 'ACTIVE', phone: '081234567892' }
  });

  const campaigner3 = await prisma.user.create({
    data: { name: 'Klinik Peduli Sesama', email: 'aksi@pedulikita.com', password: passwordHash, role: 'CAMPAIGNER', status: 'ACTIVE', phone: '081234567893' }
  });

  const campaigner4 = await prisma.user.create({
    data: { name: 'Masyarakat Sumba', email: 'sumba@pedulikita.com', password: passwordHash, role: 'CAMPAIGNER', status: 'ACTIVE', phone: '081234567894' }
  });

  const campaigner5 = await prisma.user.create({
    data: { name: 'Aksi Kemanusiaan Gizi', email: 'gizi@pedulikita.com', password: passwordHash, role: 'CAMPAIGNER', status: 'ACTIVE', phone: '081234567895' }
  });

  const campaigner6 = await prisma.user.create({
    data: { name: 'Yayasan Cahaya Yatim', email: 'yatim@pedulikita.com', password: passwordHash, role: 'CAMPAIGNER', status: 'ACTIVE', phone: '081234567896' }
  });

  // Donors
  const donor1 = await prisma.user.create({ data: { name: 'Ahmad', email: 'donor1@gmail.com', password: passwordHash, role: 'DONOR', status: 'ACTIVE' }});
  const donor2 = await prisma.user.create({ data: { name: 'Farida Wijaya', email: 'donor2@gmail.com', password: passwordHash, role: 'DONOR', status: 'ACTIVE' }});
  const donor3 = await prisma.user.create({ data: { name: 'Siti Aminah', email: 'donor3@gmail.com', password: passwordHash, role: 'DONOR', status: 'ACTIVE' }});
  const donor4 = await prisma.user.create({ data: { name: 'Budi Santoso', email: 'donor4@gmail.com', password: passwordHash, role: 'DONOR', status: 'ACTIVE' }});

  console.log('Created Users.');

  // 3. Campaigns (Covering all statuses for Admin & Campaigner testing)
  const campaignsData = [
    // --- ACTIVE CAMPAIGNS ---
    {
      campaigner_id: campaigner1.id,
      category_id: catBencana.id,
      title: 'Bantuan Air Bersih dan Sembako Darurat Warga Terdampak Banjir Demak & Kudus',
      slug: 'bantuan-air-bersih-banjir-demak',
      description: 'Hujan dengan intensitas tinggi selama beberapa hari di wilayah hulu menyebabkan tanggul sungai jebol dan menenggelamkan ribuan hunian warga di wilayah Kabupaten Demak dan perbatasan Kudus. Air bah yang belum surut memutus akses jalan lingkungan dan mencemari sumur-sumur air bersih masyarakat.\n\nKebutuhan paling mendesak di lapangan saat ini adalah penyediaan air bersih siap konsumsi serta pasokan sembako instan dan makanan bergizi untuk keluarga rentan, terutama lansia dan anak-anak balita yang bertahan di posko pengungsian mandiri.',
      target_amount: 200000000,
      collected_amount: 152400000,
      start_date: new Date('2025-02-15T00:00:00Z'),
      end_date: new Date(new Date().setDate(new Date().getDate() + 14)),
      image_url: 'https://i.imgur.com/dTlpkYb.jpeg',
      status: 'ACTIVE'
    },
    {
      campaigner_id: campaigner2.id,
      category_id: catPendidikan.id,
      title: 'Bangun Kembali Sekolah Harapan Bangsa di Pelosok Maluku',
      slug: 'bangun-sekolah-pelosok-maluku',
      description: 'SD Harapan Bangsa di Maluku Tengah saat ini dalam kondisi memprihatinkan. Atap bocor, meja kursi lapuk, dan fasilitas perpustakaan yang tidak memadai menghambat proses belajar 85 siswa. Mari wujudkan fasilitas ruang baca layak, meja belajar kayu, serta koleksi buku literatur dini bagi mereka.',
      target_amount: 45000000,
      collected_amount: 38200000,
      start_date: new Date(),
      end_date: new Date(new Date().setDate(new Date().getDate() + 19)),
      image_url: 'https://i.imgur.com/WxDeCq1.jpeg',
      status: 'ACTIVE'
    },
    {
      campaigner_id: campaigner3.id,
      category_id: catMedis.id,
      title: 'Layanan Ambulans Keliling & Pengobatan Gratis untuk Lansia Dhuafa',
      slug: 'layanan-kesehatan-keliling-lansia',
      description: 'Akses kesehatan di daerah pelosok Jawa Barat sangat terbatas. Banyak lansia penderita hipertensi dan diabetes yang tak mampu pergi ke puskesmas terdekat karena jarak dan biaya. Donasi Anda akan digunakan untuk penyediaan ambulans keliling, cek lab gratis ke desa terpencil, serta suplai obat rutin gratis bagi kakek/nenek sebatang kara.',
      target_amount: 80000000,
      collected_amount: 15000000,
      start_date: new Date(),
      end_date: new Date(new Date().setDate(new Date().getDate() + 30)),
      image_url: 'https://i.imgur.com/0ddeqzl.jpeg',
      status: 'ACTIVE'
    },
    {
      campaigner_id: campaigner4.id,
      category_id: catInfrastruktur.id,
      title: 'Pembangunan Sumur Bor dan Pipanisasi Desa Prai Paha, Sumba',
      slug: 'pipa-saluran-air-bersih-prai-paha',
      description: 'Desa Prai Paha di Sumba Timur mengalami kekeringan ekstrem lebih dari 8 bulan dalam setahun. Warga harus berjalan sejauh 4 km setiap hari hanya untuk mengambil air bersih. Kampanye ini bertujuan untuk membangun instalasi sumur bor sedalam 80 meter beserta pipa distribusi ke pusat-pusat pemukiman warga.',
      target_amount: 120000000,
      collected_amount: 46800000,
      start_date: new Date(),
      end_date: new Date(new Date().setDate(new Date().getDate() + 60)),
      image_url: 'https://i.imgur.com/c4GTK1v.jpeg',
      status: 'ACTIVE'
    },
    {
      campaigner_id: campaigner5.id,
      category_id: catPemberdayaan.id,
      title: 'Bantuan Modal Usaha Gerobak Kopi untuk Pemuda Putus Sekolah',
      slug: 'modal-usaha-gerobak-kopi',
      description: 'Program pemberdayaan ekonomi lokal dengan memberikan gerobak usaha, mesin kopi manual, dan pelatihan barista dasar bagi pemuda putus sekolah di wilayah urban miskin Jakarta. Tujuannya adalah menciptakan kemandirian finansial.',
      target_amount: 34000000,
      collected_amount: 28750000,
      start_date: new Date(),
      end_date: new Date(new Date().setDate(new Date().getDate() + 45)),
      image_url: 'https://i.imgur.com/5spwj8D.jpeg',
      status: 'ACTIVE'
    },
    {
      campaigner_id: campaigner6.id,
      category_id: catLansia.id,
      title: 'Bantuan Biaya Pendidikan dan Pangan Asrama Yatim Cahaya',
      slug: 'kebutuhan-pokok-sekolah-yatim',
      description: 'Panti Asuhan Cahaya saat ini menampung 45 anak yatim piatu. Meningkatnya harga kebutuhan pokok membuat yayasan kesulitan menutupi biaya operasional harian dan SPP sekolah anak-anak. Mari bantu penuhi gizi mereka.',
      target_amount: 50000000,
      collected_amount: 22100000,
      start_date: new Date(),
      end_date: new Date(new Date().setDate(new Date().getDate() + 25)),
      image_url: 'https://i.imgur.com/JnYE7Tf.jpeg',
      status: 'ACTIVE'
    },
    {
      campaigner_id: campaigner1.id,
      category_id: catBencana.id,
      title: 'Distribusi Tenda Darurat & Selimut Musim Dingin Korban Gempa',
      slug: 'tenda-darurat-korban-gempa',
      description: 'Gempa bumi magnitudo 6.2 di pegunungan membuat ribuan warga kehilangan rumah. Memasuki musim penghujan yang dingin, tenda pengungsian komunal sangat dibutuhkan.',
      target_amount: 75000000,
      collected_amount: 5500000,
      start_date: new Date(),
      end_date: new Date(new Date().setDate(new Date().getDate() + 10)),
      image_url: 'https://i.imgur.com/dacmN39.jpeg',
      status: 'ACTIVE'
    },
    {
      campaigner_id: campaigner2.id,
      category_id: catPendidikan.id,
      title: 'Beasiswa Penuh untuk 100 Anak Petani Gurem Berprestasi',
      slug: 'beasiswa-anak-petani-gurem',
      description: 'Mendukung keberlanjutan pendidikan anak-anak petani gurem agar tidak putus sekolah di bangku SMP dan SMA. Dana donasi menutupi biaya LKS, seragam, sepatu, dan transportasi.',
      target_amount: 150000000,
      collected_amount: 80500000,
      start_date: new Date(),
      end_date: new Date(new Date().setDate(new Date().getDate() + 50)),
      image_url: 'https://i.imgur.com/2MCDtIc.jpeg',
      status: 'ACTIVE'
    },

    // --- PENDING / REJECTED CAMPAIGNS ---
    {
      campaigner_id: campaigner1.id,
      category_id: catMedis.id,
      title: 'Bantuan Operasi Kanker Mulut Bapak Sutejo',
      slug: 'operasi-kanker-mulut-sutejo',
      description: 'Bapak Sutejo merupakan tulang punggung keluarga yang divonis kanker mulut stadium 3. Dibutuhkan dana segera untuk tindakan operasi pengangkatan tumor.',
      target_amount: 65000000,
      collected_amount: 0,
      start_date: null,
      end_date: new Date(new Date().setDate(new Date().getDate() + 30)),
      image_url: 'https://i.imgur.com/PEKcRpD.jpeg',
      status: 'PENDING'
    },
    {
      campaigner_id: campaigner2.id,
      category_id: catPemberdayaan.id,
      title: 'Pemberdayaan Kelompok Tani Wanita Desa Sukamaju',
      slug: 'modal-tani-desa-sukamaju',
      description: 'Kami butuh modal untuk beli bibit jagung unggul dan pupuk demi meningkatkan ketahanan pangan masyarakat di Desa Sukamaju.',
      target_amount: 25000000,
      collected_amount: 0,
      start_date: null,
      end_date: new Date(new Date().setDate(new Date().getDate() + 60)),
      image_url: 'https://i.imgur.com/hv1UpG6.jpeg',
      status: 'REJECTED',
      rejection_reason: 'Rincian RAB tidak dilampirkan, mohon perjelas struktur biaya operasional alat pertaniannya.'
    },

    // --- COMPLETED / CLOSED CAMPAIGNS ---
    {
      campaigner_id: campaigner3.id,
      category_id: catBencana.id,
      title: 'Bantuan Tanggap Darurat Bencana Gempa Bumi Lombok',
      slug: 'tanggap-darurat-gempa-lombok',
      description: 'Seluruh warga terdampak telah mendapatkan huntara (hunian sementara) dan paket sembako lengkap berkat donasi Anda. Terima kasih para Orang Baik!',
      target_amount: 100000000,
      collected_amount: 102500000,
      start_date: new Date(new Date().setMonth(new Date().getMonth() - 3)),
      end_date: new Date(new Date().setMonth(new Date().getMonth() - 1)),
      image_url: 'https://i.imgur.com/Ve3hOsv.jpeg',
      status: 'COMPLETED'
    },
    {
      campaigner_id: campaigner1.id,
      category_id: catLansia.id,
      title: 'Pembagian Paket Sembako Spesial untuk Lansia di Pesisir Pantai',
      slug: 'sembako-lansia-dhuafa-pesisir',
      description: 'Kampanye ini dihentikan lebih awal karena kebutuhan logistik telah tercukupi oleh sumbangan korporat lokal. Donasi yang masuk tetap akan disalurkan.',
      target_amount: 20000000,
      collected_amount: 5000000,
      start_date: new Date(new Date().setMonth(new Date().getMonth() - 2)),
      end_date: new Date(),
      image_url: 'https://i.imgur.com/FfSvZrC.jpeg',
      status: 'CLOSED'
    }
  ];

  const createdCampaigns = [];
  for (const camp of campaignsData) {
    const created = await prisma.campaign.create({ data: camp });
    createdCampaigns.push(created);
  }
  console.log('Created Campaigns.');

  // 4. Campaign Documents
  // For the Pending campaign, add a document so admin can review
  const pendingCampaign = createdCampaigns.find(c => c.status === 'PENDING');
  if (pendingCampaign) {
    await prisma.campaignDocument.create({
      data: {
        campaign_id: pendingCampaign.id,
        file_name: 'ktp_penggalang.pdf',
        file_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        file_type: 'application/pdf'
      }
    });
  }

  // 5. Campaign Updates and Documents for all active/completed campaigns
  const activeOrCompletedCampaigns = createdCampaigns.filter(c => c.status === 'ACTIVE' || c.status === 'COMPLETED');
  
  for (const camp of activeOrCompletedCampaigns) {
    // Generate realistic document names
    const docPrefix = camp.slug.split('-').slice(0, 3).join('_').toUpperCase();
    
    await prisma.campaignDocument.createMany({
      data: [
        {
          campaign_id: camp.id,
          file_name: `SK_LEGALITAS_${docPrefix}_2025.pdf`,
          file_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
          file_type: 'application/pdf'
        },
        {
          campaign_id: camp.id,
          file_name: `SURAT_KETERANGAN_DESA_${docPrefix}.pdf`,
          file_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
          file_type: 'application/pdf'
        },
        {
          campaign_id: camp.id,
          file_name: `RAB_FINAL_${docPrefix}_V2.pdf`,
          file_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
          file_type: 'application/pdf'
        }
      ]
    });

    await prisma.campaignUpdate.createMany({
      data: [
        {
          campaign_id: camp.id,
          title: `Penyaluran Bantuan Tahap Pertama Telah Dilakukan`,
          content: `Alhamdulillah, puji syukur kepada Tuhan YME. Berkat kebaikan puluhan donatur PeduliKita, kami telah berhasil mencairkan dana tahap pertama untuk kampanye "${camp.title}".\n\nBantuan telah kami distribusikan langsung kepada penerima manfaat sesuai Rencana Anggaran Biaya (RAB) yang diajukan. Proses penyaluran berjalan lancar dan disambut dengan senyum bahagia. Kami memohon doa agar target pendanaan selanjutnya dapat segera terpenuhi agar masalah ini tuntas sepenuhnya.\n\nTerima kasih Orang Baik!`,
          image_url: camp.image_url, 
          created_at: new Date(new Date().setDate(new Date().getDate() - 2))
        },
        {
          campaign_id: camp.id,
          title: 'Asesmen Lapangan dan Verifikasi Kebutuhan Mendesak',
          content: 'Tim relawan lapangan kami telah turun langsung ke lokasi untuk melakukan verifikasi ulang data penerima manfaat dan kondisi riil di lapangan. Kami memastikan bahwa dana yang terkumpul akan tepat sasaran 100% tanpa potongan operasional yang tidak perlu.\n\nBerikut adalah potret kondisi awal sebelum bantuan disalurkan. Mari terus sebarkan kebaikan!',
          image_url: null,
          created_at: new Date(new Date().setDate(new Date().getDate() - 5))
        }
      ]
    });
  }

  // 6. Donations (All types: Pending, Verified, Rejected)
  const donationsData = [];
  
  // Distribute verified donations across active/completed campaigns to match their `collected_amount`
  // We won't mathematically perfectly divide it, but we'll add some representative ones.
  const baseDonors = [donor1, donor2, donor3, donor4];
  
  for (let i = 0; i < 4; i++) { // For the first 4 active campaigns
    const campaign = createdCampaigns[i];
    
    // Verified Donation
    donationsData.push({
      campaign_id: campaign.id,
      donor_id: donor1.id,
      amount: 100000,
      message: 'Semoga berkah!',
      is_anonymous: false,
      proof_url: 'dummy-proof-1.jpg',
      status: 'VERIFIED',
      verified_at: new Date()
    });

    // Anonymous Verified Donation
    donationsData.push({
      campaign_id: campaign.id,
      donor_id: donor2.id,
      amount: 500000,
      message: 'Titipan untuk panti.',
      is_anonymous: true,
      proof_url: 'dummy-proof-2.jpg',
      status: 'VERIFIED',
      verified_at: new Date()
    });

    // Pending Donation (Admin needs to verify)
    donationsData.push({
      campaign_id: campaign.id,
      donor_id: donor3.id,
      amount: 250000,
      message: 'Segera ditransfer ya.',
      is_anonymous: false,
      proof_url: 'dummy-proof-pending.jpg',
      status: 'PENDING',
      donated_at: new Date()
    });

    // Rejected Donation
    donationsData.push({
      campaign_id: campaign.id,
      donor_id: donor4.id,
      amount: 1000000,
      message: 'Cek bukti transfer saya',
      is_anonymous: false,
      proof_url: 'dummy-proof-fake.jpg',
      status: 'REJECTED',
      donated_at: new Date()
    });
  }

  await prisma.donation.createMany({ data: donationsData });
  console.log(`Created ${donationsData.length} Donations.`);

  console.log('Comprehensive Seeding finished successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
