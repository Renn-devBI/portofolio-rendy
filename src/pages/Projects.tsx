import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Projects = () => {
  const projects = [
    {
      title: "Proyek Pembelajaran Mandiri: Implementasi Odoo 12",
      description:
        "Menganalisis dan membuat dokumentasi teknis, flowchart proses, dan video tutorial untuk berbagai modul ERP Odoo 12. Modul mencakup Inventory, HR, PR-PO, Payment, BPJS, Scrapping, dll. Saya juga melakukan troubleshooting dasar pada sistem.",
      tags: ["Odoo 12", "ERP", "Dokumentasi Teknis", "Flowchart", "Video Tutorial"],
    },
    {
      title: 'Aplikasi Mobile "BIJAK.RS"',
      description:
        "Membangun aplikasi Android sederhana untuk memfasilitasi pencarian rumah sakit. Proyek ini dikerjakan secara otodidak pada Juni 2024, saat saya masih di bangku SMA.",
      tags: ["Android", "Kotlin", "Mobile Development", "Proyek Pribadi"],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              Proyek Saya
            </h1>
            <p className="text-muted-foreground text-lg">
              Kumpulan proyek yang telah saya kerjakan
            </p>
          </div>

          <div className="grid gap-8">
            {projects.map((project, index) => (
              <Card
                key={index}
                className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border"
              >
                <CardHeader>
                  <CardTitle className="text-2xl">{project.title}</CardTitle>
                  <CardDescription className="text-base leading-relaxed mt-2">
                    {project.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag, tagIndex) => (
                      <Badge key={tagIndex} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Projects;
