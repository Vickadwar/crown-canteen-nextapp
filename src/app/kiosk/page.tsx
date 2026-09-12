"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import {
  Utensils,
  Sparkles,
  Users,
  UserCheck,
  CreditCard,
  Smartphone,
  Banknote,
  Building2,
  Check,
  Clock,
  MapPin,
  Maximize,
  Minimize,
  Volume2,
  VolumeX,
  Fingerprint,
  QrCode,
  ArrowLeft,
  ChevronRight,
  Phone,
  Plus,
  Minus,
  Briefcase,
  Layers,
  FileCheck,
  Camera,
  Scan,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Search,
  UserPlus,
  X,
  ShieldCheck,
  Tag,
  Zap,
  Activity,
  Flame,
  ChevronDown,
  BadgeCheck,
  ShieldAlert,
  HelpCircle,
  Receipt,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  EnrolledStaffDescriptor,
  loadFaceApiModels,
  detectFaceWithDescriptor,
  analyzeFaceFromElement,
  averageVectorCentroid,
  matchFaceVector,
  saveEnrolledFaceLocally,
  getLocalEnrolledStaff,
  parseDescriptor,
  playBiometricSound,
} from "@/lib/faceRecognition";

type KioskStep =
  | "idle"
  | "meal_selection"
  | "guest_check"
  | "guest_config"
  | "payment_method"
  | "mpesa_prompt"
  | "scanning"
  | "unregistered_alert"
  | "already_served_alert"
  | "manual_id"
  | "visitor_flow"
  | "quick_enroll"
  | "success";

type MealOption = "Normal" | "Special";
type GuestSponsor = "employee_payroll" | "employee_cash_mpesa" | "department_hr";
type PaymentMethod = "payroll" | "mpesa" | "cash" | "corporate";

const ENROLLMENT_STEPS = [
  { step: 1, prompt: "Look Straight at Camera (Front Pose)", duration: 750 },
  { step: 2, prompt: "Hold Still · Scanning Facial Landmarks", duration: 750 },
  { step: 3, prompt: "Turn Head Slightly Left (< 10°)", duration: 750 },
  { step: 4, prompt: "Turn Head Slightly Right (> 10°)", duration: 750 },
  { step: 5, prompt: "Relax Face · Neutral Expression", duration: 750 },
];

