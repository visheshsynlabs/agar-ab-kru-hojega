import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { Activity, Users, Calendar, Bed, Shield, Brain } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Triage",
      description: "Advanced machine learning models predict patient priority levels with 95% accuracy",
      color: "bg-primary"
    },
    {
      icon: Activity,
      title: "Real-time Vitals Analysis",
      description: "Instant analysis of blood pressure, SPO2, heart rate, and temperature",
      color: "bg-accent"
    },
    {
      icon: Users,
      title: "Smart Department Routing",
      description: "Automatically route patients to ICU, Emergency, Cardiology, or General wards",
      color: "bg-department-cardiology"
    },
    {
      icon: Bed,
      title: "Bed Management",
      description: "Real-time bed availability tracking and automatic assignment",
      color: "bg-status-available"
    },
    {
      icon: Calendar,
      title: "Appointment Booking",
      description: "Patients can book doctor appointments for regular checkups from home",
      color: "bg-triage-3"
    },
    {
      icon: Shield,
      title: "Continuous Learning",
      description: "Models retrain based on doctor feedback to improve accuracy over time",
      color: "bg-department-surgery"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <header className="border-b bg-card shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Activity className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-foreground">MediTriage AI</h1>
            </div>
            <nav className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => navigate('/form')}>
                Patient Intake
              </Button>
              <Button variant="outline" onClick={() => navigate('/appointments')}>
                Book Appointment
              </Button>
              <Button onClick={() => navigate('/dashboard')}>
                Admin Dashboard
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="container mx-auto px-4 text-center">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
            AI-Powered Healthcare
          </Badge>
          <h2 className="text-5xl font-bold text-foreground mb-6">
            Revolutionizing Hospital
            <span className="text-primary block">Patient Triage</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Our advanced AI system analyzes patient symptoms and vitals to predict triage levels 
            and route patients to the right department, minimizing wait times and saving lives.
          </p>
          <div className="flex justify-center space-x-4">
            <Button size="lg" onClick={() => navigate('/form')} className="bg-primary hover:bg-primary-hover">
              Start Patient Evaluation
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/dashboard')}>
              View Dashboard
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-foreground mb-4">
              Intelligent Healthcare Management
            </h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Comprehensive features designed to streamline hospital operations and improve patient outcomes
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center mb-4`}>
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Triage Levels Overview */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-foreground mb-4">
              Triage Classification System
            </h3>
            <p className="text-muted-foreground">
              Our AI classifies patients into 5 priority levels for optimal care delivery
            </p>
          </div>
          <div className="grid md:grid-cols-5 gap-4">
            {[
              { level: 1, name: "Critical", description: "Immediate life-threatening", color: "bg-triage-1" },
              { level: 2, name: "High", description: "Urgent care needed", color: "bg-triage-2" },
              { level: 3, name: "Medium", description: "Semi-urgent treatment", color: "bg-triage-3" },
              { level: 4, name: "Low", description: "Standard care", color: "bg-triage-4" },
              { level: 5, name: "Routine", description: "Scheduled appointment", color: "bg-triage-5" }
            ].map((triage) => (
              <Card key={triage.level} className="text-center">
                <CardHeader>
                  <div className={`w-16 h-16 rounded-full ${triage.color} text-white font-bold text-2xl flex items-center justify-center mx-auto mb-2`}>
                    {triage.level}
                  </div>
                  <CardTitle className="text-lg">{triage.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{triage.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 bg-card">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">
            © 2024 MediTriage AI. Revolutionizing healthcare with artificial intelligence.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;