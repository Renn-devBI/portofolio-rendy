import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Code2, Users } from "lucide-react";

const Skills = () => {
  const technicalSkills = [
    "Odoo 12 (Implementasi & Dokumentasi)",
    "Kotlin (Dasar)",
    "Android Development",
    "Dokumentasi Teknis & User Guides",
    "Pembuatan Flowchart Proses",
    "Produksi Video Tutorial",
  ];

  const softSkills = [
    "Problem Solving",
    "Komunikasi",
    "Bekerja (Individu & Tim)",
    "Digital Marketing",
    "Pemasaran",
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              Keterampilan
            </h1>
            <p className="text-muted-foreground text-lg">
              Kemampuan teknis dan non-teknis yang saya miliki
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Code2 className="h-6 w-6 text-primary" />
                  Keterampilan Teknis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {technicalSkills.map((skill, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="h-2 w-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                      <span className="text-foreground">{skill}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Users className="h-6 w-6 text-accent" />
                  Keterampilan Non-Teknis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {softSkills.map((skill, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="h-2 w-2 rounded-full bg-accent mt-2 flex-shrink-0" />
                      <span className="text-foreground">{skill}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Skills;