export default function KioskPage() {
  const [step, setStep] = useState<KioskStep>("idle");
  const [mealType, setMealType] = useState<MealOption>("Normal");
  const [hasGuest, setHasGuest] = useState(false);
  const [guestCount, setGuestCount] = useState(1);
  const [guestMealType, setGuestMealType] = useState<MealOption>("Normal");
  const [guestSponsor, setGuestSponsor] = useState<GuestSponsor>("employee_payroll");
  const [guestDept, setGuestDept] = useState("PROD-01");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("payroll");
  const [mpesaPhone, setMpesaPhone] = useState("0712345678");
  const [manualIdInput, setManualIdInput] = useState("");
  const [manualSearchError, setManualSearchError] = useState<string | null>(null);
  const [manualSearching, setManualSearching] = useState(false);

  // Standalone Visitor State
  const [visitorName, setVisitorName] = useState("");
  const [visitorCompany, setVisitorCompany] = useState("");
  const [visitorPhone, setVisitorPhone] = useState("");
  const [visitorBilling, setVisitorBilling] = useState<"sponsored" | "self_mpesa" | "self_cash">("sponsored");
  const [visitorHostDept, setVisitorHostDept] = useState("HR-03");

  // On-Kiosk Quick Enrollment State
  const [enrollPayrollId, setEnrollPayrollId] = useState("");
  const [enrollStaffName, setEnrollStaffName] = useState("");
  const [enrollStepIdx, setEnrollStepIdx] = useState(0);
  const [enrollCapturedVectors, setEnrollCapturedVectors] = useState<number[][]>([]);
  const [enrollingOnKiosk, setEnrollingOnKiosk] = useState(false);
  const [enrollSuccessModal, setEnrollSuccessModal] = useState(false);
  const [enrollError, setEnrollError] = useState<string | null>(null);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [countdown, setCountdown] = useState(6);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [mounted, setMounted] = useState(false);

  // Enrolled Face Vectors Cache
  const [enrolledStaff, setEnrolledStaff] = useState<EnrolledStaffDescriptor[]>([]);
  const [matchedCandidate, setMatchedCandidate] = useState<EnrolledStaffDescriptor | null>(null);
  const [matchConfidence, setMatchConfidence] = useState<number>(0);
  const [scanStatusMessage, setScanStatusMessage] = useState<string>("Align face in camera reticle…");
  const [scanFailed, setScanFailed] = useState(false);
  const [unrecognizedFaceCount, setUnrecognizedFaceCount] = useState<number>(0);
  const [alreadyServedMessage, setAlreadyServedMessage] = useState<string | null>(null);

  // Camera & Video Refs
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const scanIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Verified transaction result
  const [lastOrder, setLastOrder] = useState<{
    orderId: string;
    employeeName: string;
    employeeId: string;
    department: string;
    employer: string;
    mealSummary: string;
    guestSummary?: string;
    paymentLabel: string;
    subsidyAmount: string;
    employeeDeduction: string;
    amountPaid: string;
    timestamp: string;
    token: string;
  } | null>(null);

  // Clock
  useEffect(() => {
    setMounted(true);
    const t = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // Preload Enrolled Staff Descriptors from Frappe API + Local Storage
  const loadDescriptors = async () => {
    const combinedMap: Record<string, EnrolledStaffDescriptor> = {};

    // 1. Local storage edge cache
    const localStaff = getLocalEnrolledStaff();
    localStaff.forEach((s) => {
      if (s.face_descriptor && parseDescriptor(s.face_descriptor)) {
        const id = s.employee_payroll_id || s.name;
        combinedMap[id] = s;
      }
    });

    // 2. Frappe API
    try {
      const res = await fetch("/api/method/crown_canteen.api.get_face_descriptors", {
        credentials: "include",
      });

      if (res.ok) {
        const json = await res.json();
        const list = json.message || json.data || [];
        if (Array.isArray(list)) {
          list.forEach((s) => {
            if (s.face_descriptor && parseDescriptor(s.face_descriptor)) {
              const id = s.employee_payroll_id || s.name;
              combinedMap[id] = s;
              saveEnrolledFaceLocally(s);
            }
          });
        }
      }
    } catch {}

    const list = Object.values(combinedMap);
    setEnrolledStaff(list);
  };

  useEffect(() => {
    loadFaceApiModels();
    loadDescriptors();
  }, []);

  const toggleFullscreen = () => {
    if (typeof document === "undefined") return;
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const departmentsList = [
    { code: "PROD-01", name: "Production & Plant Operations", budget: "Approved Budget" },
    { code: "SCM-02", name: "Supply Chain & Logistics", budget: "Approved Budget" },
    { code: "HR-03", name: "Human Resources & Administration", budget: "Approved Budget" },
    { code: "FIN-04", name: "Finance, Accounts & Audit", budget: "Approved Budget" },
    { code: "SALES-05", name: "Commercial & Executive Sales", budget: "Approved Budget" },
    { code: "QA-06", name: "Quality Assurance & Color Lab", budget: "Approved Budget" },
    { code: "ICT-07", name: "Information Technology & Digital", budget: "Approved Budget" },
  ];

  const getDeptLabel = (code: string) => {
    const d = departmentsList.find((item) => item.code === code);
    return d ? `${d.code} · ${d.name}` : code;
  };

  // Price calculations
  const specialSurcharge = 100;
  const standardEmployeeDeduction = 50;
  const guestNormalPrice = 180;
  const guestSpecialPrice = 280;

  const calculateTotal = () => {
    let total = 0;
    if (mealType === "Special") total += specialSurcharge;
    if (hasGuest) {
      if (guestSponsor !== "department_hr") {
        const guestUnitPrice = guestMealType === "Special" ? guestSpecialPrice : guestNormalPrice;
        total += guestUnitPrice * guestCount;
      }
    }
    return total;
  };

  const totalAmount = calculateTotal();

  const resetKiosk = () => {
    stopScanningCamera();
    setStep("idle");
    setMealType("Normal");
    setHasGuest(false);
    setGuestCount(1);
    setGuestMealType("Normal");
    setGuestSponsor("employee_payroll");
    setPaymentMethod("payroll");
    setManualIdInput("");
    setManualSearchError(null);
    setScanFailed(false);
    setUnrecognizedFaceCount(0);
    setMatchedCandidate(null);
    setAlreadyServedMessage(null);
    setVisitorName("");
    setVisitorCompany("");
    setVisitorPhone("");
    setEnrollingOnKiosk(false);
  };

  const handleStart = () => {
    if (soundEnabled) playBiometricSound("click");
    setStep("meal_selection");
  };

  const handleMealSelect = (selected: MealOption) => {
    if (soundEnabled) playBiometricSound("click");
    setMealType(selected);
    setStep("guest_check");
  };

  const handleGuestCheck = (hasGuestsSelected: boolean) => {
    if (soundEnabled) playBiometricSound("click");
    setHasGuest(hasGuestsSelected);
    if (hasGuestsSelected) {
      setStep("guest_config");
    } else {
      if (mealType === "Special") {
        setStep("payment_method");
      } else {
        setPaymentMethod("payroll");
        startScanningCamera();
        setStep("scanning");
      }
    }
  };

  const handleGuestConfigured = () => {
    if (soundEnabled) playBiometricSound("click");
    if (guestSponsor === "department_hr" && mealType === "Normal") {
      setPaymentMethod("corporate");
      startScanningCamera();
      setStep("scanning");
    } else {
      setStep("payment_method");
    }
  };

  const handlePaymentChosen = (method: PaymentMethod) => {
    if (soundEnabled) playBiometricSound("click");
    setPaymentMethod(method);
    if (method === "mpesa") {
      setStep("mpesa_prompt");
    } else {
      startScanningCamera();
      setStep("scanning");
    }
  };

  // ── Camera Scanner Lifecycle ────────────────────────────────────────────
  const startScanningCamera = async () => {
    setScanFailed(false);
    setUnrecognizedFaceCount(0);
    setMatchedCandidate(null);
    setAlreadyServedMessage(null);
    setScanStatusMessage("Align face in camera reticle…");

    try {
      await loadFaceApiModels();
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: "user" },
      });
      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch {
      setScanStatusMessage("Webcam access required for facial biometric recognition.");
    }
  };

  const stopScanningCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      mediaStreamRef.current = null;
    }
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }
  };

  // ── Real-Time Facial Biometric Recognition Loop (FaceNet 128-D) ──────────
  useEffect(() => {
    if (step === "scanning") {
      let isCompleted = false;
      let consecutiveUnknowns = 0;

      scanIntervalRef.current = setInterval(async () => {
        if (isCompleted || !videoRef.current || !canvasRef.current) return;
        const video = videoRef.current;
        const canvas = canvasRef.current;

        if (video.videoWidth > 0 && video.videoHeight > 0) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          const ctx = canvas.getContext("2d");

          if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const analysis = await analyzeFaceFromElement(video);

            if (analysis) {
              const { box, descriptor, landmarks2D, qualityScore } = analysis;
              const mirroredX = canvas.width - box.x - box.width;

              // Check match against enrolled staff
              if (enrolledStaff.length > 0) {
                const match = matchFaceVector(descriptor, enrolledStaff, 0.50);

                if (match.matched && match.customer) {
                  // Recognized Enrolled Staff!
                  ctx.strokeStyle = "#10b981";
                  ctx.lineWidth = 3;
                  ctx.strokeRect(mirroredX, box.y, box.width, box.height);

                  // Glowing Corner Accents
                  const len = 18;
                  ctx.strokeStyle = "#34d399";
                  ctx.lineWidth = 4;
                  ctx.beginPath();
                  ctx.moveTo(mirroredX, box.y + len); ctx.lineTo(mirroredX, box.y); ctx.lineTo(mirroredX + len, box.y);
                  ctx.moveTo(mirroredX + box.width - len, box.y); ctx.lineTo(mirroredX + box.width, box.y); ctx.lineTo(mirroredX + box.width, box.y + len);
                  ctx.moveTo(mirroredX, box.y + box.height - len); ctx.lineTo(mirroredX, box.y + box.height); ctx.lineTo(mirroredX + len, box.y + box.height);
                  ctx.moveTo(mirroredX + box.width - len, box.y + box.height); ctx.lineTo(mirroredX + box.width, box.y + box.height); ctx.lineTo(mirroredX + box.width, box.y + box.height - len);
                  ctx.stroke();

                  // Label
                  ctx.fillStyle = "rgba(6, 78, 59, 0.95)";
                  ctx.fillRect(mirroredX, box.y - 28, 200, 24);
                  ctx.fillStyle = "#a7f3d0";
                  ctx.font = "bold 12px monospace";
                  ctx.fillText(`VERIFIED ${match.confidence}% · ${match.customer.customer_name.slice(0, 14)}`, mirroredX + 8, box.y - 12);

                  isCompleted = true;
                  if (scanIntervalRef.current) clearInterval(scanIntervalRef.current);
                  setMatchedCandidate(match.customer);
                  setMatchConfidence(match.confidence);
                  if (soundEnabled) playBiometricSound("lock");
                  setScanStatusMessage(`Face Verified: ${match.customer.customer_name} (${match.confidence}%)`);

                  setTimeout(() => {
                    completeOrder(match.customer!);
                  }, 400);
                  return;
                } else {
                  // UNREGISTERED FACE DETECTED
                  consecutiveUnknowns++;
                  setUnrecognizedFaceCount(consecutiveUnknowns);

                  // Draw Amber/Crimson Warning Reticle
                  ctx.strokeStyle = "#ef4444";
                  ctx.lineWidth = 2.5;
                  ctx.strokeRect(mirroredX, box.y, box.width, box.height);

                  const len = 14;
                  ctx.strokeStyle = "#f87171";
                  ctx.lineWidth = 3.5;
                  ctx.beginPath();
                  ctx.moveTo(mirroredX, box.y + len); ctx.lineTo(mirroredX, box.y); ctx.lineTo(mirroredX + len, box.y);
                  ctx.moveTo(mirroredX + box.width - len, box.y); ctx.lineTo(mirroredX + box.width, box.y); ctx.lineTo(mirroredX + box.width, box.y + len);
                  ctx.moveTo(mirroredX, box.y + box.height - len); ctx.lineTo(mirroredX, box.y + box.height); ctx.lineTo(mirroredX + len, box.y + box.height);
                  ctx.moveTo(mirroredX + box.width - len, box.y + box.height); ctx.lineTo(mirroredX + box.width, box.y + box.height); ctx.lineTo(mirroredX + box.width, box.y + box.height - len);
                  ctx.stroke();

                  ctx.fillStyle = "rgba(127, 29, 29, 0.95)";
                  ctx.fillRect(mirroredX, box.y - 26, 170, 22);
                  ctx.fillStyle = "#fecaca";
                  ctx.font = "bold 11px monospace";
                  ctx.fillText("UNREGISTERED FACE", mirroredX + 8, box.y - 10);

                  setScanStatusMessage("Unrecognized biometric template. No registered customer account.");

                  if (consecutiveUnknowns >= 10 && !isCompleted) {
                    isCompleted = true;
                    if (scanIntervalRef.current) clearInterval(scanIntervalRef.current);
                    if (soundEnabled) playBiometricSound("alert");
                    stopScanningCamera();
                    setStep("unregistered_alert");
                    return;
                  }
                }
              } else {
                setScanStatusMessage("No enrolled staff templates loaded. Please configure Canteen Customers.");
              }
            } else {
              setScanStatusMessage("Position your face directly in the camera reticle…");
            }
          }
        }
      }, 200);

      return () => {
        if (scanIntervalRef.current) clearInterval(scanIntervalRef.current);
      };
    }
  }, [step, enrolledStaff, soundEnabled]);

  // ── Manual Payroll ID Verification ───────────────────────────────────────
  const handleManualIdSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = manualIdInput.trim();
    if (!query) {
      setManualSearchError("Please enter your Employee Payroll ID.");
      return;
    }
    setManualSearchError(null);
    setManualSearching(true);

    // 1. Check local enrolled array
    const matched = enrolledStaff.find(
      (s) =>
        s.employee_payroll_id?.toLowerCase() === query.toLowerCase() ||
        s.name?.toLowerCase() === query.toLowerCase()
    );

    if (matched) {
      setManualSearching(false);
      completeOrder(matched);
      return;
    }

    // 2. Fetch live Frappe record by employee_payroll_id filter
    try {
      const fRes = await fetch(
        `/api/resource/Canteen%20Customer?filters=[["employee_payroll_id","=","${encodeURIComponent(
          query
        )}"]]&fields=["name","customer_name","employee_payroll_id","employer","department","customer_status"]`,
        { credentials: "include" }
      );
      if (fRes.ok) {
        const fJson = await fRes.json();
        if (fJson.data && fJson.data.length > 0) {
          const cust = fJson.data[0];
          setManualSearching(false);
          completeOrder({
            name: cust.name,
            customer_name: cust.customer_name,
            employee_payroll_id: cust.employee_payroll_id || cust.name,
            employer: cust.employer || "Crown Paints Kenya PLC",
            department: cust.department || "Production Plant",
          });
          return;
        }
      }
    } catch {}

    setManualSearching(false);
    if (soundEnabled) playBiometricSound("alert");
    setManualSearchError(`Payroll ID "${query}" not found in Canteen database. Please register at the HR Admin Desk.`);
  };

  // ── Standalone Visitor Checkout ──────────────────────────────────────────
  const handleVisitorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitorName.trim()) return;

    if (soundEnabled) playBiometricSound("lock");
    const randId = Math.floor(100000 + Math.random() * 900000);
    const orderCode = `TXN-VIS-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${randId}`;
    const selectedMealName = mealType === "Special" ? "Special Lunch" : "Normal Lunch";
    const isSponsored = visitorBilling === "sponsored";

    try {
      fetch("/api/method/crown_canteen.api.log_kiosk_meal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          customer_id: "VIS-GENERIC",
          meal_type_name: selectedMealName,
          canteen_branch: "Nairobi HQ Canteen",
          payment_method: isSponsored ? "Payroll Deduct" : "On Spot",
          guest_count: 1,
          is_guest: 1,
          guest_name: `${visitorName.trim()} (${visitorCompany.trim() || "Independent"})`,
          guest_dept: isSponsored ? visitorHostDept : null,
        }),
      }).catch(() => {});
    } catch {}

    setStep("success");
    setLastOrder({
      orderId: orderCode,
      employeeName: visitorName.trim(),
      employeeId: visitorCompany.trim() || "External Visitor",
      department: isSponsored ? getDeptLabel(visitorHostDept) : "Self-Sponsored",
      employer: visitorCompany.trim() || "Visiting Guest",
      mealSummary: `${mealType} Lunch (Visitor / Guest)`,
      paymentLabel: isSponsored
        ? `Billed to ${getDeptLabel(visitorHostDept)} Budget`
        : visitorBilling === "self_mpesa"
        ? "Paid via M-PESA Express"
        : "Cash Collected at Counter",
      subsidyAmount: isSponsored ? "KES 180 (Full HR Subsidy)" : "KES 0",
      employeeDeduction: isSponsored ? "KES 0" : mealType === "Special" ? `KES ${guestSpecialPrice}` : `KES ${guestNormalPrice}`,
      amountPaid: isSponsored
        ? "Company Sponsored (KES 0)"
        : mealType === "Special"
        ? `KES ${guestSpecialPrice}`
        : `KES ${guestNormalPrice}`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
      token: `VIS-AUTH-${Math.floor(10000 + Math.random() * 90000)}`,
    });
  };

  // ── On-Kiosk Quick Multi-Pose Face Enrollment ────────────────────────────
  const startKioskQuickEnroll = async () => {
    if (!enrollPayrollId.trim()) {
      setEnrollError("Please enter your Employee Payroll ID.");
      return;
    }
    setEnrollError(null);
    setEnrollingOnKiosk(true);
    setEnrollStepIdx(0);
    setEnrollCapturedVectors([]);

    const vectors: number[][] = [];

    for (let i = 0; i < ENROLLMENT_STEPS.length; i++) {
      setEnrollStepIdx(i);
      await new Promise((r) => setTimeout(r, ENROLLMENT_STEPS[i].duration));

      if (!videoRef.current) break;
      const video = videoRef.current;

      const result = await detectFaceWithDescriptor(video);
      if (result && result.descriptor && result.descriptor.length === 128) {
        if (soundEnabled) playBiometricSound("capture");
        vectors.push(result.descriptor);
        setEnrollCapturedVectors([...vectors]);
      } else {
        await new Promise((r) => setTimeout(r, 300));
        const retry = await detectFaceWithDescriptor(video);
        if (retry && retry.descriptor) {
          if (soundEnabled) playBiometricSound("capture");
          vectors.push(retry.descriptor);
          setEnrollCapturedVectors([...vectors]);
        }
      }
    }

    if (vectors.length >= 2) {
      const centroidVector = averageVectorCentroid(vectors);
      const vectorJsonString = JSON.stringify(centroidVector);
      const targetId = enrollPayrollId.trim();
      const staffName = enrollStaffName.trim() || "Employee " + targetId;

      const profile: EnrolledStaffDescriptor = {
        name: targetId,
        customer_name: staffName,
        employee_payroll_id: targetId,
        employer: "Crown Paints Kenya PLC",
        department: "Production Plant",
        face_descriptor: centroidVector,
      };

      saveEnrolledFaceLocally(profile);

      try {
        const getUrl = `/api/method/crown_canteen.api.enroll_customer_face?customer_id=${encodeURIComponent(
          targetId
        )}&face_descriptor=${encodeURIComponent(vectorJsonString)}`;
        await fetch(getUrl, { method: "GET", credentials: "include" });
      } catch {}

      await loadDescriptors();
      if (soundEnabled) playBiometricSound("success");
      setEnrollSuccessModal(true);
      setEnrollingOnKiosk(false);

      setTimeout(() => {
        setEnrollSuccessModal(false);
        completeOrder(profile);
      }, 1200);
    } else {
      if (soundEnabled) playBiometricSound("alert");
      setEnrollError("Could not detect face cleanly. Please face camera directly and ensure good lighting.");
      setEnrollingOnKiosk(false);
    }
  };

  // ── Complete Meal Order & Invoke Frappe Backend ───────────────────────────
  const completeOrder = async (identifiedCustomer: EnrolledStaffDescriptor) => {
    stopScanningCamera();

    const randId = Math.floor(100000 + Math.random() * 900000);
    const defaultOrderCode = `TXN-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${randId}`;
    const selectedMealName = mealType === "Special" ? "Special Lunch" : "Normal Lunch";
    const targetId = identifiedCustomer.name || identifiedCustomer.employee_payroll_id;

    let transactionCode = defaultOrderCode;
    let serverTimestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });

    try {
      const res = await fetch("/api/method/crown_canteen.api.log_kiosk_meal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          customer_id: targetId,
          meal_type_name: selectedMealName,
          canteen_branch: "Nairobi HQ Canteen",
          payment_method: paymentMethod === "payroll" ? "Payroll Deduct" : "On Spot",
          guest_count: hasGuest ? guestCount : 1,
          is_guest: hasGuest ? 1 : 0,
          guest_dept: hasGuest && guestSponsor === "department_hr" ? guestDept : null,
        }),
      });

      const json = await res.json().catch(() => ({}));

      if (res.ok && json.message?.status === "success") {
        if (json.message.transaction_id) transactionCode = json.message.transaction_id;
        if (json.message.timestamp) serverTimestamp = json.message.timestamp;
      } else if (json.message?.status === "already_served") {
        // Employee has already taken lunch today!
        if (soundEnabled) playBiometricSound("alert");
        setAlreadyServedMessage(json.message.message || `${identifiedCustomer.customer_name} has already taken subsidized lunch today.`);
        setStep("already_served_alert");
        return;
      }
    } catch (e) {
      console.error("Meal transaction logging error:", e);
    }

    if (soundEnabled) playBiometricSound("success");
    setStep("success");
    setLastOrder({
      orderId: transactionCode,
      employeeName: identifiedCustomer.customer_name || "Staff " + targetId,
      employeeId: identifiedCustomer.employee_payroll_id || identifiedCustomer.name,
      department: identifiedCustomer.department || "Production Plant",
      employer: identifiedCustomer.employer || "Crown Paints Kenya PLC",
      mealSummary: `${mealType} Lunch (Staff)`,
      guestSummary: hasGuest
        ? `${guestCount}x Guest ${guestMealType} Lunch (${
            guestSponsor === "department_hr"
              ? `Billed to ${getDeptLabel(guestDept)}`
              : "Self-Sponsored"
          })`
        : undefined,
      paymentLabel:
        paymentMethod === "payroll"
          ? "Payroll Salary Deduction"
          : paymentMethod === "mpesa"
          ? "Paid via M-PESA Express"
          : paymentMethod === "cash"
          ? "Cash Collected at Counter"
          : `Billed to ${getDeptLabel(guestDept)} Cost Center`,
      subsidyAmount: "KES 130 (HR Subsidized)",
      employeeDeduction: mealType === "Special" ? "KES 150 (KES 50 Standard + KES 100 Chef Surcharge)" : "KES 50 (Standard Payslip Deduct)",
      amountPaid: totalAmount > 0 ? `KES ${totalAmount.toLocaleString()}` : "Fully Subsidized (KES 0 on-spot)",
      timestamp: serverTimestamp,
      token: `CRWN-AUTH-${Math.floor(10000 + Math.random() * 90000)}`,
    });
  };

  // Success auto-reset countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === "success") {
      setCountdown(6);
      interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            resetKiosk();
            return 6;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none overflow-hidden relative" suppressHydrationWarning>
      {/* ── Ambient Glows ─────────────────────────────────────────────────── */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* ── Top Enterprise Header Bar ────────────────────────────────────── */}
      <header className="px-6 py-4 border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-xl flex items-center justify-between shrink-0 z-10">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-white font-black text-xl">
            C
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-black text-base text-white tracking-wide leading-none">
                CROWN CANTEEN TERMINAL
              </h1>
              <Badge className="bg-emerald-500/15 text-emerald-300 border-emerald-500/30 text-[9px] font-mono uppercase">
                AI BIOMETRIC KIOSK
              </Badge>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1 font-medium">
              <Building2 className="size-3 text-emerald-400" />
              <span>Nairobi HQ Canteen · Self-Service Express</span>
            </p>
          </div>
        </div>

        {/* Status Indicators & Controls */}
        <div className="flex items-center gap-3">
          {/* Edge Cache Status */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/60 text-xs font-mono">
            <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-300 font-bold text-[11px]">
              {enrolledStaff.length} Staff Enrolled
            </span>
          </div>

          {/* Clock */}
          <div className="px-3.5 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs font-mono font-bold text-emerald-400 shadow-inner flex items-center gap-1.5">
            <Clock className="size-3.5 text-emerald-400" />
            <span>
              {mounted
                ? currentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })
                : "12:00:00"}
            </span>
          </div>

          {/* Audio Toggle */}
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="size-9 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
          >
            {soundEnabled ? <Volume2 className="size-4 text-emerald-400" /> : <VolumeX className="size-4" />}
          </Button>

          {/* Fullscreen Toggle */}
          <Button
            size="icon"
            variant="ghost"
            onClick={toggleFullscreen}
            className="size-9 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
          >
            {isFullscreen ? <Minimize className="size-4" /> : <Maximize className="size-4" />}
          </Button>
        </div>
      </header>

      {/* ── Main Viewport Container ────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 max-w-6xl xl:max-w-7xl mx-auto w-full relative z-10 overflow-y-auto">
        {/* ── STEP 0: IDLE SCREEN ──────────────────────────────────────────── */}
        {step === "idle" && (
          <div className="space-y-8 text-center max-w-3xl mx-auto w-full animate-in fade-in zoom-in-95 duration-300">
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-mono font-bold border border-emerald-500/20">
                <Sparkles className="size-3.5" /> TOUCH SCREEN OR STAND BEFORE CAMERA
              </span>
              <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                Crown Canteen Dining
              </h2>
              <p className="text-sm text-slate-400 font-medium max-w-md mx-auto">
                Fast AI facial verification, subsidized lunch ticketing, and dining authorization.
              </p>
            </div>

            {/* Main 2-Card Selection */}
            <div className="grid sm:grid-cols-2 gap-5 pt-2">
              {/* Employee Dining */}
              <button
                onClick={handleStart}
                className="group relative p-8 rounded-3xl bg-slate-900/80 hover:bg-slate-900 border-2 border-slate-800 hover:border-emerald-500 text-left space-y-4 shadow-2xl hover:shadow-emerald-500/10 backdrop-blur-xl transition-all duration-300 cursor-pointer active:scale-98 overflow-hidden"
              >
                <div className="size-14 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                  <Utensils className="size-7" />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 block">Company Subsidized</span>
                  <h3 className="text-2xl font-black text-white leading-tight">Staff Lunch</h3>
                  <p className="text-xs text-slate-400 mt-1 font-medium">
                    Standard Subsidized or Chef's Special
                  </p>
                </div>
                <div className="pt-2 flex items-center justify-between text-xs font-mono font-bold text-emerald-400">
                  <span>Start Meal Order</span>
                  <ChevronRight className="size-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>

              {/* Visitor / Guest Dining */}
              <button
                onClick={() => setStep("visitor_flow")}
                className="group relative p-8 rounded-3xl bg-slate-900/80 hover:bg-slate-900 border-2 border-slate-800 hover:border-cyan-500 text-left space-y-4 shadow-2xl hover:shadow-cyan-500/10 backdrop-blur-xl transition-all duration-300 cursor-pointer active:scale-98 overflow-hidden"
              >
                <div className="size-14 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                  <Users className="size-7" />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400 block">External Guests</span>
                  <h3 className="text-2xl font-black text-white leading-tight">Visitor Dining</h3>
                  <p className="text-xs text-slate-400 mt-1 font-medium">
                    Corporate Department Billed or M-PESA
                  </p>
                </div>
                <div className="pt-2 flex items-center justify-between text-xs font-mono font-bold text-cyan-400">
                  <span>Visitor Checkout</span>
                  <ChevronRight className="size-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 1: MEAL SELECTION ───────────────────────────────────────── */}
        {step === "meal_selection" && (
          <div className="space-y-6 max-w-4xl mx-auto w-full animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="text-center space-y-1.5">
              <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-emerald-400">Step 1 of 3 · Serving Counter</span>
              <h2 className="text-3xl font-black text-white tracking-tight">
                Select Your Meal Option
              </h2>
              <p className="text-xs text-slate-400 font-medium">
                Choose between the Standard Subsidized Line or Chef's Premium Special.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <button
                onClick={() => handleMealSelect("Normal")}
                className="p-7 rounded-3xl bg-slate-900/80 hover:bg-slate-900 border-2 border-slate-800 hover:border-emerald-500 text-left space-y-4 transition-all duration-300 group cursor-pointer active:scale-98 backdrop-blur-xl"
              >
                <div className="size-14 rounded-2xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-black group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <Utensils className="size-7" />
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-black text-white">Standard Lunch</h3>
                    <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 font-mono text-[10px]">
                      HR Subsidized
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Ugali, Beef Stew, Rice, Lentils, Steamed Greens & Fresh Cabbage.
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-500 font-bold">Counter A</span>
                  <span className="font-black text-emerald-400 text-sm">KES 50 · Payslip Deduct</span>
                </div>
              </button>

              <button
                onClick={() => handleMealSelect("Special")}
                className="p-7 rounded-3xl bg-slate-900/80 hover:bg-slate-900 border-2 border-slate-800 hover:border-amber-500 text-left space-y-4 transition-all duration-300 group cursor-pointer active:scale-98 backdrop-blur-xl"
              >
                <div className="size-14 rounded-2xl bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center justify-center font-black group-hover:bg-amber-600 group-hover:text-white transition-colors">
                  <Sparkles className="size-7" />
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-black text-white">Chef's Special Lunch</h3>
                    <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30 font-mono text-[10px]">
                      + KES 100 Surcharge
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Chicken Biryani, Grilled Tilapia Fish, Roast Chicken & Fresh Fruit Salad.
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-500 font-bold">Counter B</span>
                  <span className="font-black text-amber-400 text-sm">KES 150 Total</span>
                </div>
              </button>
            </div>

            <div className="flex justify-center pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={resetKiosk}
                className="text-xs text-slate-400 hover:text-white font-bold cursor-pointer"
              >
                <ArrowLeft className="size-3.5 mr-1" /> Cancel & Return to Home
              </Button>
            </div>
          </div>
        )}

        {/* ── STEP 2: GUEST CHECK ──────────────────────────────────────────── */}
        {step === "guest_check" && (
          <div className="space-y-6 max-w-xl mx-auto w-full text-center animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="space-y-1.5">
              <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-emerald-400">Step 2 of 3 · Accompanied Guests</span>
              <h2 className="text-3xl font-black text-white tracking-tight">
                Are you hosting guests today?
              </h2>
              <p className="text-xs text-slate-400 font-medium">
                You selected <strong>{mealType} Lunch</strong>. Are there visitors dining with you?
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <button
                onClick={() => handleGuestCheck(false)}
                className="p-7 rounded-3xl bg-slate-900/80 hover:bg-slate-900 border-2 border-slate-800 hover:border-emerald-500 text-center space-y-3 transition-all cursor-pointer group active:scale-98 backdrop-blur-xl"
              >
                <div className="size-14 rounded-2xl bg-slate-800 group-hover:bg-emerald-500/20 group-hover:text-emerald-300 flex items-center justify-center font-black mx-auto border border-slate-700">
                  <UserCheck className="size-7 text-slate-300 group-hover:text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">No, Just Me</h3>
                  <p className="text-xs text-slate-400 mt-1 font-medium">Proceed to Face Biometrics</p>
                </div>
              </button>

              <button
                onClick={() => handleGuestCheck(true)}
                className="p-7 rounded-3xl bg-slate-900/80 hover:bg-slate-900 border-2 border-slate-800 hover:border-cyan-500 text-center space-y-3 transition-all cursor-pointer group active:scale-98 backdrop-blur-xl"
              >
                <div className="size-14 rounded-2xl bg-slate-800 group-hover:bg-cyan-500/20 group-hover:text-cyan-300 flex items-center justify-center font-black mx-auto border border-slate-700">
                  <Users className="size-7 text-slate-300 group-hover:text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">Yes, Adding Guests</h3>
                  <p className="text-xs text-slate-400 mt-1 font-medium">Configure visitor count & sponsor</p>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 3: SCANNING (REAL-TIME FACE AI) ─────────────────────────── */}
        {step === "scanning" && (
          <div className="space-y-5 max-w-xl mx-auto w-full text-center animate-in fade-in zoom-in-95 duration-300">
            <div className="space-y-1.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 text-emerald-300 text-[11px] font-mono font-bold border border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                <Scan className="size-3.5 text-emerald-400 animate-pulse" /> AI FACENET SCANNER ACTIVE
              </span>
              <h2 className="text-3xl font-black text-white tracking-tight">
                Look into the Camera
              </h2>
              <p className="text-xs font-mono font-bold text-emerald-400">
                {scanStatusMessage}
              </p>
            </div>

            {/* Viewfinder Box */}
            <div className="bg-slate-950 p-2 rounded-3xl border-2 border-emerald-500/80 shadow-[0_0_50px_rgba(16,185,129,0.25)] relative overflow-hidden aspect-4/3 flex items-center justify-center">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover scale-x-[-1] rounded-2xl"
              />
              <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full pointer-events-none rounded-2xl"
              />

              {/* Cyber Reticle Target Corners */}
              <div className="absolute inset-4 pointer-events-none">
                <div className="absolute top-0 left-0 size-6 border-t-2 border-l-2 border-emerald-400" />
                <div className="absolute top-0 right-0 size-6 border-t-2 border-r-2 border-emerald-400" />
                <div className="absolute bottom-0 left-0 size-6 border-b-2 border-l-2 border-emerald-400" />
                <div className="absolute bottom-0 right-0 size-6 border-b-2 border-r-2 border-emerald-400" />
              </div>

              {/* Verified Lock-on Overlay */}
              {matchedCandidate && (
                <div className="absolute bottom-4 inset-x-4 bg-emerald-950/95 backdrop-blur-xl p-3.5 rounded-2xl border border-emerald-400 text-white flex items-center justify-between shadow-2xl animate-in zoom-in-95 z-20">
                  <div className="flex items-center gap-3 text-left">
                    <div className="size-10 rounded-xl bg-emerald-400 text-slate-950 flex items-center justify-center font-black">
                      <BadgeCheck className="size-6" />
                    </div>
                    <div>
                      <p className="text-sm font-black leading-none">{matchedCandidate.customer_name}</p>
                      <p className="text-[11px] font-mono text-emerald-200 mt-1">
                        ID: {matchedCandidate.employee_payroll_id || matchedCandidate.name} · {matchConfidence}% MATCH
                      </p>
                    </div>
                  </div>
                  <Badge className="bg-emerald-400 text-slate-950 font-black font-mono text-[10px]">
                    VERIFIED
                  </Badge>
                </div>
              )}
            </div>

            {/* Fallback Buttons */}
            <div className="flex items-center justify-center gap-3 pt-2 flex-wrap">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  stopScanningCamera();
                  setStep("manual_id");
                }}
                className="text-xs font-mono font-bold h-10 border-slate-700 bg-slate-900/80 text-slate-200 hover:bg-slate-800 rounded-xl cursor-pointer"
              >
                <Fingerprint className="size-3.5 mr-1.5 text-emerald-400" />
                <span>Enter Payroll ID</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  stopScanningCamera();
                  setStep("quick_enroll");
                }}
                className="text-xs font-mono font-bold h-10 bg-emerald-950/60 border-emerald-500/50 text-emerald-300 hover:bg-emerald-900/60 rounded-xl cursor-pointer"
              >
                <Camera className="size-3.5 mr-1.5 text-emerald-400" />
                <span>Quick Face Registration</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={resetKiosk}
                className="text-xs text-slate-400 hover:text-white font-bold cursor-pointer"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* ── UNREGISTERED FACE ALERT SCREEN ───────────────────────────────── */}
        {step === "unregistered_alert" && (
          <div className="space-y-6 max-w-md mx-auto w-full text-center animate-in fade-in zoom-in-95 duration-300">
            <div className="size-20 rounded-3xl bg-rose-500/15 border-2 border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto shadow-2xl shadow-rose-500/20">
              <ShieldAlert className="size-10" />
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-rose-400">
                BIOMETRIC AUTHENTICATION FAILED
              </span>
              <h2 className="text-2xl font-black text-white">
                Unregistered Face Detected
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                No matching employee profile was found for this facial scan in the canteen database.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-left space-y-2 text-xs">
              <p className="font-bold text-slate-300 flex items-center gap-1.5">
                <HelpCircle className="size-4 text-amber-400" /> What should I do?
              </p>
              <ul className="text-slate-400 space-y-1 text-[11px] list-disc list-inside">
                <li>If you are an enrolled employee, try entering your <strong>Payroll ID</strong>.</li>
                <li>Or perform a <strong>Quick Face Registration</strong> on this kiosk.</li>
                <li>If new, visit the HR Admin Desk for Canteen Customer onboarding.</li>
              </ul>
            </div>

            <div className="flex flex-col gap-2.5 pt-1">
              <Button
                onClick={() => {
                  setStep("manual_id");
                }}
                className="h-11 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-xs rounded-xl shadow-lg cursor-pointer"
              >
                <Fingerprint className="size-4 mr-1.5" />
                <span>Enter Employee Payroll ID Manually</span>
              </Button>

              <Button
                variant="outline"
                onClick={() => {
                  setStep("quick_enroll");
                }}
                className="h-11 border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800 font-bold text-xs rounded-xl cursor-pointer"
              >
                <Camera className="size-4 mr-1.5 text-emerald-400" />
                <span>Register Face Template on Tablet</span>
              </Button>

              <Button
                variant="ghost"
                onClick={resetKiosk}
                className="text-xs text-slate-400 hover:text-white"
              >
                Cancel & Return Home
              </Button>
            </div>
          </div>
        )}

        {/* ── ALREADY SERVED TODAY ALERT ───────────────────────────────────── */}
        {step === "already_served_alert" && (
          <div className="space-y-6 max-w-md mx-auto w-full text-center animate-in fade-in zoom-in-95 duration-300">
            <div className="size-20 rounded-3xl bg-amber-500/15 border-2 border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto shadow-2xl shadow-amber-500/20">
              <AlertTriangle className="size-10" />
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-amber-400">
                DAILY LIMIT REACHED
              </span>
              <h2 className="text-2xl font-black text-white">
                Lunch Already Claimed Today
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                {alreadyServedMessage || "This employee has already taken subsidized lunch for today. Duplicate meal claims are restricted by Canteen Policy."}
              </p>
            </div>

            <div className="flex flex-col gap-2.5 pt-2">
              <Button
                onClick={resetKiosk}
                className="h-11 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-xs rounded-xl shadow-lg cursor-pointer"
              >
                <span>Understood · Done</span>
              </Button>
            </div>
          </div>
        )}

        {/* ── STEP 6: MANUAL ID ENTRY ──────────────────────────────────────── */}
        {step === "manual_id" && (
          <div className="space-y-6 max-w-md mx-auto w-full text-center animate-in fade-in zoom-in-95 duration-300">
            <div className="space-y-1.5">
              <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-emerald-400">Manual ID Verification</span>
              <h2 className="text-3xl font-black text-white tracking-tight">
                Enter Your Payroll ID
              </h2>
              <p className="text-xs text-slate-400">
                Type your Employee Payroll ID number.
              </p>
            </div>

            <form onSubmit={handleManualIdSubmit} className="bg-slate-900/80 border border-slate-800 p-7 rounded-3xl shadow-2xl space-y-5 text-left backdrop-blur-xl">
              <div className="space-y-2">
                <label className="text-xs font-mono font-bold text-slate-300 block uppercase">
                  Employee Payroll ID
                </label>
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="e.g. 01711 or CP-8842"
                    value={manualIdInput}
                    onChange={(e) => setManualIdInput(e.target.value)}
                    autoFocus
                    className="h-12 text-base font-mono font-bold pl-10 rounded-2xl bg-slate-950/80 border-slate-700 text-white placeholder:text-slate-600 focus-visible:border-emerald-500"
                  />
                  <Fingerprint className="size-5 text-emerald-400 absolute left-3 top-3.5" />
                </div>
                {manualSearchError && (
                  <p className="text-xs font-bold text-rose-400 flex items-center gap-1 mt-1">
                    <AlertTriangle className="size-3.5 shrink-0" />
                    <span>{manualSearchError}</span>
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetKiosk}
                  className="flex-1 h-11 border-slate-700 bg-slate-900 text-slate-300 rounded-xl font-bold text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={manualSearching}
                  className="flex-1 h-11 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-xs rounded-xl shadow-lg cursor-pointer"
                >
                  {manualSearching ? "Verifying…" : "Verify ID"}
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* ── STEP 7: ON-KIOSK QUICK ENROLLMENT ────────────────────────────── */}
        {step === "quick_enroll" && (
          <div className="space-y-5 max-w-lg mx-auto w-full text-center animate-in fade-in zoom-in-95 duration-300">
            <div className="space-y-1">
              <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-emerald-400">
                Self-Service Face Registration
              </span>
              <h2 className="text-2xl font-black text-white">
                Register Your Face Biometrics
              </h2>
              <p className="text-xs text-slate-400">
                Capture 5 facial poses to enable 1-second touchless dining.
              </p>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-3xl space-y-4 text-left">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold text-slate-400 uppercase">Payroll ID *</label>
                  <Input
                    placeholder="e.g. 01711"
                    value={enrollPayrollId}
                    onChange={(e) => setEnrollPayrollId(e.target.value)}
                    disabled={enrollingOnKiosk}
                    className="h-10 text-xs font-mono font-bold bg-slate-950 border-slate-700 text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold text-slate-400 uppercase">Full Name</label>
                  <Input
                    placeholder="e.g. John Doe"
                    value={enrollStaffName}
                    onChange={(e) => setEnrollStaffName(e.target.value)}
                    disabled={enrollingOnKiosk}
                    className="h-10 text-xs font-bold bg-slate-950 border-slate-700 text-white"
                  />
                </div>
              </div>

              {enrollError && (
                <p className="text-xs font-bold text-rose-400 flex items-center gap-1">
                  <AlertTriangle className="size-3.5 shrink-0" />
                  <span>{enrollError}</span>
                </p>
              )}

              {/* Mini Camera Feed */}
              <div className="relative rounded-2xl overflow-hidden bg-slate-950 aspect-4/3 flex items-center justify-center border border-slate-800">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover scale-x-[-1]"
                />
                {enrollingOnKiosk && (
                  <div className="absolute top-3 inset-x-3 bg-slate-900/90 py-2 px-3 rounded-xl border border-emerald-500/50 text-white text-center">
                    <p className="text-xs font-bold text-emerald-400">
                      {ENROLLMENT_STEPS[enrollStepIdx]?.prompt}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3 pt-1">
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetKiosk}
                  disabled={enrollingOnKiosk}
                  className="flex-1 h-10 border-slate-700 bg-slate-900 text-slate-300 rounded-xl font-bold text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    startScanningCamera();
                    startKioskQuickEnroll();
                  }}
                  disabled={enrollingOnKiosk || !enrollPayrollId.trim()}
                  className="flex-1 h-10 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-xs rounded-xl shadow-lg cursor-pointer"
                >
                  {enrollingOnKiosk ? `Pose ${enrollStepIdx + 1}/5…` : "Start Face Capture"}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 8: SUCCESS / AUTHORIZATION TICKET ───────────────────────── */}
        {step === "success" && lastOrder && (
          <div className="space-y-6 max-w-md mx-auto w-full text-center animate-in fade-in zoom-in-95 duration-300">
            {/* Success Check Badge */}
            <div className="size-16 rounded-3xl bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto shadow-2xl shadow-emerald-500/30">
              <CheckCircle2 className="size-9" />
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-emerald-400">
                TRANSACTION AUTHORIZED & SUBMITTED
              </span>
              <h2 className="text-3xl font-black text-white">
                Enjoy Your Meal!
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Order Reference: <strong className="text-emerald-400">{lastOrder.orderId}</strong>
              </p>
            </div>

            {/* Digital Thermal Dining Slip */}
            <div className="bg-white text-slate-900 p-6 rounded-3xl shadow-2xl text-left space-y-4 relative overflow-hidden">
              <div className="flex items-start justify-between border-b border-slate-200 pb-3">
                <div>
                  <h3 className="font-black text-lg text-slate-900 leading-none">
                    {lastOrder.employeeName}
                  </h3>
                  <p className="text-xs font-mono font-bold text-emerald-700 mt-1">
                    Payroll ID: {lastOrder.employeeId}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {lastOrder.department}
                  </p>
                </div>
                <div className="size-12 rounded-xl bg-slate-100 p-1 border border-slate-200 flex items-center justify-center shrink-0">
                  <QRCodeSVG value={lastOrder.token} size={42} />
                </div>
              </div>

              {/* Itemized Breakdown */}
              <div className="space-y-2 text-xs">
                <div className="flex justify-between font-bold">
                  <span className="text-slate-600">Selected Meal:</span>
                  <span className="text-slate-900">{lastOrder.mealSummary}</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span className="text-slate-600">HR Subsidy:</span>
                  <span className="text-emerald-600">{lastOrder.subsidyAmount}</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span className="text-slate-600">Employee Deduction:</span>
                  <span className="text-slate-900">{lastOrder.employeeDeduction}</span>
                </div>
                <div className="flex justify-between font-bold pt-2 border-t border-slate-200">
                  <span className="text-slate-900 font-black">Settlement:</span>
                  <span className="text-emerald-700 font-black">{lastOrder.paymentLabel}</span>
                </div>
              </div>

              {/* Slip Footer */}
              <div className="pt-3 border-t border-dashed border-slate-200 flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span>{lastOrder.timestamp}</span>
                <span className="font-bold text-slate-600">TOKEN: {lastOrder.token}</span>
              </div>
            </div>

            {/* Auto-Reset Countdown */}
            <div className="flex items-center justify-between gap-3 pt-1">
              <Button
                onClick={resetKiosk}
                className="w-full h-11 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-xs rounded-xl shadow-lg cursor-pointer"
              >
                <span>Next Dining Customer ({countdown}s)</span>
                <ChevronRight className="size-4 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
