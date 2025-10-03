import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { ArrowLeft, Brain, MapPin, Clock, User, Activity, AlertTriangle, CheckCircle, Calendar } from "lucide-react";

interface PredictionData {
  triageLevel: number;
  department: string;
  confidence: number;
  estimatedWaitTime: string;
  recommendedActions: string[];
  riskFactors: string[];
  bedAssigned?: string;
}

const PredictionResult = () => {
  const navigate = useNavigate();
  const [patientData, setPatientData] = useState<any>(null);
  const [prediction, setPrediction] = useState<PredictionData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get patient data from localStorage
    const storedData = localStorage.getItem('patientData');
    if (!storedData) {
      toast.error("No patient data found. Please fill out the form first.");
      navigate('/form');
      return;
    }

    const data = JSON.parse(storedData);
    setPatientData(data);

    // Simulate AI prediction (in real app, this would be an API call)
    setTimeout(() => {
      const mockPrediction = generateMockPrediction(data);
      setPrediction(mockPrediction);
      setLoading(false);
    }, 2000);
  }, [navigate]);

  const generateMockPrediction = (data: any): PredictionData => {
    // Simple rule-based mock prediction
    let triageLevel = 3;
    let department = "General";
    let riskFactors: string[] = [];

    // Analyze vitals for triage level
    const heartRate = parseInt(data.heartRate);
    const spo2 = parseInt(data.spo2);
    const tempF = parseFloat(data.temperature);
    const systolic = parseInt(data.bloodPressureSystolic);

    // Critical conditions
    if (spo2 < 90 || heartRate > 120 || heartRate < 50 || tempF > 104 || systolic > 180) {
      triageLevel = 1;
      department = "ICU";
      riskFactors.push("Critical vital signs detected");
    }
    // High priority
    else if (spo2 < 95 || heartRate > 100 || tempF > 101 || systolic > 160 || data.symptoms.includes("Chest Pain")) {
      triageLevel = 2;
      department = data.symptoms.includes("Chest Pain") ? "Cardiology" : "Emergency";
      riskFactors.push("Abnormal vital signs");
    }
    // Medium priority
    else if (tempF > 99.5 || data.symptoms.includes("Fever") || data.symptoms.includes("Shortness of Breath")) {
      triageLevel = 3;
      department = "General";
    }
    // Low priority
    else if (data.symptoms.length > 0) {
      triageLevel = 4;
      department = "General";
    }
    // Routine
    else {
      triageLevel = 5;
      department = "General";
    }

    // Add age-based risk factors
    const age = parseInt(data.age);
    if (age > 65) riskFactors.push("Advanced age");
    if (age < 5) riskFactors.push("Pediatric patient");

    // Add symptom-based risk factors
    if (data.symptoms.includes("Chest Pain")) riskFactors.push("Cardiac symptoms");
    if (data.symptoms.includes("Shortness of Breath")) riskFactors.push("Respiratory distress");

    const bedNumbers = {
      "ICU": ["ICU-01", "ICU-02", "ICU-05"],
      "Emergency": ["ER-12", "ER-08", "ER-15"],
      "Cardiology": ["CARD-03", "CARD-07"],
      "General": ["GEN-24", "GEN-31", "GEN-18"]
    };

    return {
      triageLevel,
      department,
      confidence: Math.random() * 15 + 85, // 85-100%
      estimatedWaitTime: triageLevel === 1 ? "Immediate" : triageLevel === 2 ? "5-15 min" : triageLevel === 3 ? "30-60 min" : "1-2 hours",
      recommendedActions: getRecommendedActions(triageLevel, data.symptoms),
      riskFactors,
      bedAssigned: bedNumbers[department as keyof typeof bedNumbers]?.[Math.floor(Math.random() * 3)]
    };
  };

  const getRecommendedActions = (triage: number, symptoms: string[]): string[] => {
    const actions = [];
    
    if (triage === 1) {
      actions.push("Immediate medical attention required");
      actions.push("Continuous monitoring");
      actions.push("Prepare for emergency interventions");
    } else if (triage === 2) {
      actions.push("Priority evaluation within 15 minutes");
      actions.push("Regular vital signs monitoring");
      actions.push("Pain management if needed");
    } else if (triage === 3) {
      actions.push("Standard evaluation within 1 hour");
      actions.push("Comfort measures");
    } else {
      actions.push("Routine assessment");
      actions.push("General waiting area");
    }

    if (symptoms.includes("Chest Pain")) {
      actions.push("ECG monitoring recommended");
    }
    if (symptoms.includes("Fever")) {
      actions.push("Temperature monitoring");
    }

    return actions;
  };

  const getTriageInfo = (level: number) => {
    const info = {
      1: { name: "Critical", color: "triage-1", description: "Life-threatening - Immediate care required" },
      2: { name: "High", color: "triage-2", description: "Urgent - Care needed within 15 minutes" },
      3: { name: "Medium", color: "triage-3", description: "Semi-urgent - Care needed within 1 hour" },
      4: { name: "Low", color: "triage-4", description: "Standard - Can wait for routine care" },
      5: { name: "Routine", color: "triage-5", description: "Non-urgent - Scheduled appointment appropriate" }
    };
    return info[level as keyof typeof info];
  };

  const getDepartmentColor = (dept: string) => {
    const colors = {
      "ICU": "dept-icu",
      "Emergency": "dept-emergency",
      "Cardiology": "dept-cardiology",
      "General": "dept-general",
      "Surgery": "dept-surgery"
    };
    return colors[dept as keyof typeof colors] || "primary";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Brain className="h-16 w-16 text-primary mx-auto animate-pulse" />
          <h2 className="text-2xl font-bold">AI is analyzing patient data...</h2>
          <p className="text-muted-foreground">Processing symptoms, vitals, and medical history</p>
          <Progress value={75} className="w-64" />
        </div>
      </div>
    );
  }

  if (!prediction || !patientData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-16 w-16 text-destructive mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Error Loading Results</h2>
          <Button onClick={() => navigate('/form')}>Return to Form</Button>
        </div>
      </div>
    );
  }

  const triageInfo = getTriageInfo(prediction.triageLevel);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" onClick={() => navigate('/form')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                New Patient
              </Button>
              <div className="flex items-center space-x-2">
                <Brain className="h-6 w-6 text-primary" />
                <h1 className="text-2xl font-bold text-foreground">AI Prediction Results</h1>
              </div>
            </div>
            <Button onClick={() => navigate('/dashboard')}>
              View Dashboard
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* Patient Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Patient: {patientData.name}</span>
              </CardTitle>
              <CardDescription>
                {patientData.age} years old • {patientData.gender} • Evaluation completed
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Main Prediction Results */}
          <div className="grid md:grid-cols-2 gap-6">
            
            {/* Triage Level */}
            <Card className="border-l-4" style={{ borderLeftColor: `hsl(var(--${triageInfo.color}))` }}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <div className={`w-8 h-8 rounded-full bg-${triageInfo.color} text-white font-bold flex items-center justify-center`}>
                    {prediction.triageLevel}
                  </div>
                  <span>Triage Level: {triageInfo.name}</span>
                </CardTitle>
                <CardDescription>{triageInfo.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">AI Confidence:</span>
                    <Badge variant="secondary">{prediction.confidence.toFixed(1)}%</Badge>
                  </div>
                  <Progress value={prediction.confidence} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Department Assignment */}
            <Card className={`border-l-4 border-${getDepartmentColor(prediction.department)}`}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className={`h-5 w-5 text-${getDepartmentColor(prediction.department)}`} />
                  <span>Department: {prediction.department}</span>
                </CardTitle>
                <CardDescription>Recommended treatment location</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Estimated Wait:</span>
                    <Badge className={`bg-${getDepartmentColor(prediction.department)}/10 text-${getDepartmentColor(prediction.department)}`}>
                      {prediction.estimatedWaitTime}
                    </Badge>
                  </div>
                  {prediction.bedAssigned && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Assigned Bed:</span>
                      <Badge variant="outline">{prediction.bedAssigned}</Badge>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Risk Factors */}
          {prediction.riskFactors.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-triage-2" />
                  <span>Risk Factors Identified</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-2">
                  {prediction.riskFactors.map((factor, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-triage-2 rounded-full" />
                      <span className="text-sm">{factor}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recommended Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-status-available" />
                <span>Recommended Actions</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {prediction.recommendedActions.map((action, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-status-available text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                      {index + 1}
                    </div>
                    <span className="text-sm">{action}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="font-semibold">Next Steps</h3>
                  <p className="text-sm text-muted-foreground">
                    Patient has been registered and bed {prediction.bedAssigned} has been assigned
                  </p>
                </div>
                <div className="flex space-x-3">
                  <Button variant="outline" onClick={() => navigate('/appointments')}>
                    <Calendar className="h-4 w-4 mr-2" />
                    Book Follow-up
                  </Button>
                  <Button onClick={() => navigate('/dashboard')}>
                    View Dashboard
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PredictionResult;