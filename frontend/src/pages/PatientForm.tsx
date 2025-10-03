import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ArrowLeft, User, Activity, Stethoscope, Brain } from "lucide-react";

interface PatientData {
  name: string;
  age: string;
  gender: string;
  symptoms: string[];
  bloodPressureSystolic: string;
  bloodPressureDiastolic: string;
  spo2: string;
  heartRate: string;
  temperature: string;
  sugarLevel: string;
  symptomsText: string;
}

const PatientForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<PatientData>({
    name: "",
    age: "",
    gender: "",
    symptoms: [],
    bloodPressureSystolic: "",
    bloodPressureDiastolic: "",
    spo2: "",
    heartRate: "",
    temperature: "",
    sugarLevel: "",
    symptomsText: ""
  });

  const commonSymptoms = [
    "Chest Pain", "Shortness of Breath", "Fever", "Headache", "Nausea", "Vomiting",
    "Dizziness", "Fatigue", "Abdominal Pain", "Back Pain", "Cough", "Difficulty Swallowing"
  ];

  const handleSymptomChange = (symptom: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      symptoms: checked 
        ? [...prev.symptoms, symptom]
        : prev.symptoms.filter(s => s !== symptom)
    }));
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  // Validation
  if (!formData.name || !formData.age || !formData.gender) {
    toast.error("Please fill in all required patient information");
    return;
  }

  if (
    !formData.heartRate ||
    !formData.bloodPressureSystolic ||
    !formData.spo2 ||
    !formData.temperature
  ) {
    toast.error("Please provide all vital signs");
    return;
  }

  // Convert string values to appropriate numeric types
  const submitData = {
    name: formData.name,
    age: parseInt(formData.age), // Keep as string if your backend expects string
    gender: formData.gender,
    symptoms: formData.symptoms,
    bloodPressureSystolic: parseInt(formData.bloodPressureSystolic),
    bloodPressureDiastolic: parseInt(formData.bloodPressureDiastolic),
    spo2: parseInt(formData.spo2),
    heartRate: parseInt(formData.heartRate),
    temperature: parseFloat(formData.temperature),
    sugarLevel: formData.sugarLevel ? parseInt(formData.sugarLevel) : 0, // Handle optional field
    symptomsText: formData.symptomsText,
  };

  console.log("Submitting patient data:", submitData);

  try {
    const res = await fetch("https://23bf367a1d57.ngrok-free.app/patients", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true", // Add this header for ngrok
      },
      body: JSON.stringify(submitData),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Server error:", errText);
      throw new Error(errText || "Failed to submit patient data");
    }

    const data = await res.json();
    toast.success("Patient data submitted successfully!");
    console.log("Submitted patient data:", data);

    // Navigate to results page
    navigate("/result", {
      state: { patientId: data.patient?.patient_id, patient: data.patient },
    });
  } catch (err) {
    console.error("Submission error:", err);
    toast.error("Error submitting patient data. Please try again.");
  }
};

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" onClick={() => navigate('/')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
            <div className="flex items-center space-x-2">
              <User className="h-6 w-6 text-primary" />
              <h1 className="text-2xl font-bold text-foreground">Patient Intake Form</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Patient Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-primary" />
                  <span>Patient Information</span>
                </CardTitle>
                <CardDescription>
                  Basic patient demographics and contact information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter patient's full name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="age">Age *</Label>
                    <Input
                      id="age"
                      type="number"
                      value={formData.age}
                      onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                      placeholder="Age in years"
                      min="0"
                      max="150"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender *</Label>
                    <Select value={formData.gender} onValueChange={(value) => setFormData(prev => ({ ...prev, gender: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Vital Signs */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="h-5 w-5 text-accent" />
                  <span>Vital Signs</span>
                </CardTitle>
                <CardDescription>
                  Current patient vital measurements
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bp-systolic">Blood Pressure *</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="bp-systolic"
                        type="number"
                        value={formData.bloodPressureSystolic}
                        onChange={(e) => setFormData(prev => ({ ...prev, bloodPressureSystolic: e.target.value }))}
                        placeholder="Systolic"
                        min="50"
                        max="300"
                        required
                      />
                      <span className="flex items-center text-muted-foreground">/</span>
                      <Input
                        type="number"
                        value={formData.bloodPressureDiastolic}
                        onChange={(e) => setFormData(prev => ({ ...prev, bloodPressureDiastolic: e.target.value }))}
                        placeholder="Diastolic"
                        min="30"
                        max="200"
                        required
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">Normal: 120/80 mmHg</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="spo2">SPO2 (%) *</Label>
                    <Input
                      id="spo2"
                      type="number"
                      value={formData.spo2}
                      onChange={(e) => setFormData(prev => ({ ...prev, spo2: e.target.value }))}
                      placeholder="Oxygen saturation"
                      min="50"
                      max="100"
                      required
                    />
                    <p className="text-xs text-muted-foreground">Normal: 95-100%</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="heartRate">Heart Rate (BPM) *</Label>
                    <Input
                      id="heartRate"
                      type="number"
                      value={formData.heartRate}
                      onChange={(e) => setFormData(prev => ({ ...prev, heartRate: e.target.value }))}
                      placeholder="Beats per minute"
                      min="30"
                      max="250"
                      required
                    />
                    <p className="text-xs text-muted-foreground">Normal: 60-100 BPM</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="temperature">Temperature (°F) *</Label>
                    <Input
                      id="temperature"
                      type="number"
                      step="0.1"
                      value={formData.temperature}
                      onChange={(e) => setFormData(prev => ({ ...prev, temperature: e.target.value }))}
                      placeholder="Body temperature"
                      min="90"
                      max="115"
                      required
                    />
                    <p className="text-xs text-muted-foreground">Normal: 98.6°F</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sugarLevel">Blood Sugar (mg/dL)</Label>
                    <Input
                      id="sugarLevel"
                      type="number"
                      value={formData.sugarLevel}
                      onChange={(e) => setFormData(prev => ({ ...prev, sugarLevel: e.target.value }))}
                      placeholder="Blood glucose level"
                      min="30"
                      max="600"
                    />
                    <p className="text-xs text-muted-foreground">Normal: 80-120 mg/dL</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Symptoms */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Stethoscope className="h-5 w-5 text-department-cardiology" />
                  <span>Symptoms Assessment</span>
                </CardTitle>
                <CardDescription>
                  Select current symptoms and provide additional details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="text-base font-medium">Common Symptoms</Label>
                  <p className="text-sm text-muted-foreground mb-4">Select all symptoms that apply</p>
                  <div className="grid md:grid-cols-3 gap-3">
                    {commonSymptoms.map((symptom) => (
                      <div key={symptom} className="flex items-center space-x-2">
                        <Checkbox
                          id={symptom}
                          checked={formData.symptoms.includes(symptom)}
                          onCheckedChange={(checked) => handleSymptomChange(symptom, !!checked)}
                        />
                        <Label htmlFor={symptom} className="text-sm cursor-pointer">
                          {symptom}
                        </Label>
                      </div>
                    ))}
                  </div>
                  {formData.symptoms.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-medium mb-2">Selected symptoms:</p>
                      <div className="flex flex-wrap gap-2">
                        {formData.symptoms.map((symptom) => (
                          <Badge key={symptom} variant="secondary">
                            {symptom}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="symptomsText">Additional Symptoms & Details</Label>
                  <Textarea
                    id="symptomsText"
                    value={formData.symptomsText}
                    onChange={(e) => setFormData(prev => ({ ...prev, symptomsText: e.target.value }))}
                    placeholder="Describe any additional symptoms, pain levels, duration, or other relevant details..."
                    rows={4}
                  />
                  <p className="text-xs text-muted-foreground">
                    Our AI will analyze this text to identify key symptoms and severity indicators
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Submit */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <Brain className="h-5 w-5" />
                    <span>AI will analyze this data to predict triage level and recommend department</span>
                  </div>
                  <Button type="submit" size="lg" className="bg-primary hover:bg-primary-hover">
                    Submit for AI Evaluation
                  </Button>
                </div>
              </CardContent>
            </Card>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PatientForm;