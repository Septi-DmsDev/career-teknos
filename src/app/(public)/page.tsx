import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  ClipboardList,
  Clock3,
  Factory,
  FileCheck2,
  Handshake,
  ShieldCheck,
  UsersRound,
} from "lucide-react";

import { JobCard } from "@/components/public/job-card";
import { LinkButton } from "@/components/ui/button";
import { GridPattern } from "@/components/ui/grid-pattern";
import { departments } from "@/lib/domain";
import { getLatestJobs } from "@/lib/services/jobs";

export default async function HomePage() {
  const latestJobs = await getLatestJobs();

  return (
    <main>
      <section className="work-surface relative overflow-hidden border-b border-line">
        <GridPattern
          width={44}
          height={44}
          squares={[
            [2, 1],
            [5, 3],
            [8, 2],
            [11, 4],
            [14, 1],
          ]}
          className="[mask-image:linear-gradient(to_bottom_right,white,transparent_74%)]"
        />
        <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-20">
          <div className="animate-rise-in">
            <p className="inline-flex items-center gap-2 rounded-full border border-brand/10 bg-white/70 px-3 py-1 text-xs font-extrabold uppercase tracking-wide text-brand shadow-sm">
              <Factory className="h-3.5 w-3.5 text-accent" />
              Official Career Site
            </p>
            <h1 className="mt-5 max-w-3xl text-4xl font-black leading-tight tracking-tight text-brand sm:text-5xl">
              Karier di Teknos untuk tim produksi, kreatif, dan operasional.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
              Kami membuka kesempatan untuk kandidat yang teliti, komunikatif,
              dan siap bekerja dalam ritme operasional yang teratur. Pilih
              posisi yang sesuai, isi lamaran, lalu tim HRD akan meninjau data
              Anda.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <LinkButton href="/lowongan" size="lg">
                Lihat Lowongan <ArrowRight className="h-4 w-4" />
              </LinkButton>
              <LinkButton href="/privacy" variant="secondary" size="lg">
                Kebijakan Data
              </LinkButton>
            </div>
            <div className="mt-8 grid max-w-xl gap-3 sm:grid-cols-3">
              {[
                ["7", "divisi aktif"],
                ["3", "dokumen utama"],
                ["1", "alur seleksi"],
              ].map(([value, label]) => (
                <div
                  key={label}
                  className="rounded-lg border border-white/70 bg-white/55 p-4 shadow-sm backdrop-blur"
                >
                  <p className="text-2xl font-black text-brand">{value}</p>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="panel-shadow animate-rise-in rounded-2xl border border-white/80 bg-white/82 p-5 backdrop-blur [animation-delay:100ms]">
            <div className="rounded-xl border border-line bg-paper p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-brand p-3 text-white">
                    <Factory className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-500">
                      Rekrutmen Teknos
                    </p>
                    <p className="text-2xl font-black text-slate-950">
                      Posisi terbuka
                    </p>
                  </div>
                </div>
                <span className="rounded-full bg-fresh/10 px-3 py-1 text-xs font-bold text-fresh">
                  Live
                </span>
              </div>
              <div className="mt-5 grid gap-3">
                {latestJobs.slice(0, 3).map((job, index) => (
                  <div
                    key={job.id}
                    className="grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-lg border border-line/70 bg-white p-3"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10 text-sm font-black text-accent">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-bold text-slate-950">{job.title}</p>
                      <p className="text-xs font-medium text-slate-500">
                        {job.departmentName} - {job.location}
                      </p>
                    </div>
                    <CheckCircle2 className="h-4 w-4 text-fresh" />
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              {departments.map((department) => (
                <div
                  key={department.code}
                  className="flex items-center gap-2 rounded-lg border border-line/70 bg-white/76 p-3"
                >
                  <span className="h-2 w-2 rounded-full bg-accent" />
                  <span className="text-sm font-bold text-slate-700">
                    {department.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-10 grid gap-4 lg:grid-cols-3">
          {[
            {
              icon: ClipboardList,
              title: "Lamar tanpa akun",
              text: "Isi form sekali, unggah dokumen utama, dan lanjutkan proses tanpa membuat akun kandidat.",
            },
            {
              icon: ShieldCheck,
              title: "Data kandidat aman",
              text: "Dokumen lamaran dipakai untuk proses seleksi dan hanya ditinjau oleh tim yang berwenang.",
            },
            {
              icon: UsersRound,
              title: "Tim lintas divisi",
              text: "Peluang tersedia untuk gudang, finishing, desain, printing, customer service, logistik, dan offset.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-xl border border-line/80 bg-white/80 p-5 shadow-sm"
            >
              <item.icon className="h-5 w-5 text-accent" />
              <h2 className="mt-4 text-base font-extrabold text-slate-950">
                {item.title}
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {item.text}
              </p>
            </div>
          ))}
        </div>

        <div id="divisi" className="mb-14 rounded-2xl border border-line bg-white/80 p-5 shadow-sm">
          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-accent">
                Divisi Teknos
              </p>
              <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
                Tempat kerja yang dekat dengan proses nyata.
              </h2>
              <p className="mt-4 leading-7 text-slate-600">
                Setiap divisi punya ritme sendiri, tetapi proses recruitment
                tetap satu pintu agar kandidat mudah menemukan posisi yang
                cocok.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {departments.map((department) => (
                <div
                  key={department.code}
                  className="rounded-xl border border-line bg-paper p-4"
                >
                  <p className="text-sm font-extrabold text-slate-950">
                    {department.name}
                  </p>
                  <p className="mt-2 text-xs font-medium leading-5 text-slate-500">
                    Lowongan dipublikasikan sesuai kebutuhan operasional.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div id="proses" className="mb-14">
          <div className="mb-6">
            <p className="text-sm font-bold uppercase tracking-wide text-accent">
              Proses Seleksi
            </p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
              Alur sederhana dari lamaran sampai tindak lanjut.
            </h2>
          </div>
          <div className="grid gap-4 lg:grid-cols-4">
            {[
              {
                icon: FileCheck2,
                title: "Kirim lamaran",
                text: "Lengkapi data diri, pengalaman, dan dokumen utama.",
              },
              {
                icon: Clock3,
                title: "Review HRD",
                text: "Tim HRD meninjau kesesuaian data dengan kebutuhan posisi.",
              },
              {
                icon: UsersRound,
                title: "Tahap seleksi",
                text: "Kandidat terpilih akan dihubungi untuk proses lanjutan.",
              },
              {
                icon: Handshake,
                title: "Keputusan",
                text: "Hasil seleksi disampaikan melalui kontak yang terdaftar.",
              },
            ].map((item, index) => (
              <div
                key={item.title}
                className="relative rounded-xl border border-line bg-white/80 p-5 shadow-sm"
              >
                <span className="absolute right-4 top-4 text-xs font-black text-slate-300">
                  0{index + 1}
                </span>
                <item.icon className="h-5 w-5 text-accent" />
                <h3 className="mt-4 font-extrabold text-slate-950">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-accent">
              <BriefcaseBusiness className="h-4 w-4" />
              Lowongan terbaru
            </p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
              Posisi yang sedang dibuka
            </h2>
          </div>
          <LinkButton href="/lowongan" variant="secondary">
            Semua Lowongan
          </LinkButton>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {latestJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </section>
    </main>
  );
}
