import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Users, Bed, Activity, Filter, Search, Calendar, MapPin, Clock, AlertTriangle } from "lucide-react";

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  triageLevel: number;
  department: string;
  bedNumber: string;
  admissionTime: string;
  status: 'waiting' | 'in-treatment' | 'discharged';
  vitals: {
    heartRate: number;
    spo2: number;
    temperature: number;
    bloodPressure: string;
  };
}

interface BedInfo {
  number: string;
  department: string;
  status: 'available' | 'occupied' | 'maintenance';
  patient?: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTriage, setFilterTriage] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  // Mock data - in real app, this would come from API
  const mockPatients: Patient[] = [
    {
      id: "P001",
      name: "John Smith",
      age: 65,
      gender: "Male",
      triageLevel: 1,
      department: "ICU",
      bedNumber: "ICU-01",
      admissionTime: "2024-01-15 14:30",
      status: "in-treatment",
      vitals: { heartRate: 95, spo2: 92, temperature: 102.1, bloodPressure: "180/95" }
    },
    {
      id: "P002",
      name: "Sarah Johnson",
      age: 34,
      gender: "Female",
      triageLevel: 2,
      department: "Emergency",
      bedNumber: "ER-08",
      admissionTime: "2024-01-15 15:45",
      status: "waiting",
      vitals: { heartRate: 105, spo2: 96, temperature: 101.2, bloodPressure: "140/90" }
    },
    {
      id: "P003",
      name: "Michael Davis",
      age: 28,
      gender: "Male",
      triageLevel: 3,
      department: "General",
      bedNumber: "GEN-24",
      admissionTime: "2024-01-15 16:20",
      status: "in-treatment",
      vitals: { heartRate: 78, spo2: 98, temperature: 99.8, bloodPressure: "125/80" }
    },
    {
      id: "P004",
      name: "Emily Wilson",
      age: 42,
      gender: "Female",
      triageLevel: 2,
      department: "Cardiology",
      bedNumber: "CARD-03",
      admissionTime: "2024-01-15 13:15",
      status: "discharged",
      vitals: { heartRate: 88, spo2: 99, temperature: 98.6, bloodPressure: "130/85" }
    }
  ];

  const mockBeds: BedInfo[] = [
    { number: "ICU-01", department: "ICU", status: "occupied", patient: "John Smith" },
    { number: "ICU-02", department: "ICU", status: "available" },
    { number: "ER-08", department: "Emergency", status: "occupied", patient: "Sarah Johnson" },
    { number: "ER-12", department: "Emergency", status: "available" },
    { number: "GEN-24", department: "General", status: "occupied", patient: "Michael Davis" },
    { number: "GEN-31", department: "General", status: "maintenance" },
    { number: "CARD-03", department: "Cardiology", status: "available" },
    { number: "CARD-07", department: "Cardiology", status: "available" }
  ];

  const getTriageInfo = (level: number) => {
    const info = {
      1: { name: "Critical", color: "triage-1" },
      2: { name: "High", color: "triage-2" },
      3: { name: "Medium", color: "triage-3" },
      4: { name: "Low", color: "triage-4" },
      5: { name: "Routine", color: "triage-5" }
    };
    return info[level as keyof typeof info];
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      waiting: "bg-triage-3/10 text-triage-3",
      "in-treatment": "bg-primary/10 text-primary",
      discharged: "bg-status-available/10 text-status-available"
    };
    return variants[status as keyof typeof variants] || "secondary";
  };

  const getBedStatusColor = (status: string) => {
    return {
      available: "status-available",
      occupied: "status-occupied", 
      maintenance: "status-maintenance"
    }[status] || "muted";
  };

  const filteredPatients = mockPatients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTriage = !filterTriage || filterTriage === "all" || patient.triageLevel.toString() === filterTriage;
    const matchesDepartment = !filterDepartment || filterDepartment === "all" || patient.department === filterDepartment;
    const matchesStatus = !filterStatus || filterStatus === "all" || patient.status === filterStatus;
    
    return matchesSearch && matchesTriage && matchesDepartment && matchesStatus;
  });

  const departmentStats = mockBeds.reduce((acc, bed) => {
    if (!acc[bed.department]) {
      acc[bed.department] = { total: 0, available: 0, occupied: 0, maintenance: 0 };
    }
    acc[bed.department].total++;
    acc[bed.department][bed.status]++;
    return acc;
  }, {} as Record<string, any>);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" onClick={() => navigate('/')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
              <div className="flex items-center space-x-2">
                <Activity className="h-6 w-6 text-primary" />
                <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
              </div>
            </div>
            <Button onClick={() => navigate('/form')}>
              New Patient Intake
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Overview Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Patients</p>
                  <p className="text-2xl font-bold">{mockPatients.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-triage-1" />
                <div>
                  <p className="text-sm text-muted-foreground">Critical Cases</p>
                  <p className="text-2xl font-bold">{mockPatients.filter(p => p.triageLevel === 1).length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Bed className="h-5 w-5 text-status-available" />
                <div>
                  <p className="text-sm text-muted-foreground">Available Beds</p>
                  <p className="text-2xl font-bold">{mockBeds.filter(b => b.status === 'available').length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-accent" />
                <div>
                  <p className="text-sm text-muted-foreground">Avg Wait Time</p>
                  <p className="text-2xl font-bold">23m</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="patients" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="patients">Patient Management</TabsTrigger>
            <TabsTrigger value="beds">Bed Management</TabsTrigger>
          </TabsList>

          <TabsContent value="patients" className="space-y-4">
            {/* Filters */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center space-x-2">
                    <Search className="h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search patients..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-64"
                    />
                  </div>
                  <Select value={filterTriage} onValueChange={setFilterTriage}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Triage Level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Levels</SelectItem>
                      <SelectItem value="1">Level 1 - Critical</SelectItem>
                      <SelectItem value="2">Level 2 - High</SelectItem>
                      <SelectItem value="3">Level 3 - Medium</SelectItem>
                      <SelectItem value="4">Level 4 - Low</SelectItem>
                      <SelectItem value="5">Level 5 - Routine</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      <SelectItem value="ICU">ICU</SelectItem>
                      <SelectItem value="Emergency">Emergency</SelectItem>
                      <SelectItem value="Cardiology">Cardiology</SelectItem>
                      <SelectItem value="General">General</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="waiting">Waiting</SelectItem>
                      <SelectItem value="in-treatment">In Treatment</SelectItem>
                      <SelectItem value="discharged">Discharged</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Patient List */}
            <div className="space-y-3">
              {filteredPatients.map((patient) => {
                const triageInfo = getTriageInfo(patient.triageLevel);
                return (
                  <Card key={patient.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className={`w-10 h-10 rounded-full bg-${triageInfo.color} text-white font-bold flex items-center justify-center`}>
                            {patient.triageLevel}
                          </div>
                          <div>
                            <h3 className="font-semibold">{patient.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {patient.age} years • {patient.gender} • ID: {patient.id}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-6">
                          <div className="text-center">
                            <p className="text-sm text-muted-foreground">Department</p>
                            <Badge variant="outline">{patient.department}</Badge>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-muted-foreground">Bed</p>
                            <Badge variant="secondary">{patient.bedNumber}</Badge>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-muted-foreground">Status</p>
                            <Badge className={getStatusBadge(patient.status)}>
                              {patient.status.replace('-', ' ')}
                            </Badge>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-muted-foreground">Vitals</p>
                            <p className="text-sm">HR: {patient.vitals.heartRate} | SPO2: {patient.vitals.spo2}%</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="beds" className="space-y-4">
            {/* Department Overview */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {Object.entries(departmentStats).map(([dept, stats]) => (
                <Card key={dept}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{dept}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Total Beds:</span>
                        <span className="font-medium">{stats.total}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-status-available">Available:</span>
                        <span className="font-medium text-status-available">{stats.available}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-status-occupied">Occupied:</span>
                        <span className="font-medium text-status-occupied">{stats.occupied}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Bed Grid */}
            <Card>
              <CardHeader>
                <CardTitle>Bed Status Overview</CardTitle>
                <CardDescription>Real-time bed availability across all departments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {mockBeds.map((bed) => (
                    <div
                      key={bed.number}
                      className={`p-3 rounded-lg border-2 text-center transition-colors ${
                        bed.status === 'available' ? 'border-status-available bg-status-available/10' :
                        bed.status === 'occupied' ? 'border-status-occupied bg-status-occupied/10' :
                        'border-status-maintenance bg-status-maintenance/10'
                      }`}
                    >
                      <div className={`w-3 h-3 rounded-full bg-${getBedStatusColor(bed.status)} mx-auto mb-2`} />
                      <p className="font-medium text-sm">{bed.number}</p>
                      <p className="text-xs text-muted-foreground mb-1">{bed.department}</p>
                      {bed.patient && (
                        <p className="text-xs font-medium truncate">{bed.patient}</p>
                      )}
                      <Badge
                        variant="secondary"
                        className={`text-xs bg-${getBedStatusColor(bed.status)}/20 text-${getBedStatusColor(bed.status)}`}
                      >
                        {bed.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;