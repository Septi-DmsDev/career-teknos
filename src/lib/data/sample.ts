import type { ApplicantSummary, JobDetail } from "@/lib/domain";

export const sampleJobs: JobDetail[] = [
  {
    id: "7bb7deaf-32ac-4f46-9ec9-8c0ee2fb2c7d",
    slug: "staff-gudang",
    title: "Staff Gudang",
    departmentCode: "warehouse",
    departmentName: "Gudang",
    employmentType: "full_time",
    location: "Tangerang",
    deadline: "2026-06-30",
    status: "active",
    applicantCount: 18,
    description:
      "Mengelola proses penerimaan, penyimpanan, dan pengeluaran barang agar operasional gudang berjalan rapi dan akurat.",
    responsibilities: [
      "Melakukan pengecekan stok harian.",
      "Menyiapkan barang sesuai kebutuhan produksi dan pengiriman.",
      "Menjaga kerapian area gudang.",
    ],
    requirements: [
      "Minimal SMA/SMK sederajat.",
      "Teliti, disiplin, dan mampu bekerja dalam tim.",
      "Pengalaman gudang menjadi nilai tambah.",
    ],
    benefits: ["Lingkungan kerja stabil.", "Jenjang pengembangan internal."],
  },
  {
    id: "04e5e7f2-62d6-4a7a-9739-2d6e1d715d5d",
    slug: "desainer-grafis",
    title: "Desainer Grafis",
    departmentCode: "design",
    departmentName: "Desain",
    employmentType: "full_time",
    location: "Tangerang",
    deadline: "2026-07-15",
    status: "active",
    applicantCount: 26,
    description:
      "Membuat materi desain produksi dan kebutuhan visual pelanggan dengan standar kualitas Teknos.",
    responsibilities: [
      "Menyiapkan desain siap produksi.",
      "Berkoordinasi dengan tim printing dan customer service.",
      "Memastikan file desain sesuai spesifikasi.",
    ],
    requirements: [
      "Menguasai Adobe Illustrator atau CorelDRAW.",
      "Memahami basic layout dan warna.",
      "Portfolio desain wajib dilampirkan bila ada.",
    ],
    benefits: ["Ruang belajar lintas produksi.", "Project desain beragam."],
  },
  {
    id: "f63a4d0e-86a8-4c0f-a95c-2f4045da375c",
    slug: "customer-service-online",
    title: "Customer Service Online",
    departmentCode: "customer-service",
    departmentName: "Customer Service",
    employmentType: "contract",
    location: "Tangerang",
    deadline: null,
    status: "active",
    applicantCount: 12,
    description:
      "Melayani pertanyaan pelanggan online dan membantu proses pemesanan berjalan jelas dari awal hingga selesai.",
    responsibilities: [
      "Membalas chat pelanggan dengan cepat dan rapi.",
      "Mencatat kebutuhan pelanggan ke sistem internal.",
      "Koordinasi dengan produksi terkait order berjalan.",
    ],
    requirements: [
      "Komunikatif dan terbiasa menggunakan WhatsApp/marketplace.",
      "Mampu bekerja dengan target respons.",
      "Teliti dalam mencatat detail pesanan.",
    ],
    benefits: ["Pelatihan produk.", "Tim operasional suportif."],
  },
];

export const sampleApplicants: ApplicantSummary[] = [
  {
    id: "a7a6df68-1778-4899-8af2-8706aa035271",
    fullName: "Ayu Lestari",
    email: "ayu@example.com",
    whatsapp: "081234567891",
    jobTitle: "Staff Gudang",
    departmentName: "Gudang",
    status: "new",
    submittedAt: "2026-05-15T04:20:00.000Z",
  },
  {
    id: "faf9f052-2111-43bb-8311-df74fdf78526",
    fullName: "Rizky Pratama",
    email: "rizky@example.com",
    whatsapp: "081234567892",
    jobTitle: "Desainer Grafis",
    departmentName: "Desain",
    status: "screening",
    submittedAt: "2026-05-14T09:10:00.000Z",
  },
];
