import ModernNavigation from "@/components/ModernNavigation";
import TypewriterEffect from "@/components/TypewriterEffect";
import SmoothScroll from "@/components/SmoothScroll";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, Code2, Users, Mail, Phone, MapPin, GraduationCap, Laptop, Smartphone } from "lucide-react";
import profileImage from "@/assets/profile.png";

const Index = () => {
  const typewriterTexts = [
    "Rendy Widjaya",
    "Mahasiswa Teknik Informatika",
    "Pengembang Aplikasi & Sistem ERP",
  ];

  const projects = [
    {
      title: "Proyek Implementasi Odoo 12",
      description:
        "Membantu pembuatan dokumentasi teknis, flowchart proses, dan video tutorial untuk berbagai modul ERP (Inventory, HR, PR-PO, Payment, BPJS, Scrapping, dll). Melakukan troubleshooting dasar pada sistem ERP Odoo 12.",
      tags: ["Odoo 12", "ERP", "Dokumentasi", "Flowchart", "Video Tutorial"],
    },
    {
      title: 'Aplikasi Android "BIJAK.RS" (2024)',
      description:
        "Aplikasi Android sederhana untuk pencarian rumah sakit, dibuat menggunakan Kotlin. Proyek dikerjakan secara otodidak saat masih di bangku SMA.",
      tags: ["Android", "Kotlin", "Mobile Development"],
    },
  ];

  const technicalSkills = [
    "Pemrograman (Kotlin, JavaScript, Python, NodeJS, ERP Odoo 12)",
    "Dokumentasi Teknis",
    "Problem Solving & Komunikasi",
    "Digital Marketing & Kerja Tim",
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <ModernNavigation />

      {/* Hero Section */}
      <section
        id="home"
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,hsl(200_100%_55%/0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,hsl(180_100%_50%/0.1),transparent_50%)]" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Profile Image */}
              <div className="flex justify-center md:justify-end order-1 md:order-1">
                <div className="relative group">
                  <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl group-hover:bg-primary/30 transition-all duration-300" />
                  <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-primary/50 shadow-[0_0_50px_hsl(200_100%_55%/0.5)] group-hover:shadow-[0_0_70px_hsl(200_100%_55%/0.8)] transition-all duration-300">
                    <img
                      src={profileImage}
                      alt="Rendy Widjaya"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>

              {/* Text Content */}
              <div className="text-center md:text-left order-2 md:order-2">
                <div className="mb-8">
                  <TypewriterEffect
                    texts={typewriterTexts}
                    className="text-3xl md:text-5xl lg:text-6xl font-bold min-h-[60px] md:min-h-[100px]"
                  />
                </div>
                
                <p className="text-base md:text-lg text-muted-foreground mb-8 animate-fade-in-up">
                  Developer portofolio profesional dengan fokus pada teknologi dan inovasi
                </p>
                
                <Button
                  size="lg"
                  onClick={() => scrollToSection("projects")}
                  className="text-lg px-8 py-6 bg-primary hover:bg-primary/90 shadow-[0_0_20px_hsl(200_100%_55%/0.5)] hover:shadow-[0_0_30px_hsl(200_100%_55%/0.8)] transition-all duration-300"
                >
                  Lihat Portofolio
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-primary rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-primary rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 relative">
        <div className="container mx-auto px-4">
          <SmoothScroll>
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold mb-8 text-center bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                Tentang Saya
              </h2>
              <Card className="border-primary/20 bg-card/50 backdrop-blur-sm hover:border-primary/40 transition-all duration-300">
                <CardContent className="p-8 text-center">
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Saya adalah mahasiswa baru Teknik Informatika dari Institut Bisnis dan Informatika Kosgoro 1957 
                    dengan minat kuat di bidang teknologi dan pengembangan perangkat lunak. Berpengalaman dalam proyek 
                    implementasi Odoo 12 dan pembuatan aplikasi Android sederhana. Saya berkomitmen untuk terus 
                    belajar, beradaptasi, dan berkontribusi di dunia IT.
                  </p>
                </CardContent>
              </Card>
            </div>
          </SmoothScroll>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 bg-secondary/20">
        <div className="container mx-auto px-4">
          <SmoothScroll>
            <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              Proyek Saya
            </h2>
          </SmoothScroll>

          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
            {projects.map((project, index) => (
              <SmoothScroll key={index}>
                <Card className="h-full border-primary/20 bg-card/50 backdrop-blur-sm hover:border-primary hover:shadow-[0_0_30px_hsl(200_100%_55%/0.3)] transition-all duration-300 group">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      {index === 0 ? (
                        <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                          <Laptop className="h-6 w-6 text-primary" />
                        </div>
                      ) : (
                        <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                          <Smartphone className="h-6 w-6 text-primary" />
                        </div>
                      )}
                    </div>
                    <CardTitle className="text-xl text-primary group-hover:text-primary-glow transition-colors">
                      {project.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4 leading-relaxed">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag, tagIndex) => (
                        <Badge
                          key={tagIndex}
                          variant="secondary"
                          className="bg-primary/10 text-primary border-primary/30"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </SmoothScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Education Section */}
      <section id="education" className="py-20">
        <div className="container mx-auto px-4">
          <SmoothScroll>
            <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              Pendidikan
            </h2>
          </SmoothScroll>

          <div className="max-w-4xl mx-auto space-y-6">
            <SmoothScroll>
              <Card className="border-primary/20 bg-card/50 backdrop-blur-sm hover:border-primary/40 transition-all duration-300">
                <CardContent className="p-6 flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10 flex-shrink-0">
                    <GraduationCap className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-primary mb-1">
                      Institut Bisnis dan Informatika Kosgoro 1957
                    </h3>
                    <p className="text-muted-foreground mb-2">S1 - Teknik Informatika</p>
                    <p className="text-sm text-muted-foreground">2025 – Sekarang</p>
                  </div>
                </CardContent>
              </Card>
            </SmoothScroll>

            <SmoothScroll>
              <Card className="border-primary/20 bg-card/50 backdrop-blur-sm hover:border-primary/40 transition-all duration-300">
                <CardContent className="p-6 flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10 flex-shrink-0">
                    <GraduationCap className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-primary mb-1">
                      SMA Negeri 38 Jakarta
                    </h3>
                    <p className="text-muted-foreground mb-2">Jurusan MIPA – Kurikulum Merdeka Teknik</p>
                    <p className="text-sm text-muted-foreground">2022 – 2025</p>
                  </div>
                </CardContent>
              </Card>
            </SmoothScroll>
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section id="achievements" className="py-20 bg-secondary/20">
        <div className="container mx-auto px-4">
          <SmoothScroll>
            <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              Pencapaian
            </h2>
          </SmoothScroll>

          <div className="max-w-3xl mx-auto">
            <SmoothScroll>
              <Card className="border-primary/20 bg-card/50 backdrop-blur-sm hover:border-primary hover:shadow-[0_0_30px_hsl(200_100%_55%/0.3)] transition-all duration-300">
                <CardContent className="p-8">
                  <div className="flex items-start gap-6">
                    <div className="p-4 rounded-lg bg-accent/10 flex-shrink-0">
                      <Award className="h-10 w-10 text-accent" />
                    </div>
                    <div>
                    <h3 className="text-2xl font-bold text-primary mb-2">
                        Juara 3 Lomba Karya Ilmiah Remaja Bidang Aplikasi Teknologi (2024)
                      </h3>
                      <p className="text-muted-foreground text-lg">
                        Proyek aplikasi mobile berbasis Kotlin
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </SmoothScroll>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-20">
        <div className="container mx-auto px-4">
          <SmoothScroll>
            <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              Kemampuan
            </h2>
          </SmoothScroll>

          <div className="max-w-4xl mx-auto">
            <SmoothScroll>
              <Card className="border-primary/20 bg-card/50 backdrop-blur-sm hover:border-primary/40 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl text-primary justify-center">
                    <Code2 className="h-6 w-6" />
                    Kemampuan
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="grid md:grid-cols-2 gap-4">
                    {technicalSkills.map((skill, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="h-2 w-2 rounded-full bg-primary mt-2 flex-shrink-0 shadow-[0_0_10px_hsl(200_100%_55%)]" />
                        <span className="text-foreground">{skill}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </SmoothScroll>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-secondary/20">
        <div className="container mx-auto px-4">
          <SmoothScroll>
            <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              Kontak
            </h2>
          </SmoothScroll>

          <div className="max-w-2xl mx-auto">
            <SmoothScroll>
              <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
                <CardContent className="p-8 space-y-6">
                  <div className="flex items-start gap-4 group cursor-pointer">
                    <div className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <Mail className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-foreground mb-1">Email</h3>
                      <a
                        href="mailto:rendywidjaya9@gmail.com"
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        rendywidjaya9@gmail.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 group cursor-pointer">
                    <div className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <Phone className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-foreground mb-1">Telepon</h3>
                      <a
                        href="tel:+6282112439625"
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        +62 821-1243-9625
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <MapPin className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-foreground mb-1">Lokasi</h3>
                      <p className="text-muted-foreground">Jakarta Selatan</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </SmoothScroll>

            <SmoothScroll>
              <div className="text-center mt-8">
                <Button
                  size="lg"
                  onClick={() => window.location.href = 'mailto:rendywidjaya9@gmail.com'}
                  className="text-lg px-8 py-6 bg-primary hover:bg-primary/90 shadow-[0_0_20px_hsl(200_100%_55%/0.5)] hover:shadow-[0_0_30px_hsl(200_100%_55%/0.8)] transition-all duration-300"
                >
                  Hubungi Saya
                </Button>
              </div>
            </SmoothScroll>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-primary/20">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">
            © 2025 Rendy Widjaya. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
