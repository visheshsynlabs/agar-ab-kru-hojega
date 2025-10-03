import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ArrowLeft, Calendar as CalendarIcon, Clock, User, Stethoscope, CheckCircle } from "lucide-react";

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  department: string;
  available: boolean;
  nextSlot: string;
}

interface TimeSlot {
  time: string;
  available: boolean;
}

const Appointments = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedDoctor, setSelectedDoctor] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [appointmentType, setAppointmentType] = useState<string>("");
  const [patientInfo, setPatientInfo] = useState({
    name: "",
    phone: "",
    email: "",
    reason: ""
  });

  const mockDoctors: Doctor[] = [
    { id: "D001", name: "Dr. Sarah Wilson", specialty: "Cardiology", department: "Cardiology", available: true, nextSlot: "Today 2:30 PM" },
    { id: "D002", name: "Dr. Michael Chen", specialty: "Internal Medicine", department: "General", available: true, nextSlot: "Today 4:00 PM" },
    { id: "D003", name: "Dr. Emily Rodriguez", specialty: "Emergency Medicine", department: "Emergency", available: false, nextSlot: "Tomorrow 9:00 AM" },
    { id: "D004", name: "Dr. James Thompson", specialty: "Family Medicine", department: "General", available: true, nextSlot: "Today 3:15 PM" },
    { id: "D005", name: "Dr. Lisa Park", specialty: "Pediatrics", department: "General", available: true, nextSlot: "Tomorrow 10:30 AM" },
    { id: "D006", name: "Dr. Robert Davis", specialty: "Orthopedics", department: "Surgery", available: true, nextSlot: "Today 5:00 PM" }
  ];

  const timeSlots: TimeSlot[] = [
    { time: "9:00 AM", available: true },
    { time: "9:30 AM", available: false },
    { time: "10:00 AM", available: true },
    { time: "10:30 AM", available: true },
    { time: "11:00 AM", available: false },
    { time: "11:30 AM", available: true },
    { time: "2:00 PM", available: true },
    { time: "2:30 PM", available: true },
    { time: "3:00 PM", available: false },
    { time: "3:30 PM", available: true },
    { time: "4:00 PM", available: true },
    { time: "4:30 PM", available: true },
    { time: "5:00 PM", available: true }
  ];

  const appointmentTypes = [
    "Regular Checkup",
    "Follow-up Visit",
    "Consultation",
    "Urgent Care",
    "Preventive Care",
    "Specialist Referral"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!patientInfo.name || !patientInfo.phone || !selectedDoctor || !selectedDate || !selectedTime || !appointmentType) {
      toast.error("Please fill in all required fields");
      return;
    }

    const selectedDoctorInfo = mockDoctors.find(d => d.id === selectedDoctor);
    
    // Simulate booking confirmation
    toast.success(
      `Appointment booked successfully with ${selectedDoctorInfo?.name} on ${selectedDate.toLocaleDateString()} at ${selectedTime}`
    );

    // Reset form
    setPatientInfo({ name: "", phone: "", email: "", reason: "" });
    setSelectedDoctor("");
    setSelectedTime("");
    setAppointmentType("");
  };

  const filteredDoctors = selectedDoctor ? mockDoctors.filter(d => d.id === selectedDoctor) : mockDoctors;

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
              <CalendarIcon className="h-6 w-6 text-primary" />
              <h1 className="text-2xl font-bold text-foreground">Book Doctor Appointment</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Main Booking Form */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="h-5 w-5 text-primary" />
                    <span>Patient Information</span>
                  </CardTitle>
                  <CardDescription>
                    Please provide your contact information for the appointment
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={patientInfo.name}
                        onChange={(e) => setPatientInfo(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        value={patientInfo.phone}
                        onChange={(e) => setPatientInfo(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="Your phone number"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={patientInfo.email}
                      onChange={(e) => setPatientInfo(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="your.email@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reason">Reason for Visit</Label>
                    <Textarea
                      id="reason"
                      value={patientInfo.reason}
                      onChange={(e) => setPatientInfo(prev => ({ ...prev, reason: e.target.value }))}
                      placeholder="Brief description of your symptoms or reason for the appointment"
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Stethoscope className="h-5 w-5 text-accent" />
                    <span>Select Doctor & Specialty</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Appointment Type *</Label>
                    <Select value={appointmentType} onValueChange={setAppointmentType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select appointment type" />
                      </SelectTrigger>
                      <SelectContent>
                        {appointmentTypes.map((type) => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label>Available Doctors</Label>
                    <div className="grid gap-3">
                      {mockDoctors.map((doctor) => (
                        <div
                          key={doctor.id}
                          className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                            selectedDoctor === doctor.id
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:border-primary/50'
                          }`}
                          onClick={() => setSelectedDoctor(doctor.id)}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-semibold">{doctor.name}</h3>
                              <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
                              <p className="text-xs text-muted-foreground">{doctor.department} Department</p>
                            </div>
                            <div className="text-right">
                              <Badge 
                                variant={doctor.available ? "default" : "secondary"}
                                className={doctor.available ? "bg-status-available text-white" : ""}
                              >
                                {doctor.available ? "Available" : "Busy"}
                              </Badge>
                              <p className="text-xs text-muted-foreground mt-1">
                                Next: {doctor.nextSlot}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Date & Time Selection */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CalendarIcon className="h-5 w-5 text-department-cardiology" />
                    <span>Select Date</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => date < new Date() || date > new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)}
                    className="rounded-md border"
                  />
                </CardContent>
              </Card>

              {selectedDate && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Clock className="h-5 w-5 text-triage-3" />
                      <span>Available Times</span>
                    </CardTitle>
                    <CardDescription>
                      {selectedDate.toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-2">
                      {timeSlots.map((slot) => (
                        <Button
                          key={slot.time}
                          variant={selectedTime === slot.time ? "default" : "outline"}
                          size="sm"
                          disabled={!slot.available}
                          onClick={() => setSelectedTime(slot.time)}
                          className={`w-full ${
                            selectedTime === slot.time ? 'bg-primary text-white' : ''
                          }`}
                        >
                          {slot.time}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Booking Summary */}
              {selectedDoctor && selectedDate && selectedTime && appointmentType && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5 text-status-available" />
                      <span>Appointment Summary</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Doctor:</span>
                        <span className="font-medium">
                          {mockDoctors.find(d => d.id === selectedDoctor)?.name}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Specialty:</span>
                        <span className="font-medium">
                          {mockDoctors.find(d => d.id === selectedDoctor)?.specialty}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Type:</span>
                        <span className="font-medium">{appointmentType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Date:</span>
                        <span className="font-medium">{selectedDate.toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Time:</span>
                        <span className="font-medium">{selectedTime}</span>
                      </div>
                    </div>
                    <Button 
                      onClick={handleSubmit} 
                      className="w-full bg-primary hover:bg-primary-hover"
                      disabled={!patientInfo.name || !patientInfo.phone}
                    >
                      Confirm Appointment
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Appointments;